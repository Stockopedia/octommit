import "reflect-metadata";

import { container } from "./container";
import { Orchestrator } from "./orchestrator";
import { expect, describe, it } from "@jest/globals";

describe("orchestrator", () => {
  it("should be wired up correctly", () => {
    expect(() => container.resolve(Orchestrator).create()).not.toThrow();
  });
});
