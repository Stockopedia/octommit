import { beforeEach, describe, expect, it, jest } from "@jest/globals";
import { isEqual } from "lodash";
import * as YAML from "yaml";

import { GitClient } from "../../shared/git-client";
import { YamlStringBuilder } from "../../shared/yaml-string-builder";
import { UpdateArgs } from "./update-args";
import { UpdateCommand } from "./update-command";
import { UpdateParamsBuilder } from "./update-params-builder";

declare global {
  namespace jest {
    interface Expect {
      toMatchYaml(expected: string): any;
    }
  }
}

expect.extend({
  toMatchYaml(received: any, expected: any) {
    return {
      message: () => "yaml objects do not match",
      pass: isEqual(YAML.parse(received), YAML.parse(expected)),
    };
  },
});

describe("update command", () => {
  describe("when updating yaml file", () => {
    const gitClient = mockGitClient({
      getFile: jest.fn(() => ({
        data: `
          foo: test
          baz: some_value
          arr:
            - yo
            - other
        `,
        sha: "testSha",
      })),
      putFile: jest.fn(() => "test.url"),
      createPullRequest: jest.fn(() => "pr.url"),
    });
    const expectedFile = `foo: yo
bar: yo2
arr:
 - other
 - baz
some:
 deep:
   arr:
    - baz
testBool: true
testNumber: 42
`;
    const args = makeArgs();

    beforeEach(() => {
      jest.clearAllMocks();
    });

    it("should set values at paths in yaml file", async () => {
      await new UpdateCommand(
        gitClient,
        new YamlStringBuilder(),
        new UpdateParamsBuilder({} as any),
      ).action(args);

      expect(gitClient.putFile).toHaveBeenCalledWith(
        (expect as any).toMatchYaml(expectedFile),
        args.repo,
        args.org,
        args.sourceBranch,
        args.outputBranch,
        args.sourcePath,
        args.outputPath,
        args.message,
        "testSha",
      );
    });
    describe("when not creating a pr", () => {
      it("should return yaml file url", async () => {
        const result = await new UpdateCommand(
          gitClient,
          new YamlStringBuilder(),
          new UpdateParamsBuilder({} as any),
        ).action(makeArgs({ pr: false }));
        expect(gitClient.createPullRequest).toHaveBeenCalledTimes(0);
        expect(result).toBe("test.url");
      });
    });
    describe("when a pr should be created", () => {
      it("should return pr url", async () => {
        const result = await new UpdateCommand(
          gitClient,
          new YamlStringBuilder(),
          new UpdateParamsBuilder({} as any),
        ).action(args);

        expect(result).toBe("pr.url");
      });
    });
  });
});

function mockGitClient(methods?: any) {
  const Mock = jest.fn<() => GitClient>(() => methods);
  return new Mock();
}

function makeArgs({
  path = "path",
  org = "org",
  repo = "repo",
  outputPath = "outputPath",
  sourceBranch = "sourceBranch",
  outputBranch = "outputBranch",
  message = "mesage",
  set = [
    "[foo]=yo",
    "[bar]=yo2",
    "[arr[]]=baz",
    "[some:deep:arr[]]=baz",
    "[testBool]=true",
    "[testNumber]=42",
  ],
  remove = ["[baz]", "[arr[]]=yo"],
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
    set,
    remove,
    pr,
  };
}
