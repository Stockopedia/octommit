import { UpdateArgs } from './update-args';
import { UpdateParamsBuilder } from './update-params-builder';
import { Config } from '../../var'

describe('update params builder', () => {
  describe('when value comes from config', () => {
    const args = new UpdateParamsBuilder(makeConfig()).build(makeArgs({ 
      path: '',
      set: '',
      outputPath: '',
      targetBranch: '',
      outputBranch: '',
      message: '',
      org: '',
      repo: ''
    }))

    args.targets.forEach(target => {
      expect(target.path).toContain('config')
      expect(target.value).toContain('config')
    })
    Object.values(args).forEach(value => {
      if(!Array.isArray(value)) {
        expect(value).toContain('config')
      }
    })
  })
  describe('when value comes from cli options', () => {
    it('cli option should take precedence', () => {
      const args = new UpdateParamsBuilder(makeConfig()).build(makeArgs())

      Object.values(args).forEach(value => {
        expect(value).not.toContain('config')
      })
    })
  })
})

function makeConfig({
  target = 'config_target',
  path = 'config_path',
  value = 'config_value',
  repo = 'config_repo',
  outputPath = 'config_outputPath',
  org = 'config_org',
  targetBranch = 'config_targetBranch',
  outputBranch = 'config_outputBranch',
  commitMessage = 'config_commit'
} = {}): Config {
  return {
    target,
    path,
    value,
    repo,
    outputPath,
    org,
    targetBranch,
    outputBranch,
    commitMessage,
    githubAccessToken: 'token',
  }
}

function makeArgs({
  path = 'path',
  org = 'org',
  repo = 'repo',
  outputPath = 'outputPath',
  targetBranch = 'targetBranch',
  outputBranch = 'outputBranch',
  message = 'mesage',
  set = '[bla]=yo'
} = {}): UpdateArgs {
  return {
    path,
    message,
    repo,
    org,
    outputBranch,
    outputPath,
    targetBranch,
    set
  }
}