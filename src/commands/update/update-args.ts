export interface UpdateArgs {
  sourcePath: string;
  org: string;
  repo: string;
  outputPath: string;
  sourceBranch: string;
  outputBranch: string;
  message: string;
  pr: boolean
  set: string | string[];
}

export interface UpdateParams {
  sourcePath: string;
  org: string;
  repo: string;
  outputPath: string;
  sourceBranch: string;
  outputBranch: string;
  message: string;
  pr: boolean
  targets: { path: string, value: string }[] 
}