
/**
 ** @Author:pandayu
 ** @Version:1.0
 ** @DateTime:2018-09-09
 ** @Project:pandaCard CardGame
 ** @Contact: QQ:815099602
 **/
 /*
*  by xiongrui 2016 11 14
* */
var quickFightModel = {
    //快速战斗
    startQuickFight:function () {
        Network.getInstance().send({
            task:"battle.fast"
        });
    }
}