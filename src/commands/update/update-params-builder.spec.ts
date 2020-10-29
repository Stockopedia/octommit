import { Config } from "../../var";
import { UpdateArgs } from "./update-args";
import { UpdateParamsBuilder } from "./update-params-builder";

describe("update params builder", () => {
  describe("when value comes from config", () => {
    const args = new UpdateParamsBuilder(makeConfig()).build(
      makeArgs({
        path: "",
        set: "",
        outputPath: "",
        sourceBranch: "",
        outputBranch: "",
        message: "",
        org: "",
        repo: "",
        pr: undefined,
      }),
    );

    expect(args.message).toContain("config");
    expect(args.sourcePath).toContain("config");
    expect(args.outputBranch).toContain("config");
    expect(args.outputPath).toContain("config");
    expect(args.sourceBranch).toContain("config");
    expect(args.org).toContain("config");
    expect(args.repo).toContain("config");
  });
  describe("when value comes from cli options", () => {
    it("cli option should take precedence", () => {
      const args = new UpdateParamsBuilder(makeConfig()).build(makeArgs());

      Object.values(args).forEach((value) => {
        expect(value).not.toContain("config");
      });
    });
  });
});

function makeConfig({
  path = "config_path",
  repo = "config_repo",
  outputPath = "config_outputPath",
  org = "config_org",
  sourceBranch = "config_sourceBranch",
  outputBranch = "config_outputBranch",
  commitMessage = "config_commit",
  pr = false,
} = {}): Config {
  return {
    sourcePath: path,
    pr,
    repo,
    outputPath,
    org,
    sourceBranch,
    outputBranch,
    commitMessage,
    githubAccessToken: "token",
  };
}

function makeArgs({
  path = "path",
  org = "org",
  repo = "repo",
  outputPath = "outputPath",
  sourceBranch = "sourceBranch",
  outputBranch = "outputBranch",
  message = "mesage",
  set = "[bla]=yo",
  remove = "[bla2]",
  pr = true,
} = {}): UpdateArgs {
  return {
    sourcePath: path,
    message,
    repo,
    org,
    outputBranch,
    outputPath,
    sourceBranch,
    remove,
    set,
    pr,
  };
}
