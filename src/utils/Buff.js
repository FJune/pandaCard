
/**
 ** @Author:pandayu
 ** @Version:1.0
 ** @DateTime:2018-09-09
 ** @Project:pandaCard CardGame
 ** @Contact: QQ:815099602
 **/
 /**
 * 技能类和buff类
 */
var Buff = cc.Class.extend({
    ctor:function (heroBuff,heroData,enemyData,atkRole,hurtRole) {
        // this.skill = Helper.findSkillById(atkRole.roleAttr.skillid);
        this.buffTargetArr = this.findTarget(heroBuff,heroData,enemyData,atkRole,hurtRole);
        this.buffEff(heroBuff);
    },
    buffEff:function (heroBuff) {
        var self = this;
        //buff数值
        if(this.buffTargetArr.length>0){
            this.buffTarget = this.buffTargetArr[0];
            var buffObj = BUFFCFG[heroBuff[1]];
            if(buffObj){
                // this.buffTarget.buffAttr[buffObj.data_value] = heroBuff[5];
            }
            // //添加buff效果
            // if(buffObj.data_value==14){
            //     this.buffTarget.addBuff('def');
            // }
            // if(buffObj.data_value==2){
            //     this.buffTarget.addBuff('atk');
            // }
            // if(buffObj.data_value==13){
            //     this.buffTarget.addBuff('speed');
            // }
            //buff倒计时,移除buff
            setTimeout(function () {
                // self.buffTarget.buffAttr[buffObj.data_value] = 0;
                //移除buff效果
                // if(buffObj.data_value==14){
                //     self.buffTarget.removeBuff('def');
                // }
                // if(buffObj.data_value==2){
                //     self.buffTarget.removeBuff('atk');
                // }
                // if(buffObj.data_value==13){
                //     self.buffTarget.removeBuff('speed');
                // }
            },heroBuff[3]);
        }
    },
    sortByAttr:function (attr,atkSet,minOrMax) {
        var sortArr = 0 ;
        var sortVal;
        if(minOrMax=='min'){
            sortVal = 9999;
        }else {
            sortVal = -9999;
        }
        for (var key in atkSet){
            if(!atkSet[key]||atkSet[key].hp<=0) continue;
            if(minOrMax=='min'){
                if(atkSet[key][attr]<sortVal){
                    sortArr = key;
                    sortVal = atkSet[key][attr];
                }
            }else {
                if(atkSet[key][attr]>sortVal){
                    sortArr = key;
                    sortVal = atkSet[key][attr];
                }
            }
        };
        return sortArr;
    },
    sortByDistance:function (atkRole,atkSet,minOrMax) {
        var sortArr = 0 ;
        var sortVal;
        if(minOrMax=='min'){
            sortVal = 9999;
        }else {
            sortVal = -9999;
        }
        for (var key in atkSet){
            if(!atkSet[key]||atkSet[key].hp<=0) continue;
            if(minOrMax=='min'){
                if(Math.abs(atkSet[key].y-atkRole.y)<sortVal){
                    sortArr = key;
                    sortVal = Math.abs(atkSet[key].y-atkRole.y);
                }
            }else {
                if(Math.abs(atkSet[key].y-atkRole.y)>sortVal){
                    sortArr = key;
                    sortVal = Math.abs(atkSet[key].y-atkRole.y);
                }
            }
        };
        return sortArr;
    },
    findTarget:function (heroBuff,heroData,enemyData,atkRole,hurtRole) {
        //查找攻击目标
        // 0自身
        // 1当前目标
        // 2敌方全体
        // 3友方全体
        // 4友方血最少
        // 5敌方血最少
        // 6友方随机
        // 7敌方随机
        var atkArr = [];
        if(heroData&&enemyData){
            switch (heroBuff[2]){
                case 0:
                    atkArr.push(atkRole);
                    break;
                case 1://1当前目标
                    atkArr.push(hurtRole);
                    break;
                case 2://2敌方全体
                    atkArr = enemyData;
                    break;
                case 3://3友方全体
                    atkArr = heroData;
                    break;
                case 4://4友方血最少
                    var idx = this.sortByAttr('hp',heroData,'min');
                    atkArr.push(heroData[idx]);
                    break;
                case 5://5敌方血最少
                    var idx = this.sortByAttr('hp',enemyData,'min');
                    atkArr.push(enemyData[idx]);
                    break;
                case 6://6友方随机
                    var idx ;
                    do{
                        idx = randNum(1,heroData.length);
                    }while(!heroData[idx-1]||heroData[idx-1].hp<=0)
                    atkArr.push(heroData[idx-1]);
                    break;
                case 7://7敌方随机
                    var idx ;
                    do{
                        idx = randNum(1,enemyData.length);
                    }while(!enemyData[idx-1]||enemyData[idx-1].hp<=0)
                    atkArr.push(enemyData[idx-1]);
                    break;
            }
        }
        return atkArr;
    }
});
