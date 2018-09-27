
/**
 ** @Author:pandayu
 ** @Version:1.0
 ** @DateTime:2018-09-09
 ** @Project:pandaCard CardGame
 ** @Contact: QQ:815099602
 **/
var bothFightModel = {
    //获取排行榜的数据
    getRank:function (id,start,end) {
        Network.getInstance().send({
            task:"rank.getinfo",
            id:id,
            b:start,
            e:end
        });
    },
    //获取战斗记录的数据
    getRecord:function () {
        Network.getInstance().send({
            task:"both.stagelist"
        });
    },
    //发送开始战斗的数据  后期去掉win
    stagebegin:function (id) {
        Network.getInstance().send({
            task:"both.stagebegin",
            id:id
        });
    },
    //获取对方的对战信息
    getBattleInfo:function(id) {
        Network.getInstance().send({
            task:"getinfo.battle",
            id:id
        });
    },
    //发送战斗结束的数据
    sendBattle:function(id,result){
        Network.getInstance().send({
            task:"both.stage",
            id:id,
            win:result  //1是胜利 0是失败
        });
    },
    //购买对战次数
    buyBothCount:function () {
        Network.getInstance().send({
            task:"both.buycount"
        });
    },
    //刷新对战的列表
    sendBothRefresh:function () {
        Network.getInstance().send({
            task:"both.refresh"
        });
    },
};