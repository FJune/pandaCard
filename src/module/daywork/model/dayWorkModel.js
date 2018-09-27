
/**
 ** @Author:pandayu
 ** @Version:1.0
 ** @DateTime:2018-09-09
 ** @Project:pandaCard CardGame
 ** @Contact: QQ:815099602
 **/
var dayWorkModel = {
    //获取排行榜的数据
    getReward:function (id) {
        Network.getInstance().send({
            task:"task.finish",
            id:id
        });
    },
    //发送刷新任务的消息
    sendRefresh:function (id) {
        Network.getInstance().send({
            task:"task.refresh"
        });
    },
};