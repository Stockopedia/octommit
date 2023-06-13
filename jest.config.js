module.exports = {
  roots: ["<rootDir>/src"],
  transform: {
    "^.+\\.tsx?$": [
      "ts-jest",
      {
        diagnostics: {
          ignoreCodes: [151001],
        },
      },
    ],
  },
  testRegex: "(\\.|/)(test|spec)\\.tsx?$",
  testPathIgnorePatterns: [
    "(\\.|/)(integration.test|integration.spec)\\.tsx?$",
  ],
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
  coverageReporters: ["json-summary", "text", "lcov"],
  collectCoverage: true,
};
