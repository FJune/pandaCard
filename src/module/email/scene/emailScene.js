
/**
 ** @Author:pandayu
 ** @Version:1.0
 ** @DateTime:2018-09-09
 ** @Project:pandaCard CardGame
 ** @Contact: QQ:815099602
 **/
 
var emailScene = cc.Scene.extend({
    onEnter:function () {
        this._super();
        var layer = new emailLayer();
        this.addChild(layer);
    }
});