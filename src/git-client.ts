import { Octokit } from '@octokit/rest';

export class GitClient { 
  constructor(private readonly octokit: Octokit, private readonly org: string) {

  }

  async getFile(path: string, repo: string): Promise<string> {
    const { data } = await this.octokit.repos.getContent({
      owner: this.org,
      repo,
      path
    })
    return Buffer.from(data.content, 'base64').toString()
  }

  async putFile(data: string): Promise<void> {

  }
}

class NoSuchFileError extends Error {
  constructor(path: string, repo: string) {
    super(`file not found at path: ${path}, in repo : ${repo}`);
  }
}