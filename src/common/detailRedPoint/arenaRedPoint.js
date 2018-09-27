
/**
 ** @Author:pandayu
 ** @Version:1.0
 ** @DateTime:2018-09-09
 ** @Project:pandaCard CardGame
 ** @Contact: QQ:815099602
 **/
 //xiongrui 01 18
var arenaRedPoint = {
    mainArenaRedPoint:function (data) {
        var result = 3;
        var isRed = null;
        var limit_lv = INTERFACECFG[1].level;
        if(GLOBALDATA.base.lev>=limit_lv){
            if(data==null){
                isRed = this.mainPanleJudgeArena();
                if(isRed){
                    result = 1;
                }else{
                    result = 2;
                }
            }else{
                var keyArr = data.key.split('.');
                if((keyArr[0] == "arena"&&data.data.hasOwnProperty("num"))){
                    isRed = this.mainPanleJudgeArena();
                }
                if(isRed == null){
                    result = 3;
                }else if(isRed == true){
                    result = 1;
                }else if(isRed == false){
                    result = 2;
                }
            }
        }
        return result;
    },

    mainPanleJudgeArena:function () {
        var isRed = false;
        if(GLOBALDATA.arena.num>0){
            isRed = true
        }
        return isRed;
    },

    ArenaPanleRedPoint:function (data) {

    },
}