const fs = require ('fs');
const db = require ('../functions/db.js');

/***
 * @returns {Promise<void>}
 */
exports.outdate = async function () {
    await changeDBCC ();
}

async function changeDBCC () {
    let ccconfig = {
        "guilds": [
            {
                "ID": "0000000000000000000",
                "categories": [
                    {
                        "ID": "0000000000000000000",
                        "name": "",
                        "allowRole": false,
                        "active": false,
                        "channels": [
                            {
                                "ID": "0000000000000000000",
                                "name": "",
                                "creatorId": "0000000000000000000",
                                "createTime": 0,
                                "thereRole": false,
                                "roleID": "0000000000000000000",
                                "roleName": ""
                            }
                        ]
                    }
                ]
            }
        ]
    };
    
    let ccchannels = await db.find ("main", "CC-channels", {});
    let cccategories = await db.find ("main", "CC-categories", {});
    while (cccategories.length > 0) {
        const categoriesData = await cccategories.filter (category => category.guildID === cccategories[0].guildID);
        let guildConfig = {
            "ID": cccategories[0].guildID,
            "categories": [
                {
                    "ID": "0000000000000000000",
                    "name": "キャンセル",
                    "allowRole": false,
                    "channels": []
                }
            ]
        };
        for (let i = 0; i < categoriesData.length; i++) {
            let channelsData = ccchannels.filter (channel => channel.categoryID === categoriesData[i].ID);
            let categoryConfig = {
                "ID": categoriesData[i].ID,
                "name": categoriesData[i].name,
                "allowRole": categoriesData[i].allowRole,
                "channels": [
                    {
                        "ID": "",
                        "name": "",
                        "creatorId": "0000000000000000000",
                        "createTime": 0,
                        "thereRole": false,
                        "roleID": "0000000000000000000",
                        "roleName": ""
                    }
                ]
            };
            for (let j = 0; j < channelsData.length; j++) {
                categoryConfig.channels.push ({
                    "ID": channelsData[j].ID,
                    "name": channelsData[j].name,
                    "creatorID": channelsData[j].creatorID,
                    "createTime": channelsData[j].createTime,
                    "thereRole": channelsData[j].thereRole,
                    "roleID": channelsData[j].thereRole === true ? channelsData[j].roleID : undefined,
                    "roleName": channelsData[j].thereRole === true ? channelsData[j].roleName : undefined
                });
            }
            guildConfig.categories.push (categoryConfig);
        }
        ccconfig.guilds.push (guildConfig);
        cccategories = cccategories.filter (category => category.guildID !== cccategories[0].guildID);
    }
    const ccconfigJ = JSON.stringify (ccconfig, null, 2);
    try {
        fs.writeFileSync (targetPath + "/CCConfig.json", ccconfigJ, "utf-8");
    }
    catch (e) {
        console.log (e);
    }
    
    return;
}