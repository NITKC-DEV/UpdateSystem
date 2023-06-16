const db = require ("../functions/db.js");

/***
 * @returns {Promise<void>}
 */
exports.update = async function () {
    await changeCCC ();
};

async function changeCCC () {
    const ccconfig = require (targetPath + "/CCConfig.json");
    for (const guild of ccconfig.guilds) {
        for (const category of guild.categories) {
            if (category.ID !== "0000000000000000000") {
                await db.insert ("main", "CC-categories", {
                    "ID": category.ID,
                    "name": category.name,
                    "allowRole": category.allowRole,
                    "guildID": guild.ID
                });
            }
            for (const channel of category.channels) {
                if (channel.ID !== "0000000000000000000" && channel.ID !== "") {
                    await db.insert ("main", "CC-channels", {
                        "ID": channel.ID,
                        "name": channel.name,
                        "creatorID": channel.creatorID,
                        "createTime": channel.createTime,
                        "thereRole": channel.thereRole !== undefined ? channel.thereRole : false,
                        "roleID": channel.roleID !== undefined ? channel.roleID : "",
                        "roleName": channel.roleName !== undefined ? channel.roleName : "",
                        "categoryID": category.ID,
                        "guildID": guild.ID
                    });
                }
            }
        }
    }
    return;
}