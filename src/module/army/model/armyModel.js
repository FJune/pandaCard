
/**
 ** @Author:pandayu
 ** @Version:1.0
 ** @DateTime:2018-09-09
 ** @Project:pandaCard CardGame
 ** @Contact: QQ:815099602
 **/
 /**
 */
var armyModel = {
    changeBattle:function(soldierId,pos){
        Network.getInstance().send({task:'army.gobattle',id:soldierId,pos:pos});
    },
//布阵
    embattle:function(embattleArray){
        Network.getInstance().send({task:'army.embattle', em:embattleArray});
    },

    //士兵突破
    break:function(armyid){
        Network.getInstance().send({task:'soldier.break', id:armyid});
    },
    //士兵进阶
    evolution:function(armyid){
        Network.getInstance().send({task:'soldier.evolve', id:armyid});
    },
    //士兵改造
    reform:function(armyid){
        Network.getInstance().send({task:'soldier.superevolve', id:armyid});
    },
    //士兵觉醒
    awake:function(armyid){
        Network.getInstance().send({task:'soldier.awaken', id:armyid});
    },
    //穿戴觉醒装备
    wear:function(armyid,posId) {
        Network.getInstance().send({task:'soldier.wear', id:armyid,pos:posId});
    },
    //觉醒材料的合成
    compose:function(equid,num){
        Network.getInstance().send({task:'soldier.compose', id:equid,num:num});
    },
    //    军衔进阶
    rank:function(armyid){
        Network.getInstance().send({
            task:'soldier.evolve',
            id:armyid
        });
    },
    //升级
    upGrade:function(armyid,count){
        Network.getInstance().send({
            task:'soldier.levelup',
            id:armyid,
            count:count
        });
    },

    //装备配饰穿戴
    equipDress:function(armyid, equipId){
        Network.getInstance().send({
            task:'army.wear',
            pos:armyid,
            itemid:equipId
        });
    },

    //卸下穿戴
    unsnatchDress:function(armyid, equipType){
        Network.getInstance().send({
            task:'army.take_off',
            pos:armyid,
            itemtype:equipType
        });
    },
    //装备配饰强化
    eqStrengthen:function(id,num){
        Network.getInstance().send({
            task:'depot.strengthen',
            id:id,
            num:num
        });
    },
    //装备配饰精炼
    eqRefinethen:function(id,uid){
        Network.getInstance().send({
            task:'depot.refine',
            id:id,
            uid:uid
        });
    },
    //装备锻造
    eqForginthen:function(id){
        Network.getInstance().send({
            task:'depot.forging',
            id:id
        });
    },
    //一键装备
    wearAll:function(pos,equArray){
        Network.getInstance().send({
            task:'army.wearall',
            pos:pos,
            itemid:equArray
        });
    },
    //一键强化
    strengthenAll:function(pos){
        Network.getInstance().send({
            task:'depot.strengthenall',
            pos:pos
        });
    },
    //一键精炼
    refineAll:function(pos){
        Network.getInstance().send({
            task:'depot.refineall',
            pos:pos
        });
    },
    //伙伴下阵
    partnerLose:function(pos){
        Network.getInstance().send({
            task:'army.lose_companion',
            pos:pos
        });
    },

    //伙伴解锁
    partnerDeblock:function(pos){
        Network.getInstance().send({
            task:'army.unlock_companion',
            pos:pos
        });
    },

    partnerAdd:function(partnerId, pos){
        Network.getInstance().send({
            task:'army.add_companion',
            id:partnerId,
            pos:pos
        });
    },
};