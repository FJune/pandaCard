
/**
 ** @Author:pandayu
 ** @Version:1.0
 ** @DateTime:2018-09-09
 ** @Project:pandaCard CardGame
 ** @Contact: QQ:815099602
 **/
var loginLayer = cmLayer.extend({
    sprite:null,
    LayerName:"loginLayer",
    ctor:function () {
        this._super();
        return true;
    },

    initUI:function () {
        this.ccsLogin = ccsTool.load(res.login_json,['btnLogin','userName','errorTip','loadProgress']);
        this.addChild(this.ccsLogin.node);
        this.ccsLogin.wgt.btnLogin.addTouchEventListener(this.login, this);
    },

    login:function(sender, type){
        if(ccui.Widget.TOUCH_ENDED==type){
            var account = this.ccsLogin.wgt.userName.getString();
            if(account == ''){
                ShowTipsTool.TipsFromText("输入账号", cc.color.RED, 30);
            }else {
                var self = this;
                var url = USERSERVERURL + "?type=self&acc=" + account + "&pw=123456";
                Network.getInstance().httpGet(url, function(data){
                    if (data.status == 0)
                    {
                        var event = new cc.EventCustom("gate.login");
                        event.setUserData(data);
                        cc.eventManager.dispatchEvent(event);

                        self.removeFromParent(true);
                    }
                    else
                    {
                        ShowTipsTool.TipsFromText("登录失败", cc.color.RED, 30);
                    }
                });
            }
        }
    },
    onExit:function () {
        this._super();
    }
});