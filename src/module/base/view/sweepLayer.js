
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
var SweepLayer = ModalDialog.extend({
    ctor:function (data) {
        this._super();
        this.LayerName = "SweepLayer";
        this.data = data;
    },

    onEnter:function () {
        this._super();
    },

    initUI:function(){
        this.obj = ccsTool.load(res.uiSweepLayer, ["btnTipsOk", "ListView_4", "Image_sweep"]);

        this.addChild(this.obj.node, 1);

        this.obj.wgt.btnTipsOk.addTouchEventListener(this.onTouchEvent, this);

        this.showView();
    },

    //
    showView:function(){
        var data = this.data;
        this.obj.wgt.ListView_4.removeAllChildren();
        if (cc.isArray(data))
        {
            var total = {};
            data.push(total);
            for (var i = 0; i < data.length; i++)
            {
                var sub_data = data[i];

                if (cc.isArray(sub_data))
                {
                    var tmp = {};
                    tmp[sub_data[0]] = sub_data[1];
                    sub_data = tmp;
                }

                var imageObj = this.obj.wgt.Image_sweep.clone();
                var itemBg_1 = ccui.helper.seekWidgetByName(imageObj, "itemBg_1");
                var index = 0;
                var itemObj = [];
                for (var key in sub_data)
                {
                    if (i < data.length - 1)
                    {
                        if (total[key] == undefined)
                        {
                            total[key] = 0;
                        }
                        total[key] += sub_data[key];
                    }

                    itemObj[index] = itemBg_1;
                    if (index > 0)
                    {
                        itemObj[index] = itemBg_1.clone();
                        imageObj.addChild(itemObj[index]);
                    }

                    var itemBg = ccui.helper.seekWidgetByName(itemObj[index], "itemBg_1");
                    var itemIcon = ccui.helper.seekWidgetByName(itemObj[index], "itemIcon_1");
                    var itemPieces = ccui.helper.seekWidgetByName(itemObj[index], "itemPieces_1");
                    var itemName = ccui.helper.seekWidgetByName(itemObj[index], "itemName_1");
                    var itemNum = ccui.helper.seekWidgetByName(itemObj[index], "itemNum_1");

                    var item = ITEMCFG[key];
                    Helper.LoadIconFrameAndAddClick(itemIcon, itemBg,  itemPieces, item);
                    Helper.setNamecolorByQuality(itemName, item.quality);
                    itemName.setString(item.itemname);

                    itemNum.setString(sub_data[key] > 1 ? sub_data[key] : ""); //堆叠

                    index++;
                }
                var count = index;
                imageObj.setContentSize(520, 50 + 120 * Math.ceil(count / 4));

                var Text_sweepNum = ccui.helper.seekWidgetByName(imageObj, "Text_sweepNum");
                Text_sweepNum.setPositionY(120 * Math.ceil(count / 4) + 20);
                if (i < data.length - 1)
                {
                    Text_sweepNum.setString(StringFormat(STRINGCFG[100253].string, i + 1));
                }
                else
                {
                    Text_sweepNum.setString(STRINGCFG[100254].string);
                }

                for ( var index = count - 1; index >= 0; index--)
                {
                    itemObj[index].setPosition(cc.p(85 + 120 * (index % 4), 80 + 120 * (Math.floor((count -1 ) / 4) - Math.floor(index / 4))));
                }

                this.obj.wgt.ListView_4.pushBackCustomItem(imageObj);

            }
        }
    },

    onTouchEvent:function(sender, type){
        if(ccui.Widget.TOUCH_ENDED == type){
            switch(sender.name)
            {
                case "btnTipsOk":
                    this.removeFromParent(true);
                    break;
            }
        }
    },
    onExit:function () {
        this._super();
    }
});