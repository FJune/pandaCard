
/**
 ** @Author:pandayu
 ** @Version:1.0
 ** @DateTime:2018-09-09
 ** @Project:pandaCard CardGame
 ** @Contact: QQ:815099602
 **/
 /**
 */
var loginScene = cc.Scene.extend({
    ctor:function () {
        this._super();
        var layer1 = new ServerLayer();
        this.addChild(layer1, 1);
    }
});