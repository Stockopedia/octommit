export interface UpdateArgs {
  path: string;
  org: string;
  repo: string;
  outputPath: string;
  targetBranch: string;
  outputBranch: string;
  message: string;
  pr: boolean
  set: string | string[];
}

export interface UpdateParams {
  path: string;
  org: string;
  repo: string;
  outputPath: string;
  targetBranch: string;
  outputBranch: string;
  message: string;
  pr: boolean
  targets: { path: string, value: string }[] 
}