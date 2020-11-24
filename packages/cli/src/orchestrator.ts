import { EventEmitter } from "events";

import * as chalk from "chalk";
import * as Vorpal from "vorpal";

import { UpdateArgs, UpdateCommand, UpdateValidator, HandledError, LogEvent, LogType } from "@octommit/core";

export class Orchestrator {
  private readonly vorpal: Vorpal;

  constructor(
    updateCommand: UpdateCommand,
    updateValidator: UpdateValidator,
    eventEmitter: EventEmitter,
  ) {
    this.vorpal = new Vorpal();

    eventEmitter.on("log", (data: LogEvent) => {
      switch (data.type) {
        case LogType.error:
          this.vorpal.log(`Error: ${chalk.red(data.message)}`);
          break;
        default:
          this.vorpal.log(`info: ${chalk.yellow(data.message)}`);
          break;
      }
    });

    this.vorpal
      .command("update", "Update a yaml file in git")
      .option("--repo <repo>", "Reopsitory")
      .option("--pr", "Create a pull request")
      .option(
        "--set [<path>]=<value>",
        "Path to target and the desired value e.g. image.tag=bla",
      )
      .option(
        "--remove [<path>]=<value>",
        "Path to item that need to be removed e.g. image.tag",
      )
      .option("--sourcePath <path>", "Path to file in repo")
      .option("--outputPath <path>", "Output path of file in repo")
      .option("--sourceBranch <sourceBranch>", "Target (base) branch")
      .option("--outputBranch <outputBranch>", "Output branch")
      .option("--org <org>", "The github organisation")
      .option("--message <message>", "The github commit message")
      .option("--o", "Whether or not to output the resulting file")
      .validate((args) => {
        try {
          updateValidator.validate(args.options as UpdateArgs);
          return true;
        } catch (e) {
          this.vorpal.log(e.message);
          process.exit(1);
        }
      })
      .action(async (args) => {
        try {
          const result = await updateCommand.action(args.options as UpdateArgs);
          if (args.options.o) {
            this.vorpal.log(
              `YAML successfully updated at: ${chalk.green(result)}`,
            );
          }
        } catch (e) {
          if (e instanceof HandledError) {
            this.vorpal.log(`Error: ${chalk.red(e.message)}`);
            process.exit(1);
          }
        }
      });
  }

  create() {
    return this.vorpal;
  }
}
