
/**
 ** @Author:pandayu
 ** @Version:1.0
 ** @DateTime:2018-09-09
 ** @Project:pandaCard CardGame
 ** @Contact: QQ:815099602
 **/
 var loseLayer = ModalDialog.extend({
    LayerName:"loseLayer",
    ctor:function(){
        this._super();
    },

    onEnter:function(){
        // this.initUI();
        var self = this;
        this._listener = {
            event:cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches:true,
            onTouchBegan:function(){
                return true;
            },
            onTouchMoved: function (touch, event) {
            },
            onTouchEnded: function (touch, event) {
                var event = new cc.EventCustom('closeDefeatLayer');
                event.setUserData('backButton');
                cc.eventManager.dispatchEvent(event);
                self.hide();
            }
        };
        cc.eventManager.addListener(this._listener, this);
        // 弹框自动消失
        // this.scheduleOnce(function () {
        //     this.hide();
        // }, 5);
        this._super();
    },

    initUI:function(){
        var self = this;

        var loseCCS = ccs.load(res.uiloseLayer);
        var loseNode = loseCCS.node;
        var loseAction = loseCCS.action;
        this.addObj(loseNode);
        loseNode.runAction(loseAction);
        loseAction.gotoFrameAndPlay(0, false);

        var comanderButton = ccui.helper.seekWidgetByName(loseNode, "comanderButton");
        comanderButton.addTouchEventListener(this.onTouchEvent, this);
        var heroButton = ccui.helper.seekWidgetByName(loseNode, "heroButton");
        heroButton.addTouchEventListener(this.onTouchEvent, this);
        var equButton = ccui.helper.seekWidgetByName(loseNode, "equButton");
        equButton.addTouchEventListener(this.onTouchEvent, this);
        var backButton = ccui.helper.seekWidgetByName(loseNode, "backButton");
        backButton.addTouchEventListener(this.onTouchEvent, this);
    },

    onExit:function () {
        this._super();
        cc.eventManager.removeListener(this._listener);
    },

    onTouchEvent: function (sender, type) {
        if(ccui.Widget.TOUCH_ENDED == type){
            var btnType = 'backButton';
            switch (sender.name) {
                case 'backButton':
                    btnType = 'backButton';
                    break;
                case 'comanderButton':
                    btnType = 'comanderButton';
                    break;
                case 'heroButton':
                    btnType = 'heroButton';
                    break;
                case 'equButton':
                    btnType = 'equButton';
                    break;
                default:
                    btnType = 'backButton';
                    break;
            }
            this.hide();
            var event = new cc.EventCustom('closeDefeatLayer');
            event.setUserData(btnType);
            cc.eventManager.dispatchEvent(event);

        }
    }
});