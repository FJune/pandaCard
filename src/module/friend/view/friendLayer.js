
/**
 ** @Author:pandayu
 ** @Version:1.0
 ** @DateTime:2018-09-09
 ** @Project:pandaCard CardGame
 ** @Contact: QQ:815099602
 **/
 var friendLayer = baseLayer.extend({
    ctor:function () {
        this._super();
        this.LayerName = "friendLayer";
        this.show_role_simple_info_data = new Array();
        this.choose_index = 0;
        this.visitdata = new Array();
    },
    onEnter:function () {
        this._super();
        this.friend_max = this.getMaxNum(10,5,30);  //好友数量上限
        this.receive_max = this.getMaxNum(10,5,30);  //可领取次数上限
        this.send_max = this.getMaxNum(10,5,30);     //可赠送次数上限
        var self = this;
        this.friendVisitEvent = cc.EventListener.create({
            event:cc.EventListener.CUSTOM,
            eventName:"friend.serch",
            callback:function (event) {
                self.visitdata.length = 0;
                for(key in event.getUserData().data){
                    self.visitdata.push(event.getUserData().data[key]);
                }
                self.updataList(5);  //加载推荐好友列表
            }
        });
        cc.eventManager.addListener(this.friendVisitEvent, 1);

        this.giveDiamondEvent = cc.EventListener.create({
            event:cc.EventListener.CUSTOM,
            eventName:"friend.give",
            callback:function (event) {
               var state = event.getUserData().status;
                if(state==0){ //赠送成功
                    self.updataList(1);
                }
            }
        });
        cc.eventManager.addListener(this.giveDiamondEvent, 1);

        this.getDiamondEvent = cc.EventListener.create({
            event:cc.EventListener.CUSTOM,
            eventName:"friend.receive",
            callback:function (event) {
                var state = event.getUserData().status;
                if(state==0){ //领取成功
                    self.updataList(2);
                }
            }
        });
        cc.eventManager.addListener(this.getDiamondEvent, 1);

        this.addFriendEvent = cc.EventListener.create({
            event:cc.EventListener.CUSTOM,
            eventName:"friend.append",
            callback:function (event) {
                var state = event.getUserData().status;
                if(state==0){ //添加好友申请成功
                    //提示发送添加好友申请成功
                    ShowTipsTool.TipsFromText(STRINGCFG[100230].string,cc.color.GREEN,30);
                    if(self.firendNode.wgt.Panel_Add.isVisible()==true){
                        self.firendNode.wgt.Panel_Add.setVisible(false);
                        self.firendNode.wgt.TextField_Name.setString("");
                    }else{
                        //改变推荐列表点击添加好友之后 那一项移除掉
                        var index = self.firendNode.wgt.recomList.getIndex(self.recomList_item_array[self.choose_index]);
                        self.firendNode.wgt.recomList.removeItem(index);
                    }
                }
            }
        });
        cc.eventManager.addListener(this.addFriendEvent, 1);

        //同意好友申请事件
        this.agreeFriendEvent = cc.EventListener.create({
            event:cc.EventListener.CUSTOM,
            eventName:"friend.apply",
            callback:function (event) {
                var state = event.getUserData().status;
                if(state==0){
                    var index = self.firendNode.wgt.friendList.getIndex(self.friendList_item_array[self.choose_index]);
                    self.firendNode.wgt.friendList.removeItem(index);
                    self.firendNode.wgt.taskImage1.setVisible(true);
                }
            }
        });
        cc.eventManager.addListener(this.agreeFriendEvent, 1);

        //黑名单事件
        this.blackListEvent = cc.EventListener.create({
            event:cc.EventListener.CUSTOM,
            eventName:"friend.blacklist",
            callback:function (event) {
                var state = event.getUserData().status;
                if(state==0){
                    var index = self.firendNode.wgt.friendList.getIndex(self.friendList_item_array[self.choose_index]);
                    self.firendNode.wgt.friendList.removeItem(index);
                    var data = self.getListdataByType(1);
                    self.firendNode.wgt.Text_friend.setString("当前好友数量:"+data.length+"/"+self.friend_max);
                }
            }
        });
        cc.eventManager.addListener(this.blackListEvent, 1);
        //删除好友事件
        this.removeFriendEvent = cc.EventListener.create({
            event:cc.EventListener.CUSTOM,
            eventName:"friend.remove",
            callback:function (event) {
                var state = event.getUserData().status;
                if(state==0){
                    var index = self.firendNode.wgt.friendList.getIndex(self.friendList_item_array[self.choose_index]);
                    self.firendNode.wgt.friendList.removeItem(index);
                }
            }
        });
        cc.eventManager.addListener(this.removeFriendEvent, 1);
    },
    onExit:function () {
        this._super();
        cc.eventManager.removeListener(this.friendVisitEvent);
        cc.eventManager.removeListener(this.giveDiamondEvent);
        cc.eventManager.removeListener(this.getDiamondEvent);
        cc.eventManager.removeListener(this.addFriendEvent);
        cc.eventManager.removeListener(this.agreeFriendEvent);
        cc.eventManager.removeListener(this.blackListEvent);
        cc.eventManager.removeListener(this.removeFriendEvent);
    },
    initUI:function () {
        this.firendNode = ccsTool.load(res.uiFriendLayer,["btnOne","btnTwo","btnThree","btnFour","friendList","Text_have","Text_friend","Text_can","Node_friend","btnChoose","btnFAdd","btnSNo","Panel_recommended","backBtn","recomList","Panel_Add","btnNo2","btnAdd2","TextField_Name",
            "Panel_Sdate","bagBg1","bagIcon1","friendName1","lvText1","combText1","areText1","btnNo1","btnTipsOk","btnWar","btnChat","btnSee","Node_diamond","Node_shen","btnFree","mainbtnback",
        "taskImage1","taskImage2","taskImage3"]);
        this.firendItem = ccsTool.load(res.uiFriendItem,["friendItem"]);
        this.addChild(this.firendNode.node,2);
        this.firendNode.wgt.btnOne.addTouchEventListener(this.touchEvent,this);
        this.firendNode.wgt.btnTwo.addTouchEventListener(this.touchEvent,this);
        this.firendNode.wgt.btnThree.addTouchEventListener(this.touchEvent,this);
        this.firendNode.wgt.btnFour.addTouchEventListener(this.touchEvent,this);
        this.firendNode.wgt.btnChoose.addTouchEventListener(this.touchEvent,this);
        this.firendNode.wgt.btnFAdd.addTouchEventListener(this.touchEvent,this);
        this.firendNode.wgt.backBtn.addTouchEventListener(this.touchEvent,this);
        this.firendNode.wgt.mainbtnback.addTouchEventListener(this.touchEvent,this);
        this.firendNode.wgt.btnSNo.addTouchEventListener(this.touchEvent,this);
        this.firendNode.wgt.btnNo2.addTouchEventListener(this.touchEvent,this);
        this.firendNode.wgt.btnAdd2.addTouchEventListener(this.touchEvent,this);
        this.firendNode.wgt.btnNo1.addTouchEventListener(this.touchEvent,this);
        this.firendNode.wgt.btnTipsOk.addTouchEventListener(this.touchEvent,this);
        this.firendNode.wgt.btnFree.addTouchEventListener(this.touchEvent,this);
        this.firendNode.wgt.Panel_Sdate.addTouchEventListener(this.touchEvent,this);
        this.showWhatTabOnTheView(this.firendNode.wgt.btnOne);

        this.firendNode.wgt.recomList.setScrollBarEnabled(false);
        this.firendNode.wgt.friendList.setScrollBarEnabled(false);
        this.dealRedPoint(null);
    },
    touchEvent:function (sender,type) {
        if(ccui.Widget.TOUCH_ENDED == type){
            switch(sender.name){
                case "btnOne":
                    this.showWhatTabOnTheView(this.firendNode.wgt.btnOne);
                    break;
                case "btnTwo":
                    this.showWhatTabOnTheView(this.firendNode.wgt.btnTwo);
                    break;
                case "btnThree":
                    this.showWhatTabOnTheView(this.firendNode.wgt.btnThree);
                    break;
                case "btnFour":
                    this.showWhatTabOnTheView(this.firendNode.wgt.btnFour);
                    break;
                case "btnChoose":   //显示推荐好友界面刷新数据
                    this.firendNode.wgt.Panel_recommended.setVisible(true);
                    friendModel.getVisitFriend();
                    break;
                case "btnFAdd":
                    this.firendNode.wgt.Panel_Add.setVisible(true);
                    break;
                case "backBtn":
                    this.firendNode.wgt.Panel_recommended.setVisible(false);
                    break;
                case "mainbtnback":
                        this.removeFromParent();
                    break;
                case "btnSNo": //一键拒绝
                    friendModel.applyFriend(1,2,2);
                    break;
                case "btnNo2":
                    this.firendNode.wgt.Panel_Add.setVisible(false);
                    break;
                case "btnAdd2":
                    var idorname = this.firendNode.wgt.TextField_Name.getString();
                    if(idorname==""){
                        //提示请输入
                    }else{
                        friendModel.addFriend(idorname);
                    }
                    break;
                case "btnGo":  //赠送
                    var id = sender.getTag();
                    friendModel.giveDiamond(id,1);
                    break;
                case "btnGet":  //领取
                    var id = sender.getTag();
                    friendModel.getDiamond(id,1);
                    break;
                case "btnFree":
                    friendModel.getDiamond(1,2);
                case "btnOut":  //移除
                    var id = this.show_role_simple_info_data[this.choose_index].id;
                    friendModel.blackListAbout(id,1,2);
                    break;
                case "btnAdd":  //添加好友
                    this.choose_index = sender.getTag();
                    var id = this.visitdata[this.choose_index].id;
                    friendModel.addFriend(id);
                   // this.updataList(5);
                    break;
                case "btnAgree":   //同意申请
                    var id = this.show_role_simple_info_data[this.choose_index].id;
                    friendModel.applyFriend(id,1,1);
                    break;
                case "btnNo":   //拒绝申请
                    var id = this.show_role_simple_info_data[this.choose_index].id;
                    friendModel.applyFriend(id,1,2);
                    break;
                //好友详细项
                case "btnNo1":  //删除好友
                    var id = this.show_role_simple_info_data[this.choose_index].id;
                    friendModel.deleteFriend(id);
                    this.firendNode.wgt.Panel_Sdate.setVisible(false);
                    break;
                case "btnTipsOk": //拉黑
                    var id = this.show_role_simple_info_data[this.choose_index].id;
                    friendModel.blackListAbout(id,1,1);
                    this.firendNode.wgt.Panel_Sdate.setVisible(false);
                    break;
                case "btnWar": //切磋

                    break;
                case "btnChat": //聊天

                    break;
                case "btnSee": //查看阵容

                    break;
                case "Panel_Sdate":  //
                    this.firendNode.wgt.Panel_Sdate.setVisible(false);
                    break;
                default:
                    break;
            }
        }
    },
    //显示某个tab页的内容
    showWhatTabOnTheView:function (sender) {
        if(this.choosetab == sender){

        }
        else{
            if(this.choosetab == null){
                this.choosetab =  sender;
            }
         //   this.choosetab.setBrightStyle(ccui.Widget.BRIGHT_STYLE_NORMAL);
            this.choosetab.setBright(true);
            this.choosetab.setEnabled(true);
         //   sender.setBrightStyle(ccui.Widget.BRIGHT_STYLE_HIGH_LIGHT);
            sender.setBright(false);
            sender.setEnabled(false);
            this.choosetab = sender;
            if(this.firendNode.wgt.btnOne == sender){
                //加载 刷新好友列表
                this.updataList(1);
                this.firendNode.wgt.Node_friend.setVisible(true);
                this.firendNode.wgt.Node_diamond.setVisible(false);
                this.firendNode.wgt.Node_shen.setVisible(false);
            }
            if(this.firendNode.wgt.btnTwo == sender){
                //加载 刷新领取列表
                this.updataList(2);
                this.firendNode.wgt.Node_friend.setVisible(false);
                this.firendNode.wgt.Node_diamond.setVisible(true);
                this.firendNode.wgt.Node_shen.setVisible(false);
            }
            if(this.firendNode.wgt.btnThree == sender){
                //加载 刷新好友申请列表
                this.updataList(3);
                this.firendNode.wgt.Node_friend.setVisible(false);
                this.firendNode.wgt.Node_diamond.setVisible(false);
                this.firendNode.wgt.Node_shen.setVisible(true);
            }
            if(this.firendNode.wgt.btnFour == sender){
                //加载 刷新黑名单列表
                this.updataList(4);
                this.firendNode.wgt.Node_friend.setVisible(false);
                this.firendNode.wgt.Node_diamond.setVisible(false);
                this.firendNode.wgt.Node_shen.setVisible(false);
            }
        }
    },
    //获取列表数据或刷新
    updataList:function (type) {
        var data = null;
        if(type==5){
            data = this.visitdata.sort(this.inerducepaixu);
            this.firendNode.wgt.recomList.removeAllChildren();
        }else{
            data = this.getListdataByType(type);
            this.firendNode.wgt.friendList.removeAllChildren();
            this.updataBottom(type,data);
        }
        //清空数据
        this.show_role_simple_info_data.length = 0;
        //当前时间
        var now_time = Date.parse(new Date());
        this.recomList_item_array = new Array();
        this.friendList_item_array = new Array();
        for(i=0;i<data.length;i++){
            this.loadForOneItem(data[i],type,i,now_time)
        }
        if(type==1){
            this.firendNode.wgt.taskImage1.setVisible(false);
        }
    },
    //更新不同tab页底部数据
    updataBottom:function (type,data) {
        if(type==1){
            this.firendNode.wgt.Text_friend.setString("当前好友数量:"+data.length+"/"+ this.friend_max);
        }
        if(type==2){
            this.firendNode.wgt.Text_can.setString("今日已领取次数:"+GLOBALDATA.base.receive+"/"+ this.receive_max);
            if(data.length>0){
                this.firendNode.wgt.btnFree.setEnabled(true);
                this.firendNode.wgt.btnFree.setBright(true);
            }else{
                this.firendNode.wgt.btnFree.setEnabled(false);
                this.firendNode.wgt.btnFree.setBright(false);
            }
        }
        if(type==3){
            var friendData = this.getListdataByType(1);
            this.firendNode.wgt.Text_have.setString("当前好友数量:"+friendData.length+"/"+ this.friend_max);
            if(data.length>0){
                this.firendNode.wgt.btnSNo.setEnabled(true);
                this.firendNode.wgt.btnSNo.setBright(true);
            }else{
                this.firendNode.wgt.btnSNo.setEnabled(false);
                this.firendNode.wgt.btnSNo.setBright(false);
            }
        }
    },
    loadForOneItem:function (data,type,i,now_time) {
        var role_simple_info_this = null;
        var friendItem_one = this.firendItem.wgt.friendItem.clone();
        if(type == 5){
            this.firendNode.wgt.recomList.pushBackCustomItem(friendItem_one);
            this.recomList_item_array.push(friendItem_one);
        }else{
            this.firendNode.wgt.friendList.pushBackCustomItem(friendItem_one);
            this.friendList_item_array.push(friendItem_one);
        }
        var btnGo = ccui.helper.seekWidgetByName(friendItem_one,"btnGo");   //赠送按钮
        var btnGo_text = ccui.helper.seekWidgetByName(friendItem_one,"textTipsTitleTips");//赠送按钮的text
        var btnGet =  ccui.helper.seekWidgetByName(friendItem_one,"btnGet"); //领取按钮
        var btnOut = ccui.helper.seekWidgetByName(friendItem_one,"btnOut");  //移除按钮
        var btnAdd = ccui.helper.seekWidgetByName(friendItem_one,"btnAdd");  //添加好友按钮
        var btnAgree = ccui.helper.seekWidgetByName(friendItem_one,"btnAgree"); //同意按钮
        var btnNo = ccui.helper.seekWidgetByName(friendItem_one,"btnNo");    //拒绝按钮
        var bagBg = ccui.helper.seekWidgetByName(friendItem_one,"bagBg");
        var bagIcon = ccui.helper.seekWidgetByName(friendItem_one,"bagIcon");
        var friendName = ccui.helper.seekWidgetByName(friendItem_one,"friendName");
        var timeText = ccui.helper.seekWidgetByName(friendItem_one,"timeText");
        var lvText =  ccui.helper.seekWidgetByName(friendItem_one,"lvText");
        var combText = ccui.helper.seekWidgetByName(friendItem_one,"combText");
        var areText = ccui.helper.seekWidgetByName(friendItem_one,"areText");
        if(type == 1){
            role_simple_info_this = data.info;
            btnGo.setVisible(true);
            btnGet.setVisible(false);
            btnAgree.setVisible(false);
            btnAdd.setVisible(false);
            btnOut.setVisible(false);
            if(data.g ==1){
                btnGo.setBright(true);
                btnGo.setEnabled(true);
                btnGo_text.setString("赠送钻石");
                btnGo.setTag(role_simple_info_this.id);
            }else{
                btnGo.setBright(false);
                btnGo.setEnabled(false);
                btnGo_text.setString("已赠送");
            }
            bagIcon.addTouchEventListener(function () {
                this.choose_index = i;
                this.firendNode.wgt.Panel_Sdate.setVisible(true);
                this.setBaseInformation(this.firendNode.wgt.friendName1,null,this.firendNode.wgt.lvText1,this.firendNode.wgt.combText1,this.firendNode.wgt.areText1,this.firendNode.bagIcon1,this.firendNode.bagBg1,role_simple_info_this);
            },this);
        }
        if(type == 2){
            role_simple_info_this = data.info;
            btnGo.setVisible(false);
            btnGet.setVisible(true);
            btnAgree.setVisible(false);
            btnAdd.setVisible(false);
            btnOut.setVisible(false);
            if(data.r == 1){
                btnGet.setBright(true);
                btnGet.setEnabled(true);
                btnGet.setTag(data.info.id);
            }else{
                btnGet.setBright(false);
                btnGet.setEnabled(false);
            }
        }
        if(type == 3){
            role_simple_info_this = data.info;
            btnGo.setVisible(false);
            btnGet.setVisible(false);
            btnAgree.setVisible(true);
            btnAdd.setVisible(false);
            btnOut.setVisible(false);
        }
        if(type == 4){
            role_simple_info_this = data.info;
            btnGo.setVisible(false);
            btnGet.setVisible(false);
            btnAgree.setVisible(false);
            btnAdd.setVisible(false);
            btnOut.setVisible(true);
        }
        if(type == 5){
            role_simple_info_this = data;
            btnGo.setVisible(false);
            btnGet.setVisible(false);
            btnAgree.setVisible(false);
            btnAdd.setVisible(true);
            btnOut.setVisible(false);
        }
        this.show_role_simple_info_data.push(role_simple_info_this);
        btnGo.addTouchEventListener(this.touchEvent,this);
        btnGet.addTouchEventListener(this.touchEvent,this);
        btnAdd.setTag(i);
        btnAdd.addTouchEventListener(this.touchEvent,this);
        btnOut.addTouchEventListener(this.touchEvent,this);
        btnAgree.addTouchEventListener(this.touchEvent,this);
        btnNo.addTouchEventListener(this.touchEvent,this);

        this.setBaseInformation(friendName,timeText,lvText,combText,areText,bagIcon,bagBg,role_simple_info_this,now_time);
    },
    setBaseInformation:function (name,time,lv,comb,are,icon,bg,role_simple_info,now_time) { //设置每一项基本信息
        if(name!=null){
            name.setString(role_simple_info.name);
        }
        if(time!=null){
            if(role_simple_info.on==1){
                time.setString("在线");
            }else{
                var offline_time = now_time-role_simple_info.ont*1000;
                var str = Helper.formatOfflineTime(offline_time/1000);
                time.setString(str);
            }
        }
        if(lv!=null){
            lv.setString("等级:"+role_simple_info.lev);
        }
       if(comb!=null){
           comb.setString("战力:"+role_simple_info.atk);
       }
       if(are!=null){
           are.setString(role_simple_info.un);
       }
        //var thing = Helper.findItemId(role_simple_info.id);
        // if(icon!=null){
        //     Helper.LoadIcoImageWithPlist(icon,thing);
        // }
        // if(bg!=null){
        //     Helper.LoadFrameImageWithPlist(bg,thing.quality);
        // }
    },
    getListdataByType:function (type) {
        var listData = new Array();
        if(type == 1){
            for(key in GLOBALDATA.friends){
                if(GLOBALDATA.friends[key].typ==2){
                    listData.push(GLOBALDATA.friends[key]);
                    listData.sort(this.friewndPaiXu);
                }
            }
        }
        if(type == 2){
            for(key in GLOBALDATA.friends){
                if(GLOBALDATA.friends[key].typ==2 && GLOBALDATA.friends[key].r==1){
                    listData.push(GLOBALDATA.friends[key]);
                    listData.sort(this.lastPaiXu);
                }
            }
        }
        if(type == 3){
            for(key in GLOBALDATA.friends){
                if(GLOBALDATA.friends[key].typ == 1){
                    listData.push(GLOBALDATA.friends[key]);
                    listData.sort(this.lastPaiXu);
                }
            }
        }
        if(type == 4){
            for(key in GLOBALDATA.friends){
                if(GLOBALDATA.friends[key].typ == 3){
                    listData.push(GLOBALDATA.friends[key]);
                    listData.sort(this.lastPaiXu);
                }
            }
        }
        return listData;
    },
    //好友列表排序规则
    friewndPaiXu:function (a,b) {
        if(a.g>b.g){
            return 1;
        }else{
            if(a.info.on<b.info.on){
                return 1;
            }else{
                if(a.info.lev<b.info.lev){
                    return 1;
                }else{
                    if(a.info.ont<b.info.ont){
                        return 1;
                    }else{
                        return -1;
                    }
                }
            }
        }
    },
    //领取列表排序规则,申请列表排序,黑名单排序
    lastPaiXu:function (a,b) {
        if(a.info.on<b.info.on){
            return 1;
        }else{
            if(a.info.lev<b.info.lev){
                return 1;
            }else{
                if(a.info.atk<b.info.atk){
                    return 1;
                }else{
                    return -1;
                }
            }
        }
    },
    //推荐好友排序
    inerducepaixu:function (a,b) {
        if(a.on<b.on){
            return 1;
        }else{
            if(a.lev<b.lev){
                return 1;
            }else{
                if(a.atk<b.atk){
                    return 1;
                }else{
                    return -1;
                }
            }
        }
    },
    //获取显示最大上限值  base 初始值 every 每次增加的条件  max  最大值
    getMaxNum:function (base,every,max) {
        var mylv = GLOBALDATA.base.lev;
        var baseMaxNum = base;
        var beishu = Math.floor(mylv/every);
        if(beishu>=1){
            baseMaxNum = baseMaxNum + beishu;
            if(baseMaxNum>max){
                baseMaxNum = max;
            }
        }
        return baseMaxNum;
    },

    dealRedPoint:function(data){
        var redInfo = RedPoint.friendPanleRedPoint(data);
        if(redInfo!=null){
            if(redInfo.lingqu==true){
                //显示好友领取界面红点
                this.firendNode.wgt.taskImage2.setVisible(true);
            }else{
                this.firendNode.wgt.taskImage2.setVisible(false);
            }
            if(redInfo.shenqing==true){
                this.firendNode.wgt.taskImage3.setVisible(true);
            }else{
                this.firendNode.wgt.taskImage3.setVisible(false);
            }
        }
    }
});