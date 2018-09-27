
/**
 ** @Author:pandayu
 ** @Version:1.0
 ** @DateTime:2018-09-09
 ** @Project:pandaCard CardGame
 ** @Contact: QQ:815099602
 **/
 
var itemUseLayer = ModalDialog.extend({
    LayerName:"itemUseLayer",
    ctor:function(itemid){
        this._super();
        this.itemid = itemid;
        this.choose_num = 1;
        if(Helper.getItemNum(this.itemid)-ITEMUSECFG[this.itemid].maxuse>0){
            this.max = ITEMUSECFG[this.itemid].maxuse;
        }else{
            this.max = Helper.getItemNum(this.itemid);
        }
    },
    onEnter:function(){
        this._super();

        var self = this;
        this.useThingEvent = cc.EventListener.create({
            event: cc.EventListener.CUSTOM,
            eventName: "knapsack.use",
            callback: function(event){
                var resData = event.getUserData();
                if(resData.status == 0){
                    //获得的物品
                    var task = 'resource.get';
                    var event = new cc.EventCustom(task);
                    event.setUserData(resData);
                    cc.eventManager.dispatchEvent(event);
                    //移除界面
                    self.removeFromParent(true);
                    //更新背包
                    var evn = new cc.EventCustom('updateUI.bag');
                    cc.eventManager.dispatchEvent(evn);
                }
            }
        });
        cc.eventManager.addListener(this.useThingEvent,this);

    },
    //初始化ui
    initUI:function () {
        this.buyBoxLayerNode = ccsTool.load(res.uiItemUseLayer,["bagBg1","bagIcon1","bagNum1","bagName1","bagDate1","btnMin","btnMax","btnReduce","btnAdd","bagNumBuy1","btnOk","btnBack1","bagPieces1"]);
        this.addChild(this.buyBoxLayerNode.node);
        var thing = Helper.findItemId(this.itemid);
        Helper.LoadIcoImageWithPlist(this.buyBoxLayerNode.wgt.bagIcon1,thing);
        Helper.LoadFrameImageWithPlist(this.buyBoxLayerNode.wgt.bagBg1,thing.quality);
        this.buyBoxLayerNode.wgt.bagName1.setString(thing.itemname);
        this.buyBoxLayerNode.wgt.bagNum1.setString(Helper.getItemNum(this.itemid));
        this.buyBoxLayerNode.wgt.bagNumBuy1.setString(this.choose_num);
        this.buyBoxLayerNode.wgt.bagDate1.setString(thing.describe);
        this.buyBoxLayerNode.wgt.btnMin.addTouchEventListener(this.touchEvent,this);
        this.buyBoxLayerNode.wgt.btnMax.addTouchEventListener(this.touchEvent,this);
        this.buyBoxLayerNode.wgt.btnReduce.addTouchEventListener(this.touchEvent,this);
        this.buyBoxLayerNode.wgt.btnAdd.addTouchEventListener(this.touchEvent,this);
        this.buyBoxLayerNode.wgt.btnOk.addTouchEventListener(this.touchEvent,this);
        this.buyBoxLayerNode.wgt.btnBack1.addTouchEventListener(this.touchEvent,this);
        if(thing.maintype==3||thing.maintype==8||thing.maintype==9){ //碎片
            this.buyBoxLayerNode.wgt.bagPieces1.setVisible(true);
        }
    },
    onExit:function(){
        this._super();
        cc.eventManager.removeListener(this.useThingEvent);
    },

    touchEvent:function (sender,type) {
        if(ccui.Widget.TOUCH_ENDED==type){
            switch(sender.name){
                case "btnMin":
                    if(this.choose_num == 1){
                        //ShowTipsTool.TipsFromText("已是最小值", cc.color.RED, 30);
                    }else{
                        this.choose_num = 1;
                        this.buyBoxLayerNode.wgt.bagNumBuy1.setString(this.choose_num);
                    }
                    break;
                case "btnMax":
                    if(this.choose_num == this.max){
                        ShowTipsTool.TipsFromText(STRINGCFG[100296].string, cc.color.RED, 30);
                    }else{
                        this.choose_num = this.max;
                        this.buyBoxLayerNode.wgt.bagNumBuy1.setString(this.choose_num);
                    }
                    break;
                case "btnReduce":
                    if(this.choose_num>1){
                        this.choose_num = this.choose_num-1;
                        this.buyBoxLayerNode.wgt.bagNumBuy1.setString(this.choose_num);
                    }else{
                        //ShowTipsTool.TipsFromText("已是最小值", cc.color.RED, 30);
                    }
                    break;
                case "btnAdd":
                    if(this.choose_num<this.max){
                        this.choose_num = this.choose_num+1;
                        this.buyBoxLayerNode.wgt.bagNumBuy1.setString(this.choose_num);
                    }else{
                        ShowTipsTool.TipsFromText(STRINGCFG[100296].string, cc.color.RED, 30);
                    }
                    break;
                case "btnOk":
                    bagModel.useThing(parseInt(this.itemid),this.choose_num);
                    break;
                case "btnBack1":
                    this.removeFromParent();
                    break;
                default:
                    break;
            }
        }
    }
});