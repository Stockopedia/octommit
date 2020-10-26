import { Octokit } from '@octokit/rest';
import { EventEmitter } from 'events'
import { LogEvent, LogType } from './log-event';
import { HandledError } from './handled-error';

export class GitClient { 
  constructor(private readonly octokit: Octokit, private readonly eventEmitter: EventEmitter) {

  }

  async getFile(path: string, repo: string, org: string): Promise<{ data: string, sha: string}> {
    try {
      const { data } = await this.octokit.repos.getContent({
        owner: org,
        repo,
        path
      })
      
      return { data : Buffer.from(data.content, 'base64').toString(), sha: data.sha }
    }
    catch(e) {
      throw new HandledError(`uanble to get file at: ${path}`, e)
    }
  }

  async putFile(data: string, repo: string, org: string, targetBranch: string, outputBranch: string, outputPath: string, message: string, sha: string): Promise<string> {
    const branchRef = await this.getBranchRef(repo, org, targetBranch, outputBranch);

    try {
      const result = await this.octokit.repos.createOrUpdateFileContents({
        message,
        content: Buffer.from(data).toString('base64'),
        owner: org,
        repo,
        path: outputPath,
        branch: branchRef,
        sha
      })
      return result.url;  
    }
    catch(e) {
      throw new HandledError(`unable to PUT file contents`, e)
    }
  }

  async createPullRequest(org: string, repo: string, title: string, targetBranch: string, outputBranch: string) {
    try {
      const { data } = await this.octokit.pulls.create({
        owner: org,
        repo,
        title,
        head: outputBranch,
        base: targetBranch,
      });

      return data.url
    }
    catch(e) {
      throw new HandledError(`unable to create PR for between branches: ${targetBranch} and ${outputBranch}`, e)
    }
  }

  private async getBranchRef(repo: string, org: string, targetBranch: string, outputBranch: string) {
    if(outputBranch === targetBranch) {
      return targetBranch
    }

    try {
      const { data: existingRefData } = await this.octokit.git.getRef({
        owner: org,
        repo,
        ref: `heads/${outputBranch}`
      })

      this.eventEmitter.emit('log', new LogEvent(LogType.info, `using existing branch: ${outputBranch}`))

      return existingRefData.ref
    }
    catch(e) {
      return this.createBranch(repo, org, targetBranch, outputBranch)
    }
  }

  private async createBranch(repo: string, org: string, targetBranch: string, outputBranch: string): Promise<string> {
    let existingRefData;
    let newRefData;

    try {
      const { data } = await this.octokit.git.getRef({
        owner: org,
        repo,
        ref: `heads/${targetBranch}`
      })  
      existingRefData = data
    }
    catch(e) {
      throw new HandledError(`target branch ${targetBranch} not found`, e)
    }
  
    try {
      const { data } = await this.octokit.git.createRef({
        owner: org,
        repo,
        ref: `refs/heads/${outputBranch}`,
        sha: existingRefData.object.sha
      })
      newRefData = data
    }
    catch(e) {
      throw new HandledError(`unable to create branch ${outputBranch}`, e)
    }

    this.eventEmitter.emit('log', new LogEvent(LogType.info, `creating new branch: ${outputBranch}`))

    return newRefData.ref
  }
}

