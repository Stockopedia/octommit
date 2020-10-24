#! /usr/bin/env node
import "reflect-metadata";
import { container } from './container'
import { Orchestrator } from './orchestrator'
import * as chalk from 'chalk';

const client = container.resolve(Orchestrator)
  .create()
try {
  client.parse(process.argv);
}
catch(e) {
  client.log(`Error: ${chalk.red(e)}`)
}