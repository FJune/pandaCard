
/**
 ** @Author:pandayu
 ** @Version:1.0
 ** @DateTime:2018-09-09
 ** @Project:pandaCard CardGame
 ** @Contact: QQ:815099602
 **/
 /*
* xiongrui vip特权
* */
var vipFreedomLayer = baseLayer.extend({
    ctor:function (){
        this._super();
        this.LayerName = "vipFreedomLayer";
        return true;
    },
    onEnter:function (){
        this._super();
        var self = this;
        this.buygoodEvent = cc.EventListener.create({
            event:cc.EventListener.CUSTOM,
            eventName:"pay.vipitem",
            callback:function (event) {
                var state = event.getUserData().status;
                //0 返回成功
                if(state==0){
                    self.showGoods(self.show_lv);
                    self.resourceGet(event.getUserData());
                }
            }
        });
        cc.eventManager.addListener( this.buygoodEvent,1);
        this.updataEvent = cc.EventListener.create({
            event:cc.EventListener.CUSTOM,
            eventName:"data.update.base",
            callback:function (event) {
                var state = event.getUserData().status;
                //0 返回成功
                if(state==0){
                    if(event.getUserData().data.data.hasOwnProperty("vip")){
                        self.updataData();
                    }
                }
            }
        });
        cc.eventManager.addListener( this.updataEvent,1);
    },
    onExit:function () {
        this._super();
        cc.eventManager.removeListener(this.buygoodEvent);
        cc.eventManager.removeListener(this.updataEvent);
    },
    initUI:function () {
        this.vipFreedomNode = ccsTool.load(res.uiVipFreedomLayer,["textVipNum1","LoadingBar","lblExp","textDiamondx","textVipNum2","btnRank","textVipNum4","PageView_vip","btnLeft","btnRight","textVipNum3","btnBack",
        "diamongValue","btnBuy","btnBuyText","bagBg1","bagIcon1","bagName1","bagNum1","bagBg2","bagIcon2","bagName2","bagNum2","bagBg3","bagIcon3","bagName3","bagNum3","bagBg4","bagIcon4","bagName4","bagNum4","Node_zai","textVipMaxTips"]);
        this.addChild(this.vipFreedomNode.node,2);

        this.goods_array = [[this.vipFreedomNode.wgt.bagBg1,this.vipFreedomNode.wgt.bagIcon1,this.vipFreedomNode.wgt.bagName1,this.vipFreedomNode.wgt.bagNum1],[this.vipFreedomNode.wgt.bagBg2,this.vipFreedomNode.wgt.bagIcon2,this.vipFreedomNode.wgt.bagName2,this.vipFreedomNode.wgt.bagNum2],
        [this.vipFreedomNode.wgt.bagBg3,this.vipFreedomNode.wgt.bagIcon3,this.vipFreedomNode.wgt.bagName3,this.vipFreedomNode.wgt.bagNum3],[this.vipFreedomNode.wgt.bagBg4,this.vipFreedomNode.wgt.bagIcon4,this.vipFreedomNode.wgt.bagName4,this.vipFreedomNode.wgt.bagNum4]];
        this.vipFreedomNode.wgt.btnLeft.addTouchEventListener(this.touchEvent,this);
        this.vipFreedomNode.wgt.btnRight.addTouchEventListener(this.touchEvent,this);
        this.vipFreedomNode.wgt.btnRank.addTouchEventListener(this.touchEvent,this); //充值按钮
        this.vipFreedomNode.wgt.btnBuy.addTouchEventListener(this.touchEvent,this); //购买按钮
        this.vipFreedomNode.wgt.btnBack.addTouchEventListener(this.touchEvent,this);

        this.myvip = GLOBALDATA.base.vip;
        this.myvipexp = GLOBALDATA.base.vipexp;
        this.loadPageView();
        this.updataData();
    },

    touchEvent:function (sender,type) {
        if(type == ccui.Widget.TOUCH_ENDED){
            switch(sender.name){
                case "btnRank":

                    break;
                case "btnBuy":
                    //判断砖石数量足够不  不足 给出提示
                    var price = VIPCFG[this.show_lv].price[1];
                    if(GLOBALDATA.base.diamond>=price){
                        vipModel.buyVipGoods(this.show_lv);
                    }else{
                        ShowTipsTool.TipsFromText(STRINGCFG[100079].string, cc.color.RED, 30);
                    }
                    break;
                case "btnLeft":
                    var now_index = this.vipFreedomNode.wgt.PageView_vip.getCurPageIndex();
                    if(now_index>0){
                        this.vipFreedomNode.wgt.PageView_vip.scrollToPage(now_index-1);
                        this.showGoods(now_index-1+1);
                    }
                    break;
                case "btnRight":
                    var now_index = this.vipFreedomNode.wgt.PageView_vip.getCurPageIndex();
                    if(now_index<14){
                        this.vipFreedomNode.wgt.PageView_vip.scrollToPage(now_index+1);
                        this.showGoods(now_index+1+1);
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
    //初始化数据
    updataData:function () {
        this.myvip = GLOBALDATA.base.vip;
        this.myvipexp = GLOBALDATA.base.vipexp;
        this.vipFreedomNode.wgt.textVipNum1.setString(this.myvip);
        if(VIPCFG[this.myvip+1]==null){
            if(this.myvipexp<=VIPCFG[this.myvip].gem){
                this.vipFreedomNode.wgt.lblExp.setString(this.myvipexp+"/"+VIPCFG[this.myvip].gem);
                var percent_num = Math.floor((this.myvipexp/VIPCFG[this.myvip].gem)*100);
                this.vipFreedomNode.wgt.LoadingBar.setPercent(percent_num);
            }else{
                this.vipFreedomNode.wgt.lblExp.setString(VIPCFG[this.myvip].gem+"/"+VIPCFG[this.myvip].gem);
                this.vipFreedomNode.wgt.LoadingBar.setPercent(100);
            }
            this.vipFreedomNode.wgt.textDiamondx.setString();
            this.vipFreedomNode.wgt.textVipNum2.setString();
            this.vipFreedomNode.wgt.textVipMaxTips.setVisible(true);
            this.vipFreedomNode.wgt.Node_zai.setVisible(false);
        }else{
            this.vipFreedomNode.wgt.lblExp.setString(this.myvipexp+"/"+VIPCFG[this.myvip+1].gem);
            var percent_num = Math.floor((this.myvipexp/VIPCFG[this.myvip+1].gem)*100);
            this.vipFreedomNode.wgt.LoadingBar.setPercent(percent_num);
            this.vipFreedomNode.wgt.textDiamondx.setString(VIPCFG[this.myvip+1].gem-this.myvipexp);
            this.vipFreedomNode.wgt.textVipNum2.setString(this.myvip+1);
            this.vipFreedomNode.wgt.textVipMaxTips.setVisible(false);
            this.vipFreedomNode.wgt.Node_zai.setVisible(true);
        }
        for(var j=0;j<this.goods_array.lenght;j++){
            goods_array[j][0].setVisible(false);
        }
        if(this.myvip==0){
            this.showGoods(1);
        }else{
            this.showGoods(this.myvip);
        }
    },
    showGoods:function (vip_lev) { //显示vip礼包
        this.show_lv = vip_lev;
        this.vipFreedomNode.wgt.textVipNum4.setString(vip_lev+"等级特权");
        if(VIPCFG[1].price[0]==2){ //砖石
            this.vipFreedomNode.wgt.diamongValue.setString(VIPCFG[vip_lev].price[1])
        }
        if(this.myvip<vip_lev){
            this.vipFreedomNode.wgt.btnBuy.setBright(false);
            this.vipFreedomNode.wgt.btnBuy.setEnabled(false);
            this.vipFreedomNode.wgt.btnBuyText.setString("购买");
        }else{
            //买过的vip礼包  置灰购买按钮
            var isbuyed = this.checkIsBuyed(vip_lev);
            if(isbuyed==true){
                this.vipFreedomNode.wgt.btnBuy.setBright(false);
                this.vipFreedomNode.wgt.btnBuy.setEnabled(false);
                this.vipFreedomNode.wgt.btnBuyText.setString("已购买")
            }else{
                this.vipFreedomNode.wgt.btnBuy.setBright(true);
                this.vipFreedomNode.wgt.btnBuy.setEnabled(true);
                this.vipFreedomNode.wgt.btnBuyText.setString("购买");
            }
        }
        var good_data = VIPCFG[vip_lev].goods;
        for(var i=0;i<good_data.length;i++){
            var id = good_data[i][0];
            var num = good_data[i][1];
            var thing = ITEMCFG[id];
            this.goods_array[i][0].setVisible(true);
            Helper.LoadIcoImageWithPlist(this.goods_array[i][1],thing);
            Helper.LoadFrameImageWithPlist(this.goods_array[i][0],thing.quality);
            this.goods_array[i][3].setString(num);
            this.goods_array[i][2].setString(thing.itemname);
        }
    },
    loadPageView:function () {
        this.vipFreedomNode.wgt.PageView_vip.setTouchEnabled(false);
        for(var i=1;i<=15;i++){
            var viplistitem_node = ccsTool.load(res.uiVipItem,["item","listVip","textVipDes"]);
            var viplistitem = viplistitem_node.wgt.item;
            viplistitem.removeFromParent(false);
            //加载此项的listview数据
            var viplist = viplistitem_node.wgt.listVip;
            for(var j=0;j<VIPCFG[i].string.length;j++){
                var itemtext = viplistitem_node.wgt.textVipDes.clone();
                var str = "";
                if(VIPCFG[i].string[j][1]!=-1){
                    str = StringFormat(STRINGCFG[VIPCFG[i].string[j][0]].string,VIPCFG[i].string[j][1]);
                }else{
                    str = STRINGCFG[VIPCFG[i].string[j][0]].string;
                }
                StringColorFormat(itemtext,str);
             //   itemtext.setString(str);
                viplist.pushBackCustomItem(itemtext);
            }
            //将此listviewitem 加载到pageview里
            this.vipFreedomNode.wgt.PageView_vip.addPage(viplistitem);
        }
        this.vipFreedomNode.wgt.PageView_vip.setCurrentPageIndex(this.myvip-1);
    },
    resourceGet:function(data){
        if(data != undefined && data.data != undefined)
        {
            data.task = 'resource.get';

            var event = new cc.EventCustom(data.task);
            event.setUserData(data);
            cc.eventManager.dispatchEvent(event);
        }
    },
    checkIsBuyed:function (viplev) {
        var result = false;
        var buyed_array = GLOBALDATA.base.vipitem;
        for(var key in buyed_array){
            if(key==viplev){
                result = true;
                break;
            }
        }
        return result;
    }
});