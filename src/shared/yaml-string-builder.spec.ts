import { YamlStringBuilder } from './yaml-string-builder';
import * as YAML from 'yaml';

const yamlFile = `
  name: test_file
  some:
    obj:
      property: bla
`

describe('yaml file builder', () => {
  it('should should update value at path', () => {
    const output = new YamlStringBuilder().haystack(yamlFile).setValue('some.obj.property', 'test_value').build();
    const yaml = YAML.parse(output);

    expect(yaml.some.obj.property).toBe('test_value');
  })
  it('should create value at path', () => {
    const output = new YamlStringBuilder().haystack(yamlFile).setValue('some.test.prop', 'test_value').build();
    const yaml = YAML.parse(output);

    expect(yaml.some.test.prop).toBe('test_value');
  })
})