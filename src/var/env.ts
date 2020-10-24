import * as dotenv from "dotenv";

dotenv.config();

export const GITHUB_ACCESS_TOKEN: string = process.env.GITHUB_ACCESS_TOKEN!
export const ORG: string = process.env.ORG!
export const REPO: string | undefined = process.env.REPO
export const VALUE: string | undefined = process.env.VALUE
export const TARGET: string | undefined = process.env.TARGET
export const OUTPUT_PATH: string | undefined = process.env.OUTPUT_PATH
export const PATH: string | undefined = process.env.FILE_PATH
export const TARGET_BRANCH: string | undefined = process.env.TARGET_BRANCH
export const OUTPUT_BRANCH: string | undefined = process.env.OUTPUT_BRANCH