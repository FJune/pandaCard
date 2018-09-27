
/**
 ** @Author:pandayu
 ** @Version:1.0
 ** @DateTime:2018-09-09
 ** @Project:pandaCard CardGame
 ** @Contact: QQ:815099602
 **/
 /**
 */
var RedPoint ={
    baseRedObj:{}, //基地界面的红点
    //判断主界面红点
    DealMainJudge:function(data){
        var dataObj = {};

        //判断基地里面的红点
        this.DealBasePanelJudge();
        dataObj.base = 2;
        for(var key in this.baseRedObj){
            if(this.baseRedObj[key] == 1){
                dataObj.base = 1;
                break;
            }
        }
        //主界面士兵红点
        dataObj.army = armyRedPoint.mainArmyRedPoint(data);

        //主界面导航兵营红点
        dataObj.recruit = recruitRedPoint.mainRedPoint();
        //主界面回收红点
        dataObj.recover = recoverRedPoint.mainRecoverRedPoint();
        dataObj.bag = bagRedPoint.mainBagRedPoint();
        return dataObj;
    },
    //判断combat界面红点
    DealCombatJudge:function(data){
        var dataObj = {};
        dataObj.dayWork = dayWorkRedPoint.mainDayWorkRedPoint(data);  //主界面日常任务红点
        dataObj.welFare = welfareRedPoint.mainWelfareRedPoint(data);  //主界面超级福利红点
        dataObj.fuli = fuliRedPoint.mainFuliRedPoint();   //主界面活动中心红点
        dataObj.navTipBool = this.NavTips(data);  //主界面指挥官技能红点
        dataObj.dateTipBool = this.dateTips(data);
        dataObj.friend = friendRedPoint.mainFriendRedPoint(data);//主界面好友红点
        dataObj.email = emailRedPoint.mainEmailRedPoint(data);//主界面邮件红点
        return dataObj;
    },
    //判断基地里面的红点
    DealBasePanelJudge:function(data){
        //军神争霸
        var both = bothRedPoint.mainBothRedPoint(data);
        var arena = arenaRedPoint.mainArenaRedPoint(data);//主界面邮件红点
        var ziyuan;
        if(GLOBALDATA.base.lev>=INTERFACECFG[24].level){//判断用户等级是否达到限制等级
            ziyuan = resourceRdaPoint.mainResourceRedPoint(data);//主界面资源掠夺红点（基地）
        }
        var boss_figth = bossFightRedPoint.mainBossRedPoint(data);//主界面boss战红点（基地）
        if(both != 3){
            this.baseRedObj.both = both;
        }
        if(ziyuan!=3){
            this.baseRedObj.ziyuan = ziyuan;
        }
        if(boss_figth!=3){
            this.baseRedObj.boss_figth = boss_figth;
        }
        if(arena!=3){
            this.baseRedObj.arena = arena;
        }

        this.baseRedObj.arsen = arsenRedPoint.mainRedPoint() > 0 ? 1 : 0;

        this.baseRedObj.activity = activityRedPoint.mainRedPoint() > 0 ? 1 : 0;

        this.baseRedObj.explore = exploreRedPoint.mainRedPoint() > 0 ? 1 : 0;

        return this.baseRedObj;
    },
    //指挥官技能红点的综合判断
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
    //资源掠夺界面红点
    resourcePanleRedPoint:function (data) {
        var result = resourceRdaPoint.resourcePanleRedPoint(data);
        return result;
    },
    //boss战界面红点
    bossPanleRedPoint:function (data) {
        var result = bossFightRedPoint.bossPanleRedPoint(data);
        return result;
    },
    friendPanleRedPoint:function (data) {
        var result = friendRedPoint.friendPanleRedPoint(data);
        return result;
    },
    //回收界面红点
    recoverPanleRedPoint:function (data) {
        var result = recoverRedPoint.recoverPanleRedPoint(data);
        return result;
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

        //指挥官载具红点提示
        for(var vehicleObj in this.commander.ws){
            for(var key in COMDERSKILLCONSUMECFG){
                if(COMDERSKILLCONSUMECFG[key].lev == this.commander.s[VEHICLECFG[vehicleObj].commanderskillid] && COMDERSKILLCONSUMECFG[key].pos
                == VEHICLECFG[vehicleObj].commanderskillid){
                    var comAttr = COMDERSKILLCONSUMECFG[key];
                }
            }
            //var limitLev = this.commander.ws[vehicleObj]+'1_limit';
            //var limit = COMMANDERSKILLCFG[VEHICLECFG[vehicleObj].commanderskillid][limitLev];
            if(this.commander.s[VEHICLECFG[vehicleObj].commanderskillid] < COMMANDERSKILLCFG[VEHICLECFG[vehicleObj].commanderskillid].mostlv
                && this.commander.s[comAttr.pos_req]>comAttr.lev_req && comAttr.money < GLOBALDATA.base.money){
                return true;
            }
        }
        return false;
    },

    //乱世佳人红点的条件判断
    dateTips:function(data){
        if(data!=null){
            var keyArr = data.key.split('.');
            if(keyArr[0] == "base" && data.data.hasOwnProperty("tryst_num")){
                if(GLOBALDATA.alliancegirl.tryst_num > 0 || GLOBALDATA.alliancegirl.special >= 6 && GLOBALDATA.alliancegirl.profit_special[0] == 0 ||
                    GLOBALDATA.alliancegirl.special >= 36 && GLOBALDATA.alliancegirl.profit_special[0] == 0 ||
                    GLOBALDATA.alliancegirl.special >= 36 && GLOBALDATA.alliancegirl.profit_special[0] == 0 ||
                    GLOBALDATA.alliancegirl.normal == ALLIANCEGIRLCFG[GLOBALDATA.alliancegirl.profit_normal+1].endprogress){
                    return true;
                }

            }else{
                if(GLOBALDATA.alliancegirl.tryst_num > 0 || GLOBALDATA.alliancegirl.special >= 6 && GLOBALDATA.alliancegirl.profit_special[0] == 0 ||
                    GLOBALDATA.alliancegirl.special >= 36 && GLOBALDATA.alliancegirl.profit_special[0] == 0 ||
                    GLOBALDATA.alliancegirl.special >= 36 && GLOBALDATA.alliancegirl.profit_special[0] == 0 ||
                    GLOBALDATA.alliancegirl.normal == ALLIANCEGIRLCFG[GLOBALDATA.alliancegirl.profit_normal+1].endprogress){
                    return true;
                }
            }
        }else{
            if(GLOBALDATA.alliancegirl.tryst_num > 0 || GLOBALDATA.alliancegirl.special >= 6 && GLOBALDATA.alliancegirl.profit_special[0] == 0 ||
                GLOBALDATA.alliancegirl.special >= 36 && GLOBALDATA.alliancegirl.profit_special[0] == 0 ||
                GLOBALDATA.alliancegirl.special >= 36 && GLOBALDATA.alliancegirl.profit_special[0] == 0 ||
                GLOBALDATA.alliancegirl.normal == ALLIANCEGIRLCFG[GLOBALDATA.alliancegirl.profit_normal+1].endprogress){
                return true;
            }
        }
    },
};

