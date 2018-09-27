
/**
 ** @Author:pandayu
 ** @Version:1.0
 ** @DateTime:2018-09-09
 ** @Project:pandaCard CardGame
 ** @Contact: QQ:815099602
 **/
 var resourceFight = {
  //鼓舞
    startInspire:function () {
        Network.getInstance().send({
            task:"resource.inspire"
        });
    },
    //开始战斗
    startFight:function (gata_id) {
        Network.getInstance().send({
            task:"resource.stagebegin",
            id:gata_id
        });
    },
    //结束战斗 typ 1 一键扫荡
    stopFight:function (gata_id,win,typ) {
        Network.getInstance().send({
            task:"resource.stage",
            id:gata_id,
            win:win,
            typ:typ
        });
    },
    //获取城镇占领数据
    getCityInfo:function () {
        Network.getInstance().send({
            task:"resource.getinfo"
        });
    },
    //获取对方阵容信息
    getZhenrongInfo:function (playerid) {
        Network.getInstance().send({
            task:"getinfo.battle",
            id:playerid
        });
    }
}