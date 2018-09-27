
/**
 ** @Author:pandayu
 ** @Version:1.0
 ** @DateTime:2018-09-09
 ** @Project:pandaCard CardGame
 ** @Contact: QQ:815099602
 **/
 /**
 * 对战结果层的创建
 */
var bothResLayer = baseLayer.extend({
    LayerName:"bothResLayer",
    ctor:function(data){
        this._super();
        this.uiAttributeLayer.setVisible(false);
        this.setOpacity(150);       //透明度设置
        this.data = data;
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
        wgtArr.push("ImageFastWin");  //战斗胜利界面
        wgtArr.push("textResTop");  //积分上升的说明
        wgtArr.push("sygoldValue");  //获得的金币
        wgtArr.push("expValue");  //获得的经验
        wgtArr.push("btnResOk");  //胜利界面的确认按钮
        wgtArr.push("ImageFastlose");  //战斗失败界面
        wgtArr.push("textloseTop");  //积分下降的说明
        wgtArr.push("goldLoseValue");  //获得的金币
        wgtArr.push("expLoseValue");  //获得的经验
        wgtArr.push("btnLoseOk");  //失败界面的确认按钮

        var uiVs = ccsTool.load(res.uiVsResLayer,wgtArr);
        //控件的名字赋值给this变量
        for(var key in uiVs.wgt){
            this[key] = uiVs.wgt[key];
        }
        this.addChild(uiVs.node);

        //胜利界面的确认按钮
        this.btnResOk.addTouchEventListener(this.confirmEvent,this);
        //失败界面的确认按钮
        this.btnLoseOk.addTouchEventListener(this.confirmEvent,this);
    },
    updateInfo:function () {
        //处理传过来的数据  // {"20001":1,"20002":1,"20003":1,"20004":1}//[100,200,300, ];
        var itemArray = [];
        var offset = cc.isArray(this.data.itemData) ? 1 : 0;
        for (var key in this.data.itemData)
        {
            if (this.data.itemData[key] != null)
            {
                var id = Number(key) + offset;
                itemArray.push({id:id, num:this.data.itemData[key]});
            }
        }
        if(this.data.result ==0){  //失败
            this.ImageFastWin.setVisible(false);
            this.ImageFastlose.setVisible(true);
            //积分上升的说明
            var strtext = StringFormat(STRINGCFG[100227].string,this.data.jifen);   //100227	积分$1（下降）
            this.textloseTop.setString(strtext);
            this.goldLoseValue.setString(Helper.formatNum(this.getNumFromItemArray(itemArray,1)));  //获得的金币
            this.expLoseValue.setString(this.getNumFromItemArray(itemArray,3));  //获得的经验
        }else if(this.data.result ==1){  //胜利
            this.ImageFastWin.setVisible(true);
            this.ImageFastlose.setVisible(false);
            //积分上升的说明
            var strtext = StringFormat(STRINGCFG[100226].string,[this.data.jifen,10]);   //100226	积分$1（上升$1）
            this.textResTop.setString(strtext);
            this.sygoldValue.setString(Helper.formatNum(this.getNumFromItemArray(itemArray,1)));  //获得的金币
            this.expValue.setString(this.getNumFromItemArray(itemArray,3));  //获得的经验
        }
    },
    //从数据中获取数据
    getNumFromItemArray:function(itemArray,id){
        var num = 0;
        for(var i=0;i<itemArray.length;i++){
            if(itemArray[i].id == id){
                num = itemArray[i].num;
                break;
            }
        }
        return num;
    },
    //返回按钮的事件
    confirmEvent:function(sender, type){
        if(ccui.Widget.TOUCH_ENDED==type){
            if(this.data.callback) {
                this.data.callback.call(this.data.target);
                this.data = null;
            }
            this.removeFromParent(true);
        }
    },
    onExit:function(){
        this._super();
    },
});