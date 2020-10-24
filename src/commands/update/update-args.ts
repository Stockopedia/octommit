export interface UpdateArgs {
  path: string;
  org: string;
  repo: string;
  outputPath: string;
  targetBranch: string;
  outputBranch: string;
  message: string;
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
  targets: { path: string, value: string }[] 
}