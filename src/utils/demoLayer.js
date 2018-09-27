
/**
 ** @Author:pandayu
 ** @Version:1.0
 ** @DateTime:2018-09-09
 ** @Project:pandaCard CardGame
 ** @Contact: QQ:815099602
 **/
 /**
 * 配饰更换层的创建
 */
var demoLayer = baseLayer.extend({
    ctor:function(var1,var2){
        this._super();
        this.var1 = var1;
        this.var2 = var2;
    },
    onEnter:function(){
        this._super();
        this.initData();
        this.initUI();
        this.initCustomEvent();
        this.updateUI();
    },
    //初始化需要的数据,纯数据处理，只初始化，不更新
    initData:function () {

    },
    //初始化UI,引入cocosstudio导出的文件，纯ui加载和组件获取，不更新
    initUI:function () {
        this.ccsLogin = ccsTool.load(resLogin.login_json,['btnLogin','userName','errorTip','loadProgress']);
        this.addChild(this.ccsLogin.node);
        this.ccsLogin.wgt.btnLogin.addTouchEventListener(this.login, this);
        //使用this.uiNode.Panel_pause获取Panel_pause对象
        //使用this.uiNode.Panel_enter.Button_enter获取Panel_enter.Button_enter对象
    },
    login:function(sender, type){
        if(ccui.Widget.TOUCH_ENDED==type){
            var account = this.ccsLogin.wgt.userName.getString();
            if(account == ''){
                this.ccsLogin.wgt.errorTip.setVisible(true);
            }else {
                loginModel.login(account);
            }
        }
    },
    //把数据和UI结合起来，更新游戏界面的可视数据
    updateUI:function () {

    },
    //创建自定义事件监听器
    initCustomEvent:function () {
        // var self = this;
        // this.customevent = cc.EventListener.create({
        //     event: cc.EventListener.CUSTOM,
        //     eventName: "depot.strengthen",
        //     callback: function(event){
        //         var resData = event.getUserData();
        //         if(resData.status!=0){//失败
        //
        //         }else {//成功
        //              self.updateUI();
        //         }
        //     }
        // });
        // cc.eventManager.addListener(this.customevent, 1);
    },
    onExit:function(){
        this._super();
        // cc.eventManager.removeListener(this.customevent);
    }
});