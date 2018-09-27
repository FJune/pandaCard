
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
var ItemJumpLayer = ModalDialog.extend({
    ctor:function (itemid) {
        this._super();
        this.LayerName = "ItemJumpLayer";
        this.itemid = itemid;
    },
    onEnter:function () {
        this._super();
    },

    initUI:function(){
        this.obj = ccsTool.load(res.uiItemJumpLayer, ["backBtn", "jumpList", ,
            "bagBg", "bagIcon", "bagPieces", "bagName", "bagDate", "bagNum"]);

        this.addChild(this.obj.node);

        this.obj.wgt.backBtn.addTouchEventListener(this.onTouchEvent, this);
        this.showView();
    },

    showView:function(){
        var itemid = this.itemid;
        var item = ITEMCFG[itemid];
        if(item)
        {
            Helper.LoadIconFrameAndAddClick(this.obj.wgt.bagIcon, this.obj.wgt.bagBg, this.obj.wgt.bagPieces, item);
            Helper.setNamecolorByQuality(this.obj.wgt.bagName, item.quality);
            this.obj.wgt.bagName.setString(item.itemname);
            this.obj.wgt.bagDate.setString(item.describe);

            var count = Helper.getItemNum(itemid);
            this.obj.wgt.bagNum.setString(STRINGCFG[100003].string + Helper.formatNum(count));

            this.obj.wgt.jumpList.removeAllChildren();
            if (item.jump)
            {
                for (var key in item.jump)
                {
                    var typeid = item.jump[key][0] || 0;
                    var cfg = JUMPINFOCFG[typeid]
                    if (cfg)
                    {
                        var itemObj = ccsTool.load(res.uiItemJumpItem, ["bagItem", "textTitle", "textDate", "btnGo"]);

                        itemObj.wgt.textTitle.setString(cfg.name);
                        itemObj.wgt.textDate.setString(cfg.des);

                        itemObj.wgt.btnGo.setTag(typeid);
                        itemObj.wgt.btnGo.addTouchEventListener(this.onItemTouchEvent, this);

                        var bagItem = itemObj.wgt.bagItem;
                        bagItem.removeFromParent(false);
                        this.obj.wgt.jumpList.pushBackCustomItem(bagItem);
                    }
                }
            }
        }
    },

    onTouchEvent:function(sender, type){
        if(ccui.Widget.TOUCH_ENDED == type){
            switch(sender.name)
            {
                case "backBtn":
                    this.removeFromParent(true);
                    break;
            }
        }
    },
    onItemTouchEvent:function(sender, type){
        if(ccui.Widget.TOUCH_ENDED == type){
            // 默认按钮 btnGo
            var typeid = sender.getTag();
            switch(typeid)
            {
                case 1:   //觉醒商店
                    break;
                case 2:   //精英军事活动
                    break;
                case 6:   //普通商店
                    var shopLayer = new ShopLayer();
                    this.addChild(shopLayer, 2);
                    break;
                case 3:   //士兵商店
                    var showHeroLayer = new ShopHeroLayer();
                    this.addChild(showHeroLayer, 2);
                    break;
                case 4:    //装备商店
                    var shopEquLayer = new ShopEquLayer();
                    this.addChild(shopEquLayer, 2);
                    break;
                case 5:   //声望商店
                    if(GLOBALDATA.base.lev >= INTERFACECFG[31].level)
                    {
                        var shopAreLayer = new ShopAreLayer();
                        this.addChild(shopAreLayer, 2);
                    }
                    else
                    {
                        var describe = StringFormat(STRINGCFG[100045].string, INTERFACECFG[31].level);
                        ShowTipsTool.TipsFromText(describe, cc.color.RED, 30);
                    }
                    break;
                case 7:   //兵营
                    if(GLOBALDATA.base.lev >= INTERFACECFG[13].level)
                    {
                        var event = new cc.EventCustom("nav#changeModule");
                        event.setUserData("barracksButton");
                        cc.eventManager.dispatchEvent(event);
                    }
                    else
                    {
                        var describe = StringFormat(STRINGCFG[100045].string, INTERFACECFG[13].level);
                        ShowTipsTool.TipsFromText(describe, cc.color.RED, 30);
                    }
                    break;
                case 8:   //资源掠夺
                    if(GLOBALDATA.base.lev >= INTERFACECFG[24].level)
                    {
                        var resourceLayer = new resourceFightLayer();
                        this.addChild(resourceLayer,2);
                    }
                    else
                    {
                        var describe = StringFormat(STRINGCFG[100045].string, INTERFACECFG[24].level);
                        ShowTipsTool.TipsFromText(describe, cc.color.RED, 30);
                    }
                    break;
                case 9:    //探险
                    if(GLOBALDATA.base.lev >= INTERFACECFG[18].level)
                    {
                        var exploreLayer = new ExploreLayer();
                        this.addChild(exploreLayer, 2);
                    }
                    else
                    {
                        var describe = StringFormat(STRINGCFG[100045].string, INTERFACECFG[18].level);
                        ShowTipsTool.TipsFromText(describe, cc.color.RED, 30);
                    }
                    break;
                case 10:  //回收
                    if(GLOBALDATA.base.lev >= INTERFACECFG[15].level)
                    {
                        var event = new cc.EventCustom("nav#changeModule");
                        event.setUserData("recoverButton");
                        cc.eventManager.dispatchEvent(event);
                    }
                    else
                    {
                        var describe = StringFormat(STRINGCFG[100045].string, INTERFACECFG[15].level);
                        ShowTipsTool.TipsFromText(describe, cc.color.RED, 30);
                    }
                    break;
                case 11:  //兵工厂
                    if(GLOBALDATA.base.lev >= INTERFACECFG[6].level)
                    {
                        var arsenLayer = new ArsenLayer();
                        this.addChild(arsenLayer, 2);
                    }
                    else
                    {
                        var describe = StringFormat(STRINGCFG[100045].string, INTERFACECFG[6].level);
                        ShowTipsTool.TipsFromText(describe, cc.color.RED, 30);
                    }
            }
        }
    },

    onExit:function () {
        this._super();
    }
});