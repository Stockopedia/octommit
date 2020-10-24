import { Octokit } from '@octokit/rest';

export class GitClient { 
  constructor(private readonly octokit: Octokit) {

  }

  async getFile(path: string, repo: string, org: string): Promise<string> {
    const { data } = await this.octokit.repos.getContent({
      owner: org,
      repo,
      path
    })
    return Buffer.from(data.content, 'base64').toString()
  }

  async putFile(data: string, repo: string, org: string, targetBranch: string, outputBranch: string, outputPath: string, message: string): Promise<string> {
    const branchRef = await this.getBranchRef(repo, org, targetBranch, outputBranch);

    const { data: blobData } = await this.octokit.git.createBlob({
      owner: org,
      repo,
      content: data,
      encoding: 'utf-8',
    })

    const { data: currentCommitData } = await this.octokit.git.getCommit({
      owner: org,
      repo,
      commit_sha: branchRef,
    })

    const { data: treeData } = await this.octokit.git.createTree({
      owner: org,
      repo,
      tree:[{
        path: outputPath,
        mode: `100644`,
        type: `blob`,
        sha: blobData.sha,
      }],
      base_tree: currentCommitData.tree.sha,
    })

    const { data: newCommitData } = await this.octokit.git.createCommit({
      owner: org,
      repo,
      message,
      tree: treeData.sha,
      parents: [currentCommitData.sha]
    })

    const { data: result } = await this.octokit.git.updateRef({
      owner: org,
      repo,
      ref: `refs/heads/${outputBranch}`,
      sha: newCommitData.sha,
    })

    return result.url
  }

  private async getBranchRef(repo: string, org: string, targetBranch: string, outputBranch: string) {
    const { data: refData } = await this.octokit.git.getRef({
      owner: org,
      repo,
      ref: `refs/heads/${targetBranch}`
    })
    const existingRefSha = refData.object.sha;

    if(outputBranch !== targetBranch) {
      const { data: refData } = await this.octokit.git.createRef({
        owner: org,
        repo,
        ref: `refs/heads/${outputBranch}`,
        sha: existingRefSha
      })

      return refData.object.sha
    }

    return refData.object.sha
  }
}