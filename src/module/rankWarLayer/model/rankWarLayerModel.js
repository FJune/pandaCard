
/**
 ** @Author:pandayu
 ** @Version:1.0
 ** @DateTime:2018-09-09
 ** @Project:pandaCard CardGame
 ** @Contact: QQ:815099602
 **/
 var rankWarLayerModel = {
    getPaiHang:function (id,begain,end) {
        Network.getInstance().send({
            task:"rank.getinfo",
            id:id,
            b:begain,
            e:end
        });
    }
}