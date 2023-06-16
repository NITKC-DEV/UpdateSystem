exports.setEnvPath=function () {
    const Path = require("path");
    global.configPath = Path.resolve(__dirname, global.mode === "run" ? "./config.json" : "./config.dev.json");
    global.config = require(configPath);
}