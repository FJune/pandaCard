
/**
 ** @Author:pandayu
 ** @Version:1.0
 ** @DateTime:2018-09-09
 ** @Project:pandaCard CardGame
 ** @Contact: QQ:815099602
 **/
 /**
 */
var WebSocket = WebSocket || window.WebSocket || window.MozWebSocket;
var Network  = (function(){
    var instance = null;
    function getNetworkInstance (){
        var networkInstance = {
            socket:null,
            data:null,
            forcedClose:false,
            timeout: 30000,//30s
            timeoutObj: null,

            httpGet:function(url, cb)
            {
                cc.log("url : " + url);
                var xhr = cc.loader.getXMLHttpRequest();
                xhr.open("GET", url, true);
                xhr.onreadystatechange = function(){
                    if(xhr.readyState === 4)
                    {
                        try
                        {
                            if (xhr.status === 200)
                            {
                                cc.log("responseText : " + xhr.responseText);
                                var data = JSON.parse(xhr.responseText);
                                cb(data);
                            }
                            else
                            {
                                cb({status:-1});
                            }
                        }
                        catch (e)
                        {
                            cc.log(e.message);
                            cb({status:-1});
                        }
                    }
                };
                xhr.onerror = function(){
                    cb({status:-1});
                };

                xhr.send(url);
            },

            initNetwork:function(url, data, cb){
                cc.log('Network initSocket...');

                // Default settings
                var settings = {
                    reconnectInterval: 1000,

                    maxReconnectInterval: 30000,

                    reconnectDecay: 1.5,

                    timeoutInterval: 2000,

                    maxReconnectAttempts: 5,

                    binaryType: 'blob'
                }

                for (var key in settings)
                {
                    this[key] = settings[key];
                }

                this.url = url;
                this.logindata = data;
                this.openFailedCallbcak = cb;

                this.reconnectAttempts = 0;

                var self = this;
                var ws ;

                this.open = function (reconnectAttempt) {
                    cc.log('Network open...');
                    if (!reconnectAttempt)
                    {
                        self.reconnectAttempts = 0;
                    }
                    ws = new WebSocket(self.url);
                    ws.binaryType = self.binaryType;

                    var localWs = ws;
                    var timeoutTimer = setTimeout(function() {
                        localWs.close();
                    }, self.timeoutInterval);

                    ws.onopen = function(event) {
                        cc.log('Network onopen...');
                        clearTimeout(timeoutTimer);
                        self.reconnectAttempts = 0;
                        self.openFailedCallbcak = null;
                        self.forcedClose = false;

                        self.send(self.logindata);

                        if(self.data)
                        {
                            self.send(self.data);
                            self.data = null;
                        }
                    };

                    ws.onclose = function(event) {
                        cc.log('Network onclose...');
                        clearTimeout(timeoutTimer);
                        ws = null;
                        if (self.forcedClose)
                        {
                        }
                        else
                        {
                            if (self.maxReconnectAttempts && self.reconnectAttempts < self.maxReconnectAttempts)
                            {
                                cc.log("reconnect... ,reconnectAttempts = ", self.reconnectAttempts);
                                var reconnectTimeout = self.reconnectInterval * Math.pow(self.reconnectDecay, self.reconnectAttempts);
                                setTimeout(function() {
                                    self.reconnectAttempts++;
                                    self.open(true);
                                }, reconnectTimeout > self.maxReconnectInterval ? self.maxReconnectInterval : reconnectTimeout);
                            }
                            else
                            {
                                if (self.openFailedCallbcak)
                                {
                                    self.openFailedCallbcak();
                                }
                                else
                                {
                                    processData({task:"error"});
                                }
                            }
                        }
                    };

                    ws.onmessage = function(event) {
                        cc.log("[recv]", event.data);

                        if(event.data!='HeartBeat')
                        {
                            var data = JSON.parse(event.data);
                            processData(data);
                        }
                    };

                    ws.onerror = function(event) {
                        cc.log('Network onerror...');
                    };

                    self.socket = ws;
                }

                this.open(false);
            },

            send:function(data){
                var msg = (typeof data =="string") ? data : JSON.stringify(data);

                cc.log("[send]", msg);
                if(this.socket && this.socket.readyState == WebSocket.OPEN)
                {
                    this.socket.send(msg);
                    this.heart();
                }
                else
                {
                    cc.log('Network is not inited...');
                    this.data = data;
                }
            },

            close:function(){
                cc.log("Network close...");
                this.forcedClose = true;
                if (this.socket){
                    this.socket.close();
                    this.socket = null;
                }
                if (this.timeoutObj)
                {
                    clearTimeout(this.timeoutObj);
                    this.timeoutObj = null;
                }
            },

            heart: function(){
                var self = this;
                if (this.timeoutObj)
                {
                    clearTimeout(this.timeoutObj);
                    this.timeoutObj = null;
                }
                this.timeoutObj = setTimeout(function(){
                    self.send("HeartBeat");
                }, this.timeout)
            },
        };
        return networkInstance;
    };
    return {
        getInstance:function(){
            if(instance === null){
                instance = getNetworkInstance();
            }
            return instance;
        }
    };
})();

function processData(revdata){
    switch (revdata.task){
        case 'data.update':
            var keyArr = revdata.data.key.split('.');
            if(GLOBALDATA){
                var data = GLOBALDATA;
                for(var i=0; i<keyArr.length;i++){
                    if(data[keyArr[i]] != null){
                        data = data[keyArr[i]];
                    }else{
                        data[keyArr[i]] = {};
                        data = data[keyArr[i]];
                    }
                }
                if(cc.isObject(revdata.data.data)){
                    for(var key in revdata.data.data){
                        if(revdata.data.data[key]=='NIL'){
                            delete data[key];
                        }else {
                            data[key] = revdata.data.data[key];
                        }
                    }
                }else {
                    if(revdata.data.key=='name'){
                        GLOBALDATA.name = revdata.data.data;
                    }
                }
                //发布key值事件
                var event = new cc.EventCustom("data.update."+keyArr[0]);
                event.setUserData(revdata);
                cc.eventManager.dispatchEvent(event);

                //发布data.update的事件
                var event = new cc.EventCustom("data.update");
                event.setUserData(revdata);
                cc.eventManager.dispatchEvent(event);
                cc.log('globaldata',GLOBALDATA);
            }

            break;
        case "kick":
        case "error":
            Network.getInstance().close();
            cc.director.runScene(new loginScene());
            break;
        default:
            var event = new cc.EventCustom(revdata.task);
            event.setUserData(revdata);
            cc.eventManager.dispatchEvent(event);
            //更新顶部信息
            var event = new cc.EventCustom('updatetop');
            cc.eventManager.dispatchEvent(event);
            break;
    }
    // }else {
    //     cc.error(data);
    // }
    if(GLOBALDATA){
        GLOBALDATA.serverTime = revdata.time;
        GLOBALDATA.localTime = Date.parse(new Date())/1000;
    }
    //服务器的状态显示
    if(revdata.status != 0){
        // ShowTipsTool.ErrorTipsFromStringById(revdata.status);
        if(revdata.status==3||revdata.status==5||revdata.status==200){
            ShowTipsTool.ErrorTipsFromStringById(revdata.status);
            Network.getInstance().close();
            cc.director.runScene(new loginScene());
        }
        //cc.log(revdata.status);//显示错误的tips
    }
}
