import * as YAML from 'yaml'
import { set } from 'lodash'

export class YamlFileBuilder {
  private file!: string;

  haystack(file: string) {
    this.file = file;
    return this;
  }
  setValue(path: string, value: string) {
    this.file = set(YAML.parse(this.file), path, value)
    return this;
  }

  build() {
    return this.file;
  }
}