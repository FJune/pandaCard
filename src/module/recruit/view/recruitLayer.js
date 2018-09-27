
/**
 ** @Author:pandayu
 ** @Version:1.0
 ** @DateTime:2018-09-09
 ** @Project:pandaCard CardGame
 ** @Contact: QQ:815099602
 **/
 /**
 */
var RecruitLayer = baseLayer.extend({
    ctor:function () {
        this._super();
        this.LayerName = "RecruitLayer";
        this._herolist = [];
    },
    onEnter:function () {
        this._super();
    },

    initUI:function(){
        this.obj = ccsTool.load(res.uiRecruitLayer, [ "ornBtn", "taskImageO", "ornFreeBtn", "shopBtn", "taskImageShop", "previewBtn", "seniorBtn", "taskImageS", "senFreeBtn", "seniorTenBtn", "rechargeBtn", "btnOk",
        "ordinaryValue", "seniorValue", "freeText", "ornFreeText", "ornNum","certainlyText","senFreeText", "seniorNum", "seniorIcon","senDiamondIcon",
        "layoutGet", "nodeOne", "nodeTen",
        "nodehero","heroQualityImage", "heroTenName", "heroType", "heroName"
        ,"nodehero1","heroQualityImage1", "heroTenName1", "heroType1",
        ,"nodehero2","heroQualityImage2", "heroTenName2", "heroType2",
        ,"nodehero3","heroQualityImage3", "heroTenName3", "heroType3",
        ,"nodehero4","heroQualityImage4", "heroTenName4", "heroType4",
        ,"nodehero5","heroQualityImage5", "heroTenName5", "heroType5",
        ,"nodehero6","heroQualityImage6", "heroTenName6", "heroType6",
        ,"nodehero7","heroQualityImage7", "heroTenName7", "heroType7",
        ,"nodehero8","heroQualityImage8", "heroTenName8", "heroType8",
        ,"nodehero9","heroQualityImage9", "heroTenName9", "heroType9",
        ,"nodehero10","heroQualityImage10", "heroTenName10", "heroType10"]);

        this.obj.wgt["nodehero0"] = this.obj.wgt.nodehero;
        this.obj.wgt["heroQualityImage0"] = this.obj.wgt.heroQualityImage;
        this.obj.wgt["heroTenName0"] = this.obj.wgt.heroTenName;
        this.obj.wgt["heroType0"] = this.obj.wgt.heroType;

        this.obj.node.setPosition(0,105);
        this.addChild(this.obj.node, 1);

        this.obj.wgt.layoutGet.setVisible(false);

        this.obj.wgt.ornBtn.addTouchEventListener(this.onTouchEvent, this);
        this.obj.wgt.ornFreeBtn.addTouchEventListener(this.onTouchEvent, this);
        this.obj.wgt.shopBtn.addTouchEventListener(this.onTouchEvent, this);
        this.obj.wgt.previewBtn.addTouchEventListener(this.onTouchEvent, this);
        this.obj.wgt.seniorBtn.addTouchEventListener(this.onTouchEvent, this);
        this.obj.wgt.senFreeBtn.addTouchEventListener(this.onTouchEvent, this);
        this.obj.wgt.seniorTenBtn.addTouchEventListener(this.onTouchEvent, this);
        this.obj.wgt.rechargeBtn.addTouchEventListener(this.onTouchEvent, this);

        this.obj.wgt.btnOk.addTouchEventListener(this.onTouchEvent, this);

        this.schedule(this.countdown, 1, cc.REPEAT_FOREVER);

        this.updateUI();

        this.doAddListener();
    },

    doAddListener:function(){
        var self = this;
        this._nomorlone = cc.EventListener.create({
            event: cc.EventListener.CUSTOM,
            eventName: "research.nomorlone",
            callback: function(event){
                self.result(event);
            }
        });
        cc.eventManager.addListener(this._nomorlone, 1);

        this._highone = cc.EventListener.create({
            event: cc.EventListener.CUSTOM,
            eventName: "research.highone",
            callback: function(event){
                self.result(event);
            }
        });
        cc.eventManager.addListener(this._highone, 1);

        this._highten = cc.EventListener.create({
            event: cc.EventListener.CUSTOM,
            eventName: "research.highten",
            callback: function(event){
               self.result(event);
            }
        });


        cc.eventManager.addListener(this._highten, 1);

        this.shop_refresh = cc.EventListener.create({
            event: cc.EventListener.CUSTOM,
            eventName: "shop.refresh",
            callback: function(event){
               self.updateUI();
            }
        });
        cc.eventManager.addListener(this.shop_refresh, 1);
    },

    updateUI:function(){
        var lottery = GLOBALDATA.research.lottery;
        var n_num = Helper.getItemNum(4); //道具数量
        var h_num = Helper.getItemNum(5); //道具数量

        var lt = lottery.h_ut + 24 * 3600 - (GLOBALDATA.svrTime + (Date.parse(new Date()) - GLOBALDATA.loginTime) / 1000);  //

        this.obj.wgt.ordinaryValue.setString(Helper.formatNum(n_num));
        this.obj.wgt.seniorValue.setString(Helper.formatNum(h_num));


        this.obj.wgt.taskImageShop.setVisible((GLOBALDATA.shop.fn) > 0);

        this.obj.wgt.freeText.setString(StringFormat(STRINGCFG[100073].string, "(" + (lottery.n_free) + "/5)"));
        this.obj.wgt.ornFreeText.setString(StringFormat(STRINGCFG[100074].string, "(" + (lottery.n_free) + "/5)"));
        this.obj.wgt.ornFreeBtn.setVisible(lottery.n_free > 0);

        this.obj.wgt.ornNum.setColor(n_num > 0 ? cc.color.WHITE :  cc.color.RED);
        this.obj.wgt.taskImageO.setVisible(n_num > 0);

        var ltimes = 10 - lottery.h_num % 10;

        this.obj.wgt.certainlyText.setString(ltimes == 10 ?  STRINGCFG[100098].string : StringFormat(STRINGCFG[100076].string, ltimes));
        this.obj.wgt.senFreeText.setString((lottery.h_free > 0  || lt <= 0) ? StringFormat(STRINGCFG[100074].string, "") : StringFormat(STRINGCFG[100075].string, Helper.formatTime(lt)));
        this.obj.wgt.senFreeBtn.setVisible(lottery.h_free > 0 || lt <= 0);

        if (h_num > 0 )
        {
            this.obj.wgt.seniorIcon.setVisible(true);
            this.obj.wgt.taskImageS.setVisible(true);
            this.obj.wgt.senDiamondIcon.setVisible(false);
            this.obj.wgt.seniorNum.setString(1);
        }
        else
        {
            this.obj.wgt.seniorIcon.setVisible(false);
            this.obj.wgt.taskImageS.setVisible(false);
            this.obj.wgt.senDiamondIcon.setVisible(true);
            this.obj.wgt.seniorNum.setString(288);
        }
    },

    countdown:function(){
        var lottery = GLOBALDATA.research.lottery;

        var lt = lottery.h_ut + 24 * 3600 - (GLOBALDATA.svrTime + (Date.parse(new Date()) - GLOBALDATA.loginTime) / 1000) ;  //
        this.obj.wgt.senFreeText.setString((lt <= 0) ? StringFormat(STRINGCFG[100074].string, "") : StringFormat(STRINGCFG[100075].string, Helper.formatTime(lt)));
        this.obj.wgt.senFreeBtn.setVisible(lottery.h_free > 0 || lt <= 0);
    },

    result:function(event){
        this.updateUI();
        this.obj.wgt.layoutGet.setVisible(true);
        var data = event.getUserData().data;

        this._id = [];
        this._id.push(0);
        for (var id in data)
        {
            for(var i = 0; i < data[id]; i++){
                this._id.push(id);
            }
        }
        var times = this._id.length - 1;
        if (times == 1)
        {
            this.obj.wgt.nodeOne.setVisible(true);
            this.obj.wgt.nodeTen.setVisible(false);

            this.obj.wgt["nodehero0"].setVisible(false);

            //
            this._id[0] = this._id[1];
            this._id.pop();
            this._index = 0;
        }
        else if (times == 10)
        {
            this.obj.wgt.nodeOne.setVisible(false);
            this.obj.wgt.nodeTen.setVisible(true);

            for (var i = 1; i <= 10 ; i++ )
            {
                this.obj.wgt["nodehero" + i].setVisible(false);
            }
            this._index = 1;
        }

        this.schedule(this.onTimer, 0.2, times);
    },

    onTimer:function(){
        var i = this._index;
        if (i >= 0 && i <= 10 && this._id[i])
        {
            var SolId = this._id[i];

            var item = ITEMCFG[SolId];
            var attrCfg = HEROCFG[SolId];

            var hero = HeroDefault.runAdle(SolId, this.obj.wgt["nodehero" + i], 5, -45, 2, 1);
            this._herolist.push(hero);

            this.obj.wgt["heroQualityImage"+i].loadTexture(StringFormat("common/a/line_guang$1.png", (item.quality >= 3 && item.quality <= 6) ? (item.quality - 2) : 1), ccui.Widget.PLIST_TEXTURE);

            this.obj.wgt["heroType"+i].loadTexture(StringFormat("common/i/i_039_$1.png", attrCfg.armytype), ccui.Widget.PLIST_TEXTURE);

            this.obj.wgt["heroTenName" +i].setString(item.itemname);
            Helper.setNamecolorByQuality(this.obj.wgt["heroTenName" +i], item.quality);

            if(i == 0){
                this.obj.wgt.heroName.setString(item.itemname);
                Helper.setNamecolorByQuality(this.obj.wgt.heroName, item.quality);
            }

            //
            this.obj.wgt["nodehero" + i].runAction(cc.sequence(cc.delayTime(0.2),cc.show()));
            //播放特效
            var effObj = ccs.load(res.effRecruit_json);
            effObj.action.play(item.quality == 5 ? "senAction" : "ornAction", false);
            effObj.node.runAction(effObj.action);
            effObj.node.x = this.obj.wgt["nodehero" + i].x;
            effObj.node.y = this.obj.wgt["nodehero" + i].y;
            this.obj.wgt["nodehero" + i].getParent().addChild(effObj.node);

            this._index++;
        }
    },

    clearHero:function(){
        var hero = null;
        while(hero = this._herolist.pop()){
            hero.removeFromParent(true);
        }
    },

    onTouchEvent: function(sender, type){
        if(ccui.Widget.TOUCH_ENDED == type){
            switch(sender.name){
                case "shopBtn":
                    var showHeroLayer = new ShopHeroLayer();
                    this.myLayer.addChild(showHeroLayer, 2);
                    break;
                case "previewBtn":
                    break;

                case "ornBtn":
                case "ornFreeBtn":  //普通单抽
                    if ( ( GLOBALDATA.research.lottery.n_free > 0)
                        || (Helper.getItemNum(4) > 0) )
                    {
                        Network.getInstance().send({task:"research.nomorlone"});
                    }
                    else
                    {
                        var event = new cc.EventCustom("TipsLayer_show");
                        var data = {string:STRINGCFG[100080].string, btntype:0};
                        event.setUserData(data);
                        cc.eventManager.dispatchEvent(event);

                    }

                    break;
                case "seniorBtn":
                case "senFreeBtn":   //高级单抽
                    if(GLOBALDATA.base.lev >= INTERFACECFG[14].level){
                        if ( (GLOBALDATA.research.lottery.h_free > 0)
                            || (GLOBALDATA.research.lottery.h_ut + 24 * 3600 - (GLOBALDATA.svrTime + (Date.parse(new Date()) - GLOBALDATA.loginTime) / 1000)) <= 0
                            || (Helper.getItemNum(5) > 0)
                            || GLOBALDATA.base.diamond >= 288)
                        {
                            Network.getInstance().send({task:"research.highone"});
                        }
                        else
                        {
                            var event = new cc.EventCustom("TipsLayer_show");
                            var data = {string:STRINGCFG[100079].string, callback:this.btnOKCallback, target:this};
                            event.setUserData(data);
                            cc.eventManager.dispatchEvent(event);
                        }
                    }else{
                        var describe = StringFormat(INTERFACECFG[14].name + STRINGCFG[100045].string, INTERFACECFG[14].level);
                        ShowTipsTool.TipsFromText(describe, cc.color.RED, 30);
                    }
                    break;
                case "seniorTenBtn":  //高级十连抽
                    if(GLOBALDATA.base.lev >= INTERFACECFG[14].level){
                        if (GLOBALDATA.base.diamond >= 2580)
                        {
                            Network.getInstance().send({task:"research.highten"});
                        }
                        else
                        {
                            //ShowTipsTool.ErrorTipsFromStringById(100079);  //显示错误的tips
                            var event = new cc.EventCustom("TipsLayer_show");
                            var data = {string:STRINGCFG[100079].string, callback:this.btnOKCallback, target:this};
                            event.setUserData(data);
                            cc.eventManager.dispatchEvent(event);
                        }
                    }
                    break;
                case "rechargeBtn":
                    break;
                case "btnOk":
                    this.obj.wgt.layoutGet.setVisible(false);
                    this.unschedule(this.onTimer);
                    this.clearHero();
                    break;
            }
        }
    },

    btnOKCallback:function(tp){
    },

    onExit:function () {
        this._super();
        cc.eventManager.removeListener(this._nomorlone);
        cc.eventManager.removeListener(this._highone);
        cc.eventManager.removeListener(this._highten);
        cc.eventManager.removeListener(this.shop_refresh);
    }
});