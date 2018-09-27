
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
var baseLayer = cmLayer.extend({

    ctor:function () {
        //////////////////////////////
        // 1. super init first
        this._super();
        // //公共顶部导航
        this.uiAttributeLayer = ccs.load(res.uiAttributeLayer).node;
        this.uiAttributeLayer.setAnchorPoint(0,1);
        this.uiAttributeLayer.setPosition(0,cc.winSize.height);
        this.addChild(this.uiAttributeLayer,5);

        this.rankValue = ccui.helper.seekWidgetByName(this.uiAttributeLayer, "rankText");
        this.goldValue = ccui.helper.seekWidgetByName(this.uiAttributeLayer, "goldValue");
        this.diaValue = ccui.helper.seekWidgetByName(this.uiAttributeLayer, "diaText");
        this.mitValue = ccui.helper.seekWidgetByName(this.uiAttributeLayer, "mitValue");
        //金币兑换按钮
        this.goldButton = ccui.helper.seekWidgetByName(this.uiAttributeLayer, "goldButton");
        this.goldButton.addTouchEventListener(this.changeGoldEvent, this);

        this.updateTop();
        return true;
    },
    onEnter:function () {
        this._super();
        this._listener = cc.EventListener.create({
            event:cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches:true,
            onTouchBegan:function(){
                return true;
            }
        });
        cc.eventManager.addListener(this._listener, this);
        //更新顶部信息
        var self = this;
        this.evnUpdateTop = cc.EventListener.create({
            event: cc.EventListener.CUSTOM,
            eventName: "updatetop",
            callback: function(event){
                self.updateTop();
            }
        });
        cc.eventManager.addListener(this.evnUpdateTop, 1);
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
    },
    updateTop:function() {
        this.rankValue.setString(GLOBALDATA.base.lev);  //等级
        this.goldValue.setString(Helper.formatNum(GLOBALDATA.base.money)); //金币
        this.diaValue.setString(GLOBALDATA.base.diamond); //钻石
        this.mitValue.setString( getCommanderPower() );
    },
    //金币兑换的按钮
    changeGoldEvent:function (sender, type) {
        if(ccui.Widget.TOUCH_ENDED==type) {
            var _buyGoldLayer = new buyGoldLayer();
            this.getParent().addChild(_buyGoldLayer,10);
        }
    },
    onExit:function () {
        this._super();
        cc.eventManager.removeListener(this._listener);
        cc.eventManager.removeListener(this.evnUpdateTop);
        cc.eventManager.removeListener(this.newGuideEvent);
    }
});

var ModalDialog = cmLayer.extend({
    _listener:null,
    ctor:function(disapear){
        this._super();
        this.size = cc.winSize;
        this.ignoreAnchorPointForPosition(false);//忽略锚点对位置的影响
        this.setPosition(this.size.width/2,this.size.height/2);
        //初始化对话框
         this._initDialog();

         return true;
    },
    _initDialog:function () {
        this.container = new cc.Layer();
        this.container.ignoreAnchorPointForPosition(false);
        this.container.setPosition(this.size.width/2,this.size.height/2);
        var layerColor = new cc.LayerColor(cc.color(0,0,0));
        layerColor.setOpacity(150);
        layerColor.setContentSize(this.size);
        this.addChild(layerColor);
        this.addChild(this.container,2);
    },
    onEnter:function(){
        this._super();
        var self = this;
        this._listener = cc.EventListener.create({
            event:cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches:true,
            onTouchBegan:function(){
                return true;
            },
            onTouchMoved: function (touch, event) {
            },
            onTouchEnded: function (touch, event) {
                self.hide();
            }
        });
        cc.eventManager.addListener(this._listener, this);

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
    },
    //移除层
    hide:function () {
        this.removeFromParent(true);
    },
    //添加层
    addObj:function (obj) {
        this.container.addChild(obj);
    },
    onExit:function(){
        this._super();
        //移除触摸监听

        cc.eventManager.removeListener(this.newGuideEvent);
        cc.eventManager.removeListener(this._listener);
    }
});