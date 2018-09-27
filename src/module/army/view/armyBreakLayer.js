
/**
 ** @Author:pandayu
 ** @Version:1.0
 ** @DateTime:2018-09-09
 ** @Project:pandaCard CardGame
 ** @Contact: QQ:815099602
 **/
 /**
 * 士兵突破层的创建
 */
var armyBreakLayer = baseLayer.extend({
    LayerName:"armyBreakLayer",
    ctor:function(index){
        this._super();
        this.index = index;
    },

    onEnter:function(){
        this._super();
        var self = this;
        this.armyBreakEvent = cc.EventListener.create({
            event:cc.EventListener.CUSTOM,
            eventName: "soldier.break",
            callback:function(event){
                var resData = event.getUserData();
                if(resData.status == 0){
                    //突破成功的提示
                    ShowTipsTool.TipsFromText(STRINGCFG[100089].string+(self.nextInfo.Hp-self.nowInfo.Hp),cc.color.GREEN,30);  //100089  生命增加
                    ShowTipsTool.TipsFromText(STRINGCFG[100090].string+(self.nextInfo.Atk-self.nowInfo.Atk),cc.color.GREEN,30); //100090  攻击增加
                    ShowTipsTool.TipsFromText(STRINGCFG[100091].string+(self.nextInfo.Def-self.nowInfo.Def),cc.color.GREEN,30);  //100091 防御增加

                    var evn = new cc.EventCustom('updateUI');
                    evn.setUserData(self.index);
                    cc.eventManager.dispatchEvent(evn);
                    self.removeFromParent(true);

                    /*var solId = GLOBALDATA.army.battle[self.index];
                    self.initArmyData(solId);*/
                }
            }
        });
        cc.eventManager.addListener(this.armyBreakEvent, this);

    },
    //初始化ui
    initUI:function () {
        this.customWidget();  //自定义Widget
        this.updateInfo();
    },
    //自定义Widget
    customWidget:function(){
        var wgtArr = [];
        wgtArr.push("B_stayBreakArmyName");   //突破前士兵名称
        wgtArr.push("B_breaArmykName");   //突破后士兵名称
        wgtArr.push("beforeArmyType");   //进阶前士兵类型
        wgtArr.push("afterArmyType");  //进阶后士兵类型
        wgtArr.push("bPtitude");  //突破前资质
        wgtArr.push("aPtitude");  //突破后资质
        wgtArr.push("B_rankValue");  //等级需求
        wgtArr.push("B_talentDescribe");  //突破后的技能描述
        wgtArr.push("B_attack");  //当前攻击
        wgtArr.push("B_life"); //当前生命
        wgtArr.push("B_defense");  //当前防御
        wgtArr.push("N_attack");  //突破攻击
        wgtArr.push("N_life"); //突破生命
        wgtArr.push("N_defense");  //突破防御
        wgtArr.push("B_gold");  //突破金币
        //突破需要的物品
        wgtArr.push("itemBg");
        wgtArr.push("itemIcon");
        wgtArr.push("itemPieces");
        wgtArr.push("itemNum");
        wgtArr.push("btnBack");  //返回按钮
        wgtArr.push("btnUpLevel");  //升级标签
        wgtArr.push("btnAdvanced");  //进阶标签
        wgtArr.push("btnAwake");  //觉醒标签
        wgtArr.push("btnBreak");  //突破标签
        wgtArr.push("btnReform");  //改造标签
        wgtArr.push("armyBreakShow");  //士兵的模型容器
        wgtArr.push("B_upEvolutionBtn");  //突破按钮
        //红点
        for(var i=1;i<=5;i++){
            wgtArr.push("tipsImageG"+i);
        }

        var uiEvolution = ccsTool.load(res.uiArmyBreakLayer,wgtArr);
        //控件的名字赋值给this变量
        for(var key in uiEvolution.wgt){
            this[key] = uiEvolution.wgt[key];
        }
        uiEvolution.node.setPosition(cc.p(0, 105));
        this.addChild(uiEvolution.node);

        //返回按钮
        this.btnBack.addTouchEventListener(this.backEvent, this);
        //升级标签
        this.btnUpLevel.addTouchEventListener(this.levelUpEvent, this);
        //进阶标签
        this.btnAdvanced.addTouchEventListener(this.AdvancedEvent, this);
        //觉醒标签
        this.btnAwake.addTouchEventListener(this.awakeEvent, this);
        //突破标签
        this.btnBreak.setBrightStyle(ccui.Widget.BRIGHT_STYLE_HIGH_LIGHT);//控件高亮
        this.btnBreak.setTouchEnabled(false);
        //改造标签
        this.btnReform.addTouchEventListener(this.reformEvent, this);

        //突破按钮
        this.B_upEvolutionBtn.addTouchEventListener(this.upEvolutionEvent, this);

        //材料1
        this.itemBg.addTouchEventListener(this.onTouchEvent, this);

        //士兵模型的容器
        var solId = GLOBALDATA.army.battle[this.index];
        var armyAttribute = Helper.findHeroById(solId);  //突破前的属性
        var layout = new ccui.Layout();
        var Contentsize = this.armyBreakShow.getContentSize();
        layout.setContentSize(Contentsize);
        HeroDefault.runAdle(solId,layout,190,0,1,1);  //英雄的原地动作
        HeroDefault.runAdle(armyAttribute.breakid,layout,450,0,1,1);  //突破后英雄的原地动作
        this.armyBreakShow.removeAllChildren(true);
        this.armyBreakShow.addChild(layout);
    },
    //士兵数据显示函数
    initArmyData:function(solId){
        var armyAttribute = Helper.findHeroById(solId);  //突破前的属性
        var itemConfig = Helper.findItemId(solId);  //突破前的item属性
        var breakLev = GLOBALDATA.soldiers[solId].q;  //进阶等级
        var afArmyAttribute = Helper.findHeroById(armyAttribute.breakid);   //突破后的属性
        var afItemConfig = Helper.findItemId(armyAttribute.breakid);  //突破后的item属性
        //突破前士兵名称
        if(breakLev == 0){
            this.B_stayBreakArmyName.setString(itemConfig.itemname);
            this.B_breaArmykName.setString(afItemConfig.itemname);  //突破后士兵名称
        }else{
            this.B_stayBreakArmyName.setString(itemConfig.itemname+"+"+breakLev);
            this.B_breaArmykName.setString(afItemConfig.itemname+"+"+breakLev);  //突破后士兵名称
        }
        Helper.setNamecolorByQuality(this.B_stayBreakArmyName,itemConfig.quality);  //颜色
        Helper.setNamecolorByQuality(this.B_breaArmykName,afItemConfig.quality);  //颜色
        //兵种类型图标
        HeroDefault.setHeroTypeImage(this.beforeArmyType,armyAttribute.armytype);  //进阶前士兵类型
        HeroDefault.setHeroTypeImage(this.afterArmyType,afArmyAttribute.armytype);  //进阶后士兵类型
        //资质
        this.bPtitude.setString(STRINGCFG[100034].string+"："+armyAttribute.intelligence);  //100034 资质//突破前资质
        Helper.setNamecolorByQuality(this.bPtitude,itemConfig.quality);  //颜色
        this.aPtitude.setString(STRINGCFG[100034].string+"："+afArmyAttribute.intelligence);  //100034 资质//突破后资质
        Helper.setNamecolorByQuality(this.aPtitude,afItemConfig.quality);  //颜色

        //突破需要的东西
        var breakNeedAtt = Helper.findArmyBreakById(solId);
        //等级需求
        this.B_rankValue.setString(GLOBALDATA.soldiers[solId].l+'/'+ breakNeedAtt.armylvlimit);
        //突破后的技能描述
        var skillCfg = Helper.findSkillById(afArmyAttribute.skillid);
        var textSize = this.B_talentDescribe.getContentSize();
        var fontSize = this.B_talentDescribe.getFontSize();
        var richText = ccui.RichText.create();
        var re1 = ccui.RichElementText.create(1, cc.color(255,186,0),255,STRINGCFG[100107].string+"：", "Arial",fontSize);  //100107 主动技能
        richText.pushBackElement(re1);
        var re2 = ccui.RichElementText.create(1, cc.color(255,0,0),255,skillCfg.describe, "Arial",fontSize);
        richText.pushBackElement(re2);
        richText.setPosition(textSize.width/2,textSize.height/2);
        richText.ignoreContentAdaptWithSize(false);
        richText.setContentSize(textSize.width,textSize.height);
        richText.setTextHorizontalAlignment(cc.TEXT_ALIGNMENT_LEFT);
        richText.setTextVerticalAlignment(cc.VERTICAL_TEXT_ALIGNMENT_TOP);
        richText.formatText();
        this.B_talentDescribe.removeAllChildren(true);
        this.B_talentDescribe.addChild(richText);
        this.B_talentDescribe.setString("");

        //当前属性
        this.nowInfo = {};  //现在的信息
        var soldier = GLOBALDATA.soldiers[solId];
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
        var attr = new heroAttr(soldier.p, soldier.l, soldier.q, soldier.m, soldier.w, soldier.sq, soldier.eq, equlist, depotData, commanderData,teamlist);


        this.nowInfo.Atk = attr.getBaseAttr(2);  //攻击
        this.nowInfo.Hp = attr.getBaseAttr(1);  //生命
        this.nowInfo.Def = attr.getBaseAttr(3);  //防御
        this.B_attack.setString(STRINGCFG[100035].string+"："+this.nowInfo.Atk);  //100035  攻击  //当前攻击
        this.B_life.setString(STRINGCFG[100032].string+"："+this.nowInfo.Hp);   //100032 生命  //当前生命
        this.B_defense.setString(STRINGCFG[100033].string+"："+this.nowInfo.Def);  //100033 防御  //当前防御
        //突破后的属性
        this.nextInfo = {};   //突破后的信息
        var upattr = new heroAttr(soldier.p, soldier.l, soldier.q, soldier.m + 1, soldier.w, soldier.sq, soldier.eq, equlist, depotData, commanderData, teamlist);
        this.nextInfo.Atk = upattr.getBaseAttr(2);  //攻击
        this.nextInfo.Hp = upattr.getBaseAttr(1);  //生命
        this.nextInfo.Def = upattr.getBaseAttr(3);  //防御
        this.N_attack.setString(STRINGCFG[100035].string+"："+this.nextInfo.Atk);  //100035 攻击  //突破后攻击
        this.N_life.setString(STRINGCFG[100032].string+"："+this.nextInfo.Hp);   //100032 生命  //突破后生命
        this.N_defense.setString(STRINGCFG[100033].string+"："+this.nextInfo.Def);  //100033 防御  //突破后防御

        //突破金币
        this.B_gold.setString(Helper.formatNum(breakNeedAtt.cost[0][1]));
        if(breakNeedAtt.cost[0][1] > GLOBALDATA.base.money){  //突破的钱不够
            this.B_gold.setColor(cc.color(255,0,0));
        }else{
            this.B_gold.setColor(cc.color(255,255,255));
        }
        //突破需要的物品
        var itemid = breakNeedAtt.cost[1][0]
        var itemCon = Helper.findItemId(itemid);
        Helper.LoadIconFrameAndAddClick(this.itemIcon,this.itemBg,this.itemPieces,itemCon);  //物品
        var haveNum = Helper.getItemNum(itemid);
        this.itemNum.setString(haveNum+"/"+breakNeedAtt.cost[1][1]);  //数量
        if(breakNeedAtt.cost[1][1] > haveNum){
            this.itemNum.setColor(cc.color(255,0,0));
        }else{
            this.itemNum.setColor(cc.color(255,255,255));
        }
        this.itemBg.setTag(itemid);
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
    //进阶标签事件
    AdvancedEvent:function(sender,type){
        if(ccui.Widget.TOUCH_ENDED==type){
            var breakLayer = new armyEvolutionLayer(this.index);
            this.getParent().addChild(breakLayer,2);
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
    //改造标签的事件
    reformEvent:function(sender, type){
        if(ccui.Widget.TOUCH_ENDED==type){
            var ReformLayer = new armyReformLayer(this.index);
            this.getParent().addChild(ReformLayer,2);
            this.removeFromParent(true);
        }
    },
    upEvolutionEvent:function(sender, type){
        if(ccui.Widget.TOUCH_ENDED==type){
        //已经突破过了不能再次突破
        //	突破需要当前的士兵达到指定的等级，如果等级不足，则点击突破时提示：突破所需要等级不足，请尽快提升士兵等级
        //	突破需要一定的道具，兵种及金币，如道具不足，则弹出提示：对应的道具名称不足
        //	如果兵种不足，则弹出提示：对应的兵种不足
        //	如金币不足，则弹出提示：金币不足
        //	如上面皆足够则突破成功,并更新数据
            var solId = GLOBALDATA.army.battle[this.index];
            var soldier = GLOBALDATA.soldiers[solId];
            if(soldier.m > 0){  //突破过
                ShowTipsTool.ErrorTipsFromStringById(100104);   //100104 该士兵已经突破过了，不能再次突破
                return;
            }
            //突破需要的东西
            var breakNeedAtt = Helper.findArmyBreakById(solId);
            if(breakNeedAtt.armylvlimit > GLOBALDATA.soldiers[solId].l){  //突破需求的士兵等级大于当前的士兵等级
                var str = StringFormat(STRINGCFG[100101].string,breakNeedAtt.armylvlimit);  //100101 士兵等级未达到$1级，无法突破
                ShowTipsTool.TipsFromText(str,cc.color.RED,30);   //显示tips
                return;
            }
            //判断需要的材料是否足够
            for(var key in breakNeedAtt.cost){
                var itemNeed = breakNeedAtt.cost[key];
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
            armyModel.break(solId);
        }
    },

    onTouchEvent:function(sender, type){
        if(ccui.Widget.TOUCH_ENDED==type){
            switch (sender.name) {
                case "itemBg":
                    var itemid = sender.getTag();
                    var itemJumpLayer = new ItemJumpLayer(itemid);
                    this.addChild(itemJumpLayer,2);
                    break;
            }
        }
    },

    updateInfo:function () {
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
        cc.eventManager.removeListener(this.armyBreakEvent);
        cc.log('armyBreakLayer onExit');
    }
});