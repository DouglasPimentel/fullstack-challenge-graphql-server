import path from "path";

const root = path.resolve(__dirname);

export default {
  displayName: "tests",
  rootDir: root,
  roots: ["<rootDir>"],
  testMatch: [
    "<rootDir>/**/__tests__/**/*.[jt]s?(x)",
    "**/?(*.)+(spec|test).[tj]s?(x)",
  ],
  preset: "ts-jest",
  testEnvironment: "node",
  cacheDirectory: "/tmp/jest_rs",
  clearMocks: true,
  collectCoverage: true,
  coverageDirectory: "coverage",
  coveragePathIgnorePatterns: ["/node_modules/"],
  coverageProvider: "babel",
  testPathIgnorePatterns: ["/node_modules/"],
  transformIgnorePatterns: ["/node_modules/"],
};
