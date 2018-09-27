
/**
 ** @Author:pandayu
 ** @Version:1.0
 ** @DateTime:2018-09-09
 ** @Project:pandaCard CardGame
 ** @Contact: QQ:815099602
 **/
 /**
 */
var welfareModel = {
    //刷新活动
    activityRefresh:function(){
        Network.getInstance().send({
            task:"activity.refresh"
        });
    },
    //购买活动操作
    activityOpt:function(id,type,pos,num){
        if(pos == null && num == null){
            Network.getInstance().send({task:"activity.opt",id:id,typ:type});
        }else if(pos == null){
            Network.getInstance().send({task:"activity.opt",id:id,typ:type,num:num});
        }else if(num == null){
            Network.getInstance().send({task:"activity.opt",id:id,typ:type,pos:pos});
        }else{
            Network.getInstance().send({task:"activity.opt",id:id,typ:type,pos:pos,num:num});
        }
    },
    //领取活动奖励
    activityFinish:function(id){
        Network.getInstance().send({
            task:"activity.finish",
            id:id
        });
    },
    //领取每日签到
    activityMonthreward:function(){
        Network.getInstance().send({
            task:"activity.monthreward"
        });
    },
    //购买基金
    activityBuyfund:function(){
        Network.getInstance().send({
            task:"activity.buyfund"
        });
    },
    //领取基金奖励
    activityFundreward:function(id){
        Network.getInstance().send({
            task:"activity.fundreward",
            id:id
        });
    },

};