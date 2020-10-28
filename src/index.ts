#! /usr/bin/env node

import "reflect-metadata";

import { container } from "./container";
import { Orchestrator } from "./orchestrator";

const client = container.resolve(Orchestrator).create();
try {
  client.parse(process.argv);
} catch (e) {
  client.log(e);
  process.exit(1);
}
