import { UpdateCommand } from './update-command';
import { GitClient } from '../../shared/git-client';
import { YamlStringBuilder } from '../../shared/yaml-string-builder';
import { UpdateParamsBuilder } from './update-params-builder';
import { UpdateArgs } from './update-args';

describe('update command', () => {
  describe('when updating yaml file', () => {
    const gitClient = mockGitClient({
      getFile: jest.fn(() => ({
        data: `
          foo: test
        `,
        sha: 'testSha'
      })),
      putFile: jest.fn(() => "test.url"),
      createPullRequest: jest.fn(() => "pr.url")
    })
    const expectedFile = 
`foo: yo
bar: yo2
`
    const args = makeArgs()

    beforeEach(() => {
      jest.clearAllMocks()
    })

    it('should set values at paths in yaml file', async () => {
      await new UpdateCommand(gitClient, new YamlStringBuilder(), new UpdateParamsBuilder({} as any)).action(args)

      expect(gitClient.putFile).toHaveBeenCalledWith(expectedFile, args.repo, args.org, args.sourceBranch, args.outputBranch, args.outputPath, args.message, 'testSha')
    })
    describe('when not creating a pr', () => {
      it('should return yaml file url', async () => {
        const result = await new UpdateCommand(gitClient, new YamlStringBuilder(), new UpdateParamsBuilder({} as any)).action(makeArgs({ pr: false }))
        expect(gitClient.createPullRequest).toHaveBeenCalledTimes(0)
        expect(result).toBe("test.url")
      })
    })
    describe('when a pr should be created', () => {
      it('should return pr url', async () => {
        const result = await new UpdateCommand(gitClient, new YamlStringBuilder(), new UpdateParamsBuilder({} as any)).action(args)
        
        expect(result).toBe("pr.url")
      })
    })
  })
})

function mockGitClient(methods? : any) {
  const Mock = jest.fn<GitClient>(() => methods);
  return new Mock();
}

function makeArgs({
  path = 'path',
  org = 'org',
  repo = 'repo',
  outputPath = 'outputPath',
  sourceBranch = 'sourceBranch',
  outputBranch = 'outputBranch',
  message = 'mesage',
  set = ['[foo]=yo', '[bar]=yo2'],
  pr = true
} = {}): UpdateArgs {
  return {
    sourcePath: path,
    message,
    repo,
    org,
    outputBranch,
    outputPath,
    sourceBranch,
    set,
    pr
  }
}