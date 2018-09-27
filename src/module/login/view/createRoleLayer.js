
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
var CreateRoleLayer = cmLayer.extend({
    sprite:null,
    LayerName:"CreateRoleLayer",
    ctor:function () {
        this._super();
        this.doAddEventListener();
    },
    doAddEventListener:function()
    {
        var self = this;
        this.creatRoleEvent = cc.EventListener.create({
            event: cc.EventListener.CUSTOM,
            eventName: "role.rename",
            callback: function(event){
                var data = event.getUserData();
                if(data.status==0)
                {
                    self.removeFromParent(true);
                }
                else
                {
                    ShowTipsTool.ErrorTipsFromStringById(data.status);
                }
            }
        });
        cc.eventManager.addListener(this.creatRoleEvent, 1);
    },
    initUI:function () {
        this.obj = ccsTool.load(res.uiCreateRoleLayer,[
            "Image_hero1", "Image_heroNow1", "Image_now1",
            "Image_hero2", "Image_heroNow2", "Image_now2",
            "Image_hero3", "Image_heroNow3", "Image_now3",
            "FileNode_login", 'Button_change','TextField_name',"B_ok"]);
        this.addChild(this.obj.node);

        this.obj.wgt.Image_hero1.addTouchEventListener(this.onTouchEvent, this);
        this.obj.wgt.Image_hero2.addTouchEventListener(this.onTouchEvent, this);
        this.obj.wgt.Image_hero3.addTouchEventListener(this.onTouchEvent, this);

        this.obj.wgt.Button_change.addTouchEventListener(this.onTouchEvent, this);
        this.obj.wgt.B_ok.addTouchEventListener(this.onTouchEvent, this);

        this.Image_hero = [null, this.obj.wgt.Image_hero1, this.obj.wgt.Image_hero2, this.obj.wgt.Image_hero3];
        this.Image_heroNow = [null, this.obj.wgt.Image_heroNow1, this.obj.wgt.Image_heroNow2, this.obj.wgt.Image_heroNow3];
        this.Image_now = [null, this.obj.wgt.Image_now1, this.obj.wgt.Image_now2, this.obj.wgt.Image_now3];

        this.obj.wgt.Image_hero1.setTouchEnabled(true);
        this.obj.wgt.Image_hero2.setTouchEnabled(true);
        this.obj.wgt.Image_hero3.setTouchEnabled(true);

        this.obj.wgt.Image_hero1.setColor(cc.color(77,77,77));
        this.obj.wgt.Image_hero2.setColor(cc.color(77,77,77));
        this.obj.wgt.Image_hero3.setColor(cc.color(77,77,77));

        this.obj.wgt.Image_heroNow1.setVisible(false);
        this.obj.wgt.Image_heroNow2.setVisible(false);
        this.obj.wgt.Image_heroNow3.setVisible(false);

        this.obj.wgt.Image_now1.setVisible(false);
        this.obj.wgt.Image_now2.setVisible(false);
        this.obj.wgt.Image_now3.setVisible(false);

        var act = ccs.load(res.effLogin_json).action;
        act.gotoFrameAndPlay(0, 55, true);
        this.obj.wgt.FileNode_login.runAction(act);

        this.obj.wgt.Image_hero1.setTouchEnabled(false);
        this.obj.wgt.Image_hero1.setColor(cc.color(255,255,255));
        this.obj.wgt.Image_heroNow1.setVisible(true);
        this.obj.wgt.Image_now1.setVisible(true);

        this.idx = 1;
        this.fillNickname();
    },

    onTouchEvent:function(sender, type)
    {
        if(ccui.Widget.TOUCH_ENDED == type)
        {
            switch(sender.name)
            {
                case "Image_hero1":
                    this.showModule(1);
                    break;

                case "Image_hero2":
                    this.showModule(2);
                    break;

                case "Image_hero3":
                    this.showModule(3);
                    break;
                case "Button_change":
                    this.fillNickname();
                    break;
                case "B_ok":
                    this.createRole();
                    break;
            }
        }
    },

    showModule:function(idx)
    {
        if (idx >= 1 && idx <= 3)
        {
            var Image_hero = this.Image_hero[idx];
            var Image_heroNow = this.Image_heroNow[idx];
            var Image_now = this.Image_now[idx];

            var _Image_hero = this.Image_hero[this.idx];
            var _Image_heroNow = this.Image_heroNow[this.idx];
            var _Image_now = this.Image_now[this.idx];

            Image_hero.setTouchEnabled(false);
            Image_hero.setColor(cc.color(255,255,255));
            _Image_hero.setTouchEnabled(true);
            _Image_hero.setColor(cc.color(77,77,77));

            Image_heroNow.setVisible(true);
            _Image_heroNow.setVisible(false);

            Image_now.setVisible(true);
            _Image_now.setVisible(false);

            this.idx = idx;
        }
    },

    fillNickname:function()
    {
        this.obj.wgt.TextField_name.setString(this.getNickname());
    },

    getNickname:function()
    {
        var first = Math.floor(Math.random()*100) + 1;
        var second = Math.floor(Math.random()*100) + 1;

        return ((this.idx == 1) ? RANDOMNAMECFG[second].nanname : RANDOMNAMECFG[second].nvname) + "·" + RANDOMNAMECFG[first].familyname;
    },

    createRole:function()
    {
        var nickname = this.obj.wgt.TextField_name.getString();

        Network.getInstance().send({task:'role.rename', name:nickname, id:this.idx});
    },

    onExit:function () {
        this._super();
        cc.eventManager.removeListener(this.creatRoleEvent);
    }
});