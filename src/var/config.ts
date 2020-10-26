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
  pr?: boolean
}

export class ConfigHolder {
  constructor(private readonly config: Config​​) {
    this.config.targetBranch = config.targetBranch ?? 'main'
    this.config.outputBranch = config.outputBranch ?? 'main'
    this.config.pr = config.pr ?? false
  }

  get() {
    return this.config;
  }
}