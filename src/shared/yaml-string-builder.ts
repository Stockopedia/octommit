import { set } from "lodash";
import * as YAML from "yaml";

export class YamlStringBuilder {
  private file!: object;

  haystack(file: string) {
    this.file = YAML.parse(file);
    return this;
  }

  setValue(path: string, value: string) {
    this.file = set(this.file, path.split(":"), value);
    return this;
  }

  build() {
    return YAML.stringify(this.file);
  }
}
