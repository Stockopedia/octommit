import { GitClient, YamlStringBuilder } from '../../shared';
import { UpdateParamsBuilder } from './update-params-builder';
import { UpdateArgs } from './update-args'

export class UpdateCommand {
  constructor(private readonly gitClient: GitClient, private readonly yamlStringBuilder: YamlStringBuilder, private readonly paramBuilder: UpdateParamsBuilder) {

  }

  async action(args: UpdateArgs): Promise<string> {
    const { repo, path, org, targets, targetBranch, outputBranch, outputPath, message } = this.paramBuilder.build(args);

    const file = await this.gitClient.getFile(path, repo, org);
    const builder = this.yamlStringBuilder.haystack(file);

    targets.forEach(({path, value}) => {
      builder.setValue(path!, value!);
    })

    return await this.gitClient.putFile(builder.build(), repo, org, targetBranch, outputBranch, outputPath, message);
  }
}