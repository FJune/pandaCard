
/**
 ** @Author:pandayu
 ** @Version:1.0
 ** @DateTime:2018-09-09
 ** @Project:pandaCard CardGame
 ** @Contact: QQ:815099602
 **/
 var itemBarrageLayer = cc.Layer.extend({
    ctor:function () {
        this._super();
        this.LayerName = "itemBarrageLayer";
        this.onTheWall = new Array(); //正在播放的弹幕数组，上限15个
        this.waitToTheWall = new Array(); //收到的聊天消息，还没有显示成弹幕的数组
        this.timeSetting = "false";  //是否开启弹幕的设置选项值
        this.isTimeOn = false; //定时器是否开启
    },

    onEnter:function () {
        this._super();
        var self = this;
        this.getItem = cc.EventListener.create({
            event: cc.EventListener.CUSTOM,
            eventName: "chat",  //世界聊天消息推送
            callback: function(event){
                var data = event.getUserData();
                if(data.data!=null){
                    if(data.data.channel == -1){ //-1表示全服消息
                        chatModel.saveWorldChat(data.data);
                        self.timeSetting = cc.sys.localStorage.getItem(OPENBARRAGE);
                        if(self.timeSetting=="true"){ //设置开启弹幕 世界消息要显示弹幕
                            //收的的消息全部存入waitToTheWall，再定时从里面取出存入onTheWall
                            self.waitToTheWall.push(data);
                            if(self.isTimeOn == false){ //定时器没有启动
                                self.startSchedule();
                            }
                        }else{

                        }
                        //取得父节点   在父节点的界面显示聊天信息
                        var textchat =  ccui.helper.seekWidgetByName(self.getParent(),"TextChat");
                        textchat.setString(data.data.sender.name+": "+data.data.content);
                    }else{

                    }
                    var event = new cc.EventCustom('updateworldchat');
                    event.setUserData(data);
                    cc.eventManager.dispatchEvent(event);
                }
                else{
                    //表示发送消息成功返回
                }
            }
        });
        cc.eventManager.addListener(this.getItem, 1);
    },

    onExit:function () {
        this._super();
        cc.eventManager.removeListener(this.getItem);
    },

    startSchedule:function () {
        this.schedule(function () {
            var self = this;
            this.isTimeOn = true;
            if(this.waitToTheWall.length!=0 || this.onTheWall.length!=0){
                if(this.onTheWall.length<15){
                    var data = this.waitToTheWall.shift();
                    if(data!=null){
                        this.onTheWall.push(data);
                    }
                }
                if(this.onTheWall[0]!=null){
                    var node = cc.Node.create();
                    this.addChild(node);
                    node.setAnchorPoint(0,0);
                    var random_y = Math.floor(Math.random()*(cc.winSize.height) + 1);
                    node.setPosition(cc.winSize.width,random_y);
                    var nodeItem = ccsTool.load(res.uiBarrageLayer,["barrageText"]);
                    nodeItem.wgt.barrageText.setString(this.onTheWall[0].data.sender.name+": "+this.onTheWall[0].data.content);
                    node.addChild(nodeItem.node);
                    var seq = cc.sequence(cc.moveBy(5, cc.p(-(cc.winSize.width+nodeItem.node.width),0)), cc.removeSelf(true),cc.callFunc(function () {

                    }));
                    node.runAction(seq);
                    self.onTheWall.shift();
                }
            }
            else{
                this.unscheduleAllCallbacks();
                this.isTimeOn = false;
            }
        },1);
    },
    getBarrageItemBySetting:function () {
        if(cc.sys.localStorage.getItem(GOLDBARRAGE)=="true"){

        }
        if(cc.sys.localStorage.getItem(PINKBARRAGE)=="true"){

        }
        if(cc.sys.localStorage.getItem(GOLDBARRAGE)=="false" && cc.sys.localStorage.getItem(PINKBARRAGE)=="false"){

        }
    }

});