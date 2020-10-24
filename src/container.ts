import { container, instanceCachingFactory } from "tsyringe";
import { UpdateParamsBuilder, UpdateCommand, UpdateValidator } from './commands'
import { Orchestrator } from './orchestrator';
import { GitClient, YamlStringBuilder } from './shared';
import { Octokit } from '@octokit/rest';
import { ConfigHolder, Config, GITHUB_ACCESS_TOKEN, REPO, ORG, OUTPUT_PATH, VALUE, PATH, TARGET, OUTPUT_BRANCH, TARGET_BRANCH } from './var';

enum Symbols {
  Config = 'config'
}

container.register<Config>(Symbols.Config, {
  useValue: new ConfigHolder({
    target: TARGET,
    repo: REPO,
    value: VALUE,
    path: PATH,
    outputPath: OUTPUT_PATH,
    org: ORG,
    githubAccessToken: GITHUB_ACCESS_TOKEN,
    targetBranch: TARGET_BRANCH,
    outputBranch: OUTPUT_BRANCH
  }).get()
})

container​​.register<UpdateParamsBuilder>(UpdateParamsBuilder, {
  useFactory: (c) => new UpdateParamsBuilder(c.resolve(Symbols.Config))
})

container​​.register<UpdateValidator>(UpdateValidator, {
  useFactory: (c) => new UpdateValidator(c.resolve(UpdateParamsBuilder))
})

container​​.register<UpdateCommand>(UpdateCommand, {
  useFactory: (c) => new UpdateCommand(c.resolve(GitClient), c.resolve(YamlStringBuilder), c.resolve(UpdateParamsBuilder))
})

container.register<Orchestrator>(Orchestrator, {
  useFactory: instanceCachingFactory(
    (c) => new Orchestrator(c.resolve(UpdateCommand), c.resolve(UpdateValidator))
  ),
});

container.register<YamlStringBuilder>(YamlStringBuilder, {
  useClass: YamlStringBuilder
})

container.register<Octokit>(Octokit, {
  useValue: new Octokit({ auth: GITHUB_ACCESS_TOKEN })
})

container.register<GitClient>(GitClient, {
  useFactory: instanceCachingFactory(
    (c) => new GitClient(c.resolve(Octokit))
  ),
})

export {
  container
}