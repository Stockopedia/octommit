import { GitClient, YamlStringBuilder } from "../../shared";
import { UpdateArgs } from "./update-args";
import { UpdateParamsBuilder } from "./update-params-builder";

export class UpdateCommand {
  constructor(
    private readonly gitClient: GitClient,
    private readonly yamlStringBuilder: YamlStringBuilder,
    private readonly paramBuilder: UpdateParamsBuilder,
  ) {}

  async action(args: UpdateArgs): Promise<string> {
    const {
      repo,
      sourcePath: path,
      org,
      targets,
      removeTargets,
      sourceBranch,
      outputBranch,
      outputPath,
      message,
      pr,
    } = this.paramBuilder.build(args);

    const { data: file, sha } = await this.gitClient.getFile(
      path,
      repo,
      org,
      sourceBranch,
    );
    const builder = this.yamlStringBuilder.haystack(file);

    targets.forEach(({ path, value }) => {
      if (path.slice(-2) === "[]") {
        builder.pushValue(path.slice(0, -2), value);
      } else {
        builder.setValue(path!, value!);
      }
    });
    removeTargets.forEach(({ path, value }) => {
      if (path.slice(-2) === "[]") {
        builder.removeItem(path.slice(0, -2), value!);
      } else {
        builder.deleteValue(path!);
      }
    });

    const result = await this.gitClient.putFile(
      builder.build(),
      repo,
      org,
      sourceBranch,
      outputBranch,
      path,
      outputPath,
      message,
      sha,
    );

    if (pr) {
      return await this.gitClient.createPullRequest(
        org,
        repo,
        message,
        sourceBranch,
        outputBranch,
      );
    }
    return result;
  }
}
