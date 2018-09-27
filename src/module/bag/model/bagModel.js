
/**
 ** @Author:pandayu
 ** @Version:1.0
 ** @DateTime:2018-09-09
 ** @Project:pandaCard CardGame
 ** @Contact: QQ:815099602
 **/
 /**
 */
var bagModel = {
    //兑换金币
    sendBuyGold:function (num,type) {
        Network.getInstance().send({
            task:"exchange.change",
            num:num,
            typ:type
        });
    },
    //合成
    sendCompose:function (id,num) {
        Network.getInstance().send({
            task:"knapsack.compose",
            id:id,
            num:num
        });
    },
    //使用
    useThing:function (id,num,pos) {
        Network.getInstance().send({
            task:"knapsack.use",
            id:id,
            num:num,
            pos:pos
        });
    }
};