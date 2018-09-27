
/**
 ** @Author:pandayu
 ** @Version:1.0
 ** @DateTime:2018-09-09
 ** @Project:pandaCard CardGame
 ** @Contact: QQ:815099602
 **/
var baseModel = {
    //升星
    upStar:function(id,cid){
        Network.getInstance().send({
            task:'commander.car.starup',
            id:id,
            cid:cid,
        });
    },

    //激活和卸下
    carUseDown:function(id,cid){
        Network.getInstance().send({
            task:'commander.car.use',
            id:id,
            cid:cid,
        });
    },

    //升级
    carUplev:function(id,cid,uid){
        Network.getInstance().send({
            task:'commander.car.levelup',
            id:id,
            cid:cid,
            uid:uid,
        });
    },

    //强化
    carStren:function(id,cid){
        Network.getInstance().send({
            task:'commander.car.strengthen',
            id:id,
            cid:cid,
        });
    },

    //重生
    carRebirth:function(id,cid){
        Network.getInstance().send({
            task:'commander.car.reborn',
            id:id,
            cid:cid,
        });
    },

    //合成
    carCompound:function(id,cid){
        Network.getInstance().send({
            task:'commander.car.active',
            id:id,
            cid:cid,
        });
    },

    //单个座驾红点显示判断
    CarTipsShow:function(carAttr){
        var tipsArray = [];
        for(var comKey in GLOBALDATA.commanders){
            if(GLOBALDATA.commanders[comKey].j == 1){
                this.commandId = comKey;
                this.commanderObj = GLOBALDATA.commanders[comKey];
            }
        }
        this.carIdArray = [];
        //已合成数组的确定
        if(this.commanderObj.car != undefined){
            this.fcarIdArray = [];//已合成座驾副本数组
            for(var carid in this.commanderObj.car){
                this.fcarIdArray.push(parseInt(this.commanderObj.car[carid].id));
            }
            //可合成数组的确定
            this.carCompoundArray = [];
            for(var carKey in COMCARCFG){
                if(this.fcarIdArray.indexOf(parseInt(carKey)) == -1){
                    if(GLOBALDATA.knapsack[COMCARCFG[carKey].synnum[0]] != undefined &&
                        GLOBALDATA.knapsack[COMCARCFG[carKey].synnum[0]] >= COMCARCFG[carKey].synnum[1]){
                        this.carCompoundArray.push(parseInt(carKey));//可合成数组
                    }
                }
            }
            this.fcarIdArray = this.fcarIdArray.concat(this.carCompoundArray);
            if(this.fcarIdArray.length != 0){
                for(var i=0;i<this.fcarIdArray.length-1;i++){
                    for(var j=0; j<this.fcarIdArray.length-1-i;j++){
                        if(this.fcarIdArray[j] < this.fcarIdArray[j+1]){
                            var quaTemp = this.fcarIdArray [j];
                            this.fcarIdArray[j] = this.fcarIdArray[j+1];
                            this.fcarIdArray[j+1] = quaTemp;
                        }
                    }
                }
                //this.fcarIdArray.reverse();//从大到小排序
            }
        }else{
            //可合成数组的确定
            this.carCompoundArray = [];
            for(var carKey in COMCARCFG){
                if(this.fcarIdArray.indexOf(carKey) == -1){
                    if(GLOBALDATA.knapsack[COMCARCFG[carKey].synnum[0]] != undefined &&
                        GLOBALDATA.knapsack[COMCARCFG[carKey].synnum[0]] >= COMCARCFG[carKey].synnum[1]){
                        this.carCompoundArray.push(parseInt(carKey));//可合成数组
                    }
                }
            }
            this.fcarIdArray = this.fcarIdArray.concat(this.carCompoundArray);
            if(this.fcarIdArray.length != 0){
                this.fcarIdArray.reverse();//从大到小排序
            }
        }

        if(carAttr != undefined){
            if(!cc.isObject(carAttr)){
                tipsArray = [true, false, false, false];
                return tipsArray;
            }else{
                if(this.commanderObj.lcar != 0){
                    tipsArray.push(false);
                }else{
                    tipsArray.push(true);
                }
                var MaterialArray = [];
                for(var key in GLOBALDATA.knapsack){
                    if(key == 22119 || key == 22120 || key == 22121){
                        MaterialArray.push(key);
                    }
                }
                if(MaterialArray.length != 0){
                    for(var i=0;i<MaterialArray.length;i++){
                        var ExpValue;//升级所需的总经验值
                        ExpValue = ITEMCFG[MaterialArray[i]].value * GLOBALDATA.knapsack[MaterialArray[i]];
                    }
                }
                if(ExpValue >= COMCAREXPCFG[carAttr.lv + 1][COMCARCFG[carAttr.id].exp] - carAttr.exp){
                    tipsArray.push(true);
                }else{
                    tipsArray.push(false);
                }

                //强化红点的判断
                if(GLOBALDATA.base.money < COMCARSTRENGTHENCFG[carAttr.st+1].gold * 10000){
                    if(GLOBALDATA.knapsack["20"] != undefined && GLOBALDATA.knapsack["20"] > COMCARSTRENGTHENCFG[carAttr.st+1].cost[1]){
                        tipsArray.push(true);
                    }else{
                        tipsArray.push(false);
                    }
                }

                //升星红点的判断
                for(var key in COMCARCFG){
                    if(COMCARCFG[key].id == carAttr.id){
                        var _carQulity = COMCARCFG[key].quality;
                        break;
                    }
                }
                for(var atarKey in COMCARSTARCFG) {
                    if (COMCARSTARCFG[atarKey].star == carAttr.star + 1 && COMCARSTARCFG[atarKey].quality == _carQulity) {
                        var _upStarAttr = COMCARSTARCFG[atarKey];
                    }
                }
                if(carAttr.lv > _upStarAttr.lv){
                    if(GLOBALDATA.knapsack[_upStarAttr.cost[0]] != undefined){
                        if(GLOBALDATA.knapsack[_upStarAttr.cost[0]] >= _upStarAttr.cost[1]  &&
                            GLOBALDATA.knapsack[COMCARCFG[carAttr.id].synnum[0]] >= _upStarAttr.card){
                            if(GLOBALDATA.base.money >= _upStarAttr.gold){
                                tipsArray.push(true);
                            }else{
                                tipsArray.push(false);
                            }
                        }else{
                            tipsArray.push(false);
                        }
                    }else{
                        tipsArray.push(false);
                    }
                }else{
                    tipsArray.push(false);
                }
                return tipsArray;
            }
        }
    },

    //所有座驾的红点显示判断
    AllCarTipsShow:function(){
        for(var comKey in GLOBALDATA.commanders){
            if(GLOBALDATA.commanders[comKey].j == 1){
                this.commandId = comKey;
                this.commanderObj = GLOBALDATA.commanders[comKey];
            }
        }
        this.carIdArray = [];
        //已合成数组的确定
        if(this.commanderObj.car != undefined){
            this.fcarIdArray = [];//已合成座驾副本数组
            for(var carid in this.commanderObj.car){
                this.fcarIdArray.push(parseInt(this.commanderObj.car[carid].id));
            }
            //可合成数组的确定
            this.carCompoundArray = [];
            for(var carKey in COMCARCFG){
                if(this.fcarIdArray.indexOf(parseInt(carKey)) == -1){
                    if(GLOBALDATA.knapsack[COMCARCFG[carKey].synnum[0]] != undefined &&
                        GLOBALDATA.knapsack[COMCARCFG[carKey].synnum[0]] >= COMCARCFG[carKey].synnum[1]){
                        this.carCompoundArray.push(parseInt(carKey));//可合成数组
                    }
                }
            }
            this.fcarIdArray = this.fcarIdArray.concat(this.carCompoundArray);
            if(this.fcarIdArray.length != 0){
                for(var i=0;i<this.fcarIdArray.length-1;i++){
                    for(var j=0; j<this.fcarIdArray.length-1-i;j++){
                        if(this.fcarIdArray[j] < this.fcarIdArray[j+1]){
                            var quaTemp = this.fcarIdArray [j];
                            this.fcarIdArray[j] = this.fcarIdArray[j+1];
                            this.fcarIdArray[j+1] = quaTemp;
                        }
                    }
                }
                //this.fcarIdArray.reverse();//从大到小排序
            }
        }else{
            //可合成数组的确定
            this.carCompoundArray = [];
            for(var carKey in COMCARCFG){
                if(this.fcarIdArray.indexOf(carKey) == -1){
                    if(GLOBALDATA.knapsack[COMCARCFG[carKey].synnum[0]] != undefined &&
                        GLOBALDATA.knapsack[COMCARCFG[carKey].synnum[0]] >= COMCARCFG[carKey].synnum[1]){
                        this.carCompoundArray.push(parseInt(carKey));//可合成数组
                    }
                }
            }
            this.fcarIdArray = this.fcarIdArray.concat(this.carCompoundArray);
            if(this.fcarIdArray.length != 0){
                this.fcarIdArray.reverse();//从大到小排序
            }
        }

        for(var k=0;k<this.fcarIdArray.length;k++){
            if(this.carCompoundArray.indexOf(this.fcarIdArray[k]) != -1){
                return true;
            }else{
                var carAttr = this.commanderObj.car[this.fcarIdArray[k]];
                //座驾是否上阵红点判断
                if(this.commanderObj.lcar == 0){
                    return true;
                }
                //升级红点判断
                var MaterialArray = [];
                for(var key in GLOBALDATA.knapsack){
                    if(key == 22119 || key == 22120 || key == 22121){
                        MaterialArray.push(key);
                    }
                }
                if(MaterialArray.length != 0){
                    for(var i=0;i<MaterialArray.length;i++){
                        var ExpValue;//升级所需的总经验值
                        ExpValue = ITEMCFG[MaterialArray[i]].value * GLOBALDATA.knapsack[MaterialArray[i]];
                    }
                }
                if(ExpValue >= COMCAREXPCFG[carAttr.lv + 1][COMCARCFG[carAttr.id].exp] - carAttr.exp){
                    return true;
                }

                //强化红点的判断
                if(GLOBALDATA.base.money < COMCARSTRENGTHENCFG[carAttr.st+1].gold * 10000){
                    if(GLOBALDATA.knapsack["20"] != undefined && GLOBALDATA.knapsack["20"] > COMCARSTRENGTHENCFG[carAttr.st+1].cost[1]){
                        return true;
                    }

                    //升星红点的判断
                    for(var key in COMCARCFG){
                        if(COMCARCFG[key].id == carAttr.id){
                            var _carQulity = COMCARCFG[key].quality;
                            break;
                        }
                    }
                    for(var atarKey in COMCARSTARCFG) {
                        if (COMCARSTARCFG[atarKey].star == carAttr.star + 1 && COMCARSTARCFG[atarKey].quality == _carQulity) {
                            var _upStarAttr = COMCARSTARCFG[atarKey];
                        }
                    }
                    if(carAttr.lv > _upStarAttr.lv){
                        if(GLOBALDATA.knapsack[_upStarAttr.cost[0]] != undefined){
                            if(GLOBALDATA.knapsack[_upStarAttr.cost[0]] >= _upStarAttr.cost[1]  &&
                                GLOBALDATA.knapsack[COMCARCFG[carAttr.id].synnum[0]] >= _upStarAttr.card){
                                if(GLOBALDATA.base.money >= _upStarAttr.gold){
                                    return true;
                                }
                            }
                        }
                    }
                }
            }
        }
        return false;
    },

    NavTips:function(data){
        if(data!=null){
            var keyArr = data.key.split('.');
            if(keyArr[0] == "base" && data.data.hasOwnProperty("money") || keyArr[0] == "base" && data.data.hasOwnProperty("lev")){
                return this._NavTips();
            }else{
                return this._NavTips();
            }
        }else{
            return this._NavTips();
        }
    },
//指挥官技能红点提示
    _NavTips:function(){
        //获取上阵指挥官的属性及ID
        for (var key in GLOBALDATA.commanders){
            if (GLOBALDATA.commanders[key].j == 1){
                this.commander = GLOBALDATA.commanders[key];
                this.commanderId = key;
                break;
            }
        }
        this.comSkillArray = [];//指挥官技能数组
        for(var commanderObj in COMMANDERCFG){
            if(this.commander.p == commanderObj){
                //获取指挥官技能并对技能进行排序
                this.comSkillArray = COMMANDERCFG[commanderObj].asicskill.concat(COMMANDERCFG[commanderObj].activeskill,
                    COMMANDERCFG[commanderObj].passiveskill).sort();
            }
        }
        for(var i=0;i<this.comSkillArray.length;i++){
            for(var key in COMDERSKILLCONSUMECFG){
                if(COMDERSKILLCONSUMECFG[key].pos == this.comSkillArray[i] && COMDERSKILLCONSUMECFG[key].lev
                    == this.commander.s[this.comSkillArray[i]]){
                    var comAttr = COMDERSKILLCONSUMECFG[key];
                }
            }
            if(i == 0){
                if(this.commander.s[this.comSkillArray[i]] < COMMANDERSKILLCFG[this.comSkillArray[i]].mostlv){
                    if(this.commander.s[this.comSkillArray[i]] < (GLOBALDATA.base.lev * 10 + 1)){
                        var gold = comAttr.money;
                        if(gold < GLOBALDATA.base.money){
                            return true;
                        }
                    }
                }
            }else{
                if(this.commander.s[this.comSkillArray[i]] < COMMANDERSKILLCFG[this.comSkillArray[i]].mostlv){
                    //var preSkillLevel = this.commander.s[this.comSkillArray[i]] + '1_limit';
                    //var limit = COMMANDERSKILLCFG[this.comSkillArray[i]][preSkillLevel];
                    if(this.commander.s[comAttr.pos_req] >= comAttr.lev_req){
                        var gold = comAttr.money;
                        if(gold < GLOBALDATA.base.money){
                            return true;
                        }
                    }
                }
            }
        }
        return false;
    },

    NavechileTip:function(data){
        if(data!=null){
            var keyArr = data.key.split('.');
            if(keyArr[0] == "base" && data.data.hasOwnProperty("lev")){
                return this._NavechileTip();
            }else{
                return this._NavechileTip();
            }
        }else{
            return this._NavechileTip();
        }
    },

    //指挥官载具红点提示
    _NavechileTip:function(){
        for(var vehicleObj in this.commander.ws){
            for(var key in COMDERSKILLCONSUMECFG){
                if(COMDERSKILLCONSUMECFG[key].lev == this.commander.s[VEHICLECFG[vehicleObj].commanderskillid] && COMDERSKILLCONSUMECFG[key].pos
                    == VEHICLECFG[vehicleObj].commanderskillid){
                    var comAttr = COMDERSKILLCONSUMECFG[key];
                }
            }
            //获取上阵指挥官的属性及ID
            for (var key in GLOBALDATA.commanders){
                if (GLOBALDATA.commanders[key].j == 1){
                    this.commander = GLOBALDATA.commanders[key];
                    break;
                }
            }
            if(this.commander.s[VEHICLECFG[vehicleObj].commanderskillid] < COMMANDERSKILLCFG[VEHICLECFG[vehicleObj].commanderskillid].mostlv
                && this.commander.s[comAttr.pos_req]>comAttr.lev_req && comAttr.money < GLOBALDATA.base.money){
                return true;
            }
        }
        return false;
    },
};