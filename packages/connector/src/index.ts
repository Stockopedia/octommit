import { EventEmitter } from "events";

import { Octokit } from "@octokit/rest";

import { GitClient, YamlStringBuilder, UpdateParamsBuilder, UpdateCommand, UpdateArgs as UpdateCommandArgs } from "octommit-core";

export class Octommit {
  constructor(private readonly githubToken: string) {}

  update() {
    return new Org({ githubToken: this.githubToken });
  }
}

interface UpdateArgs {
  sourcePath?: string;
  org?: string;
  repo?: string;
  outputPath?: string;
  sourceBranch?: string;
  outputBranch?: string;
  message?: string;
  pr?: boolean;
  set?: string[];
  remove?: string[];
  githubToken: string;
}

class Org {
  constructor(private readonly options: UpdateArgs) {}

  org(name: string) {
    this.options.org = name
    return new Repository(this.options)
  }
}

class Repository {
  constructor(private readonly options: UpdateArgs) {}

  repository(name: string) {
    this.options.repo = name;

    return new SourceBranch(this.options);
  }
}

class SourceBranch {
  constructor(private readonly options: UpdateArgs) {}

  sourceBranch(name: string) {
    this.options.sourceBranch = name;

    return new OutputBranch(this.options);
  }
}

class OutputBranch {
  constructor(private readonly options: UpdateArgs) {}

  outputBranch(name: string) {
    this.options.outputBranch = name;

    return new SourcePath(this.options);
  }
}

class SourcePath {
  constructor(private readonly options: UpdateArgs) {}

  sourcePath(name: string) {
    this.options.sourcePath = name;

    return new OutputPath(this.options);
  }
}

class OutputPath {
  constructor(private readonly options: UpdateArgs) {}

  outputPath(name: string) {
    this.options.outputPath = name;

    return new Command(this.options);
  }
}

class Command {
  constructor(private readonly options: UpdateArgs) {
    this.options.set = this.options.set ? this.options.set : [];
    this.options.remove = this.options.remove ? this.options.remove : [];
  }

  set(path: string, value: string) {
    this.options.set!.push(`[${path}]=${value}`);
    return this;
  }

  setArrayItem(path: string, value: string) {
    this.options.set!.push(`[${path}[]]=${value}`);
    return this;
  }

  remove(path: string, value: string) {
    this.options.set!.push(`[${path}]=${value}`);
    return this;
  }

  removeFromArray(path: string, value: string) {
    this.options.set!.push(`[${path}[]]=${value}`);
    return this;
  }

  commit(message: string) {
    return new Commit(this.options, message);
  }
}

class Commit {
  constructor(private readonly options: UpdateArgs, message: string) {
    this.options.message = message;
  }

  pr() {
    this.options.pr = true;

    return new Runner(this.options);
  }

  run() {
    return new Runner(this.options).run();
  }
}

class Runner {
  private command: UpdateCommand;
  constructor(private readonly options: UpdateArgs) {
    const { githubToken } = this.options;
    this.command = new UpdateCommand(
      new GitClient(new Octokit({ auth: githubToken }), new EventEmitter()),
      new YamlStringBuilder(),
      new UpdateParamsBuilder({ githubAccessToken: githubToken }),
    );
  }

  async run(): Promise<string> {
    return `YAML successfully updated at: ${await this.command.action(
      this.options as UpdateCommandArgs,
    )}`;
  }
}
