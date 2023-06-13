#! /usr/bin/env node

import "reflect-metadata";

import { container } from "./container";
import { Orchestrator } from "./orchestrator";

const client = container.resolve(Orchestrator).create();
try {
  client.parse(process.argv);
} catch (e: unknown) {
  client.log((e as Error).message);
  process.exit(1);
}
