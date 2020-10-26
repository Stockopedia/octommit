import { Octokit } from '@octokit/rest';
import { GitClient } from './git-client';
import { EventEmitter } from 'events';
import { HandledError } from './handled-error';

describe('git client', () => {
  const testFile = `
    some: yaml
    file: here
  `
  const testRepoName = 'some-repo';
  const pathToFile = 'path/to/file.yaml';
  const testOrgName = 'some_org';
  const testsourceBranch = 'main';
  const testOutputBranch = 'main';
  const testMessage = 'test message';
  const existingFileSha = "test existing file sha"

  describe('the get file method', () => {
    const eventEmitter = new EventEmitter()

    describe('given successful api response', () => {
      const octokit = mockOctokit({
        repos: {
          getContent: jest.fn(() => ({
            data: {
              content: Buffer.from(testFile).toString('base64'),
              sha: "testSha"
            }
          }))
        }
      })
      const client = new GitClient(octokit, eventEmitter)
  
      it('should get a file from github', async () => {
        const { data, sha } = await client.getFile(pathToFile, testRepoName, testOrgName);
  
        expect(octokit.repos.getContent).toHaveBeenCalledWith({
          owner: testOrgName,
          repo: testRepoName,
          path: pathToFile
        })
        expect(data).toEqual(testFile)
        expect(sha).toEqual("testSha")
      })
    })

    describe('when api errors', () => {
      const octokit = mockOctokit({
        repos: {
          getContent: jest.fn(() => {
            throw new Error()
          })
        }
      })
      const client = new GitClient(octokit, eventEmitter)
  
      it('should get a file from github', async () => {
        await expect(client.getFile(pathToFile, testRepoName, testOrgName)).rejects.toThrowError(HandledError)
      })
    })
  })
  describe('the putFile method', () => {
    describe('given the same target and output branch', () => {
      const octokit = mockOctokit({
        git: {
          getRef: jest.fn(() => ({
            data: {
              object: {
                sha: 'refSha'
              }
            }
          })),
          createRef: jest.fn(() =>  ({
            data: {
              object: {
                sha: 'newRefSha'
              }
            }
          }))
        },
        repos: {
          createOrUpdateFileContents: jest.fn(() => ({
            url: "resulting.url"
          }))
        }
      })
      const eventEmitter = new EventEmitter()
      const client = new GitClient(octokit, eventEmitter)
      beforeAll(async () => {
        await client.putFile(testFile, testRepoName, testOrgName, testsourceBranch, testOutputBranch, pathToFile, testMessage, existingFileSha)
      })
  
      it('should not attempt to get ref', () => {
        expect(octokit.git.getRef).toHaveBeenCalledTimes(0)
      })
      it('should not create new branch', () => {
        expect(octokit.git.createRef).toHaveBeenCalledTimes(0)
      })
      it('should return url of the new blob', () => {
        expect(octokit.repos.createOrUpdateFileContents).toHaveBeenCalledWith({
          owner: testOrgName,
          message: testMessage,
          content: Buffer.from(testFile).toString('base64'),
          repo: testRepoName,
          path: pathToFile,
          branch: testOutputBranch,
          sha: existingFileSha,
        })
      })
    })
    describe('given a different target branch that already exists', () => {
      const eventEmitter = new EventEmitter()

      describe('when successfully getting branch ref', ()=> {
        const octokit = mockOctokit({
          git: {
            getRef: jest.fn(() => ({ data: {
              ref: "baseBranchRef"
            }})),
            createRef: jest.fn(() =>  ({
              data: {
                object: {
                  sha: 'newRefSha'
                }
              }
            }))
          },
          repos: {
            createOrUpdateFileContents: jest.fn(() => ({
              url: "resulting.url"
            }))
          }
        })
        const client = new GitClient(octokit, eventEmitter)
        const mockLogListener = jest.fn()
  
        beforeAll(async () => {
          eventEmitter.on('log', mockLogListener)
          await client.putFile(testFile, testRepoName, testOrgName, testsourceBranch, 'different_output_branch', pathToFile, testMessage, existingFileSha)
        })
        it('should use existing branch', () => {
          expect(octokit.git.getRef).toHaveBeenCalledTimes(1)
          expect(octokit.git.createRef).toHaveBeenCalledTimes(0)
        })
        it('should return url of the new blob', () => {
          expect(octokit.repos.createOrUpdateFileContents).toHaveBeenCalledWith({
            owner: testOrgName,
            message: testMessage,
            content: Buffer.from(testFile).toString('base64'),
            repo: testRepoName,
            path: pathToFile,
            branch: "baseBranchRef",
            sha: existingFileSha,
          })
        })
        it('should emit log message', () => {
          expect(mockLogListener).toHaveBeenCalledTimes(1)
        })
      })
      describe('when api errors', () => {
        const octokit = mockOctokit({
          git: {
            getRef: jest.fn(() =>{
              throw new Error()
            }),
          },
          repos: {
            createOrUpdateFileContents: jest.fn(() => ({
              url: "resulting.url"
            }))
          }
        })
        const eventEmitter = new EventEmitter()
        const client = new GitClient(octokit, eventEmitter)

        it('should throw handled exception', async () => {
          await expect(client.putFile(testFile, testRepoName, testOrgName, testsourceBranch, 'different_output_branch', pathToFile, testMessage, existingFileSha))
            .rejects
            .toThrowError(HandledError)
        })
      })
    })
    describe('given new branch', () => {
      const eventEmitter = new EventEmitter()

      describe('when successfully creating branch', () => {
        const octokit = mockOctokit({
          git: {
            getRef: jest.fn(({ref}) => {
              if(ref === `heads/different_output_branch`) {
                throw new Error()
              }
              else {
                return {
                  data: {
                    ref: "baseBranchRef",
                    object: {
                      sha: "baseRefSha"
                    }
                  }
                }
              }
            }),
            createRef: jest.fn(() =>  ({
              data: {
                ref: "newBranchRef"
              }
            }))
          },
          repos: {
            createOrUpdateFileContents: jest.fn(() => ({
              url: "resulting.url"
            }))
          }
        })
        const client = new GitClient(octokit, eventEmitter)
        const mockLogListener = jest.fn()
  
        beforeAll(async () => {
          eventEmitter.on('log', mockLogListener)
          await client.putFile(testFile, testRepoName, testOrgName, testsourceBranch, 'different_output_branch', pathToFile, testMessage, existingFileSha)
        })
  
        it('should create a new branch', () => {
          expect(octokit.git.getRef).toHaveBeenCalledTimes(2)
        
          expect(octokit.git.createRef).toHaveBeenCalledWith({
            owner: testOrgName,
            repo: testRepoName,
            ref: `refs/heads/different_output_branch`,
            sha: 'baseRefSha'
          })
        })
        it('should return url of the new blob', () => {
          expect(octokit.repos.createOrUpdateFileContents).toHaveBeenCalledWith({
            owner: testOrgName,
            message: testMessage,
            content: Buffer.from(testFile).toString('base64'),
            repo: testRepoName,
            path: pathToFile,
            branch: "newBranchRef",
            sha: existingFileSha,
          })
        })
        it('should emit log message', () => {
          expect(mockLogListener).toHaveBeenCalledTimes(1)
        })
      })
      describe('when unable to create a new branch', () => {
        const octokit = mockOctokit({
          git: {
            getRef: jest.fn(({ref}) => {
              if(ref === `heads/different_output_branch`) {
                throw new Error()
              }
              else {
                return {
                  data: {
                    ref: "baseBranchRef",
                    object: {
                      sha: "baseRefSha"
                    }
                  }
                }
              }
            }),
            createRef: jest.fn(() =>  {
              throw new Error();
            })
          }
        })
        const client = new GitClient(octokit, eventEmitter)

        it('should thorw handled error', async () => {
          await expect(client.putFile(testFile, testRepoName, testOrgName, testsourceBranch, 'different_output_branch', pathToFile, testMessage, existingFileSha))
            .rejects
            .toThrowError(HandledError)
        })
      })
    })
    describe('given api error throw while PUTting file', () => {
      const octokit = mockOctokit({
        git: {
          getRef: jest.fn(() => {
            return {
              data: {
                ref: "baseBranchRef",
              }
            }
          }),
        },
        repos: {
          createOrUpdateFileContents: jest.fn(() => {
            throw new Error();
          })
        }
      })
      const eventEmitter = new EventEmitter()
      const client = new GitClient(octokit, eventEmitter)

      it('should throw a handled expection', async () => {
        await expect(client.putFile(testFile, testRepoName, testOrgName, testsourceBranch, 'different_output_branch', pathToFile, testMessage, existingFileSha))
          .rejects
          .toThrowError(HandledError)
      })
    })
  })
  describe('the createPullRequest method', () => {
    const eventEmitter = new EventEmitter()

    describe('given succesfull api response', () => {
      const octokit = mockOctokit({
        pulls: {
          create: jest.fn(() => ({
            data: {
              url: "test.url"
            }
          }))
        }
      })
      const client = new GitClient(octokit, eventEmitter)
  
      it('should return pull request url', async () => {
        const result = await client.createPullRequest(testOutputBranch, testRepoName, "pr title", testsourceBranch, testOutputBranch);

        expect(result).toBe("test.url")
      })
    })
    describe('given api error', () => {
      const octokit = mockOctokit({
        pulls: () => {
          throw new Error();
        }
      })
      const client = new GitClient(octokit, eventEmitter)
      it('should throw handled error', async () => {
        await expect(client.createPullRequest(testOutputBranch, testRepoName, "pr title", testsourceBranch, testOutputBranch))
          .rejects
          .toThrowError(HandledError)
      })
    })
  })
})

function mockOctokit(methods?: any) {
  const Mock = jest.fn<Octokit>(() => methods);
  return new Mock();
}