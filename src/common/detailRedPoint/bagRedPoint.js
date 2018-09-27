
/**
 ** @Author:pandayu
 ** @Version:1.0
 ** @DateTime:2018-09-09
 ** @Project:pandaCard CardGame
 ** @Contact: QQ:815099602
 **/
 //xiongrui 01 19
var bagRedPoint = {
    mainBagRedPoint:function (data) {
        var result = 3;
        var isRed = null;
        if(data==null){
            isRed = this.mainPanleJudgeBag();

        }else{
            var keyArr = data.key.split('.');
            if((keyArr[0] == "knapsack")){
                isRed = this.mainPanleJudgeBag();
            }

        }
        return isRed;
    },
    //判断主界面背包红点
    mainPanleJudgeBag:function () {
        var isRed = {};
        isRed.s = this.isImageRed(1,3);
        isRed.e = this.isImageRed(2,8);
        isRed.p = this.isImageRed(3,9);
        isRed.d = this.isImageRed(4,12);
        if(isRed.s==true||isRed.e==true||isRed.p==true||isRed.d==true){
            isRed.h = true;
        }else{
            isRed.h = false;
        }
        return isRed;
    },
    //判断士兵或者装备或者饰品是否有红点
    isImageRed:function (type,maintype) { //type 1 士兵 2 装备 3 饰品 4 道具     maintype 3 士兵碎片 8:装备碎片 9 饰品碎片
        var result = false;
        if(type==1||type==2||type==3){
            for(var key in GLOBALDATA.knapsack){
                var thingAttr = Helper.findItemId(key);
                if(thingAttr != null && thingAttr.maintype == maintype){
                    if(GOODSFRAGCFG[key]!=null){
                        if(GLOBALDATA.knapsack[key]>=GOODSFRAGCFG[key].usenum){
                            result=true;
                            break;
                        }
                    }
                }
            }
        }else if(type==4){
            for(var key in GLOBALDATA.knapsack){
                var thingAttr = Helper.findItemId(key);
                if(thingAttr){
                    if(thingAttr.maintype == maintype){
                        if(thingAttr.use==1){
                            //可使用
                            result=true;
                            break;
                        }
                    }else if(thingAttr.itemid==108&&GLOBALDATA.base.mchange>0){
                        // 有金币对幻想 且有兑换次数
                        result=true;
                        break;
                    }
                }

            }
        }
        return result;
    },
}