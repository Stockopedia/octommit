#! /usr/bin/env node

import "reflect-metadata";
import * as dotenv from 'dotenv'
import { container } from './container'
import { Orchestrator } from './orchestrator'

const client = container.resolve(Orchestrator).withOptions(
  [
    ['--repo <repo>', 'Reopsitory'],
    ['--set <path>=<value>', 'Path to target and the desired value e.g. image.tag=bla'],
    ['--path <path>', 'Path to file in repo'],
    ['--outputPath <path>', 'Output path of file in repo']
  ]
).create();

if(process.env.NODE_ENV === 'production') {
  client.parse(process.argv);
}
else {
  client.delimiter('octommit$').show();  
}


//     console.log(set(YAML.parse(content), 'image.tag', 'bla'))
