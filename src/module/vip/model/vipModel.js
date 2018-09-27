
/**
 ** @Author:pandayu
 ** @Version:1.0
 ** @DateTime:2018-09-09
 ** @Project:pandaCard CardGame
 ** @Contact: QQ:815099602
 **/
 var vipModel = {
    //vip 相关方法

    //购买vip礼包
    buyVipGoods:function (viplev) {
        Network.getInstance().send({
            task:"pay.vipitem",
            id:viplev,
        });
    },
}