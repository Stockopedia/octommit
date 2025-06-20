import { get, set, unset } from "lodash";
import * as YAML from "yaml";

export class YamlStringBuilder {
  private file!: object;

  haystack(file: string) {
    this.file = YAML.parse(file);
    return this;
  }

  setValue(path: string, value: string | number | boolean) {
    this.file = set(this.file, this.makePath(path), value);
    return this;
  }

  pushValue(path: string, value: string | number | boolean) {
    const pathArray = this.makePath(path);
    const existingArray = get(this.file, pathArray) ?? [];
    this.file = set(
      this.file,
      pathArray,
      Array.from(new Set([...existingArray, value])),
    );

    return this;
  }

  removeItem(path: string, value: string | number | boolean) {
    const pathArray = path.split(":");
    this.file = set(
      this.file,
      pathArray,
      get(this.file, pathArray)?.filter((v: string) => v !== value),
    );

    return this;
  }

  deleteValue(path: string) {
    const pathArray = path.split(":");
    unset(this.file, pathArray);

    return this;
  }

  build() {
    return YAML.stringify(this.file);
  }

  private makePath(path: string) {
    return path
      .split(/(?<!\\):/g)
      .map((x) => (x.includes("\\:") ? x.replace("\\:", ":") : x));
  }
}
