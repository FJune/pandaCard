
/**
 ** @Author:pandayu
 ** @Version:1.0
 ** @DateTime:2018-09-09
 ** @Project:pandaCard CardGame
 ** @Contact: QQ:815099602
 **/
 /*
by xiongrui  2016.11.07
* */
var emailLayer = ModalDialog.extend({
    chooseMailId:0,
    ctor:function () {
        // 1. super init first
        this._super();
        this.LayerName = "emailLayer";
        return true;
    },
    onEnter:function () {
        this._super();
        var self = this;
        this.emailAppendEvent = cc.EventListener.create({
            event:cc.EventListener.CUSTOM,
            eventName:"mailbox.append",
            callback:function (event) {
                var appenddata = event.getUserData().mailbox_append_data;
                //更新界面  添加新增邮件项
                self.updataEmailListData();
            }
        });
        cc.eventManager.addListener(this.emailAppendEvent, 1);

        this.emailUpdataEvent = cc.EventListener.create({
            event:cc.EventListener.CUSTOM,
            eventName:"mail.read",
            callback:function (event) {
                var data = event.getUserData();
                //更新界面  修改对应更新内容邮件项
                if(data.status==0){
                    self.updataEmailListData();
                }else{

                }
            }
        });
        cc.eventManager.addListener(this.emailUpdataEvent, 1);

        this.emailRemoveEvent = cc.EventListener.create({
            event:cc.EventListener.CUSTOM,
            eventName:"mail.receive",
            callback:function (event) {
                var data = event.getUserData();
                //更新界面  修改对应更新内容邮件项
                if(data.status==0){
                    self.updataEmailListData();
                }else{

                }
            }
        });
        cc.eventManager.addListener(this.emailRemoveEvent, 1);
    },
    onExit:function () {
        this._super();
    },
    initUI:function () {
        this.emailLayernode = ccs.load(res.uiEmailLayer).node;
        this.addChild(this.emailLayernode);
        this.emailLayernode.setAnchorPoint(0.5,0.5);
        this.emailLayernode.setPosition(cc.winSize.width/2,cc.winSize.height/2);
        this.emailList = ccui.helper.seekWidgetByName(this.emailLayernode,"emailList");
        this.panelEmail = ccui.helper.seekWidgetByName(this.emailLayernode,"panelEmail");
        this.emailBg = ccui.helper.seekWidgetByName(this.emailLayernode,"emailBg");

        //panelEmail子layer下的组件
        this.textState = ccui.helper.seekWidgetByName(this.emailLayernode,"textState");
        this.emaiGetlList = ccui.helper.seekWidgetByName(this.emailLayernode,"emaiGetlList");

        this.emailShowItem = ccui.helper.seekWidgetByName(ccs.load(res.uiEmailItem).node, "emailBg");
        //邮件关闭按钮
        var backBtn = ccui.helper.seekWidgetByName(this.emailLayernode, "btnClose");
        backBtn.addTouchEventListener(this.btnTouchEvent,this);
        //邮件详细界面，返回按钮
        var secondBackBtn = ccui.helper.seekWidgetByName(this.emailLayernode, "backBtn");
        secondBackBtn.addTouchEventListener(this.btnTouchEvent,this);
        //邮件详细界面，领取按钮
        this.getBtn = ccui.helper.seekWidgetByName(this.emailLayernode, "btnGet");
        this.getBtn.addTouchEventListener(this.btnTouchEvent,this);
        //邮件一键领取按钮
        var allBtn = ccui.helper.seekWidgetByName(this.emailLayernode,"btnAll");
        allBtn.addTouchEventListener(this.btnTouchEvent,this);

        this.emailList.setScrollBarEnabled(false);
        this.emaiGetlList.setScrollBarEnabled(false);
        //加载邮件列表数据
        this.updataEmailListData();

        var self = this;
        this.emailList.addEventListener(function (sender,type) {
            switch(type){
                case ccui.ListView.ON_SELECTED_ITEM_END:
                    //显示详细邮件信息
                    var emailShowItem = self.emailList.getItem(sender.getCurSelectedIndex());
                    var mailid = emailShowItem.getTag();
                    var mail = GLOBALDATA.mailbox[mailid];
                    self.emaiGetlList.removeAllChildren();
                    if (mail!=null){
                        self.chooseMailId = mailid;
                        var mail_profit = mail.p;
                        var hasprofit = false;
                        for(var key in mail_profit){
                            hasprofit = true;
                            var thing_num = mail_profit[key];
                            var emailBg = self.emailBg.clone();
                            var thing = Helper.findItemId(key);
                            self.emaiGetlList.pushBackCustomItem(emailBg);
                            var emailIcon = ccui.helper.seekWidgetByName(emailBg,"emailIcon");
                            var emailPieces = ccui.helper.seekWidgetByName(emailBg,"emailPieces");
                            var emailNum = ccui.helper.seekWidgetByName(emailBg,"emailNum");
                            emailNum.setString(thing_num.toString());
                            Helper.LoadIconFrameAndAddClick(emailIcon,self.emailBg,emailPieces,thing);
                        }
                        self.getBtn.setVisible(hasprofit)
                        self.textState.setString(mail.c);
                        self.panelEmail.setVisible(true);
                    }
                    break;
                default:
                    break;
            }
        });
        
    },
    updataEmailListData:function () {
        this.emailList.removeAllChildren();
        var mailboxListData = this.getMailboxListdata();
        for(var i=0;i<mailboxListData.length;i++){
            var mail = GLOBALDATA.mailbox[mailboxListData[i]];
            this.emailShowItem = this.emailShowItem.clone();
            this.emailShowItem.setTag(mailboxListData[i]);
            this.emailList.pushBackCustomItem(this.emailShowItem);
            //加载邮件item项的显示数据
            var emailIcon = ccui.helper.seekWidgetByName(this.emailShowItem,"emailIcon");
            var emailName = ccui.helper.seekWidgetByName(this.emailShowItem,"emailName");
            var emailTime = ccui.helper.seekWidgetByName(this.emailShowItem,"emailTime");
            emailName.setString(mail.h);
            emailTime.setString(Helper.formatDate(new Date(mail.r*1000),1));
        }
    },
    btnTouchEvent:function (sender,type) {
        if(ccui.Widget.TOUCH_ENDED==type){
            switch(sender.name){
                case "btnAll":
                    //邮件一键获取
                    emailModel.getThingByEmail(-1);
                    //测试发送邮件的功能
                    // var sendjson = {"22001":1,"22002":2};
                    // emailModel.sendEmail("sss","测试发送邮件","666666",sendjson);
                    break;
                case "btnGet":
                    //邮件获取附件
                    if(this.chooseMailId!=0){
                        emailModel.getThingByEmail(parseInt(this.chooseMailId));
                        this.panelEmail.setVisible(false);
                    }
                    break;
                case "btnClose":
                    //关闭按钮
                    cc.eventManager.removeListener(this.emailAppendEvent);
                    cc.eventManager.removeListener(this.emailUpdataEvent);
                    cc.eventManager.removeListener(this.emailRemoveEvent);
                    this.removeFromParent();
                    break;
                case "backBtn":
                    //邮件详细界面返回按钮 如果是不含附件邮件 从邮件列表删除
                    var mail = GLOBALDATA.mailbox[this.chooseMailId];
                    var hasprofit = false;
                    for(var key in mail.p){
                        hasprofit = true;
                        break;
                    }
                    if(hasprofit == false){
                        //通知服务器删除数据
                        emailModel.readEmail(parseInt(this.chooseMailId));
                    }
                    this.panelEmail.setVisible(false);
                    break;
                default:
                    break;
            }
        }
    },
    //排序规则排序
    getMailboxListdata:function () {
        var mailboxListdata = new Array();
        for( key in GLOBALDATA.mailbox){
            mailboxListdata.push(key);
        }
        mailboxListdata.sort(function (a,b) {
            return  GLOBALDATA.mailbox[b].r- GLOBALDATA.mailbox[a].r
        });
        return mailboxListdata;
    }
});