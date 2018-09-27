
/**
 ** @Author:pandayu
 ** @Version:1.0
 ** @DateTime:2018-09-09
 ** @Project:pandaCard CardGame
 ** @Contact: QQ:815099602
 **/
 /**
 * 更新公告层的创建
 */
var sevGuideLayer = ModalDialog.extend({
    LayerName:"sevGuideLayer",
    ctor:function(){
        this._super();
    },
    //初始化ui
    initUI:function(){
        this.customWidget(); //自定义Widget
        this.initCustomEvent();
        this.getNotice();
    },
    //自定义Widget
    customWidget:function () {
        var uiSevGuide = ccsTool.load(res.uiSevGuideLayer,["guiList","textShopName"]);
        //控件的名字赋值给this变量
        for(var key in uiSevGuide.wgt){
            this[key] = uiSevGuide.wgt[key];
        }
        this.addChild(uiSevGuide.node, 2);
    },
    initCustomEvent:function(){
        var self = this;
    },
    //显示界面的信息
    showPanel:function(){
        var COLOR_TAB = {};
        COLOR_TAB["R"] = cc.color(255, 0, 0);   //红色
        COLOR_TAB["G"] = cc.color(0, 255, 0);   //绿色
        COLOR_TAB["B"] = cc.color(0, 0, 255);   //蓝色
        COLOR_TAB["K"] = cc.color(0, 0, 0);     //黑色
        COLOR_TAB["Y"] = cc.color(255, 255, 0);    //黄色
        COLOR_TAB["W"] = cc.color(255, 255, 255);  //白色
        var listSize = this.guiList.getContentSize();
        var content = this.content;
        for(var key in content){
            var desc = content[key].desc || "";
            var str_array = desc.split("#");
            var RichText = ccui.RichText.create();
            for(var k in str_array){
                var str = str_array[k];
                var ctxt = str.match("^([RGBKYW])(.*)");
                if(ctxt != null){
                    var ElementText = ccui.RichElementText.create(1,COLOR_TAB[ctxt[1]],255,ctxt[2],"Arial", 24);
                    RichText.pushBackElement(ElementText);
                }
            }
            RichText.formatText();
            var rsize = RichText.getContentSize();
            RichText.ignoreContentAdaptWithSize(false);
            RichText.setContentSize(listSize.width,Math.ceil(rsize.width/listSize.width)*rsize.height);
            RichText.formatText();
            this.guiList.pushBackCustomItem(RichText);
        }
    },

    getNotice:function()
    {
        var self = this;
        var url = USERSERVERURL + "?type=get_notify";
        Network.getInstance().httpGet(url, function(data){
            self.content = data.content || NOTICECFG;
            self.showPanel();
        });
    },

    onExit:function () {
        this._super();
    }
});