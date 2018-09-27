
/**
 ** @Author:pandayu
 ** @Version:1.0
 ** @DateTime:2018-09-09
 ** @Project:pandaCard CardGame
 ** @Contact: QQ:815099602
 **/
 var rankWarLayer = cmLayer.extend({
    ctor:function (){
        this._super();
        this.LayerName = "rankWarLayer";
        this.myfight = getCommanderPower();
    },
    onEnter:function () {
        this._super();
        var self = this;
        this.nowtab = 1;
        this.getPaihangEvent = cc.EventListener.create({
            event:cc.EventListener.CUSTOM,
            eventName:"rank.getinfo",
            callback:function (event) {
                var state = event.getUserData().status;
                if(state==0){
                    self.loadPaiList(event.getUserData().id,event.getUserData().data);
                    self.rankWarNode.wgt.textMyRank.setString("我的排名:"+event.getUserData().my);
                    self.rankWarNode.wgt.textName.setString(GLOBALDATA.name);
                    self.rankWarNode.wgt.textMyWar.setString("我的战力:"+self.myfight);
                }
            }
        });
        cc.eventManager.addListener(this.getPaihangEvent,1);
    },
    onExit:function (){
        this._super();
        this.rankWarItem.node.release();
        cc.eventManager.removeListener(this.getPaihangEvent)
    },
    initUI:function () {
        this.rankWarNode = ccsTool.load(res.uiRankWarLayer,["btnStar","btnWar","listRank","textMyRank","textName","textMyWar","btnBack"]);
        this.rankWarItem = ccsTool.load(res.uiRankWarItem,["item"]);
        this.rankWarItem.node.retain();
        this.addChild(this.rankWarNode.node,1);

        this.rankWarNode.wgt.btnStar.addTouchEventListener(this.touchEvent,this);
        this.rankWarNode.wgt.btnWar.addTouchEventListener(this.touchEvent,this);
        this.rankWarNode.wgt.btnBack.addTouchEventListener(this.touchEvent,this);

        this.rankWarNode.wgt.btnStar.setBrightStyle(ccui.Widget.BRIGHT_STYLE_HIGH_LIGHT);
        this.rankWarNode.wgt.btnStar.setEnabled(false);
        rankWarLayerModel.getPaiHang(1,1,20);

    },
    touchEvent:function (sender,type) {
        if(type == ccui.Widget.TOUCH_ENDED){
            switch(sender.name){
                case "btnStar": //战力榜tab页
                    if(this.nowtab==2){
                        this.rankWarNode.wgt.btnStar.setBrightStyle(ccui.Widget.BRIGHT_STYLE_HIGH_LIGHT);
                        this.rankWarNode.wgt.btnStar.setEnabled(false);
                        this.rankWarNode.wgt.btnWar.setBrightStyle(ccui.Widget.BRIGHT_STYLE_NORMAL);
                        this.rankWarNode.wgt.btnWar.setEnabled(true);
                        rankWarLayerModel.getPaiHang(1,1,20);
                        this.nowtab = 1;
                    }
                    break;
                case "btnWar": //通关榜
                    if(this.nowtab==1){
                        this.rankWarNode.wgt.btnStar.setBrightStyle(ccui.Widget.BRIGHT_STYLE_NORMAL);
                        this.rankWarNode.wgt.btnStar.setEnabled(true);
                        this.rankWarNode.wgt.btnWar.setBrightStyle(ccui.Widget.BRIGHT_STYLE_HIGH_LIGHT);
                        this.rankWarNode.wgt.btnWar.setEnabled(false);
                        rankWarLayerModel.getPaiHang(2,1,20);
                        this.nowtab = 2;
                    }
                    break;
                case "btnBack":
                    this.removeFromParent();
                    break;
                default:
                    break;
            }
        }
    },
    loadPaiList:function (type,data) { //1 战力榜 2 通关榜
        this.rankWarNode.wgt.listRank.removeAllChildren();
        var i=1;
        for(var key in data){
            var item = this.rankWarItem.wgt.item.clone();
            this.rankWarNode.wgt.listRank.pushBackCustomItem(item);
            var itemName = ccui.helper.seekWidgetByName(item,"itemName");
            var itemWar = ccui.helper.seekWidgetByName(item,"itemWar");
            var textBMFontRank = ccui.helper.seekWidgetByName(item,"textBMFontRank");

            itemName.setString(data[key].name);
            itemWar.setString("战力:"+data[key].atk);
            textBMFontRank.setString(i);
            i = i+1;
        }
    }
});