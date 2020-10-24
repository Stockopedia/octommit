import { Octokit } from '@octokit/rest';
import { GitClient } from './git-client';

describe('git client', () => {
  const testFile = `
    some: yaml
    file: here
  `
  const testRepoName = 'some-repo';
  const pathToFile = 'path/to/file.yaml';
  const testOrgName = 'some_org';
  const testTargetBranch = 'main';
  const testOutputBranch = 'main';
  const testMessage = 'test message';

  describe('the get file method', () => {
    const octokit = mockOctokit({
      repos: {
        getContent: jest.fn(() => ({
          data: {
            content: Buffer.from(testFile).toString('base64')
          }
        }))
      }
    })
    const client = new GitClient(octokit)

    it('should get a file from github', async () => {
      const result = await client.getFile(pathToFile, testRepoName, testOrgName);

      expect(octokit.repos.getContent).toHaveBeenCalledWith({
        owner: testOrgName,
        repo: testRepoName,
        path: pathToFile
      })
      expect(result).toEqual(testFile)
    })
  })
  describe('the putFile method', () => {
    const octokit = mockOctokit({
      git: {
        createBlob: jest.fn(() => ({
          data: {
            sha: 'blobSha'
          }
        })),
        getCommit: jest.fn(() => ({
          data: {
            sha: 'existingCommitSha',
            tree: {
              sha: 'exitingCommitTreeSha'
            }
          }
        })),
        createTree: jest.fn(() => ({
          data : {
            sha: 'newTreeSha'
          }
        })),
        createCommit: jest.fn(() => ({
          data: {
            sha: 'newCommitSha'
          }
        })),
        updateRef: jest.fn(() => ({
          data: {
            url: 'output_utl'
          }
        })),
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
      }
    })
    const client = new GitClient(octokit)

    describe('given a the same target and output branch', () => {
      beforeAll(async () => {
        await client.putFile(testFile, testRepoName, testOrgName, testTargetBranch, testOutputBranch, pathToFile, testMessage)
      })
  
      it('should use correct base branch', () => {
        expect(octokit.git.getRef).toHaveBeenCalledWith({
          owner: testOrgName,
          repo: testRepoName,
          ref: `refs/heads/${testTargetBranch}`
        })
      })
      it('should not create new branch', () => {
        expect(octokit.git.createRef).toHaveBeenCalledTimes(0)
      })
      it('should create a new commit in the target branch', () => {
        expect(octokit.git.createCommit).toHaveBeenCalledWith({
          owner: testOrgName,
          repo: testRepoName,
          message: testMessage,
          tree: 'newTreeSha',
          parents: ['existingCommitSha']
        })
      })
      it('should return url of the new blob', () => {
        expect(octokit.git.updateRef).toHaveBeenCalledWith({
          owner: testOrgName,
          repo: testRepoName,
          ref: `refs/heads/${testOutputBranch}`,
          sha: 'newCommitSha',
        })  
      })
    })
    describe('given a new target branch', () => {
      beforeAll(async () => {
        await client.putFile(testFile, testRepoName, testOrgName, testTargetBranch, 'different_output_branch', pathToFile, testMessage)
      })
      it('should create new branch', () => {
        expect(octokit.git.createRef).toHaveBeenCalledWith({
          owner: testOrgName,
          repo: testRepoName,
          ref: `refs/heads/different_output_branch`,
          sha: 'refSha'
        })
      })
      it('should create a new commit in the target branch', () => {
        expect(octokit.git.createCommit).toHaveBeenCalledWith({
          owner: testOrgName,
          repo: testRepoName,
          message: testMessage,
          tree: 'newTreeSha',
          parents: ['existingCommitSha']
        })
      })
      it('should return url of the new blob', () => {
        expect(octokit.git.updateRef).toHaveBeenCalledWith({
          owner: testOrgName,
          repo: testRepoName,
          ref: `refs/heads/${testOutputBranch}`,
          sha: 'newCommitSha',
        })  
      })
    })
  })
})

function mockOctokit(methods?: any) {
  const Mock = jest.fn<Octokit>(() => methods);
  return new Mock();
}