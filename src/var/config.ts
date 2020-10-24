export interface Config {
  target?: string;
  path?: string;
  value?: string;
  repo?: string;
  outputPath?: string;
  org?: string;
  githubAccessToken: string;
  targetBranch?: string;
  commitMessage?: string;
  outputBranch?: string;
}

export class ConfigHolder {
  constructor(private readonly config: Config​​) {
    this.config.targetBranch = config.targetBranch ?? 'main'
    this.config.outputBranch = config.outputBranch ?? 'main'
  }

  get() {
    return this.config;
  }
}