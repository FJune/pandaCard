
/**
 ** @Author:pandayu
 ** @Version:1.0
 ** @DateTime:2018-09-09
 ** @Project:pandaCard CardGame
 ** @Contact: QQ:815099602
 **/
var carLayer = baseLayer.extend({
    nodeArray:[],//node节点数组，作用是为了控制节点的显示
    btnArray:[],//按钮数组，控制按钮的高亮
    nodeTab:0,//标记，作用是为了控制node节点数组和按钮数组的显示状态
    commanderObj:null,
    commandId:null,
    carIdArray:[],//座驾ID数组
    bulArray:[],//判断组合属性数组
    bulcount:null,//判断组合属性数组标记
    MaterialArray:[],//升级材料数组
    carIndexID:null,//carID的标记
    _carIndexID:null,
    fcarIdArray:[],//已合成座驾副本数组
    carCompoundArray:[],
    carAttr:null,//座驾属性
    uid:{},
    StringArray: [],
    carAttrArray: [],//记录座机属性数字的数组
    sumCarAttr:[],//总属性记录数组
    lcar:0,
    tipsArray:[],
   ctor:function(){
       this._super();
       this.LayerName = "carLayer";
   },

    onEnter:function(){
        this._super();

    },

    initUI:function(){
        this.initCarUI();

        var self = this;

        //合成
        this.carCompoundEvent = cc.EventListener.create({
            event: cc.EventListener.CUSTOM,
            eventName: "commander.car.active",
            callback: function(event){
                var resData = event.getUserData();
                if(resData.status == 0){
                    for(var i=0;i<self.carCompoundArray.length;i++){
                        if(self.carCompoundArray[i] == self.carIndexID){
                            self.carCompoundArray.splice(i,1);
                        }
                    }
                    self.carLayerObj.wgt.B_prompt.setVisible(true);
                    self.carLayerObj.wgt.Panel_star.setVisible(true);
                    self.carLayerObj.wgt.btnHeCheng.setVisible(false);
                    self.carLayerObj.wgt.btnUp.setVisible(true);
                    self.carLayerObj.wgt.Node_car1.setVisible(true);
                    self.carAttr = self.commanderObj.car[self.carIndexID];
                    var carItem = self.carLayerObj.wgt.armyHeadList.getChildByTag(self.carIndexID);
                    self.tipsArray = [];
                    self.tipsArray = baseModel.CarTipsShow(self.carAttr);
                    var tipsImage = ccui.helper.seekWidgetByName(carItem, "tipsImage");
                    tipsImage.setVisible(false);
                    //红点显示
                    if(self.commanderObj.lcar != 0){
                        self.carLayerObj.wgt.tipsImageG5.setVisible(false);
                    }else{
                        self.carLayerObj.wgt.tipsImageG5.setVisible(true);
                    }
                    for(var j=0;j<self.tipsArray.length;j++){
                        if(self.tipsArray[j]){
                            var str = "tipsImageG" + (j+1);
                            var tipsImageG = ccui.helper.seekWidgetByName(self.carLayerObj.node, str);
                            tipsImageG.setVisible(true);
                        }else{
                            var str = "tipsImageG" + (j+1);
                            var tipsImageG = ccui.helper.seekWidgetByName(self.carLayerObj.node, str);
                            tipsImageG.setVisible(false);
                        }
                    }
                    var harmyHeadBg = ccui.helper.seekWidgetByName(carItem, "harmyHeadBg");
                    harmyHeadBg.setVisible(true);
                    var textTipsHe = ccui.helper.seekWidgetByName(carItem, "textTipsHe");
                    textTipsHe.setVisible(false);
                    self.attrShow();
                }
            }
        });
        cc.eventManager.addListener(this.carCompoundEvent, this);

        //升星
        this.upSatarEvn = cc.EventListener.create({
            event: cc.EventListener.CUSTOM,
            eventName: "commander.car.starup",
            callback: function(event){
                var resData = event.getUserData();
                if(resData.status == 0){
                    //base层红点提示显示时间
                    var tipsBool = baseModel.AllCarTipsShow();
                    var tipShowEvn = new cc.EventCustom('CarTipShowEvn');
                    tipShowEvn.setUserData(tipsBool);
                    cc.eventManager.dispatchEvent(tipShowEvn);
                    //红点显示
                    self.tipsArray = [];
                    self.tipsArray = baseModel.CarTipsShow(self.carAttr);
                    self.carLayerObj.wgt.tipsImageG5.setVisible(true);
                    for(var j=0;j<self.tipsArray.length;j++){
                        if(self.tipsArray[j]){
                            var str = "tipsImageG" + (j+1);
                            var tipsImageG = ccui.helper.seekWidgetByName(self.carLayerObj.node, str);
                            tipsImageG.setVisible(true);
                        }else{
                            var str = "tipsImageG" + (j+1);
                            var tipsImageG = ccui.helper.seekWidgetByName(self.carLayerObj.node, str);
                            tipsImageG.setVisible(false);
                        }
                    }
                    //升星属性加成显示
                    for(var solKey in GLOBALDATA.army.battle){
                        if(GLOBALDATA.army.battle[solKey] != 0){
                            ShowTipsTool.TipsFromText("+" + self.carAttrArray[0] + STRINGCFG[100032].string, cc.color.GREEN, 30);
                            ShowTipsTool.TipsFromText("+" + self.carAttrArray[1] + STRINGCFG[100035].string, cc.color.GREEN, 30);
                            ShowTipsTool.TipsFromText("+" + self.carAttrArray[2] + STRINGCFG[100033].string, cc.color.GREEN, 30);
                        }
                    }
                    self.carData();
                    self.btnUpLvData();
                    self.strenData();
                    self.upStarData();
                    var carItem = self.carLayerObj.wgt.armyHeadList.getChildByTag(self.carIndexID);
                    var harmyHeadBg = ccui.helper.seekWidgetByName(carItem, "harmyHeadBg");
                    harmyHeadBg.setVisible(true);
                }
            }
        });
        cc.eventManager.addListener(this.upSatarEvn, this);

        //激活和卸下
        this.carUseDownEvent = cc.EventListener.create({
            event: cc.EventListener.CUSTOM,
            eventName: "commander.car.use",
            callback: function(event){
                var resData = event.getUserData();
                if(resData.status == 0){
                   //base层红点提示显示时间
                    var tipsBool = baseModel.AllCarTipsShow();
                    var tipShowEvn = new cc.EventCustom('CarTipShowEvn');
                    tipShowEvn.setUserData(tipsBool);
                    cc.eventManager.dispatchEvent(tipShowEvn);
                    //当激活按钮为显示状态时
                    if(self.carLayerObj.wgt.btnUp.isVisible()){
                        self.carLayerObj.wgt.btnUp.setVisible(false);
                        //红点显示
                        self.tipsArray = [];
                        self.tipsArray = baseModel.CarTipsShow(self.carAttr);
                        self.carLayerObj.wgt.tipsImageG5.setVisible(false);
                        for(var j=0;j<self.tipsArray.length;j++){
                            if(self.tipsArray[j]){
                                var str = "tipsImageG" + (j+1);
                                var tipsImageG = ccui.helper.seekWidgetByName(self.carLayerObj.node, str);
                                tipsImageG.setVisible(true);
                            }else{
                                var str = "tipsImageG" + (j+1);
                                var tipsImageG = ccui.helper.seekWidgetByName(self.carLayerObj.node, str);
                                tipsImageG.setVisible(false);
                            }
                        }
                        //当有座驾为上阵状态时
                       if(self.lcar != 0){
                           var carItem = self.carLayerObj.wgt.armyHeadList.getChildByTag(self.lcar);
                           var harmyHeadBg = ccui.helper.seekWidgetByName(carItem, "harmyHeadBg1");
                           harmyHeadBg.setVisible(false);
                           var carItem = self.carLayerObj.wgt.armyHeadList.getChildByTag(self.carIndexID);
                           var harmyHeadBg = ccui.helper.seekWidgetByName(carItem, "harmyHeadBg1");
                           harmyHeadBg.setVisible(true);
                           var _Node_car = "Node_car" + (self.nodeTab+1);
                           var Node_car = ccui.helper.seekWidgetByName(self.carLayerObj.node, _Node_car);
                           var str = "B_Date";
                           var nowCarAttr = [];
                           self.attrCal(self.commanderObj.car[self.lcar], str, self.commanderObj.car[self.lcar].lv, Node_car);
                           nowCarAttr = self.sumCarAttr.concat();
                           self.attrCal(self.carAttr, str, self.carAttr.lv, Node_car);//参数 1：上阵座驾属性 2：字符串 3：等级 4:节点Node_car
                           for(var i=0;i<nowCarAttr.length;i++){
                               nowCarAttr[i] = self.sumCarAttr[i] - nowCarAttr[i];
                           }
                           for(var solKey in GLOBALDATA.army.battle){
                               if(GLOBALDATA.army.battle[solKey] != 0){
                                   for(var i=0;i<nowCarAttr.length;i++){
                                       if(nowCarAttr[i] < 0){
                                           ShowTipsTool.TipsFromText("-" + nowCarAttr[i] + ATTRIBUTEIDCFG[i+1].describe, cc.color.RED, 30);
                                       }else{
                                           ShowTipsTool.TipsFromText("+" + nowCarAttr[i] + ATTRIBUTEIDCFG[i+1].describe, cc.color.GREEN, 30);
                                       }
                                   }
                               }
                           }
                       }else{
                           //当没有上阵座驾时
                           var carItem = self.carLayerObj.wgt.armyHeadList.getChildByTag(self.carIndexID);
                           var harmyHeadBg = ccui.helper.seekWidgetByName(carItem, "harmyHeadBg1");
                           harmyHeadBg.setVisible(true);
                           for(var solKey in GLOBALDATA.army.battle){
                               if(GLOBALDATA.army.battle[solKey] != 0){
                                   ShowTipsTool.TipsFromText("+" + self.carAttrArray[0] + STRINGCFG[100032].string, cc.color.GREEN, 30);
                                   ShowTipsTool.TipsFromText("+" + self.carAttrArray[1] + STRINGCFG[100035].string, cc.color.GREEN, 30);
                                   ShowTipsTool.TipsFromText("+" + self.carAttrArray[2] + STRINGCFG[100033].string, cc.color.GREEN, 30);
                               }
                           }
                       }
                    }else{
                        self.carLayerObj.wgt.btnUp.setVisible(true);
                        //红点提示显示
                        self.tipsArray = [];
                        self.tipsArray = baseModel.CarTipsShow(self.carAttr);
                        self.carLayerObj.wgt.tipsImageG5.setVisible(true);
                        for(var j=0;j<self.tipsArray.length;j++){
                            if(self.tipsArray[j]){
                                var str = "tipsImageG" + (j+1);
                                var tipsImageG = ccui.helper.seekWidgetByName(self.carLayerObj.node, str);
                                tipsImageG.setVisible(true);
                            }else{
                                var str = "tipsImageG" + (j+1);
                                var tipsImageG = ccui.helper.seekWidgetByName(self.carLayerObj.node, str);
                                tipsImageG.setVisible(false);
                            }
                        }
                    }
                    //当卸下按钮为显示状态时
                  if(self.carLayerObj.wgt.btnDown.isVisible()){
                      self.carLayerObj.wgt.btnDown.setVisible(false);
                      var carItem = self.carLayerObj.wgt.armyHeadList.getChildByTag(self.lcar);
                      var harmyHeadBg = ccui.helper.seekWidgetByName(carItem, "harmyHeadBg1");
                      harmyHeadBg.setVisible(false);
                      for(var solKey in GLOBALDATA.army.battle){
                          if(GLOBALDATA.army.battle[solKey] != 0){
                              ShowTipsTool.TipsFromText("-" + self.sumCarAttr[0] + STRINGCFG[100032].string, cc.color.RED, 30);
                              ShowTipsTool.TipsFromText("-" + self.sumCarAttr[1] + STRINGCFG[100035].string, cc.color.RED, 30);
                              ShowTipsTool.TipsFromText("-" + self.sumCarAttr[2] + STRINGCFG[100033].string, cc.color.RED, 30);
                          }
                      }
                  }else{
                      self.carLayerObj.wgt.btnDown.setVisible(true);
                  }
                    //self.initCarUI();
                    var carItem = self.carLayerObj.wgt.armyHeadList.getChildByTag(self.carIndexID);
                    var harmyHeadBg = ccui.helper.seekWidgetByName(carItem, "harmyHeadBg");
                    harmyHeadBg.setVisible(true);
                }
            }
        });
        cc.eventManager.addListener(this.carUseDownEvent, this);
        //升级
        this.carUpLevEvent = cc.EventListener.create({
            event: cc.EventListener.CUSTOM,
            eventName: "commander.car.levelup",
            callback: function(event){
                var resData = event.getUserData();
                if(resData.status == 0){
                    //base层红点提示显示时间
                    var tipsBool = baseModel.AllCarTipsShow();
                    var tipShowEvn = new cc.EventCustom('CarTipShowEvn');
                    tipShowEvn.setUserData(tipsBool);
                    cc.eventManager.dispatchEvent(tipShowEvn);
                    //红点提示显示
                    self.tipsArray = [];
                    self.tipsArray = baseModel.CarTipsShow(self.carAttr);
                    for(var j=0;j<self.tipsArray.length;j++){
                        if(self.tipsArray[j]){
                            var str = "tipsImageG" + (j+1);
                            var tipsImageG = ccui.helper.seekWidgetByName(self.carLayerObj.node, str);
                            tipsImageG.setVisible(true);
                        }else{
                            var str = "tipsImageG" + (j+1);
                            var tipsImageG = ccui.helper.seekWidgetByName(self.carLayerObj.node, str);
                            tipsImageG.setVisible(false);
                        }
                    }
                    //座驾属性加成显示
                    for(var solKey in GLOBALDATA.army.battle){
                        if(GLOBALDATA.army.battle[solKey] != 0){
                            ShowTipsTool.TipsFromText("+" + self.carAttrArray[0] + STRINGCFG[100032].string, cc.color.GREEN, 30);
                            ShowTipsTool.TipsFromText("+" + self.carAttrArray[1] + STRINGCFG[100035].string, cc.color.GREEN, 30);
                            ShowTipsTool.TipsFromText("+" + self.carAttrArray[2] + STRINGCFG[100033].string, cc.color.GREEN, 30);
                        }
                    }
                    self.carData();
                    self.btnUpLvData();
                    self.strenData();
                    self.upStarData();
                    var carItem = self.carLayerObj.wgt.armyHeadList.getChildByTag(self.carIndexID);
                    var harmyHeadBg = ccui.helper.seekWidgetByName(carItem, "harmyHeadBg");
                    harmyHeadBg.setVisible(true);
                }
            }
        });
        cc.eventManager.addListener(this.carUpLevEvent, this);

        //强化
        this.carStrenEvent = cc.EventListener.create({
            event: cc.EventListener.CUSTOM,
            eventName: "commander.car.strengthen",
            callback: function(event){
                var resData = event.getUserData();
                if(resData.status == 0){
                    //base层红点提示显示时间
                    var tipsBool = baseModel.AllCarTipsShow();
                    var tipShowEvn = new cc.EventCustom('CarTipShowEvn');
                    tipShowEvn.setUserData(tipsBool);
                    cc.eventManager.dispatchEvent(tipShowEvn);
                    //红点提示显示
                    self.tipsArray = [];
                    self.tipsArray = baseModel.CarTipsShow(self.carAttr);
                    for(var j=0;j<self.tipsArray.length;j++){
                        if(self.tipsArray[j]){
                            var str = "tipsImageG" + (j+1);
                            var tipsImageG = ccui.helper.seekWidgetByName(self.carLayerObj.node, str);
                            tipsImageG.setVisible(true);
                        }else{
                            var str = "tipsImageG" + (j+1);
                            var tipsImageG = ccui.helper.seekWidgetByName(self.carLayerObj.node, str);
                            tipsImageG.setVisible(false);
                        }
                    }
                    //强化座驾属性加成显示
                    var sattr_base = COMCARCFG[self.carAttr.id].sattr_add;
                    for(var solKey in GLOBALDATA.army.battle){
                        if(GLOBALDATA.army.battle[solKey] != 0){
                            for(var i=0;i<sattr_base.length;i++){
                                if(sattr_base[i][0] == 1){
                                    ShowTipsTool.TipsFromText("+" + sattr_add[i][2] + STRINGCFG[100032].string, cc.color.GREEN, 30);
                                }else if(sattr_base[i][0] == 2){
                                    ShowTipsTool.TipsFromText("+" + sattr_add[i][2] + STRINGCFG[100035].string, cc.color.GREEN, 30);
                                }else{
                                    ShowTipsTool.TipsFromText("+" + sattr_add[i][2] + STRINGCFG[100033].string, cc.color.GREEN, 30);
                                }
                            }
                        }
                    }
                    self.carData();
                    self.btnUpLvData();
                    self.strenData();
                    self.upStarData();
                    var carItem = self.carLayerObj.wgt.armyHeadList.getChildByTag(self.carIndexID);
                    var harmyHeadBg = ccui.helper.seekWidgetByName(carItem, "harmyHeadBg");
                    harmyHeadBg.setVisible(true);
                }
            }
        });
        cc.eventManager.addListener(this.carStrenEvent, this);

        //重生
        this.carRebirthEvent = cc.EventListener.create({
            event: cc.EventListener.CUSTOM,
            eventName: "commander.car.reborn",
            callback: function(event){
                var resData = event.getUserData();
                if(resData.status == 0){
                    //重生属性变化提示
                    for(var solKey in GLOBALDATA.army.battle){
                        if(GLOBALDATA.army.battle[solKey] != 0){
                            ShowTipsTool.TipsFromText("-" + self.carAttrArray[0] + STRINGCFG[100032].string, cc.color.RED, 30);
                            ShowTipsTool.TipsFromText("-" + self.carAttrArray[1] + STRINGCFG[100035].string, cc.color.RED, 30);
                            ShowTipsTool.TipsFromText("-" + self.carAttrArray[2] + STRINGCFG[100033].string, cc.color.RED, 30);
                        }
                    }
                    self.carData();
                    var carItem = self.carLayerObj.wgt.armyHeadList.getChildByTag(self.carIndexID);
                    var harmyHeadBg = ccui.helper.seekWidgetByName(carItem, "harmyHeadBg");
                    harmyHeadBg.setVisible(true);
                }
            }
        });
        cc.eventManager.addListener(this.carRebirthEvent, this);
    },
    initCarUI:function(){
        this.carLayerObj = ccsTool.load(res.uiCarLayer, ["btnCar", "btnUpLv", "btnStren", "btnUpStar", "btnReform",
        "btnBack", "btnhShop", "armyBreakShow", "btnUp", "btnDown", "B_prompt", "Image_star1", "Image_star2",
        "Image_star3", "Image_star4", "Image_star5", "Image_star6", "B_Image_22","Image_44", "btnhSee","_talentDescribe_0",
        "B_Date1", "B_Date2", "B_Date3", "B_Date4", "B_Date5", "B_Date6", "upLeftChangeButton", "upRightChangeButton",
        "armyHeadList", "upLowLevelBg","armyHead", "armyHeadBg", "armyHeadIcon", "harmyHeadBg", "tipsImage", "ListView_See",
        "Node_car1","Node_car2", "Node_car3", "Node_car4", "Node_car5", "harmyHeadBg1", "textTipsHe", "textPiecesNum",
        "btnHeCheng", "Panel_star", "tipsImageG1", "tipsImageG2", "tipsImageG3", "tipsImageG4", "tipsImageG5"]);
        StringArray = [STRINGCFG[100250].string, STRINGCFG[100251].string, STRINGCFG[100252].string];
        this.addChild(this.carLayerObj.node, 2);
        this.carLayerObj.wgt.btnCar.setBrightStyle(ccui.Widget.BRIGHT_STYLE_HIGH_LIGHT);//控件高亮

        this.carLayerObj.wgt.btnBack.addTouchEventListener(this.carTouchEvent, this);//返回按钮
        this.carLayerObj.wgt.btnCar.addTouchEventListener(this.carTouchEvent, this);//座驾

        this.carLayerObj.wgt.btnUpLv.addTouchEventListener(this.carTouchEvent, this);//升级
        this.carLayerObj.wgt.btnStren.addTouchEventListener(this.carTouchEvent, this);//强化
        this.carLayerObj.wgt.btnUpStar.addTouchEventListener(this.carTouchEvent, this);//升星
        this.carLayerObj.wgt.btnReform.addTouchEventListener(this.carTouchEvent, this);//重生
        this.carLayerObj.wgt.btnhShop.addTouchEventListener(this.carTouchEvent, this);//座驾商店
        this.carLayerObj.wgt.btnhSee.addTouchEventListener(this.carTouchEvent, this);//图鉴
        this.carLayerObj.wgt.btnUp.addTouchEventListener(this.carTouchEvent, this);//激活
        this.carLayerObj.wgt.btnDown.addTouchEventListener(this.carTouchEvent, this);//卸下
        this.carLayerObj.wgt.btnHeCheng.addTouchEventListener(this.carTouchEvent, this);//合成
        this.carLayerObj.wgt.upLeftChangeButton.addTouchEventListener(this.carTouchEvent, this);
        this.carLayerObj.wgt.upRightChangeButton.addTouchEventListener(this.carTouchEvent, this);

        //查找上阵指挥官
        for(var comKey in GLOBALDATA.commanders){
            if(GLOBALDATA.commanders[comKey].j == 1){
                this.commandId = comKey;
                this.commanderObj = GLOBALDATA.commanders[comKey];
            }
        }
        this.carIdArray.length = 0;
        //已合成数组的确定
        if(this.commanderObj.car != undefined){
            this.fcarIdArray = [];//已合成座驾副本数组
            this.carLayerObj.wgt.Node_car1.setVisible(true);
            for(var carid in this.commanderObj.car){
                this.fcarIdArray.push(parseInt(this.commanderObj.car[carid].id));
            }
            //可合成数组的确定
            this.carCompoundArray = [];
            for(var carKey in COMCARCFG){
                if(this.fcarIdArray.indexOf(parseInt(carKey)) == -1){
                    if(GLOBALDATA.knapsack[COMCARCFG[carKey].synnum[0]] != undefined &&
                        GLOBALDATA.knapsack[COMCARCFG[carKey].synnum[0]] >= COMCARCFG[carKey].synnum[1]){
                        this.carCompoundArray.push(parseInt(carKey));//可合成数组
                    }
                }
            }
            this.fcarIdArray = this.fcarIdArray.concat(this.carCompoundArray);
            //从大到小排序
            if(this.fcarIdArray.length != 0){
                for(var i=0;i<this.fcarIdArray.length-1;i++){
                    for(var j=0; j<this.fcarIdArray.length-1-i;j++){
                        if(this.fcarIdArray[j] < this.fcarIdArray[j+1]){
                            var quaTemp = this.fcarIdArray [j];
                            this.fcarIdArray[j] = this.fcarIdArray[j+1];
                            this.fcarIdArray[j+1] = quaTemp;
                        }
                    }
                }
                //this.fcarIdArray.reverse();
            }

            for(var keyid in COMCARCFG){
                if(this.fcarIdArray.indexOf(COMCARCFG[keyid].id) == -1){
                    this.carIdArray.push(parseInt(COMCARCFG[keyid].id));
                }
            }
            this.carIdArray.reverse();
            this.carIdArray = this.fcarIdArray.concat(this.carIdArray);

            //判断组合属性可以激活
            this.bulArray.length = 0;
            for(var key in COMCARCOMBINATIONCFG){
                var carCount = 0;
                var caridArray = COMCARCOMBINATIONCFG[key].carid;
                for(var i=0;i<caridArray.length;i++){
                    if(this.fcarIdArray.indexOf(caridArray[i]) != -1){
                        carCount++;
                    }
                }
                if(caridArray.length == carCount){
                    this.bulArray.push(true);
                }else{
                    this.bulArray.push(false);
                }
            }
        }else{
            //可合成数组的确定
            this.carCompoundArray = [];
            for(var carKey in COMCARCFG){
                if(this.fcarIdArray.indexOf(carKey) == -1){
                    if(GLOBALDATA.knapsack[COMCARCFG[carKey].synnum[0]] != undefined &&
                        GLOBALDATA.knapsack[COMCARCFG[carKey].synnum[0]] >= COMCARCFG[carKey].synnum[1]){
                        this.carCompoundArray.push(parseInt(carKey));//可合成数组
                    }
                }
            }
            this.fcarIdArray = this.fcarIdArray.concat(this.carCompoundArray);
            if(this.fcarIdArray.length != 0){
                this.fcarIdArray.reverse();//从大到小排序
            }
            //无法合成数组的确定
            for(var keyid in COMCARCFG){
                if(this.fcarIdArray.indexOf(COMCARCFG[keyid].id) == -1){
                    this.carIdArray.push(parseInt(COMCARCFG[keyid].id));
                }
            }
            this.carIdArray.reverse();
            this.carIdArray = this.fcarIdArray.concat(this.carIdArray);
        }

        //数组初始化
        this.nodeArray = [this.carLayerObj.wgt.Node_car1, this.carLayerObj.wgt.Node_car2, this.carLayerObj.wgt.Node_car3,
            this.carLayerObj.wgt.Node_car4, this.carLayerObj.wgt.Node_car5];//节点数组
        this.btnArray = [this.carLayerObj.wgt.btnCar, this.carLayerObj.wgt.btnUpLv, this.carLayerObj.wgt.btnStren,
            this.carLayerObj.wgt.btnUpStar, this.carLayerObj.wgt.btnReform];//按钮数组

        this.carLayerObj.wgt.ListView_See.setVisible(false);//隐藏是为了防止接受点击事件
        this.carLayerObj.wgt.ListView_See.setScrollBarEnabled(false);//滾動條隱藏
        this.carLayerObj.wgt.armyHeadList.setScrollBarEnabled(false);

        this.carData();
    },
    //座驾界面信息更新
    carData:function(){
        //var defShow = 1;
        this.carLayerObj.wgt.armyHeadList.removeAllItems();
        this.carLayerObj.wgt.Node_car1.setVisible(false);
        this.carLayerObj.wgt.btnDown.setVisible(false);
        this.carLayerObj.wgt.btnUp.setVisible(false);
        this.carLayerObj.wgt.btnHeCheng.setVisible(false);
        this.carLayerObj.wgt.B_prompt.setVisible(false);
        this.carLayerObj.wgt.Panel_star.setVisible(false);

        for(var i=0;i<this.carIdArray.length;i++){
            this.tipsArray = [];
            var armyHeaditem = this.carLayerObj.wgt.armyHead.clone();
            armyHeaditem.setTag(this.carIdArray[i]);
            armyHeaditem.addTouchEventListener(this.carIDlockEvent, this);
            this.carLayerObj.wgt.armyHeadList.pushBackCustomItem(armyHeaditem);
            //this.carLayerObj.wgt.armyHeadList.insertCustomItem(armyHeaditem, 0);
            //this.carLayerObj.wgt.armyHeadList.sortAllChildren();
            var armyHead = ccui.helper.seekWidgetByName(armyHeaditem, "armyHead");
            Helper.LoadFrameImageWithPlist(armyHead, COMCARCFG[this.carIdArray[i]].quality);
            var armyHeadIcon = ccui.helper.seekWidgetByName(armyHeaditem, "armyHeadIcon");
            Helper.LoadIcoImageWithPlist(armyHeadIcon, ITEMCFG[COMCARCFG[this.carIdArray[i]].synnum[0]]);

            if(this.fcarIdArray.length != 0 && i < this.fcarIdArray.length){
                //去掉头像遮盖
                var armyHeadBg = ccui.helper.seekWidgetByName(armyHeaditem, "armyHeadBg");
                armyHeadBg.setVisible(false);
                //默认选择
                if(i == 0 && this.carIndexID == null){
                    var harmyHeadBg = ccui.helper.seekWidgetByName(armyHeaditem, "harmyHeadBg");
                    harmyHeadBg.setVisible(true);
                    this.carIndexID = this.carIdArray[0];
                    if(this.carCompoundArray.indexOf(this.fcarIdArray[0]) == -1){
                        this.carAttr = this.commanderObj.car[this.carIndexID];
                        this.tipsArray = baseModel.CarTipsShow(this.carAttr);
                        this.carLayerObj.wgt.Node_car1.setVisible(true);
                        this.carLayerObj.wgt.B_prompt.setVisible(true);
                        this.carLayerObj.wgt.Panel_star.setVisible(true);
                        if(this.commanderObj.lcar != 0 && this.commanderObj.lcar == this.carIndexID){
                            this.carLayerObj.wgt.btnUp.setVisible(false);
                            this.carLayerObj.wgt.btnDown.setVisible(true);
                            this.carLayerObj.wgt.btnHeCheng.setVisible(false);
                            var armyHeadBg = ccui.helper.seekWidgetByName(armyHeaditem, "harmyHeadBg1");
                            armyHeadBg.setVisible(true);
                        }else{
                            this.carLayerObj.wgt.btnUp.setVisible(true);
                            this.carLayerObj.wgt.btnDown.setVisible(false);
                            this.carLayerObj.wgt.btnHeCheng.setVisible(false);
                        }
                        this.attrShow();
                    }else{
                        var textTipsHe = ccui.helper.seekWidgetByName(armyHeaditem, "textTipsHe");
                        textTipsHe.setVisible(true);
                        this.carLayerObj.wgt.textPiecesNum.setString(GLOBALDATA.knapsack[COMCARCFG[this.carIdArray[i]].synnum[0]]
                            + "/" + COMCARCFG[this.carIdArray[i]].synnum[1]);
                        this.carLayerObj.wgt.Node_car1.setVisible(false);
                        this.carLayerObj.wgt.btnDown.setVisible(false);
                        this.carLayerObj.wgt.btnHeCheng.setVisible(true);
                        this.carLayerObj.wgt.B_prompt.setVisible(false);
                        this.carLayerObj.wgt.Panel_star.setVisible(false);
                        this.carLayerObj.wgt.btnUp.setVisible(false);
                        this.tipsArray = baseModel.CarTipsShow(this.carIdArray[i]);
                    }
                    for(var j=0;j<this.tipsArray.length;j++){
                        if(this.tipsArray[j]){
                            var str = "tipsImageG" + (j+1);
                            var tipsImageG = ccui.helper.seekWidgetByName(this.carLayerObj.node, str);
                            tipsImageG.setVisible(true);
                        }
                    }
                }else{
                    if(this.carCompoundArray.indexOf(this.carIdArray[i]) != -1){
                        //可合成提示的显示
                        var textTipsHe = ccui.helper.seekWidgetByName(armyHeaditem, "textTipsHe");
                        textTipsHe.setVisible(true);
                        this.tipsArray = baseModel.CarTipsShow(this.carIdArray[i]);
                    }else{
                        if(this.commanderObj.lcar != 0 && this.commanderObj.lcar == this.carIdArray[i]){
                            var harmyHeadBg = ccui.helper.seekWidgetByName(armyHeaditem, "harmyHeadBg1");
                            harmyHeadBg.setVisible(true);
                            this.carAttr = this.commanderObj.car[this.carIdArray[i]];
                            this.tipsArray = baseModel.CarTipsShow(this.carAttr);
                        }
                    }
                }
            }
            if(this.tipsArray != undefined){
                if(this.tipsArray.indexOf(true) != -1){
                    if(this.carCompoundArray.indexOf(this.carIdArray[i]) != -1){
                        var tipsImage = ccui.helper.seekWidgetByName(armyHeaditem, "tipsImage");
                        tipsImage.setVisible(true);
                        //this.carLayerObj.wgt.tipsImageG5.setVisible(false);
                    }else{
                        if(this.commanderObj.lcar != 0){
                            this.carLayerObj.wgt.tipsImageG5.setVisible(false);
                        }else{
                            this.carLayerObj.wgt.tipsImageG5.setVisible(true);
                        }
                    }
                }
            }
        }
    },

    //点击图鉴图像事件
    carIDlockEvent:function(sender, type){
        if(ccui.Widget.TOUCH_ENDED == type){
            if(this.fcarIdArray.indexOf(sender.getTag()) != -1){
                this._carIndexID = sender.getTag();
                if(this._carIndexID != this.carIndexID){
                    var _carItem = this.carLayerObj.wgt.armyHeadList.getChildByTag(this._carIndexID);
                    var carItem = this.carLayerObj.wgt.armyHeadList.getChildByTag(this.carIndexID);
                    var _harmyHeadBg = ccui.helper.seekWidgetByName(_carItem, "harmyHeadBg");
                    var harmyHeadBg = ccui.helper.seekWidgetByName(carItem, "harmyHeadBg");
                    _harmyHeadBg.setVisible(true);
                    harmyHeadBg.setVisible(false);
                    this.carIndexID = this._carIndexID;
                    for(var key in this.commanderObj.car){
                        if(this.commanderObj.car[key].id == this.carIndexID){
                            this.carAttr = this.commanderObj.car[key];
                        }
                    }
                    if(this.carCompoundArray.indexOf(this._carIndexID) == -1){
                        var _Node_car = "Node_car" + (this.nodeTab+1);
                        var Node_car = ccui.helper.seekWidgetByName(this.carLayerObj.node, _Node_car);
                        Node_car.setVisible(true);
                        this.carLayerObj.wgt.B_prompt.setVisible(true);
                        this.carLayerObj.wgt.Panel_star.setVisible(true);
                        if(this._carIndexID == this.commanderObj.lcar){
                            this.carLayerObj.wgt.btnHeCheng.setVisible(false);
                            this.carLayerObj.wgt.btnUp.setVisible(false);
                            this.carLayerObj.wgt.btnDown.setVisible(true);
                        }else{
                            this.carLayerObj.wgt.btnHeCheng.setVisible(false);
                            this.carLayerObj.wgt.btnUp.setVisible(true);
                            this.carLayerObj.wgt.btnDown.setVisible(false);
                        }
                        this.tipsArray = baseModel.CarTipsShow(this.carAttr);
                        for(var j=0;j<this.tipsArray.length;j++){
                            if(this.tipsArray[j]){
                                if(this.commanderObj.lcar != 0){
                                    this.carLayerObj.wgt.tipsImageG5.setVisible(false);
                                }else{
                                    this.carLayerObj.wgt.tipsImageG5.setVisible(true);
                                }
                                var str = "tipsImageG" + (j+1);
                                var tipsImageG = ccui.helper.seekWidgetByName(this.carLayerObj.node, str);
                                tipsImageG.setVisible(true);
                            }else{
                                if(this.commanderObj.lcar != 0){
                                    this.carLayerObj.wgt.tipsImageG5.setVisible(false);
                                }else{
                                    this.carLayerObj.wgt.tipsImageG5.setVisible(true);
                                }
                                var str = "tipsImageG" + (j+1);
                                var tipsImageG = ccui.helper.seekWidgetByName(this.carLayerObj.node, str);
                                tipsImageG.setVisible(false);
                            }
                        }
                        this.attrShow();
                        this.btnUpLvData();
                        this.strenData();
                        this.upStarData();
                    }else{
                        var _Node_car = "Node_car" + (this.nodeTab+1);
                        var Node_car = ccui.helper.seekWidgetByName(this.carLayerObj.node, _Node_car);
                        Node_car.setVisible(false);
                        this.carLayerObj.wgt.B_prompt.setVisible(false);
                        this.carLayerObj.wgt.btnHeCheng.setVisible(true);
                        this.carLayerObj.wgt.btnUp.setVisible(false);
                        this.carLayerObj.wgt.btnDown.setVisible(false);
                        this.carLayerObj.wgt.Panel_star.setVisible(false);
                        this.carLayerObj.wgt.textPiecesNum.setString(GLOBALDATA.knapsack[COMCARCFG[this._carIndexID].synnum[0]]
                            + "/" + COMCARCFG[this._carIndexID].synnum[1]);
                        this.tipsArray = baseModel.CarTipsShow(this.carIndexID);
                        for(var j=0;j<this.tipsArray.length;j++){
                            if(this.tipsArray[j]){
                                var str = "tipsImageG" + (j+1);
                                var tipsImageG = ccui.helper.seekWidgetByName(this.carLayerObj.node, str);
                                tipsImageG.setVisible(true);
                            }else{
                                if(this.commanderObj.lcar != 0){
                                    this.carLayerObj.wgt.tipsImageG5.setVisible(false);
                                }else{
                                    this.carLayerObj.wgt.tipsImageG5.setVisible(true);
                                }
                                var str = "tipsImageG" + (j+1);
                                var tipsImageG = ccui.helper.seekWidgetByName(this.carLayerObj.node, str);
                                tipsImageG.setVisible(false);
                            }
                        }
                    }
                }
            }
        }
    },

    attrShow:function(){
        //var armyHeaditem = this.carLayerObj.wgt.armyHeadList.getChildByTag(this._carIndexID);
        this.carLayerObj.wgt.B_Date5.setString(STRINGCFG[100234].string + this.carAttr.lv);
        this.carLayerObj.wgt.B_Date6.setString(STRINGCFG[100028].string + ":" + this.carAttr.st);
        //座驾名字以及所强化的等级显示
        if(this.carAttr.st == 0){
            this.carLayerObj.wgt.B_prompt.setString(COMCARCFG[this.carAttr.id].name);
        }else{
            this.carLayerObj.wgt.B_prompt.setVisible(true);
            this.carLayerObj.wgt.B_prompt.setString(COMCARCFG[this.carAttr.id].name
                + this.carAttr.st);
        }

        //星级的显示
        if(this.carAttr.star != 0){
            for(var i=1;i<6;i++){
                var _Image_star = "Image_star"+i;
                var Image_star = ccui.helper.seekWidgetByName(this.carLayerObj.node, _Image_star);
                Image_star.setVisible(false);
            }
            for(var j=1;j<this.carAttr.star+1;j++){
                var _Image_star = "Image_star"+j;
                var Image_star = ccui.helper.seekWidgetByName(this.carLayerObj.node, _Image_star);
                Image_star.setVisible(true);
            }
        }else{
            for(var i=1;i<6;i++){
                var _Image_star = "Image_star"+i;
                var Image_star = ccui.helper.seekWidgetByName(this.carLayerObj.node, _Image_star);
                Image_star.setVisible(false);
            }
        }

        var str = "B_Date";
        //var carid = this.commanderObj.car[this.commanderObj.lcar - 1];
        this.attrCal(this.carAttr, str, this.carAttr.lv, this.carLayerObj.wgt.Node_car1);
    },

    attrCal:function(_carid, _str, _caridLv, _Node_car){//参数 1：上阵座驾属性 2：字符串 3：等级 4:节点
        //强化之后的属性显示
        var carid = _carid;
        var attrstr = _str;
        var caridLv =_caridLv;
        var Node_car = _Node_car;
       //这个注释的内容还有用
        /*var _bulCount;
        if(this.commanderObj.lcar >=1 && this.commanderObj.lcar <= 3){
            _bulCount = 0;
        }else if(this.commanderObj.lcar >=4 && this.commanderObj.lcar <= 5){
            _bulCount = 1;
        }else if(this.commanderObj.lcar >=6 && this.commanderObj.lcar <= 7){
            _bulCount = 2;
        }*/
        this.carAttrArray = [];
        for(var j=1;j<COMCARCFG[carid.id].attr_base.length+1;j++){
            var attr_base = COMCARCFG[carid.id].attr_base[j-1];//基础属性
            var _attr_add = COMCARCFG[carid.id].attr_add;//基础增加属性

            for(var i=0;i<_attr_add.length;i++){
                if(_attr_add[i][0] == attr_base[0]){
                    var attr_add = COMCARCFG[carid.id].attr_add[j-1];
                }
            }
            var carAttr = attr_base[2] + (attr_add[2] * caridLv * (1 + COMCARCFG[carid.id].growthrate / 10000 * carid.star))
                * Math.pow(1.5,carid.star);
            if(carid.st > 0){
                //sattr_base和sattr_add数值对应顺序不同，数值计算就会出错
                var _sattr_base = COMCARCFG[carid.id].sattr_base;
                var _sattr_add =  COMCARCFG[carid.id].sattr_add;
                for(var i=0;i<_sattr_base.length;i++){
                    if(attr_base[0] == _sattr_base[i][0] && attr_base[0] == _sattr_add[i][0]){
                        var sattr_base = _sattr_base[i];
                        var sattr_add = _sattr_add[i];
                        carAttr += (sattr_base[2] + sattr_add[2] * carid.st);
                        if(parseInt(carid.st / 10)){
                            var _talent = COMCARCFG[carid.id].talent;
                            if(attr_base[0] == _talent[0]){
                                carAttr += (_talent[2] * parseInt(carid.st / 10));
                            }
                        }
                    }
                }
            }
            //如果组合属性激活，则加入组合属性
            for(var i=0;i<3;i++){
                if(this.bulArray[i]){
                    var combination = COMCARCOMBINATIONCFG[i+1].combination;
                    for(var x=0;x<combination.length;x++){
                        if(combination[x][0] == attr_base[0]){
                            carAttr += combination[x][2];
                        }
                    }
                }
            }
            //这个注释还有用
            /*if(this.bulArray[_bulCount]){
                var combination = COMCARCFG[carid.id].combination;
                for(var i=0;i<combination.length;i++){
                    if(combination[i][0] == attr_base[0]){
                        carAttr += combination[i][2];
                    }
                }
            }*/

            var _attrName = attrstr +j;
            var attrName = ccui.helper.seekWidgetByName(Node_car, _attrName);
            attrName.setString(StringArray[j - 1]+ parseInt(carAttr));

            this.carAttrArray.push(parseInt(carAttr));
            this.sumCarAttr = this.carAttrArray.concat();
        }
        if(COMCARCFG[carid.id].attr_base.length < 4){
            for(var j=0; j < 4 - COMCARCFG[carid.id].attr_base.length; j++){
                var  _attrName = attrstr +(4-j);
                var attrName = ccui.helper.seekWidgetByName(Node_car, _attrName);
                attrName.setVisible(false);
            }
        }
    },

    carTouchEvent:function(sender, type){
      if(ccui.Widget.TOUCH_ENDED == type){
          switch (sender.name){
              case"btnBack"://返回按鈕
                  this.removeFromParent();
                  break;
              case"btnHeCheng":
                  baseModel.carCompound(parseInt(this.commandId), this.carIndexID);
                  break;
              case"btnCar"://座駕按鈕
                  this.carLayerObj.wgt.btnhSee.setVisible(true);
                  if(this.commanderObj.lcar == 0 && this.fcarIdArray.length == 0){
                      ShowTipsTool.TipsFromText(STRINGCFG[100235].string,cc.color.RED,30);
                      this.nodeVisible(0);
                  }else{
                      if(this.carCompoundArray.indexOf(this.carIndexID) != -1){
                          ShowTipsTool.TipsFromText(STRINGCFG[100235].string,cc.color.RED,30);
                          this.nodeVisible(0);
                          this.carLayerObj.wgt.btnCar.setBrightStyle(ccui.Widget.BRIGHT_STYLE_HIGH_LIGHT);
                          this.carLayerObj.wgt.Node_car1.setVisible(false);
                      }else{
                          this.carLayerObj.wgt.Node_car1.setVisible(true);
                          this.nodeVisible(0);
                      }
                  }
                  //this.carLayerObj.wgt.Image_44.setVisible(true);
                  break;
              case"btnUpLv"://升級按鈕
                  if(this.commanderObj.lcar == 0 && isEmptyObject(this.commanderObj.car)){
                      ShowTipsTool.TipsFromText(STRINGCFG[100235].string,cc.color.RED,30);
                  }else{
                      if(this.carCompoundArray.indexOf(this.carIndexID) != -1){
                          ShowTipsTool.TipsFromText(STRINGCFG[100235].string,cc.color.RED,30);
                      }else{
                          this.carLayerObj.wgt.btnhSee.setVisible(false);
                          this.nodeVisible(1);
                          this.btnUpLvData();
                      }
                  }
                  break;
              case"btnStren"://強化按鈕
                  if(this.commanderObj.lcar == 0 && isEmptyObject(this.commanderObj.car)){
                      ShowTipsTool.TipsFromText(STRINGCFG[100235].string,cc.color.RED,30);
                  }else{
                      if(this.carCompoundArray.indexOf(this.carIndexID) != -1){
                          ShowTipsTool.TipsFromText(STRINGCFG[100235].string,cc.color.RED,30);
                      }else{
                          this.carLayerObj.wgt.btnhSee.setVisible(false);
                          this.nodeVisible(2);
                          this.strenData();
                      }
                  }
                  break;
              case"btnUpStar"://升星按鈕
                  if(this.commanderObj.lcar == 0 && isEmptyObject(this.commanderObj.car)){
                      ShowTipsTool.TipsFromText(STRINGCFG[100235].string,cc.color.RED,30);
                  }else{
                      if(this.carCompoundArray.indexOf(this.carIndexID) != -1){
                          ShowTipsTool.TipsFromText(STRINGCFG[100235].string,cc.color.RED,30);
                      }else{
                          this.carLayerObj.wgt.btnhSee.setVisible(false);
                          this.nodeVisible(3);
                          this.upStarData();
                      }
                  }

                  break;
              case"btnReform"://重生按鈕
                  if(this.commanderObj.lcar == 0 && isEmptyObject(this.commanderObj.car)){
                      ShowTipsTool.TipsFromText(STRINGCFG[100235].string,cc.color.RED,30);
                  }else{
                      if(this.carCompoundArray.indexOf(this.carIndexID) != -1){
                          ShowTipsTool.TipsFromText(STRINGCFG[100235].string,cc.color.RED,30);
                      }else{
                          this.carLayerObj.wgt.btnhSee.setVisible(false);
                          this.nodeVisible(4);
                          this. RebirthData();
                      }
                  }
                  break;
              case"btnhShop"://座駕商店
                    var shopCarLayer = new ShopCarLayer();
                    this.getParent().myLayer.addChild(shopCarLayer, 2);
                  break;
              case"btnhSee"://圖鑒
                  this.carLayerObj.wgt.ListView_See.setVisible(true);
                  this.carLayerObj.wgt.upLowLevelBg.setVisible(false);
                  this.carLayerObj.wgt.Node_car1.setVisible(false);
                  this.btnhSeeData();
                  break;
              case"btnUp"://激活
                  if(this.fcarIdArray.length != 0){
                      this.lcar = this.commanderObj.lcar;
                      baseModel.carUseDown(parseInt(this.commandId), this.carIndexID);
                  }else{
                      ShowTipsTool.TipsFromText(STRINGCFG[100235].string,cc.color.RED,30);
                  }
                  break;
              case"btnDown"://卸下
                  this.lcar = this.commanderObj.lcar;
                  baseModel.carUseDown(parseInt(this.commandId), 0);
                  break;
              case"upLeftChangeButton":
                  this.carLayerObj.wgt.armyHeadList.scrollToLeft(0.2);
                  break;
              case"upRightChangeButton":
                  this.carLayerObj.wgt.armyHeadList.scrollToRight(0.2);
                  break;
              default:
                  break;
          }
      }
    },

    //按钮和节点显示控制函数
    nodeVisible:function(tab){
        if(this.carLayerObj.wgt.ListView_See.isVisible()){
            this.carLayerObj.wgt.ListView_See.setVisible(false);
            this.carLayerObj.wgt.upLowLevelBg.setVisible(true);
        }
        if(tab == this.nodeTab){
            this.btnArray[tab].setBrightStyle(ccui.Widget.BRIGHT_STYLE_HIGH_LIGHT);
            return;
        }else{
            this.nodeArray[this.nodeTab].setVisible(false);
            this.nodeArray[tab].setVisible(true);
            this.btnArray[this.nodeTab].setBrightStyle(ccui.Widget.BRIGHT_STYLE_NORMAL);
            this.btnArray[tab].setBrightStyle(ccui.Widget.BRIGHT_STYLE_HIGH_LIGHT);//控件高亮
            this.nodeTab = tab;
        }
    },

    //图鉴按钮界面的显示
    btnhSeeData:function(){
        this.carSeeItemObj = ccsTool.load(res.uiSeeItem, ["carItem", "Text_sName", "Image_4", "Image_hero1", "Text_get1",
        "Text_no1", "Image_4_0", "Image_hero2", "Text_get2", "Text_no2", "Image_4_1", "Image_hero3", "Text_get3", "Text_no3",
        "Text_sName_0", "Text_sDate1", "Text_sDate2", "Text_sDate3", "Text_sDate4"]);
        this.carLayerObj.wgt.ListView_See.removeAllItems();

        this.bulcount = 0;
        for(var key in COMCARCOMBINATIONCFG){
            var carItem = this.carSeeItemObj.wgt.carItem.clone();
            this.carLayerObj.wgt.ListView_See.pushBackCustomItem(carItem);
            var Text_sName = ccui.helper.seekWidgetByName(carItem, "Text_sName");
            Text_sName.setString(COMCARCOMBINATIONCFG[key].name);
            var combination = COMCARCOMBINATIONCFG[key].combination;
            if(COMCARCOMBINATIONCFG[key].carnum < 3){
                for(var i=0;i<COMCARCOMBINATIONCFG[key].carnum;i++){
                    var _Imagebg = "Image_one" + (i + 1);
                    var Imagebg = ccui.helper.seekWidgetByName(carItem, _Imagebg);
                    Imagebg.setPosition(cc.p(Imagebg.getPositionX() + 100, Imagebg.getPositionY()));
                    Imagebg.setTag(COMCARCOMBINATIONCFG[key].carid[i]);
                    var _Image_hero = "Image_hero" + (i + 1);
                    Imagebg.addTouchEventListener(this.carAttrDataEvn, this);
                    var Image_hero = ccui.helper.seekWidgetByName(carItem, _Image_hero);
                    Helper.LoadIcoImageWithPlist(Image_hero, ITEMCFG[COMCARCFG[COMCARCOMBINATIONCFG[key].carid[i]].synnum[0]]);

                    var _Text_no = "Text_no" + (i + 1);
                    var _Text_get = "Text_get" + (i + 1);
                    var Text_no = ccui.helper.seekWidgetByName(carItem, _Text_no);
                    var Text_get = ccui.helper.seekWidgetByName(carItem, _Text_get);
                    if (this.fcarIdArray.indexOf(COMCARCOMBINATIONCFG[key].carid[i]) != -1) {
                        Text_no.setVisible(false);
                        Text_get.setVisible(true);
                    }
                }
                for(var j=0; j<3 - COMCARCOMBINATIONCFG[key].carnum; j++){
                    var _Text_sDate = "Image_one"+(3-j);
                    var Text_sDate = ccui.helper.seekWidgetByName(carItem, _Text_sDate);
                    Text_sDate.setVisible(false);
                }
            }else{
                for(var i=0;i<COMCARCOMBINATIONCFG[key].carnum;i++){
                    var _Imagebg = "Image_one" + (i + 1);
                    var Imagebg = ccui.helper.seekWidgetByName(carItem, _Imagebg);
                    Imagebg.setTag(COMCARCOMBINATIONCFG[key].carid[i]);
                    var _Image_hero = "Image_hero" + (i + 1);
                    Imagebg.addTouchEventListener(this.carAttrDataEvn, this);
                    var Image_hero = ccui.helper.seekWidgetByName(carItem, _Image_hero);
                    Helper.LoadIcoImageWithPlist(Image_hero, ITEMCFG[COMCARCFG[COMCARCOMBINATIONCFG[key].carid[i]].synnum[0]]);

                    var _Text_no = "Text_no" + (i + 1);
                    var _Text_get = "Text_get" + (i + 1);
                    var Text_no = ccui.helper.seekWidgetByName(carItem, _Text_no);
                    var Text_get = ccui.helper.seekWidgetByName(carItem, _Text_get);
                    if (this.fcarIdArray.indexOf(COMCARCOMBINATIONCFG[key].carid[i]) != -1) {
                        Text_no.setVisible(false);
                        Text_get.setVisible(true);
                    }
                }
            }


            //图鉴名字的显示
            for(var i=1;i<COMCARCOMBINATIONCFG[key].carnum+1;i++){
                var _Text_name = "Text_name"+i;
                var Text_name = ccui.helper.seekWidgetByName(carItem, _Text_name);
                Text_name.setString(COMCARCFG[COMCARCOMBINATIONCFG[key].carid[i-1]].name);
            }
            //图鉴属性的显示
            if(this.bulArray[this.bulcount]){
                for(var i = 1; i < combination.length + 1; i++){
                    var _Text_sDate = "Text_sDate"+i;
                    var Text_sDate = ccui.helper.seekWidgetByName(carItem, _Text_sDate);
                    var data = combination[i-1];
                    if(data[1] == 1){
                        Text_sDate.setString(ATTRIBUTEIDCFG[data[0]].describe + data[2]);
                        Text_sDate.setColor(cc.color.GREEN);
                    }else{
                        Text_sDate.setString(ATTRIBUTEIDCFG[data[0]].describe + data[2]/100 + "%");
                        Text_sDate.setColor(cc.color.GREEN);
                    }
                }

            }else{
                for(var i = 1; i < combination.length + 1; i++){
                    var _Text_sDate = "Text_sDate"+i;
                    var Text_sDate = ccui.helper.seekWidgetByName(carItem, _Text_sDate);
                    var data = combination[i-1];
                    if(data[1] == 1){
                        Text_sDate.setString(ATTRIBUTEIDCFG[data[0]].describe + data[2]);
                    }else{
                        Text_sDate.setString(ATTRIBUTEIDCFG[data[0]].describe + data[2]/100 + "%");
                    }
                }
            }
            this.bulcount++;
            //去除多余的属性显示
            if(combination.length < 4){
                for(var j=0; j<4 - combination.length; j++){
                    var _Text_sDate = "Text_sDate"+(4-j);
                    var Text_sDate = ccui.helper.seekWidgetByName(carItem, _Text_sDate);
                    Text_sDate.setVisible(false);
                }
            }
        }
    },

    carAttrDataEvn:function(sendr, type){
        if(ccui.Widget.TOUCH_ENDED == type){
            var carDetailsLayer = new CarDdtailsLayer(sendr.getTag());
            this.getParent().myLayer.addChild(carDetailsLayer, 2);
        }
    },

    //升级界面*******************************************************************************************************
    btnUpLvData:function(){
        this._Node_car2 = ccsTool.seekWidget(this.carLayerObj.wgt.Node_car2, ["B_nowLvBar", "itemBg_3", "itemIcon_3",
        "itemNum_3", "itemBg_2", "itemIcon_2", "itemNum_2", "itemBg_1", "itemIcon_1", "itemNum_1", "B_upLv", "Text_gold",
        "B_upAuto", "LoadingBar", "Text_bar", "B_NowLv", "B_NowLv1", "B_NowLv2", "B_NowLv3", "B_NowLv4", "B_NextLv",
        "B_NextLv1", "B_NextLv2", "B_NextLv3","B_NextLv4", "ImageBlack1", "ImageBlack2", "ImageBlack3"]);

        Helper.LoadFrameImageWithPlist(this._Node_car2.wgt.itemBg_1, ITEMCFG[22119].quality);
        Helper.LoadFrameImageWithPlist(this._Node_car2.wgt.itemBg_2, ITEMCFG[22120].quality);
        Helper.LoadFrameImageWithPlist(this._Node_car2.wgt.itemBg_3, ITEMCFG[22121].quality);
        Helper.LoadIcoImageWithPlist(this._Node_car2.wgt.itemIcon_1, ITEMCFG[22119]);
        Helper.LoadIcoImageWithPlist(this._Node_car2.wgt.itemIcon_2, ITEMCFG[22120]);
        Helper.LoadIcoImageWithPlist(this._Node_car2.wgt.itemIcon_3, ITEMCFG[22121]);
        this._Node_car2.wgt.itemNum_1.setVisible(false);
        this._Node_car2.wgt.itemNum_2.setVisible(false);
        this._Node_car2.wgt.itemNum_3.setVisible(false);
        this._Node_car2.wgt.B_upLv.setVisible(false);
        if(!this._Node_car2.wgt.B_upAuto.isVisible()){
            this._Node_car2.wgt.B_upAuto.setVisible(true);
        }
        this._Node_car2.wgt.ImageBlack1.setVisible(true);
        this._Node_car2.wgt.ImageBlack2.setVisible(true);
        this._Node_car2.wgt.ImageBlack3.setVisible(true);
        this._Node_car2.wgt.B_upAuto.addTouchEventListener(this.uplvTouchEvent, this);
        this._Node_car2.wgt.B_upLv.addTouchEventListener(this.uplvTouchEvent, this);
        //this._Node_car2.wgt.B_upAuto.setVisible(false);
        //var carid = this.commanderObj.car[this.commanderObj.lcar - 1];
        this._Node_car2.wgt.B_nowLvBar.setString(STRINGCFG[100236].string+ this.carAttr.lv);


        //当前等级
        var NowLvstr = "B_NowLv";
        this.attrCal(this.carAttr, NowLvstr, this.carAttr.lv,  this._Node_car2);

        //下一等级
        var NextLvstr = "B_NextLv";
        var nowCarAttr = this.carAttrArray.concat();
        this.attrCal(this.carAttr, NextLvstr, this.carAttr.lv+1,  this._Node_car2);
        for(var i=0;i<this.carAttrArray.length;i++){
            this.carAttrArray[i] = this.carAttrArray[i] - nowCarAttr[i];
        }

        this._Node_car2.wgt.Text_bar.setString(STRINGCFG[100237].string + this.carAttr.exp + "/" + COMCAREXPCFG[this.carAttr.lv + 1][COMCARCFG[this.carAttr.id].exp]);
        this._Node_car2.wgt.LoadingBar.setPercent(this.carAttr.exp/COMCAREXPCFG[this.carAttr.lv + 1][COMCARCFG[this.carAttr.id].exp] * 100);
        this._Node_car2.wgt.Text_gold.setString(Helper.formatNum(COMCAREXPCFG[this.carAttr.lv + 1].cost * 10000));
    },

    uplvTouchEvent:function(sender, type){
        if(ccui.Widget.TOUCH_ENDED == type){
            this.MaterialArray.length = 0;
            switch (sender.name){
                case"B_upAuto":
                    for(var key in GLOBALDATA.knapsack){
                        if(key == 22119 || key == 22120 || key == 22121){
                            this.MaterialArray.push(key);
                        }
                    }
                    this.dataJudge(this.MaterialArray);
                    break;
                case"B_upLv":
                    if(GLOBALDATA.base.money < COMCAREXPCFG[this.carAttr.lv + 1].cost * 10000){
                        ShowTipsTool.TipsFromText(STRINGCFG[100010].string,cc.color.RED,30);
                    }else{
                        baseModel.carUplev(parseInt(this.commandId), this.carIndexID, this.uid);
                    }
                    break;
                default:
                    break;
            }
        }
    },

    //升级界面自动添加处理函数
    dataJudge:function(Array){
        var MaterialArray = Array;
        this.uid = {};
        if(MaterialArray.length != 0){
            MaterialArray.sort();
            for(var i=0;i<MaterialArray.length;i++){
                var ExpValue;//升级所需的总经验值
                ExpValue = ITEMCFG[MaterialArray[i]].value * GLOBALDATA.knapsack[MaterialArray[i]];
            }
            if(ExpValue >= COMCAREXPCFG[this.carAttr.lv + 1][COMCARCFG[this.carAttr.id].exp] - this.carAttr.exp){
                var _ExpValue = 0;//自己有的经验值
                var _fExpValue;//经验值副本
                for(var i=0;i<MaterialArray.length;i++){
                    _fExpValue = _ExpValue;
                    _ExpValue += ITEMCFG[MaterialArray[i]].value * GLOBALDATA.knapsack[MaterialArray[i]];//一种物品的所有经验值
                    if(_ExpValue >= COMCAREXPCFG[this.carAttr.lv + 1][COMCARCFG[this.carAttr.id].exp] - this.carAttr.exp){
                        if(MaterialArray[i] == 22119){
                            var _itemNum = "itemNum_1";
                            var _ImageBlack = "ImageBlack1";
                        }else if(MaterialArray[i] == 22120){
                            var _itemNum = "itemNum_2";
                            var _ImageBlack = "ImageBlack2";
                        }else if(MaterialArray[i] == 22121){
                            var _itemNum = "itemNum_3";
                            var _ImageBlack = "ImageBlack3";
                        }
                        var itemNum = ccui.helper.seekWidgetByName(this._Node_car2, _itemNum);//需要物品的数量
                        itemNum.setVisible(true);
                        itemNum.setString(Math.ceil((((COMCAREXPCFG[this.carAttr.lv + 1][COMCARCFG[this.carAttr.id].exp]
                            - this.carAttr.exp) - _fExpValue)) / ITEMCFG[MaterialArray[i]].value));
                        var ImageBlack = ccui.helper.seekWidgetByName(this._Node_car2, _ImageBlack);//去掉图片遮盖
                        ImageBlack.setVisible(false);
                        this._Node_car2.wgt.B_upAuto.setVisible(false);
                        this._Node_car2.wgt.B_upLv.setVisible(true);
                        this.uid[MaterialArray[i]] = Math.ceil((((COMCAREXPCFG[this.carAttr.lv + 1][COMCARCFG[this.carAttr.id].exp]
                            - this.carAttr.exp) - _fExpValue)) / ITEMCFG[MaterialArray[i]].value);//物品对象，要传给后台的数据
                        break;
                    }else{
                        if(MaterialArray[i] == 22119){
                            var _itemNum = "itemNum_1";
                            var _ImageBlack = "ImageBlack1";
                        }else if(MaterialArray[i] == 22120){
                            var _itemNum = "itemNum_2";
                            var _ImageBlack = "ImageBlack2";
                        }else if(MaterialArray[i] == 22121){
                            var _itemNum = "itemNum_3";
                            var _ImageBlack = "ImageBlack3";
                        }
                        var itemNum = ccui.helper.seekWidgetByName(this._Node_car2, _itemNum);//需要物品的数量
                        itemNum.setVisible(true);
                        itemNum.setString(GLOBALDATA.knapsack[MaterialArray[i]]);//物品对象，传给后台的数据
                        this.uid[MaterialArray[i]] = GLOBALDATA.knapsack[MaterialArray[i]];
                        var ImageBlack = ccui.helper.seekWidgetByName(this._Node_car2, _ImageBlack);//去掉图片遮盖
                        ImageBlack.setVisible(false);
                        continue;
                    }
                }
            }else{
                ShowTipsTool.TipsFromText(STRINGCFG[100238].string,cc.color.RED,30);
            }
        }else{
            ShowTipsTool.TipsFromText(STRINGCFG[100238].string,cc.color.RED,30);
        }
    },

    //****************************************************************************************************************************
//强化界面
    strenData:function(){
        this._Node_car3 = ccsTool.seekWidget(this.carLayerObj.wgt.Node_car3, ["B_stren", "B_stren1", "B_stren2", "B_stren3",
        "B_stren4", "B_upStren", "Text_goldstr", "Text_strenCos", "B_upStrenSee", "ListView_See", "btnTipsOk", "textTipsDateNow",
        "textTipsDate", "Image_TipsDate", "ImageFastWar", "Panel_1"]);

        this._Node_car3.wgt.B_upStrenSee.addTouchEventListener(this.strenEvent, this);
        this._Node_car3.wgt.B_upStren.addTouchEventListener(this.strenEvent, this);
        this._Node_car3.wgt.Panel_1.addTouchEventListener(this.strenEvent, this);
        //var carAttri = this.commanderObj.car[this.commanderObj.lcar - 1];
        if(this.carAttr.lcar == 0){
            this._Node_car3.wgt.B_upStrenSee.setVisible(false);
        }else{
            this._Node_car3.wgt.B_upStrenSee.setVisible(true);
        }
        this._Node_car3.wgt.B_stren.setString(STRINGCFG[100028].string+this.carAttr.st);

        var sattr_base = COMCARCFG[this.carAttr.id].sattr_base;
        for(var i=0;i<sattr_base.length;i++){
            var _B_stren = "B_stren" + (i+1);
            var B_stren = ccui.helper.seekWidgetByName(this._Node_car3, _B_stren);
            if(this.carAttr.st == 0){
                B_stren.setString(STRINGCFG[100239].string+ ATTRIBUTEIDCFG[sattr_base[i][0]].describe + ":"
                + sattr_base[i][2] + "+" + COMCARCFG[this.carAttr.id].sattr_add[i][2]);
            }else{
                B_stren.setString(STRINGCFG[100239].string+ ATTRIBUTEIDCFG[sattr_base[i][0]].describe + ":"
                    + (sattr_base[i][2] + COMCARCFG[this.carAttr.id].sattr_add[i][2] * this.carAttr.st)
                    + "+" + COMCARCFG[this.carAttr.id].sattr_add[i][2]);
            }
        }
        if(sattr_base.length < 4){
            for(var j=0; j < 4 - sattr_base.length; j++){
                var  _B_stren = "B_stren" +(4-j);
                var B_stren = ccui.helper.seekWidgetByName(this._Node_car3, _B_stren);
                B_stren.setVisible(false);
            }
        }
        if(GLOBALDATA.base.money < COMCARSTRENGTHENCFG[this.carAttr.st+1].gold * 10000){
            this._Node_car3.wgt.Text_goldstr.setString(Helper.formatNum(COMCARSTRENGTHENCFG[this.carAttr.st+1].gold * 10000));
            this._Node_car3.wgt.Text_goldstr.setColor(cc.color.RED);
        }else{
            this._Node_car3.wgt.Text_goldstr.setString(Helper.formatNum(COMCARSTRENGTHENCFG[this.carAttr.st+1].gold * 10000));
            this._Node_car3.wgt.Text_goldstr.setColor(cc.color.GREEN);
        }
        if(GLOBALDATA.knapsack["20"] != undefined){
            if(GLOBALDATA.knapsack["20"] < COMCARSTRENGTHENCFG[this.carAttr.st+1].cost[1]){
                this._Node_car3.wgt.Text_strenCos.setString(COMCARSTRENGTHENCFG[this.carAttr.st+1].cost[1]);
                this._Node_car3.wgt.Text_strenCos.setColor(cc.color.RED);
            }else{
                this._Node_car3.wgt.Text_strenCos.setString(COMCARSTRENGTHENCFG[this.carAttr.st+1].cost[1]);
                this._Node_car3.wgt.Text_strenCos.setColor(cc.color.GREEN);
            }
        }else{
            this._Node_car3.wgt.Text_strenCos.setString(COMCARSTRENGTHENCFG[this.carAttr.st+1].cost[1]);
            this._Node_car3.wgt.Text_strenCos.setColor(cc.color.RED);
        }

        this._Node_car3.wgt.Text_goldstr.setString(Helper.formatNum(COMCARSTRENGTHENCFG[this.carAttr.st+1].gold*10000));
        this._Node_car3.wgt.Text_strenCos.setString(COMCARSTRENGTHENCFG[this.carAttr.st+1].cost[1]);
    },

    strenEvent:function(sender, type){
        if(ccui.Widget.TOUCH_ENDED == type){
            var self = this;
            switch (sender.name){
                case"B_upStrenSee":
                    this._Node_car3.wgt.Panel_1.setVisible(true);
                    if(ccui.Widget.TOUCH_ENDED == type){
                        for(var i=0;i<16;i++){
                            this._Node_car3.wgt.textTipsDate.setString(STRINGCFG[100240].string+ COMCARCFG[self.carAttr.id].talent[2]
                                + "(" + STRINGCFG[100241].string +10*(i+1) + STRINGCFG[100242].string + ")");
                            var Image_TipsDate = this._Node_car3.wgt.Image_TipsDate.clone();
                            this._Node_car3.wgt.ListView_See.pushBackCustomItem(Image_TipsDate);
                        }
                    }
                    this._Node_car3.wgt.textTipsDateNow.setString(this.carAttr.st);
                    this._Node_car3.wgt.btnTipsOk.addTouchEventListener(this.okEvent, this);
                    break;
                case"B_upStren":
                    //var carAttri = this.commanderObj.car[this.commanderObj.lcar - 1];
                    if(GLOBALDATA.base.money > COMCARSTRENGTHENCFG[this.carAttr.st + 1].gold*10000){
                        if(GLOBALDATA.knapsack["20"] != undefined && GLOBALDATA.knapsack["20"] > COMCARSTRENGTHENCFG[this.carAttr.st+1].cost[1]){
                            baseModel.carStren(parseInt(this.commandId), this.carAttr.id);
                        }else{
                            ShowTipsTool.TipsFromText(STRINGCFG[100243].string,cc.color.RED,30);
                        }
                    }else{
                        ShowTipsTool.TipsFromText(STRING[100010].string,cc.color.RED,30);
                    }
                    break;
                case"Panel_1":
                    sender.setVisible(false);
                    break;
                default:
                    break;
            }
        }


    },

    okEvent:function(sender, type){
        var self = this;
        if(ccui.Widget.TOUCH_ENDED == type){
            self._Node_car3.wgt.Panel_1.setVisible(false);
        }
    },
//**********************************************************************************************************
//升星界面信息
    upStarData:function(){
        this._Node_car4 = ccsTool.seekWidget(this.carLayerObj.wgt.Node_car4, ["B_nowLvSkill", "itemBgSkill", "itemIconSkill1",
        "itemNumSkill1", "itemBgSkill2", "itemIconSkill2", "itemNumSkill2", "B_upStar", "Text_goldStar",
        "Image_Upstar1", "Image_Upstar2", "Image_Upstar3", "Image_Upstar4", "Image_Upstar5", "Image_Upstar6",
        "B_NowStar1", "B_NowStar2", "B_NowStar3", "B_NowStar4", "B_NowStarSkill", "Image_Nextstar1", "Image_Nextstar2",
        "Image_Nextstar3", "Image_Nextstar4", "Image_Nextstar5", "Image_Nextstar6", "B_NextStar1", "B_NextStar2",
        "B_NextStar3", "B_NextStar4", "B_NextStarSkill", "Image_SkillSee", "ListView_SeeSkill", "btnSkillOk",
        "textTipsDateSkill", "ImageBlack1", "ImageBlack2", "ImageSkillSee", "Image_DateSkill", "Panel_2"]);
        //var carAttri = this.commanderObj.car[this.commanderObj.lcar - 1];
        this._Node_car4.wgt.B_upStar.addTouchEventListener(this.upStarEvent, this);
        this._Node_car4.wgt.Image_SkillSee.addTouchEventListener(this.seeSkillEvent, this);
        this._Node_car4.wgt.btnSkillOk.addTouchEventListener(this.seeSkillEvent, this);
        this._Node_car4.wgt.Panel_2.addTouchEventListener(this.seeSkillEvent, this);

        //升星前技能
        if(this.carAttr.star > 0){
            if(this.carAttr.star >0 && this.carAttr.star <= 2){
                var carSkill = COMCARCFG[this.carAttr.id].skill[0];
                this._Node_car4.wgt.B_NowStarSkill.setString(SKILLCFG[carSkill[1]].skillname + "LV1");
            }else if(this.carAttr.star > 2 && this.carAttr.star <= 4){
                var carSkill = COMCARCFG[this.carAttr.id].skill[1];
                this._Node_car4.wgt.B_NowStarSkill.setString(SKILLCFG[carSkill[1]].skillname + "LV2");
            }else if(this.carAttr.star == 5){
                var carSkill = COMCARCFG[this.carAttr.id].skill[2];
                this._Node_car4.wgt.B_NowStarSkill.setString(SKILLCFG[carSkill[1]].skillname + "LV3");
            }
            //this._Node_car4.wgt.B_NowStarSkill.setString();
        }else{
            this._Node_car4.wgt.B_NowStarSkill.setString(STRINGCFG[100244].string);
        }
        //升星后技能
        if(this.carAttr.star + 1 >= 0 && this.carAttr.star + 1 <= 2){
            var carSkill = COMCARCFG[this.carAttr.id].skill[0];
            this._Node_car4.wgt.B_NextStarSkill.setString(SKILLCFG[carSkill[1]].skillname + "LV1");
        }else if(this.carAttr.star + 1 > 2 && this.carAttr.star + 1 <= 4){
            var carSkill = COMCARCFG[this.carAttr.id].skill[1];
            this._Node_car4.wgt.B_NextStarSkill.setString(SKILLCFG[carSkill[1]].skillname + "LV2");
        }else if(this.carAttr.star + 1 == 5){
            var carSkill = COMCARCFG[this.carAttr.id].skill[2];
            this._Node_car4.wgt.B_NextStarSkill.setString(SKILLCFG[carSkill[1]].skillname + "LV3");
        }
        //升星前
        if(this.carAttr.star > 0){
            for(var i=0;i<this.carAttr.star;i++){
                var _Upstar = "Image_Upstar"+(i+1);
                var Upstar = ccui.helper.seekWidgetByName(this._Node_car4, _Upstar);
                Upstar.setVisible(true);
            }
        }
        var _nowstr = "B_NowStar";
        this.starAttrCal(this.carAttr, _nowstr, this.carAttr.star, this._Node_car4);

        //升星后
        if(this.carAttr.star + 1 > 0){
            for(var i=0;i<this.carAttr.star + 1;i++){
                var _Upstar = "Image_Nextstar"+(i+1);
                var Upstar = ccui.helper.seekWidgetByName(this._Node_car4, _Upstar);
                Upstar.setVisible(true);
            }
        }
        var _nextstr = "B_NextStar";
        var nowcarAttr = this.carAttrArray.concat();
        this.starAttrCal(this.carAttr, _nextstr, this.carAttr.star+1, this._Node_car4);
        for(var i=0;i<this.carAttrArray.length;i++){
            this.carAttrArray[i] = this.carAttrArray[i] - nowcarAttr[i];
        }
        for(var key in COMCARCFG){
            if(COMCARCFG[key].id == this.carAttr.id){
                var carQulity = COMCARCFG[key].quality;
                break;
            }
        }
        this._Node_car4.wgt.ImageBlack1.setVisible(false);
        this._Node_car4.wgt.ImageBlack2.setVisible(false);
        for(var atarKey in COMCARSTARCFG){
            if(COMCARSTARCFG[atarKey].star == this.carAttr.star+1 && COMCARSTARCFG[atarKey].quality == carQulity){
                var upStarAttr = COMCARSTARCFG[atarKey];
                this._Node_car4.wgt.B_nowLvSkill.setString(STRINGCFG[100245].string+ this.carAttr.lv + "/" + upStarAttr.lv);
                this._Node_car4.wgt.B_nowLvSkill.setFontSize(18);
                Helper.LoadFrameImageWithPlist(this._Node_car4.wgt.itemBgSkill, ITEMCFG[upStarAttr.cost[0]].quality);
                Helper.LoadFrameImageWithPlist(this._Node_car4.wgt.itemBgSkill2, carQulity);
                Helper.LoadIcoImageWithPlist(this._Node_car4.wgt.itemIconSkill1, ITEMCFG[upStarAttr.cost[0]]);
                Helper.LoadIcoImageWithPlist(this._Node_car4.wgt.itemIconSkill1, ITEMCFG[COMCARCFG[this.carAttr.id].synnum[0]]);
                if(GLOBALDATA.knapsack[upStarAttr.cost[0]] == 0 || GLOBALDATA.knapsack[upStarAttr.cost[0]] == undefined){
                    this._Node_car4.wgt.itemNumSkill1.setString("0/"+upStarAttr.cost[1]);
                    this._Node_car4.wgt.itemNumSkill1.setColor(cc.color.RED);
                }else{
                    this._Node_car4.wgt.itemNumSkill1.setString(GLOBALDATA.knapsack[upStarAttr.cost[0]] + "/" +upStarAttr.cost[1]);
                    if(GLOBALDATA.knapsack[upStarAttr.cost[0]] < upStarAttr.cost[1]){
                        this._Node_car4.wgt.itemNumSkill1.setColor(cc.color.RED);
                    }else{
                        this._Node_car4.wgt.itemNumSkill1.setColor(cc.color.GREEN);
                    }
                }
                if(GLOBALDATA.knapsack[COMCARCFG[this.carAttr.id].synnum[0]] == 0 || GLOBALDATA.knapsack[COMCARCFG[this.carAttr.id].synnum[0]] == undefined){
                    this._Node_car4.wgt.itemNumSkill2.setString("0/"+upStarAttr.card);
                    this._Node_car4.wgt.itemNumSkill2.setColor(cc.color.RED);
                }else{
                    this._Node_car4.wgt.itemNumSkill2.setString(GLOBALDATA.knapsack[COMCARCFG[this.carAttr.id].synnum[0]] + "/"+upStarAttr.card);
                    if(GLOBALDATA.knapsack[COMCARCFG[this.carAttr.id].synnum[0]] < upStarAttr.card){
                        this._Node_car4.wgt.itemNumSkill2.setColor(cc.color.RED);
                    }else{
                        this._Node_car4.wgt.itemNumSkill2.setColor(cc.color.GREEN);
                    }
                }
                if(upStarAttr.gold >= GLOBALDATA.base.money){
                    this._Node_car4.wgt.Text_goldStar.setString(Helper.formatNum(upStarAttr.gold * 10000));
                    this._Node_car4.wgt.Text_goldStar.setColor(cc.color.RED);
                }else{
                    this._Node_car4.wgt.Text_goldStar.setString(Helper.formatNum(upStarAttr.gold * 10000));
                    this._Node_car4.wgt.Text_goldStar.setColor(cc.color.GREEN);
                }
                break;
            }
        }

    },

    upStarEvent:function(sender, type){
        if(ccui.Widget.TOUCH_ENDED == type){
            //var carAttri = this.commanderObj.car[this.commanderObj.lcar - 1];
            for(var key in COMCARCFG){
                if(COMCARCFG[key].id == this.carAttr.id){
                    var _carQulity = COMCARCFG[key].quality;
                    break;
                }
            }
            for(var atarKey in COMCARSTARCFG) {
                if (COMCARSTARCFG[atarKey].star == this.carAttr.star + 1 && COMCARSTARCFG[atarKey].quality == _carQulity) {
                    var _upStarAttr = COMCARSTARCFG[atarKey];
                }
            }
            if(this.carAttr.lv > _upStarAttr.lv){
                if(GLOBALDATA.knapsack[_upStarAttr.cost[0]] != undefined){
                    if(GLOBALDATA.knapsack[_upStarAttr.cost[0]] >= _upStarAttr.cost[1]  &&
                        GLOBALDATA.knapsack[COMCARCFG[this.carAttr.id].synnum[0]] >= _upStarAttr.card){
                        if(GLOBALDATA.base.money >= _upStarAttr.gold){
                            baseModel.upStar(parseInt(this.commandId), this.carAttr.id);
                        }else{
                            ShowTipsTool.TipsFromText(STRINGCFG[100010],cc.color.RED,30);
                        }
                    }else{
                        ShowTipsTool.TipsFromText(STRINGCFG[100243].string,cc.color.RED,30);
                    }
                }
            }else{
                ShowTipsTool.TipsFromText(STRINGCFG[100246].string,cc.color.RED,30);
            }
        }
    },

    seeSkillEvent:function(sender, type){
        if(ccui.Widget.TOUCH_ENDED == type){
            //var carAttri = this.commanderObj.car[this.commanderObj.lcar - 1];
            switch (sender.name){
                case"Image_SkillSee":
                    this._Node_car4.wgt.Panel_2.setVisible(true);
                    var carSkill = COMCARCFG[this.carAttr.id].skill;
                    for(var i=0;i<carSkill.length;i++){
                        this._Node_car4.wgt.textTipsDateSkill.setString(SKILLCFG[carSkill[i][1]].skillname + SKILLCFG[carSkill[i][1]].describe
                        + "技能CD:" + SKILLCFG[carSkill[i][1]].skillcd + "秒" + "(" + carSkill[i][0] + "星开启）");
                        var Image_DateSkill = this._Node_car4.wgt.Image_DateSkill.clone();
                        this._Node_car4.wgt.ListView_SeeSkill.pushBackCustomItem(Image_DateSkill);
                    }
                    break;
                case"btnSkillOk":
                    this._Node_car4.wgt.Panel_2.setVisible(false);
                    break;
                case"Panel_2":
                    sender.setVisible(false);
                    break;
                default:
                    break;
            }
        }
    },
    //升星界面的属性计算
    starAttrCal:function(_carAttri, _str, _carAttriStar, _Node_car){
        var carAttri = _carAttri;
        var attrstr = _str;
        var carAttriStar =_carAttriStar;
        var Node_car = _Node_car;
        //这个注释的内容还有用
        /*var _bulCount;
         if(this.commanderObj.lcar >=1 && this.commanderObj.lcar <= 3){
         _bulCount = 0;
         }else if(this.commanderObj.lcar >=4 && this.commanderObj.lcar <= 5){
         _bulCount = 1;
         }else if(this.commanderObj.lcar >=6 && this.commanderObj.lcar <= 7){
         _bulCount = 2;
         }*/
        this.carAttrArray = [];
        for(var j=1;j<COMCARCFG[carAttri.id].attr_base.length+1;j++){
            var attr_base = COMCARCFG[carAttri.id].attr_base[j-1];//基础属性
            var _attr_add = COMCARCFG[carAttri.id].attr_add;//基础增加属性

            for(var i=0;i<_attr_add.length;i++){
                if(_attr_add[i][0] == attr_base[0]){
                    var attr_add = COMCARCFG[carAttri.id].attr_add[j-1];
                }
            }
            var carAttr = attr_base[2] + (attr_add[2] * carAttri.lv * (1 + COMCARCFG[carAttri.id].growthrate / 10000 * carAttriStar))
                * Math.pow(1.5,carAttriStar);
            if(carAttri.st > 0){
                //sattr_base和sattr_add数值对应顺序不同，数值计算就会出错
                var _sattr_base = COMCARCFG[carAttri.id].sattr_base;
                var _sattr_add =  COMCARCFG[carAttri.id].sattr_add;
                for(var i=0;i<_sattr_base.length;i++){
                    if(attr_base[0] == _sattr_base[i][0] && attr_base[0] == _sattr_add[i][0]){
                        var sattr_base = _sattr_base[i];
                        var sattr_add = _sattr_add[i];
                        carAttr += (sattr_base[2] + sattr_add[2] * carAttri.st);
                        if(parseInt(carAttri.st / 10)){
                            var _talent = COMCARCFG[carAttri.id].talent;
                            if(attr_base[0] == _talent[0]){
                                carAttr += (_talent[2] * parseInt(carAttri.st / 10));
                            }
                        }
                    }
                }
            }
            //如果组合属性激活，则加入组合属性
            for(var i=0;i<3;i++){
                if(this.bulArray[i]){
                    var combination = COMCARCOMBINATIONCFG[i+1].combination;
                    for(var x=0;x<combination.length;x++){
                        if(combination[x][0] == attr_base[0]){
                            carAttr += combination[x][2];
                        }
                    }
                }
            }
            //这个注释还有用
            /*if(this.bulArray[_bulCount]){
             var combination = COMCARCFG[carid.id].combination;
             for(var i=0;i<combination.length;i++){
             if(combination[i][0] == attr_base[0]){
             carAttr += combination[i][2];
             }
             }
             }*/

            var _attrName = attrstr +j;
            var attrName = ccui.helper.seekWidgetByName(Node_car, _attrName);
            attrName.setString(StringArray[j-1]+ parseInt(carAttr));
            this.carAttrArray.push(parseInt(carAttr));
        }
        if(COMCARCFG[carAttri.id].attr_base.length < 4){
            for(var j=0; j < 4 - COMCARCFG[carAttri.id].attr_base.length; j++){
                var  _attrName = attrstr +(4-j);
                var attrName = ccui.helper.seekWidgetByName(Node_car, _attrName);
                attrName.setVisible(false);
            }
        }
    },

    //*****************************************************************************************************************
    //座驾重生
    RebirthData:function(){
        this._Node_car5 = ccsTool.seekWidget(this.carLayerObj.wgt.Node_car5, ["B_Ref", "ListView_Ref", "item", "bagBgRef",
        "bagIconRef", "textTipsRef", "btnTipsOkRef", "ImageRef", "Panel_3"]);

        this._Node_car5.wgt.B_Ref.addTouchEventListener(this.rebirthEvent, this);
        this._Node_car5.wgt.btnTipsOkRef.addTouchEventListener(this.rebirthOkEvent, this);
        this._Node_car5.wgt.Panel_3.addTouchEventListener(this.rebirthOkEvent, this);
    },

    rebirthEvent:function(sender, type){
        if(ccui.Widget.TOUCH_ENDED == type){
            if(this.commanderObj.lcar != 0){
                var carAttri = this.commanderObj.car[this.commanderObj.lcar];
                if(this.carIndexID == carAttri.id){
                    ShowTipsTool.TipsFromText(STRINGCFG[100247].string,cc.color.RED,30);
                }else{
                    if(this.carAttr.lv >1 || this.carAttr.st > 0 || this.carAttr.st > 0){
                        this.ItemsDisplay();
                    }else{
                        ShowTipsTool.TipsFromText(STRINGCFG[100248].string,cc.color.RED,30);
                    }
                }
            }else{
                if(this.carAttr.lv >1 || this.carAttr.st > 0 || this.carAttr.star > 0){
                    this.ItemsDisplay();
                }else{
                    ShowTipsTool.TipsFromText(STRINGCFG[100248].string,cc.color.RED,30);
                }
            }
        }
    },

    rebirthOkEvent:function(sender, type){
        if(ccui.Widget.TOUCH_ENDED == type){
            switch (sender.name){
                case"btnTipsOkRef":
                    baseModel.carRebirth(parseInt(this.commandId), this.carIndexID);
                    this._Node_car5.wgt.Panel_3.setVisible(false);
                    break;
                case"Panel_3":
                    sender.setVisible(false);
                    break;
                default:
                    break;
            }
        }
    },

    ItemsDisplay:function(){
        this._Node_car5.wgt.Panel_3.setVisible(true);
        var sumExp = 0;
        //var thingArray = [];//物品数组
        var thing = {};
        if(this.carAttr.lv > 1){
            sumExp += this.carAttr.exp;
            for(var i = this.carAttr.lv; i>1; i--){
                sumExp += COMCAREXPCFG[i][COMCARCFG[this.carIndexID].exp]
            }
        }
        if(sumExp / 10000 > 1){
            thing[22121] = parseInt(sumExp / 10000);
            if(sumExp % 10000 / 5000 > 1){
                thing[22120] = parseInt(sumExp % 10000 / 5000);
                if(sumExp % 10000 % 5000 / 1000 > 1){
                    thing[22119] = parseInt(sumExp % 10000 % 5000 / 1000);
                }
            }else{
                if(sumExp % 10000 / 1000 > 1){
                    thing[22119] = parseInt(sumExp % 10000 / 5000);
                }
            }
        }else{
            if(sumExp / 5000 > 1){
                thing[22120] = parseInt(sumExp % 5000);
                if(sumExp % 5000 / 1000 > 1){
                    thing[22119] = parseInt(sumExp % 5000 / 5000);
                }
            }else{
                if(sumExp / 1000 > 1){
                    thing[22119] = parseInt(sumExp / 1000);
                }
            }
        }

        if(this.carAttr.st > 1){
            var _thingNum = 0;
            var goldNum = 0;
            for(var i=this.carAttr.st; i>1;i--){
                _thingNum += COMCARSTRENGTHENCFG[this.carAttr.st].cost[1];
                goldNum += COMCARSTRENGTHENCFG[this.carAttr.st].gold;
            }
            thing[COMCARSTRENGTHENCFG[this.carAttr.st].cost[1]] = _thingNum;
            thing[1] = _thingNum;
        }

        if(this.carAttr.star > 0){
            var _thingNum = 0;
            var goldNum = 0;
            var cardNum = 0;
            for(var key in COMCARSTRENGTHENCFG){
                if(COMCARCFG[this.carAttr.id].quality == COMCARSTRENGTHENCFG[key].quality){
                    if(COMCARSTRENGTHENCFG[key].star <= this.carAttr.star){
                        _thingNum += COMCARSTRENGTHENCFG[key].cost[1];
                        goldNum += COMCARSTRENGTHENCFG[key].gold;
                        cardNum += COMCARSTRENGTHENCFG[key].card;
                    }
                }
            }
            thing[22118] = _thingNum;
            thing[COMCARCFG[this.carAttr.id].synnum[0]] = cardNum;
            if(thing[1] != undefined){
                thing[1] += goldNum;
            }else{
                thing[1] = goldNum;
            }
        }
        var count = 0;
        //this._Node_car5.wgt.ListView_Ref.removeAllItems();
        for(var key in thing){
            var _count = count%3;
            var item = this._Node_car5.wgt.item.clone();
            var textTipsRef = ccui.helper.seekWidgetByName(item, "textTipsRef");
            textTipsRef.setString(thing[key]);
            var bagBgRef = ccui.helper.seekWidgetByName(item, "bagBgRef");
            Helper.LoadFrameImageWithPlist(bagBgRef, ITEMCFG[key].quality);
            var bagIconRef = ccui.helper.seekWidgetByName(item, "bagIconRef");
            Helper.LoadIcoImageWithPlist(bagIconRef, ITEMCFG[key]);
            if(_count == 0 ){
                var layout = new ccui.Layout();
                layout.setContentSize(cc.size(this._Node_car5.wgt.ListView_Ref.getContentSize().width,
                    this._Node_car5.wgt.item.getContentSize().height));
                this._Node_car5.wgt.ListView_Ref.pushBackCustomItem(layout);
            }
            item.setAnchorPoint(0,0);
            item.setPosition(cc.p(item.getContentSize().width*_count, 0));
            layout.addChild(item);
            count++;
        }

    },




    onExit:function(){
        this._super();
        cc.eventManager.removeListener(this.upSatarEvn);
        cc.eventManager.removeListener(this.carUseDownEvent);
        cc.eventManager.removeListener(this.carStrenEvent);
        cc.eventManager.removeListener(this.carUpLevEvent);
        cc.eventManager.removeListener(this.carRebirthEvent);
        cc.eventManager.removeListener(this.carCompoundEvent);
    }
});