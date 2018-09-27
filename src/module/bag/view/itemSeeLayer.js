
/**
 ** @Author:pandayu
 ** @Version:1.0
 ** @DateTime:2018-09-09
 ** @Project:pandaCard CardGame
 ** @Contact: QQ:815099602
 **/
 /**
 * 物品查看层的创建
 */

var itemSeeLayer = ModalDialog.extend({
    LayerName:"itemSeeLayer",
    ctor:function(itemid,stype){  //type为1的时候带有使用功能
        this._super();
        this.itemid = itemid;
        this.stype = stype;
    },
    onEnter:function(){
        this._super();
    },
    //初始化ui
    initUI:function () {
        this.customWidget();  //自定义Widget
        this.updateInfo();
    },
    //自定义Widget
    customWidget:function(){
        var wgtArr = [];
        wgtArr.push("bagBg");   //物品背景
        wgtArr.push("bagIcon");   //icon
        wgtArr.push("bagPieces");   //碎片图标
        wgtArr.push("bagName");   //名字
        wgtArr.push("bagNum");   //数量
        wgtArr.push("bagDate");   //描述
        wgtArr.push("btnOk");   //使用按钮

        var uiItemSee = ccsTool.load(res.uiItemSeeLayer,wgtArr);
        //控件的名字赋值给this变量
        for(var key in uiItemSee.wgt){
            this[key] = uiItemSee.wgt[key];
        }
        this.addChild(uiItemSee.node);

        //使用按钮
        this.btnOk.addTouchEventListener(this.useItemEvent,this);
    },
    updateInfo:function(){
        var itemCfg = Helper.findItemId(this.itemid);
        //物品图标
        Helper.LoadIconFrameAndAddClick(this.bagIcon,this.bagBg,this.bagPieces,itemCfg);
        //物品名称
        this.bagName.setString(itemCfg.itemname);
        Helper.setNamecolorByQuality(this.bagName,itemCfg.quality);
        //物品数量
        var have = Helper.getItemNum(this.itemid);
        this.bagNum.setString(STRINGCFG[100003].string+have);  //100003	拥有:
        //描述
        this.bagDate.setString(itemCfg.describe);
        //只有后勤补给箱才有使用按钮
        if(this.itemid == 108 && this.stype == 1){
            this.btnOk.setVisible(true);
        }else{
            this.btnOk.setVisible(false);
        }
    },
    //使用按钮的事件
    useItemEvent:function (sender,type) {
        if(ccui.Widget.TOUCH_ENDED==type) {
            if(this.itemid == 108){  //后勤补给箱
                var _buyGoldLayer = new buyGoldLayer();
                this.getParent().addChild(_buyGoldLayer,10);
                this.removeFromParent(true);
            }
        }
    },
    onExit:function(){
        this._super();
    }
});