import { UpdateArgs } from "./update-args";
import { UpdateParamsBuilder } from "./update-params-builder";

export class UpdateValidator {
  constructor(private readonly paramBuilder: UpdateParamsBuilder) {}

  validate(args: UpdateArgs): boolean {
    const {
      sourcePath,
      repo,
      org,
      targets,
      outputPath,
      sourceBranch,
      outputBranch,
      message,
    } = this.paramBuilder.build(args);

    if (!sourcePath) {
      throw new Error("provide a target file path");
    }
    if (!message) {
      throw new Error("Please provide a commit message");
    }
    if (!repo) {
      throw new Error("Please provide a repository");
    }
    if (targets.length === 0) {
      throw new Error("Please provide a property path and value to set");
    }
    if (!org) {
      throw new Error("Please provide a github organisation");
    }
    if (!outputPath) {
      throw new Error("Please provide an output path");
    }
    if (!sourceBranch) {
      throw new Error("Please provide an target branch");
    }
    if (!outputBranch) {
      throw new Error("Please provide an output branch");
    }
    return true;
  }
}
