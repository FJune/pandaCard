
/**
 ** @Author:pandayu
 ** @Version:1.0
 ** @DateTime:2018-09-09
 ** @Project:pandaCard CardGame
 ** @Contact: QQ:815099602
 **/
 /**
 */
var starHeroModel = {
    //获取排行榜的数据
    getRank:function (id,start,end) {
        Network.getInstance().send({
            task:"rank.getinfo",
            id:id,
            b:start,
            e:end
        });
    },
    //获取录入的数据
    getRecordInfo:function(id){
        Network.getInstance().send({
            task:"general.getinfo",
            soldier_id:id
        });
    },
    //录入士兵
    sendRecord:function(id){
        Network.getInstance().send({
            task:"general.record",
            soldier_id:id
        });
    },
};