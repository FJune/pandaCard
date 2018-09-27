
/**
 ** @Author:pandayu
 ** @Version:1.0
 ** @DateTime:2018-09-09
 ** @Project:pandaCard CardGame
 ** @Contact: QQ:815099602
 **/
 /**
 *
 */
var ExploreLayer = baseLayer.extend({
    ctor:function () {
        this._super();
        this.LayerName = "ExploreLayer";
        this.viewType  = 0; // 0 普通视图 100 精英视图
        this.auto = 0;
        this._qnum_old = null;
        this._qnum = 0;
        this._Image_QNow_select = null;
        this._index_select = 0;

        this.stagelevel = parseInt(GLOBALDATA.base.stage.replace("STAGE", ""));
        this.uiAttributeLayer.setVisible(false);
    },

    onEnter:function () {
        this._super();
    },

    initUI:function(){
        this.obj = ccsTool.load(res.uiExploreLayer, [ "btnBack", "Button_common", "Button_elite", "Button_See", "Button_Gui",
            "Button_pass1", "Button_pass2", "Button_pass3", "Button_pass4", "Button_pass5", "Button_pass6", "Button_pass7", "Button_pass8", "Button_pass9", "Button_pass10",
            "TipsImageP1", "TipsImageP2", "TipsImageP3", "TipsImageP4", "TipsImageP5", "TipsImageP6", "TipsImageP7", "TipsImageP8", "TipsImageP9", "TipsImageP10"
        , "Panel_Go", "textName","btnGo", "textBar", "LoadingBar", "nodeBox","arsenBox", "imageBox", "textGNo",
            "bagBg1", "bagIcon1", "bagPieces1", "bagName1",
            "bagBg2", "bagIcon2", "bagPieces2", "bagName2",
            "bagBg3", "bagIcon3", "bagPieces3", "bagName3",
            "bagBg4", "bagIcon4", "bagPieces4", "bagName4",
            "bagBg5", "bagIcon5", "bagPieces5", "bagName5",
        , "Panel_Small", "btnSOk"
        , "Image_explore", "diamondValue", "refValue", "purpleValue", "orgValue",
            "textName2", "expBarGo", "textExpBarGo", "imageExpBoxGo", "nodeExpBoxGo",
            "btnImBack", "btnExplore","Image_bg1", "Image_bg2",
            "imageQNum","textQNum","btnQiyu", "btnBox", "TipsImageBox", "btnSee", "btnExWar", "TipsImageBoss",
            "textPower", "textCosPower", "powerButton","textPowerAdd", "autoCheck"
        , "Panel_QiyuGet", "Image_QiyuG"
        , "Panel_Qiyu", "btnQItem", "btnleft", "btnright", "ListView_Qi",
            "btnNo", "textQName", "textTime", "textQDate", "btnWar", "btnBuy",
            "Image_box1", "Image_box2", "Image_box3",
            "textQGet", "Node_box", "Node_Buy", "Node_Bag",
            "ListView_QReward", "bagQBg1", "bagQBg2",
            "diamongNValue1", "diamongNValue2",
            "btnQBack"
        , "Panel_Box",
            "textSenNum","senKeyValue", "interKeyValue",
            "DiamondImageBg1", "DiamondImageBg3",
            "diamongValue1", "diamongValue2", "diamongValue3", "diamongValue4",
            "btnSenOpenOne", "btnSenOpenTen", "btnInterOpenOne", "btnInterOpenTen",
            "btnOBack"
        , "layoutGet", "nodeOne", "nodeTen", "btnGOk",
            "getQBg", "getQIcon", "getQPieces", "getQName","getQNum",
            "getQBg1", "getQIcon1", "getQPieces1", "getQName1","getQNum1",
            "getQBg2", "getQIcon2", "getQPieces2", "getQName2","getQNum2",
            "getQBg3", "getQIcon3", "getQPieces3", "getQName3","getQNum3",
            "getQBg4", "getQIcon4", "getQPieces4", "getQName4","getQNum4",
            "getQBg5", "getQIcon5", "getQPieces5", "getQName5","getQNum5",
            "getQBg6", "getQIcon6", "getQPieces6", "getQName6","getQNum6",
            "getQBg7", "getQIcon7", "getQPieces7", "getQName7","getQNum7",
            "getQBg8", "getQIcon8", "getQPieces8", "getQName8","getQNum8",
            "getQBg9", "getQIcon9", "getQPieces9", "getQName9","getQNum9",
            "getQBg10", "getQIcon10", "getQPieces10", "getQName10","getQNum10"
        , "Panel_Find", "btnFNo", "btnFGo"
        , "Panel_tips", "btnBackTips"
            ]);

        this.addChild(this.obj.node, 1);

        this.obj.wgt.btnBack.addTouchEventListener(this.onTouchEvent, this);

        this.obj.wgt.Button_common.addTouchEventListener(this.onTouchEvent, this);
        this.obj.wgt.Button_elite.addTouchEventListener(this.onTouchEvent, this);
        this.obj.wgt.Button_See.addTouchEventListener(this.onTouchEvent, this);

        this.obj.wgt.Button_pass1.addTouchEventListener(this.onTouchEvent, this);
        this.obj.wgt.Button_pass2.addTouchEventListener(this.onTouchEvent, this);
        this.obj.wgt.Button_pass3.addTouchEventListener(this.onTouchEvent, this);
        this.obj.wgt.Button_pass4.addTouchEventListener(this.onTouchEvent, this);
        this.obj.wgt.Button_pass5.addTouchEventListener(this.onTouchEvent, this);
        this.obj.wgt.Button_pass6.addTouchEventListener(this.onTouchEvent, this);
        this.obj.wgt.Button_pass7.addTouchEventListener(this.onTouchEvent, this);
        this.obj.wgt.Button_pass8.addTouchEventListener(this.onTouchEvent, this);
        this.obj.wgt.Button_pass9.addTouchEventListener(this.onTouchEvent, this);
        this.obj.wgt.Button_pass10.addTouchEventListener(this.onTouchEvent, this);

        this.obj.wgt.Panel_Go.addTouchEventListener(this.onTouchEvent, this);
        this.obj.wgt.imageBox.addTouchEventListener(this.onTouchEvent, this);
        this.obj.wgt.btnGo.addTouchEventListener(this.onTouchEvent, this);

        this.obj.wgt.Panel_Small.addTouchEventListener(this.onTouchEvent, this);
        this.obj.wgt.btnSOk.addTouchEventListener(this.onTouchEvent, this);

        this.obj.wgt.Image_explore.addTouchEventListener(this.onTouchEvent, this);
        this.obj.wgt.imageExpBoxGo.addTouchEventListener(this.onTouchEvent, this);
        this.obj.wgt.btnImBack.addTouchEventListener(this.onTouchEvent, this);
        this.obj.wgt.btnExplore.addTouchEventListener(this.onTouchEvent, this);
        this.obj.wgt.btnQiyu.addTouchEventListener(this.onTouchEvent, this);
        this.obj.wgt.btnBox.addTouchEventListener(this.onTouchEvent, this);
        this.obj.wgt.btnSee.addTouchEventListener(this.onTouchEvent, this);
        this.obj.wgt.btnExWar.addTouchEventListener(this.onTouchEvent, this);
        this.obj.wgt.powerButton.addTouchEventListener(this.onTouchEvent, this);
        this.obj.wgt.autoCheck.addTouchEventListener(this.onTouchEvent, this);


        this.obj.wgt.Panel_Qiyu.addTouchEventListener(this.onTouchEvent, this);
        this.obj.wgt.btnQBack.addTouchEventListener(this.onTouchEvent, this);
        this.obj.wgt.btnleft.addTouchEventListener(this.onTouchEvent, this);
        this.obj.wgt.btnright.addTouchEventListener(this.onTouchEvent, this);
        this.obj.wgt.btnNo.addTouchEventListener(this.onTouchEvent, this);
        this.obj.wgt.btnWar.addTouchEventListener(this.onTouchEvent, this);
        this.obj.wgt.btnBuy.addTouchEventListener(this.onTouchEvent, this);
        this.obj.wgt.Image_box1.addTouchEventListener(this.onTouchEvent, this);
        this.obj.wgt.Image_box2.addTouchEventListener(this.onTouchEvent, this);
        this.obj.wgt.Image_box3.addTouchEventListener(this.onTouchEvent, this);

        this.obj.wgt.Panel_Box.addTouchEventListener(this.onTouchEvent, this);
        this.obj.wgt.btnOBack.addTouchEventListener(this.onTouchEvent, this);
        this.obj.wgt.btnSenOpenOne.addTouchEventListener(this.onTouchEvent, this);
        this.obj.wgt.btnSenOpenTen.addTouchEventListener(this.onTouchEvent, this);
        this.obj.wgt.btnInterOpenOne.addTouchEventListener(this.onTouchEvent, this);
        this.obj.wgt.btnInterOpenTen.addTouchEventListener(this.onTouchEvent, this);


        this.obj.wgt.layoutGet.addTouchEventListener(this.onTouchEvent, this);
        this.obj.wgt.btnGOk.addTouchEventListener(this.onTouchEvent, this);

        this.obj.wgt.Panel_Find.addTouchEventListener(this.onTouchEvent, this);
        this.obj.wgt.btnFNo.addTouchEventListener(this.onTouchEvent, this);
        this.obj.wgt.btnFGo.addTouchEventListener(this.onTouchEvent, this);

        this.obj.wgt.btnBackTips.addTouchEventListener(this.onTouchEvent, this);

        this.viewType = 0;
        this.switchView(this.viewType);
        this.obj.wgt.Button_common.setBright(false);
        this.obj.wgt.Button_common.setTouchEnabled(false);
        this.obj.wgt.Button_elite.setBright(true);
        this.obj.wgt.Button_elite.setTouchEnabled(true);

        this.obj.wgt.autoCheck.addEventListener(this.onCheckBoxEvent, this);
        this.obj.wgt.autoCheck.setSelected(false);

        // 加载模型
        var id = GLOBALDATA.army.commander;
        var commander = GLOBALDATA.commanders[id];
        this.commanderModel =  new this.Commander(commander.p);
        this.commanderModel.setPosition(315,654);
        this.commanderModel.actIdle();
        this.obj.wgt.Image_explore.addChild(this.commanderModel, 200);

        this.schedule(this.countdown, 1, cc.REPEAT_FOREVER);
        //
        var self = this;
        this.obj.wgt.ListView_Qi.addEventListener(function(sender, type){
            if(ccui.ListView.ON_SELECTED_ITEM_END == type){
                var index = sender.getCurSelectedIndex();
                self.switchPanelQiyu(true, index);
            }
        }, this);

        this.doAddListener();
    },

    doAddListener:function(){
        var self = this;

        // boss 入侵
        this.boss_appear = cc.EventListener.create({
            event: cc.EventListener.CUSTOM,
            eventName: "boss.appear",
            callback: function(event){
                self.auto = 0;
                self.obj.wgt.autoCheck.setSelected(false);
                self.showPanelFind();
            }});

        // 探险
        this.explore_begin = cc.EventListener.create({
            event: cc.EventListener.CUSTOM,
            eventName: "explore.begin",
            callback: function(event){
                self._qnum_old = self._qnum;
                self.showPanelExplore();
                self.stopExplore();
                self.resourceGet(event.getUserData());

            }});

        // 更新体力
        this.explore_update_explore  = cc.EventListener.create({
            event: cc.EventListener.CUSTOM,
            eventName: "data.update.explore",
            callback: function(event){
                self.updateTili();
            }});

        // 购买体力
        this.explore_addnum  = cc.EventListener.create({
            event: cc.EventListener.CUSTOM,
            eventName: "explore.addnum",
            callback: function(event){
                self.showPanelExplore();
            }});

        // 开进度宝箱
        this.explore_spbox  = cc.EventListener.create({
            event: cc.EventListener.CUSTOM,
            eventName: "explore.spbox",
            callback: function(event){
                self.resourceGet(event.getUserData());
                if (self.obj.wgt.Panel_Go.isVisible())
                {
                    self.showPanelGo(true);
                }
                if (self.obj.wgt.Image_explore.isVisible())
                {
                    self.showPanelExplore();
                }
            }});
        // 奇遇 放弃
        this.explore_gaveup = cc.EventListener.create({
            event: cc.EventListener.CUSTOM,
            eventName: "explore.gaveup",
            callback: function(event){
                self.showPanelExplore();
                self.showPanelQiyu(true, false);
                self.resourceGet(event.getUserData());
            }});
        // 奇遇战斗
        this.explore_stage = cc.EventListener.create({
            event: cc.EventListener.CUSTOM,
            eventName: "explore.stage",
            callback: function(event){
                self.showPanelExplore();
                self.showPanelQiyu(true, false);
                self.resourceGet(event.getUserData());
                self.removeCombat();

            }});

        // 奇遇购买商品
        this.explore_shop = cc.EventListener.create({
            event: cc.EventListener.CUSTOM,
            eventName: "explore.shop",
            callback: function(event){
                self.showPanelExplore();
                self.showPanelQiyu(true, false);
                self.resourceGet(event.getUserData());
            }});

        // 奇遇开启天降宝箱
        this.explore_heavenbox = cc.EventListener.create({
            event: cc.EventListener.CUSTOM,
            eventName: "explore.heavenbox",
            callback: function(event){
                self._qnum_old = self._qnum;
                self.showPanelExplore();
                self.showPanelQiyu(false, false);
                self.resourceGet(event.getUserData());
            }});

        // 抽宝物箱
        this.explore_box = cc.EventListener.create({
            event: cc.EventListener.CUSTOM,
            eventName: "explore.box",
            callback: function(event){
                self.showPanelExplore();
                self.showPanelBox();
                self.showLayoutGet(event.getUserData().data);
            }});

        this.explore_combat = cc.EventListener.create({
            event: cc.EventListener.CUSTOM,
            eventName: "explore.combat",
            callback: function(event){
                var ret = event.getUserData();
                if (ret.result == 'victory')
                {
                    self.combatCallback(1);
                }
                else if (ret.result == 'defeat')
                {
                    var loseDlg = new loseLayer();
                    self.addChild(loseDlg,2);

                    self.removeCombat();
                }
                else
                {
                    if (self.combat)
                    {
                        self.combat.removeFromParent(true);
                        self.combat = null;
                    }
                }
            }});

        cc.eventManager.addListener(this.boss_appear, 1);
        cc.eventManager.addListener(this.explore_begin, 1);
        cc.eventManager.addListener(this.explore_update_explore, 1);
        cc.eventManager.addListener(this.explore_addnum, 1);
        cc.eventManager.addListener(this.explore_spbox, 1);
        cc.eventManager.addListener(this.explore_gaveup,1);
        cc.eventManager.addListener(this.explore_stage,1);
        cc.eventManager.addListener(this.explore_shop,1);
        cc.eventManager.addListener(this.explore_heavenbox,1);
        cc.eventManager.addListener(this.explore_box, 1);
        cc.eventManager.addListener(this.explore_combat, 1);
    },

    onTouchEvent:function(sender, type){
        if(ccui.Widget.TOUCH_ENDED == type){
            switch(sender.name)
            {
                case "btnBack":
                    this.removeFromParent(true);
                    break;

                case "Button_common":
                    this.viewType = 0;
                    this.switchView(this.viewType);
                    this.obj.wgt.Button_common.setBright(false);
                    this.obj.wgt.Button_common.setTouchEnabled(false);
                    this.obj.wgt.Button_elite.setBright(true);
                    this.obj.wgt.Button_elite.setTouchEnabled(true);
                    break;
                case "Button_elite":  // 精英
                    if  (GLOBALDATA.base.lev < INTERFACECFG[19].level)
                    {
                        //'指挥官等级60级开启'
                        var describe = StringFormat(INTERFACECFG[19].name + STRINGCFG[100045].string, INTERFACECFG[19].level);
                        ShowTipsTool.TipsFromText(describe, cc.color.RED, 30);
                       //ShowTipsTool.TipsFromText(StringFormat(STRINGCFG[100056].string, 65), cc.color.RED, 30);
                    }
                    else
                    {
                        this.viewType = 100;
                        this.switchView(this.viewType);
                        this.obj.wgt.Button_common.setBright(true);
                        this.obj.wgt.Button_common.setTouchEnabled(true);
                        this.obj.wgt.Button_elite.setBright(false);
                        this.obj.wgt.Button_elite.setTouchEnabled(false);
                    }
                    break;

                case "Button_See":
                    this.obj.wgt.Panel_tips.setVisible(true);
                    break;
                case "Button_Gui":
                    break;
                case "Button_pass1":
                case "Button_pass2":
                case "Button_pass3":
                case "Button_pass4":
                case "Button_pass5":
                case "Button_pass6":
                case "Button_pass7":
                case "Button_pass8":
                case "Button_pass9":
                case "Button_pass10":
                    var id = this.viewType  + parseInt(sender.name.replace(/[^0-9]/ig,""));
                    this.loadCfg(id);
                    this.showPanelGo(false);

                    break;
                case "Panel_Go":
                case "Panel_Small":
                case "Panel_Qiyu":
                case "Panel_Box":
                case "layoutGet":
                case "Panel_Find":
                    sender.setVisible(false);
                    break;
                case "imageBox":
                case "imageExpBoxGo":
                    this.showPanelSmall();
                    break;

                case "btnGo":       //探险预览
                    this.obj.wgt.Panel_Go.setVisible(false);
                    this.showPanelExplore();
                    break;
                case "btnSOk":      //奖励预览
                    this.closePanelSmall();
                    break;

                case "btnImBack":  //探险-返回
                    this.obj.wgt.Image_explore.setVisible(false);
                    break;
                case "btnExplore":  //探险-探险
                    this.startExplore();
                    break;
                case "btnQiyu":     //探险-奇遇
                    this.showPanelQiyu(true, true);
                    break;
                case "btnBox":      //探险-宝物箱
                    this.showPanelBox();
                    break;
                case "btnSee":      //探险-奖励预览
                    this.showPanelGo(true);
                    break;
                case "btnExWar":    //探险-精灵入侵
                    if (GLOBALDATA.base.lev < INTERFACECFG[26].level)
                    {
                        ShowTipsTool.TipsFromText(StringFormat(INTERFACECFG[26].name + STRINGCFG[100045].string, 60), cc.color.RED, 30);
                    }
                    else
                    {
                        this.showBossLayer();
                    }
                    break;
                case "powerButton": // 探险-购买体力
                        if (GLOBALDATA.base.diamond >= 20)
                        {
                            this.buyTiliTips();
                        }
                        else
                        {
                            //ShowTipsTool.ErrorTipsFromStringById(100079);  //显示错误的tips
                            var event = new cc.EventCustom("TipsLayer_show");
                            var data = {string:STRINGCFG[100079].string, callback:this.btnOKCallback, target:this};
                            event.setUserData(data);
                            cc.eventManager.dispatchEvent(event);
                        }
                    break;
                case "autoCheck":  // 探险-自动探索
                    if (GLOBALDATA.base.vip < 5)
                    {
                        sender.setSelected(true);
                        ShowTipsTool.TipsFromText(STRINGCFG[100131].string, cc.color.RED, 30);
                    }
                    break;

                //
                case "btnleft":     // 奇遇-左
                    this.obj.wgt.ListView_Qi.scrollToLeft(0.3);
                    break;
                case "btnright":    // 奇遇-右
                    this.obj.wgt.ListView_Qi.scrollToRight(0.3);
                    break;
                case "btnNo":       // 奇遇-放弃
                    this.giveupTisps();
                    break;
                case "btnWar":      // 奇遇-挑战
                    this.combatTips();
                    break;
                case "btnBuy":      // 奇遇-购买
                    this.buyGoodsTips();
                    break;
                case "Image_box1":  // 奇遇-天降宝箱-开启
                case "Image_box2":
                case "Image_box3":
                    this.openBoxTips();
                    break;
                case "btnQBack":    // 奇遇-关闭
                    this._index_select = 0;
                    this._Image_QNow_select = null;
                    this.obj.wgt.Panel_Qiyu.setVisible(false);
                    break;
                //
                case "btnSenOpenOne":  //宝物箱-高级宝箱单开
                    this.lottery(3);
                    break;
                case "btnSenOpenTen":  //宝物箱-高级宝箱十连开
                    this.lottery(4);
                    break;
                case "btnInterOpenOne":  //宝物箱-中级宝箱单开
                    this.lottery(1);
                    break;
                case "btnInterOpenTen":  //宝物箱-中级宝箱十连开
                    this.lottery(2);

                    break;
                case "btnOBack":        // 宝物箱-关闭
                    this.obj.wgt.Panel_Box.setVisible(false);
                    break;

                case "btnGOk":          //宝物箱-获得物品-关闭
                    this.obj.wgt.layoutGet.setVisible(false);
                    break;

                case "btnFNo":          // 遭遇boss-取消
                    this.obj.wgt.Panel_Find.setVisible(false);
                    break;

                case "btnFGo":          // 遭遇boss-前往
                    this.obj.wgt.Panel_Find.setVisible(false);
                    this.showBossLayer();
                    break;
                case "btnBackTips":
                    this.obj.wgt.Panel_tips.setVisible(false);
                    break;
            }
        }
    },

    onCheckBoxEvent:function(sender, type){
        if(ccui.CheckBox.EVENT_SELECTED == type){
            this.auto = 1;
            this.startExplore();
        }
        else if(ccui.CheckBox.EVENT_UNSELECTED == type){
            this.auto = 0;
        }
    },

    // 普通/精英 切换
    switchView:function(viewType){
        var lev = GLOBALDATA.base.lev;
        var explore = GLOBALDATA.explore;
        var list ={}
        if (viewType == 0)
        {
            list = explore.lsp
        }
        else if (viewType == 100)
        {
            list = explore.hsp;
        }

        for (var i = 1; i <= 10; i++)
        {
            var id = viewType  + i;
            var gate = EXPLORECFG[id];
            if (gate != undefined && (gate.oplv <= lev && gate.opst < this.stagelevel))
            {
                this.obj.wgt["Button_pass" + i].setBright(true);
            }
            else
            {
                this.obj.wgt["Button_pass" + i].setBright(false);
            }

            // 红点提示
            t = list && list[i - 1] || 0;
            this.obj.wgt["TipsImageP" + i].setVisible(t >= 50);
        }
    },

    loadCfg:function(id){
        this.gateCfg = EXPLORECFG[id] || {};
    },

    // 探险预览界面
    showPanelGo:function(hide){
        var gate = this.gateCfg;
        if (gate != undefined)
        {
            if (this.viewType  == 0)
            {
                this.times = GLOBALDATA.explore.lsp;
            }
            else
            {
                this.times = GLOBALDATA.explore.hsp;
            }

            var t = this.times[gate.id - this.viewType  - 1] || 0;

            this.obj.wgt.Panel_Go.setVisible(true);
            this.obj.wgt.textName.setString(gate.name);

            for (var i = 1; i <= 4; i++)
            {
                if (i <= gate.itempreview.length)
                {
                    var id = gate.itempreview[i - 1];
                    var item = ITEMCFG[id];
                    Helper.LoadIconFrameAndAddClick(this.obj.wgt["bagIcon" + i], this.obj.wgt["bagBg" + i], this.obj.wgt["bagPieces" + i], item);
                    Helper.setNamecolorByQuality(this.obj.wgt["bagName" + i], item.quality);
                    this.obj.wgt["bagName" + i].setString(item.itemname);
                    this.obj.wgt["bagBg" + i].setVisible(true);
                }
                else
                {
                    this.obj.wgt["bagBg" + i].setVisible(false);
                }

            }

            this.obj.wgt.textBar.setString( t + "/50");
            this.obj.wgt.LoadingBar.setPercent(t / 50 * 100);
            if (t == 50)
            {
                var act = ccs.load(res.effArsenBox_json).action;
                act.play("arsenBoxAction", true);
                var arsenBox = ccui.helper.seekWidgetByName(this.obj.wgt.nodeBox, "arsenBox");
                arsenBox.stopAllActions();
                arsenBox.runAction(act);
                this.obj.wgt.nodeBox.setVisible(true);
            }
            else
            {
                this.obj.wgt.nodeBox.setVisible(false);
            }

            if (gate.oplv <= GLOBALDATA.base.lev && gate.opst < this.stagelevel)
            {
                this.obj.wgt.textGNo.setString("");
                this.obj.wgt.btnGo.setVisible(!hide);
            }
            else
            {
                this.obj.wgt.textGNo.setVisible(true);
                this.obj.wgt.textGNo.setString(StringFormat(STRINGCFG[100126].string, gate.opst));
                this.obj.wgt.btnGo.setVisible(false);
            }
        }
    },
    // 宝箱说明
    showPanelSmall:function(){
        this.obj.wgt.Panel_Small.setVisible(true);
    },
    // 获取宝箱
    closePanelSmall:function(){
        this.obj.wgt.Panel_Small.setVisible(false);

        var gate = this.gateCfg;
        var t = this.times[gate.id - this.viewType  - 1] || 0;
        if (t == 50)
        {
            Network.getInstance().send({task:"explore.spbox", pos:gate.id});
        }
    },
    // 探险界面
    showPanelExplore:function(){
        var gate = this.gateCfg;
        if (this.viewType  == 0)
        {
            this.times = GLOBALDATA.explore.lsp;
        }
        else
        {
            this.times = GLOBALDATA.explore.hsp;
        }
        var t = this.times[gate.id - this.viewType  - 1] || 0;

        this.obj.wgt.Image_explore.setVisible(true);

        this.obj.wgt.diamondValue.setString(Helper.formatNum(GLOBALDATA.base.diamond));     //钻石
        this.obj.wgt.refValue.setString(Helper.formatNum(GLOBALDATA.knapsack[22070] || 0));    //配饰精炼石
        this.obj.wgt.purpleValue.setString(Helper.formatNum(GLOBALDATA.knapsack[22068] || 0)); //紫色强化石
        this.obj.wgt.orgValue.setString(Helper.formatNum(GLOBALDATA.knapsack[22069] || 0));    //橙色强化石

        this.obj.wgt.textName2.setString(gate.name);

        this.obj.wgt.textExpBarGo.setString( t + "/50");
        this.obj.wgt.expBarGo.setPercent(t/50 * 100);
        if (t == 50)
        {
            var act = ccs.load(res.effArsenBox_json).action;
            act.play("arsenBoxAction", true);
            var arsenBox = ccui.helper.seekWidgetByName(this.obj.wgt.nodeExpBoxGo, "arsenBox");
            arsenBox.stopAllActions();
            arsenBox.runAction(act);
            this.obj.wgt.nodeExpBoxGo.setVisible(true);
        }
        else
        {
            this.obj.wgt.nodeExpBoxGo.setVisible(false);
        }

        this.updateQiyuNum();
        //
        this.updateTili();

        // 获得奇遇
        if (this._qnum_old != null && this._qnum_old + 1 == this._qnum)
        {
            this._qnum_old = null;
            this.showPanelQiyuGet();
        }

        //宝物箱红点提示
        this.obj.wgt.TipsImageBox.setVisible(Helper.getItemNum(22109) + Helper.getItemNum(22108) > 0);

        //boss 入侵
        this.obj.wgt.TipsImageBoss.setVisible(bossFightRedPoint.mainBossRedPoint() == 1);
    },

    updateQiyuNum:function(){
         // 奇遇数量
        var qnum = 0;
        for (var key in GLOBALDATA.explore.list)
        {
            qnum++;
        }
        this.obj.wgt.imageQNum.setVisible(qnum > 0);
        this.obj.wgt.textQNum.setString(qnum);
        this._qnum = qnum;
    },

    updateTili:function(){
        var tili = GLOBALDATA.explore.n;
        if (tili > 0)
        {
            this.obj.wgt.textPower.setString(StringFormat(STRINGCFG[100132].string, tili));
            this.obj.wgt.textCosPower.setString(STRINGCFG[100133].string);
        }
        else
        {
            this.obj.wgt.textPower.setString(StringFormat(STRINGCFG[100134].string, Helper.formatNum(GLOBALDATA.knapsack[9] || 0)));
            this.obj.wgt.textCosPower.setString(STRINGCFG[100135].string);
        }
    },
    // 开始探险
    startExplore:function(){
        var gate = this.gateCfg;
        var t = this.times[gate.id - this.viewType  - 1] || 0;
        var tili = GLOBALDATA.explore.n;
        if (t >= 50)
        {
            this.unschedule(this.scrollBg);
            this.commanderModel.actIdle();
            ShowTipsTool.TipsFromText(STRINGCFG[100136].string, cc.color.RED, 30);
        }
        else if (this._qnum >= 12)
        {
            this.unschedule(this.scrollBg);
            this.commanderModel.actIdle();
            ShowTipsTool.TipsFromText(STRINGCFG[100137].string, cc.color.RED, 30);
        }
        else if ( tili <= 0  && (GLOBALDATA.knapsack[9] || 0) <= 0)  //体力 或 GPS 不足 => 购买体力
        {
            this.unschedule(this.scrollBg);
            this.commanderModel.actIdle();
            this.buyTiliTips();
        }
        else
        {
            this.schedule(this.scrollBg, 0.03, cc.REPEAT_FOREVER);
            this.commanderModel.actRun(1, true);
            this.scheduleOnce(this.tigger, 1, cc.REPEAT_FOREVER);
        }
    },
    // 停止探险
    stopExplore:function(){
        if (this.auto == 0)
        {
            this.unschedule(this.scrollBg);
            this.commanderModel.actIdle();
        }
        else  //自动探险
        {
            this.startExplore();
        }
    },

    resourceGet:function(data){
        if(data != undefined && data.data != undefined)
        {
            data.task = 'resource.get';

            var event = new cc.EventCustom(data.task);
            event.setUserData(data);
            cc.eventManager.dispatchEvent(event);
        }
    },
    // 模拟消息返回
    tigger:function(data){
        var gate = this.gateCfg;
        Network.getInstance().send({task:"explore.begin", pos:gate.id, num:1});
    },

    // 移动场景
    scrollBg:function () {
        var bg1 = this.obj.wgt.Image_bg1;
        var bg2 = this.obj.wgt.Image_bg2;

        bg1.setPositionX(bg1.getPositionX() - 5);
        bg2.setPositionX(bg2.getPositionX() - 5);

        if ( bg1.getPositionX() + bg1.getContentSize().width / 2 <= 0 )
        {
            bg1.setPositionX(bg2.getPositionX() + bg2.getContentSize().width - 1);
        }
        if ( bg2.getPositionX() + bg2.getContentSize().width / 2 <= 0 )
        {
            bg2.setPositionX(bg1.getPositionX() + bg1.getContentSize().width - 1);
        }
    },
    //
    showPanelQiyuGet:function(){
        this.obj.wgt.Panel_QiyuGet.setVisible(true);
        this.obj.wgt.Panel_QiyuGet.setOpacity(255);
        this.obj.wgt.Panel_QiyuGet.setCascadeOpacityEnabled(true);

        var seq = cc.sequence(cc.delayTime(1.5),
            cc.spawn(cc.moveBy(1, cc.p(0, 150)),
            cc.fadeOut(1)),
            cc.hide(),
            cc.moveBy(1, cc.p(0, -150))
            );
        //this.obj.wgt.Panel_QiyuGet.stopAllActions();
        this.obj.wgt.Panel_QiyuGet.runAction(seq);

        var key = GLOBALDATA.explore.list.length;
        var it = GLOBALDATA.explore.list[key - 1];
        var cfg = EXPLOREADVENCFG[it.id];
        this.obj.wgt.Image_QiyuG.loadTexture("common/explore/" + cfg.icon, ccui.Widget.PLIST_TEXTURE);
    },
    // 购买体力提示
    buyTiliTips:function(){
        var event = new cc.EventCustom("TipsLayer_show");
        var data = {string:STRINGCFG[100138].string, callback:this.buyTiliCallback, target:this};
        event.setUserData(data);
        cc.eventManager.dispatchEvent(event);
    },
    // 确认购买体力
    buyTiliCallback:function(ttype){
        if (ttype == 1) // 确定
        {
            Network.getInstance().send({task:"explore.addnum", pos:1});
        }
    },

    countdown:function(){
        var svrTime = GLOBALDATA.svrTime + (Date.parse(new Date()) - GLOBALDATA.loginTime) / 1000;
        var nt = GLOBALDATA.explore.nt;
        var lt = (nt - svrTime) % (10 * 60);
        this.obj.wgt.textPowerAdd.setString(StringFormat(STRINGCFG[100139].string, (lt <= 0 ? STRINGCFG[100140].string : Helper.formatTime(lt))));


        // 财宝商人 30分钟, 奇遇宝箱 60分钟,奇遇战斗 2个小时
        var duration = [0, 2*60*60, 30*60, 60*60];
        var index = this._index_select;

        for (var key in GLOBALDATA.explore.list)
        {
            var it = GLOBALDATA.explore.list[key];
            if (it != null)
            {
                var cfg = EXPLOREADVENCFG[it.id];

                if (it.bt + duration[cfg.type] < svrTime)
                {
                    // 删除 过期 奇遇
                    GLOBALDATA.explore.list.splice(key, 1);

                    if (this.obj.wgt.Image_explore.isVisible())
                    {
                        this.updateQiyuNum();
                    }

                    if(this.obj.wgt.Panel_Qiyu.isVisible())
                    {
                        if (key == index)
                        {
                            this.showPanelQiyu(true, false);
                        }
                    }
                    break;
                }
                else
                {
                    if (key == index)
                    {
                        this.obj.wgt.textTime.setString(StringFormat(STRINGCFG[100141].string, Helper.formatTime(it.bt + duration[cfg.type] - svrTime)));
                    }
                }
            }
        }
    },

    // 奇遇界面
    showPanelQiyu:function(bChange, bTip){
        this._Image_QNow_select = null;
        if (this._qnum > 0)
        {
            this.obj.wgt.Panel_Qiyu.setVisible(true);

            this.obj.wgt.ListView_Qi.removeAllChildren();
            for(var key in GLOBALDATA.explore.list)
            {
                var it = GLOBALDATA.explore.list[key];
                var cfg = EXPLOREADVENCFG[it.id];

                var btnQItem = this.obj.wgt.btnQItem.clone();
                btnQItem.setTouchEnabled(true);
                btnQItem.loadTexture("common/explore/" + cfg.icon, ccui.Widget.PLIST_TEXTURE);
                this.obj.wgt.ListView_Qi.pushBackCustomItem(btnQItem);
            }
            this.switchPanelQiyu(bChange, 0);
        }
        else
        {
            this._index_select = 0;
            this.obj.wgt.Panel_Qiyu.setVisible(false);
            if(bTip)
            {
                ShowTipsTool.TipsFromText(STRINGCFG[100142].string, cc.color.RED, 30);
            }
        }
    },
    //奇遇界面子项
    switchPanelQiyu:function(bChange,index){
        if (bChange == false && this._qnum_old == this._qnum && this._index_select < this._qnum)
        {
            index = this._index_select;
        }
        var it = GLOBALDATA.explore.list[index];
        var cfg = EXPLOREADVENCFG[it.id];

        if (this._Image_QNow_select != null)
        {
            this._Image_QNow_select.setVisible(false);
        }
        var btnQItem = this.obj.wgt.ListView_Qi.getItem(index);
        this._Image_QNow_select = ccui.helper.seekWidgetByName(btnQItem, "Image_QNow");
        this._Image_QNow_select.setVisible(true);
        this._index_select = index;

        this.obj.wgt.textQName.setString(cfg.name);

        this.countdown();

        if(cfg.type == 1)       //遭遇敌人
        {
            this.obj.wgt.textQGet.setString(STRINGCFG[100143].string);
            this.obj.wgt.textQDate.setString(cfg.des);

            this.obj.wgt.textQDate.setVisible(true);
            this.obj.wgt.btnWar.setVisible(true);
            this.obj.wgt.Node_box.setVisible(false);
            this.obj.wgt.Node_Buy.setVisible(false);
            this.obj.wgt.Node_Bag.setVisible(true);

            this.obj.wgt.ListView_QReward.removeAllChildren();
            for(var i = 0; i < cfg.item.length; i++)
            {
                var goods = ITEMCFG[cfg.item[i][0]];
                var bagQBg = this.obj.wgt.bagQBg2.clone();
                this.obj.wgt.ListView_QReward.pushBackCustomItem(bagQBg);

                var bagQIcon = ccui.helper.seekWidgetByName(bagQBg, "bagQIcon2");
                var bagQPieces = ccui.helper.seekWidgetByName(bagQBg, "bagQPieces2");
                var bagQName = ccui.helper.seekWidgetByName(bagQBg, "bagQName2");
                var bagQNum = ccui.helper.seekWidgetByName(bagQBg, "bagQNum2");

                Helper.LoadIconFrameAndAddClick(bagQIcon, bagQBg, bagQPieces, goods);
                Helper.setNamecolorByQuality(bagQName, goods.quality);
                bagQName.setString(goods.itemname);
                bagQNum.setString(cfg.item[i][1]);
            }
        }
        else if(cfg.type == 2) //财宝商人
        {
            var goods = ITEMCFG[cfg.item[0][0]];

            this.obj.wgt.textQGet.setString("");
            this.obj.wgt.textQDate.setString(cfg.des);

            this.obj.wgt.textQDate.setVisible(true);
            this.obj.wgt.btnWar.setVisible(false);
            this.obj.wgt.Node_box.setVisible(false);
            this.obj.wgt.Node_Buy.setVisible(true);
            this.obj.wgt.Node_Bag.setVisible(false);

            var bagQBg = this.obj.wgt.bagQBg1;
            var bagQIcon = ccui.helper.seekWidgetByName(bagQBg, "bagQIcon1");
            var bagQPieces = ccui.helper.seekWidgetByName(bagQBg, "bagQPieces1");
            var bagQName = ccui.helper.seekWidgetByName(bagQBg, "bagQName1");
            var bagQNum = ccui.helper.seekWidgetByName(bagQBg, "bagQNum1");

            Helper.LoadIconFrameAndAddClick(bagQIcon, bagQBg, bagQPieces, goods);
            Helper.setNamecolorByQuality(bagQName, goods.quality);
            bagQName.setString(goods.itemname);
            bagQNum.setString(cfg.item[0][1]);

            this.obj.wgt.diamongNValue1.setString(cfg.consume[1]);
            this.obj.wgt.diamongNValue2.setString(cfg.consume[2]);
        }
        else if(cfg.type == 3) //天降宝箱
        {
            this.obj.wgt.textQGet.setString(STRINGCFG[100144].string);

            this.obj.wgt.textQDate.setVisible(false);
            this.obj.wgt.btnWar.setVisible(false);
            this.obj.wgt.Node_box.setVisible(true);
            this.obj.wgt.Node_Buy.setVisible(false);
            this.obj.wgt.Node_Bag.setVisible(true);

            for (var i = 1; i <= 3; i++)
            {
                this.obj.wgt["Image_box" + i].setVisible(i <= 3 - it.n);
            }

            this.obj.wgt.ListView_QReward.removeAllChildren();
            for(var i = 0; i < cfg.item.length; i++)
            {
                var goods = ITEMCFG[cfg.item[i][0]];

                var bagQBg = this.obj.wgt.bagQBg2.clone();
                this.obj.wgt.ListView_QReward.pushBackCustomItem(bagQBg);

                var bagQIcon = ccui.helper.seekWidgetByName(bagQBg, "bagQIcon2");
                var bagQPieces = ccui.helper.seekWidgetByName(bagQBg, "bagQPieces2");
                var bagQName = ccui.helper.seekWidgetByName(bagQBg, "bagQName2");
                var bagQNum = ccui.helper.seekWidgetByName(bagQBg, "bagQNum2");

                Helper.LoadIconFrameAndAddClick(bagQIcon, bagQBg, bagQPieces, goods);
                Helper.setNamecolorByQuality(bagQName, goods.quality);
                bagQName.setString(goods.itemname);
                bagQNum.setString(cfg.item[i][1]);
            }
        }
    },

    // 奇遇-放弃提示
    giveupTisps:function(){
        var event = new cc.EventCustom("TipsLayer_show");
        var data = {string:STRINGCFG[100145].string, callback:this.giveupCallback, target:this};
        event.setUserData(data);
        cc.eventManager.dispatchEvent(event);
    },
    // 奇遇-确认放弃
    giveupCallback:function(ttype){
        if (ttype == 1) // 确定
        {
            var index = this._index_select;
            Network.getInstance().send({task:"explore.gaveup", pos:index + 1});
        }
    },

    // 奇遇-购买商品
    buyGoodsTips:function(){
        var index = this._index_select;
        var it = GLOBALDATA.explore.list[index];
        var cfg = EXPLOREADVENCFG[it.id];

        var event = new cc.EventCustom("TipsLayer_show");
        var data = {string:StringFormat(STRINGCFG[100146].string, cfg.consume[2]), callback:this.buyGoodsCallback, target:this};
        event.setUserData(data);
        cc.eventManager.dispatchEvent(event);
    },
    // 奇遇-确认购买商品
    buyGoodsCallback:function(ttype){
        if (ttype == 1) // 确定
        {
            var index = this._index_select;
            Network.getInstance().send({task:"explore.shop", pos:index + 1});
        }
    },

    // 奇遇-战斗
    combatTips:function(){
        var index = this._index_select;
        var it = GLOBALDATA.explore.list[index];
        var sid = it.sid;
        this.combat = new combatLayer(1, sid,'explore.combat');
        this.addChild(this.combat, 2);
    },
    // 奇遇-战斗
    combatCallback:function(ttype){
        if (ttype == 1) // 确定
        {
            var index = this._index_select;
            Network.getInstance().send({task:"explore.stage", pos:index + 1, pass:1});
        }
    },

    removeCombat:function(){
        var self = this;
        var seq = cc.sequence(cc.delayTime(2),
            cc.callFunc(function(){
                if (self.combat)
                {
                    self.combat.removeFromParent(true);
                    self.combat = null;
                }
            }, this));

        this.runAction(seq);
    },
    //
    openBoxTips:function(){
        var index = this._index_select;
        var it = GLOBALDATA.explore.list[index];
        if (it.n == 0)
        {
            this.openBoxCallback(1);
        }
        else if (it.n == 1)
        {
            var event = new cc.EventCustom("TipsLayer_show");
            var data = {string:StringFormat(STRINGCFG[100146].string, 20), callback:this.openBoxCallback, target:this};
            event.setUserData(data);
            cc.eventManager.dispatchEvent(event);
        }
        else if (it.n == 2)
        {
            var event = new cc.EventCustom("TipsLayer_show");
            var data = {string:StringFormat(STRINGCFG[100146].string, 50), callback:this.openBoxCallback, target:this};
            event.setUserData(data);
            cc.eventManager.dispatchEvent(event);
        }

    },
    openBoxCallback:function(ttype){
        if (ttype == 1) // 确定
        {
            var index = this._index_select;
            Network.getInstance().send({task:"explore.heavenbox", pos:index + 1});
        }
    },

    // 宝物箱界面
    showPanelBox:function(){
        this.obj.wgt.Panel_Box.setVisible(true);

        var step = GLOBALDATA.explore.hbn;
        var times = GLOBALDATA.explore.hbn <= 0 ? 10 : (10 - (GLOBALDATA.explore.hbn % 10));

        this.obj.wgt.textSenNum.setString(StringFormat(STRINGCFG[100147].string, times));

        this.obj.wgt.senKeyValue.setString(GLOBALDATA.knapsack[22109] || 0);
        this.obj.wgt.DiamondImageBg1.setVisible((GLOBALDATA.knapsack[22109] || 0) == 0);


        this.obj.wgt.diamongValue1.setString(Math.min(150, 75 + step * 15));
        this.obj.wgt.diamongValue2.setString(Math.min(1500, 750 + step *125));

        this.obj.wgt.interKeyValue.setString(GLOBALDATA.knapsack[22108] || 0);
        this.obj.wgt.DiamondImageBg3.setVisible((GLOBALDATA.knapsack[22108] || 0) == 0);

        var step = GLOBALDATA.explore.lbn;
        this.obj.wgt.diamongValue3.setString(Math.floor(Math.min(80, 20 + (step / 3) * 5)));
        this.obj.wgt.diamongValue4.setString(Math.min(800, 200 + (step) * 15));
    },

    lottery:function(type){
        Network.getInstance().send({task:"explore.box", typ:type});
    },
    // 开宝物箱结果界面
    showLayoutGet:function(data){
        this.obj.wgt.layoutGet.setVisible(true);

        var goodsList = [];

        if (cc.isArray(data))
        {
            for (var idx in data)
            {
                if (cc.isArray(data[idx]))
                {
                    for (var key in data[idx])
                    {
                        var id = Number(key) + 1;
                        goodsList.push({id:id, num:data[idx][key]});
                    }
                }
                else if (cc.isObject(data[idx]))
                {
                    for (var key in data[idx])
                    {
                        var id = Number(key);
                        goodsList.push({id:id, num:data[idx][key]});
                    }
                }
                else if (cc.isNumber(data[idx]))
                {
                    var id = Number(idx) + 1;
                    goodsList.push({id:id, num:data[idx]});
                }
            }
        }
        else
        {
            for (var key in data)
            {
                var id = Number(key);
                goodsList.push({id:id, num:data[key]});
            }
        }

        var count = goodsList.length;
        if (count == 1)  //当抽结果
        {
            this.obj.wgt.nodeOne.setVisible(true);
            this.obj.wgt.nodeTen.setVisible(false);

            var id = goodsList[0].id;
            var num = goodsList[0].num;

            var item = ITEMCFG[id];
            Helper.LoadIconFrameAndAddClick(this.obj.wgt.getQIcon, this.obj.wgt.getQBg, this.obj.wgt.getQPieces, item);
            Helper.setNamecolorByQuality(this.obj.wgt.getQName, item.quality);
            this.obj.wgt.getQName.setString(item.itemname);
            this.obj.wgt.getQNum.setString(num);
        }
        else if (count == 10)
        {
            this.obj.wgt.nodeOne.setVisible(false);
            this.obj.wgt.nodeTen.setVisible(true);

            for (var i = 1; i <= 10 ; i++ )
            {
                var id  = goodsList[i-1].id;
                var num = goodsList[i-1].num;

                var item = ITEMCFG[id];

                Helper.LoadIconFrameAndAddClick(this.obj.wgt["getQIcon" + i], this.obj.wgt["getQBg" + i], this.obj.wgt["getQPieces" + i], item);
                Helper.setNamecolorByQuality(this.obj.wgt["wgtgetQName" + i], item.quality);
                this.obj.wgt["getQName" + i].setString(item.itemname);
                this.obj.wgt["getQNum" + i].setString(num);
            }
        }
    },

    // Boss 入侵
    showPanelFind:function(data){
        this.obj.wgt.Panel_Find.setVisible(true);
    },

    showBossLayer:function(){
        this.auto = 0;
        this.obj.wgt.autoCheck.setSelected(false);
        var bosslayer = new bossFightLayer();
        this.getParent().addChild(bosslayer,11);
    },
    onExit:function () {
        this._super();
        cc.eventManager.removeListener(this.boss_appear);
        cc.eventManager.removeListener(this.explore_begin);
        cc.eventManager.removeListener(this.explore_update_explore);
        cc.eventManager.removeListener(this.explore_addnum);
        cc.eventManager.removeListener(this.explore_spbox);
        cc.eventManager.removeListener(this.explore_gaveup);
        cc.eventManager.removeListener(this.explore_stage);
        cc.eventManager.removeListener(this.explore_shop);
        cc.eventManager.removeListener(this.explore_heavenbox);
        cc.eventManager.removeListener(this.explore_box);
        cc.eventManager.removeListener(this.explore_combat);
    },

    Commander : cc.Layer.extend({
        ctor:function (commanderId) {
            this._super();
            this.commanderId = commanderId;
            this.roleAttr = Helper.findCommanderById(commanderId);
            //渲染图像
            this.model = this.roleAttr.commandermodel;
            this.role = new cc.Sprite();
            this.addChild(this.role);
        },

        actIdle:function () {
            this.role.stopAllActions();

            var self = this;
            cc.loader.load([res[this.model+'_plist'],res[this.model+'_png']],function (result, count, loadedCount) {

            }, function () {
                cc.spriteFrameCache.addSpriteFrames(res[self.model+'_plist']);
                var tmp = new cc.Sprite(cc.spriteFrameCache.getSpriteFrame(self.model+"-idle01_0.png"));
                self.roleSize = tmp.getContentSize();
                self.setContentSize(self.roleSize);

                var animFrames = [];
                var str = "";
                for (var i = 0; i < 30; i++) {
                    str = self.model+'-idle01_'+i+'.png';
                    var frame = cc.spriteFrameCache.getSpriteFrame(str);
                    if (frame){
                        animFrames.push(frame);
                    }else {
                        break;
                    }
                }
                var animation = new cc.Animation(animFrames, 0.1);
                // 14 frames * 1sec = 14 seconds
                self.role.runAction(cc.animate(animation).repeatForever());
            });
        },

        actRun:function (director,repeat) {//正数 x轴正方向，
            this.role.setFlippedX(director < 0);
            this.role.stopAllActions();

            var self = this;
            cc.loader.load([res[this.model+'_plist'],res[this.model+'_png']],function (result, count, loadedCount) {

            }, function () {
                cc.spriteFrameCache.addSpriteFrames(res[self.model+'_plist']);
                var tmp = new cc.Sprite(cc.spriteFrameCache.getSpriteFrame(self.model+"-idle01_0.png"));
                self.roleSize = tmp.getContentSize();
                self.setContentSize(self.roleSize);

                var animFrames = [];
                var str = "";
                for (var i = 0; i < 30; i++) {
                    str = self.model+'-run_'+i+'.png';
                    var frame = cc.spriteFrameCache.getSpriteFrame(str);
                    if (frame){
                        animFrames.push(frame);
                    }else {
                        break;
                    }
                }
                var animation = new cc.Animation(animFrames, 0.1);
                // 14 frames * 1sec = 14 seconds
                if(typeof repeat !='undefined' && repeat==false){
                    self.role.runAction(cc.animate(animation));
                }else {
                    self.role.runAction(cc.animate(animation).repeatForever());
                }
            });
        },
    }),
});