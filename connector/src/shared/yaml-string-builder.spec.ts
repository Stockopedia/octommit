import * as YAML from "yaml";

import { YamlStringBuilder } from "./yaml-string-builder";

const yamlFile = `
  name: test_file
  some:
    obj:
      prop.something: bla
  other:
    arr:
      - val
      - keep
  a:
    other: val
    prop:
      to:
        remove: bla
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
  it("should remove array item at path", () => {
    const output = new YamlStringBuilder()
      .haystack(yamlFile)
      .removeItem("other:arr", "val")
      .build();
    const yaml = YAML.parse(output);

    expect(yaml.other.arr).toEqual(["keep"]);
  });
  it("should add item to array at path", () => {
    const output = new YamlStringBuilder()
      .haystack(yamlFile)
      .pushValue("other:arr", "new")
      .build();
    const yaml = YAML.parse(output);

    expect(yaml.other.arr.sort()).toEqual(["val", "keep", "new"].sort());
  });
  it("should delete property at path", () => {
    const output = new YamlStringBuilder()
      .haystack(yamlFile)
      .deleteValue("a:prop:to:remove")
      .build();
    const yaml = YAML.parse(output);

    expect(yaml.a.prop.to.remove).toBeUndefined();
    expect(yaml.a.other).toBeDefined();
  });
  describe("when array does not exist", () => {
    it("should not fail when trying to remove", () => {
      expect(() => {
        const output = new YamlStringBuilder()
          .haystack(yamlFile)
          .removeItem("does:not:exist", "val")
          .build();
        YAML.parse(output);
      }).not.toThrowError();
    });
    it("should create array when trying to add item", () => {
      const output = new YamlStringBuilder()
        .haystack(yamlFile)
        .pushValue("does:not:exist", "val")
        .build();
      const yaml = YAML.parse(output);

      expect(yaml.does.not.exist).toEqual(["val"]);
    });
  });
  describe("given property does not exist", () => {
    it("should not error why trying to remove", () => {
      expect(() => {
        const output = new YamlStringBuilder()
          .haystack(yamlFile)
          .deleteValue("does:not:exist")
          .build();
        YAML.parse(output);
      }).not.toThrowError();
    });
  });
});
