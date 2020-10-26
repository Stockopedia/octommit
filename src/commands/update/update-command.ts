import { GitClient, YamlStringBuilder } from '../../shared';
import { UpdateParamsBuilder } from './update-params-builder';
import { UpdateArgs } from './update-args'

export class UpdateCommand {
  constructor(private readonly gitClient: GitClient, private readonly yamlStringBuilder: YamlStringBuilder, private readonly paramBuilder: UpdateParamsBuilder) {

  }

  async action(args: UpdateArgs): Promise<string> {
    const { repo, path, org, targets, sourceBranch, outputBranch, outputPath, message, pr } = this.paramBuilder.build(args);

    const { data: file, sha } = await this.gitClient.getFile(path, repo, org);
    const builder = this.yamlStringBuilder.haystack(file);

    targets.forEach(({path, value}) => {
      builder.setValue(path!, value!);
    })

    const result = await this.gitClient.putFile(builder.build(), repo, org, sourceBranch, outputBranch, outputPath, message, sha);

    if(pr) {
      return await this.gitClient.createPullRequest(org, repo, message, sourceBranch, outputBranch)
    }
    return result
  }
}