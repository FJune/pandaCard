
/**
 ** @Author:pandayu
 ** @Version:1.0
 ** @DateTime:2018-09-09
 ** @Project:pandaCard CardGame
 ** @Contact: QQ:815099602
 **/
 //xiongrui 01 16
var resourceRdaPoint = {
    mainResourceRedPoint:function (data) {
        var result = 3;
        var isRed = null;
        if(data==null){
            isRed = this.mainPanleJudgeResource();
            if(isRed){
                result = 1;
            }else{
                result = 2;
            }
        }
        return result;
    },
    //判断主界面基地（资源掠夺）红点
    mainPanleJudgeResource:function () {
        var isRed = false;
        var nowtime = Helper.formatDate(new Date(),3);
        var intime1 = this.timeRange("10:00","23:00",nowtime);
        var intime2 = this.timeRange("12:40","13:00",nowtime);
        var intime3 = this.timeRange("18:00","18:20",nowtime);
        if(intime1==true){
            //判断是否有为攻打的村庄存在
            if(GLOBALDATA.resource.step<PLUNDERSTAGECFG[15].id){ //表示还有小关卡没有攻打过
                isRed = true;
            }else{
                isRed = false;
            }
        }else if(intime2==true||intime3==true){
            isRed = true;
        }else{
            isRed = false;
        }
        return isRed;
    },

    resourcePanleRedPoint:function (data) {
        //资源掠夺界面红点的显示方法
    },
    timeRange:function (beginTime, endTime, nowTime) {
        var strb = beginTime.split (":");
        if (strb.length != 2) {
            return false;
        }
        var stre = endTime.split (":");
        if (stre.length != 2) {
            return false;
        }

        var strn = nowTime.split (":");
        if (stre.length != 2) {
            return false;
        }
        var b = new Date ();
        var e = new Date ();
        var n = new Date ();

        b.setHours (strb[0]);
        b.setMinutes (strb[1]);
        e.setHours (stre[0]);
        e.setMinutes (stre[1]);
        n.setHours (strn[0]);
        n.setMinutes (strn[1]);

        if (n.getTime () - b.getTime () > 0 && n.getTime () - e.getTime () < 0) {
            return true;
        } else {
            return false;
        }
    }
}