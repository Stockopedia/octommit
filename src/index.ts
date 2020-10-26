#! /usr/bin/env node
import "reflect-metadata";
import { container } from './container'
import { Orchestrator } from './orchestrator'

const client = container.resolve(Orchestrator)
  .create()
client.parse(process.argv);