
/**
 ** @Author:pandayu
 ** @Version:1.0
 ** @DateTime:2018-09-09
 ** @Project:pandaCard CardGame
 ** @Contact: QQ:815099602
 **/
 recoverModel = {
    //分解
    breakFunction:function (id_array) {
        Network.getInstance().send({
            task:"depot.reclaim",
            ids:id_array
        });
    },
    
    //重生
    restartFunction:function (id_array) {
        Network.getInstance().send({
            task:"depot.reborn",
            ids:id_array
        });
    },
    //士兵分解
    soldierBreakFunction:function (array) {
        Network.getInstance().send({
            task:"soldier.reclaim",
            ids:array
        });
    },
    //士兵重生
    soldierRestartFunction:function (id_array){
        Network.getInstance().send({
            task:"soldier.reborn",
            ids:id_array
        });
    }
    
}