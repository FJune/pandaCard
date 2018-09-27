
/**
 ** @Author:pandayu
 ** @Version:1.0
 ** @DateTime:2018-09-09
 ** @Project:pandaCard CardGame
 ** @Contact: QQ:815099602
 **/
 var bossFightModel = {
    //获取功勋奖励方法
    getReword:function (id,type) {
        Network.getInstance().send({
            task:"boss.getexploit",
            id:id,
            typ:type        //1 普通 2 一键领取
        });
    },
    //获取功勋功能 排行榜数据
    getRankData:function (id,start,end) { // id 4.boss伤害.5.功勋   start 起始位置  end 结束位置
        Network.getInstance().send({
            task:"rank.getinfo",
            id:id,
            b:start,
            e:end
        });
    },
    //添加一个boss  测试
    addBossTest:function () {
        Network.getInstance().send({
            task:"boss.test"
        });
    },
    //开始战斗 
    begainFight:function (boosid,name,type) {
        if(name==null){
            Network.getInstance().send({
                task:"boss.begin",
                id:boosid,
                typ:type
            });
        }else{
            Network.getInstance().send({
                task:"boss.begin",
                id:boosid,
                pn:name,  //boss归属玩家名字
                typ:type
            });
        }
    },
    //结束战斗
    endFight:function (bossid,damage,name,type) {
        if(name==null){
            Network.getInstance().send({
                task:"boss.challenge",
                id:bossid,
                damage:damage,
                typ:type
            });
        }else{
            Network.getInstance().send({
                task:"boss.challenge",
                id:bossid,
                damage:damage,
                pn:name,
                typ:type
            });
        }
    },
    //购买挑战次数
    buyFightNum:function (num) {
        Network.getInstance().send({
            task:"boss.buychallenge",
            num:num
        });
    },
    //挑战卷兑换对战次数
    duiHuanFightNum:function (num) {
        Network.getInstance().send({
            task:"boss.changecount",
            num:num
        });
    }
}