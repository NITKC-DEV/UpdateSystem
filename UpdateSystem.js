const pack = require ('./package.json');
let ver;
const envConfig = require ("./environmentPath.js");
envConfig.setConfig ();
let mainpack = require (targetPath + "/package.json");
const db = require ("./functions/db.js");

async function main() {
    switch (process.argv[2]) {
        case "test":
            ver = "0.0.0"
            break;
        case "dev":
            ver = pack.version;
            break;
        case "run":
            ver = pack.version;
            break;
        default:
            console.error ("\u001b[33mPlease set command line argument to test, dev or run\u001b[0m");
            console.error ("Running type set to test");
            ver = "0.0.0";
            break;
    }
    const mainver = mainpack.version;
    
    console.log (`${mainver} ---> ${ver}`);
    
    const versions = require ('./VersionList.json').versions;
    const ind = versions.findIndex (versionData => versionData.version === ver);
    const mainInd = versions.findIndex (versionData => versionData.version === mainver);
    
    if (ind > mainInd) {
        for (let i = mainInd + 1; i <= ind; i++) {
            if (versions[i].update === true) {
                console.log (`Update v${versions[i - 1].version} to v${versions[i].version}`);
                const Update = require (`./${versions[i].version}/Update.js`);
                await Update.update ();
            }
            else {
                console.log (`No updates between v${versions[i - 1].version} and v${versions[i].version}`);
            }
        }
    }
    else if (ind < mainInd) {
        for (let i = mainInd; i < ind + 1; i--) {
            if (versions[i].outdate === true) {
                console.log (`Outdate v${versions[i].version} to v${versions[i - 1].version}`);
                const Outdate = require (`./${versions[i].version}/Outdate.js`);
                await Outdate.outdate ();
            }
            else {
                console.log (`No outdates between v${versions[i].version} and v${versions[i - 1].version}`);
            }
        }
    }
    else if (ind === mainInd) {
        console.log ("No updates needed.")
    }
    
    if (process.argv[2] === "test" && versions[versions.length - 1].outdate === true) {
        console.log (`Outdate test`);
        const Outdate = require (`./0.0.0/Outdate.js`);
        await Outdate.outdate ();
    }
    db.close();
}
main();