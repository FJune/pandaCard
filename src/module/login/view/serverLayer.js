
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
var ServerLayer = cmLayer.extend({
    LayerName:"ServerLayer",
    ctor:function ()
    {
        this._super();
        this.doAddEventListener();

        this.server = null;
        this.svrlist = [];
        this.historylist = [];

        // 游戏公告
        var layer = new sevGuideLayer();
        this.addChild(layer, 100);

        if(!cc.sys.isNative)
        {
            var WUrl=unescape(window.location.href);
            var args=WUrl.split("?");
            var key = args[1];

            if (key)
            {
                return this.onLoginResponse(key);
            }
        }

        var layer = new loginLayer();
        this.addChild(layer, 1000);
    },

    doAddEventListener:function()
    {
        var self = this;

        this.gate_login = cc.EventListener.create({
            event: cc.EventListener.CUSTOM,
            eventName: "gate.login",
            callback: function(event){
                var data = event.getUserData();
                if (data.key)
                {
                    self.onLoginResponse(data.key);
                }
            }
        });
        cc.eventManager.addListener(this.gate_login, 1);

        this.loginEvent = cc.EventListener.create({
            event: cc.EventListener.CUSTOM,
            eventName: "login",
            callback: function(event){
                var data = event.getUserData();
                if(data.status==0)
                {
                    if(data.bcreate != 0)  //已创角
                    {
                        self.enterGame(data);
                    }
                    else  //未创角
                    {
                        var layer = new CreateRoleLayer();
                        self.addChild(layer);
                    }
                }
                else
                {
                    ShowTipsTool.ErrorTipsFromStringById(data.status);
                }
            }
        });
        cc.eventManager.addListener(this.loginEvent, 1);

        this.creatRoleEvent = cc.EventListener.create({
            event: cc.EventListener.CUSTOM,
            eventName: "role.rename",
            callback: function(event){
                var data = event.getUserData();
                if(data.status==0)
                {
                    self.enterGame(data);
                }
            }
        });
        cc.eventManager.addListener(this.creatRoleEvent, 1);
    },
    initUI:function ()
    {
        this.obj = ccsTool.load(res.uiServerLayer,[ 'Node_sever', 'btnLogin', 'Text_sevName',  "Text_stop", "Text_new", "Text_hot", 'Image_sevChange'
            , 'Image_sev', 'Text_sevNow', "Text_stopn", "Text_newn", "Text_hotn", 'ListView_sev', 'Button_now', 'Button_ago',
            , 'Node_loading', "loadProgress",
            ]);
        this.addChild(this.obj.node);

        this.obj.wgt.btnLogin.addTouchEventListener(this.onTouchEvent, this);
        this.obj.wgt.Image_sevChange.addTouchEventListener(this.onTouchEvent, this);
        this.obj.wgt.Image_sev.addTouchEventListener(this.onTouchEvent, this);

        this.obj.wgt.Button_now.addTouchEventListener(this.onTouchEvent, this);
        this.obj.wgt.Button_ago.addTouchEventListener(this.onTouchEvent, this);

        this.obj.wgt.Node_sever.setVisible(true);
        this.obj.wgt.Image_sev.setVisible(false);
        this.obj.wgt.Node_loading.setVisible(false);

        this.updateSelectServer();
    },

    onLoginResponse:function(key){
        var token = CryptoJS.enc.Utf8.parse(AES_KEY);
        var iv = CryptoJS.enc.Utf8.parse(AES_IV);
        var bytes = CryptoJS.AES.decrypt(key, token, {
            iv: iv,
            mode: CryptoJS.mode.CBC,
            padding: CryptoJS.pad.Pkcs7
        });
        var plaintext = bytes.toString(CryptoJS.enc.Utf8);
        cc.log("onLoginResponse",plaintext)
        var result = plaintext.split("_");
        if (result.length > 0)
        {
            this.cid = parseInt(result[0]);
            this.svrTime = parseInt(result[1]);
            this.loginTime = Date.parse(new Date());
            this.bEncrypt = true;

            // 获取服务器列表
            this.getServerList();
            this.getHistory();
        }
    },

    onTouchEvent:function(sender, type)
    {
        if(ccui.Widget.TOUCH_ENDED == type)
        {
            switch(sender.name)
            {
                case "btnLogin":  //进入游戏
                    this.chooseServer();
                    break;
                case "Image_sevChange": //切换服务器
                    this.showServerList(false);
                    break
                case "Image_sev":
                    this.obj.wgt.Image_sev.setVisible(false);
                    break;
                case "Button_now":
                    this.showServerList(false);
                    break;
                case "Button_ago":
                    this.showServerList(true);
                    break;
            }
        }
    },

    updateSelectServer:function(){
        if (this.svrlist.length > 0)
        {
            if (this.historylist.length > 0 )
            {
                for ( var idx = this.svrlist.length - 1; idx >= 0; idx--)
                {
                    var server = this.svrlist[idx];
                    if (server.id == this.historylist[0])
                    {
                        this.showSelectServer(idx);
                        break;
                    }
                }
            }
            else
            {
                this.showSelectServer(this.svrlist.length - 1);
            }
        }
    },

    showSelectServer:function(idx)
    {
        var svrlist = this.svrlist;
        var server = svrlist[idx];

        this.obj.wgt.Text_stop.setVisible(server.state == 0); //维护
        this.obj.wgt.Text_new.setVisible(server.state == 1);    //新
        this.obj.wgt.Text_hot.setVisible(server.state == 2);    //热

        this.obj.wgt.Text_sevName.setString(server.server + " " + server.name);

        this.idx = idx;
        this.server = server;
    },

    showServerList:function(isHistory)
    {
        var in_array = function(search,array){
            for(var i in array){
                if(array[i]==search){
                    return true;
                }
            }
            return false;
        };

        var svrlist = this.svrlist;

        var historylist = this.historylist;
        this.obj.wgt.Button_now.setTouchEnabled(isHistory);
        this.obj.wgt.Button_now.setHighlighted(!isHistory);

        this.obj.wgt.Button_ago.setTouchEnabled(!isHistory);
        this.obj.wgt.Button_ago.setHighlighted(isHistory);

        this.obj.wgt.Image_sev.setVisible(true);
        this.obj.wgt.ListView_sev.removeAllChildren();

        var itemRank = [];
        var index = -1;
        var i = 0;
        for ( var idx = svrlist.length - 1; idx >= 0; idx--)
        {
            var server = svrlist[idx];

            if (idx == this.idx)
            {
                this.obj.wgt.Text_stopn.setVisible(server.state == 0); //维护

                this.obj.wgt.Text_newn.setVisible(server.state == 1); //新

                this.obj.wgt.Text_hotn.setVisible(server.state == 2); //热

                this.obj.wgt.Text_sevNow.setString(server.server + " " + server.name);
            }

            if (!isHistory || (isHistory  && in_array(server.id, historylist)))
            {
                var itemObj = ccsTool.load(res.uiServerItem, ["bagItem","Text_sevItem", "Text_stops", "Text_news", "Text_hots"]);
                itemObj.wgt.Text_stops.setVisible(false);
                itemObj.wgt.Text_news.setVisible(false);
                itemObj.wgt.Text_hots.setVisible(false);

                if (server.state ==  0) //维护
                {
                    itemObj.wgt.Text_stops.setVisible(true);
                }
                else if (server.state == 1) //新
                {
                    itemObj.wgt.Text_news.setVisible(true);
                }
                else if (server.state == 2) //热
                {
                    itemObj.wgt.Text_hots.setVisible(true);
                }

                itemObj.wgt.Text_sevItem.setString(server.server + " " + server.name);

                var bagItem = itemObj.wgt.bagItem;
                var mod = i % 2;

                bagItem.setPositionX(bagItem.getContentSize().width * mod);
                bagItem.setTag(idx);
                bagItem.addTouchEventListener(this.onItemTouchEvent, this);

                if (mod == 0)
                {
                    index++;
                    itemRank[index] = new ccui.Widget();
                    itemRank[index].setContentSize(this.obj.wgt.ListView_sev.getContentSize().width, bagItem.getContentSize().height);
                    itemRank[index].setAnchorPoint(0,0);
                    this.obj.wgt.ListView_sev.pushBackCustomItem(itemRank[index]);
                }

                bagItem.removeFromParent(false);
                itemRank[index].addChild(bagItem);
                i++;
            }
        }
    },

    onItemTouchEvent:function(sender, type)
    {
        if(ccui.Widget.TOUCH_ENDED == type)
        {
            this.obj.wgt.Image_sev.setVisible(false);

            var idx = sender.getTag();
            this.showSelectServer(idx);
        }
    },

    getServerList:function(){
        var self = this;
        var xhr = new XMLHttpRequest();
        var url = USERSERVERURL + "?type=get_svrlist";

        Network.getInstance().httpGet(url, function(data){
            if (data.s_serverIp)
            {
                self.svrlist =  data.s_serverIp

                if (self.idx == null)
                {
                    if (self.obj && self.obj.wgt)
                    {
                        self.updateSelectServer();
                    }
                }
            }
        });
    },

    getHistory:function()
    {
        var self = this;
        var url = USERSERVERURL + "?type=get_svr_history&cn=self&cid=" + this.cid;
        Network.getInstance().httpGet(url, function(data){
            if (data.history && cc.isArray(data.history))
            {
                self.historylist = data.history;

                if (self.obj && self.obj.wgt)
                {
                    self.updateSelectServer();
                }
            }
        });
    },

    chooseServer:function()
    {
        if (this.server && this.server.state != 0)
        {
            var self = this;

            this.obj.wgt.btnLogin.setTouchEnabled(false);
            this.obj.wgt.Image_sevChange.setTouchEnabled(false);

            this.obj.wgt.btnLogin.stopAllActions();
            this.obj.wgt.btnLogin.runAction(cc.sequence(cc.delayTime(60),
                cc.callFunc(function() {
                    ShowTipsTool.TipsFromText("进入服务器失败", cc.color.RED, 30);
                    self.obj.wgt.btnLogin.setTouchEnabled(true);
                    self.obj.wgt.Image_sevChange.setTouchEnabled(true);
                })
            ));

            var url = USERSERVERURL + "?type=choose&cn=self&cid=" + this.cid + "&id=" + this.server.id;
            if (self.bEncrypt)
            {
                var svrTime = this.svrTime + (Date.parse(new Date()) - this.loginTime) / 1000;

                var plaintText = CryptoJS.enc.Utf8.parse(self.cid + "_" + svrTime + "_" + Math.floor(1 + Math.random()*60)); // 明文

                var en = CryptoJS.AES.encrypt(plaintText, CryptoJS.enc.Utf8.parse(AES_KEY),
                    {
                        iv: CryptoJS.enc.Utf8.parse(AES_IV),
                        mode: CryptoJS.mode.CBC,
                        padding: CryptoJS.pad.Pkcs7
                    }
                );
                var key = en.ciphertext.toString(CryptoJS.enc.Base64);

                url = url + "&key=" + key;
            }
            Network.getInstance().httpGet(url, function(data){
                if (data.status == 0)
                {
                    self.uid = data.uid;
                    self.verifycode = data.verifycode;
                    self.loginGameSever();
                }
                else
                {
                    self.obj.wgt.btnLogin.stopAllActions();

                    self.obj.wgt.btnLogin.setTouchEnabled(true);
                    self.obj.wgt.Image_sevChange.setTouchEnabled(true);

                    ShowTipsTool.TipsFromText("进入服务器失败", cc.color.RED, 30);
                }
            });
        }
        else
        {
            ShowTipsTool.TipsFromText("服务器维护中，请稍后再试", cc.color.RED, 30);
        }
    },

    loginGameSever:function()
    {
        var self = this;
        var logindata = {task:'login', uid:this.uid, verify:CryptoJS.MD5(this.uid + this.verifycode).toString()};
        var url = this.server.host;
        cc.log("logindata",logindata);
        Network.getInstance().initNetwork(url, logindata, function(){
            self.obj.wgt.btnLogin.stopAllActions();

            self.obj.wgt.btnLogin.setTouchEnabled(true);
            self.obj.wgt.Image_sevChange.setTouchEnabled(true);

            ShowTipsTool.TipsFromText("进入服务器失败", cc.color.RED, 30);
        });
    },

    enterGame:function(data)
    {
        GLOBALDATA = data.data;
        if (data.time)
        {
            GLOBALDATA.svrTime = data.time; //s
            GLOBALDATA.loginTime = Date.parse(new Date()); //ms
        }

        this.obj.wgt.Node_sever.setVisible(false);
        this.obj.wgt.Image_sev.setVisible(false);
        this.obj.wgt.Node_loading.setVisible(true);

        //加载资源
        this.loadRes();
    },

    loadRes:function () {
        var self = this;
        cc.loader.load(firstLoadRes,
            function (result, count, loadedCount) {
                var percent = (loadedCount / count * 100) | 0;
                percent = Math.min(percent, 100);
                self.obj.wgt.loadProgress.setPercent(percent);
            }, function () {
                cc.director.runScene(new CombatScene());
            }
        );
    },

    onExit:function () {
        this._super();
        cc.eventManager.removeListener(this.gate_login);
        cc.eventManager.removeListener(this.loginEvent);
        cc.eventManager.removeListener(this.creatRoleEvent);
    }
});