import { container, instanceCachingFactory } from "tsyringe";
import { Orchestrator } from './orchestrator';
import { GitClient } from './git-client';
import { Octokit } from '@octokit/rest';
import { GITHUB_ACCESS_TOKEN, REPO, ORG, OUTPUT_PATH, VALUE, PATH, TARGET } from './env';
import { YamlFileBuilder } from './yaml-file-builder';
import { Config } from './config';

enum Symbols {
  Config = 'config'
}

container.register<Config>(Symbols.Config, {
  useValue: {
    target: TARGET,
    repo: REPO,
    value: VALUE,
    path: PATH,
    outputPath: OUTPUT_PATH
  }
})

container.register<Orchestrator>(Orchestrator, {
  useFactory: instanceCachingFactory(
    (c) => new Orchestrator(c.resolve(GitClient), c.resolve(YamlFileBuilder), c.resolve(Symbols.Config))
  ),
});

container.register<YamlFileBuilder>(YamlFileBuilder, {
  useClass: YamlFileBuilder
})

container.register<Octokit>(Octokit, {
  useValue: new Octokit({ auth: GITHUB_ACCESS_TOKEN })
})

container.register<GitClient>(GitClient, {
  useFactory: instanceCachingFactory(
    (c) => new GitClient(c.resolve(Octokit), ORG)
  ),
})

export {
  container
}