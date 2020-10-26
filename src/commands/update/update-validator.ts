import { UpdateParamsBuilder } from './update-params-builder';
import { UpdateArgs } from './update-args';

export class UpdateValidator {
  constructor(private readonly paramBuilder: UpdateParamsBuilder) {}

  validate(args: UpdateArgs): boolean | string {
    const { sourcePath, repo, org, targets, outputPath, sourceBranch, outputBranch, message } = this.paramBuilder.build(args)

    if(!sourcePath) {
      return 'Please provide a target file path'
    }
    if(!message) {
      return 'Please provide a commit message'
    }
    if(!repo) {
      return 'Please provide a repository'
    }
    if(targets.length === 0) {
      return 'Please provide a property path and value to set'
    }
    if(!org) {
      return 'Please provide a github organisation'
    }
    if(!outputPath) {
      return 'Please provide an output path'
    }
    if(!sourceBranch) {
      return 'Please provide an target branch'
    }
    if(!outputBranch) {
      return 'Please provide an output branch'
    }
    return true;
  }
}