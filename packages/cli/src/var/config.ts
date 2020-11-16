export interface Config {
  sourcePath?: string;
  repo?: string;
  outputPath?: string;
  org?: string;
  githubAccessToken: string;
  sourceBranch?: string;
  commitMessage?: string;
  outputBranch?: string;
  pr?: boolean;
}

export class ConfigHolder {
  constructor(private readonly config: Config) {
    this.config.sourceBranch = config.sourceBranch ?? "main";
    this.config.outputBranch = config.outputBranch ?? "main";
    this.config.pr = config.pr ?? false;
  }

  get() {
    return this.config;
  }
}
