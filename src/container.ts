import { container, instanceCachingFactory } from "tsyringe";
import { UpdateParamsBuilder, UpdateCommand, UpdateValidator } from './commands'
import { Orchestrator } from './orchestrator';
import { GitClient, YamlStringBuilder } from './shared';
import { Octokit } from '@octokit/rest';
import { ConfigHolder, Config, CREATE_PR, GITHUB_ACCESS_TOKEN, REPO, ORG, OUTPUT_PATH, VALUE, SOURCE_PATH, VALUE_PATH, COMMIT_MESSAGE, OUTPUT_BRANCH, SOURCE_BRANCH } from './var';
import { EventEmitter } from "events";

enum Symbols {
  Config = 'config'
}

container.register<Config>(Symbols.Config, {
  useValue: new ConfigHolder({
    targetValuePath: VALUE_PATH,
    repo: REPO,
    value: VALUE,
    sourcePath: SOURCE_PATH,
    outputPath: OUTPUT_PATH,
    org: ORG,
    githubAccessToken: GITHUB_ACCESS_TOKEN,
    sourceBranch: SOURCE_BRANCH,
    outputBranch: OUTPUT_BRANCH,
    commitMessage: COMMIT_MESSAGE,
    pr: CREATE_PR
  }).get()
})

container​​.register<EventEmitter>(EventEmitter, {
  useValue: new EventEmitter()
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
    (c) => new Orchestrator(c.resolve(UpdateCommand), c.resolve(UpdateValidator), c.resolve(EventEmitter))
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
    (c) => new GitClient(c.resolve(Octokit), c.resolve(EventEmitter))
  ),
})

export {
  container
}