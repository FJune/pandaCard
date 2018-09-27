
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
var BuyBoxLayer = ModalDialog.extend({
    /**
     *
     */
    ctor:function (goodsid, maxnum) {
        this._super();
        this.LayerName = "BuyBoxLayer";
        this.goodsid = goodsid;
        this.maxnum = maxnum;
    },

    onEnter:function () {
        this._super();

    },

    initUI:function(){
        this.obj = ccsTool.load(res.uiBuyBoxLayer, ["textTipsTitle", "btnBack1"
        , "bagBg1", "bagIcon1", "bagPieces1", "bagNum1","bagName1", "bagDate1",
        , "btnMin","btnReduce","bagNumBuy1", "btnAdd", "btnMax"
        , "btnOk"]);

        this.addChild(this.obj.node, 1);

        this.obj.wgt.btnBack1.addTouchEventListener(this.onTouchEvent, this);

        this.obj.wgt.btnMin.addTouchEventListener(this.onTouchEvent, this);
        this.obj.wgt.btnReduce.addTouchEventListener(this.onTouchEvent, this);
        this.obj.wgt.btnAdd.addTouchEventListener(this.onTouchEvent, this);
        this.obj.wgt.btnMax.addTouchEventListener(this.onTouchEvent, this);

        this.obj.wgt.btnOk.addTouchEventListener(this.onTouchEvent, this);

        this.doAddListener();
        this.showView();
    },

    doAddListener:function(){
//        var self = this;
//        // 打开补给
//        this.shop_buy = cc.EventListener.create({
//            event: cc.EventListener.CUSTOM,
//            eventName: "shop.buy",
//            callback: function(event){
//                self.resourceGet(event.getUserData());
//                self.removeFromParent(true);
//            }});
//
//        cc.eventManager.addListener(this.shop_buy, 1);
    },



    showView:function()
    {
        var goodsid = this.goodsid;
        var maxnum = this.maxnum;
        var item = ITEMCFG[goodsid];
        if(item)
        {
            Helper.LoadIconFrameAndAddClick(this.obj.wgt.bagIcon1, this.obj.wgt.bagBg1, this.obj.wgt.bagPieces1, item);
            Helper.setNamecolorByQuality(this.obj.wgt.bagName1, item.quality);
            this.obj.wgt.bagName1.setString(item.itemname);
            this.obj.wgt.bagDate1.setString(item.describe);

            this.obj.wgt.bagNum1.setString(maxnum  > 1 ? maxnum : "");

            this.doMin();
        }
    },
    onTouchEvent:function(sender, type){
        if(ccui.Widget.TOUCH_ENDED == type){
            switch(sender.name)
            {
                case "btnBack1":
                    this.removeFromParent(true);
                    break;
                case "btnMin":
                    this.doMin();
                    break;
                case "btnReduce":
                    this.doReduce();
                    break;
                case "btnAdd":
                    this.doAdd();
                    break;
                case "btnMax":
                    this.doMax();
                    break;
                case "btnOk":
                    this.doBuy();
                    break
            }
        }
    },

    doMax:function(){
        var maxnum = this.maxnum;
        var count = Math.max(maxnum, 1);

        this.obj.wgt.bagNumBuy1.setString(Helper.formatNum(count));

        this.count = count;
    },

    doMin:function()
    {
        var count = 1;

        this.obj.wgt.bagNumBuy1.setString(Helper.formatNum(count));

        this.count = count;
    },

    doReduce:function()
    {
        var count = this.count;
        if (count > 1)
        {
            count--;
            this.obj.wgt.bagNumBuy1.setString(Helper.formatNum(count));
            this.count = count;
        }
    },

    doAdd:function()
    {
        var maxnum = this.maxnum;
        var count = this.count;
        if (count < maxnum)
        {
            count++;
            this.obj.wgt.bagNumBuy1.setString(Helper.formatNum(count));
            this.count = count;
        }
    },

    doBuy:function()
    {
        ShowTipsTool.TipsFromText("敬请期待", cc.color.GREEN, 30);
        //Network.getInstance().send({task:"shop.buy", id:this.goodsid, typ:this.type, num: this.count});
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

    onExit:function () {
        this._super();
//        cc.eventManager.removeListener(this.shop_buy);
    }
});