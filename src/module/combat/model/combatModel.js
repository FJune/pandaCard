
/**
 ** @Author:pandayu
 ** @Version:1.0
 ** @DateTime:2018-09-09
 ** @Project:pandaCard CardGame
 ** @Contact: QQ:815099602
 **/
var combatModel = {
    stagePass:function(id,lev,isboss,iswin){
        Network.getInstance().send({
            task:'stage.pass',
            id:id,
            lev:lev,
            isboss:isboss,
            win:iswin
        });
    }
}
var commanderModel = {
    //技能升級
    sillLevelUp:function(cmdid,skillid,usediamond,count){
        Network.getInstance().send({
            task:'commander.skillup',
            id:cmdid,
            skillid:skillid,
            usediamond:usediamond,
            count:count
        });
    },
//    军衔进阶
    rank:function(cmdid,usediamond){
        Network.getInstance().send({
            task:'commander.mrankup',
            id:cmdid,
            usediamond:usediamond,
        });
    },

    //载具升级
    vehicleUp:function(commandId, vehicleId){//指挥官ID和载具ID
        Network.getInstance().send({
            task:'commander.weaponup',
            id:commandId,
            weaponid:vehicleId
        });
    },

    //更换载具
    vehicleChange:function(commandId, vehicleId){//指挥官ID和载具ID
        Network.getInstance().send({
            task:'commander.changeweapon',
            id:commandId,
            weaponid:vehicleId
        });
    },

    //技能使用时间
    skillUseTime:function(commanderId, skillId){
        Network.getInstance().send({
            task:'commander.skilluse',
            id:commanderId,
            skillid:skillId
        });
    },
//昵称更改
    nickChange:function(nick){
        Network.getInstance().send({
            task:'role.rename',
            name:nick
        });
    },

    //离线收益
    offlineEarning:function(){
        Network.getInstance().send({
            task:'role.getofflineprofit'
        });
    },
    //乱世佳人
    dateEvn:function(){
        Network.getInstance().send({
            task:'alliancegirl.tryst'
        });
    },

    //乱世佳人奖品领取
    dateGetEvent:function(id){
        Network.getInstance().send({
            task:'alliancegirl.getreward',
            id:id
        });
    },

    coolElimi:function(type, pos, comId){
        Network.getInstance().send({
            task:'other.costcd',
            typ:type,
            pos:pos,
            id:comId,
        });
    },
};