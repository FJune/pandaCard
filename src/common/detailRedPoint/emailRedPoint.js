
/**
 ** @Author:pandayu
 ** @Version:1.0
 ** @DateTime:2018-09-09
 ** @Project:pandaCard CardGame
 ** @Contact: QQ:815099602
 **/
 //xiongrui 01 18
var emailRedPoint = {
    mainEmailRedPoint:function (data) {
        var result = 3;
        var isRed = null;
        if(data==null){
            isRed = this.mainPanleJudgeEmail();
            if(isRed){
                result = 1;
            }else{
                result = 2;
            }
        }else{
            var keyArr = data.key.split('.');
            if((keyArr[0] == "mailbox")){
                isRed = this.mainPanleJudgeEmail();
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
    //判断主界面邮件红点
    mainPanleJudgeEmail:function () {
        var isRed = false;
        for(var key in GLOBALDATA.mailbox){
            isRed = true;
            break;
        }
        return isRed;
    },

    emailPanleRedPoint:function (data) {
        //邮箱界面红点的显示方法
    },
}