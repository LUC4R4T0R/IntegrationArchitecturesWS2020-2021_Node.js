const NoElementFoundError = require("../custom_errors/NoElementFoundError");

exports.getSetting = async function (db, name){
    let value = await db.collection('settings').findOne({name: name});
    if(!value){
        throw new NoElementFoundError("NoElementFoundError: In the given Database no setting exists with the name: " + name + "!");
    }
    return value;
}

exports.setSetting = async function (db, setting){
    if(await db.collection('settings').findOne({name: setting.name}))
        await db.collection('settings').findOneAndUpdate({name: setting.name}, {'$set':{value: setting.value}});
    else
        throw new NoElementFoundError("NoElementFoundError: In the given Database no setting exists with the name: " + setting.name + "!");
}