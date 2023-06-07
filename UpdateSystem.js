const pack=require('./package.json');
let ver;
let mainpack;

switch (process.argv[2]){
    case "test":
        mainpack=require("../update-test/package.json");
        ver="0.0.0"
        break;
    case "dev":
        mainpack=require("../update-test/package.json");
        ver=pack.version;
        break;
    case "run":
        mainpack=require("../bot-main/package.json");
        ver=pack.version;
        break;
    default:
        console.error("\u001b[33mPlease set command line argument to test, dev or run\u001b[0m");
        console.error("Running type set to test");
        mainpack=require("../update-test/package.json");
        ver="0.0.0";
        break;
}
const mainver=mainpack.version;

console.log(`${mainver} ---> ${ver}`);

const versions=require('./VersionList.json').versions;
const ind=versions.findIndex(versionData=>versionData.version===ver);
const mainInd=versions.findIndex(versionData=>versionData.version===mainver);

if(ind>mainInd){
    for(let i=mainInd+1;i<=ind;i++){
        if(versions[i].update===true){
            console.log(`Update v${versions[i-1].version} to v${versions[i].version}`);
            const Update=require(`./${version}/Update.js`);
            Update.update;
        }
        else{
            console.log(`No updates between v${versions[i-1].version} and v${versions[i].version}`);
        }
    }
}
else if(ind<mainInd){
    for(let i=mainInd;i<ind+1;i--){
        if(versions[i].outdate===true){
            console.log(`Outdate v${versions[i].version} to v${versions[i-1].version}`);
            const Outdate=require(`./${version}/Outdate.js`);
            Outdate.outdate;
        }
        else{
            console.log(`No outdates between v${versions[i].version} and v${versions[i-1].version}`);
        }
    }
}
if(ind===mainInd){
    console.log("No updates needed.")
}