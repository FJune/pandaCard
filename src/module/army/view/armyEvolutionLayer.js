
/**
 ** @Author:pandayu
 ** @Version:1.0
 ** @DateTime:2018-09-09
 ** @Project:pandaCard CardGame
 ** @Contact: QQ:815099602
 **/
 /**
 * 士兵进阶层的创建
 */
var armyEvolutionLayer = baseLayer.extend({
    LayerName:"armyEvolutionLayer",
    totalRole:0,
    nowIndex:0,  //翻页的索引
    ctor:function(index){
        this._super();
        this.index = index;
        this.armyIndexArr = [];
    },

    onEnter:function(){
        this._super();
        var self = this;
        this.armyEvolutionEvent = cc.EventListener.create({
            event:cc.EventListener.CUSTOM,
            eventName: "soldier.evolve",
            callback:function(event){
                var resData = event.getUserData();
                if(resData.status == 0){
                    //进阶成功的提示
                    ShowTipsTool.TipsFromText(STRINGCFG[100089].string+(self.nextInfo.Hp-self.nowInfo.Hp),cc.color.GREEN,30);  //100089  生命增加
                    ShowTipsTool.TipsFromText(STRINGCFG[100090].string+(self.nextInfo.Atk-self.nowInfo.Atk),cc.color.GREEN,30); //100090  攻击增加
                    ShowTipsTool.TipsFromText(STRINGCFG[100091].string+(self.nextInfo.Def-self.nowInfo.Def),cc.color.GREEN,30);  //100091 防御增加

                    var solId = GLOBALDATA.army.battle[self.index];
                    self.initArmyData(solId);
                }
            }
        });
        cc.eventManager.addListener(this.armyEvolutionEvent, this);

    },
    //初始化ui
    initUI:function () {
        this.customWidget();  //自定义Widget
        this.updateInfo();
    },
    //自定义Widget
    customWidget:function(){
        var wgtArr = [];
        wgtArr.push("B_stayBreakArmyName");   //进阶前士兵名称
        wgtArr.push("B_breaArmykName");   //进阶后士兵名称
        wgtArr.push("B_talent");   //解锁天赋
        wgtArr.push("B_rankValue");  //等级需求
        wgtArr.push("B_talentDescribe");  //下一天赋描述
        wgtArr.push("beforeArmyType");   //进阶前士兵类型
        wgtArr.push("afterArmyType");  //进阶后士兵类型
        wgtArr.push("B_gold");  //进阶金币
        wgtArr.push("B_attack");  //当前攻击
        wgtArr.push("B_life"); //当前生命
        wgtArr.push("B_defense");  //当前防御
        wgtArr.push("N_attack");  //下一攻击
        wgtArr.push("N_life"); //下一生命
        wgtArr.push("N_defense");  //下一防御
        wgtArr.push("B_upRankBtn");  //进阶按钮
        wgtArr.push("btnBack");  //返回按钮
        wgtArr.push("btnUpLevel");  //升级标签
        wgtArr.push("btnAdvanced");  //进阶标签
        wgtArr.push("btnAwake");  //觉醒标签
        wgtArr.push("btnBreak");  //突破标签
        wgtArr.push("btnReform");  //改造标签
        wgtArr.push("B_leftBtn");  //向左的按钮
        wgtArr.push("B_rightBtn");  //向右的按钮
        wgtArr.push("armyBreakShow");  //士兵的模型翻页容器
        for(var i=1;i<=2;i++){
            //进阶需要的物品
            wgtArr.push("itemBg_"+i);
            wgtArr.push("itemIcon_"+i);
            wgtArr.push("itemPieces_"+i);
            wgtArr.push("itemNum_"+i);
        }
        //红点
        for(var i=1;i<=5;i++){
            wgtArr.push("tipsImageG"+i);
        }
        var uiArmyBreak = ccsTool.load(res.uiArmyEvolutionLayer,wgtArr);
        //控件的名字赋值给this变量
        for(var key in uiArmyBreak.wgt){
            this[key] = uiArmyBreak.wgt[key];
        }
        uiArmyBreak.node.setPosition(cc.p(0, 105));
        this.addChild(uiArmyBreak.node);

        //返回按钮
        this.btnBack.addTouchEventListener(this.backEvent, this);
        //升级标签
        this.btnUpLevel.addTouchEventListener(this.levelUpEvent, this);
        //进阶标签
        this.btnAdvanced.setBrightStyle(ccui.Widget.BRIGHT_STYLE_HIGH_LIGHT);//控件高亮
        this.btnAdvanced.setTouchEnabled(false);
        //觉醒标签
        this.btnAwake.addTouchEventListener(this.awakeEvent, this);
        //突破标签
        this.btnBreak.addTouchEventListener(this.breakEvent, this);
        //改造标签
        this.btnReform.addTouchEventListener(this.reformEvent, this);
        //向左的按钮
        this.B_leftBtn.addTouchEventListener(this.leftEvent, this);
        //向右的按钮
        this.B_rightBtn.addTouchEventListener(this.rightEvent, this);
        //进阶按钮
        this.B_upRankBtn.addTouchEventListener(this.upBreakEvent, this);
        //材料1
        this.itemBg_1.addTouchEventListener(this.onTouchEvent, this);
        //材料2
        this.itemBg_2.addTouchEventListener(this.onTouchEvent, this);


        //士兵的模型翻页容器
        for(var i=0;i<GLOBALDATA.army.battle.length;i++){
            if (GLOBALDATA.army.battle[i]!=0&&GLOBALDATA.army.battle[i]!=-1){
                var layout = new ccui.Layout();
                var Contentsize = this.armyBreakShow.getContentSize();
                layout.setContentSize(Contentsize);
                var armyId = GLOBALDATA.army.battle[i];
                var soldier = GLOBALDATA.soldiers[armyId];
                if(soldier.m > 0){ //突破过
                    var qhero = Helper.findHeroById(armyId);
                    armyId = qhero.breakid || armyId;
                }
                if(soldier.sq == 10){  //已经进行了终极改造
                    var reformAtt = Helper.findHeroById(armyId);
                    armyId = reformAtt.reform || armyId;
                }
                HeroDefault.runAdle(armyId,layout,190,0,1,1);  //英雄的原地动作
                HeroDefault.runAdle(armyId,layout,450,0,1,1);  //英雄的原地动作
                this.armyBreakShow.addPage(layout);
                this.armyIndexArr.push(i);
                this.totalRole++;
            }
        }
        var self = this;
        this.nowIndex = this.getPageIndex(this.index);
        this.armyBreakShow.setCurrentPageIndex(this.nowIndex);
        this.armyBreakShow.setTouchEnabled(false);
        /*this.armyBreakShow.addEventListener(function (sender, type) {
            this.nowIndex = sender.getCurPageIndex().valueOf();
            self.index = this.armyIndexArr[this.nowIndex];
            self.updateInfo();
        }, this);*/
    },
    //士兵数据显示函数
    initArmyData:function(solId){
        var tsolid = solId;
        var soldier = GLOBALDATA.soldiers[solId];
        if(soldier.m > 0){ //突破过
            var qhero = Helper.findHeroById(tsolid);
            tsolid = qhero.breakid || tsolid;
        }
        if(soldier.sq == 10){  //已经进行了终极改造
            var reformAtt = Helper.findHeroById(tsolid);
            tsolid = reformAtt.reform || tsolid;
        }
        var armyAttribute = Helper.findHeroById(tsolid);
        var itemConfig = Helper.findItemId(tsolid);
        var breakLev = GLOBALDATA.soldiers[solId].q;
        //进阶前士兵名称
        if(breakLev == 0){
            this.B_stayBreakArmyName.setString(itemConfig.itemname);
        }else{
            this.B_stayBreakArmyName.setString(itemConfig.itemname+"+"+breakLev);
        }
        Helper.setNamecolorByQuality(this.B_stayBreakArmyName,itemConfig.quality);  //颜色
        //兵种类型图标
        HeroDefault.setHeroTypeImage(this.beforeArmyType,armyAttribute.armytype);  //进阶前士兵类型
        HeroDefault.setHeroTypeImage(this.afterArmyType,armyAttribute.armytype);  //进阶后士兵类型

        //计算最大进阶次数
        this.MaxBreakNum = 0;  //最大进阶次数
        this.BreakConfigArray = [];    //突破的配置信息数组
        var isFind = false;   //已经找到
        for(var key in ARMYPROMOTECFG){
            if(ARMYPROMOTECFG[key].armyid == solId){
                this.BreakConfigArray.push(ARMYPROMOTECFG[key]);
                isFind = true;
                this.MaxBreakNum++;
            }else if(isFind){  //当后面的不在是查找的内容的时候
                break;
            }
        }
        if(breakLev >= this.MaxBreakNum){
            this.B_breaArmykName.setString("MAX");   //进阶后士兵名称
            this.B_talent.setString("MAX");  //解锁天赋
            this.B_rankValue.setString(GLOBALDATA.soldiers[solId].l+"/MAX");  //等级需求
            this.B_talentDescribe.setVisible(false);//下一天赋描述
            this.B_gold.setString("MAX");  //进阶金币
            //进阶需要的物品
            this.itemBg_1.setVisible(false);
            this.itemBg_2.setVisible(false);
        }else{
            this.B_breaArmykName.setString(itemConfig.itemname+"+"+(breakLev+1));  //进阶后士兵名称
            this.B_talent.setString(STRINGCFG[100042].string+(breakLev+1));  //100042 天赋  //解锁天赋
            var armypromteAtt = this.BreakConfigArray[breakLev];
            //等级需求
            this.B_rankValue.setString(GLOBALDATA.soldiers[solId].l+'/'+ armypromteAtt.armylvlimit);
            if(GLOBALDATA.soldiers[solId].l >= armypromteAtt.armylvlimit){
                this.B_rankValue.setColor(cc.color(255,255,255));
            }else{
                this.B_rankValue.setColor(cc.color(255,0,0));
            }
            this.B_talentDescribe.setString(armypromteAtt.promote_describe);//下一天赋描述
            //进阶金币
            this.B_gold.setString(Helper.formatNum(armypromteAtt.cost[0][1]));
            if(armypromteAtt.cost[0][1] > GLOBALDATA.base.money){  //进阶的钱不够
                this.B_gold.setColor(cc.color(255,0,0));
            }else{
                this.B_gold.setColor(cc.color(255,255,255));
            }
            //进阶需要的物品
            var count = 1;
            for(var i=1;i<=2;i++){
                if(armypromteAtt.cost[i] != null){
                    var itemid = armypromteAtt.cost[i][0]
                    var itemCon = Helper.findItemId(itemid);
                    Helper.LoadIconFrameAndAddClick(this["itemIcon_"+i],this["itemBg_"+i],this["itemPieces_"+i],itemCon);  //物品
                    var haveNum = Helper.getItemNum(itemid);
                    this["itemNum_"+i].setString(haveNum+"/"+armypromteAtt.cost[i][1]);  //数量
                    if(armypromteAtt.cost[i][1] > haveNum){
                        this["itemNum_"+i].setColor(cc.color(255,0,0));
                    }else{
                        this["itemNum_"+i].setColor(cc.color(255,255,255));
                    }
                    this["itemBg_"+i].setTag(itemid);
                    count++;
                }
            }
            for(var i=count;i<=2;i++){
                this["itemBg_"+i].setVisible(false);
            }
        }
        Helper.setNamecolorByQuality(this.B_breaArmykName,itemConfig.quality);  //颜色

        //当前属性和下一进阶的属性
        var equlist = [];
        for (var idx = 0; idx < GLOBALDATA.army.battle.length; idx++)
        {
            if (solId == GLOBALDATA.army.battle[idx])
            {
                equlist = GLOBALDATA.army.equips[idx];
                break;
            }
        }
        var depotData = GLOBALDATA.depot;
        var commanderData = GLOBALDATA.commanders[GLOBALDATA.army.commander];
        var teamlist = GLOBALDATA.army.battle.concat(GLOBALDATA.army.companion);
        var attr = new heroAttr(soldier.p, soldier.l, soldier.q, soldier.m, soldier.w, soldier.sq, soldier.eq, equlist, depotData, commanderData, teamlist);
        this.nowInfo = {};  //现在的信息
        this.nowInfo.Atk = attr.getBaseAttr(2);  //攻击
        this.nowInfo.Hp = attr.getBaseAttr(1);  //生命
        this.nowInfo.Def = attr.getBaseAttr(3);  //防御
        this.B_attack.setString(STRINGCFG[100035].string+"："+this.nowInfo.Atk);  //100035  攻击  //当前攻击
        this.B_life.setString(STRINGCFG[100032].string+"："+this.nowInfo.Hp);   //100032 生命  //当前生命
        this.B_defense.setString(STRINGCFG[100033].string+"："+this.nowInfo.Def);  //100033 防御  //当前防御

        this.nextInfo = {};   //下一级的信息
        if(GLOBALDATA.soldiers[solId].q >= this.MaxBreakNum){  //下一级大于最高进阶级数
            this.N_attack.setString("MAX");  //下一级攻击
            this.N_life.setString("MAX");   //下一级生命
            this.N_defense.setString("MAX");  //下一级防御
            this.N_defense.setVisible(false);  //升一级的按钮
            this.B_upRankBtn.setVisible(false);     //进阶按钮
        }else{
            var upattr = new heroAttr(soldier.p, soldier.l, soldier.q + 1, soldier.m, soldier.w, soldier.sq, soldier.eq, equlist, depotData, commanderData, teamlist);

            this.nextInfo.Atk = upattr.getBaseAttr(2);  //攻击
            this.nextInfo.Hp = upattr.getBaseAttr(1);  //生命
            this.nextInfo.Def = upattr.getBaseAttr(3);  //防御
            this.N_attack.setString(STRINGCFG[100035].string+"："+this.nextInfo.Atk);  //100035 攻击  //下一级攻击
            this.N_life.setString(STRINGCFG[100032].string+"："+this.nextInfo.Hp);   //100032 生命  //下一级生命
            this.N_defense.setString(STRINGCFG[100033].string+"："+this.nextInfo.Def);  //100033 防御  //下一级防御
        }
    },
    //返回按钮事件
    backEvent:function(sender, type){
        if(ccui.Widget.TOUCH_ENDED==type){
            var evn = new cc.EventCustom('updateUI');
            evn.setUserData(this.index);
            cc.eventManager.dispatchEvent(evn);
            this.removeFromParent(true);
        }
    },
    //升级按钮事件
    levelUpEvent:function(sender, type){
        if(ccui.Widget.TOUCH_ENDED==type){
            var levelUpLayer = new armyLevelUpLayer(this.index);
            this.getParent().addChild(levelUpLayer,2);
            this.removeFromParent(true);
        }
    },
    //觉醒标签
    awakeEvent:function(sender,type){
        if(ccui.Widget.TOUCH_ENDED==type){
            var AwakeLayer = new armyAwakeLayer(this.index);
            this.getParent().addChild(AwakeLayer,2);
            this.removeFromParent(true);
        }
    },
    //突破标签的事件
    breakEvent:function(sender, type){
        if(ccui.Widget.TOUCH_ENDED==type){
            var EvolutionLayer = new armyBreakLayer(this.index);
            this.getParent().addChild(EvolutionLayer,2);
            this.removeFromParent(true);
        }
    },
    //改造标签的事件
    reformEvent:function(sender, type){
        if(ccui.Widget.TOUCH_ENDED==type){
            var ReformLayer = new armyReformLayer(this.index);
            this.getParent().addChild(ReformLayer,2);
            this.removeFromParent(true);
        }
    },
    //左切换按钮事件
    leftEvent:function(sender, type){
        if(ccui.Widget.TOUCH_ENDED==type){
            this.nowIndex--;
            this.armyBreakShow.setCurrentPageIndex(this.nowIndex);
            this.updateInfo();
        }
    },
    //右切换按钮事件
    rightEvent:function(sender, type){
        if(ccui.Widget.TOUCH_ENDED==type){
            this.nowIndex++;
            this.armyBreakShow.setCurrentPageIndex(this.nowIndex);
            this.updateInfo();
        }
    },

    upBreakEvent:function(sender, type){
        if(ccui.Widget.TOUCH_ENDED==type){
        //	首先判断进阶是否已经满级，如果已满级，则在点击进阶时提示：当前已满级
        //	进阶需要当前的士兵达到指定的等级，如果等级不足，则点击进阶时提示：进阶所需要等级不足，请尽快提升士兵等级
        //	进阶需要一定的道具，兵种及金币，如道具不足，则弹出提示：对应的道具名称不足
        //	如果兵种不足，则弹出提示：对应的兵种不足
        //	如金币不足，则弹出提示：金币不足
        //	如上面皆足够则突破成功,并更新数据
            var solId = GLOBALDATA.army.battle[this.index];
            var armyBreakLev = GLOBALDATA.soldiers[solId].q;
            var armypromteAtt = this.BreakConfigArray[armyBreakLev];
            if(armyBreakLev >= this.MaxBreakNum){  //进阶已经满级
                ShowTipsTool.ErrorTipsFromStringById(100093);   //士兵进阶已经达到最高级别
                return;
            }
            if(armypromteAtt.armylvlimit > GLOBALDATA.soldiers[solId].l){  //进阶需求的士兵等级大于当前的士兵等级
                var str = StringFormat(STRINGCFG[100094].string,armypromteAtt.armylvlimit);  //100094 士兵等级未达到$1级，无法进阶
                ShowTipsTool.TipsFromText(str,cc.color.RED,30);   //显示tips
                return;
            }
            //判断需要的材料是否足够
            for(var key in armypromteAtt.cost){
                var itemNeed = armypromteAtt.cost[key];
                if(itemNeed[1] > Helper.getItemNum(itemNeed[0])){
                    var itemInfo = Helper.findItemId(itemNeed[0]);
                    if(itemNeed[0] == 1){  //金币
                        //跳转到金币兑换界面
                        var _buyGoldLayer = new buyGoldLayer();
                        this.addChild(_buyGoldLayer,3);
                    }else{
                        ShowTipsTool.TipsFromText(itemInfo.itemname+STRINGCFG[100011].string,cc.color.RED,30);   //显示tips  //100011 不足
                    }
                    return
                }
            }
            armyModel.evolution(solId);
        }
    },

    onTouchEvent:function(sender, type){
        if(ccui.Widget.TOUCH_ENDED==type){
            switch (sender.name) {
                case "itemBg_1":
                case "itemBg_2":
                    var itemid = sender.getTag();
                    var itemJumpLayer = new ItemJumpLayer(itemid);
                    this.addChild(itemJumpLayer,2);
                    break;
            }
        }
    },

    updateInfo:function () {
        //控制左右按钮显示隐藏以及士兵数据的更新
        if(this.nowIndex==0){
            this.B_leftBtn.setVisible(false);
        }else {
            this.B_leftBtn.setVisible(true);
        }
        if(this.nowIndex==this.totalRole-1){
            this.B_rightBtn.setVisible(false);
        }else {
            this.B_rightBtn.setVisible(true);
        }
        this.index = this.armyIndexArr[this.nowIndex];
        //处理五个标签按钮的状态
        this.DealButtonState();
        //士兵数据显示函数
        var solId = GLOBALDATA.army.battle[this.index];
        this.initArmyData(solId);
        //处理红点
        this.dealRedPoint();
    },
    //处理五个标签按钮的状态
    DealButtonState:function(){
        var ButtonArray = [];
        ButtonArray.push(this.btnUpLevel);
        ButtonArray.push(this.btnAdvanced);
        ButtonArray.push(this.btnAwake);
        ButtonArray.push(this.btnBreak);
        ButtonArray.push(this.btnReform);
        var solId = GLOBALDATA.army.battle[this.index];
        var soldier = GLOBALDATA.soldiers[solId];
        //是否显示觉醒按钮
        if(soldier.l >= INTERFACECFG[8].level){  //50级开启觉醒
            this.btnAwake.setVisible(true);
        }else{
            this.btnAwake.setVisible(false);
        }
        //是否显示突破按钮
        if(soldier.m > 0){ //突破过
            var qhero = Helper.findHeroById(solId);
            solId = qhero.breakid || solId;
        }
        var hero = Helper.findHeroById(solId);
        if(hero.breakid == null || hero.breakid == 0){
            this.btnBreak.setVisible(false);
        }else{
            this.btnBreak.setVisible(true);
        }
        //是否显示改造
        if(hero.reform != 0 && soldier.l >= INTERFACECFG[9].level && soldier.sq < 10){  //55级开启改造
            this.btnReform.setVisible(true);
        }else{
            this.btnReform.setVisible(false);
        }
        var posx = this.btnUpLevel.getPositionX();
        var posy = this.btnUpLevel.getPositionY();
        var width = 0;
        for(var i = 0;i<ButtonArray.length;i++){
            if(ButtonArray[i].isVisible()){
                ButtonArray[i].setPosition(posx+width,posy);
                width = width + 120;
            }
        }
    },
    //获取页面的索引
    getPageIndex:function(id){
        for(var i = 0;i<this.armyIndexArr.length;i++){
            if(this.armyIndexArr[i] == id){
                return i;
            }
        }
        return 0;
    },
    //处理红点
    dealRedPoint:function(data){
        var redInfo = armyRedPoint.armyOperationRedPoint(this.index,data);
        if(redInfo != null){
            for(var i=1;i<=5;i++){
                this["tipsImageG"+i].setVisible(false);
            }
            for(var i=0;i<redInfo.length;i++) {
                this["tipsImageG" + redInfo[i]].setVisible(true);
            }
        }
    },
    onExit:function () {
        this._super();
        cc.eventManager.removeListener(this.armyEvolutionEvent);
        cc.log('armyEvolutionLayer onExit');
    }
});