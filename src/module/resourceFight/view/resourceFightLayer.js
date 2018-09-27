
/**
 ** @Author:pandayu
 ** @Version:1.0
 ** @DateTime:2018-09-09
 ** @Project:pandaCard CardGame
 ** @Contact: QQ:815099602
 **/
 var resourceFightLayer = baseLayer.extend({
    ctor:function () {
        this._super();
        this.LayerName = "resourceFightLayer";
        this.uiAttributeLayer.setVisible(false);
    },
    onEnter:function (){
        this._super();
        var self = this;
        this.inspireEvent = cc.EventListener.create({
            event:cc.EventListener.CUSTOM,
            eventName:"resource.inspire",
            callback:function (event) {
                var state = event.getUserData().status;
                if(state==0){
                    //刷新鼓舞数据
                    self.setGuwuSet(event.getUserData().num);
                }
            }
        });
        cc.eventManager.addListener(this.inspireEvent, 1);

        this.startFightEvent = cc.EventListener.create({
            event:cc.EventListener.CUSTOM,
            eventName:"resource.stagebegin",
            callback:function (event) {
                var status = event.getUserData().status;
                if(status==0){
                    var stage = PLUNDERSTAGECFG[self.fightid].stage;
                 //   var type = STAGECFG[stage].datasources;
                    if(self.city_info[self.fightid]==null){ //攻打村庄
                        self.resource_combatLayer = new combatLayer(2,stage,"resourceFightEvent");
                    }else{//攻打城镇
                        if(self.city_info[self.fightid].hid!=0){
                            self.ispvp = true;
                            self.resource_combatLayer = new combatLayer(3,stage,"resourceFightEvent");
                        }else{
                            self.ispvp = false;
                            self.resource_combatLayer = new combatLayer(2,stage,"resourceFightEvent");
                        }
                    }
                    // self.resource_combatLayer = new combatLayer(type,stage,"resourceFightEvent");
                    self.addChild(self.resource_combatLayer,3);
                }
            }
        });
        cc.eventManager.addListener(this.startFightEvent, 1);

        this.endFightEvent = cc.EventListener.create({
            event:cc.EventListener.CUSTOM,
            eventName:"resource.stage",
            callback:function (event) {
                var status = event.getUserData().status;
                if(status==0){
                    var image_array = [[self.warResLayer.wgt.bagBg1,self.warResLayer.wgt.bagIcon1,self.warResLayer.wgt.bagPieces1,self.warResLayer.wgt.textNum1],[self.warResLayer.wgt.bagBg2,self.warResLayer.wgt.bagIcon2,self.warResLayer.wgt.bagPieces2,self.warResLayer.wgt.textNum2],
                        [self.warResLayer.wgt.bagBg3,self.warResLayer.wgt.bagIcon3,self.warResLayer.wgt.bagPieces3,self.warResLayer.wgt.textNum3]];
                    for(var i=0;i<image_array.length;i++){
                        image_array[i][0].setVisible(false);
                    }
                    if(self.result!=null){
                        if(self.result=="victory"){
                            //显示战斗胜利界面
                            //   self.warResLayer.wgt.textTitleWin.setString("战斗胜利");
                            self.warResLayer.wgt.ImageFastlose.setVisible(false);
                            self.warResLayer.wgt.ImageFastWin.setVisible(true);
                            var reward_array = PLUNDERSTAGECFG[self.fightid].reward;
                            for(var i=0;i<reward_array.length;i++){
                                var id = reward_array[i][0];
                                var num = reward_array[i][1];
                                image_array[i][0].setVisible(true);
                                Helper.LoadFrameImageWithPlist(image_array[i][0],ITEMCFG[id].quality);
                                Helper.LoadIcoImageWithPlist(image_array[i][1],ITEMCFG[id]);
                                image_array[i][3].setString(num);
                            }
                            self.warResLayer.wgt.btnResOk.addTouchEventListener(function (sender,type) {
                                if(type == ccui.Widget.TOUCH_ENDED){
                                    self.warResLayer.node.removeFromParent();
                                    self.resource_combatLayer.removeFromParent();
                                    self.reourceNode.wgt.Panel_5.setVisible(false);
                                    self.loadMainInformation();
                                    self.resourceGet(event.getUserData());
                                }
                            });
                        }else{
                            self.warResLayer.wgt.btnLoseOk.addTouchEventListener(function (sender,type) {
                                if(type == ccui.Widget.TOUCH_ENDED){
                                    self.warResLayer.node.removeFromParent();
                                    self.resource_combatLayer.removeFromParent();
                                    self.reourceNode.wgt.Panel_5.setVisible(false);
                                    self.loadMainInformation();
                                    self.resourceGet(event.getUserData());
                                }
                            });
                            //显示战斗失败界面
                            self.warResLayer.wgt.ImageFastlose.setVisible(true);
                            self.warResLayer.wgt.ImageFastWin.setVisible(false);
                        }
                    }else{
                        //扫荡返回处理
                        self.loadMainInformation();
                        self.sweepResult(event.getUserData());
                    }
                    self.result = null;
                    self.warResLayer.wgt.btnResOk.addTouchEventListener(function (sender,type) {
                        if(type == ccui.Widget.TOUCH_ENDED){
                            self.warResLayer.node.removeFromParent();
                            self.resource_combatLayer.removeFromParent();
                            self.reourceNode.wgt.Panel_5.setVisible(false);
                            self.loadMainInformation();
                            self.resourceGet(event.getUserData());
                        }
                    });
                }
            }
        });
        cc.eventManager.addListener(this.endFightEvent, 1);

        this.resourceFightEvent = cc.EventListener.create({
            event:cc.EventListener.CUSTOM,
            eventName:"resourceFightEvent",
            callback:function (event) {
                self.result = event.getUserData().result;
                self.addChild(self.warResLayer.node,3);
                if(self.result=="victory"){
                    //结束接口调用
                    resourceFight.stopFight(self.fightid,1,0);
                }else{
                    resourceFight.stopFight(self.fightid,0,0);
                }
            }
        });
        cc.eventManager.addListener(this.resourceFightEvent, 1);

        this.getCityEvent = cc.EventListener.create({
            event:cc.EventListener.CUSTOM,
            eventName:"resource.getinfo",
            callback:function (event) {
                if(event.getUserData().status==0){
                    self.city_info = {};
                    for(var j=0;j<self.small_nametime_array.length;j++){
                        self.small_nametime_array[j][0].setVisible(false);
                        self.small_nametime_array[j][1].setVisible(false);
                    }
                    for(var key in event.getUserData().data){
                        self.city_info[event.getUserData().data[key].id] = event.getUserData().data[key]
                        if(event.getUserData().data[key].id>=15){
                            if(self.small_nametime_array[event.getUserData().data[key].id-15]!=null){
                                self.small_nametime_array[event.getUserData().data[key].id-15][0].setVisible(true);
                                if(event.getUserData().data[key].hid==0){
                                    self.small_nametime_array[event.getUserData().data[key].id-15][0].setString("");
                                }else{
                                    self.small_nametime_array[event.getUserData().data[key].id-15][0].setString(event.getUserData().data[key].name);
                                }
                                if(event.getUserData().data[key].t!=0){
                                    self.small_nametime_array[event.getUserData().data[key].id-15][1].setVisible(true);
                                    self.small_nametime_array[event.getUserData().data[key].id-15][1].setString(Helper.formatDate(new Date(event.getUserData().data[key].t*1000),2));
                                }else{
                                    self.small_nametime_array[event.getUserData().data[key].id-15][1].setVisible(false);
                                }
                            }
                        }
                    }
                }
            }
        });
        cc.eventManager.addListener(this.getCityEvent, 1);

        this.getZhenrongEvent = cc.EventListener.create({
            event:cc.EventListener.CUSTOM,
            eventName:"getinfo.battle",
            callback:function (event) {
                if(event.getUserData().status==0){
                    self.now_fight_data = event.getUserData().data;
                    //显示大关卡的详细信息界面
                    var commanderid = self.now_fight_data.commanders[0]
                    var name = self.now_fight_data.name;

                    self.reourceNode.wgt.bagTItemName.setString(name);
                    self.reourceNode.wgt.bagTItemMy.setString("我方全属性提升:"+self.now_percent+"%");
                    self.reourceNode.wgt.bagTItemYour.setString("敌方全属性提升:"+0+"%");
                    //显示指挥官模型
                    var modelShowLayout = self.reourceNode.wgt.Panel_hero;
                    modelShowLayout.removeAllChildren();
                    HeroDefault.runAdle(commanderid,modelShowLayout,0,0,1,3);
                    //显示奖励结果
                    var reward_array = PLUNDERSTAGECFG[id].reward;
                    var bg_array = [[self.reourceNode.wgt.bagTItemBg1,self.reourceNode.wgt.bagTItemIcon1,self.reourceNode.wgt.bagTItemNum1],[self.reourceNode.wgt.bagTItemBg2,self.reourceNode.wgt.bagTItemIcon2,self.reourceNode.wgt.bagTItemNum2],[self.reourceNode.wgt.bagTItemBg3,self.reourceNode.wgt.bagTItemIcon3,self.reourceNode.wgt.bagTItemNum3]];
                    for(var j = 0;j<bg_array.length;j++){
                        bg_array[j][0].setVisible(false);
                    }
                    for(var i=0;i<reward_array.length;i++){
                        var id = reward_array[i][0];
                        var num = reward_array[i][1];
                        bg_array[i][0].setVisible(true);

                        Helper.LoadFrameImageWithPlist(bg_array[i][0],ITEMCFG[id].quality);
                        Helper.LoadIcoImageWithPlist(bg_array[i][1],ITEMCFG[id]);
                        bg_array[i][2].setString(num);
                    }
                    self.reourceNode.wgt.fightButton.addTouchEventListener(function (sender,type) {
                        if(type == ccui.Widget.TOUCH_ENDED){
                            //在开放时间段进入战斗，开放时间段外  提示十点至23点开启
                            var nowtime = Helper.formatTime(new Date(),3);
                            var intime = self.timeRange("10:00","23:00",nowtime);
                            if(intime==true){
                                //开始战斗
                                self.fightid = sender.getTag();
                                resourceFight.startFight(self.fightid);
                            }else{
                                ShowTipsTool.TipsFromText("10点-23点开放",cc.color.RED,30);
                            }
                        }
                    });
                }
            }
        });
        cc.eventManager.addListener(this.getZhenrongEvent, 1);
    },
    onExit:function (){
        this._super();
        cc.eventManager.removeListener(this.inspireEvent);
        cc.eventManager.removeListener(this.startFightEvent);
        cc.eventManager.removeListener(this.endFightEvent);
        cc.eventManager.removeListener(this.resourceFightEvent);
        cc.eventManager.removeListener(this.getCityEvent);
        cc.eventManager.removeListener(this.getZhenrongEvent);
        this.warResLayer.node.release();
    },
    initUI:function () {
        var self = this;
        this.reourceNode = ccsTool.load(res.uiResourceFightLayer,["bagNameNum","bagNameHad","fightButtonUp","bagTItemCos","bagNameUp","fightButtonGui","fightButtonSao","backBtn","Image_Now",
        "Button_1","Button_2","Button_3","Button_big1","Button_4","Button_5","Button_big2","Button_6","Button_7","Button_8","Button_9","Button_10","Button_11","Button_big3","Button_12","Button_13","Button_big4","Button_14","Button_big5",
        "Panel_5","bagTItemName","bagTItemMy","bagTItemYour","bagTItemBg1","bagTItemIcon1","bagTItemNum1","bagTItemBg2","bagTItemIcon2","bagTItemNum2","Panel_hero","fightButton","bagTItemBg3","bagTItemIcon3","bagTItemNum3",
        "bagName1","bagTime1","bagName2","bagTime2","bagName3","bagTime3","bagName4","bagTime4","bagName5","bagTime5","Panel_tips","btnBackTips"]);
        this.addChild(this.reourceNode.node,1);
        this.warResLayer = ccsTool.load(res.uiWarResLayer,["ImageFastWin","bagBg1","bagIcon1","bagPieces1","textNum1","bagBg2","bagIcon2","bagPieces2","textNum2","bagBg3","bagIcon3","bagPieces3","textNum3","btnResOk",
        "ImageFastlose","textLoseHonor","btnLoseOk"]);
        this.warResLayer.node.retain();

        this.small_btn_array = [ this.reourceNode.wgt.Button_1,this.reourceNode.wgt.Button_2,this.reourceNode.wgt.Button_3,this.reourceNode.wgt.Button_4,this.reourceNode.wgt.Button_5,this.reourceNode.wgt.Button_6,
            this.reourceNode.wgt.Button_7,this.reourceNode.wgt.Button_8,this.reourceNode.wgt.Button_9,this.reourceNode.wgt.Button_10,this.reourceNode.wgt.Button_11,this.reourceNode.wgt.Button_12,this.reourceNode.wgt.Button_13,
            this.reourceNode.wgt.Button_14];
        this.big_btn_array = [this.reourceNode.wgt.Button_big1,this.reourceNode.wgt.Button_big2,this.reourceNode.wgt.Button_big3,this.reourceNode.wgt.Button_big4,this.reourceNode.wgt.Button_big5];
        this.small_nametime_array = [[this.reourceNode.wgt.bagName1,this.reourceNode.wgt.bagTime1],[this.reourceNode.wgt.bagName2,this.reourceNode.wgt.bagTime2],[this.reourceNode.wgt.bagName3,this.reourceNode.wgt.bagTime3],
            [this.reourceNode.wgt.bagName4,this.reourceNode.wgt.bagTime4],[this.reourceNode.wgt.bagName5,this.reourceNode.wgt.bagTime5]];
        this.reourceNode.wgt.backBtn.addTouchEventListener(this.touchEvent,this);
        this.reourceNode.wgt.fightButtonUp.addTouchEventListener(this.touchEvent,this);
        this.reourceNode.wgt.fightButtonGui.addTouchEventListener(this.touchEvent,this);
        this.reourceNode.wgt.btnBackTips.addTouchEventListener(this.touchEvent,this);
        this.reourceNode.wgt.fightButtonSao.addTouchEventListener(this.touchEvent,this);
        //this.reourceNode.wgt.fightButton.addTouchEventListener(this.touchEvent,this);
        this.reourceNode.wgt.Panel_5.addTouchEventListener(this.touchEvent,this);

        for(var i=0;i<this.small_btn_array.length;i++){
            this.small_btn_array[i].setTag(i);
            this.small_btn_array[i].addTouchEventListener(function (sender,type) {
                if(type == ccui.Widget.TOUCH_ENDED){
                    self.reourceNode.wgt.Panel_5.setVisible(true);
                    self.loadGateInfo(sender.getTag()+1);
                }
            });
        }
        for(var j=0;j<this.big_btn_array.length;j++){
            this.big_btn_array[j].setTag(j);
            this.big_btn_array[j].addTouchEventListener(function (sender,type) {
                if(type == ccui.Widget.TOUCH_ENDED){
                    self.reourceNode.wgt.Panel_5.setVisible(true);
                    self.loadGateInfo(sender.getTag()+15);
                }
            });
        }
        this.loadMainInformation();
    },
    touchEvent:function (sender,type) {
        var self = this;
        if(type == ccui.Widget.TOUCH_ENDED){
            switch(sender.name){
                case "backBtn":
                    this.removeFromParent();
                    break;
                case "fightButtonUp": //鼓舞按钮
                    resourceFight.startInspire();
                break;
                case "fightButtonGui":  //规则按钮
                    this.reourceNode.wgt.Panel_tips.setVisible(true);
                    break;
                case "btnBackTips":
                    this.reourceNode.wgt.Panel_tips.setVisible(false);
                    break;
                case "fightButtonSao": //扫荡
                    var now_id = GLOBALDATA.resource.step;
                    var max_id = GLOBALDATA.resource.max;
                    if(max_id<=now_id){
                        ShowTipsTool.TipsFromText(STRINGCFG[100319].string,cc.color.RED,30);
                    }else{
                        var nowtime = Helper.formatDate(new Date(),3);
                        var intime = this.timeRange("10:00","23:00",nowtime);
                        if(intime==true){
                            //开始战斗
                            resourceFight.stopFight(0,0,1);
                        }else{
                            ShowTipsTool.TipsFromText("10:00-23:00开放",cc.color.RED,30);
                        }
                    }
                    break;
                case "Panel_5":
                    this.reourceNode.wgt.Panel_5.setVisible(false);
                    break;
                default:
                    break;
            }
        }
    },
    //显示主页面数据
    loadMainInformation:function () {
        resourceFight.getCityInfo();
        var now_id = GLOBALDATA.resource.step;
        var max_id = GLOBALDATA.resource.max;
        var guwu_num = GLOBALDATA.resource.inc;
        var big_id = GLOBALDATA.resource.pos;

        this.reourceNode.wgt.bagNameNum.setString(now_id);
        if(big_id!=0){
            this.reourceNode.wgt.bagNameHad.setString(PLUNDERSTAGECFG[big_id].stagename);
        }else{
            this.reourceNode.wgt.bagNameHad.setString("");
        }
        this.setFightingImg(now_id); //设置正在战斗按钮位置 显示
        for(var i=0;i<this.small_btn_array.length;i++){
            if(i==GLOBALDATA.resource.step){
                this.small_btn_array[i].setEnabled(true);
            }else{
                this.small_btn_array[i].setEnabled(false);
            }
        }
        if(GLOBALDATA.resource.step<PLUNDERSTAGECFG[15]){
            for(var i=0;i<this.big_btn_array.length;i++){
                this.big_btn_array[i].setEnabled(false);
            }
        }
        else if(GLOBALDATA.resource.step>=PLUNDERSTAGECFG[15]&&GLOBALDATA.resource.step<PLUNDERSTAGECFG[16]){
            this.big_btn_array[0].setEnabled(true);
            for(var i=1;i<this.big_btn_array.length;i++){
                this.big_btn_array[i].setEnabled(false);
            }
        }else if(GLOBALDATA.resource.step>=PLUNDERSTAGECFG[16]&&GLOBALDATA.resource.step<PLUNDERSTAGECFG[17]){
            this.big_btn_array[0].setEnabled(true);
            this.big_btn_array[1].setEnabled(true);
            for(var i=2;i<this.big_btn_array.length;i++){
                this.big_btn_array[i].setEnabled(false);
            }
        }else if(GLOBALDATA.resource.step>=PLUNDERSTAGECFG[17]&&GLOBALDATA.resource.step<PLUNDERSTAGECFG[18]){
            for(var j=0;j<3;j++){
                this.big_btn_array[j].setEnabled(true);
            }
            for(var i=3;i<this.big_btn_array.length;i++){
                this.big_btn_array[i].setEnabled(false);
            }
        }else if(GLOBALDATA.resource.step==PLUNDERSTAGECFG[18]){
            for(var j=0;j<4;j++){
                this.big_btn_array[j].setEnabled(true);
            }
            this.big_btn_array[4].setEnabled(false);
        }else if(GLOBALDATA.resource.step>=PLUNDERSTAGECFG[19]){
            for(var j=0;j<5;j++){
                this.big_btn_array[j].setEnabled(true);
            }
        }
        //VIP 7  才会开启扫荡功能
        if(GLOBALDATA.base.vip>=INTERFACECFG[37].vip || GLOBALDATA.base.lev>=INTERFACECFG[37].level){
            this.reourceNode.wgt.fightButtonSao.setVisible(true);
            if(max_id==now_id){
                this.reourceNode.wgt.fightButtonSao.setEnabled(false);
            }else{
                this.reourceNode.wgt.fightButtonSao.setEnabled(true);
            }
        }else{
            this.reourceNode.wgt.fightButtonSao.setVisible(false);
        }
        this.setGuwuSet(guwu_num);
    },
    //根据鼓舞次数 显示这次所需消耗砖石和增长属性数据
    setGuwuSet:function (num) {
        var now = num+1;
        var cost_diamond = 0;
        var percent = 0;
        this.reourceNode.wgt.fightButtonUp.setEnabled(true);
        if(now == 1){
            cost_diamond = 30;
            percent = 10;
        }else if(now == 2){
            cost_diamond = 50;
            percent = 20;
        }else if(now == 3){
            cost_diamond = 100;
            percent = 30;
        }else if(now == 4){
            cost_diamond = 300;
            percent = 50;
        }else if(now == 5){
            cost_diamond = 1000;
            percent = 70;
        }else if(now == 6){
            cost_diamond = 2000;
            percent = 100;
        }else{
            cost_diamond = 2000;
            percent = 100;
            this.reourceNode.wgt.fightButtonUp.setEnabled(false);
        }
        this.now_percent = percent;
        this.reourceNode.wgt.bagTItemCos.setString(cost_diamond);
        this.reourceNode.wgt.bagNameUp.setString("鼓舞士气，士兵全属性+"+percent+"%");
    },
    setFightingImg:function (position) {
        if(position<=13){
            this.reourceNode.wgt.Image_Now.setVisible(true);
            var x = this.small_btn_array[position].getPositionX();
            var y = this.small_btn_array[position].getPositionY()+this.small_btn_array[position].height/2+this.reourceNode.wgt.Image_Now.height/2;
            this.reourceNode.wgt.Image_Now.setPosition(x,y);
        }else{
            this.reourceNode.wgt.Image_Now.setVisible(false);
        }
    },
    loadGateInfo:function (id) { //点击相应关卡 显示详细数据
        this.ispvp = false;
        var self = this;
        this.reourceNode.wgt.fightButton.setTag(id);
        if(PLUNDERSTAGECFG[id].type==1){ //村庄
            this.ispvp = false;
            this.reourceNode.wgt.fightButton.addTouchEventListener(function (sender,type) {
                if(type == ccui.Widget.TOUCH_ENDED){
                    var nowtime = Helper.formatDate(new Date(),3);
                    var intime = self.timeRange("10:00","23:00",nowtime);
                    if(intime==true){
                        //开始战斗
                        self.fightid = sender.getTag();
                        resourceFight.startFight(sender.getTag());
                    }else{
                        ShowTipsTool.TipsFromText("10:00-23:00开放",cc.color.RED,30);
                    }
                }
            });
        }else if(PLUNDERSTAGECFG[id].type == 2){ //城镇
            //通过后台  接口 判断此城镇是否有真实玩家占领
            if(this.city_info[id].hid!=0){
                this.ispvp = true;
            }else{
                this.ispvp = false;
            }
            this.reourceNode.wgt.fightButton.addTouchEventListener(function (sender,type) {
                if(type == ccui.Widget.TOUCH_ENDED){
                    var nowtime = Helper.formatDate(new Date(),3);
                    var intime1 = self.timeRange("12:40","13:00",nowtime);
                    var intime2 = self.timeRange("18:00","18:20",nowtime);
                    if(intime1==true || intime2==true ){
                        //开始战斗
                        self.fightid = sender.getTag();
                        resourceFight.startFight(sender.getTag());
                    }else{
                        ShowTipsTool.TipsFromText("12:40-13:00,18:00-18:20开放",cc.color.RED,30);
                    }
                }
            });
        }
        if(this.ispvp==false){
            var bossid = STAGECFG[PLUNDERSTAGECFG[id].stage].bossid[0];
            var name = MONSTERCFG[bossid].mastername;

            this.reourceNode.wgt.bagTItemName.setString(name);
            this.reourceNode.wgt.bagTItemMy.setString("我方全属性提升:"+this.now_percent+"%");
            this.reourceNode.wgt.bagTItemYour.setString("敌方全属性提升:"+0+"%");
            //显示怪物模型
            var modelShowLayout = this.reourceNode.wgt.Panel_hero;
            modelShowLayout.removeAllChildren();
            HeroDefault.runAdle(bossid,modelShowLayout,0,0,1,2);
            //显示奖励结果
            var reward_array = PLUNDERSTAGECFG[id].reward;
            var bg_array = [[this.reourceNode.wgt.bagTItemBg1,this.reourceNode.wgt.bagTItemIcon1,this.reourceNode.wgt.bagTItemNum1],[this.reourceNode.wgt.bagTItemBg2,this.reourceNode.wgt.bagTItemIcon2,this.reourceNode.wgt.bagTItemNum2],[this.reourceNode.wgt.bagTItemBg3,this.reourceNode.wgt.bagTItemIcon3,this.reourceNode.wgt.bagTItemNum3]];
            for(var j = 0;j<bg_array.length;j++){
                bg_array[j][0].setVisible(false);
            }
            for(var i=0;i<reward_array.length;i++){
                var id = reward_array[i][0];
                var num = reward_array[i][1];
                bg_array[i][0].setVisible(true);

                Helper.LoadFrameImageWithPlist(bg_array[i][0],ITEMCFG[id].quality);
                Helper.LoadIcoImageWithPlist(bg_array[i][1],ITEMCFG[id]);
                bg_array[i][2].setString(num);
            }
        }else{
            //被真实玩家占领的城镇  挑战真实玩家  从后台取数据
            resourceFight.getZhenrongInfo(this.city_info[id].hid);
        }
    },
    resourceGet:function(data){
        if(data != undefined && data.data != undefined)
        {
            data.task = 'resource.get';

            var event = new cc.EventCustom(data.task);
            event.setUserData(data);
            cc.eventManager.dispatchEvent(event);
        }
    },
    sweepResult:function(data) {
        var sweepLayer = new SweepLayer(data.data);
        this.addChild(sweepLayer, 3);
    },
    timeRange:function (beginTime, endTime, nowTime) {
             var strb = beginTime.split (":");
             if (strb.length != 2) {
                 return false;
                 }
             var stre = endTime.split (":");
             if (stre.length != 2) {
                     return false;
                 }

             var strn = nowTime.split (":");
             if (stre.length != 2) {
                     return false;
                 }
             var b = new Date ();
             var e = new Date ();
             var n = new Date ();

             b.setHours (strb[0]);
             b.setMinutes (strb[1]);
             e.setHours (stre[0]);
             e.setMinutes (stre[1]);
             n.setHours (strn[0]);
             n.setMinutes (strn[1]);

             if (n.getTime () - b.getTime () > 0 && n.getTime () - e.getTime () < 0) {
                     return true;
                 } else {
                     return false;
                 }
         }
});