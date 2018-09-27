
/**
 ** @Author:pandayu
 ** @Version:1.0
 ** @DateTime:2018-09-09
 ** @Project:pandaCard CardGame
 ** @Contact: QQ:815099602
 **/
 /**
 * for 统一加载资源
 */
var cmLayer = cc.Layer.extend({
    onEnter:function () {
        this._super();
        var self = this;
        // cc.log('cmLayer-onEnter-'+this.LayerName);
        //加载资源
        if(this.LayerName){
            cc.loader.load(g_resources[this.LayerName],function (result, count, loadedCount) {

            }, function () {
                // cc.log('loadRes compelete');
                // cc.textureCache.dumpCachedTextureInfo();

                self.initUI();
                self.IsLoadComplete = true;
            });
        }else{
            cc.log('请添加Layer名');
        }

        //处理dataupdate
        this.dataUpdateEvent = cc.EventListener.create({
            event:cc.EventListener.CUSTOM,
            eventName:"data.update",
            callback:function (event) {
                var resData = event.getUserData();
                if(resData.status == 0){
                    if(self.dealRedPoint && typeof(self.dealRedPoint)=="function" && self.IsLoadComplete == true) {
                        self.dealRedPoint(resData.data);
                    }
                }
            }
        });
        cc.eventManager.addListener(this.dataUpdateEvent,this);

    },
    ctor:function () {
        //////////////////////////////
        // 1. super init first
        this._super();
        // cc.log('cmLayer-ctor-'+this.LayerName);
        return true;
    },
    onExit:function () {
        if(this.LayerName){
            gcRes(g_resources[this.LayerName]);
            // cc.textureCache.dumpCachedTextureInfo();
        }
        this.IsLoadComplete = false;
        cc.eventManager.removeListener(this.dataUpdateEvent);
        // cc.log('cmLayer-onExit-'+this.LayerName);
        this._super();
    }
});