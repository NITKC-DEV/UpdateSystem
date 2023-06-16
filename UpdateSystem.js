const pack = require('./package.json');
const Path =require("path");
const db = require("./functions/db.js");
const Enquirer = require("enquirer");
const VersionList = require("./VersionList").versions;
const EnvPath=require("./EnvironmentPath.js");
const {setEnvPath} = require("./EnvironmentPath");


(async() => {
    await modeBranch(process.argv[2]);
    await db.close();
})();

/***
 * Branch processing by mode
 * @param {string} mode Running type
 */
async function modeBranch(mode) {
    switch(mode) {
        case "test":
            global.mode=mode;
            await testMord();
            break;
        case "dev":
        case "run":
            global.mode=mode;
            await productMode();
            break;
        case undefined:
            await modeChoice();
            break;
        default:
            console.log("Cannot find the mode "+mode);
            await modeChoice();
            break;
    }
}

/***
 * Running process of test mode
 */
async function testMord() {
    let runType;
    await (async() => {
        const testRunSet = {
            type: "select",
            name: "setRunningType",
            message: "Please select running type",
            choices: ["Update", "Outdate", "Both"]
        };
        runType = (await Enquirer.prompt(testRunSet)).setRunningType;
    })();
    global.targetPath=Path.resolve(__dirname, "../update-test");
    switch (runType) {
        case "Update":
            await RunUpdate();
            break;
        case "Outdate":
            await RunOutdate();
            break;
        case "Both":
            await RunUpdate();
            await RunOutdate();
    }
    
}

/***
 * Running Update.js in ./test/
 */
async function RunUpdate(){
    const Update = require("./test/Update.js");
    await Update.update();
}

/***
 * Running Outdate.js in ./test/
 */
async function RunOutdate(){
    const Outdate = require("./test/Outdate.js");
    await Outdate.outdate();
}

/***
 * Running process
 */
async function productMode() {
    let targetV;
    await (async() => {
        const targetSelect = {
            type: "select",
            name: "setTargetVer",
            message: "Please select the update (outdate) destination",
            choices: VersionList.map(elem => elem.version)
        };
        targetV = (await Enquirer.prompt(targetSelect)).setTargetVer;
    })();
    await setEnvPath();
    global.targetPath=Path.resolve(__dirname, "../bot-main");
    
    let mainPack = require(Path.resolve(targetPath,"/package.json"));
    const mainV = mainPack.version;
    console.log(`${mainV} ---> ${targetV}`);
    
    const versions = require('./VersionList.json').versions;
    const targetInd = versions.findIndex(versionData => versionData.version === targetV);
    const mainInd = versions.findIndex(versionData => versionData.version === mainV);
    
    if(targetInd> mainInd) {
        for(let i = mainInd + 1; i <= targetInd; i++) {
            if(versions[i].update === true) {
                console.log(`Update v${versions[i - 1].version} to v${versions[i].version}`);
                const Update = require(`./${versions[i].version}/Update.js`);
                await Update.update();
            }
            else {
                console.log(`No updates between v${versions[i - 1].version} and v${versions[i].version}`);
            }
        }
    }
    else if(targetInd < mainInd) {
        for(let i = mainInd; i < targetInd + 1; i--) {
            if(versions[i].outdate === true) {
                console.log(`Outdate v${versions[i].version} to v${versions[i - 1].version}`);
                const Outdate = require(`./${versions[i].version}/Outdate.js`);
                await Outdate.outdate();
            }
            else {
                console.log(`No outdates between v${versions[i].version} and v${versions[i - 1].version}`);
            }
        }
    }
    else if(targetInd === mainInd) {
        console.log("No updates needed.")
    }
}

/***
 *Select running mode
 */
async function modeChoice() {
    await(async() => {
        const modeSelect={
            type:"select",
            name:"setMode",
            message:"Please select running mode",
            choices: ["test","dev","run"]
        }
        await modeBranch((await Enquirer.prompt(modeSelect)).setMode);
    })();
}