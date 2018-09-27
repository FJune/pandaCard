
/**
 ** @Author:pandayu
 ** @Version:1.0
 ** @DateTime:2018-09-09
 ** @Project:pandaCard CardGame
 ** @Contact: QQ:815099602
 **/
 /**
 * 士兵升级层的创建
 */
var armyLevelUpLayer = baseLayer.extend({
    LayerName:"armyLevelUpLayer",
    totalRole:0,
    fiveUp:0,
    nowIndex:0,  //翻页的索引
    ctor:function(index){
        this._super();
        this.index = index;
        this.armyIndexArr = [];
    },
    onEnter:function(){
        this._super();
        this.initCustomEvent();
    },
    //初始化ui
    initUI:function () {
        this.customWidget();  //自定义Widget
        this.updateInfo();
    },
    initCustomEvent:function () {
        //军衔升级处理
        var self = this;
        this.evnArmyLevelUp = cc.EventListener.create({
            event: cc.EventListener.CUSTOM,
            eventName: "soldier.levelup",
            callback: function(event){
                var resData = event.getUserData();
                if(resData.status!=0){//升级失败
                    self.fiveUp = 0;
                }else {
                    //升级成功提示
                    var solId = GLOBALDATA.army.battle[self.index];
                    var soldier = GLOBALDATA.soldiers[solId];
                    var equlist =  GLOBALDATA.army.equips[self.index];
                    var depotData = GLOBALDATA.depot;
                    var commanderData = GLOBALDATA.commanders[GLOBALDATA.army.commander];
                    var teamlist = GLOBALDATA.army.battle.concat(GLOBALDATA.army.companion);

                    var nextInfo = {};  //现在的信息
                    var upattr = new heroAttr(soldier.p, soldier.l, soldier.q, soldier.m, soldier.w, soldier.sq, soldier.eq, equlist, depotData, commanderData,teamlist);
                    nextInfo.Atk = upattr.getBaseAttr(2);  //攻击
                    nextInfo.Hp = upattr.getBaseAttr(1);  //生命
                    nextInfo.Def = upattr.getBaseAttr(3);  //防御

                    //觉醒成功的提示
                    ShowTipsTool.TipsFromText(STRINGCFG[100089].string+(nextInfo.Hp-self.nowInfo.Hp),cc.color.GREEN,30);  //100089  生命增加
                    ShowTipsTool.TipsFromText(STRINGCFG[100090].string+(nextInfo.Atk-self.nowInfo.Atk),cc.color.GREEN,30); //100090  攻击增加
                    ShowTipsTool.TipsFromText(STRINGCFG[100091].string+(nextInfo.Def-self.nowInfo.Def),cc.color.GREEN,30);  //100091 防御增加
                    // 更新士兵信息
                    self.updateAttr();
                }
            }
        });
        cc.eventManager.addListener(this.evnArmyLevelUp, 1);
        //处理金币兑换的返回
        this.fromBuyGoldEvent = cc.EventListener.create({
            event: cc.EventListener.CUSTOM,
            eventName: "updateUI.fromBuyGold",
            callback: function(event){
                self.dealGoldInfo();  //处理金币
            }
        });
        cc.eventManager.addListener(this.fromBuyGoldEvent, 1);
    },
    //自定义Widget
    customWidget:function(){
        var wgtArr = [];
        wgtArr.push("btnBack");  //返回按钮
        wgtArr.push("btnUpLevel");  //升级标签
        wgtArr.push("btnAdvanced");  //进阶标签
        wgtArr.push("btnAwake");  //觉醒标签
        wgtArr.push("btnBreak");  //突破标签
        wgtArr.push("btnReform");  //改造标签
        wgtArr.push("pvShowRole");  //放模型的翻页容器
        wgtArr.push("leftBtn");  //向左的按钮
        wgtArr.push("rightBtn");  //向右的按钮
        wgtArr.push("armyName");  //士兵名称
        wgtArr.push("armyType");  //兵种类型
        wgtArr.push("curRank");  //当前等级
        wgtArr.push("curAtk");  //当前攻击
        wgtArr.push("curHp");  //当前生命
        wgtArr.push("curDef");  //当前防御
        wgtArr.push("upRank");  //下一级等级
        wgtArr.push("upAtk");  //下一级攻击
        wgtArr.push("upHp");  //下一级生命
        wgtArr.push("upDef");  //下一级防御
        wgtArr.push("gold");  //升一级需要的金币
        wgtArr.push("fiveGold");  //升五级需要的金币
        wgtArr.push("upLevelBtn");  //升级一次的按钮
        wgtArr.push("upFiveLevelBtn");  //升级五次的按钮
        //红点
        for(var i=1;i<=5;i++){
            wgtArr.push("tipsImageG"+i);
        }
        var uiArmyUpRank = ccsTool.load(res.uiArmyUpLevelLayer,wgtArr);
        //控件的名字赋值给this变量
        for(var key in uiArmyUpRank.wgt){
            this[key] = uiArmyUpRank.wgt[key];
        }
        this.addChild(uiArmyUpRank.node);
        uiArmyUpRank.node.setPosition(cc.p(0, 105));
        //返回按钮
        this.btnBack.addTouchEventListener(this.backEvent, this);
        //升级标签
        this.btnUpLevel.setBrightStyle(ccui.Widget.BRIGHT_STYLE_HIGH_LIGHT);
        this.btnUpLevel.setTouchEnabled(false);
        //进阶标签
        this.btnAdvanced.addTouchEventListener(this.AdvancedEvent, this);
        //觉醒标签
        this.btnAwake.addTouchEventListener(this.awakeEvent, this);
        //突破标签
        this.btnBreak.addTouchEventListener(this.breakEvent, this);
        //改造标签
        this.btnReform.addTouchEventListener(this.reformEvent, this);

        //士兵展示pageView 放模型的翻页容器
        for (var i=0;i<GLOBALDATA.army.battle.length;i++){
            if (GLOBALDATA.army.battle[i]!=0&&GLOBALDATA.army.battle[i]!=-1){
                var layout = new ccui.Layout();
                var Contentsize = this.pvShowRole.getContentSize();
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
                HeroDefault.runAdle(armyId,layout,320,0,1,1);  //英雄的原地动作
                this.pvShowRole.addPage(layout);
                this.armyIndexArr.push(i);
                this.totalRole++;
            }
        }
        var self = this;
        this.nowIndex = this.getPageIndex(this.index);
        this.pvShowRole.setCurrentPageIndex(this.nowIndex);
        this.pvShowRole.setTouchEnabled(false);
        /*this.pvShowRole.addEventListener(function (sender, type) {
            this.nowIndex = sender.getCurPageIndex().valueOf();
            self.index = this.armyIndexArr[this.nowIndex];
            self.updateInfo();
        }, this);*/
        //向左的按钮
        this.leftBtn.addTouchEventListener(this.leftEvent, this);
        //向右的按钮
        this.rightBtn.addTouchEventListener(this.rightEvent, this);

        //升级五次的按钮
        this.upFiveLevelBtn.addTouchEventListener(this.armyLevelUp, this);
        //升级一次的按钮
        this.upLevelBtn.addTouchEventListener(this.armyLevelUp, this);
    },
    //升级一次和升级五次的按钮事件
    armyLevelUp:function(sender, type){
        if(ccui.Widget.TOUCH_ENDED==type){
            switch (sender.name) {
                case 'upLevelBtn'://升一级的按钮
                    if(this.beforeError()){
                        //this.fiveUp = 0;
                        armyModel.upGrade(GLOBALDATA.army.battle[this.index],1);
                    }
                    break;
                case 'upFiveLevelBtn'://升五级的按钮
                    var gold = 0;//升级需要的金币
                    var levCount = 0;//可以升几级标签
                    var armyId = GLOBALDATA.army.battle[this.index];
                    var soldier = GLOBALDATA.soldiers[armyId];
                    var level = soldier.l;//士兵的等级
                    var upLevel = GLOBALDATA.base.lev - soldier.l;//可以升几级
                    if(this.beforeError()){
                        if(upLevel >= 5){
                            for(var i=0;i<5;i++){
                                var lvCfg = Helper.findLvCfgByLv(level);
                                level++;
                                gold += lvCfg.amycost;
                                if(GLOBALDATA.base.money > gold){
                                    levCount++;
                                }else{
                                    armyModel.upGrade(GLOBALDATA.army.battle[this.index],levCount);
                                }
                            }
                            if(levCount == 5){
                                armyModel.upGrade(GLOBALDATA.army.battle[this.index],levCount);
                            }
                        }else{
                            for(var i=0;i<upLevel;i++){
                                var lvCfg = Helper.findLvCfgByLv(level);
                                level++;
                                gold += lvCfg.amycost;
                                if(GLOBALDATA.base.money > gold){
                                    levCount++;
                                }else{
                                    armyModel.upGrade(GLOBALDATA.army.battle[this.index],levCount);
                                }
                            }
                            if(upLevel == levCount){
                                armyModel.upGrade(GLOBALDATA.army.battle[this.index],levCount);
                            }
                        }
                        //this.fiveUp = 4;
                    }
                    break;
                default:
                    break;
            }
        }
    },
    //预先错误显示
    beforeError:function () {
        var armyId = GLOBALDATA.army.battle[this.index];
        var soldier = GLOBALDATA.soldiers[armyId];
        var lvCfg = Helper.findLvCfgByLv(soldier.l);
        if(GLOBALDATA.base.money < lvCfg.amycost){  //升一级的金币都不够
            //跳转到金币兑换界面
            var _buyGoldLayer = new buyGoldLayer();
            this.addChild(_buyGoldLayer,3);
            return false;
        }
        if(soldier.l >= GLOBALDATA.base.lev){  //士兵的等级大于等于指挥官等级
            ShowTipsTool.ErrorTipsFromStringById(100082);   //士兵等级不可超过指挥官等级
            return false;
        }
        if(soldier.l >= MAXLVARMYMLEVEL){  //大于了最高英雄等级
            ShowTipsTool.ErrorTipsFromStringById(100092);  //士兵等级已经达到最高等级上限
            return false;
        }
        return true;
    },
    //左切换按钮事件
    leftEvent:function(sender, type){
        if(ccui.Widget.TOUCH_ENDED==type){
            this.nowIndex--;
            this.pvShowRole.setCurrentPageIndex(this.nowIndex);
            this.updateInfo();
        }
    },
    //右切换按钮事件
    rightEvent:function(sender, type){
        if(ccui.Widget.TOUCH_ENDED==type){
            this.nowIndex++;
            this.pvShowRole.setCurrentPageIndex(this.nowIndex);
            this.updateInfo();
        }
    },
    updateInfo:function () {
        //控制左右按钮显示隐藏
        if(this.nowIndex==0){
            this.leftBtn.setVisible(false);
        }else {
            this.leftBtn.setVisible(true);
        }
        if(this.nowIndex==this.totalRole-1){
            this.rightBtn.setVisible(false);
        }else {
            this.rightBtn.setVisible(true);
        }
        this.index = this.armyIndexArr[this.nowIndex];
        //更新士兵名称
        var armyId = GLOBALDATA.army.battle[this.index];
        var soldier = GLOBALDATA.soldiers[armyId];
        if(soldier.m > 0){ //突破过
            var qhero = Helper.findHeroById(armyId);
            armyId = qhero.breakid || armyId;
        }
        if(soldier.sq == 10){  //已经进行了终极改造
            var reformAtt = Helper.findHeroById(armyId);
            armyId = reformAtt.reform || armyId;
        }
        var hero = Helper.findHeroById(armyId);
        var itemConfig = Helper.findItemId(armyId);
        this.armyName.setString(itemConfig.itemname + (soldier.q > 0 ? " +" + soldier.q : ""));
        Helper.setNamecolorByQuality(this.armyName,itemConfig.quality);  //颜色
        HeroDefault.setHeroTypeImage(this.armyType,hero.armytype);  //兵种类型图标
        //处理五个标签按钮的状态
        this.DealButtonState();
        // 更新属性
        this.updateAttr();
        //处理红点
        this.dealRedPoint();
    },
    updateAttr:function () {
        var solId = GLOBALDATA.army.battle[this.index];
        var soldier = GLOBALDATA.soldiers[solId];
        var equlist =  GLOBALDATA.army.equips[this.index];
        var depotData = GLOBALDATA.depot;
        var commanderData = GLOBALDATA.commanders[GLOBALDATA.army.commander];
        var teamlist = GLOBALDATA.army.battle.concat(GLOBALDATA.army.companion);
        var attr = new heroAttr(soldier.p, soldier.l, soldier.q, soldier.m, soldier.w, soldier.sq, soldier.eq, equlist, depotData, commanderData, teamlist);

        this.nowInfo = {};  //现在的信息
        this.nowInfo.Atk = attr.getBaseAttr(2);  //攻击
        this.nowInfo.Hp = attr.getBaseAttr(1);   //生命
        this.nowInfo.Def = attr.getBaseAttr(3);  //防御
        this.curRank.setString(StringFormat(STRINGCFG[100047].string,soldier.l));  //100047  $1级  //当前等级
        this.curAtk.setString(STRINGCFG[100035].string+"："+this.nowInfo.Atk);    //100035 攻击  //当前攻击
        this.curHp.setString(STRINGCFG[100032].string+"："+this.nowInfo.Hp);   //100032 生命  //当前生命
        this.curDef.setString(STRINGCFG[100033].string+"："+this.nowInfo.Def);  //100033 防御  //当前防御
        this.upLevelBtn.setVisible(true);  //升一级的按钮
        this.upFiveLevelBtn.setVisible(true);  //升五级的按钮
        if(soldier.l >= MAXLVARMYMLEVEL){  //下一级大于了最大的英雄等级
            this.upRank.setString("MAX");  //下一级等级
            this.upAtk.setString("MAX");  //下一级攻击
            this.upHp.setString("MAX");   //下一级生命
            this.upDef.setString("MAX");  //下一级防御
            this.upLevelBtn.setVisible(false);  //升一级的按钮
            this.upFiveLevelBtn.setVisible(false);  //升五级的按钮
        }else{
            var nextInfo = {};  //下一级的信息
            var upattr = new heroAttr(soldier.p, soldier.l + 1, soldier.q, soldier.m, soldier.w, soldier.sq, soldier.eq, equlist, depotData, commanderData,teamlist);
            nextInfo.Atk = upattr.getBaseAttr(2);  //攻击
            nextInfo.Hp = upattr.getBaseAttr(1);  //生命
            nextInfo.Def = upattr.getBaseAttr(3);  //防御
            this.upRank.setString(StringFormat(STRINGCFG[100047].string,(soldier.l+1)));  //100047  $1级  //下一级等级
            this.upAtk.setString(STRINGCFG[100035].string+"："+nextInfo.Atk);  //100035 攻击  //下一级攻击
            this.upHp.setString(STRINGCFG[100032].string+"："+nextInfo.Hp);   //100032 生命  //下一级生命
            this.upDef.setString(STRINGCFG[100033].string+"："+nextInfo.Def);  //100033 防御  //下一级防御
        }
        this.dealGoldInfo();  //处理金币
    },
    //处理金币
    dealGoldInfo:function(){
        var solId = GLOBALDATA.army.battle[this.index];
        var soldier = GLOBALDATA.soldiers[solId];
        var lvCfg = Helper.findLvCfgByLv(soldier.l);
        this.gold.setString(Helper.formatNum(lvCfg.amycost));
        var totalGold = 0;
        for(var i=0,j=soldier.l;i<5;i++,j++){
            var lvCfgl = Helper.findLvCfgByLv(j) || {};
            totalGold+=lvCfgl.amycost || 0;
        }
        this.fiveGold.setString(Helper.formatNum(totalGold));
        //判断金币是否够
        if(lvCfg.amycost>GLOBALDATA.base.money){  //升级一次的钱不够
            this.gold.setColor(cc.color(255,0,0));
        }else{
            this.gold.setColor(cc.color(255,255,255));
        }
        if(totalGold>GLOBALDATA.base.money){ //升级五次的钱不够
            this.fiveGold.setColor(cc.color(255,0,0));
        }else{
            this.fiveGold.setColor(cc.color(255,255,255));
        }
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
    //返回按钮的事件
    backEvent:function(sender, type){
        if(ccui.Widget.TOUCH_ENDED==type){
            var evn = new cc.EventCustom('updateUI');
            evn.setUserData(this.index);
            cc.eventManager.dispatchEvent(evn);
            this.removeFromParent(true);
        }
    },
    //进阶标签的事件
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
    //改造标签的事件
    reformEvent:function(sender, type){
        if(ccui.Widget.TOUCH_ENDED==type){
            var ReformLayer = new armyReformLayer(this.index);
            this.getParent().addChild(ReformLayer,2);
            this.removeFromParent(true);
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
    onExit:function(){
        this._super();
        cc.log('armyLevelUpLayer onExit');
        cc.eventManager.removeListener(this.evnArmyLevelUp);
        cc.eventManager.removeListener(this.fromBuyGoldEvent);
    },
});