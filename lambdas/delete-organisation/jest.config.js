const tsconfig = require("./tsconfig.json");
const moduleNameMapper = require("tsconfig-paths-jest")(tsconfig);

module.exports = {
  moduleDirectories: ["node_modules", 'src'],
  moduleFileExtensions: ["ts", "js", "json"],
  transform: {
    "^.+\\.ts?$": "ts-jest"
  },
  testRegex: "(test.ts)$",
  verbose: true,
  moduleNameMapper
};