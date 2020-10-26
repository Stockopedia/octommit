import * as Vorpal from 'vorpal';
import { UpdateCommand, UpdateArgs, UpdateValidator } from './commands';
import * as chalk from 'chalk';
import { HandledError } from './shared/handled-error';
import { EventEmitter } from 'events';
import { LogEvent, LogType } from './shared/log-event';

export class Orchestrator {
  private readonly vorpal: Vorpal;

  constructor(updateCommand: UpdateCommand, updateValidator: UpdateValidator, eventEmitter: EventEmitter) {
    this.vorpal = new Vorpal()

    eventEmitter.on('log', (data: LogEvent) => {
      switch(data.type) {
        case LogType.error:
          this.vorpal.log(`Error: ${chalk.red(data.message)}`)
          break;
        default:
          this.vorpal.log(`info: ${chalk.yellow(data.message)}`)
          break;
      }
    })

    this.vorpal.command('update', 'Update a yaml file in git')
      .option('--repo <repo>', 'Reopsitory')
      .option('--pr', 'Create a pull request')
      .option('--set [<path>]=<value>', 'Path to target and the desired value e.g. image.tag=bla')
      .option('--path <path>', 'Path to file in repo')
      .option('--outputPath <path>', 'Output path of file in repo')
      .option('--org <org>', 'The github organisation')
      .option('--token <token>', 'The github personal access token')
      .option('--message <message>', 'The github commit message')
      .option('--o', 'Whether or not to output the resulting file')
      .validate(args => updateValidator.validate(args.options as UpdateArgs))
      .action(async (args) => {
        try {
          const result = await updateCommand.action(args.options as UpdateArgs)
          if(args.options.o) {
            this.vorpal.log(`YAML successfully updated at: ${chalk.green(result)}`)
          }
        }
        catch(e) {
          if(e instanceof HandledError) {
            this.vorpal.log(`Error: ${chalk.red(e.message)}`)
            process.exit(1)
          }
        }
      })
  }

  create() {
    return this.vorpal
  }
}