
/**
 ** @Author:pandayu
 ** @Version:1.0
 ** @DateTime:2018-09-09
 ** @Project:pandaCard CardGame
 ** @Contact: QQ:815099602
 **/
 var arenaModel = {
    //刷新
    refreshArena:function () {
        Network.getInstance().send({
            task:"arena.refresh"
        });
    },
    //排行
    getArenaRank:function (id,start,end) {
        Network.getInstance().send({
            task:"rank.getinfo",
            id:id,
            b:start,
            e:end
        });
    },
    //购买次数
    buyCount:function () {
        Network.getInstance().send({
            task:"arena.buycount"
        });
    },
    //战斗开始
    startFight:function (pos) {
        Network.getInstance().send({
            task:"arena.stagebegin",
            pos:pos
        });
    },
    //战斗结束
    endFight:function (pos,num,typ,win) {
        Network.getInstance().send({
            task:"arena.stage",
            pos:pos,
            num:num,
            typ:typ,
            win:win
        });
    },
    //获取玩家数据
    getPlayerInfo:function (id) {
        Network.getInstance().send({
            task:"getinfo.battle",
            id:id
        });
    }
}