// 基地-兵工厂
var arsenRedPoint = {
    mainRedPoint:function(){
        var num = 0;
        if (GLOBALDATA.base.lev >= INTERFACECFG[6].level)
        {
            num = GLOBALDATA.arsenal.n_num ; //道具数量
        }
        return num;
    },
};

// 基地-军事活动
var activityRedPoint = {
    mainRedPoint:function(){
        var num = 0;
        if (GLOBALDATA.base.lev >= INTERFACECFG[2].level)
        {
            var replica = GLOBALDATA.replica;
            //普通副本剩余挑战次数
            num = replica.n;
            //普通副本宝箱是否领取的情况
            var list = replica.llist;
            for (var key in list)
            {
                var dat = list[key];
                var stars = (dat.fs && (dat.fs[0] + dat.fs[1] + dat.fs[2] + dat.fs[3]) || 0);
                var step = Math.floor(stars / 4);
                if (dat.g < step)
                {
                    num = num + 1;
                    break;
                }
            }

            // 普通副本 boss入侵
            for (var bkey in replica.bl)
            {
                if (replica.bls[bkey] == 1)  //boss已刷新
                {
                    var bid  = replica.bl[bkey];
                    var bcfg = COUNTERBOSSCFG[bid];
                    if(bcfg != undefined && bcfg.consume == 0)
                    {
                        num = num + 1;
                        break;
                    }
                }
            }

            //精英副本
            if (GLOBALDATA.base.lev >= INTERFACECFG[41].level)
            {
                var svrTime = GLOBALDATA.svrTime + (Date.parse(new Date()) - GLOBALDATA.loginTime) / 1000;
                var at = replica.at - 6 * 60;
                var den = Math.floor((svrTime - at) / (6 * 60));  //

                //精英副本剩余挑战次数
                num = num + Math.floor((replica.en + den) / 10);

                // 精英副本宝箱是否领取的情况
                var list = replica.hlist;
                for (var key in list)
                {
                    var dat = list[key];
                    var stars = (dat.ss && (dat.ss[0] + dat.ss[1] + dat.ss[2] + dat.ss[3]) || 0);
                    var step = Math.floor(stars / 4);

                    if (dat.gl < step)
                    {
                        num = num + 1;
                        break;
                    }
                }

                //精英副本-精英boss
                if (GLOBALDATA.base.lev >= INTERFACECFG[26].level)
                {
                    // 精英副本 boss入侵
                    for (var bkey in replica.bl)
                    {
                        if (replica.bls[bkey] == 1)  //boss已刷新
                        {
                            var bid  = replica.bl[bkey];
                            var bcfg = COUNTERBOSSCFG[bid];
                            if(bcfg != undefined && bcfg.consume > 0)
                            {
                                num = num + 1;
                                break;
                            }
                        }
                    }
                }
            }
        }
        return num;
    },
};

// 基地-探险
var exploreRedPoint = {
    mainRedPoint:function(){
        var num = 0;
        if (GLOBALDATA.base.lev >= INTERFACECFG[18].level)
        {
            var explore = GLOBALDATA.explore;
            //普通侦查-体力
            num = explore.n;
            //普通宝箱钥匙和高级宝箱钥匙
            num += Helper.getItemNum(22109) + Helper.getItemNum(22108);

            //存在奇遇
            for (var key in explore.list)
            {
                num++;
                break;
            }

            // 进度宝箱未领取
            for (var key in explore.lsp)
            {
                var t = explore.lsp[key];
                if (t >= 50)
                {
                    num++;
                    break;
                }
            }
            // 进度宝箱未领取
            for (var key in explore.hsp)
            {
                var t = explore.hsp[key];
                if (t >= 50)
                {
                    num++;
                    break;
                }
            }

            // boss入侵
            if (bossFightRedPoint.mainBossRedPoint() == 1)
            {
                num++;
            }
        }
        return num;
    }
};

/********
 * 士兵的红点
 */
