
/**
 ** @Author:pandayu
 ** @Version:1.0
 ** @DateTime:2018-09-09
 ** @Project:pandaCard CardGame
 ** @Contact: QQ:815099602
 **/
 //xiongrui 01 17
var bossFightRedPoint = {
    mainBossRedPoint:function (data) {
        var result = 3;
        var isRed = null;
        if(data==null){
            isRed = this.mainPanleJudgeBoss();
            if(isRed){
                result = 1;
            }else{
                result = 2;
            }
        }else{
            var keyArr = data.key.split('.');
            if((keyArr[0] == "boss" && data.data.hasOwnProperty("da"))){
                isRed = this.mainPanleJudgeBoss();
            }
            if(isRed == null){
                result = 3;
            }else if(isRed == true){
                result = 1;
            }else if(isRed == false){
                result = 2;
            }
        }
        return result;
    },
    //判断主界面基地（资源掠夺）红点
    mainPanleJudgeBoss:function () {
        var isRed = false;
        var has_gongxun = false;
        var has_boss = false;
        //判断是否有功勋奖励可以领
        has_gongxun = this.isHasGongxun();
        //判断是否有boss
        for(key in GLOBALDATA.boss.list){
            has_boss = true;
            break;
        }
        if(has_boss==true|| has_gongxun==true){
            isRed = true;
        }else{
            isRed = false;
        }
        return isRed;
    },

    bossPanleRedPoint:function (data) {
        //资源掠夺界面红点的显示方法
        var result = {};
        if(data != null){
            var keyArr = data.key.split('.');
            if((keyArr[0] == "boss")){
                if(this.isHasGongxun()==true){
                    result.gongxun = true;
                }else{
                    result.gongxun = false;
                }
            }
        }else{
            if(this.isHasGongxun()==true){
                result.gongxun = true;
            }else{
                result.gongxun = false;
            }
        }
        return result;
    },
    isHasGongxun:function () {
        var result = false;
        //判断是否有功勋奖励可以领
        for(key in BOSSAWARDLISTCFG){
            //经验达到并且未领取
            if(GLOBALDATA.boss.ex>=BOSSAWARDLISTCFG[key].endprint&&GLOBALDATA.boss.exg[BOSSAWARDLISTCFG[key].ID-1]!=1){
                result = true;
            }
        }
        return result;
    }
}