
/**
 ** @Author:pandayu
 ** @Version:1.0
 ** @DateTime:2018-09-09
 ** @Project:pandaCard CardGame
 ** @Contact: QQ:815099602
 **/
var CityLayer = baseLayer.extend({
    ctor:function () {
        this._super();
        this.LayerName = "CityLayer";
    },
    onEnter:function () {
        this._super();
        var self = this;
        //座驾红点显示事件
        this.tipShowEvent = cc.EventListener.create({
            event: cc.EventListener.CUSTOM,
            eventName: "CarTipShowEvn",
            callback: function(event) {
                var resData = event.getUserData();
                if(resData){
                    self.obj.wgt.imageTipsCar.setVisible(true);
                }else{
                    self.obj.wgt.imageTipsCar.setVisible(false);
                }
            }
        });
        cc.eventManager.addListener(this.tipShowEvent, this);
    },

    initUI:function(){
        this.obj = ccsTool.load(res.uiCityLayer, ["btnGodWar", "btnActivity", "imageTips2", "btnLegion", "btnArena", "imageTips1","btnArsenal", "btnStar", "btnRanking",
                "shopButton", "equButton", "exploreButton", "TipsImageEx", "moreButton","textTime6","carButton","warDuoButton","bossWarButton", "imageTipsCar",
                "imageTips3", "imageTips6", "taskImage1","taskImageBoss"]);

        this.obj.node.setPosition(0,105);
        this.addChild(this.obj.node);

        this.obj.wgt.carButton.setVisible(false);//座驾按钮屏蔽
        var tipsBool = baseModel.AllCarTipsShow();
        if(tipsBool){
            this.obj.wgt.imageTipsCar.setVisible(true);
        }
        this.obj.wgt.btnGodWar.addTouchEventListener(this.onTouchEvent, this);
        this.obj.wgt.btnActivity.addTouchEventListener(this.onTouchEvent, this);
        this.obj.wgt.btnLegion.addTouchEventListener(this.onTouchEvent, this);
        this.obj.wgt.btnArena.addTouchEventListener(this.onTouchEvent, this);
        this.obj.wgt.btnArsenal.addTouchEventListener(this.onTouchEvent, this);
        this.obj.wgt.btnStar.addTouchEventListener(this.onTouchEvent, this);
        this.obj.wgt.btnRanking.addTouchEventListener(this.onTouchEvent, this);

        this.obj.wgt.shopButton.addTouchEventListener(this.onTouchEvent, this);
        this.obj.wgt.equButton.addTouchEventListener(this.onTouchEvent, this);
        this.obj.wgt.exploreButton.addTouchEventListener(this.onTouchEvent, this);
        this.obj.wgt.moreButton.addTouchEventListener(this.onTouchEvent, this);
        this.obj.wgt.carButton.addTouchEventListener(this.onTouchEvent, this);
        this.obj.wgt.btnRanking.addTouchEventListener(this.onTouchEvent, this);
        this.obj.wgt.warDuoButton.addTouchEventListener(this.onTouchEvent, this);
        this.obj.wgt.bossWarButton.addTouchEventListener(this.onTouchEvent, this);

        this.obj.wgt.textTime6.setVisible(true);
        //红点
        this.imageTips3 = this.obj.wgt.imageTips3;
        this.countdown();

        this.schedule(this.countdown, 1, cc.REPEAT_FOREVER);
        //处理红点
        this.dealRedPoint();
    },

    countdown:function(){
        var str  = "";
        if (GLOBALDATA.base.lev >= INTERFACECFG[6].level)
        {
            var svrTime = GLOBALDATA.svrTime + (Date.parse(new Date()) - GLOBALDATA.loginTime) / 1000;

            var str = STRINGCFG[100261].string;

            var max_n_num = VIPCFG[GLOBALDATA.base.vip].arsen_max_n_num
            //兵工厂挑战次数
            if (GLOBALDATA.arsenal.n_num < max_n_num)
            {
                var n_ut = GLOBALDATA.arsenal.n_ut;
                var lt = (n_ut + 1.5 * 3600 - svrTime);

                str = Helper.formatTime(lt);
            }
        }

        this.obj.wgt.textTime6.setString(str);
    },

    onTouchEvent:function(sender, type){
        if(ccui.Widget.TOUCH_ENDED == type){
            /*var id = sender.getTag();
            var level = (INTERFACECFG[id] || {level:GLOBALDATA.base.lev}).level;

            if ( GLOBALDATA.base.lev < level)
            {
                ShowTipsTool.TipsFromText(StringFormat(STRINGCFG[100056].string, level), cc.color.RED, 30);
            }
            else
            {  }*/
                switch(sender.name)
                {
                    case "btnActivity"://军事活动
                        if(GLOBALDATA.base.lev >= INTERFACECFG[2].level){
                            var activityLayer = new ActivityLayer();
                            this.myLayer.addChild(activityLayer, 10);
                        }else{
                            var describe = StringFormat(INTERFACECFG[2].name + STRINGCFG[100045].string, INTERFACECFG[2].level);
                            ShowTipsTool.TipsFromText(describe, cc.color.RED, 30);
                        }
                        break;
                    case "btnArsenal"://兵工厂
                        if(GLOBALDATA.base.lev >= INTERFACECFG[6].level){
                            var arsenLayer = new ArsenLayer();
                            this.addChild(arsenLayer, 10);
                            //this.getParent().curModule.addChild(arsenLayer, 10);
                        }else{
                            var describe = StringFormat(INTERFACECFG[6].name + STRINGCFG[100045].string, INTERFACECFG[6].level);
                            ShowTipsTool.TipsFromText(describe, cc.color.RED, 30);
                        }
                        break;
                    case "warDuoButton"://资源掠夺
                        if(GLOBALDATA.base.lev >= INTERFACECFG[24].level){
                            var resourceLayer = new resourceFightLayer();
                            this.myLayer.addChild(resourceLayer,10);
                       }else{
                           var describe = StringFormat(INTERFACECFG[24].name + STRINGCFG[100045].string, INTERFACECFG[24].level);
                          ShowTipsTool.TipsFromText(describe, cc.color.RED, 30);
                       }
                        break;
                    case "bossWarButton":
                        if(GLOBALDATA.base.lev >= INTERFACECFG[26].level){
                            var bosslayer = new bossFightLayer();
                            this.myLayer.addChild(bosslayer,2);
                        }else{
                           var describe = StringFormat(INTERFACECFG[26].name + STRINGCFG[100045].string, INTERFACECFG[26].level);
                           ShowTipsTool.TipsFromText(describe, cc.color.RED, 30);
                        }

                        break;
                    case "btnArena"://竞技场
                        if(GLOBALDATA.base.lev >= INTERFACECFG[1].level){
                            var arena_layer = new arenaLayer();
                            this.addChild(arena_layer,10);
                        }else{
                            var describe = StringFormat(INTERFACECFG[1].name + STRINGCFG[100045].string, INTERFACECFG[1].level);
                            ShowTipsTool.TipsFromText(describe, cc.color.RED, 30);
                        }
                        break;

                    case"carButton"://座驾
                        if(GLOBALDATA.base.lev >= INTERFACECFG[28].level){
                            var _carLayer = new carLayer();
                            this.myLayer.addChild(_carLayer);
                        }else{
                            var describe = StringFormat(INTERFACECFG[28].name + STRINGCFG[100045].string, INTERFACECFG[28].level);
                            ShowTipsTool.TipsFromText(describe, cc.color.RED, 30);
                        }

                        break;

                    case "shopButton": //商店
                        var cityShopLayer = new CityShopLayer();
                        this.myLayer.addChild(cityShopLayer, 2);
                        break;
                    case "exploreButton": //探险
                        if(GLOBALDATA.base.lev >= INTERFACECFG[18].level){
                            var exploreLayer = new ExploreLayer();
                            this.myLayer.addChild(exploreLayer, 10);
                        }else{
                            var describe = StringFormat(INTERFACECFG[18].name + STRINGCFG[100045].string, INTERFACECFG[18].level);
                            ShowTipsTool.TipsFromText(describe, cc.color.RED, 30);
                        }

                        break;
                    case "btnLegion"://军团大厅
                        if(GLOBALDATA.base.lev >= INTERFACECFG[4].level){

                        }else{
                            var describe = StringFormat(INTERFACECFG[4].name + STRINGCFG[100045].string, INTERFACECFG[4].level);
                            ShowTipsTool.TipsFromText(describe, cc.color.RED, 30);
                        }
                        break;

                    case "btnGodWar":  //对战 军神争霸
                        if(GLOBALDATA.base.lev >= INTERFACECFG[3].level){
                            var bothFight_layer = new bothFightLayer();
                            this.myLayer.addChild(bothFight_layer,2);
                        }else{
                            var describe = StringFormat(INTERFACECFG[3].name + STRINGCFG[100045].string, INTERFACECFG[3].level);
                            ShowTipsTool.TipsFromText(describe, cc.color.RED, 30);
                        }
                        break;
                    case "btnStar":  //名将堂
                        if(GLOBALDATA.base.lev >= INTERFACECFG[5].level){
                            var starHerolayer = new starHeroLayer();
                            this.myLayer.addChild(starHerolayer,2);
                        }else{
                            var describe = StringFormat(INTERFACECFG[5].name + STRINGCFG[100045].string, INTERFACECFG[5].level);
                            ShowTipsTool.TipsFromText(describe, cc.color.RED, 30);
                        }
                        break;
                    case"equButton"://装备锻造
                        if(GLOBALDATA.base.lev >= INTERFACECFG[27].level){
                            var _equipForginLayer = new equipForginLayer();
                            this.myLayer.addChild(_equipForginLayer,2);
                        }else{
                            var describe = StringFormat(INTERFACECFG[27].name + STRINGCFG[100045].string, INTERFACECFG[27].level);
                            ShowTipsTool.TipsFromText(describe, cc.color.RED, 30);
                        }
                        break;

                    case"btnRanking"://王牌雕像
                        if(GLOBALDATA.base.lev >= INTERFACECFG[21].level){
                            var rankWar_layer = new rankWarLayer();
                            this.myLayer .addChild(rankWar_layer,2);
                        }else{
                            var describe = StringFormat(INTERFACECFG[21].name + STRINGCFG[100045].string, INTERFACECFG[21].level);
                            ShowTipsTool.TipsFromText(describe, cc.color.RED, 30);
                        }
                        break;
                    default:
                        ShowTipsTool.TipsFromText('敬请期待', cc.color.GREEN, 30);
                        break;

            }
        }
    },
    //处理红点
    dealRedPoint:function(data){
        var RedInfo = RedPoint.DealBasePanelJudge(data);
        //军神争霸
        if(RedInfo.both == 1){
            this.imageTips3.setVisible(true);
        }else if(RedInfo.both == 2){
            this.imageTips3.setVisible(false);
        }
        if(RedInfo.ziyuan==1){
            this.obj.wgt.taskImage1.setVisible(true);
        }else if(RedInfo.ziyuan==2){
            this.obj.wgt.taskImage1.setVisible(false);
        }
        if(RedInfo.boss_figth==1){
            this.obj.wgt.taskImageBoss.setVisible(true);
            this.obj.wgt.bossWarButton.setVisible(true);
        }else if(RedInfo.boss_figth==2){
            this.obj.wgt.taskImageBoss.setVisible(false);
            this.obj.wgt.bossWarButton.setVisible(false);
        }
        if(RedInfo.arena==1){
            this.obj.wgt.imageTips1.setVisible(true);
        }else if(RedInfo.arena==2){
            this.obj.wgt.imageTips1.setVisible(false);
        }
        //军事活动
        this.obj.wgt.imageTips2.setVisible(RedInfo.activity > 0);
        //兵工厂
        this.obj.wgt.imageTips6.setVisible(RedInfo.arsen > 0);
        //探险
        this.obj.wgt.TipsImageEx.setVisible(RedInfo.explore > 0);
    },

    onExit:function () {
        this._super();
    }
});