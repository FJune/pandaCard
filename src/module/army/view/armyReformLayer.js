
/**
 ** @Author:pandayu
 ** @Version:1.0
 ** @DateTime:2018-09-09
 ** @Project:pandaCard CardGame
 ** @Contact: QQ:815099602
 **/
 /**
 * 士兵改造层的创建
 */
var armyReformLayer = baseLayer.extend({
    LayerName:"armyReformLayer",
    ctor:function(index){
        this._super();
        this.index = index;
    },

    onEnter:function(){
        this._super();
        var self = this;
        this.armyReformEvent = cc.EventListener.create({
            event:cc.EventListener.CUSTOM,
            eventName: "soldier.superevolve",
            callback:function(event){
                var resData = event.getUserData();
                if(resData.status == 0){
                    //突破成功的提示
                    ShowTipsTool.TipsFromText(STRINGCFG[100089].string+(self.nextInfo.Hp-self.nowInfo.Hp),cc.color.GREEN,30);  //100089  生命增加
                    ShowTipsTool.TipsFromText(STRINGCFG[100090].string+(self.nextInfo.Atk-self.nowInfo.Atk),cc.color.GREEN,30); //100090  攻击增加
                    ShowTipsTool.TipsFromText(STRINGCFG[100091].string+(self.nextInfo.Def-self.nowInfo.Def),cc.color.GREEN,30);  //100091 防御增加

                    var solId = GLOBALDATA.army.battle[self.index];
                    var soldier = GLOBALDATA.soldiers[solId];
                    if(soldier.sq >= 10){  //最高改造等级了
                        var evn = new cc.EventCustom('updateUI');
                        evn.setUserData(self.index);
                        cc.eventManager.dispatchEvent(evn);
                        self.removeFromParent(true);
                    }else{
                        self.initArmyData(solId);
                    }
                }
            }
        });
        cc.eventManager.addListener(this.armyReformEvent, this);

    },
    //初始化ui
    initUI:function () {
        this.customWidget();  //自定义Widget
        this.updateInfo();
    },
    //自定义Widget
    customWidget:function(){
        var wgtArr = [];
        wgtArr.push("B_stayBreakArmyName");   //改造前士兵名称
        wgtArr.push("B_breaArmykName");   //改造后士兵名称
        wgtArr.push("beforeArmyType");   //改造前士兵类型
        wgtArr.push("afterArmyType");  //改造后士兵类型
        wgtArr.push("B_needRank");   //改造前等级
        wgtArr.push("B_talent");   //改造后等级
        wgtArr.push("B_talentDescribe");   //改造成长率
        wgtArr.push("skillDesText");   //技能描述
        for(var i = 1;i <= 10;i++){
            //改造的阶段
            wgtArr.push("reform"+i);
        }
        wgtArr.push("B_gold");    //改造的金币消耗
        //改造消耗的物品
        for(var i = 1;i <= 2;i++){
            wgtArr.push("itemBg"+i);
            wgtArr.push("itemIcon"+i);
            wgtArr.push("itemPieces"+i);
            wgtArr.push("itemNum"+i);
        }
        wgtArr.push("armyBreakShow");  //士兵的模型容器
        wgtArr.push("btnBack");  //返回按钮
        wgtArr.push("btnUpLevel");   //升级标签
        wgtArr.push("btnAdvanced");   //进阶标签
        wgtArr.push("btnAwake");  //觉醒标签
        wgtArr.push("btnBreak");  //突破标签
        wgtArr.push("btnReform");  //改造标签
        wgtArr.push("B_ReformBtn");  //改造按钮
        //红点
        for(var i=1;i<=5;i++){
            wgtArr.push("tipsImageG"+i);
        }
        var uiReform = ccsTool.load(res.uiArmyReformLayer,wgtArr);
        //控件的名字赋值给this变量
        for(var key in uiReform.wgt){
            this[key] = uiReform.wgt[key];
        }
        uiReform.node.setPosition(cc.p(0, 105));
        this.addChild(uiReform.node);

        //返回按钮
        this.btnBack.addTouchEventListener(this.backEvent, this);
        //升级标签
        this.btnUpLevel.addTouchEventListener(this.levelUpEvent, this);
        //进阶标签
        this.btnAdvanced.addTouchEventListener(this.AdvancedEvent, this);
        //觉醒标签
        this.btnAwake.addTouchEventListener(this.awakeEvent, this);
        //突破标签
        this.btnBreak.addTouchEventListener(this.breakEvent, this);
        //改造标签
        this.btnReform.setBrightStyle(ccui.Widget.BRIGHT_STYLE_HIGH_LIGHT);//控件高亮
        this.btnReform.setTouchEnabled(false);
        //改造按钮
        this.B_ReformBtn.addTouchEventListener(this.upReformEvent, this);

        //材料1
        this.itemBg1.addTouchEventListener(this.onTouchEvent, this);
        //材料2
        this.itemBg2.addTouchEventListener(this.onTouchEvent, this);

        //士兵模型的容器
        var armyId = GLOBALDATA.army.battle[this.index];
        var soldier = GLOBALDATA.soldiers[armyId];
        if(soldier.m > 0){
            var qhero = Helper.findHeroById(armyId);
            armyId = qhero.breakid || armyId;
        }
        var armyAttribute = Helper.findHeroById(armyId);  //改造前的属性
        var layout = new ccui.Layout();
        var Contentsize = this.armyBreakShow.getContentSize();
        layout.setContentSize(Contentsize);
        HeroDefault.runAdle(armyId,layout,190,0,1,1);  //英雄的原地动作
        HeroDefault.runAdle(armyAttribute.reform,layout,450,0,1,1);  //终极改造英雄的原地动作
        this.armyBreakShow.removeAllChildren(true);
        this.armyBreakShow.addChild(layout);
    },
    //士兵数据显示函数
    initArmyData:function(solId){
        var armyId = solId;
        var soldier = GLOBALDATA.soldiers[solId];
        if(soldier.m > 0){
            var qhero = Helper.findHeroById(armyId);
            armyId = qhero.breakid || armyId;
        }
        var armyAttribute = Helper.findHeroById(armyId);  //改造前的属性
        var itemConfig = Helper.findItemId(armyId);  //改造前的item属性
        this.ReformConfigArray = [];    //改造的配置信息数组
        var isFind = false;   //已经找到
        for(var key in ARMYREFORMCFG){
            if(ARMYREFORMCFG[key].armyid == solId){
                this.ReformConfigArray.push(ARMYREFORMCFG[key]);
                isFind = true;
            }else if(isFind){  //当后面的不在是查找的内容的时候
                break;
            }
        }
        var afterarmyAttribute = Helper.findHeroById(armyAttribute.reform);  //改造后的属性
        var afterItemConfig = Helper.findItemId(armyAttribute.reform);  //改造后的item属性
        //改造前的士兵名称
        this.B_stayBreakArmyName.setString(itemConfig.itemname);
        Helper.setNamecolorByQuality(this.B_stayBreakArmyName,itemConfig.quality);  //颜色
        //改造后的士兵名称
        this.B_breaArmykName.setString(afterItemConfig.itemname);
        Helper.setNamecolorByQuality(this.B_breaArmykName,afterItemConfig.quality);  //颜色
        //兵种类型图标
        HeroDefault.setHeroTypeImage(this.beforeArmyType,armyAttribute.armytype);  //进阶前士兵类型
        HeroDefault.setHeroTypeImage(this.afterArmyType,afterarmyAttribute.armytype);  //进阶后士兵类型
        this.B_needRank.setString(STRINGCFG[100105].string+"+"+soldier.sq);   //100105 改造等级 改造前等级
        this.B_talent.setString(STRINGCFG[100105].string+"+"+(soldier.sq+1));   //100105 改造等级 改造后等级
        //改造前后成长率
        var beforeUp = 0;
        for(var i = 0;i<soldier.sq;i++){
            beforeUp = beforeUp+this.ReformConfigArray[i].result;
        }
        //改造成长率
        var befStr = (beforeUp*100).toFixed(2);   //改造前增加的成长率
        var nowStr = (this.ReformConfigArray[soldier.sq].result*100).toFixed(2);   //这次增加的成长率
        var textSize = this.B_talentDescribe.getContentSize();
        var fontSize = this.B_talentDescribe.getFontSize();
        var richText = ccui.RichText.create();
        var re1 = ccui.RichElementText.create(1, cc.color(255,0,0),255,STRINGCFG[100108].string+"(", "Arial",fontSize);  //100108 成长率提升
        richText.pushBackElement(re1);
        var re2 = ccui.RichElementText.create(1, cc.color(255,255,255),255,befStr, "Arial",fontSize);
        richText.pushBackElement(re2);
        var re3 = ccui.RichElementText.create(1, cc.color(255,0,0),255,"+", "Arial",fontSize);
        richText.pushBackElement(re3);
        var re4 = ccui.RichElementText.create(1, cc.color(0,255,0),255,nowStr, "Arial",fontSize);
        richText.pushBackElement(re4);
        var re5 = ccui.RichElementText.create(1, cc.color(255,0,0),255,")%", "Arial",fontSize);
        richText.pushBackElement(re5);
        richText.setPosition(textSize.width/2,textSize.height/2);
        this.B_talentDescribe.removeAllChildren(true);
        this.B_talentDescribe.addChild(richText);
        this.B_talentDescribe.setString("");
        //技能描述
        if(this.ReformConfigArray[soldier.sq].skilldes != null){
            this.skillDesText.setVisible(true);
            this.skillDesText.setString(this.ReformConfigArray[soldier.sq].skilldes);
        }else{
            this.skillDesText.setVisible(false);
        }
        //改造的进度突破图片
        for(var i = 1;i <= 10;i++){
            if(i <= soldier.sq){
                this["reform"+i].loadTexture("common/i/i_034_3.png",ccui.Widget.PLIST_TEXTURE);
            }
        }
        var material = this.ReformConfigArray[soldier.sq].material;
        //改造的金币消耗
        this.B_gold.setString(Helper.formatNum(material[0][1]));
        if(material[0][1] > GLOBALDATA.base.money){  //进阶的钱不够
            this.B_gold.setColor(cc.color(255,0,0));
        }else{
            this.B_gold.setColor(cc.color(255,255,255));
        }
        //改造需要的物品
        var count = 1;
        for(var i=1;i<=2;i++){
            if(material[i] != null){
                var itemid = material[i][0];
                var itemCon = Helper.findItemId(itemid);
                Helper.LoadIconFrameAndAddClick(this["itemIcon"+i],this["itemBg"+i],this["itemPieces"+i],itemCon);  //物品
                var haveNum = Helper.getItemNum(itemid);
                this["itemNum"+i].setString(haveNum+"/"+material[i][1]);  //数量
                if(material[i][1] > haveNum){
                    this["itemNum"+i].setColor(cc.color(255,0,0));
                }else{
                    this["itemNum"+i].setColor(cc.color(255,255,255));
                }
                this["itemBg"+i].setTag(itemid);
                count++;
            }
        }
        for(var i=count;i<=2;i++){
            this["itemBg"+i].setVisible(false);
        }

        //当前属性
        this.nowInfo = {};  //现在的信息
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

        this.nowInfo.Atk = attr.getBaseAttr(2);  //攻击
        this.nowInfo.Hp = attr.getBaseAttr(1);  //生命
        this.nowInfo.Def = attr.getBaseAttr(3);  //防御
        //下一阶段属性
        this.nextInfo = {};   //下一级的信息
        var upattr = new heroAttr(soldier.p, soldier.l, soldier.q, soldier.m, soldier.w, soldier.sq + 1, soldier.eq, equlist, depotData, commanderData, teamlist);
        this.nextInfo.Atk = upattr.getBaseAttr(2);  //攻击
        this.nextInfo.Hp = upattr.getBaseAttr(1);  //生命
        this.nextInfo.Def = upattr.getBaseAttr(3);  //防御
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
    //突破标签的事件
    breakEvent:function(sender, type){
        if(ccui.Widget.TOUCH_ENDED==type){
            var EvolutionLayer = new armyBreakLayer(this.index);
            this.getParent().addChild(EvolutionLayer,2);
            this.removeFromParent(true);
        }
    },
    upReformEvent:function(sender, type){
        if(ccui.Widget.TOUCH_ENDED==type){
        //已经改造了10次了，不能继续改造了
        //	改造需要一定的道具，兵种及金币，如道具不足，则弹出提示：对应的道具名称不足
        //	如果兵种不足，则弹出提示：对应的兵种不足
        //	如金币不足，则弹出提示：金币不足
        //	如上面皆足够则改造成功,并更新数据
            var solId = GLOBALDATA.army.battle[this.index];
            var soldier = GLOBALDATA.soldiers[solId];
            if(soldier.sq >= 10){  //已经改造了10次
                ShowTipsTool.ErrorTipsFromStringById(100106);   //100106 该士兵已经达到改造次数上限
                return;
            }
            //判断需要的材料是否足够
            var material = this.ReformConfigArray[soldier.sq].material;
            for(var key in material){
                var itemNeed = material[key];
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
            armyModel.reform(solId);
        }
    },

    onTouchEvent:function(sender, type){
        if(ccui.Widget.TOUCH_ENDED==type){
            switch (sender.name) {
                case "itemBg1":
                case "itemBg2":
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
        cc.eventManager.removeListener(this.armyReformEvent);
        cc.log('armyReformLayer onExit');
    }
});