
/**
 ** @Author:pandayu
 ** @Version:1.0
 ** @DateTime:2018-09-09
 ** @Project:pandaCard CardGame
 ** @Contact: QQ:815099602
 **/
 /**
 * 终身卡礼包层的创建
 */
var welfareZZKLayer = ModalDialog.extend({
    LayerName:"welfareZZKLayer",
    ctor:function(){
        this._super();
    },

    onEnter:function(){
        this._super();
    },
    //初始化ui
    initUI:function(){
        this.customWidget(); //自定义Widget
        this.initCustomEvent();
        this.showPanel();
    },
    //自定义Widget
    customWidget:function () {
        var uiWelfareZZK = ccsTool.load(res.uiWelfareZZKLayer,["btnBack","B_buy"]);
        //控件的名字赋值给this变量
        for(var key in uiWelfareZZK.wgt){
            this[key] = uiWelfareZZK.wgt[key];
        }
        this.addChild(uiWelfareZZK.node, 2);

        this.btnBack.addTouchEventListener(this.onTouchEvent, this);  //返回按钮
        this.B_buy.addTouchEventListener(this.gotoRechargeEvent, this);  //前往充值的按钮
    },
    initCustomEvent:function(){
        var self = this;
    },
    //显示界面的信息
    showPanel:function(){

    },
    onTouchEvent:function(sender, type){
        if(ccui.Widget.TOUCH_ENDED == type){
            switch(sender.name) {
                case "btnBack":
                    this.removeFromParent(true);
                    break;
            }
        }
    },
    //前往充值的按钮
    gotoRechargeEvent:function(sender, type){
        if(ccui.Widget.TOUCH_ENDED == type){
            //前往充值的功能 后期添加
        }
    },
    onExit:function () {
        this._super();
    }
});