
/**
 ** @Author:pandayu
 ** @Version:1.0
 ** @DateTime:2018-09-09
 ** @Project:pandaCard CardGame
 ** @Contact: QQ:815099602
 **/
 
var itemBreakLayer =  ModalDialog.extend({
        LayerName: "itemBreakLayer",
        ctor: function (itemid) {
            this._super();
            this.itemid =itemid;
            this.choose_num = 1;
            if(Helper.getItemNum(this.itemid)-ITEMUSECFG[this.itemid].maxuse>0){
                this.max = ITEMUSECFG[this.itemid].maxuse;
            }else{
                this.max = Helper.getItemNum(this.itemid);
            }
            if(ITEMUSECFG[this.itemid].cost==null){
                this.cost = 0;
            }else{
                this.cost = ITEMUSECFG[this.itemid].cost[0][1];
            }
        },
        onEnter: function () {
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
        onExit: function () {
            this._super();
            cc.eventManager.removeListener(this.useThingEvent);
        },
        initUI:function (){
            this.breakLayerNode = ccsTool.load(resuiItemBreakLayer,["bagBg1","bagIcon1","bagNum1","bagName1","bagDate1","btnMin","btnMax","btnReduce","btnAdd","bagNumBuy1","btnOk","bagCos"]);
            this.addChild(this.breakLayerNode.node);
            var thing = Helper.findItemId(this.itemid);
            Helper.LoadIcoImageWithPlist(this.breakLayerNode.wgt.bagIcon1,thing);
            Helper.LoadFrameImageWithPlist(this.breakLayerNode.wgt.bagBg1,thing.quality);
            this.breakLayerNode.wgt.bagName1.setString(thing.itemname);
            this.breakLayerNode.wgt.bagName1.bagNum1.setString(Helper.getItemNum(this.itemid));
            this.breakLayerNode.wgt.bagNumBuy1.setString(this.choose_num);
            this.breakLayerNode.wgt.btnMin.addTouchEventListener(this.touchEvent,this);
            this.breakLayerNode.wgt.btnMax.addTouchEventListener(this.touchEvent,this);
            this.breakLayerNode.wgt.btnReduce.addTouchEventListener(this.touchEvent,this);
            this.breakLayerNode.wgt.btnAdd.addTouchEventListener(this.touchEvent,this);
            this.breakLayerNode.wgt.btnOk.addTouchEventListener(this.touchEvent,this);
            this.breakLayerNode.wgt.bagCos.setString(this.cost);
        },
        touchEvent:function (sender,type) {
            if(ccui.Widget.TOUCH_ENDED==type){
                switch(sender.name){
                    case "btnMin":
                        if(this.choose_num==1){
                            ShowTipsTool.TipsFromText("已是最小值", cc.color.RED, 30);
                        }else{
                            this.choose_num = 1;
                            this.breakLayerNode.wgt.bagNumBuy1.setString(this.choose_num);
                            this.breakLayerNode.wgt.bagCos.setString(this.cost*this.choose_num);
                        }
                        break;
                    case "btnMax":
                        if(this.choose_num==this.max){
                            ShowTipsTool.TipsFromText("已是最大值", cc.color.RED, 30);
                        }else{
                            this.choose_num = this.max;
                            this.breakLayerNode.wgt.bagNumBuy1.setString(this.choose_num);
                            this.breakLayerNode.wgt.bagCos.setString(this.cost*this.choose_num);
                        }
                        break;
                    case "btnReduce":
                        if(this.choose_num>1){
                            this.choose_num = this.choose_num-1;
                            this.breakLayerNode.wgt.bagNumBuy1.setString(this.choose_num);
                            this.breakLayerNode.wgt.bagCos.setString(this.cost*this.choose_num);
                        }else{
                            ShowTipsTool.TipsFromText("已是最小值", cc.color.RED, 30);
                        }
                        break;
                    case "btnAdd":
                        if(this.choose_num<this.max){
                            this.choose_num = this.choose_num+1;
                        }else{
                            ShowTipsTool.TipsFromText("已是最大值", cc.color.RED, 30);
                        }
                        this.breakLayerNode.wgt.bagNumBuy1.setString(this.choose_num);
                        this.breakLayerNode.wgt.bagCos.setString(this.cost*this.choose_num);
                        break;
                    case "btnOk":
                        var usertype = ITEMUSECFG[this.itemid].type;
                        if(usertype==1||usertype==2||usertype==3||usertype==4){
                            bagModel.useThing(parseInt(this.itemid),this.choose_num);
                        }else if(usertype==5){ //多个物品 选择一种 itemchoose

                        }else if(usertype==6){

                        }
                        break;
                    default:
                        break;
                }
            }
        }
    }
);