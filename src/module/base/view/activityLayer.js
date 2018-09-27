
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
var ActivityLayer = baseLayer.extend({
    ctor:function (detailtype,id) {  //detailtype为1表示直接显示精英关卡
        this._super();
        this.LayerName = "ActivityLayer";
        this.detailtype = detailtype;
        this.passid = id;
        this.viewType  = 0; // 0 普通视图 100 精英视图
        this.stageId = 0;
        this.stagePos = 0;
        this.bosskey = 0;
        this._issweep = false;
        this.uiAttributeLayer.setVisible(false);
    },

    initUI:function(){
        this.obj = ccsTool.load(res.uiActivityLayer, [ "btnBack", "Button_common", "TipsImageC", "Button_elite", "TipsImageE", "Button_Gui", "textCommonNum",  "ListView_One",
            "Node_elite", "Image_Boss", "TipsImageBoss",
            "energyButton", "energyValue", "energyTime"
        , "Image_common", "btnIComBack","nodeFreeBox", "imageFreeBox", "ListView_common", "textCommonName","textComNum", "imageBox", "textGNo",
            "Panel_See", "btnGo", "textNoSee", "textGetSee", "textAlreadyGetSee",
            "bagBgSee1", "bagIconSee1", "bagPiecesSee1", "bagNumSee1", "bagNameSee1",
            "bagBgSee2", "bagIconSee2", "bagPiecesSee2", "bagNumSee2", "bagNameSee2",
            "bagBgSee3", "bagIconSee3", "bagPiecesSee3", "bagNumSee3", "bagNameSee3",
            "bagBgSee4", "bagIconSee4", "bagPiecesSee4", "bagNumSee4", "bagNameSee4",
            "Panel_ComBoss", "textComBoss", "btnCBWar",
            "bagBgCBWar1", "bagIconCBWar1", "bagPiecesCBWar1", "bagNumCBWar1","bagNameCBWar1",
            "bagBgCBWar2", "bagIconCBWar2", "bagPiecesCBWar2", "bagNumCBWar2","bagNameCBWar2",
            "bagBgCBWar3", "bagIconCBWar3", "bagPiecesCBWar3", "bagNumCBWar3","bagNameCBWar3",
            "bagBgCBWar4", "bagIconCBWar4", "bagPiecesCBWar4", "bagNumCBWar4","bagNameCBWar4",

        , "Image_elite", "btnEliteBack", "textComName", "ListView_elite",
            "energyButton1", "energyValue1", "energyHui1",
            "boxBarBg", "boxBar", "nodeBox3", "nodeBox2", "nodeBox1", "textBarAll",
            "imageBox1", "imageBox2", "imageBox3",
            "Panel_StarSee", "btnStarGet", "textGetStarSee", "textAlreadyGetStarSee",
            "bagBgStarSee1", "bagIconStarSee1", "bagPiecesStarSee1", "bagNumStarSee1", "bagNameStarSee1",
            "bagBgStarSee2", "bagIconStarSee2", "bagPiecesStarSee2", "bagNumStarSee2", "bagNameStarSee2",
            "bagBgStarSee3", "bagIconStarSee3", "bagPiecesStarSee3", "bagNumStarSee3", "bagNameStarSee3",
            "bagBgStarSee4", "bagIconStarSee4", "bagPiecesStarSee4", "bagNumStarSee4", "bagNameStarSee4"
        , "Image_bossWar", "btnBossBack", "ListView_boss",
            "energyButton2","energyValue2", "energyHui2",
            ]);

        this.addChild(this.obj.node, 1);

        this.obj.wgt.btnBack.addTouchEventListener(this.onTouchEvent, this);
        this.obj.wgt.Button_common.addTouchEventListener(this.onTouchEvent, this);
        this.obj.wgt.Button_elite.addTouchEventListener(this.onTouchEvent, this);
        this.obj.wgt.Button_Gui.addTouchEventListener(this.onTouchEvent, this);

        this.obj.wgt.btnIComBack.addTouchEventListener(this.onTouchEvent, this);
        this.obj.wgt.btnEliteBack.addTouchEventListener(this.onTouchEvent, this);

        this.obj.wgt.energyButton.addTouchEventListener(this.onTouchEvent, this);
        this.obj.wgt.energyButton1.addTouchEventListener(this.onTouchEvent, this);
        this.obj.wgt.energyButton2.addTouchEventListener(this.onTouchEvent, this);

        this.obj.wgt.Image_Boss.addTouchEventListener(this.onTouchEvent, this);

        this.obj.wgt.imageFreeBox.addTouchEventListener(this.onTouchEvent, this);
        this.obj.wgt.Panel_See.addTouchEventListener(this.onTouchEvent, this);
        this.obj.wgt.btnGo.addTouchEventListener(this.onTouchEvent, this);


        this.obj.wgt.Panel_ComBoss.addTouchEventListener(this.onTouchEvent, this);
        this.obj.wgt.btnCBWar.addTouchEventListener(this.onTouchEvent, this);


        this.obj.wgt.btnBossBack.addTouchEventListener(this.onTouchEvent, this);

        this.obj.wgt.imageBox1.addTouchEventListener(this.onTouchEvent, this);
        this.obj.wgt.imageBox2.addTouchEventListener(this.onTouchEvent, this);
        this.obj.wgt.imageBox3.addTouchEventListener(this.onTouchEvent, this);

        this.obj.wgt.Panel_StarSee.addTouchEventListener(this.onTouchEvent, this);
        this.obj.wgt.btnStarGet.addTouchEventListener(this.onTouchEvent, this);

        this.doAddListener();
        if(this.detailtype == 1){  //直接显示精英的详细界面
            this.viewType  = 100;
            this.directShowElite();
        }else{
            this.schedule(this.countdown, 1, cc.REPEAT_FOREVER);
            this.viewType = 0;
            this.switchView(this.viewType);
        }
    },

    doAddListener:function(){
        var self = this;
        // 战斗
        this.replica_stage = cc.EventListener.create({
            event: cc.EventListener.CUSTOM,
            eventName: "replica.stage",
            callback: function(event){
                self.switchView(self.viewType);
                if (self.viewType == 0)
                {
                    self.showImageCommon(self.stageId);
                    self.resourceGet(event.getUserData());
                }
                else if (self.viewType == 100)
                {
                    self.showImageElite(self.stageId);

                    if (self._issweep)
                    {
                        self.sweepResult(event.getUserData());
                    }
                    else
                    {
                        self.resourceGet(event.getUserData());
                    }
                }

                self.removeCombat();
            }});

        // 领取宝箱
        this.replica_getbox = cc.EventListener.create({
            event: cc.EventListener.CUSTOM,
            eventName: "replica.getbox",
            callback: function(event){
                self.switchView(self.viewType);
                if (self.viewType == 0)
                {
                    self.showImageCommon(self.stageId);
                }
                else if (self.viewType == 100)
                {
                    self.showImageElite(self.stageId);
                }
                self.resourceGet(event.getUserData());
            }});

        // Boss战斗
        this.replica_boss = cc.EventListener.create({
            event: cc.EventListener.CUSTOM,
            eventName: "replica.boss",
            callback: function(event){
                if (self.viewType == 0)
                {
                    self.switchView(self.viewType);
                }
                else if (self.viewType == 100)
                {
                    self.showImageBossWar();
                }
                self.resourceGet(event.getUserData());
                self.removeCombat();
            }});

        // 重置
        this.replica_reset = cc.EventListener.create({
            event: cc.EventListener.CUSTOM,
            eventName: "replica.reset",
            callback: function(event){
                self.showImageElite(self.stageId);
            }});

        this.replica_combat = cc.EventListener.create({
            event: cc.EventListener.CUSTOM,
            eventName: "replica.combat",
            callback: function(event){
                var ret = event.getUserData();
                if (ret.result == 'victory')
                {
                    self.combatCallback(1, ret.star);
                }
                else if (ret.result == 'defeat')
                {
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

        this.replica_combat_boss = cc.EventListener.create({
            event: cc.EventListener.CUSTOM,
            eventName: "replica.combat.boss",
            callback: function(event){
                var ret = event.getUserData();
                if (ret.result == 'victory')
                {
                    self.combatBossCallback(1);
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

        cc.eventManager.addListener(this.replica_stage, 1);
        cc.eventManager.addListener(this.replica_getbox, 1);
        cc.eventManager.addListener(this.replica_boss, 1);
        cc.eventManager.addListener(this.replica_reset, 1);
        cc.eventManager.addListener(this.replica_combat, 1);
        cc.eventManager.addListener(this.replica_combat_boss, 1);
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
                    break;
                case "Button_elite":  // 精英
                    if (GLOBALDATA.base.lev >= INTERFACECFG[41].level)
                    {
                        this.viewType = 100;
                        this.switchView(this.viewType);
                    }
                    else
                    {
                        // 指挥官等级65级开启
                        ShowTipsTool.TipsFromText(StringFormat(STRINGCFG[100045].string, INTERFACECFG[41].level), cc.color.RED, 30);
                    }

                    break;
                case "Button_Gui":
                    break;
                case "btnIComBack":
                    this.obj.wgt.Image_common.setVisible(false);
                    break;
                case "energyButton": //打开补给之精力球
                case "energyButton1":
                case "energyButton2":
                    this.addEnergy();
                    break;
                case "imageFreeBox":  // 宝箱按钮
                    var id = sender.getTag();
                    this.showPanleSee(id);
                    break;
                case "btnGo":       //探险预览
                    var id = sender.getTag();
                    this.closePanleSee(id);
                    break;

                case "btnCBWar":
                    this.closePanelComBoss();
                    break;
                case "Panel_See":
                case "Panel_StarSee":
                case "Panel_ComBoss":
                    sender.setVisible(false);
                    break;
                case "btnEliteBack":
                    this.obj.wgt.Image_elite.setVisible(false);
                    if(this.detailtype == 1){  //如果是直接显示的精英详细界面 点击战斗之后界面直接关掉
                        this.removeFromParent(true);
                    }
                    break;

                case "Image_Boss":
                    if(GLOBALDATA.base.lev >= INTERFACECFG[26].level){
                        this.showImageBossWar();
                    }else{
                        var describe = StringFormat(STRINGCFG[100045].string, INTERFACECFG[26].level);
                        ShowTipsTool.TipsFromText(describe, cc.color.RED, 30);
                    }

                    break;
                case "btnBossBack":
                     this.obj.wgt.Image_bossWar.setVisible(false);
                    break;
                case "imageBox1":
                    var id = sender.getTag();
                    this.showPanelStarSee(id, 1);
                    break;
                case "imageBox2":
                    var id = sender.getTag();
                    this.showPanelStarSee(id, 2);
                    break;
                case "imageBox3":
                    var id = sender.getTag();
                    this.showPanelStarSee(id, 3);
                    break;
                case "btnStarGet":
                    var id = sender.getTag();
                    this.closePanelStarSee(id);
                    break;
            }
        }
    },

    // 普通/精英副本 切换
    switchView:function(viewType){
        this.obj.wgt.Image_common.setVisible(false);
        this.obj.wgt.Image_elite.setVisible(false);
        this.obj.wgt.Image_bossWar.setVisible(false);

        this.dealRedPoint();

        var list = null;
        if (viewType == 0)
        {
            this.obj.wgt.Button_common.setBright(false);
            this.obj.wgt.Button_common.setTouchEnabled(false);
            this.obj.wgt.Button_elite.setBright(true);
            this.obj.wgt.Button_elite.setTouchEnabled(true);
            this.obj.wgt.textCommonNum.setVisible(true);
            this.obj.wgt.Node_elite.setVisible(false);
            this.obj.wgt.textCommonNum.setString(StringFormat(STRINGCFG[100190].string,  GLOBALDATA.replica.n || 0));

            var list = GLOBALDATA.replica.llist;
        }
        else if (viewType == 100)
        {
            this.obj.wgt.Button_common.setBright(true);
            this.obj.wgt.Button_common.setTouchEnabled(true);
            this.obj.wgt.Button_elite.setBright(false);
            this.obj.wgt.Button_elite.setTouchEnabled(false);
            this.obj.wgt.textCommonNum.setVisible(false);
            this.obj.wgt.Node_elite.setVisible(true);

            this.countdown();

            list = GLOBALDATA.replica.hlist;
        }

        cc.spriteFrameCache.addSpriteFrames(res.heroicon_plist);
        this.obj.wgt.ListView_One.removeAllChildren();
        for (var key in list)
        {
            var dat = list[key];
            var id = dat.id;
            var cfg  = COUNTERSTAGECFG[id];

            var itemObj = ccsTool.load(res.uiActivityOneItem, ["bagItem", "bagOItemFree", "oItemFightButton", "TipsImageF", "bossButton",
                "bagOItemName", "bagOItemBg", "bagOItemIcon", "bagOItemStar",
                "Image_plan1", "Image_plan2", "Image_plan3", "Image_plan4", ]);
            itemObj.wgt.bagOItemName.setString(cfg.name);
            itemObj.wgt.bagOItemIcon.loadTexture(cfg.icon, ccui.Widget.PLIST_TEXTURE);

            for (var i = 1; i <= 4; i++)
            {
                if (dat.fs[i - 1] == 0)  //未通关
                {
                    itemObj.wgt["Image_plan" + i].setColor(cc.color(76,76,76));
                }
            }
            itemObj.wgt.bagOItemFree.setVisible(dat.fs && (((dat.fs[0] + dat.fs[1] + dat.fs[2] + dat.fs[3]) || 0) == 4));   //已通关
            itemObj.wgt.bagOItemStar.setString((dat.ss && (dat.ss[0] + dat.ss[1] + dat.ss[2] + dat.ss[3]) || 0) + "/12");  //星级数
            itemObj.wgt.bagOItemStar.setVisible(viewType == 100);  //星级数

            itemObj.wgt.oItemFightButton.setTag(id);
            itemObj.wgt.oItemFightButton.addTouchEventListener(this.onTouchEventOne, this);

            // 红点提示
            var stars = ((dat.ss && (dat.ss[0] + dat.ss[1] + dat.ss[2] + dat.ss[3])) || (dat.fs && (dat.fs[0] + dat.fs[1] + dat.fs[2] + dat.fs[3])) || 0);
            var step = Math.floor(stars / 4);
            var bRedTips = ((dat.gl != undefined ? dat.gl : ( dat.g != undefined ? dat.g : 3)) < step);
            itemObj.wgt.TipsImageF.setVisible(bRedTips);


            var bagItem = itemObj.wgt.bagItem;
            bagItem.removeFromParent(false);
            this.obj.wgt.ListView_One.insertCustomItem(bagItem, 0);

            // 普通副本 boss 按钮
            itemObj.wgt.bossButton.setVisible(false);
            if (viewType == 0)  // 普通副本
            {
                if (GLOBALDATA.replica.bpost == parseInt(key) + 1)
                {
                    for (var bkey in GLOBALDATA.replica.bl)
                    {
                        if (GLOBALDATA.replica.bls[bkey] == 1)  //已刷新
                        {
                            var bid  = GLOBALDATA.replica.bl[bkey];
                            var bcfg = COUNTERBOSSCFG[bid];
                            if(bcfg != undefined && bcfg.consume == 0)
                            {
                                // boss 按钮
                                itemObj.wgt.bossButton.setVisible(true);
                                itemObj.wgt.bossButton.setTag(bkey);
                                itemObj.wgt.bossButton.addTouchEventListener(this.onTouchEventOne, this);

                                //红点提示
                                itemObj.wgt.TipsImageF.setVisible(true);
                            }
                            break;
                        }
                    }
                }
            }

            if (dat.fs[0] + dat.fs[1] + dat.fs[2] + dat.fs[3] < 4)  //未通关
            {
                break;
            }
        }

        this.obj.wgt.ListView_One.jumpToTop();
    },

    dealRedPoint:function(){
        var num = 0;
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

        var num2 = 0;
        var svrTime = GLOBALDATA.svrTime + (Date.parse(new Date()) - GLOBALDATA.loginTime) / 1000;
        var at = replica.at - 6 * 60;
        var den = Math.floor((svrTime - at) / (6 * 60));  //

        //精英副本剩余挑战次数
        num2 = Math.floor((replica.en + den) / 10);

        // 精英副本宝箱是否领取的情况
        var list = GLOBALDATA.replica.hlist;
        for (var key in list)
        {
            var dat = list[key];
            var stars = (dat.ss && (dat.ss[0] + dat.ss[1] + dat.ss[2] + dat.ss[3]) || 0);
            var step = Math.floor(stars / 4);

            if (dat.gl < step)
            {
                num2 = num2 + 1;
                break;
            }
        }

        var num3 = 0;
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
                        num3 = 1;
                        num2 = num2 + 1;
                        break;
                    }
                }
            }
        }
        //红点提示
        this.obj.wgt.TipsImageC.setVisible(num > 0);

        this.obj.wgt.TipsImageE.setVisible(num2 > 0);

        this.obj.wgt.TipsImageBoss.setVisible(num3 > 0);
    },

    onTouchEventOne:function(sender, type){
        if(ccui.Widget.TOUCH_ENDED == type){
            switch(sender.name)
            {
                case "oItemFightButton":
                    var id = sender.getTag();
                    if (this.viewType == 0)
                    {
                        this.showImageCommon(id);
                    }
                    else if (this.viewType == 100)
                    {
                        this.showImageElite(id);
                    }
                    break;
                case "bossButton":
                    var key = sender.getTag();
                    this.showPanelComBoss(key);
                    break;
            }
        }
    },

    // 普通副本 列表
    showImageCommon:function(id)
    {
        var list = GLOBALDATA.replica.llist;
        var dat = null;
        for (var key in list)
        {
            if (id == list[key].id)
            {
                dat = list[key];
                break;
            }
        }

        if (dat)
        {
            this.stageId = id;

            var cfg = COUNTERSTAGECFG[id];
            this.obj.wgt.Image_common.setVisible(true);
            this.obj.wgt.Image_elite.setVisible(false);

            this.obj.wgt.textCommonName.setString(cfg.name);
            this.obj.wgt.textComNum.setString(StringFormat(STRINGCFG[100190].string,  GLOBALDATA.replica.n || 0));

            this.obj.wgt.imageFreeBox.setTag(id);

            var arsenBox = ccui.helper.seekWidgetByName(this.obj.wgt.nodeFreeBox, "arsenBox");
            arsenBox.stopAllActions();
            this.obj.wgt.nodeFreeBox.setVisible(false);
            // 宝箱特效
            if((dat.fs && ( dat.fs[0] + dat.fs[1] + dat.fs[2] + dat.fs[3]) || 0) == 4)  //已通关，
            {
                this.obj.wgt.nodeFreeBox.setVisible(true);
                if (dat.g != 1 ) //未领取宝箱
                {
                    var act = ccs.load(res.effArsenBox_json).action;
                    act.play("arsenBoxAction", true);
                    arsenBox.runAction(act);
                }
            }

            this.obj.wgt.ListView_common.removeAllChildren();
            for (var i = 0; i < 4 ; i++)
            {
                var itemObj = ccsTool.load(res.uiActivityTwoItem, ["bagItem", "Bag", "bagTItemName", "Image_heroDi"
                    , "Node_common", "bagTItemRewrd3", "heroKill", "firstButton"
                    , "Node_eilte"
                    , "fightButton"
                    , "bagTItemBg1", "bagTItemIcon1", "bagTItemNum1",
                    , "bagTItemBg2", "bagTItemIcon2", "bagTItemNum2", ]);

                itemObj.wgt.Node_common.setVisible(true);
                itemObj.wgt.Node_eilte.setVisible(false);

                var masterid = cfg.modelshow[i];
                var master = MONSTERCFG[masterid];

                itemObj.wgt.bagTItemName.setString(master.mastername);

                HeroDefault.runAdle(masterid, itemObj.wgt.Bag, 0, 0, 1, 2);

                itemObj.wgt.bagTItemRewrd3.setString(cfg.friitem[1]);  //首杀奖励

                // 通关奖励
                for (var j = 1;j <= 2; j++ )
                {
                    if (j <= cfg.secitem.length)
                    {
                        var id = cfg.secitem[j - 1][0];
                        var min = cfg.secitem[j - 1][1];
                        var max = cfg.secitem[j - 1][2];
                        var item = ITEMCFG[id];
                        Helper.LoadFrameImageWithPlist(itemObj.wgt["bagTItemBg" + j], item.quality);
                        Helper.LoadIcoImageWithPlist(itemObj.wgt["bagTItemIcon" + j], item);

                        itemObj.wgt["bagTItemNum" + j].setString(STRINGCFG[100191].string + min + "-" + max);
                    }
                    else
                    {
                        itemObj.wgt["bagTItemBg" + j].setVisible(false);
                    }
                }

                if(dat.fs[i] == 1) //已首杀
                {
                    itemObj.wgt.fightButton.setVisible(true);  // 挑战按钮
                    itemObj.wgt.heroKill.setVisible(true);     //已首杀
                }
                else
                {
                    itemObj.wgt.fightButton.setVisible(false);  // 挑战按钮

                    itemObj.wgt.firstButton.setVisible(i == 0 || dat.fs[i - 1] == 1);
                }

                itemObj.wgt.fightButton.setTag(i);
                itemObj.wgt.fightButton.addTouchEventListener(this.onTouchEventTwo, this);
                itemObj.wgt.firstButton.setTag(i);
                itemObj.wgt.firstButton.addTouchEventListener(this.onTouchEventTwo, this);

                var bagItem = itemObj.wgt.bagItem;
                bagItem.removeFromParent(false);
                this.obj.wgt.ListView_common.pushBackCustomItem(bagItem);
            }
        }
    },

    // 普通副本 通关宝箱预览
    showPanleSee:function(id){
        var list = GLOBALDATA.replica.llist;
        var dat = null;
        for (var key in list)
        {
            if (id == list[key].id)
            {
                dat = list[key];
                break;
            }
        }

        if (dat)
        {
            this.obj.wgt.Panel_See.setVisible(true);
            this.obj.wgt.btnGo.setTag(id);
            var cfg = COUNTERSTAGECFG[id];
            for (var i = 1; i <= 4; i++)
            {
                if (i <= cfg.chest.length)
                {
                    var id = cfg.chest[i - 1][0];
                    var num = cfg.chest[i - 1][1];
                    var item = ITEMCFG[id];
                    Helper.LoadIconFrameAndAddClick(this.obj.wgt["bagIconSee" + i], this.obj.wgt["bagBgSee" + i], this.obj.wgt["bagPiecesSee" + i], item);
                    Helper.setNamecolorByQuality(this.obj.wgt["bagNameSee" + i], item.quality);
                    this.obj.wgt["bagNumSee" + i].setString(num);
                    this.obj.wgt["bagNameSee" + i].setString(item.itemname);
                }
                else
                {
                    this.obj.wgt["bagBgSee" + i].setVisible(false);
                }
            }

            if (dat.g == 1) //已领取
            {
                this.obj.wgt.textNoSee.setVisible(false);
                this.obj.wgt.textGetSee.setVisible(false);
                this.obj.wgt.textAlreadyGetSee.setVisible(true);
                this.obj.wgt.btnGo.setBright(false);
            }
            else if ((dat.fs && ( dat.fs[0] + dat.fs[1] + dat.fs[2] + dat.fs[3]) || 0) == 4) // 已通关，可领取
            {
                this.obj.wgt.textNoSee.setVisible(false);
                this.obj.wgt.textGetSee.setVisible(true);
                this.obj.wgt.textAlreadyGetSee.setVisible(false);
                this.obj.wgt.btnGo.setBright(true);
            }
        }
    },

    closePanleSee:function(id){
        this.obj.wgt.Panel_See.setVisible(false);

        var list = GLOBALDATA.replica.llist;
        var dat = null;
        for (var key in list)
        {
            if (id == list[key].id)
            {
                dat = list[key];
                break;
            }
        }

        //领取宝箱
        if (dat && (dat.fs && ( dat.fs[0] + dat.fs[1] + dat.fs[2] + dat.fs[3]) || 0) == 4 && dat.g == 0)
        {
            Network.getInstance().send({task:"replica.getbox", id:this.stageId, pos:1});
        }
    },

    // 普通副本 boss
    showPanelComBoss:function(key){
        var id = GLOBALDATA.replica.bl[key];
        var cfg = COUNTERBOSSCFG[id]
        if(cfg != undefined)
        {
            this.bosskey =  key;
            var master = MONSTERCFG[cfg.monsterid];
            this.obj.wgt.textComBoss.setString(master.mastername);

            for (var i = 1; i <= 4; i++)
            {
                if (i <= cfg.drop.length)
                {
                    var itemid = cfg.drop[i-1][0];
                    var min = cfg.drop[i-1][1];
                    var max = cfg.drop[i-1][2];

                    var item = ITEMCFG[itemid];
                    Helper.LoadIconFrameAndAddClick(this.obj.wgt["bagIconCBWar" + i], this.obj.wgt["bagBgCBWar" + i],  this.obj.wgt["bagPiecesCBWar" + i], item);
                    this.obj.wgt["bagNumCBWar" + i].setString(STRINGCFG[100191].string + min + "-" + max);
                }
                else
                {
                    this.obj.wgt["bagBgCBWar" + i].setVisible(false);
                }
            }
            this.obj.wgt.Panel_ComBoss.setVisible(true);
        }
    },

    closePanelComBoss:function(){
        this.obj.wgt.Panel_ComBoss.setVisible(false);
        this.combatBossTips();
    },

    //直接显示精英副本界面
    directShowElite:function () {
        this.obj.wgt.Image_bossWar.setVisible(false);
        this.showImageElite(this.passid);
    },

    // 精英副本 列表
    showImageElite:function(id)
    {
        var replica = GLOBALDATA.replica;
        var list = replica.hlist;
        var dat = null;
        for (var key in list)
        {
            if (id == list[key].id)
            {
                dat = list[key];
                break;
            }
        }

        if (dat)
        {
            this.stageId = id;

            var cfg  = COUNTERSTAGECFG[id];
            this.obj.wgt.Image_common.setVisible(false);
            this.obj.wgt.Image_elite.setVisible(true);

            this.obj.wgt.textComName.setString(cfg.name);
            this.countdown();


            //
            var svrTime = GLOBALDATA.svrTime + (Date.parse(new Date()) - GLOBALDATA.loginTime) / 1000;
            var at = replica.at - 6 * 60;
            var den = Math.floor((svrTime - at) / (6 * 60));  //

            this.obj.wgt.ListView_elite.removeAllChildren();
            for (var i = 0; i < 4 ; i++)
            {
                var itemObj = ccsTool.load(res.uiActivityTwoItem, ["bagItem", "Bag", "bagTItemName", "Image_heroDi"
                    , "Node_common", "bagTItemRewrd3", "heroKill", "firstButton"
                    , "Node_eilte", "textTodayNum", "Image_TStar1", "Image_TStar2", "Image_TStar3", "sweepButton", "resetButton", "sweepNum",
                    , "fightButton"
                    , "bagTItemBg1", "bagTItemIcon1", "bagTItemNum1",
                    , "bagTItemBg2", "bagTItemIcon2", "bagTItemNum2", ]);

                itemObj.wgt.Node_common.setVisible(false);
                itemObj.wgt.Node_eilte.setVisible(true);

                var masterid = cfg.modelshow[i];
                var master = MONSTERCFG[masterid];

                itemObj.wgt.bagTItemName.setString(master.mastername);

                HeroDefault.runAdle(masterid, itemObj.wgt.Bag, 0, 0, 1, 2);

                // 星级数
                for (var j = 1; j <= 3; j++ )
                {
                    itemObj.wgt["Image_TStar" + j].setVisible(dat.ss[i] >= j);
                }

                // 今日剩余挑战次数
                itemObj.wgt.textTodayNum.setString(StringFormat(STRINGCFG[100192].string,  dat.ns[i]));
                // 通关奖励
                for (var j = 1;j <= 2; j++ )
                {
                    if (j <= cfg.secitem.length)
                    {
                        var itemid = cfg.secitem[j - 1][0];
                        var min = cfg.secitem[j - 1][1];
                        var max = cfg.secitem[j - 1][2];
                        var item = ITEMCFG[itemid];
                        Helper.LoadFrameImageWithPlist(itemObj.wgt["bagTItemBg" + j], item.quality);
                        Helper.LoadIcoImageWithPlist(itemObj.wgt["bagTItemIcon" + j], item);

                        itemObj.wgt["bagTItemNum" + j].setString("");
                    }
                    else
                    {
                        itemObj.wgt["bagTItemBg" + j].setVisible(false);
                    }
                }

                if(dat.ns[i] == 0) // 重置按钮
                {
                    itemObj.wgt.resetButton.setVisible(true);
                    itemObj.wgt.resetButton.setTag(i);
                    itemObj.wgt.resetButton.addTouchEventListener(this.onTouchEventTwo, this);
                }

                if(dat.ss[i] == 3 && dat.ns[i] > 0) //扫到x次
                {
                    var min = Math.min(dat.ns[i], Math.floor((replica.en + den)/10));
                    itemObj.wgt.sweepNum.setString(min > 0 ? StringFormat(STRINGCFG[100102].string, min) : STRINGCFG[100263].string);
                    itemObj.wgt.sweepButton.setVisible(true);
                    itemObj.wgt.sweepButton.setTag(i);
                    itemObj.wgt.sweepButton.addTouchEventListener(this.onTouchEventTwo, this);
                }

                itemObj.wgt.fightButton.setTag(i);
                itemObj.wgt.fightButton.addTouchEventListener(this.onTouchEventTwo, this);

                var bagItem = itemObj.wgt.bagItem;
                bagItem.removeFromParent(false);
                this.obj.wgt.ListView_elite.pushBackCustomItem(bagItem);
            }

            var stars = (dat.ss && (dat.ss[0] + dat.ss[1] + dat.ss[2] + dat.ss[3]) || 0);
            this.obj.wgt.boxBar.setPercent(stars / 12 * 100);
            this.obj.wgt.textBarAll.setString(stars + "/12");

            var step = Math.floor(stars / 4);
            for (var i=1; i<=3; i++)
            {
                this.obj.wgt["imageBox" + i].setTag(id);
                //this.obj.wgt["imageBox" + i].setTouchEnabled(false);

                var arsenBox = ccui.helper.seekWidgetByName(this.obj.wgt["nodeBox" + i], "arsenBox");
                arsenBox.stopAllActions();
                this.obj.wgt["nodeBox" + i].setVisible(false);

                if (step >= i)
                {
                    this.obj.wgt["nodeBox" + i].setVisible(true);
                    //this.obj.wgt["imageBox" + i].setTouchEnabled(true);

                    if (dat.gl < i) // 可领取
                    {
                        var act = ccs.load(res.effArsenBox_json).action;
                        act.play("arsenBoxAction", true);
                        arsenBox.runAction(act);
                    }
                }
            }
        }
    },

    onTouchEventTwo:function(sender, type){
        if(ccui.Widget.TOUCH_ENDED == type){
            var index = sender.getTag() ;
            switch(sender.name)
            {
                case "fightButton":
                case "firstButton":
                    var replica = GLOBALDATA.replica;
                    if (this.viewType == 0) // 普通副本
                    {
                        if (replica.n <= 0)
                        {
                            ShowTipsTool.TipsFromText(STRINGCFG[100264].string, cc.color.RED, 30);
                            return;
                        }
                        this.stagePos = index;
                        this.combatTips();
                    }
                    else if (this.viewType == 100)
                    {
                        var svrTime = GLOBALDATA.svrTime + (Date.parse(new Date()) - GLOBALDATA.loginTime) / 1000;
                        var at = replica.at - 6 * 60;
                        var den = Math.floor((svrTime - at) / (6 * 60));  //

                        if ((replica.en + den) < 10)
                        {
                            this.addEnergy();
                            return;
                        }
                        else
                        {
                            var list = replica.hlist;
                            for (var key in list)
                            {
                                if (this.stageId == list[key].id)
                                {
                                    var dat = list[key];
                                    if (dat.ns[index] > 0)
                                    {
                                        if ((index == 0) || (index > 0 && dat.ps[index - 1] == 1))
                                        {
                                            this.stagePos = index;
                                            this.combatTips();
                                        }
                                        else
                                        {
                                            ShowTipsTool.TipsFromText("此关卡未开启", cc.color.RED, 30);
                                        }
                                    }
                                    else
                                    {
                                        ShowTipsTool.TipsFromText("挑战次数不足", cc.color.RED, 30);
                                        //this.addEnergy();
                                    }
                                    break;
                                }
                            }
                        }
                    }

                    break;
                case "sweepButton": // 扫荡
                    var replica = GLOBALDATA.replica;
                    var list = replica.hlist;
                    for (var key in list)
                    {
                        if (this.stageId == list[key].id)
                        {
                            var svrTime = GLOBALDATA.svrTime + (Date.parse(new Date()) - GLOBALDATA.loginTime) / 1000;
                            var at = replica.at - 6 * 60;
                            var den = Math.floor((svrTime - at) / (6 * 60));  //

                            var dat = list[key];
                            var min = Math.min(dat.ns[index], Math.floor((replica.en + den)/10));
                            if (min > 0)
                            {
                                this.stagePos = index;
                                this.doSweep(min);
                            }
                            else
                            {
                                this.addEnergy();
                            }
                            break;
                        }
                    }
                    break;
                case "resetButton": // 重置
                    this.stagePos = index;
                    this.resetTips();
                    break;
            }
        }
    },

    countdown:function(){
        var str = "";
        var den = 0;
        var replica = GLOBALDATA.replica;
        if (replica.en < 100)
        {
            var svrTime = GLOBALDATA.svrTime + (Date.parse(new Date()) - GLOBALDATA.loginTime) / 1000;
            var at = replica.at - 6 * 60;

            den = Math.floor((svrTime - at) / (6 * 60));
            if (replica.en + den < 100)
            {
                var lt = 6 * 60 - (svrTime - at) % (6 * 60);
                str = StringFormat(STRINGCFG[100193].string, Helper.formatTime(lt));
            }
        }

        this.obj.wgt.energyValue.setString(replica.en + den || 0);
        this.obj.wgt.energyValue1.setString(replica.en + den  || 0);
        this.obj.wgt.energyValue2.setString(replica.en + den  || 0);

        this.obj.wgt.energyTime.setString(str);
        this.obj.wgt.energyHui1.setString(str);
        this.obj.wgt.energyHui2.setString(str);
    },

    // 精英副本 星级宝箱
    showPanelStarSee:function(id, index){
        var list = GLOBALDATA.replica.hlist;
        var dat = null;
        for (var key in list)
        {
            if (id == list[key].id)
            {
                dat = list[key];
                break;
            }
        }

        if (dat)
        {
            this.obj.wgt.Panel_StarSee.setVisible(true);

            var cfg = COUNTERSTAGECFG[id];
            var chest = cfg.chest[index - 1];
            cc.log(chest);
            for (var i = 1; i <= 4; i++)
            {
                if (i * 2 <= chest.length)
                {
                    var id = chest[i * 2 - 2];
                    var num = chest[i * 2 - 1];
                    var item = ITEMCFG[id];
                    Helper.LoadIconFrameAndAddClick(this.obj.wgt["bagIconStarSee" + i], this.obj.wgt["bagBgStarSee" + i], this.obj.wgt["bagPiecesStarSee" + i], item);
                    Helper.setNamecolorByQuality(this.obj.wgt["bagNameStarSee" + i], item.quality);
                    this.obj.wgt["bagNumStarSee" + i].setString(num);
                    this.obj.wgt["bagNameStarSee" + i].setString(item.itemname);
                }
                else
                {
                    this.obj.wgt["bagBgStarSee" + i].setVisible(false);
                }
            }

            var stars = (dat.ss && (dat.ss[0] + dat.ss[1] + dat.ss[2] + dat.ss[3]) || 0);
            var step = Math.floor(stars / 4);
            if (step >= index && dat.gl >= index) //已领取
            {
                this.obj.wgt.textGetStarSee.setVisible(false);
                this.obj.wgt.textAlreadyGetStarSee.setVisible(true);
                this.obj.wgt.btnStarGet.setBright(false);
            }
            else if (step >= index &&  dat.gl < index) // 已通关，可领取
            {
                this.obj.wgt.textGetStarSee.setVisible(true);
                this.obj.wgt.textAlreadyGetStarSee.setVisible(false);
                this.obj.wgt.btnStarGet.setBright(true);
            }
            else
            {
                this.obj.wgt.textGetStarSee.setVisible(true);
                this.obj.wgt.textAlreadyGetStarSee.setVisible(false);
                this.obj.wgt.btnStarGet.setBright(false);
            }

            this.obj.wgt.btnStarGet.setTag(index);
        }
    },

    closePanelStarSee:function(pos){
        this.obj.wgt.Panel_StarSee.setVisible(false);

        var list = GLOBALDATA.replica.hlist;
        var dat = null;
        for (var key in list)
        {
            if (this.stageId == list[key].id)
            {
                dat = list[key];
                break;
            }
        }

        //领取宝箱
        var stars = (dat.ss && (dat.ss[0] + dat.ss[1] + dat.ss[2] + dat.ss[3]) || 0);
        var step = Math.floor(stars / 4);
        if (step >= pos && dat.gl < pos)
        {
            Network.getInstance().send({task:"replica.getbox", id:this.stageId, pos:pos});
        }
    },

    addEnergy:function()
    {
        var num =  Helper.getItemNum(18);
        if (num > 0)
        {
            var use_layer = new itemUseLayer(18);
            this.addChild(use_layer,2);

            //var buyBoxLayer = new BuyBoxLayer(18, num);
            //this.addChild(buyBoxLayer, 2);
        }
        else
        {
            var shopLayer = new ShopLayer();
            this.addChild(shopLayer, 2);
        }
    },
    // Boss入侵
    showImageBossWar:function(){
        this.obj.wgt.Image_common.setVisible(false);
        this.obj.wgt.Image_elite.setVisible(false);
        this.obj.wgt.Image_bossWar.setVisible(true);

        this.countdown();

        this.obj.wgt.ListView_boss.removeAllChildren();
        for (var key in GLOBALDATA.replica.bl)
        {
            if (GLOBALDATA.replica.bls[key] == 1)  //已刷新
            {
                var id  = GLOBALDATA.replica.bl[key];
                var cfg = COUNTERBOSSCFG[id];
                if(cfg != undefined && cfg.consume > 0)
                {
                    var itemObj = ccsTool.load(res.uiActivityTwoItem, ["bagItem", "Bag", "bagTItemName", "Image_heroDi"
                        , "Node_common",
                        , "Node_eilte",
                        , "fightButton"
                        , "bagTItemBg1", "bagTItemIcon1", "bagTItemNum1",
                        , "bagTItemBg2", "bagTItemIcon2", "bagTItemNum2"
                        , "textBossCos"]);

                    itemObj.wgt.Node_common.setVisible(false);
                    itemObj.wgt.Node_eilte.setVisible(false);

                    var masterid = cfg.monsterid;
                    var master = MONSTERCFG[masterid];

                    itemObj.wgt.bagTItemName.setString(master.mastername);

                    HeroDefault.runAdle(masterid, itemObj.wgt.Bag, 0, 0, 1, 2);


                    // 掉落奖励
                    for (var j = 1;j <= 2; j++ )
                    {
                        if (j <= cfg.drop.length)
                        {
                            var itemid = cfg.drop[j - 1][0];
                            var min = cfg.drop[j - 1][1];
                            var max = cfg.drop[j - 1][2];
                            var item = ITEMCFG[itemid];
                            Helper.LoadFrameImageWithPlist(itemObj.wgt["bagTItemBg" + j], item.quality);
                            Helper.LoadIcoImageWithPlist(itemObj.wgt["bagTItemIcon" + j], item);

                            itemObj.wgt["bagTItemNum" + j].setString(STRINGCFG[100191].string + min + "-" + max);
                        }
                        else
                        {
                            itemObj.wgt["bagTItemBg" + j].setVisible(false);
                        }
                    }
                    itemObj.wgt.textBossCos.setVisible(true);
                    itemObj.wgt.textBossCos.setString(StringFormat(STRINGCFG[100194].string, cfg.consume));

                    itemObj.wgt.fightButton.setTag(key);
                    itemObj.wgt.fightButton.addTouchEventListener(this.onTouchEventBoss, this);

                    var bagItem = itemObj.wgt.bagItem;
                    bagItem.removeFromParent(false);
                    this.obj.wgt.ListView_boss.pushBackCustomItem(bagItem);
                }
            }
        }
    },

    onTouchEventBoss:function(sender, type){
        if(ccui.Widget.TOUCH_ENDED == type){
            switch(sender.name)
            {
                case "fightButton":
                    var replica = GLOBALDATA.replica;
                    var key = sender.getTag();
                    var id = replica.bl[key];
                    var cfg = COUNTERBOSSCFG[id]
                    if(cfg != undefined)
                    {
                        var svrTime = GLOBALDATA.svrTime + (Date.parse(new Date()) - GLOBALDATA.loginTime) / 1000;
                        var at = replica.at - 6 * 60;
                        var den = Math.floor((svrTime - at) / (6 * 60));  //

                        if (cfg.consume <= (replica.en + den))
                        {
                            this.bosskey = key;
                            this.combatBossTips();
                        }
                        else
                        {
                            this.addEnergy();
                        }
                    }
                    break;
            }
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
    // 战斗提示
    combatTips:function(){
        var id = this.stageId;
        var pos = this.stagePos;
        var cfg = COUNTERSTAGECFG[id];
        if(cfg != undefined)
        {
            var sid = cfg.stage[pos] || 1;
            this.combat = new combatLayer(1, sid, 'replica.combat');
            this.addChild(this.combat, 2);
        }
    },
    // 战斗
    combatCallback:function(ttype, star){
        if (ttype == 1) // 确定
        {
            Network.getInstance().send({task:"replica.stage", id:this.stageId, stage:this.stagePos + 1, win:1, star:star, num:1});
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

                    if(self.detailtype == 1){  //如果是直接显示的精英详细界面 点击战斗之后界面直接关掉
                        self.removeFromParent(true);
                    }
                }
            }, this));

        this.runAction(seq);
    },

    // Boss战斗提示
    combatBossTips:function(){
        var key = this.bosskey;
        var id = GLOBALDATA.replica.bl[key];
        var cfg = COUNTERBOSSCFG[id]
        if(cfg != undefined)
        {
            var sid = cfg.stage || 1;
            this.combat = new combatLayer(2, sid, 'replica.combat.boss');
            this.addChild(this.combat, 2);
        }
    },

    // Boss战斗
    combatBossCallback:function(ttype){
        if (ttype == 1) // 确定
        {
            Network.getInstance().send({task:"replica.boss", pos:parseInt(this.bosskey) + 1, win:1});
        }
    },

    // 扫荡
    doSweep:function(num) {
        this._issweep = true;
        Network.getInstance().send({task:"replica.stage", id:this.stageId, stage:this.stagePos + 1, win:1, star:3, num:num});
    },

    sweepResult:function(data) {
        this._issweep = false;
        var sweepLayer = new SweepLayer(data.data);
        this.addChild(sweepLayer, 2);
    },

     // 重置提示
    resetTips:function(){
        var event = new cc.EventCustom("TipsLayer_show");
        var data = {string:STRINGCFG[100195].string, callback:this.resetCallback, target:this};
        event.setUserData(data);
        cc.eventManager.dispatchEvent(event);
    },
    // 重置
    resetCallback:function(ttype){
        if (ttype == 1) // 确定
        {
            Network.getInstance().send({task:"replica.reset", id:this.stageId, pos:this.stagePos + 1});
        }
    },

    onExit:function () {
        this._super();
        cc.eventManager.removeListener(this.replica_stage);
        cc.eventManager.removeListener(this.replica_getbox);
        cc.eventManager.removeListener(this.replica_boss);
        cc.eventManager.removeListener(this.replica_reset);
        cc.eventManager.removeListener(this.replica_combat);
        cc.eventManager.removeListener(this.replica_combat_boss);
    }
});