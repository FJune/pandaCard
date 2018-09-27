
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
var TipsLayer = ccui.Widget.extend({
    ctor:function () {
        this._super();
        this.LayerName = "TipsLayer";
        this.setOpacity(0);
        this._cb = null;
        this._cbTaraget = null;
        var self = this;
        this._showListener =  cc.EventListener.create({
            event: cc.EventListener.CUSTOM,
            eventName: "TipsLayer_show",
            callback: function(event){
                var data = event.getUserData();
                if(data){
                    self.show(data.string, data.callback, data.target, data.btntype);
                }
            }
        });
        cc.eventManager.addListener(this._showListener, 1);
        var size = cc.winSize;
        this.setContentSize(size);
        this.ignoreAnchorPointForPosition(false);//忽略锚点对位置的影响
        this.setTouchEnabled(true);
        this.setPosition(size.width/2,size.height/2);
    },

    onEnter:function () {
        this._super();
        this.initUI();
    },

    initUI:function(){
        this.obj = ccsTool.load(res.uiTipsLayer, [ "btnTipsOk", "btnTipsCanel", "btnTipsOkOlny", "textTipsDate", "ImageFastWar"]);
        this.addChild(this.obj.node, 1);
        this.obj.action.retain();


        this.obj.wgt.btnTipsOk.addTouchEventListener(this.onTouchEvent, this);
        this.obj.wgt.btnTipsCanel.addTouchEventListener(this.onTouchEvent, this);
        this.obj.wgt.btnTipsOkOlny.addTouchEventListener(this.onTouchEvent, this);

        this.setVisible(false);
    },

    show:function(msg, callback, target, btntype)
    {
        if(cc.isString(msg)){
            this.obj.wgt.textTipsDate.setString(msg);
        }

        if (cc.isFunction(callback)){
            this._cb = callback;
            this._cbTaraget = target
        }

        if (btntype == undefined) // 默认 确定 取消
        {
            this.obj.wgt.btnTipsOk.setVisible(true);
            this.obj.wgt.btnTipsCanel.setVisible(true);
            this.obj.wgt.btnTipsOkOlny.setVisible(false);
        }
        else if (btntype == 0) // 确定
        {
            this.obj.wgt.btnTipsOk.setVisible(false);
            this.obj.wgt.btnTipsCanel.setVisible(false);
            this.obj.wgt.btnTipsOkOlny.setVisible(true);
        }
        else if (btntype == 1) // 确定 取消
        {
            this.obj.wgt.btnTipsOk.setVisible(true);
            this.obj.wgt.btnTipsCanel.setVisible(true);
            this.obj.wgt.btnTipsOkOlny.setVisible(false);
        }

        this.obj.action.play("tipsAction", false);
        this.obj.wgt.ImageFastWar.stopAllActions();
        this.obj.wgt.ImageFastWar.runAction(this.obj.action);
        this.setVisible(true);
    },

    onTouchEvent:function(sender, type){
        if(ccui.Widget.TOUCH_ENDED == type){
            this.setVisible(false);
            var btnType = 0;
            switch(sender.name){
                case "btnTipsOk":
                    btnType = 1;
                    break;
                case "btnTipsCanel":
                     btnType = 2;
                    break;
                case "btnTipsOkOlny":
                    btnType = 0;
                    break;
            }

            //
            if(this._cb)
            {
                this._cb.call(this._cbTaraget, btnType);
                this._cb = null;
                this._cbTaraget = null;
            }
        }
    },

    onExit:function () {
        this._super();
        cc.eventManager.removeListener(this._showListener);
        this.obj.action.release();
    }
});