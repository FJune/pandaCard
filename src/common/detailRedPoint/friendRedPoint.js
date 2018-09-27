
/**
 ** @Author:pandayu
 ** @Version:1.0
 ** @DateTime:2018-09-09
 ** @Project:pandaCard CardGame
 ** @Contact: QQ:815099602
 **/
 //xiongrui 01 17
var friendRedPoint = {
    mainFriendRedPoint:function (data) {
        var result = 3;
        var isRed = null;
        if(data==null){
            isRed = this.mainPanleJudgeFriend();
            if(isRed){
                result = 1;
            }else{
                result = 2;
            }
        }else{
            var keyArr = data.key.split('.');
            if((keyArr[0] == "friends")){
                isRed = this.mainPanleJudgeFriend();
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
    //判断主界面好友红点
    mainPanleJudgeFriend:function () {
        var isRed = false;
        for(key in GLOBALDATA.friends){
            if((GLOBALDATA.friends[key].typ==2 && GLOBALDATA.friends[key].r==1)||GLOBALDATA.friends[key].typ == 1){ //领取界面有数据或者申请界面有数据
                isRed = true;
                break;
            }
        }
        return isRed;
    },
    friendPanleRedPoint:function (data) {
        //好友界面红点的显示方法
        var result = null;
        if(data != null){
            var keyArr = data.key.split('.');
            if((keyArr[0] == "friends")){
                result = this.desizeRetrun();
            }
        }else{
            result = this.desizeRetrun();
        }
        return result;
    },

    desizeRetrun:function () {//判断好友界面有无红点返回
        var result = {}
        for(key in GLOBALDATA.friends){
            if((GLOBALDATA.friends[key].typ==2 && GLOBALDATA.friends[key].r==1)){
                result.lingqu = true;
                break;
            }
        }
        for(key in GLOBALDATA.friends){
            if(GLOBALDATA.friends[key].typ == 1){
                result.shenqing = true;
                break;
            }
        }
        return result;
    }
}