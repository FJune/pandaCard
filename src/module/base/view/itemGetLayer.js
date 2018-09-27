
/**
 ** @Author:pandayu
 ** @Version:1.0
 ** @DateTime:2018-09-09
 ** @Project:pandaCard CardGame
 ** @Contact: QQ:815099602
 **/
 var itemGetLayer = cc.Layer.extend({
    ctor:function(){
        this._super();
        this.LayerName = "itemGetLayer";
        this._node = null;
        this._goodsList = [];
        this._nodeList = [];
        this._index = 0;
    },

    onEnter:function(){
        this._super();

        var self = this;
        this.resource_get = cc.EventListener.create({
            event: cc.EventListener.CUSTOM,
            eventName: "resource.get",
            callback: function(event){
                if (self._node)
                {
                    self._node.removeFromParent(true);
                    self._node = null;
                }
                var node = cc.Node.create();
                node.setCascadeOpacityEnabled(true);
                node.y = cc.winSize.height / 2;
                self.addChild(node);
                self._node = node;

                //数据处理
                var data = event.getUserData().data;

                self._index = 0;
                self._nodeList = [];
                self._goodsList = [];
                if (cc.isArray(data))
                {
                    for (var idx in data)
                    {
                        if (cc.isArray(data[idx]))
                        {
                            for (var key in data[idx])
                            {
                                var id = Number(key) + 1;
                                if(data[idx][key]!=0){
                                    self._goodsList.push({id:id, num:data[idx][key]});
                                }
                            }
                        }
                        else if (cc.isObject(data[idx]))
                        {
                            for (var key in data[idx])
                            {
                                var id = Number(key);
                                if(data[idx][key]!=0){
                                    self._goodsList.push({id:id, num:data[idx][key]});
                                }
                            }
                        }
                        else if (cc.isNumber(data[idx]))
                        {
                            var id = Number(idx) + 1;
                            if(data[idx]!=0){
                                self._goodsList.push({id:id, num:data[idx]});
                            }
                        }
                    }
                }
                else
                {
                    for (var key in data)
                    {
                        var id = Number(key);
                        if(data[key]!=0){
                            self._goodsList.push({id:id, num:data[key]});
                        }
                    }
                }

                if ( self._goodsList.length > 0)
                {
                    node.schedule(function(){
                        var goods = self._goodsList.pop();
                        if(goods)
                        {
                            var id = goods.id;
                            var num = goods.num;

                            var item = ITEMCFG[id] || {};

                            var nodeItem = ccs.load(res.uiItemGetItem).node;
                            var Image_1 = ccui.helper.seekWidgetByName(nodeItem, "Image_1");
                            var bagBg = ccui.helper.seekWidgetByName(nodeItem, "bagBg");
                            var bagIcon = ccui.helper.seekWidgetByName(nodeItem, "bagIcon");
                            var bagPieces = ccui.helper.seekWidgetByName(nodeItem, "bagPieces"); //碎片标志
                            var bagName = ccui.helper.seekWidgetByName(nodeItem, "bagName");

                            Helper.LoadFrameImageWithPlist(bagBg, item.quality);
                            Helper.LoadIcoImageWithPlist(bagIcon, item);
                            bagPieces.setVisible(item.maintype == 3 || item.maintype == 8 || item.maintype == 9);
                            bagName.setString(item.itemname + " X " + Helper.formatNum(num));

                            self._node.addChild(nodeItem);
                            self._nodeList.push(nodeItem);

                            self._index++;

                            for (var i = 0; i < self._index; i++)
                            {
                                self._nodeList[i].y = (self._index - i - 1) * (4+ Image_1.getContentSize().height);
                            }
                        }
                        else
                        {
                            var seq = cc.sequence(cc.delayTime(0.5),
                                                  cc.spawn(cc.moveBy(1, cc.p(0, 150)),
                                                           cc.fadeOut(1)),
                                                  cc.removeSelf(true));
                            self._node.runAction(seq);
                            self._node = null;
                        }
                    }, 0.07, self._goodsList.length);
                }
            }
        });
        cc.eventManager.addListener(this.resource_get, 1);
    },

    onExit:function () {
        this._super();
        cc.eventManager.removeListener(this.resource_get);
    }
});