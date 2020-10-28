import { Config } from "../../var";
import { UpdateArgs, UpdateParams } from "./update-args";

export class UpdateParamsBuilder {
  constructor(private readonly config: Config) {}

  build(args: UpdateArgs): UpdateParams {
    const sourcePath = args.sourcePath
      ? args.sourcePath
      : this.config.sourcePath!;
    const repo = args.repo ? args.repo : this.config.repo!;
    const org = args.org ? args.org : this.config.org!;
    const targets = this.getTargets(
      args.set ? args.set : this.getConfigTarget(),
    );
    const outputPath = args.outputPath
      ? args.outputPath
      : this.config.outputPath!;
    const sourceBranch = args.sourceBranch
      ? args.sourceBranch
      : this.config.sourceBranch!;
    const outputBranch = args.outputBranch
      ? args.outputBranch
      : this.config.outputBranch!;
    const message = args.message ? args.message : this.config.commitMessage!;
    const pr = args.pr ? args.pr : this.config.pr!;

    return {
      sourcePath,
      repo,
      org,
      targets,
      outputBranch,
      sourceBranch,
      outputPath,
      message,
      pr,
    };
  }

  private getConfigTarget() {
    if (!this.config.targetValuePath || !this.config.value) {
      return undefined;
    }
    return `[${this.config.targetValuePath}]=${this.config.value}`;
  }

  private getTargets(
    target?: string | string[],
  ): { path: string; value: string }[] {
    if (!target) {
      if (!this.config.targetValuePath || !this.config.value) {
        return [];
      }
      return [
        {
          path: this.config.targetValuePath!,
          value: this.config.value!,
        },
      ];
    }
    if (!Array.isArray(target)) {
      return [this.extractPathAndValue(target)];
    }
    return target.map((t) => this.extractPathAndValue(t));
  }

  private extractPathAndValue(arg: string) {
    const [path, value] = arg.split("=");

    return { path: path.slice(0, -1).substring(1), value };
  }
}
