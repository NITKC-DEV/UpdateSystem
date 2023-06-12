exports.setConfig=function() {
    const Path = require ("path");
    global.configPath = Path.resolve (
        __dirname,
        process.argv[2] === "run" ? "./config.json" : "./config.dev.json"
    );
    global.config = require (configPath);
    global.targetPath=Path.resolve (__dirname,"..",process.argv[2] === "run"?"bot-main":"update-test");
};