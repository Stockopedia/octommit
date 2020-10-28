import * as YAML from "yaml";

import { YamlStringBuilder } from "./yaml-string-builder";

const yamlFile = `
  name: test_file
  some:
    obj:
      prop.something: bla
`;

describe("yaml file builder", () => {
  it("should should update value at path", () => {
    const output = new YamlStringBuilder()
      .haystack(yamlFile)
      .setValue("some:obj:property", "test_value")
      .build();
    const yaml = YAML.parse(output);

    expect(yaml.some.obj.property).toBe("test_value");
  });
  it("should create value at path", () => {
    const output = new YamlStringBuilder()
      .haystack(yamlFile)
      .setValue("some:test:prop.something", "test_value")
      .build();
    const yaml = YAML.parse(output);

    expect(yaml.some.test["prop.something"]).toBe("test_value");
  });
});
