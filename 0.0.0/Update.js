const db=require("../functions/db.js");
exports.update= function(){
    changeCCC();
};

function changeCCC(){
    const ccconfig=require(targetPath+"/CCConfig.json");
    for(const guild of ccconfig.guilds){
        for(const category of guild.categories){
            if(category.ID!=="0000000000000000000"){
                db.insert ("main", "CC-categories", {
                    "ID": category.ID,
                    "name": category.name,
                    "guildID": guild.ID
                });
            }
            for(const channel of category.channels){
                if(channel.ID!=="0000000000000000000"&&channel.ID!=="") {
                    db.insert ("main", "CC-channels", {
                        "ID": channel.ID,
                        "name": channel.name,
                        "creatorID": channel.creatorID,
                        "createTime": channel.createTime,
                        "thereRole": channel.thereRole !== undefined ? channel.thereRole : false,
                        "roleID": channel.roleID !== undefined ? channel.roleID : "",
                        "categoryID": category.ID,
                        "guildID": guild.ID
                    });
                }
            }
        }
    }
}