var armyRedPoint = {
    //主界面士兵红点 1表示红点 2表示没有红点 3表示不变
    mainArmyRedPoint:function(data){
        var result = 3;
        var isRed = null;
        if(data!=null){
            var keyArr = data.key.split('.');
            if((keyArr[0] == "base" && data.data.hasOwnProperty("money")) || keyArr[0] == "soldiers"
                || keyArr[0] == "depot" || keyArr[0] == "knapsack" || keyArr[0] == "army"){
                isRed = this.mainPanleJudgeArmy();
            }
            if(isRed == null){
                result = 3;
            }else if(isRed == true){
                result = 1;
            }else if(isRed == false){
                result = 2;
            }
        }else{
            isRed = this.mainPanleJudgeArmy();
            if(isRed){
                result = 1;
            }else{
                result = 2;
            }
        }
        return result;
    },
    //判断主界面的士兵红点
    mainPanleJudgeArmy:function(){
        var isRed = false;
        for(var i=0;i<GLOBALDATA.army.battle.length;i++){
            var result = this.updateArmyRedPoint(i,true);
            if(result.isRed == true){
                isRed = true;
                return isRed;
            }
        }
        if(this.dealArmyCompanion() != -1){
            isRed = true;
            return isRed;
        }
        return isRed;
    },
    //士兵界面红点
    armyPanleRedPoint:function(data){
        var result = null;
        if(data != null){
            var keyArr = data.key.split('.');
            if((keyArr[0] == "base" && data.data.hasOwnProperty("money")) || keyArr[0] == "soldiers"
                || keyArr[0] == "depot" || keyArr[0] == "knapsack" || keyArr[0] == "army"){
                result = this.armyPanleJudgeArmy();
            }
        }else{
            result = this.armyPanleJudgeArmy();
        }
        return result;
    },
    //判断士兵界面的红点
    armyPanleJudgeArmy:function(){
        var result = {};
        result.armyRed = [];
        for(var i=0;i<GLOBALDATA.army.battle.length;i++){
            var Red = this.updateArmyRedPoint(i,false);
            result.armyRed.push(Red);
        }
        result.companion = this.dealArmyCompanion();  //小伙伴
        return result;
    },
    //士兵操作功能界面红点
    armyOperationRedPoint:function(ArmyIndex,data){
        var result = null;
        if(data != null){
            var keyArr = data.key.split('.');
            if((keyArr[0] == "base" && data.data.hasOwnProperty("money")) || keyArr[0] == "soldiers"
                || keyArr[0] == "depot" || keyArr[0] == "knapsack"){
                result = this.armyOperationJudgeArmy(ArmyIndex);
            }
        }else{
            result = this.armyOperationJudgeArmy(ArmyIndex);
        }
        return result;
    },
    //判断士兵操作界面的红点
    armyOperationJudgeArmy:function(ArmyIndex){
        var redArray = [];
        //判断士兵升级
        if(this.dealArmyLv(ArmyIndex) != -1){
            redArray.push(1);
        }
        //判断士兵进阶
        if(this.dealArmyEvo(ArmyIndex) != -1){
            redArray.push(2);
        }
        //判断士兵觉醒
        if(this.dealArmyAwake(ArmyIndex) != -1){
            redArray.push(3);
        }
        //判断士兵突破
        if(this.dealArmyBreak(ArmyIndex) != -1){
            redArray.push(4);
        }
        //判断士兵改造
        if(this.dealArmyReform(ArmyIndex) != -1){
            redArray.push(5);
        }
        return redArray;
    },
    //装备属性界面的红点
    equPanleRedPoint:function(equid,data){
        var result = null;
        if(equid == null){
            return result;
        }
        if(data != null){
            var keyArr = data.key.split('.');
            if((keyArr[0] == "base" && data.data.hasOwnProperty("money"))){
                result = this.equPanleJudgeArmy(equid);
            }
        }else{
            result = this.equPanleJudgeArmy(equid);
        }
        return result;
    },
    //判断装备属性界面的红点
    equPanleJudgeArmy:function(equid){
        var red = false;
        if(this.dealEquStren(equid) != -1){
            red = true;
        }
        return red;
    },
    //判断小伙伴的红点 -1 表示没有小伙伴 1表示有小伙伴红点
    dealArmyCompanion:function(){
        var result = -1;
        //判断等级是否达到
        if(GLOBALDATA.base.lev > INTERFACECFG[16].level){
            var soldArray = [];  //没有上阵也没有上小伙伴的士兵
            for(var key in GLOBALDATA.soldiers){
                if(GLOBALDATA.soldiers[key].j == 0){
                    soldArray.push(parseInt(key));
                }
            }
            var isKong = false;  //是否有没有空余的小伙伴
            for(var key in GLOBALDATA.army.companion){
                var comId = GLOBALDATA.army.companion[key];
                if(comId == 0){
                    isKong = true;
                    break;
                }
            }
            if(isKong){
                for(var i=0;i<GLOBALDATA.army.battle.length;i++){
                    var solId = GLOBALDATA.army.battle[i];
                    if(solId != 0 && solId != -1){
                        for(var key in ARMYRELATIONCFG){
                            if(ARMYRELATIONCFG[key].armyid == solId){
                                var armySolIdArray = ARMYRELATIONCFG[key].relation_armyvalue;
                                for(var k=0;k<armySolIdArray.length;k++){
                                    if(soldArray.indexOf(armySolIdArray[k]) != -1){
                                        result = 1;
                                        return result;
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
        return result;
    },
    //更新士兵界面红点  isMain是否主界面  也可以用于打开的界面的判断
    updateArmyRedPoint:function(ArmyIndex,isMain){
        var redCfg = {};
        redCfg.isRed = false;
        //判断士兵阵位红点  redCfg.station -1 表示没有红点 1表示还有没有上阵士兵 2表示有高品质的士兵
        redCfg.station = this.dealArmyStation(ArmyIndex);
        if(redCfg.station != -1){
            redCfg.isRed = true;
            if(isMain){
                return redCfg;
            }
        }
        //判断士兵升级  redCfg.lv -1 表示没有红点 1表示能够升一级
        redCfg.lv = this.dealArmyLv(ArmyIndex);
        if(redCfg.lv != -1){
            redCfg.isRed = true;
            if(isMain){
                return redCfg;
            }
        }
        //判断士兵进阶 redCfg.evo -1 表示没有红点 1表示能够进阶
        redCfg.evo = this.dealArmyEvo(ArmyIndex);
        if(redCfg.evo != -1){
            redCfg.isRed = true;
            if(isMain){
                return redCfg;
            }
        }
        //判断士兵改造 redCfg.reform -1 表示没有红点 1表示能够改造
        redCfg.reform = this.dealArmyReform(ArmyIndex);
        if(redCfg.reform != -1){
            redCfg.isRed = true;
            if(isMain){
                return redCfg;
            }
        }
        //判断士兵突破 redCfg.break -1 表示没有红点 1表示能够突破
        redCfg.break = this.dealArmyBreak(ArmyIndex);
        if(redCfg.break != -1){
            redCfg.isRed = true;
            if(isMain){
                return redCfg;
            }
        }
        //判断士兵觉醒 redCfg.awake -1 表示没有红点 1表示能够觉醒
        redCfg.awake = this.dealArmyAwake(ArmyIndex);
        if(redCfg.awake != -1){
            redCfg.isRed = true;
            if(isMain){
                return redCfg;
            }
        }
        //判断士兵装备 pos 1-2表示配饰 3-6表示装备 7表示一键装备 8表示一键强化装备
        redCfg.equ = this.dealArmyEqu(ArmyIndex,isMain);
        if(redCfg.equ.isRed){
            redCfg.isRed = true;
            if(isMain){
                return redCfg;
            }
        }
        return redCfg;
    },
    //判断士兵阵位红点  -1 表示没有红点 1表示还有没有上阵士兵 2表示有高品质的士兵
    dealArmyStation:function(ArmyIndex) {
        var result = -1;
        var solId = GLOBALDATA.army.battle[ArmyIndex];
        if(solId == 0){  //该阵位上没有士兵
            //还有没有上阵的士兵
            for(var key in GLOBALDATA.soldiers){
                if(GLOBALDATA.soldiers[key].j == 0){
                    result = 1;
                    return result;
                }
            }
        }else if(solId != 0 && solId != -1){
            //有更高品质的士兵
            var itemCfg = Helper.findItemId(solId);
            for(var key in GLOBALDATA.soldiers){
                if(GLOBALDATA.soldiers[key].j == 0){
                    var sitemCfg = Helper.findItemId(key);
                    if(sitemCfg.quality > itemCfg.quality){
                        result = 2;
                        return result;
                    }
                }
            }
        }
        return result;
    },
    //判断士兵升级  -1 表示没有红点 1表示能够升一级
    dealArmyLv:function(ArmyIndex){
        var result = -1;
        var solId = GLOBALDATA.army.battle[ArmyIndex];
        if(solId != 0 && solId != -1){
            //能够升一级
            var soldier = GLOBALDATA.soldiers[solId];
            if(soldier.l < GLOBALDATA.base.lev){
                var lvCfg = Helper.findLvCfgByLv(soldier.l);
                if(lvCfg.amycost <= GLOBALDATA.base.money){
                    result = 1;
                    return result;
                }
            }
        }
        return result;
    },
    //判断士兵进阶  -1 表示没有红点 1表示能够进阶
    dealArmyEvo:function(ArmyIndex){
        var result = -1;
        var solId = GLOBALDATA.army.battle[ArmyIndex];
        if(solId != 0 && solId != -1){
            var soldier = GLOBALDATA.soldiers[solId];
            var evoLev = GLOBALDATA.soldiers[solId].q;
            var evoConfig = null;
            for(var key in ARMYPROMOTECFG){
                if(ARMYPROMOTECFG[key].armyid == solId && evoLev+1 == ARMYPROMOTECFG[key].promotelv){
                    evoConfig = ARMYPROMOTECFG[key];
                    break;
                }
            }
            if(evoConfig != null){
                if(evoConfig.armylvlimit <= soldier.l){
                    //判断需要的材料是否足够
                    var isCan = true;
                    for(var key in evoConfig.cost){
                        var itemNeed = evoConfig.cost[key];
                        if(itemNeed[1] > Helper.getItemNum(itemNeed[0])){
                            isCan = false;
                            break;
                        }
                    }
                    if(isCan){
                        result = 1;
                        return result;
                    }
                }
            }
        }
        return result;
    },
    //判断士兵改造  -1 表示没有红点 1表示能够改造
    dealArmyReform:function(ArmyIndex){
        var result = -1;
        var solId = GLOBALDATA.army.battle[ArmyIndex];
        if(solId != 0 && solId != -1){
            var soldier = GLOBALDATA.soldiers[solId];
            var ReformConfig = null;
            for(var key in ARMYREFORMCFG){
                if(ARMYREFORMCFG[key].armyid == solId && soldier.sq+1 == ARMYREFORMCFG[key].reformtimes){
                    ReformConfig = ARMYREFORMCFG[key];
                    break;
                }
            }
            if(ReformConfig != null){
                if(soldier.l >= INTERFACECFG[9].level){  //55级开启改造
                    var isCan = true;
                    var material = ReformConfig.material;
                    for(var key in material){
                        var itemNeed = material[key];
                        if(itemNeed[1] > Helper.getItemNum(itemNeed[0])){
                            isCan = false;
                            break;
                        }
                    }
                    if(isCan){
                        result = 1;
                        return result;
                    }
                }
            }
        }
        return result;
    },
    //判断士兵是否突破  -1 表示没有红点 1表示能够突破
    dealArmyBreak:function(ArmyIndex){
        var result = -1;
        var solId = GLOBALDATA.army.battle[ArmyIndex];
        if(solId != 0 && solId != -1){
            var soldier = GLOBALDATA.soldiers[solId];
            var breakConfig = Helper.findArmyBreakById(solId);
            if(breakConfig != null){
                if(soldier.m == 0 && breakConfig.armylvlimit <= soldier.l){
                    var isCan = true;
                    for(var key in breakConfig.cost){
                        var itemNeed = breakConfig.cost[key];
                        if(itemNeed[1] > Helper.getItemNum(itemNeed[0])){
                            isCan = false;
                            break;
                        }
                    }
                    if(isCan){
                        result = 1;
                        return result;
                    }
                }
            }
        }
        return result;
    },
    //判断士兵觉醒  -1 表示没有红点 1表示能够觉醒
    dealArmyAwake:function(ArmyIndex){
        var result = -1;
        var solId = GLOBALDATA.army.battle[ArmyIndex];
        if(solId != 0 && solId != -1) {
            var soldier = GLOBALDATA.soldiers[solId];
            var awakeAtt = Helper.findArmyAwake(soldier.w + 1);
            if (soldier.l >= INTERFACECFG[8].level) {  //50级开启觉醒
                if (awakeAtt != null) {
                    //四件觉醒材料
                    var isCan = true;
                    for (var i = 0; i < 4; i++) {
                        if (soldier.eq[i] == 0) {
                            isCan = false;
                            var id = awakeAtt.equcost[i];
                            if (Helper.getItemNum(id) >= 1) {
                                result = 1;
                                return result;
                            }
                        }
                    }
                    if (isCan) {
                        //判断需要的材料是否足够
                        for (var key in awakeAtt.otcost) {
                            var itemNeed = awakeAtt.otcost[key];
                            var itemId = itemNeed[0];
                            if (itemId == -1) {  //本体卡
                                itemId = solId;
                            }
                            if (itemNeed[1] > Helper.getItemNum(itemId)) {
                                isCan = false;
                                break;
                            }
                        }
                        if (isCan) {
                            result = 1;
                            return result;
                        }
                    }
                }
            }
        }
        return result;
    },
    //判断士兵装备 pos 1-2表示配饰 3-6表示装备 7表示一键装备 8表示一键强化装备
    dealArmyEqu:function(ArmyIndex,isMain){
        var result = {};
        result.isRed = false;
        result.pos = [];
        //阵位上没有士兵或者没有开启
        var solId = GLOBALDATA.army.battle[ArmyIndex];
        if(solId == 0 || solId == -1){
            return result;
        }
        //宝物和装备 未穿戴和高品质的
        var eqArray = GLOBALDATA.army.equips[ArmyIndex];
        for(var i=1;i<=6;i++){
            if(eqArray[i-1] == 0){
                //未穿戴
                for(var key in GLOBALDATA.depot){
                    if(GLOBALDATA.depot[key].u == 0){
                        var equAttr = EQUIPSHUXINGCFG[GLOBALDATA.depot[key].p];
                        if(equAttr.type == i){
                            result.isRed = true;
                            result.pos.push(i);
                            //一键装备
                            if(i>=3 && i<=6){
                                result.pos.push(7);
                            }
                            if(isMain){
                                return result;
                            }
                            break;
                        }
                    }
                }
            }else{
                //已经穿戴，但是有更高品质的
                var itemCfg = Helper.findItemId(GLOBALDATA.depot[eqArray[i-1]].p);
                for(var key in GLOBALDATA.depot){
                    if(GLOBALDATA.depot[key].u == 0){
                        var equAttr = EQUIPSHUXINGCFG[GLOBALDATA.depot[key].p];
                        if(equAttr.type == i){
                            var nitemCfg = Helper.findItemId(GLOBALDATA.depot[key].p);
                            if(nitemCfg.quality > itemCfg.quality){
                                result.isRed = true;
                                result.pos.push(i);
                                //一键装备
                                if(i>=3 && i<=6){
                                    result.pos.push(7);
                                }
                                if(isMain){
                                    return result;
                                }
                                break;
                            }
                        }
                    }
                }
            }
        }
        //四件装备的强化
        for(var i = 3;i<=6;i++){
            if(eqArray[i-1] != 0){
                var equRed = this.dealEquStren(eqArray[i-1]);  //判断装备是否能够强化  -1表示没有红点 1表示能够强化
                if(equRed == 1){
                    result.isRed = true;
                    result.pos.push(i);
                    //一键强化
                    result.pos.push(8);
                    if(isMain){
                        return result;
                    }
                }
            }
        }
        return result;
    },


    //判断装备是否能够强化  -1表示没有红点 1表示能够强化
    dealEquStren:function(equid){
        var result = -1;
        var depot = GLOBALDATA.depot[equid];
        if(depot.s < GLOBALDATA.base.lev*2){
            var lvCfg = EQUIPQIANGHUACFG[depot.s] || {};
            var itemCfg = Helper.findItemId(depot.p);
            var gold = lvCfg["cost"+itemCfg.quality] || 0;
            if(gold != 0 && gold <= GLOBALDATA.base.money){
                result = 1;
                return result;
            }
        }
        return result;
    },
};


// 兵营
var recruitRedPoint = {
    mainRedPoint:function(){
        var num = 0;
        if (GLOBALDATA.base.lev >= INTERFACECFG[13].level)
        {
            var svrTime = GLOBALDATA.svrTime + (Date.parse(new Date()) - GLOBALDATA.loginTime) / 1000;
            var lottery = GLOBALDATA.research.lottery;
            var lt = lottery.h_ut + 24 * 3600 - svrTime ;  //

            num = Helper.getItemNum(4) + lottery.n_free + Helper.getItemNum(5) + lottery.h_free + ((lt <= 0) ? 1 : 0)
                + GLOBALDATA.shop.fn ; //道具数量
        }

        return num;
    },
};
/***
 * 任务界面的红点
 * */
var dayWorkRedPoint ={
    //主界面日常任务的红点 1表示红点 2表示没有红点 3表示不变
    mainDayWorkRedPoint:function(data){
        var result = 3;
        if (GLOBALDATA.base.lev >= INTERFACECFG[20].level){
            var RedInfo = null;
            if(data!=null){
                var keyArr = data.key.split('.');
                if(keyArr[0] == "tasklist"
                    || (keyArr[0] == "base" && data.data.hasOwnProperty("lev") && GLOBALDATA.base.lev == INTERFACECFG[20].level)){
                    RedInfo = this.dealDayWork(true);
                }
                if(RedInfo == null){
                    result = 3;
                }else if(RedInfo.isRed == true){
                    result = 1;
                }else if(RedInfo.isRed == false){
                    result = 2;
                }
            }else{
                RedInfo = this.dealDayWork(true);
                if(RedInfo.isRed){
                    result = 1;
                }else{
                    result = 2;
                }
            }
        }
        return result;
    },
    //任务界面红点
    dayWorkPanleRedPoint:function(data){
        var result = null;
        if(data != null){
            var keyArr = data.key.split('.');
            if(keyArr[0] == "tasklist"){
                result = this.dealDayWork(false);
            }
        }else{
            result = this.dealDayWork(false);
        }
        return result;
    },
    //任务的红点
    dealDayWork:function(isMain){
        var result = {};
        result.isRed = false;
        result.pos = [];
        //日常任务
        for(var key in GLOBALDATA.tasklist){
            var Info = MISSIONDAYCFG[key];
            if(Info != null && GLOBALDATA.tasklist[key].s == 2){
                result.pos.push(1);
                result.isRed = true;
                if(isMain){
                    return result;
                }
            }
        }
        //成就任务
        for(var key in GLOBALDATA.tasklist){
            var Info = MISSIONACHCFG[key];
            if(Info != null && GLOBALDATA.tasklist[key].s == 2){
                result.pos.push(2);
                result.isRed = true;
                if(isMain){
                    return result;
                }
            }
        }
        //活跃度
        for(var key in GLOBALDATA.tasklist){
            var Info = MISSIONVITACFG[key];
            if(Info != null && GLOBALDATA.tasklist[key].s == 2){
                result.pos.push(3);
                result.isRed = true;
                if(isMain){
                    return result;
                }
            }
        }
        return result;
    },
};

/*****
 * 超级福利界面的红点
 * ****/
var welfareRedPoint = {
    welRedObj:{},
    //主界面超级福利的红点 1表示红点 2表示没有红点 3表示不变
    mainWelfareRedPoint:function(data){
        var result = 2;
        this.dealWelfare(true,data);
        for(var key in this.welRedObj){
            if(this.welRedObj[key].isRed == true){
                result = 1;
                return result;
            }
        }
        return result;
    },
    //超级福利界面红点
    dayWelfarePanleRedPoint:function(data){
        this.dealWelfare(false,data);
        return this.welRedObj;
    },
    //处理超级福利
    dealWelfare:function(isMain,data){
        //开服七天乐
        var id = 1;
        this.buildCurrencyWel(id,data);
        //每日签到
        var sign = this.dealWelSign(data);
        if(sign != null){
            var temp = {};
            if(sign){
                temp.isRed = true;
            }else{
                temp.isRed = false;
            }
            this.welRedObj[2] = temp;
        }
        //等级特惠礼包
        var id = 3;
        this.buildCurrencyBuy(id,data);
        //在线奖励
        var id = 4;
        this.buildCurrencyTime(id,data);
        //全民福利
        var dataArr = this.dealWelChengZ(isMain,data);
        if(dataArr != null){
            var temp = {};
            if(dataArr.length != 0){
                temp.isRed = true;
                temp.pos = dataArr;
            }else{
                temp.isRed = false;
            }
            this.welRedObj[5] = temp;
        }
        //开服在线礼包
        var id = 6;
        this.buildCurrencyTime(id,data);
        //开服特惠礼包
        var id = 7;
        this.buildCurrencyBuy(id,data);
        //开服红利
        var id = 8;
        this.buildCurrencyBuy(id,data);
        //vip福利
        var vipRed = this.dealWelVip(data);
        if(vipRed != null){
            var temp = {};
            if(vipRed){
                temp.isRed = true;
            }else{
                temp.isRed = false;
            }
            this.welRedObj[9] = temp;
        }
    },
    //处理每日签到
    dealWelSign:function(data){
        var result = null;
        if(data != null){
            var keyArr = data.key.split('.');
            if(keyArr[0] == "base" && (data.data.hasOwnProperty("msign") || data.data.hasOwnProperty("mreward"))){
                result = this.JudgeWelSign();
            }
        }else{
            result = this.JudgeWelSign();
        }
        return result;
    },
    //判断每日签到的红点
    JudgeWelSign:function(){
        var result = false;
        if(this.getActivity_p(2) != null){
            var serverTime = Helper.getServerTime();
            var date = new Date(serverTime*1000);
            var max = date.getDate();
            var msign = GLOBALDATA.base.msign || 0;
            var mreward = GLOBALDATA.base.mreward || 0;
            if(msign < max && mreward == 0){
                result = true;
            }
        }
        return result;
    },
    //成长基金界面红点
    WelChengZPanelRedPoint:function(data){
        var result = this.dealWelChengZ(false,data);
        return result;
    },
    //处理成长基金的红点
    dealWelChengZ:function(isMain,data){
        var result = null;
        if(data != null){
            var keyArr = data.key.split('.');
            if((keyArr[0] == "base" && data.data.hasOwnProperty("diamond") && GLOBALDATA.base.fund != 1)
                || (keyArr[0] == "base" && data.data.hasOwnProperty("fund"))
                || (keyArr[0] == "base" && (data.data.hasOwnProperty("lev") || data.data.hasOwnProperty("fundreward")) && GLOBALDATA.base.fund == 1)
                || (keyArr[0] == "activitylist" && data.data.hasOwnProperty("fundnum"))){
                result = this.JudgeWelChengZ(isMain);
            }
        }else{
            result = this.JudgeWelChengZ(isMain);
        }
        return result;
    },
    //判断成长基金的红点
    JudgeWelChengZ:function(isMain){
        var result = [];
        //自己没有购买，但是可以购买
        if(GLOBALDATA.base.fund != 1){
            var cost = 0;
            for(var key in GROWTHFUNDCFG){
                if(GROWTHFUNDCFG[key].type == 1){
                    cost = GROWTHFUNDCFG[key].num;
                    break;
                }
            }
            if(cost <= GLOBALDATA.base.diamond){
                result.push(1);
                return result;
            }
        }
        var isJijin = false;
        var isMin = false;
        //成长基金有可以领取的
        for(var key in GROWTHFUNDCFG){
            var info = GROWTHFUNDCFG[key];
            if(info.type == 2){  //成长基金
                if(GLOBALDATA.base.lev >= info.num){
                    if(GLOBALDATA.base.fund == 1 && !isJijin && GLOBALDATA.base.fundreward[info.id] == null){
                        isJijin = true;
                        result.push(2);
                        if(isMain){
                            return result;
                        }
                    }
                }
            }else if(info.type == 3){  //全民福利
                if(GLOBALDATA.activitylist.fundnum >= info.num){
                    if(GLOBALDATA.base.fund == 1 && !isMin && GLOBALDATA.base.fundreward[info.id] == null){
                        isMin = true;
                        result.push(3);
                        if(isMain){
                            return result;
                        }
                    }
                }
            }
            if(isJijin && isMin){
                break;
            }
        }
        return result;
    },
    //vip福利界面的红点
    WelVipPanelRedPoint:function(data){
        var result = this.dealWelVip(data);
        return result;
    },
    //处理vip福利的红点
    dealWelVip:function(data){
        var result = null;
        if(data != null){
            var keyArr = data.key.split('.');
            if(keyArr[0] == "activitylist"){
                result = this.JudgeWelVip();
            }
        }else{
            result = this.JudgeWelVip();
        }
        return result;
    },
    //判断vip福利的红点
    JudgeWelVip:function(){
        var result = false;
        if(this.getActivity_p(9) != null){
            var controlInfo = ACTIVITYCONTROLCFG[9];
            if(controlInfo != null){
                var list = controlInfo.subid;
                for(var key in list) {
                    var task = GLOBALDATA.activitylist[list[key]];
                    var info = ACTIVITYCFG[list[key]];
                    if(task != null && info != null && info.cf[0][1] == GLOBALDATA.base.vip && task.s == 2){
                        result = true;
                        return result;
                    }
                }
            }
        }
        return result;
    },
    //生成通用购买类型的超级福利
    buildCurrencyBuy:function(id,data){
        var res = this.dealCurrencyBuy(id,data);
        if(res != null){
            var temp = {};
            if(res != -1){
                temp.isRed = true;
            }else{
                temp.isRed = false;
            }
            this.welRedObj[id] = temp;
        }
    },
    //处理通用购买类型的超级福利
    dealCurrencyBuy:function(id,data){
        var result = null;
        if(data != null){
            var keyArr = data.key.split('.');
            if((keyArr[0] == "base" && data.data.hasOwnProperty("diamond")) || keyArr[0] == "activitylist"){
                result = this.JudgeCurrencyBuy(id);
            }
        }else{
            result = this.JudgeCurrencyBuy(id);
        }
        return result;
    },
    //判断通用购买类型的超级福利
    JudgeCurrencyBuy:function(id){
        var result = -1;
        var controlInfo = ACTIVITYCONTROLCFG[id];
        if(controlInfo != null){
            if(this.getActivity_p(controlInfo.ID) == null){
                return result;
            }
            var list = controlInfo.subid;
            for(var key in list) {
                var task = GLOBALDATA.activitylist[list[key]];
                var info = ACTIVITYCFG[list[key]];
                if(task != null && task.s != 3 && GLOBALDATA.base.diamond >= info.cost[1]){
                    result = id;
                    return result;
                }
            }
        }
        return result;
    },
    //生成通用的超级福利
    buildCurrencyWel:function(id,data){
        var res = this.dealCurrencyWel(id,data);
        if(res != null){
            var temp = {};
            if(res != -1){
                temp.isRed = true;
            }else{
                temp.isRed = false;
            }
            this.welRedObj[id] = temp;
        }
    },
    //处理通用的超级福利
    dealCurrencyWel:function(id,data){
        var result = null;
        if(data != null){
            var keyArr = data.key.split('.');
            if(keyArr[0] == "activitylist"){
                result = this.JudgeCurrencyWel(id);
            }
        }else{
            result = this.JudgeCurrencyWel(id);
        }
        return result;
    },
    //判断通用的超级福利
    JudgeCurrencyWel:function(id){
        var result = -1;
        var controlInfo = ACTIVITYCONTROLCFG[id];
        if(controlInfo != null){
            if(this.getActivity_p(controlInfo.ID) == null){
                return result;
            }
            var list = controlInfo.subid;
            for(var key in list) {
                var task = GLOBALDATA.activitylist[list[key]];
                if(task != null && task.s == 2){
                    result = id;
                    return result;
                }
            }
        }
        return result;
    },
    //生成倒计时类型的超级福利
    buildCurrencyTime:function(id,data){
        var res = this.dealCurrencyTime(id,data);
        if(res != null){
            var temp = {};
            if(res != -1){
                temp.isRed = true;
            }else{
                temp.isRed = false;
            }
            this.welRedObj[id] = temp;
        }
    },
    //处理倒计时类型的超级福利
    dealCurrencyTime:function(id,data){
        var result = null;
        if(data != null){
            var keyArr = data.key.split('.');
            if(keyArr[0] == "activitylist" || this.welRedObj[id].isRed == false){
                result = this.JudgeCurrencyTime(id);
            }
        }else{
            result = this.JudgeCurrencyTime(id);
        }
        return result;
    },
    //判断倒计时类型的超级福利
    JudgeCurrencyTime:function(id){
        var result = -1;
        var controlInfo = ACTIVITYCONTROLCFG[id];
        if(controlInfo != null){
            if(this.getActivity_p(controlInfo.ID) == null){
                return result;
            }
            var list = controlInfo.subid;
            for(var key in list) {
                var task = GLOBALDATA.activitylist[list[key]];
                if(task != null){
                    if(task.s == 2){  //能够领取
                        result = id;
                        return result;
                    }
                    if(task.s == 1){  //不能领取，但是时间到了
                        var nowtime = Helper.getServerTime();
                        if(task.jstime == null){
                            var info = ACTIVITYCFG[list[key]];
                            task.jstime = nowtime + info.mb[0][1] - task.g;
                        }
                        if(nowtime >= task.jstime){
                            result = id;
                            return result;
                        }
                    }
                }
            }
        }
        return result;
    },
    //判断时候存在改活动
    getActivity_p:function(id){
        var result = null;
        for(var key in GLOBALDATA.activitylist.p){
            if(GLOBALDATA.activitylist.p[key] == id){
                result = GLOBALDATA.activitylist.p[key];
                break;
            }
        }
        return result;
    },
};

/*****
 * 活动中心界面的红点
 * ****/
var fuliRedPoint = {
    fuliRedObj:{},
    //主界面活动中心的红点 1表示红点 2表示没有红点 3表示不变
    mainFuliRedPoint:function(data){
        var result = 2;
        this.dealFuli(true,data);
        for(var key in this.fuliRedObj){
            if(this.fuliRedObj[key].isRed == true){
                result = 1;
                return result;
            }
        }
        return result;
    },
    //活动中心界面红点
    dayFuliPanleRedPoint:function(data){
        this.dealFuli(false,data);
        return this.fuliRedObj;
    },
    //处理活动中心
    dealFuli:function(isMain,data){
        //通用的活动
        for(var key in ACTIVITYCONTROLCFG){
            var info = ACTIVITYCONTROLCFG[key];
            if(info.type == 4){
                this.buildCurrencyFuli(info.ID,data);
            }
        }
    },
    //生成通用的活动中心
    buildCurrencyFuli:function(id,data){
        var res = this.dealCurrencyFuli(id,data);
        if(res != null){
            var temp = {};
            if(res != -1){
                temp.isRed = true;
            }else{
                temp.isRed = false;
            }
            this.fuliRedObj[id] = temp;
        }
    },
    //处理通用的活动中心
    dealCurrencyFuli:function(id,data){
        var result = null;
        if(data != null){
            var keyArr = data.key.split('.');
            if(keyArr[0] == "activitylist"){
                result = this.JudgeCurrencyFuli(id);
            }
        }else{
            result = this.JudgeCurrencyFuli(id);
        }
        return result;
    },
    //判断通用的活动中心
    JudgeCurrencyFuli:function(id){
        var result = -1;
        var controlInfo = ACTIVITYCONTROLCFG[id];
        if(controlInfo != null){
            if(this.getActivity_p(controlInfo.ID) == null){
                return result;
            }
            var list = controlInfo.subid;
            for(var key in list) {
                var task = GLOBALDATA.activitylist[list[key]];
                if(task != null && task.s == 2){
                    result = id;
                    return result;
                }
            }
        }
        return result;
    },
    //判断时候存在改活动
    getActivity_p:function(id){
        var result = null;
        for(var key in GLOBALDATA.activitylist.p){
            if(GLOBALDATA.activitylist.p[key] == id){
                result = GLOBALDATA.activitylist.p[key];
                break;
            }
        }
        return result;
    },
};

/*****
 * 军神争霸界面的红点
 * ****/
var bothRedPoint = {
    //主界面军神争霸的红点 1表示红点 2表示没有红点 3表示不变
    mainBothRedPoint:function(data){
        var result = 3;
        var RedInfo = null;
        if(data!=null){
            var keyArr = data.key.split('.');
            if(keyArr[0] == "both" && data.data.hasOwnProperty("num")){
                RedInfo = this.dealBothRedPoint();
            }
            if(RedInfo == null){
                result = 3;
            }else if(RedInfo == true){
                result = 1;
            }else if(RedInfo == false){
                result = 2;
            }
        }else{
            RedInfo = this.dealBothRedPoint();
            if(RedInfo){
                result = 1;
            }else{
                result = 2;
            }
        }
        return result;
    },
    //军神争霸界面红点
    bothPanleRedPoint:function(data){
        var result = null;
        if(data != null){
            var keyArr = data.key.split('.');
            if(keyArr[0] == "both" && data.data.hasOwnProperty("num")){
                result = this.dealBothRedPoint();
            }
        }else{
            result = this.dealBothRedPoint();
        }
        return result;
    },
    //军神争霸的红点
    dealBothRedPoint:function(){
        var result = false;
        //军神争霸等级限制
        if(GLOBALDATA.base.lev < INTERFACECFG[3].level){
            return result;
        }
        var serverTime = Helper.getServerTime();
        var date = new Date(serverTime*1000);
        var hour = date.getHours();
        //每天10:00-21:00为对战开启时间
        if(hour>=10 && hour<21){
            if(GLOBALDATA.both.num > 0){
                result = true;
                return result;
            }
        }
        return result;
    },
};

var baseShowTip = {
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
};

