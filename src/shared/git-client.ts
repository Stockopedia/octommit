import { EventEmitter } from "events";

import { Octokit } from "@octokit/rest";

import { HandledError } from "./handled-error";
import { LogEvent, LogType } from "./log-event";

export class GitClient {
  constructor(
    private readonly octokit: Octokit,
    private readonly eventEmitter: EventEmitter,
  ) {}

  async getFile(
    path: string,
    repo: string,
    org: string,
    branch: string,
  ): Promise<{ data: string; sha: string }> {
    try {
      const { data } = await this.octokit.repos.getContent({
        owner: org,
        repo,
        path,
        ref: `heads/${branch}`,
      });

      return {
        data: Buffer.from(data.content, "base64").toString(),
        sha: data.sha,
      };
    } catch (e) {
      throw new HandledError(`uanble to get file at: ${path}`, e);
    }
  }

  async putFile(
    data: string,
    repo: string,
    org: string,
    sourceBranch: string,
    outputBranch: string,
    sourcePath: string,
    outputPath: string,
    message: string,
    sha: string,
  ): Promise<string> {
    const branchRef = await this.getBranchRef(
      repo,
      org,
      sourceBranch,
      outputBranch,
    );
    const sourceSha = await this.getExistingSha(
      repo,
      org,
      outputBranch,
      sourcePath,
      outputPath,
      sha,
    );

    try {
      const result = await this.octokit.repos.createOrUpdateFileContents({
        message,
        content: Buffer.from(data).toString("base64"),
        owner: org,
        repo,
        path: outputPath,
        branch: branchRef,
        sha: sourceSha,
      });
      return result.url;
    } catch (e) {
      throw new HandledError(`unable to PUT file contents`, e);
    }
  }

  async createPullRequest(
    org: string,
    repo: string,
    title: string,
    sourceBranch: string,
    outputBranch: string,
  ) {
    try {
      const { data } = await this.octokit.pulls.create({
        owner: org,
        repo,
        title,
        head: outputBranch,
        base: sourceBranch,
      });

      return data.url;
    } catch (e) {
      throw new HandledError(
        `unable to create PR for between branches: ${sourceBranch} and ${outputBranch}`,
        e,
      );
    }
  }

  private async getExistingSha(
    repo: string,
    org: string,
    outputBranch: string,
    sourcePath: string,
    outputPath: string,
    sha: string,
  ) {
    if (outputPath !== sourcePath) {
      try {
        const { sha: existingSha } = await this.getFile(
          outputPath,
          repo,
          org,
          outputBranch,
        );
        return existingSha;
      } catch (e) {
        return sha;
      }
    }
    return sha;
  }

  private async getBranchRef(
    repo: string,
    org: string,
    sourceBranch: string,
    outputBranch: string,
  ) {
    if (outputBranch === sourceBranch) {
      return sourceBranch;
    }

    try {
      const { data: existingRefData } = await this.octokit.git.getRef({
        owner: org,
        repo,
        ref: `heads/${outputBranch}`,
      });

      this.eventEmitter.emit(
        "log",
        new LogEvent(LogType.info, `using existing branch: ${outputBranch}`),
      );

      return existingRefData.ref;
    } catch (e) {
      return this.createBranch(repo, org, sourceBranch, outputBranch);
    }
  }

  private async createBranch(
    repo: string,
    org: string,
    sourceBranch: string,
    outputBranch: string,
  ): Promise<string> {
    let existingRefData;
    let newRefData;

    try {
      const { data } = await this.octokit.git.getRef({
        owner: org,
        repo,
        ref: `heads/${sourceBranch}`,
      });
      existingRefData = data;
    } catch (e) {
      throw new HandledError(`target branch ${sourceBranch} not found`, e);
    }

    try {
      const { data } = await this.octokit.git.createRef({
        owner: org,
        repo,
        ref: `refs/heads/${outputBranch}`,
        sha: existingRefData.object.sha,
      });
      newRefData = data;
    } catch (e) {
      throw new HandledError(`unable to create branch ${outputBranch}`, e);
    }

    this.eventEmitter.emit(
      "log",
      new LogEvent(LogType.info, `creating new branch: ${outputBranch}`),
    );

    return newRefData.ref;
  }
}
