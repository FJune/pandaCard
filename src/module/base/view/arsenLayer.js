
/**
 ** @Author:pandayu
 ** @Version:1.0
 ** @DateTime:2018-09-09
 ** @Project:pandaCard CardGame
 ** @Contact: QQ:815099602
 **/
 /**
 * 兵工厂
 */
var ArsenLayer = baseLayer.extend({
    ctor:function () {
        this._super();
        this.LayerName = "ArsenLayer";
        this._issweep = false;
        this.uiAttributeLayer.setVisible(false);
    },

    onEnter:function () {
        this._super();
    },

    initUI:function(){
        this.obj = ccsTool.load(res.uiArsenLayer, [ "btnBack", "arsenValue", "arsenList"]);
        this.addChild(this.obj.node, 1);

        this.obj.wgt.btnBack.addTouchEventListener(this.onTouchEvent, this);

        cc.spriteFrameCache.addSpriteFrames(res.ico_equ_plist);

        this.doAddListener();

        this.switchView();
    },

    doAddListener:function(){
        var self = this;
        // 挑战
        this.arsenal_challenge = cc.EventListener.create({
            event: cc.EventListener.CUSTOM,
            eventName: "arsenal.challenge",
            callback: function(event){
                self.switchView();
                if (self._issweep)
                {
                    self.sweepResult(event.getUserData());
                }
                else
                {
                    self.resourceGet(event.getUserData());
                    self.removeCombat();
                }
            }});

        this.arsenal_getbox = cc.EventListener.create({
            event: cc.EventListener.CUSTOM,
            eventName: "arsenal.getbox",
            callback: function(event){
                self.resourceGet(event.getUserData());
                self.switchView();
            }});

        this.arsenal_buynum = cc.EventListener.create({
            event: cc.EventListener.CUSTOM,
            eventName: "arsenal.buynum",
            callback: function(event){
                self.switchView();
            }});

        this.arsenal_combat = cc.EventListener.create({
            event: cc.EventListener.CUSTOM,
            eventName: "arsenal.combat",
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

        cc.eventManager.addListener(this.arsenal_challenge, 1);
        cc.eventManager.addListener(this.arsenal_getbox, 1);
        cc.eventManager.addListener(this.arsenal_buynum, 1);
        cc.eventManager.addListener(this.arsenal_combat, 1);
    },

    switchView:function(){
        var arsenal = GLOBALDATA.arsenal;

        this.obj.wgt.arsenValue.setString(arsenal.n_num);

        this.obj.wgt.arsenList.removeAllChildren();
        for(var id in ARSENCFG)
        {
            var itemObj = ccsTool.load(res.uiArsenItem, ["arsenItem", "bossBg", "bossIcon", "fightLevel", "fightLevel"
            , "bossName", "bossComb", "bossEqu", "LoadingBar", "lblText", "imageArsenBox", "nodeArsenBox"
            , "fightButton", "sweepText", "fightImage", "cosImage", "cosDiamondImage", "cosValue"]);

            cfg = ARSENCFG[id];
            var key = id - 1;

            var times = (arsenal.count[key] || 0);
            var g_num = (arsenal.g_num[key] || 0);
            var max_times = cfg.times[0] + cfg.times[1] * g_num;

            var cost = 1;
            if(GLOBALDATA.base.lev >= cfg.level) //已解锁
            {
                itemObj.wgt.fightLevel.setString("");
                itemObj.wgt.bossBg.setVisible(true);

                Helper.LoadFrameImageWithPlist(itemObj.wgt.bossBg, cfg.quality);
                itemObj.wgt.bossIcon.loadTexture(cfg.icon, ccui.Widget.PLIST_TEXTURE);

                itemObj.wgt.fightButton.setTouchEnabled(true);
                itemObj.wgt.fightButton.setBright(true);
                itemObj.wgt.fightButton.setTag(key);
                itemObj.wgt.fightButton.addTouchEventListener(this.onItemTouchEvent, this);


                if (arsenal.n_num > 0 )     //  =>扫荡
                {
                    if ( GLOBALDATA.base.vip > 0 &&　(g_num > 0 || times > 0))  //vip 且 已通关  =>扫荡
                    {
                        var min = Math.max(Math.min(arsenal.n_num, max_times - times, 5), 1);

                        // 挑战次数
                        itemObj.wgt.sweepText.setString(StringFormat(STRINGCFG[100102].string, min));
                        itemObj.wgt.sweepText.setVisible(true);
                        itemObj.wgt.fightImage.setVisible(false);

                        cost = min;
                    }
                    else  //非vip 或 未通关  =>挑战
                    {
                        itemObj.wgt.sweepText.setVisible(false);
                        itemObj.wgt.fightImage.setVisible(true);
                    }
                }
                else   // 剩余挑战次数不足 => 购买
                {
                    itemObj.wgt.sweepText.setString(STRINGCFG[100262].string);
                    itemObj.wgt.sweepText.setVisible(true);
                    itemObj.wgt.fightImage.setVisible(false);
                }
            }
            else
            {
                itemObj.wgt.fightLevel.setString(StringFormat(STRINGCFG[100100].string, cfg.level));
                itemObj.wgt.bossBg.setVisible(false);
                itemObj.wgt.fightButton.setTouchEnabled(false);
                itemObj.wgt.fightButton.setBright(false);
            }
            itemObj.wgt.fightButton.setUserData("guid_arsenList_fightButton"+id);
            itemObj.wgt.bossName.setString(cfg.boss);
            itemObj.wgt.bossComb.setString(StringFormat(STRINGCFG[100099].string, cfg.comb));

            itemObj.wgt.bossEqu.setString(cfg.drop);
            Helper.setNamecolorByQuality(itemObj.wgt.bossEqu, cfg.quality);

            itemObj.wgt.LoadingBar.setPercent(times / max_times * 100);
            itemObj.wgt.lblText.setString(times + "/" + max_times);

            itemObj.wgt.imageArsenBox.loadTexture(StringFormat("common/i/i_04$1.png", (cfg.quality >= 2 && cfg.quality <= 5) ? (cfg.quality + 4) : 6), ccui.Widget.PLIST_TEXTURE);
            itemObj.wgt.imageArsenBox.setTag(key);
            itemObj.wgt.imageArsenBox.addTouchEventListener(this.onItemTouchEvent, this);

            if(times == max_times)
            {
                var act = ccs.load(res.effArsenBox_json).action;
                act.play("arsenBoxAction", true);
                var arsenBox = ccui.helper.seekWidgetByName(itemObj.wgt.nodeArsenBox, "arsenBox");
                arsenBox.stopAllActions();
                arsenBox.runAction(act);
                itemObj.wgt.nodeArsenBox.setVisible(true);
            }

            if (arsenal.n_num > 0)
            {
                itemObj.wgt.cosImage.setVisible(true);
                itemObj.wgt.cosDiamondImage.setVisible(false);
            }
            else
            {
                itemObj.wgt.cosImage.setVisible(false);
                itemObj.wgt.cosDiamondImage.setVisible(true);
                cost = 30;
            }
            itemObj.wgt.cosValue.setString(cost);

            var arsenItem = itemObj.wgt.arsenItem;
            arsenItem.setTag(key);
            arsenItem.removeFromParent(false);
            this.obj.wgt.arsenList.pushBackCustomItem(arsenItem);
        }
    },

    onTouchEvent:function(sender, type){
        if(ccui.Widget.TOUCH_ENDED == type){
            switch(sender.name)
            {
                case "btnBack":
                    this.removeFromParent(true);
                    break;
            }
        }
    },

    onItemTouchEvent:function(sender, type){
        if(ccui.Widget.TOUCH_ENDED == type){
            switch(sender.name)
            {
                case "fightButton":
                    var key = sender.getTag();
                    var id = key + 1;
                    this.stageId = id;
                    var cfg = ARSENCFG[id];
                    var arsenal = GLOBALDATA.arsenal;
                    var times = (arsenal.count[key] || 0);
                    var g_num = (arsenal.g_num[key] || 0);
                    var max_times = cfg.times[0] + cfg.times[1] * g_num;

                    if (times >= max_times)  //领取宝箱奖励
                    {
                        ShowTipsTool.TipsFromText(STRINGCFG[100115].string, cc.color.RED, 30);
                    }
                    else
                    {
                        var vip = VIPCFG[GLOBALDATA.base.vip];

                        if (arsenal.n_num > 0)
                        {
                            if ( GLOBALDATA.base.vip > 0 &&　(g_num > 0 || times > 0))   // vip 且 已通关  =>扫荡
                            {
                                var min = Math.max(Math.min(arsenal.n_num, max_times - times, 5), 1);
                                this.doSweep(min);
                            }
                            else //非vip 或 未通关  =>挑战
                            {
                                this.combatTips();
                            }
                        }
                        else      //剩余挑战次数不足 购买
                        {
                            if (arsenal.b_num >= vip.arsen_max_b_mum)  //秘钥购买次数已达上限
                            {
                                ShowTipsTool.TipsFromText(STRINGCFG[100116].string, cc.color.RED, 30);
                            }
                            else if (GLOBALDATA.base.diamond < 30)      //钻石不足
                            {
                                 ShowTipsTool.TipsFromText(STRINGCFG[100079].string, cc.color.RED, 30);
                            }
                            else
                            {
                                //提示 购买次数
                                var buyNumLayer = new BuyNumLayer(2, 30, 0, vip.arsen_max_b_mum - arsenal.b_num)
                                this.addChild(buyNumLayer, 2);
                            }
                        }
                    }
                    break;

                case "imageArsenBox": //宝箱按钮
                    var key = sender.getTag();
                    var id = key + 1;
                    var cfg = ARSENCFG[id];
                    var arsenal = GLOBALDATA.arsenal;
                    var times = (arsenal.count[key] || 0);
                    var g_num = (arsenal.g_num[key] || 0);
                    var max_times = cfg.times[0] + cfg.times[1] * g_num;

                    if(times >= max_times)
                    {
                        Network.getInstance().send({task:"arsenal.getbox", id:id});
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
        var cfg = ARSENCFG[id];
        var sid = cfg.stageid;
        this.combat = new combatLayer(1, sid,'arsenal.combat');
        this.addChild(this.combat, 2);
    },
    // 战斗
    combatCallback:function(ttype){
        if (ttype == 1) // 确定
        {
            Network.getInstance().send({task:"arsenal.challenge", id:this.stageId, num:1, win:1});
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

    doSweep:function(num) {
        this._issweep = true;
        Network.getInstance().send({task:"arsenal.challenge", id:this.stageId, num:num, win:1});
    },

    sweepResult:function(data) {
        this._issweep = false;
        var sweepLayer = new SweepLayer(data.data);
        this.addChild(sweepLayer, 2);
    },

    onExit:function () {
        this._super();
        cc.eventManager.removeListener(this.arsenal_challenge);
        cc.eventManager.removeListener(this.arsenal_getbox);
        cc.eventManager.removeListener(this.arsenal_buynum);
        cc.eventManager.removeListener(this.arsenal_combat);
    }
});