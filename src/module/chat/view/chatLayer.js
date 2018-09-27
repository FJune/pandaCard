
/**
 ** @Author:pandayu
 ** @Version:1.0
 ** @DateTime:2018-09-09
 ** @Project:pandaCard CardGame
 ** @Contact: QQ:815099602
 **/
 var chatLayer = ModalDialog.extend({
    showtype:-1, //默认频道是全服   数值跟服务端文档保持一致
    ctor:function () {
        // 1. super init first
        this._super();
        this.LayerName = "chatLayer";
        this.choosetab = null;
        return true;
    },
    onEnter:function () {
        this._super();
        var self = this;
        this.getItem = cc.EventListener.create({
            event: cc.EventListener.CUSTOM,
            eventName: "updateworldchat",  //更新世界聊天界面
            callback: function(event){
                self.addWorldChatList(event.getUserData().data);
            }
        });
        cc.eventManager.addListener(this.getItem, 1);
    },
    onExit:function () {
        this._super();
    },
    initUI:function () {
        this.ccsChatNode = ccsTool.load(res.uiChatLayer,["btnBack","btnBar","btnGo","TextFieldChat","chatList","btnWorld","btnSociaty","layoutBar","btnBarBack","makeBarCheck","barComCheck","barInterCheck","barSeniorCheck"]);
        this.ccsChatItemNode = ccsTool.load(res.uiChatItem,["heroIcon","heroName","heroState","chatItem"]);
        this.addChild(this.ccsChatNode.node);
        this.ccsChatNode.wgt.btnBack.addTouchEventListener(this.btnTouchEvent,this);
        this.ccsChatNode.wgt.btnBar.addTouchEventListener(this.btnTouchEvent,this);
        this.ccsChatNode.wgt.btnGo.addTouchEventListener(this.btnTouchEvent,this);
        this.ccsChatNode.wgt.btnBarBack.addTouchEventListener(this.btnTouchEvent,this);
        this.ccsChatNode.wgt.makeBarCheck.addTouchEventListener(this.btnTouchEvent,this);
        this.ccsChatNode.wgt.barComCheck.addTouchEventListener(this.btnTouchEvent,this);
        this.ccsChatNode.wgt.barComCheck.addEventListener(this.selectedEvent);
        this.ccsChatNode.wgt.barInterCheck.addTouchEventListener(this.btnTouchEvent,this);
        this.ccsChatNode.wgt.barInterCheck.addEventListener(this.selectedEvent);
        this.ccsChatNode.wgt.barSeniorCheck.addTouchEventListener(this.btnTouchEvent,this);
        this.ccsChatNode.wgt.barSeniorCheck.addEventListener(this.selectedEvent);
        //设置输入框字节数不超过35
        this.ccsChatNode.wgt.TextFieldChat.setMaxLength(35);
        this.ccsChatNode.wgt.TextFieldChat.setMaxLengthEnabled(true);
        //聊天频道tab对象
        this.btnWorld_tab =  this.ccsChatNode.wgt.btnWorld;
        this.btnSociaty_tab = this.ccsChatNode.wgt.btnSociaty;
        this.btnWorld_tab.addTouchEventListener(this.btnTouchEvent,this);
        this.btnSociaty_tab.addTouchEventListener(this.btnTouchEvent,this);
        //默认显示世界聊天
        this.showWhatTabOnTheView( this.btnWorld_tab);
        //显示弹幕的界面
        this.showBarrageSetting();

        this.ccsChatNode.wgt.chatList.setScrollBarEnabled(false);
    },
    btnTouchEvent:function (sender,type) {
        if(ccui.Widget.TOUCH_ENDED == type){
            switch(sender.name){
                case "btnBack":
                    this.removeFromParent();
                    break;
                case "btnBar":
                    this.ccsChatNode.wgt.layoutBar.setVisible(true);
                    break;
                case "btnBarBack":
                    this.ccsChatNode.wgt.layoutBar.setVisible(false);
                    break;
                case "btnGo":
                    var sendcontent = this.ccsChatNode.wgt.TextFieldChat.getString();
                    if (sendcontent == null || sendcontent == undefined || sendcontent == ''){
                        //提示空字符串不能发送
                    }else{
                        chatModel.sendChatMessage(sendcontent,this.showtype);
                        this.ccsChatNode.wgt.TextFieldChat.setString("");
                    }
                    break;
                case "btnWorld":
                    this.showWhatTabOnTheView(this.btnWorld_tab);
                    break;
                case "btnSociaty":
                    this.showWhatTabOnTheView(this.btnSociaty_tab);
                    break;
                case "makeBarCheck":
                    var now = this.ccsChatNode.wgt.makeBarCheck.isSelected();
                    cc.sys.localStorage.setItem(OPENBARRAGE,!now);
                    break;
                case "barComCheck":
                    var now = this.ccsChatNode.wgt.barComCheck.isSelected();
                    if(this.ccsChatNode.wgt.barInterCheck.isSelected()!=false || this.ccsChatNode.wgt.barSeniorCheck.isSelected()!=false){
                        if(now==false){
                            this.saveOneBarrageModel(SIMPLEBARRAGE,!now,true);
                            this.saveOneBarrageModel(GOLDBARRAGE,now,false);
                            this.saveOneBarrageModel(PINKBARRAGE,now,false);
                        }else{
                            this.saveOneBarrageModel(SIMPLEBARRAGE,!now,true);
                        }
                    }else{
                        this.saveOneBarrageModel(SIMPLEBARRAGE,!now,true);
                    }
                    break;
                case "barInterCheck":
                    var now = this.ccsChatNode.wgt.barInterCheck.isSelected();
                    if(this.ccsChatNode.wgt.barComCheck.isSelected()!=false || this.ccsChatNode.wgt.barSeniorCheck.isSelected()!=false ){
                        if(now==false){
                            this.saveOneBarrageModel(SIMPLEBARRAGE,now,false);
                            this.saveOneBarrageModel(GOLDBARRAGE,!now,true);
                            this.saveOneBarrageModel(PINKBARRAGE,now,false);
                        }else{
                            this.saveOneBarrageModel(GOLDBARRAGE,!now,true);
                        }
                    }
                    break;
                case "barSeniorCheck":
                    var now = this.ccsChatNode.wgt.barSeniorCheck.isSelected();
                    if(this.ccsChatNode.wgt.barComCheck.isSelected()!=false || this.ccsChatNode.wgt.barInterCheck.isSelected()!=false){
                        if(now==false){
                            this.saveOneBarrageModel(SIMPLEBARRAGE,now,false);
                            this.saveOneBarrageModel(GOLDBARRAGE,now,false);
                            this.saveOneBarrageModel(PINKBARRAGE,!now,true);
                        }else{
                            this.saveOneBarrageModel(PINKBARRAGE,!now,true);
                        }
                    }
                    break;
                default:
                    break;
            }
        }
    },
    selectedEvent:function (sender,type) {
        if(ccui.CheckBox.EVENT_UNSELECTED == type){
            sender.setSelected(true);
        }
    },
    addWorldChatList:function (data) {
        var num = this.ccsChatNode.wgt.chatList.getItems().length;
        //世界聊天30条显示限制
        if(num>=30){
            this.ccsChatNode.wgt.chatList.removeItem(1);
        }
      this.loadForOneItem(data)
    },
    updataWorldChatList:function () {
        this.ccsChatNode.wgt.chatList.removeAllChildren();
        var dataarray = chatModel.getWorldChatData();
        for(var i=0;i<dataarray.length;i++){
           this.loadForOneItem(dataarray[i]);
        }
    },
    loadForOneItem:function (data) {
        var chatItem = this.ccsChatItemNode.wgt.chatItem.clone();
        this.ccsChatNode.wgt.chatList.insertCustomItem(chatItem);
        //加载邮件item项的显示数据
        var heroIcon = ccui.helper.seekWidgetByName(chatItem,"heroIcon");
        var heroName = ccui.helper.seekWidgetByName(chatItem,"heroName");
        var heroState = ccui.helper.seekWidgetByName(chatItem,"heroState");

        heroName.setString(data.sender.name);
        heroState.setString(data.content);
        var thing = Helper.findItemId(data.sender.id);
        Helper.LoadIcoImageWithPlist(heroIcon,thing);
    },
    //显示某个tab页的内容
    showWhatTabOnTheView:function (sender) {
        if(this.choosetab == sender){
        }else{
            if(this.choosetab == null){
                this.choosetab =  sender;
            }
            this.choosetab.setBrightStyle(ccui.Widget.BRIGHT_STYLE_NORMAL);
            this.choosetab.setEnabled(true);
            sender.setBrightStyle(ccui.Widget.BRIGHT_STYLE_HIGH_LIGHT);
            sender.setEnabled(false);
            this.choosetab = sender;
            if(this.btnWorld_tab == sender){
                this.showtype = -1;
                //加载 刷新聊天列表
                this.updataWorldChatList();
                this.ccsChatNode.wgt.chatList.setVisible(true);
            }
            if(this.btnSociaty_tab == sender){
                this.showtype = -2;
                this.ccsChatNode.wgt.chatList.setVisible(false);
                ShowTipsTool.TipsFromText("未开启！！",cc.color.RED,30);
            }
        }
    },
    showBarrageSetting:function () {
        if(cc.sys.localStorage.getItem(OPENBARRAGE)=="true"){
            this.ccsChatNode.wgt.makeBarCheck.setSelected(true);
            if(cc.sys.localStorage.getItem(SIMPLEBARRAGE)=="true"){
                this.ccsChatNode.wgt.barComCheck.setSelected(true);
            }else{
                this.ccsChatNode.wgt.barComCheck.setSelected(false);
            }
            if(cc.sys.localStorage.getItem(GOLDBARRAGE)=="true"){
                this.ccsChatNode.wgt.barInterCheck.setSelected(true);
            }else{
                this.ccsChatNode.wgt.barInterCheck.setSelected(false);
            }
            if(cc.sys.localStorage.getItem(PINKBARRAGE)=="true"){
                this.ccsChatNode.wgt.barSeniorCheck.setSelected(true);
            }else{
                this.ccsChatNode.wgt.barSeniorCheck.setSelected(false);
            }
        }else{
            this.ccsChatNode.wgt.makeBarCheck.setSelected(false);
            if(cc.sys.localStorage.getItem(SIMPLEBARRAGE)=="true"){
                this.ccsChatNode.wgt.barComCheck.setSelected(true);
            }else{
                this.ccsChatNode.wgt.barComCheck.setSelected(false);
            }
            if(cc.sys.localStorage.getItem(GOLDBARRAGE) == "true"){
                this.ccsChatNode.wgt.barInterCheck.setSelected(true);
            }else{
                this.ccsChatNode.wgt.barInterCheck.setSelected(false);
            }
            if(cc.sys.localStorage.getItem(PINKBARRAGE)=="true"){
                this.ccsChatNode.wgt.barSeniorCheck.setSelected(true);
            }else{
                this.ccsChatNode.wgt.barSeniorCheck.setSelected(false);
            }
        }
    },
    saveOneBarrageModel:function (name,isselect,isclick) {
        if(name == SIMPLEBARRAGE){
            if(isclick == false){
                this.ccsChatNode.wgt.barComCheck.setSelected(isselect);
            }
            cc.sys.localStorage.setItem(SIMPLEBARRAGE,isselect);
        }
        if(name == GOLDBARRAGE){
            if(isclick == false){
                this.ccsChatNode.wgt.barInterCheck.setSelected(isselect);
            }
            cc.sys.localStorage.setItem(GOLDBARRAGE,isselect);
        }
        if(name == PINKBARRAGE){
            if(isclick == false){
                this.ccsChatNode.wgt.barSeniorCheck.setSelected(isselect);
            }
            cc.sys.localStorage.setItem(PINKBARRAGE,isselect);
        }
    }
});