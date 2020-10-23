import * as Vorpal from 'vorpal';
import { GitClient } from './git-client';
import { YamlFileBuilder } from './yaml-file-builder';
import { Config } from './config';

export class Orchestrator {
  private readonly vorpal: Vorpal;
  private readonly command: Vorpal.Command;

  constructor(private readonly gitClient: GitClient, private readonly yamlFileBuilder: YamlFileBuilder, private readonly config: Config) {
    this.vorpal = new Vorpal()
    this.command = this.vorpal.command('update', 'Update a yaml file in git')
    this.command.action(this.action.bind(this))
  }

  withOptions(options: [string, string][]): Orchestrator {
    options.forEach(([option, desc]) => {
      this.command.option(option, desc)
    })

    return this;
  }

  create() {
    return this.vorpal
  }

  private async action(args: Vorpal.Args): Promise<void> {
    const { repo, path, outputPath, set } = args.options
    const file = await this.gitClient.getFile(path ?? this.config.path, repo ?? this.config.repo);
    const targets = this.getTargets(set);
    const builder = this.yamlFileBuilder.haystack(file);

    targets.forEach(({path, value}) => {
      builder.setValue(path!, value!);
    })

    this.vorpal.log(builder.build())
}

  private getTargets(target: string | string[]) {
    if(target === undefined) {
      return [{
        path: this.config.target,
        value: this.config.value
      }]
    }
    if(!Array.isArray(target)) {
      return [this.extractPathAndValue(target)]
    }
    return target.map(t => this.extractPathAndValue(t))
  }

  private extractPathAndValue(arg: string) {
    const [path, value] = arg.split("=")
  
    return { path: path.slice(0, -1).substring(1), value };
  }
}