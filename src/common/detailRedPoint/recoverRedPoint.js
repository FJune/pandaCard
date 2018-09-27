
/**
 ** @Author:pandayu
 ** @Version:1.0
 ** @DateTime:2018-09-09
 ** @Project:pandaCard CardGame
 ** @Contact: QQ:815099602
 **/
 //ciongrui 01 18
var recoverRedPoint = {
    mainRecoverRedPoint:function (data) {
        var result = 3;
        var isRed = null;
        if(data==null){
            isRed = this.mainPanleJudgeRecover();
            if(isRed){
                result = 1;
            }else{
                result = 2;
            }
        }else{
            var keyArr = data.key.split('.');
            if((keyArr[0] == "soldiers"||keyArr[0] == "depot")){
                isRed = this.mainPanleJudgeRecover();
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
    mainPanleJudgeRecover:function () {
        var isRed = false;
        var red1 = this.isSoldierRed();
        var red2 = this.isSoldierRed(4);
        var red3 = this.isSoldierRed(5);
        if(red1==true||red2==true||red3==true){
            isRed = true;
        }
        return isRed;
    },

    recoverPanleRedPoint:function (data) {
        //资源掠夺界面红点的显示方法
        var result=null;
        if(data != null){
            var keyArr = data.key.split('.');
            if((keyArr[0] == "soldiers" ||keyArr[0] == "depot")){
                result = this.getRecoverRed();
            }
        }else{
            result = this.getRecoverRed();
        }
        return result;
    },
    getRecoverRed:function () {
        var result = {};
        if(this.isSoldierRed()==true){
            result.soldier = true;
        }else{
            result.soldier = false;
        }
        if(this.isEquipRed(4)==true){
            result.equip = true;
        }else{
            result.equip = false;
        }
        if(this.isEquipRed(5)==true){
            result.baowu = true;
        }else{
            result.baowu = false;
        }
        return result;
    },
    isSoldierRed:function () {
        var result = false;
        for(var key in GLOBALDATA.soldiers){
            var role_sol = GLOBALDATA.soldiers[key];
            var quality = ITEMCFG[role_sol.p].quality;
            if(role_sol.j!=1&&quality<=3){//未上阵 且紫色一下品级
                result = true;
                break;
            }
        }
        return result;
    },
    isEquipRed:function (type) {//type 4:装备 5:宝物
        var result = false;
        for(var key in GLOBALDATA.depot){
            var role_dept = GLOBALDATA.depot[key];
            var quality = ITEMCFG[role_dept.p].quality;
            var maintype = ITEMCFG[role_dept.p].maintype;
            if(maintype==type){//装备
                if(role_dept.u==0&&quality<=3){//未穿戴 且紫色一下品级
                    result = true;
                    break;
                }
            }
        }
        return result;
    },
}