import { UpdateParamsBuilder } from './update-params-builder';
import { UpdateValidator } from './update-validator';
import { UpdateArgs } from './update-args';

describe('update command validator', () => {

  const validator = new UpdateValidator(new UpdateParamsBuilder({} as any))

  describe('given invalid params', () => {
    const fixtures = [
      [makeArgs({ path: '' }), 'path'],
      [makeArgs({ repo: '' }), 'repo'],
      [makeArgs({ outputBranch: '' }), 'outputBranch'],
      [makeArgs({ sourceBranch: '' }), 'sourceBranch'],
      [makeArgs({ outputPath: '' }), 'outputPath'],
      [makeArgs({ set: '' }), 'set'],
    ]

    fixtures.forEach(([fixture, param]) => {
      it(`should fail validation for param: ${param}`, () => {
        expect(validator.validate(fixture as UpdateArgs)).toContain('Please provide a')
      })
    });
  })

  describe('given full set of args', () => {
    it('should pass validation', () => {
      expect(validator.validate(makeArgs())).toBeTruthy()
    })
  })
  
})

function makeArgs({
  path = 'path',
  org = 'org',
  repo = 'repo',
  outputPath = 'outputPath',
  sourceBranch = 'sourceBranch',
  outputBranch = 'outputBranch',
  message = 'message',
  set = '[bla]=yo',
  pr = true
} = {}): UpdateArgs {
  return {
    sourcePath: path,
    pr,
    repo,
    org,
    outputBranch,
    outputPath,
    sourceBranch,
    message,
    set
  }
}