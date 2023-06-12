const Path = require("path");
const configPath = Path.resolve(
  __dirname,
  process.argv[2] === "run" ? "./config.json" : "./config.dev.json"
);
const config = require(configPath);
module.exports = config;
module.exports.configPath = configPath;
