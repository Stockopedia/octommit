import * as dotenv from "dotenv";

dotenv.config();

export const GITHUB_ACCESS_TOKEN: string = process.env.GITHUB_ACCESS_TOKEN!;
export const ORG: string = process.env.ORG!;
export const REPO: string | undefined = process.env.REPO;
export const OUTPUT_PATH: string | undefined = process.env.OUTPUT_PATH;
export const SOURCE_PATH: string | undefined = process.env.SOURCE_FILE;
export const SOURCE_BRANCH: string | undefined = process.env.SOURCE_BRANCH;
export const OUTPUT_BRANCH: string | undefined = process.env.OUTPUT_BRANCH;
export const COMMIT_MESSAGE: string | undefined = process.env.MESSAGE;
export const CREATE_PR: boolean | undefined = Boolean(process.env.CREATE_PR);
