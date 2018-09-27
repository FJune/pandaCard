
/**
 ** @Author:pandayu
 ** @Version:1.0
 ** @DateTime:2018-09-09
 ** @Project:pandaCard CardGame
 ** @Contact: QQ:815099602
 **/
 /**
 * for combat
 */
var ManagerLayer = cc.LayerColor.extend({
    ctor:function () {
        //////////////////////////////
        // 1. super init first
        this._super();
        this.LayerName = "ManagerLayer";
        this.curTab = 0;
//        //公共底部导航
//        this.uiAttributeLayer = ccs.load(res.uiAttributeLayer).node;//主页面顶部财富层加载
//        this.uiAttributeLayer.setAnchorPoint(0,1);
//        this.uiAttributeLayer.setPosition(0,cc.winSize.height);
//        this.addChild(this.uiAttributeLayer,1);

        //载入主页面底部按钮集合层
        var root = ccs.load(res.ui_navBottom);
        nav = root.node;
        this.addChild(nav,2);

        this.curModule = null;
        this.fightButton = ccui.helper.seekWidgetByName(nav, "fightButton");//战斗按钮
        this.fightButton.addTouchEventListener(this.onTouchEvent,this);

        this.baseButton = ccui.helper.seekWidgetByName(nav, "baseButton");//基地按钮
        this.baseButton.addTouchEventListener(this.onTouchEvent,this);

        this.armyButton = ccui.helper.seekWidgetByName(nav, "armyButton");//部队按钮
        this.armyButton.addTouchEventListener(this.onTouchEvent,this);

        this.barracksButton = ccui.helper.seekWidgetByName(nav, "barracksButton");//兵营按钮
        this.barracksButton.addTouchEventListener(this.onTouchEvent,this);

        this.bagButton = ccui.helper.seekWidgetByName(nav, "bagButton");//背包按钮
        this.bagButton.addTouchEventListener(this.onTouchEvent,this);

        this.Image_bag = ccui.helper.seekWidgetByName(nav,"Image_bag"); //背包上的按钮
        this.soldiersButton = ccui.helper.seekWidgetByName(nav,"soldiersButton");  //背包里面的士兵
        this.soldiersButton.addTouchEventListener(this.bagShowEvent,this);
        this.equButton =  ccui.helper.seekWidgetByName(nav,"equButton");  //背包里面的装备
        this.equButton.addTouchEventListener(this.bagShowEvent,this);
        this.accessoryButton =  ccui.helper.seekWidgetByName(nav,"accessoryButton");  //背包里面的配饰
        this.accessoryButton.addTouchEventListener(this.bagShowEvent,this);
        this.itemButton =  ccui.helper.seekWidgetByName(nav,"itemButton");  //背包里面的道具
        this.itemButton.addTouchEventListener(this.bagShowEvent,this);

        this.recoverButton = ccui.helper.seekWidgetByName(nav, "recoverButton");//回收按钮
        this.recoverButton.addTouchEventListener(this.onTouchEvent,this);

        //红点
        this.tipsImageArmy1 = ccui.helper.seekWidgetByName(nav, "tipsImageArmy1");  //基地上面的红点
        this.tipsImageArmy2 = ccui.helper.seekWidgetByName(nav, "tipsImageArmy2");  //士兵上面的红点
        this.tipsImageArmy3 = ccui.helper.seekWidgetByName(nav, "tipsImageArmy3");  //兵营上面的红点
        this.tipsImageArmy4 = ccui.helper.seekWidgetByName(nav, "tipsImageArmy4");  //背包上面的红点
        this.tipsImageArmy5 = ccui.helper.seekWidgetByName(nav, "tipsImageArmy5");  //回收上面的红点

        this.tipsImageS1 = ccui.helper.seekWidgetByName(nav, "tipsImageS1");  //背包点击二级框士兵红点
        this.tipsImageS2 = ccui.helper.seekWidgetByName(nav, "tipsImageS2");  //背包点击二级框装备红点
        this.tipsImageS3 = ccui.helper.seekWidgetByName(nav, "tipsImageS3");  //背包点击二级框饰品红点
        this.tipsImageS4 = ccui.helper.seekWidgetByName(nav, "tipsImageS4");  //背包点击二级框道具红点
        //按钮数组
        this.btnTabs = [this.fightButton,this.baseButton,this.armyButton,this.barracksButton,this.bagButton,this.recoverButton];

        // this.lyCombat = new combatLayer(3,'1000000','pvp',{
        //     id:112,
        //     name:'dd',
        //     commanders:GLOBALDATA.commanders,
        //     soldiers:GLOBALDATA.soldiers,
        //     depot:GLOBALDATA.depot,
        //     army:GLOBALDATA.army
        // });
        this.lyCombat = new combatLayer();
        // this.lyCombat = new combatLayer(2,'100009','shilian');
        this.addChild(this.lyCombat,1);


        this.thirdLayer = new cc.Node();
        this.addChild(this.thirdLayer, 3);

        var barrageItem = new itemBarrageLayer();
        this.addChild(barrageItem, 999);

        this.tipsLayer = new TipsLayer();
        this.addChild(this.tipsLayer, 998);

        var layerItemGet = new itemGetLayer();
        this.addChild(layerItemGet, 999);

        this.doAddEventListener();

        this.lyCombat.myLayer = this.thirdLayer;
        this.changeModule("fightButton");

        this.dealRedPoint();  //处理红点

        //定时汇报战力值
        this.schedule(this.countdown, 3600, cc.REPEAT_FOREVER);

        this.countdown();

        return true;
    },

    doAddEventListener:function(){
        var self = this;
        //导航按钮事件，跳转用
        this.nav_changeModule = cc.EventListener.create({
            event: cc.EventListener.CUSTOM,
            eventName: "nav#changeModule",
            callback: function(event){
                self.changeModule(event.getUserData());
            }});

        cc.eventManager.addListener(this.nav_changeModule, 1);
        //新手引导的事件
        this.newGuideEvent = cc.EventListener.create({
            event: cc.EventListener.CUSTOM,
            eventName: "newGuide",
            callback: function(event){
                var userData = event.getUserData();
                if(userData.LayerName == self.LayerName){
                    var node = seekNodeByName(self,userData.wigName);
                    dealNodeTouchEvent(node);
                }
            }
        });
        cc.eventManager.addListener(this.newGuideEvent, this);
        //移除上层的其它界面
        this.removeOtherEvent = cc.EventListener.create({
            event: cc.EventListener.CUSTOM,
            eventName: "remove.Other",
            callback: function(event){
                self.changeModule("fightButton");
                self.tipsLayer.setVisible(false);  //提示层
                /*if(self.curModule){
                    self.curModule.removeFromParent(true);
                    self.curModule = null;
                }
                self.thirdLayer.removeAllChildren(true);*/
            }
        });
        cc.eventManager.addListener(this.removeOtherEvent, this);
        //处理dataupdate
        this.dataUpdateEvent = cc.EventListener.create({
            event:cc.EventListener.CUSTOM,
            eventName:"data.update",
            callback:function (event) {
                var resData = event.getUserData();
                if(resData.status == 0){
                    if(self.dealRedPoint && typeof(self.dealRedPoint)=="function") {
                        self.dealRedPoint(resData.data);
                    }
                }
            }
        });
        cc.eventManager.addListener(this.dataUpdateEvent,this);
    },

    onEnter:function () {
        this._super();
        this.dealNewGuid();

    },

    onTouchEvent:function(sender, type){
        if(ccui.Widget.TOUCH_ENDED == type){
            this.changeModule(sender.name);
        }
    },

    changeModule:function(sendername){
        if(this.curModule && sendername != 'bagButton'){
                this.curModule.removeFromParent(true);
                this.curModule = null;
        }
        this.thirdLayer.removeAllChildren(true);
        switch (sendername) {
            case 'fightButton'://战斗按钮
                this.changeTabStatus(0);
                var skillUpdate = new cc.EventCustom('skillUpdate');
                skillUpdate.setUserData();
                cc.eventManager.dispatchEvent(skillUpdate);
                break;
            case 'baseButton'://基地按钮
                this.changeTabStatus(1);

                this.curModule = new CityLayer();
                this.curModule.myLayer = this.thirdLayer ;
                this.addChild(this.curModule,1);
                break;
            case 'armyButton'://部队按钮
                if(GLOBALDATA.base.lev>= INTERFACECFG[10].level){
                    this.changeTabStatus(2);
                    this.curModule = new armyLayer();
                    this.curModule.myLayer = this.thirdLayer ;
                    this.addChild(this.curModule,1);
                }else{
                    var describe = StringFormat(INTERFACECFG[10].name + STRINGCFG[100045].string, INTERFACECFG[10].level);
                    ShowTipsTool.TipsFromText(describe, cc.color.RED, 30);
                }
                break;
            case 'barracksButton'://兵营按钮
                if(GLOBALDATA.base.lev >= INTERFACECFG[13].level){
                    this.changeTabStatus(3);
                    this.curModule = new RecruitLayer();
                    this.curModule.myLayer = this.thirdLayer ;
                    this.addChild(this.curModule,1);
                }else{
                    var describe = StringFormat(INTERFACECFG[13].name + STRINGCFG[100045].string, INTERFACECFG[13].level);
                    ShowTipsTool.TipsFromText(describe, cc.color.RED, 30);
                }

                break;
            case 'bagButton': //背包按钮
                this.changeTabStatus(4);
                this.Image_bag.setVisible(true);
                break;
            case 'recoverButton'://回收按钮
                if(GLOBALDATA.base.lev >= INTERFACECFG[15].level){
                    this.changeTabStatus(5);

                    this.curModule = new recoverLayer();
                    this.curModule.myLayer = this.thirdLayer ;
                    this.addChild(this.curModule,1);
                }else{
                    var describe = StringFormat(INTERFACECFG[15].name + STRINGCFG[100045].string, INTERFACECFG[15].level);
                    ShowTipsTool.TipsFromText(describe, cc.color.RED, 30);
                }

                break;
            default:
                break;
        }
    },
    //显示背包的内容
    bagShowEvent:function (sender, type) {
        if(ccui.Widget.TOUCH_ENDED == type){
            if(this.curModule){
                this.curModule.removeFromParent(true);
                this.curModule = null;
            }
            this.Image_bag.setVisible(false);
            this.bagButton.setTouchEnabled(true);
            var index = 1;
            switch (sender.name) {
                case 'soldiersButton'://士兵背包
                    index = 1;
                    break;
                case 'equButton':  //装备背包
                    index = 2;
                    break;
                case 'accessoryButton':  //配饰背包
                    index = 3;
                    break;
                case 'itemButton':  //道具背包
                    index = 4;
                    break;
                default:
                    break;
            }
            this.curModule = new bagLayer(index);
            this.curModule.myLayer = this.thirdLayer ;
            this.addChild(this.curModule,1);
        }
    },
    changeTabStatus:function (idx) {
        if(idx == this.curTab){
            return;
        }
        if(idx != 4){ //4 为背包
            this.Image_bag.setVisible(false);
        }
        this.btnTabs[this.curTab].setTouchEnabled(true);
        this.btnTabs[this.curTab].setBright(true);

        this.btnTabs[idx].setTouchEnabled(false);
        this.btnTabs[idx].setBright(false);

        this.curTab = idx;
    },
    //处理新手引导
    dealNewGuid:function(){
        if(newGuideModel.isRunNewGuide() && newGuideModel.getRunState() == false){  //正在进行新手引导
            var temp = {};
            temp.ttype = 1;
            temp.id = newGuideModel.getGuideId();
            newGuideModel.addNewGuideLayer(this,998,temp);
        }
    },

    //处理红点
    dealRedPoint:function(data){
        var RedPointInfo = RedPoint.DealMainJudge(data);

        //基地
        if(RedPointInfo.base == 1){
            this.tipsImageArmy1.setVisible(true);
        }else if(RedPointInfo.base == 2){
            this.tipsImageArmy1.setVisible(false);
        }

        //士兵
        if(RedPointInfo.army == 1){
            this.tipsImageArmy2.setVisible(true);
        }else if(RedPointInfo.army == 2){
            this.tipsImageArmy2.setVisible(false);
        }
        //兵营
        this.tipsImageArmy3.setVisible(RedPointInfo.recruit > 0);
        //回收
        if(RedPointInfo.recover==1){
            this.tipsImageArmy5.setVisible(true);
        }else if(RedPointInfo.recover==2){
            this.tipsImageArmy5.setVisible(false);
        }
        //背包
        if(RedPointInfo.bag!=null){
            if(RedPointInfo.bag.h==true){
                this.tipsImageArmy4.setVisible(true);
            }else{
                this.tipsImageArmy4.setVisible(false);
            }
            if(RedPointInfo.bag.s==true){
                this.tipsImageS1.setVisible(true);
            }else{
                this.tipsImageS1.setVisible(false);
            }
            if(RedPointInfo.bag.e==true){
                this.tipsImageS2.setVisible(true);
            }else{
                this.tipsImageS2.setVisible(false);
            }
            if(RedPointInfo.bag.p==true){
                this.tipsImageS4.setVisible(true);
            }else{
                this.tipsImageS4.setVisible(false);
            }
            if(RedPointInfo.bag.d==true){
                this.tipsImageS3.setVisible(true);
            }else{
                this.tipsImageS3.setVisible(false);
            }
        }

    },

    countdown:function(){
        Network.getInstance().send({task:"other.fight", num:getCommanderPower()});
    },

    onExit:function () {
        this._super();
        cc.eventManager.removeListener(this.nav_changeModule);
        cc.eventManager.removeListener(this.newGuideEvent);
        cc.eventManager.removeListener(this.removeOtherEvent);
        cc.eventManager.removeListener(this.dataUpdateEvent);
    }
});