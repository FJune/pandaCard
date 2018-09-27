
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
var Skill = cc.Class.extend({
    ctor:function () {
        // this.skill = Helper.findSkillById(atkRole.roleAttr.skillid);
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
            if(!atkSet[key]||atkSet[key].hp<=0||(atkSet[key].x==0&&atkSet[key].y==0)) continue;
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
            if(!atkSet[key]||atkSet[key].hp<=0||(atkSet[key].x==0&&atkSet[key].y==0)) continue;
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
    findTarget:function (skillid,heroData,enemyData,atkRole,hurtRole) {
        var objSkill = Helper.findSkillById(skillid);
        //查找攻击目标
        var atkArr = [];
        var atkSet = null;
        if(objSkill.targettype==1){//自身
            atkArr.push(atkRole);
        }else if(objSkill.targettype==2){//友方
            atkSet = heroData;
            hurtRole = atkRole;
        }else if(objSkill.targettype==3){//敌方
            atkSet = enemyData;
        }
        if(atkSet){
            switch (objSkill.gettargettype){
                case -1:
                case 0:
                    atkArr = this.findTargetByArea(objSkill,atkSet,atkRole,hurtRole);
                    break;
                case 1://血量最多
                    var idx = this.sortByAttr('hp',atkSet,'max');
                    atkArr.push(atkSet[idx]);
                    break;
                case 2://血量最少
                    var idx = this.sortByAttr('hp',atkSet,'min');
                    atkArr.push(atkSet[idx]);
                    break;
                case 3://3防御最高
                    var idx = this.sortByAttr('def',atkSet,'max');
                    atkArr.push(atkSet[idx]);
                    break;
                case 4://4防御最低
                    var idx = this.sortByAttr('def',atkSet,'min');
                    atkArr.push(atkSet[idx]);
                    break;
                case 5://5攻击最高
                    var idx = this.sortByAttr('atk',atkSet,'max');
                    atkArr.push(atkSet[idx]);
                    break;
                case 6://6攻击最低
                    var idx = this.sortByAttr('atk',atkSet,'min');
                    atkArr.push(atkSet[idx]);
                    break;
                case 7://7优先坦
                    var prioritySet = [],noPrioritySet = [];
                    for (var key in atkSet){
                        if(!atkSet[key]||atkSet[key].hp<=0||(atkSet[key].x==0&&atkSet[key].y==0)) continue;
                        if(atkSet[key].roleAttr.armytype==3){
                            prioritySet.push(atkSet[key]);
                        }else {
                            noPrioritySet.push(atkSet[key]);
                        }
                    };
                    atkArr = this.findTargetByArea(objSkill,atkSet,atkRole,hurtRole,prioritySet,noPrioritySet);
                    break;
                case 8://8优先兵
                    var prioritySet = [],noPrioritySet = [];
                    for (var key in atkSet){
                        if(!atkSet[key]||atkSet[key].hp<=0||(atkSet[key].x==0&&atkSet[key].y==0)) continue;
                        if(atkSet[key].roleAttr.armytype==1){
                            prioritySet.push(atkSet[key]);
                        }else {
                            noPrioritySet.push(atkSet[key]);
                        }
                    };
                    atkArr = this.findTargetByArea(objSkill,atkSet,atkRole,hurtRole,prioritySet,noPrioritySet);
                    break;
                case 9://9优先炮
                    var prioritySet = [],noPrioritySet = [];
                    for (var key in atkSet){
                        if(!atkSet[key]||atkSet[key].hp<=0||(atkSet[key].x==0&&atkSet[key].y==0)) continue;
                        if(atkSet[key].roleAttr.armytype==2){
                            prioritySet.push(atkSet[key]);
                        }else {
                            noPrioritySet.push(atkSet[key]);
                        }
                    };
                    atkArr = this.findTargetByArea(objSkill,atkSet,atkRole,hurtRole,prioritySet,noPrioritySet);
                    break;
            }
        }
        return atkArr;
    },
    findTargetByArea:function (objSkill,atkSet,atkRole,hurtRole,prioritySet,noPrioritySet) {
        var atkArr = [];
        switch (objSkill.target_area){
            case 1://当前攻击目标
                atkArr.push(hurtRole);
                break;
            case 2://最近
                if(prioritySet&&prioritySet.length>0){
                    var idx = this.sortByDistance(atkRole,prioritySet,'min');
                    atkArr.push(prioritySet[idx]);
                }else {
                    var idx = this.sortByDistance(atkRole,atkSet,'min');
                    atkArr.push(atkSet[idx]);
                }
                break;
            case 3://最远
                if(prioritySet&&prioritySet.length>0){
                    var idx = this.sortByDistance(atkRole,prioritySet,'max');
                    atkArr.push(prioritySet[idx]);
                }else {
                    var idx = this.sortByDistance(atkRole,atkSet,'max');
                    atkArr.push(atkSet[idx]);
                }
                break;
            case 4://随机,需要修改，没有把士兵的优先级考虑进去

                var live = [];
                for (var key in atkSet){
                    if(!atkSet[key]||atkSet[key].hp<=0||(atkSet[key].x==0&&atkSet[key].y==0)) continue;
                    live.push(atkSet[key]);
                };

                if(live.length<=objSkill.target_num){
                    atkArr = live;
                }else{
                    var arrIdx = [];
                    for(var i =0;i<objSkill.target_num;i++){
                        var j ;
                        do{
                            j = randNum(1,live.length);
                        }while(arrIdx.indexOf(j)!=-1)
                        arrIdx.push(j);
                        atkArr.push(live[j-1]);
                    }
                }
                
                break;
            case 5://全体
                for (var key in atkSet){
                    if(!atkSet[key]||atkSet[key].hp<=0||(atkSet[key].x==0&&atkSet[key].y==0)) continue;
                    atkArr.push(atkSet[key]);
                };
                break;
            case 6://目标及目标范围
                var pos = hurtRole.getPosition();
                for (var key in atkSet){
                    if(!atkSet[key]||atkSet[key].hp<=0||(atkSet[key].x==0&&atkSet[key].y==0)) continue;
                    if(atkSet[key]&&atkSet[key].hp>0){
                        if(cc.pDistance(pos,atkSet[key].getPosition())<=objSkill.target_num){
                            atkArr.push(atkSet[key]);
                        }
                    }
                };
                break;
            // case -1://不考虑
            //     this.sortAtk(objSkill);
            //     break;
        }
        return atkArr;
    }
});
