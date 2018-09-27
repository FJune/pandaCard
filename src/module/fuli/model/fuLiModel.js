
/**
 ** @Author:pandayu
 ** @Version:1.0
 ** @DateTime:2018-09-09
 ** @Project:pandaCard CardGame
 ** @Contact: QQ:815099602
 **/
var fuLiModel = {
    //领取奖励
    getActivityFinish:function (id) {
        Network.getInstance().send({
            task:"activity.finish",
            id:id
        });
    },
};