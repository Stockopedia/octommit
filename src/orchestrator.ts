import * as Vorpal from 'vorpal';
import { UpdateCommand, UpdateArgs, UpdateValidator } from './commands';

export class Orchestrator {
  private readonly vorpal: Vorpal;

  constructor(updateCommand: UpdateCommand, updateValidator: UpdateValidator) {
    this.vorpal = new Vorpal()

    this.vorpal.command('update', 'Update a yaml file in git')
      .option('--repo <repo>', 'Reopsitory')
      .option('--set [<path>]=<value>', 'Path to target and the desired value e.g. image.tag=bla')
      .option('--path <path>', 'Path to file in repo')
      .option('--outputPath <path>', 'Output path of file in repo')
      .option('--org <org>', 'The github organisation')
      .option('--token <token>', 'The github personal access token')
      .option('--message <message>', 'The github commit message')
      .option('--o', 'Whether or not to output the resulting file')
      .validate(args => updateValidator.validate(args.options as UpdateArgs))
      .action(async (args) => {
        const result = await updateCommand.action(args.options as UpdateArgs)
        if(args.options.o) {
          this.vorpal.log(result)
        }
      })
  }

  create() {
    return this.vorpal
  }
}