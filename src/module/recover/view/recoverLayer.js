
/**
 ** @Author:pandayu
 ** @Version:1.0
 ** @DateTime:2018-09-09
 ** @Project:pandaCard CardGame
 ** @Contact: QQ:815099602
 **/
var recoverLayer = baseLayer.extend({
    ctor:function () {
        this._super();
        this.LayerName = "recoverLayer";
        cc.log('recoverLayer ctor');
        this.click_top_index = 0;
        this.top_btn_array = new Array();
        this.bagBg_array = new Array();
        this.bagIcon_array = new Array();
        this.addAttImage_array = new Array();
        this.return_data = {};
        this.add_new_item_index = {};
        this.delete_item_index = {};

        this.break_choose ={};//分解列表 选中的分解项的集合
        this.second_break_choose = {};//进入分解列表选择时的中转的选择集合
        this.choose_position = {};
        this.choose_num = 0  //分解列表选中数量
        String.prototype.format=function(args) {
            var result = this;
            if (arguments.length > 0) {
                if (arguments.length == 1 && typeof (args) == "object") {
                    for (var key in args) {
                        if(args[key]!=undefined){
                            var reg = new RegExp("({" + key + "})", "g");
                            result = result.replace(reg, args[key]);
                        }
                    }
                }
                else {
                    for (var i = 0; i < arguments.length; i++) {
                        if (arguments[i] != undefined) {
                            var reg = new RegExp("({[" + i + "]})", "g");
                            result = result.replace(reg, arguments[i]);
                        }
                    }
                }
            }
            return result;
        };
    },
    onEnter:function () {
        this._super();
        var self = this;

        this.breakEvent = cc.EventListener.create({
            event: cc.EventListener.CUSTOM,
            eventName: "depot.reclaim",  //装备 饰品分解
            callback: function(event){
                var data = event.getUserData();
                if(data.status==0){
                    self.showMiddlePanle(self.click_top_index);
                    self.recoverNode.wgt.layoutGet.setVisible(false);
                    self.retrunImageicon();
                    self.second_break_choose = {};
                    self.break_choose = {};
                    self.choose_position = {};
                    self.choose_num = 0;
                    self.resourceGet(data);
                }
            }
        });
        cc.eventManager.addListener(this.breakEvent, 1);

        this.rebornEvent = cc.EventListener.create({
            event: cc.EventListener.CUSTOM,
            eventName: "depot.reborn",  //装备 饰品重生
            callback: function(event){
                var data = event.getUserData();
                if(data.status==0){
                    self.showMiddlePanle(self.click_top_index);
                    self.recoverNode.wgt.layoutGet.setVisible(false);
                    self.retrunImageicon();
                    self.second_break_choose = {};
                    self.break_choose = {};
                    self.choose_position = {};
                    self.choose_num = 0;
                    self.resourceGet(data);
                }
            }
        });
        cc.eventManager.addListener(this.rebornEvent, 1);

        this.soldierbreakEvent = cc.EventListener.create({
            event: cc.EventListener.CUSTOM,
            eventName: "soldier.reclaim",
            callback: function(event){
                var data = event.getUserData();
                if(data.status==0){
                    self.showMiddlePanle(self.click_top_index);
                    self.recoverNode.wgt.layoutGet.setVisible(false);
                    self.retrunImageicon();
                    self.second_break_choose = {};
                    self.break_choose = {};
                    self.choose_position = {};
                    self.choose_num = 0;
                    self.resourceGet(data);
                }
            }
        });
        cc.eventManager.addListener(this.soldierbreakEvent, 1);

        this.soldierrebornEvent = cc.EventListener.create({
            event: cc.EventListener.CUSTOM,
            eventName: "soldier.reborn",
            callback: function(event){
                var data = event.getUserData();
                if(data.status==0){
                    self.showMiddlePanle(self.click_top_index);
                    self.recoverNode.wgt.layoutGet.setVisible(false);
                    self.retrunImageicon();
                    self.second_break_choose = {};
                    self.break_choose = {};
                    self.choose_position = {};
                    self.choose_num = 0;
                    self.resourceGet(data);
                }
            }
        });
        cc.eventManager.addListener(this.soldierrebornEvent, 1);
    },

    onExit:function () {
        this._super();
        cc.log('recoverLayer onExit');
        cc.eventManager.removeListener(this.soldierbreakEvent);
        cc.eventManager.removeListener(this.soldierrebornEvent);
        cc.eventManager.removeListener(this.breakEvent);
        cc.eventManager.removeListener(this.rebornEvent);
        this.recoverNode.wgt.FileNode_1.stopActionByTag(1);
    },
    initUI:function () {
        this.recoverNode = ccsTool.load(res.uiRecoverLayer,["upLowLevelBg","heroBreakButton","taskImageHero","heroReButton","equBreakButton","taskImageEqu","equReButton","ornamentBreakButton","taskImageOrn","ornamentReButton",
        "middleBg","nodebreak","bagBg1","bagIcon1","addAttImage1","bagBg2","bagIcon2","addAttImage2","bagBg3","bagIcon3","addAttImage3","bagBg4","bagIcon4","addAttImage4","bagBg5","bagIcon5","addAttImage5","bagBg6","bagIcon6","addAttImage6","bagBg7","bagIcon7","addAttImage7","bagBg8","bagIcon8","addAttImage8","bagBg9","bagIcon9","addAttImage9",
            "nodehero","heroButton","heroValue","nodeequ","equButton","equValue",
            "downLewLevelBg","autoButton","breakButton","renascenceButton","nodeone",
            "layoutChange","listChange","btnCanel","btnOk","textNum","btnBack",
        "layoutTips","btnTipsCanel","btnTipsOk",
        "layoutGet","listGet","btnGetCanel","btnGetOk",
        "date1","date2","date3","FileNode_1","FileNode_2"]);
        this.recoverNode.node.setPosition(0,105);
        this.addChild(this.recoverNode.node,10);

        this.recoverNode.wgt.heroBreakButton.addTouchEventListener(this.touchEvent,this);
        this.top_btn_array.push(this.recoverNode.wgt.heroBreakButton);
        this.recoverNode.wgt.heroReButton.addTouchEventListener(this.touchEvent,this);
        this.top_btn_array.push(this.recoverNode.wgt.heroReButton);
        this.recoverNode.wgt.equBreakButton.addTouchEventListener(this.touchEvent,this);
        this.top_btn_array.push(this.recoverNode.wgt.equBreakButton);
        this.recoverNode.wgt.equReButton.addTouchEventListener(this.touchEvent,this);
        this.top_btn_array.push(this.recoverNode.wgt.equReButton);
        this.recoverNode.wgt.ornamentBreakButton.addTouchEventListener(this.touchEvent,this);
        this.top_btn_array.push(this.recoverNode.wgt.ornamentBreakButton);
        this.recoverNode.wgt.ornamentReButton.addTouchEventListener(this.touchEvent,this);
        this.top_btn_array.push(this.recoverNode.wgt.ornamentReButton);
        this.recoverNode.wgt.autoButton.addTouchEventListener(this.touchEvent,this); //自动添加
        this.recoverNode.wgt.breakButton.addTouchEventListener(this.touchEvent,this); //分解
        this.recoverNode.wgt.heroButton.addTouchEventListener(this.touchEvent,this);  //部队商店
        this.recoverNode.wgt.equButton.addTouchEventListener(this.touchEvent,this);  //装备商店
     //   this.recoverNode.wgt.ornButton.addTouchEventListener(this.touchEvent,this);  //饰品商店
        this.recoverNode.wgt.btnCanel.addTouchEventListener(this.touchEvent,this);  //分解列表取消按钮
        this.recoverNode.wgt.btnBack.addTouchEventListener(this.touchEvent,this);  //分解列表返回按钮
        this.recoverNode.wgt.btnOk.addTouchEventListener(this.touchEvent,this);  //分解列表确认按钮
        this.recoverNode.wgt.btnTipsCanel.addTouchEventListener(this.touchEvent,this);//提示有紫色以上物品弹框界面取消按钮
        this.recoverNode.wgt.btnTipsOk.addTouchEventListener(this.touchEvent,this);//提示有紫色以上物品弹框界面确认按钮
        this.recoverNode.wgt.btnGetCanel.addTouchEventListener(this.touchEvent,this);//返还材料预览界面取消按钮
        this.recoverNode.wgt.btnGetOk.addTouchEventListener(this.touchEvent,this);   //返还材料预览界面确认按钮
        this.recoverNode.wgt.renascenceButton.addTouchEventListener(this.touchEvent,this); //重生

        this.setOneTopBtnBright(0);
        this.saveIconInArray();
        for(var i=0;i< this.addAttImage_array.length;i++){
            this.addAttImage_array[i].addTouchEventListener(this.touchEvent,this);
        }
        this.recoverNode.wgt.addAttImage9.addTouchEventListener(this.touchEvent,this);
        var act = ccs.load(res.uiRecoverEffbreak1);
        act.action.setTag(1);
        act.action.play("action1",true);
        this.recoverNode.wgt.FileNode_1.runAction(act.action);
        this.dealRedPoint();
    },

    touchEvent:function (sender,type) {
        if(type == ccui.Widget.TOUCH_ENDED){
            switch(sender.name){
                case "heroBreakButton":  //部队分解
                    this.setOneTopBtnBright(0);
                    break;
                case "heroReButton":  //部队重生
                    this.setOneTopBtnBright(1);
                    break;
                case "equBreakButton":  //装备分解
                    this.setOneTopBtnBright(2);
                    break;
                case "equReButton":   //装备重生
                    this.setOneTopBtnBright(3);
                    break;
                case "ornamentBreakButton":  //配饰分解
                    this.setOneTopBtnBright(4);
                    break;
                case "ornamentReButton":    //配饰重生
                    this.setOneTopBtnBright(5);
                    break;
                case "autoButton":   //自动添加
                    //首先还原添加框
                    this.second_break_choose = {};
                    this.choose_position = {};
                    this.choose_num = 0;
                    this.retrunImageicon();
                    this.setAutuBreakData(this.click_top_index);
                    this.break_choose = this.second_break_choose;
                    var j = 0;
                    for(var int in this.break_choose){
                        this.choose_position[j] = true;
                        j = j+1;
                        this.choose_num = j;
                    }
                    var i = 0;
                    for(var key in this.break_choose){
                        this.addAttImage_array[i].setVisible(false)
                        if(this.click_top_index==0){
                            var hero = Helper.findItemId(this.break_choose[key].p);
                            Helper.LoadFrameImageWithPlist(this.bagBg_array[i],hero.quality);
                            Helper.LoadIcoImageWithPlist(this.bagIcon_array[i],hero);
                        }else if(this.click_top_index==2||this.click_top_index==4){
                            var equ = Helper.findItemId(this.break_choose[key].p);
                            Helper.LoadFrameImageWithPlist(this.bagBg_array[i],equ.quality);
                            Helper.LoadIcoImageWithPlist(this.bagIcon_array[i],equ);
                        }
                        i= i+1;
                    }
                    if(i==0){
                        //没有对应品级的材料分解提示
                    }
                    break;
                case "breakButton":  //分解
                    var length = 0;
                    for(var k in this.break_choose){
                        length = length+1;
                        break;
                    }
                    if(length>0){
                        //分解选中的士兵或者装备或者饰品  检查有无紫色及以上材料，有则弹框提示 没有则进入分解流程 计算分解之后的返还材料预览
                        if(this.isHasHighQuality(this.click_top_index)==true){
                            //弹框
                            this.recoverNode.wgt.layoutTips.setVisible(true);
                        }else{
                            //分解返回预览
                            this.recoverNode.wgt.layoutGet.setVisible(true);
                            this.return_data = {};
                            this.return_data = this.getReturn(this.click_top_index);
                            this.showRetrunListview(this.return_data);
                        }
                    }else{
                        ShowTipsTool.TipsFromText(STRINGCFG[100306].string,cc.color.RED,30);
                    }
                    break;
                case "heroButton":  //部队商店
                    var showHeroLayer = new ShopHeroLayer();
                    this.myLayer.addChild(showHeroLayer, 2);
                    break;
                case "equButton":  //装备商店
                    var shopEquLayer = new ShopEquLayer();
                    this.myLayer.addChild(shopEquLayer, 2);
                    break;
                // case "ornButton":  //饰品商店
                //     break;
                case "addAttImage1":
                    this.showAndLoadChoosePanel();
                    break;
                case "addAttImage2":
                    this.showAndLoadChoosePanel();
                    break;
                case "addAttImage3":
                    this.showAndLoadChoosePanel();
                    break;
                case "addAttImage4":
                    this.showAndLoadChoosePanel();
                    break;
                case "addAttImage5":
                    this.showAndLoadChoosePanel();
                    break;
                case "addAttImage6":
                    this.showAndLoadChoosePanel();
                    break;
                case "addAttImage7":
                    this.showAndLoadChoosePanel();
                    break;
                case "addAttImage8":
                    this.showAndLoadChoosePanel();
                    break;
                case "addAttImage9":
                    this.showAndLoadChoosePanel();
                    break;
                case "renascenceButton":
                    var length = 0;
                    for(var k in this.break_choose){
                        length = length+1;
                        break;
                    }
                    if(length>0){
                        //重生
                        if(this.isHasHighQuality(this.click_top_index)==true){
                            //弹框
                            this.recoverNode.wgt.layoutTips.setVisible(true);
                        }else{
                            //重生返回预览
                            this.recoverNode.wgt.layoutGet.setVisible(true);
                            this.return_data = {};
                            this.return_data = this.getReturn(this.click_top_index);
                            this.showRetrunListview(this.return_data);
                        }
                    }
                    break;
                case "btnCanel": //分解列表界面取消按钮
                    var data = this.getDataByIndex(this.click_top_index);
                    this.recoverNode.wgt.layoutChange.setVisible(false);
                    if(this.click_top_index==0||this.click_top_index==2||this.click_top_index==4){
                        if(this.delete_item_index!={}){
                            for(var num in this.delete_item_index){
                                this.second_break_choose[num] = data[num];
                                this.choose_position[num] = true;
                            }
                        }
                    }
                    //删除记录的位置信息
                    if(this.add_new_item_index!={}){
                        for(var key in this.add_new_item_index){
                            delete this.second_break_choose[key];
                            delete this.choose_position[key];
                        }
                    }
                    break;
                case "btnBack":
                    this.recoverNode.wgt.layoutChange.setVisible(false);
                    break;
                case "btnOk":    //列表界面确认按钮
                    var data = this.getDataByIndex(this.click_top_index);
                    if(this.add_new_item_index!={}){
                        for(var num in this.add_new_item_index){
                            if(this.click_top_index==0||this.click_top_index==2||this.click_top_index==4){
                                this.choose_num = this.choose_num + 1;
                            }
                            this.second_break_choose[num] = data[num];
                            this.choose_position[num] = true;
                        }
                    }
                    if(this.click_top_index==0||this.click_top_index==2||this.click_top_index==4){
                        if(this.delete_item_index!={}){
                            for(var key in this.delete_item_index){
                                delete this.second_break_choose[key];
                                delete this.choose_position[key];
                                if(this.click_top_index==0||this.click_top_index==2||this.click_top_index==4){
                                    this.choose_num = this.choose_num -1;
                                }
                            }
                        }
                    }
                    if(this.second_break_choose!={}){
                        this.break_choose = this.second_break_choose;
                    }
                    this.retrunImageicon();
                    this.setMainback();
                    break;
                case "btnTipsCanel":
                    this.recoverNode.wgt.layoutTips.setVisible(false);
                    break;
                case "btnTipsOk":
                    //分解返回预览
                    this.recoverNode.wgt.layoutGet.setVisible(true);
                    this.return_data = {};
                    this.return_data = this.getReturn(this.click_top_index);
                    this.showRetrunListview(this.return_data);
                    this.recoverNode.wgt.layoutTips.setVisible(false);
                    break;
                case "btnGetCanel":
                    //取消分解
                    this.recoverNode.wgt.layoutGet.setVisible(false);
                    break;
                case "btnGetOk":
                    //调用后台分解或者重生接口
                    var id_array = new Array();
                    var one = {};
                    for(var key in this.break_choose){
                        if(this.click_top_index==0){
                            if(this.break_choose[key].l>1||this.break_choose[key].q>0){
                                if(one[this.break_choose[key].myid]!=null){
                                    one[this.break_choose[key].myid].other = one[this.break_choose[key].myid].other+1;
                                }else{
                                    var a1 = {};
                                    a1["me"]=1;
                                    a1["other"] = 1;
                                    one[this.break_choose[key].myid] = a1;
                                }
                            }
                            else{
                                //未操作
                                if(one[this.break_choose[key].myid]!=null){
                                    one[this.break_choose[key].myid].other = one[this.break_choose[key].myid].other+1;
                                }else{
                                    var a1 = {};
                                    a1["me"]=0;
                                    a1["other"]=1;
                                    one[this.break_choose[key].myid] = a1;
                                }
                            }
                        }else{
                            id_array.push(this.break_choose[key].myid);
                        }
                    }
                    if(this.click_top_index==0){
                        recoverModel.soldierBreakFunction(one);
                    }else if(this.click_top_index==1){
                        recoverModel.soldierRestartFunction(id_array);
                    }else if(this.click_top_index==2||this.click_top_index==4){
                        recoverModel.breakFunction(id_array);
                    }else{
                        recoverModel.restartFunction(id_array);
                    }
                    //播放一次分解特效
                    var act = ccs.load(res.uiRecoverEffbreak2);
                    act.action.play("action1",false);
                    this.recoverNode.wgt.FileNode_2.runAction(act.action);
                    break;
                default:
                    break;
            }
        }

    },
    //列表选择之后 返回主界面显示
    setMainback:function () {
        //关闭列表界面 并且把选中的分解项图标加载到回收主界面
        if(this.choose_num>0){
            var i = 0;
            for(var key in this.break_choose){
                this.addAttImage_array[i].setVisible(false);
                if(this.click_top_index==0){
                //    var hero = Helper.findHeroById(this.break_choose[key].p);
                    var hero = Helper.findItemId(this.break_choose[key].p);
                    Helper.LoadFrameImageWithPlist(this.bagBg_array[i],hero.quality);
                    this.bagIcon_array[i].setVisible(true);
                    Helper.LoadIcoImageWithPlist(this.bagIcon_array[i],hero);
                    i= i+1;
                }
                else if(this.click_top_index==2||this.click_top_index==4){
                    var equ = Helper.findItemId(this.break_choose[key].p);
                    Helper.LoadFrameImageWithPlist(this.bagBg_array[i],equ.quality);
                    this.bagIcon_array[i].setVisible(true);
                    Helper.LoadIcoImageWithPlist(this.bagIcon_array[i],equ);
                    i= i+1;
                }else if(this.click_top_index==1){
                    this.recoverNode.wgt.addAttImage9.setVisible(false);
                 //   var hero = Helper.findHeroById(this.break_choose[key].p);
                    var hero = Helper.findItemId(this.break_choose[key].p);
                    Helper.LoadFrameImageWithPlist(this.recoverNode.wgt.bagBg9,hero.quality);
                    this.recoverNode.wgt.bagIcon9.setVisible(true);
                    Helper.LoadIcoImageWithPlist(this.recoverNode.wgt.bagIcon9,hero);
                    i= i+1;
                }else if(this.click_top_index==3||this.click_top_index==5){
                    this.recoverNode.wgt.addAttImage9.setVisible(false);
                    var equ = Helper.findItemId(this.break_choose[key].p);
                    Helper.LoadFrameImageWithPlist(this.recoverNode.wgt.bagBg9,equ.quality);
                    this.recoverNode.wgt.bagIcon9.setVisible(true);
                    Helper.LoadIcoImageWithPlist(this.recoverNode.wgt.bagIcon9,equ);
                    i= i+1;
                }
            }
        }
        this.recoverNode.wgt.layoutChange.setVisible(false);
    },
    setMainDec:function () { //显示回收主界面描述text
        this.recoverNode.wgt.date1.setVisible(true);
        this.recoverNode.wgt.date2.setVisible(true);
        if(this.click_top_index==0){
            this.recoverNode.wgt.date3.setVisible(true);
            this.recoverNode.wgt.date1.setString(STRINGCFG[100058].string);
            this.recoverNode.wgt.date2.setString(STRINGCFG[100059].string);
            this.recoverNode.wgt.date3.setString(STRINGCFG[100060].string);
        }else if(this.click_top_index==1){
            this.recoverNode.wgt.date3.setVisible(true);
            this.recoverNode.wgt.date1.setString(STRINGCFG[100066].string);
            this.recoverNode.wgt.date2.setString(STRINGCFG[100067].string);
            this.recoverNode.wgt.date3.setString(STRINGCFG[100068].string);
        }else if(this.click_top_index==2){
            this.recoverNode.wgt.date3.setVisible(true);
            this.recoverNode.wgt.date1.setString(STRINGCFG[100061].string);
            this.recoverNode.wgt.date2.setString(STRINGCFG[100062].string);
            this.recoverNode.wgt.date3.setString(STRINGCFG[100063].string);
        }else if(this.click_top_index==3){
            this.recoverNode.wgt.date3.setVisible(false);
            this.recoverNode.wgt.date1.setString(STRINGCFG[100069].string);
            this.recoverNode.wgt.date2.setString(STRINGCFG[100070].string);
        }else if(this.click_top_index==4){
            this.recoverNode.wgt.date3.setVisible(false);
            this.recoverNode.wgt.date1.setString(STRINGCFG[100064].string);
            this.recoverNode.wgt.date2.setString(STRINGCFG[100065].string);
        }else if(this.click_top_index==5){
            this.recoverNode.wgt.date3.setVisible(false);
            this.recoverNode.wgt.date1.setString(STRINGCFG[100071].string);
            this.recoverNode.wgt.date2.setString(STRINGCFG[100072].string);
        }

    },
    showMiddlePanle:function (index) {
        if(index==0 || index == 2 || index ==4){
            this.recoverNode.wgt.nodebreak.setVisible(true);
            this.recoverNode.wgt.bagBg9.setVisible(false);
        }else{
            this.recoverNode.wgt.nodebreak.setVisible(false);
            this.recoverNode.wgt.bagBg9.setVisible(true);
        }
        this.recoverNode.wgt.nodehero.setVisible(false);
        this.recoverNode.wgt.nodeequ.setVisible(false);
     //   this.recoverNode.wgt.nodeorn.setVisible(false);
        if(index==0||index==1){
            this.recoverNode.wgt.nodehero.setVisible(true);
            if(GLOBALDATA.virtual[17]==null){
                this.recoverNode.wgt.heroValue.setString(0);
            }else{
                this.recoverNode.wgt.heroValue.setString(GLOBALDATA.virtual[17]);
            }
        }
        else if(index==2||index==3){
            this.recoverNode.wgt.nodeequ.setVisible(true);
            if(GLOBALDATA.virtual[16]==null){
                this.recoverNode.wgt.equValue.setString(0);
            }else{
                this.recoverNode.wgt.equValue.setString(GLOBALDATA.virtual[16]);
            }
        }
        else if(index==4||index==5){
     //       this.recoverNode.wgt.nodeorn.setVisible(true);
            if(GLOBALDATA.virtual[22070]==null){

            }else{

            }
        }
    },
    showDownPanle:function (index) {
        if(index==1 || index == 3 || index ==5){
            this.recoverNode.wgt.nodeone.setVisible(false);
            this.recoverNode.wgt.renascenceButton.setVisible(true);
        }else{
            this.recoverNode.wgt.nodeone.setVisible(true);
            this.recoverNode.wgt.renascenceButton.setVisible(false);
        }
    },
    setOneTopBtnBright:function (index) {
     //   this.break_choose = {};
        this.second_break_choose = {};
        this.choose_position = {};
        this.choose_num = 0;
        this.retrunImageicon();
        if( this.click_top_index != index){
            this.top_btn_array[this.click_top_index].setBrightStyle(ccui.Widget.BRIGHT_STYLE_NORMAL);
            this.top_btn_array[this.click_top_index].setEnabled(true);
        }
        if(index == 0){
            this.recoverNode.wgt.heroBreakButton.setBrightStyle(ccui.Widget.BRIGHT_STYLE_HIGH_LIGHT);
            this.recoverNode.wgt.heroBreakButton.setEnabled(false);
        }
        else if(index == 1){
            this.recoverNode.wgt.heroReButton.setBrightStyle(ccui.Widget.BRIGHT_STYLE_HIGH_LIGHT);
            this.recoverNode.wgt.heroReButton.setEnabled(false);
            }
        else if(index == 2){
            this.recoverNode.wgt.equBreakButton.setBrightStyle(ccui.Widget.BRIGHT_STYLE_HIGH_LIGHT);
            this.recoverNode.wgt.equBreakButton.setEnabled(false);
        }
        else if(index == 3){
            this.recoverNode.wgt.equReButton.setBrightStyle(ccui.Widget.BRIGHT_STYLE_HIGH_LIGHT);
            this.recoverNode.wgt.equReButton.setEnabled(false);
        }
        else if(index == 4){
            this.recoverNode.wgt.ornamentBreakButton.setBrightStyle(ccui.Widget.BRIGHT_STYLE_HIGH_LIGHT);
            this.recoverNode.wgt.ornamentBreakButton.setEnabled(false);
        }
        else if(index == 5){
            this.recoverNode.wgt.ornamentReButton.setBrightStyle(ccui.Widget.BRIGHT_STYLE_HIGH_LIGHT);
            this.recoverNode.wgt.ornamentReButton.setEnabled(false);
        }
        this.click_top_index = index;
        this.setMainDec();
        this.showMiddlePanle(this.click_top_index);
        this.showDownPanle(this.click_top_index);
    },
    //将分解的8个按钮添加到数组
    saveIconInArray:function () {
        this.bagBg_array.push(this.recoverNode.wgt.bagBg1);
        this.bagBg_array.push(this.recoverNode.wgt.bagBg2);
        this.bagBg_array.push(this.recoverNode.wgt.bagBg3);
        this.bagBg_array.push(this.recoverNode.wgt.bagBg4);
        this.bagBg_array.push(this.recoverNode.wgt.bagBg5);
        this.bagBg_array.push(this.recoverNode.wgt.bagBg6);
        this.bagBg_array.push(this.recoverNode.wgt.bagBg7);
        this.bagBg_array.push(this.recoverNode.wgt.bagBg8);

        this.bagIcon_array.push(this.recoverNode.wgt.bagIcon1);
        this.bagIcon_array.push(this.recoverNode.wgt.bagIcon2);
        this.bagIcon_array.push(this.recoverNode.wgt.bagIcon3);
        this.bagIcon_array.push(this.recoverNode.wgt.bagIcon4);
        this.bagIcon_array.push(this.recoverNode.wgt.bagIcon5);
        this.bagIcon_array.push(this.recoverNode.wgt.bagIcon6);
        this.bagIcon_array.push(this.recoverNode.wgt.bagIcon7);
        this.bagIcon_array.push(this.recoverNode.wgt.bagIcon8);

        this.addAttImage_array.push(this.recoverNode.wgt.addAttImage1);
        this.addAttImage_array.push(this.recoverNode.wgt.addAttImage2);
        this.addAttImage_array.push(this.recoverNode.wgt.addAttImage3);
        this.addAttImage_array.push(this.recoverNode.wgt.addAttImage4);
        this.addAttImage_array.push(this.recoverNode.wgt.addAttImage5);
        this.addAttImage_array.push(this.recoverNode.wgt.addAttImage6);
        this.addAttImage_array.push(this.recoverNode.wgt.addAttImage7);
        this.addAttImage_array.push(this.recoverNode.wgt.addAttImage8);
    },
    //显示 并且加载选择分解项的列表数据方法
    showAndLoadChoosePanel:function () {
        var self = this;
        this.recoverNode.wgt.listChange.removeAllChildren();
        this.recoverNode.wgt.layoutChange.setVisible(true);
        self.recoverNode.wgt.textNum.setString("选中数量:"+self.choose_num);
        this.add_new_item_index = {};
        this.delete_item_index = {};
        var show_num = self.choose_num;
        var data = this.getDataByIndex(this.click_top_index);
        for(var i=0;i<data.length;i++){
            var breakitem = ccsTool.load(res.uiRecoverItem,["item"]).wgt.item;
            breakitem.removeFromParent(false);
            this.recoverNode.wgt.listChange.pushBackCustomItem(breakitem);
            var itemname = ccui.helper.seekWidgetByName(breakitem,"itemName");
            var itemlv = ccui.helper.seekWidgetByName(breakitem,"itemAttribute1");
            var itemzizhi = ccui.helper.seekWidgetByName(breakitem,"itemAttribute2");
            var checkbox = ccui.helper.seekWidgetByName(breakitem,"itemChange");
            var itemBg = ccui.helper.seekWidgetByName(breakitem,"itemBg1");
            var itemIcon = ccui.helper.seekWidgetByName(breakitem,"itemIcon");
            if(this.click_top_index==0||this.click_top_index==1) {
                var hero = Helper.findHeroById(data[i].p);
                var headthing = Helper.findItemId(data[i].p);
                itemname.setString(hero.armyname);
                itemlv.setString("等级:" + data[i].l);
                itemzizhi.setString("资质:" + hero.intelligence);
                Helper.LoadFrameImageWithPlist(itemBg, headthing.quality);
                Helper.LoadIcoImageWithPlist(itemIcon, headthing);
            }
            else if(this.click_top_index==2||this.click_top_index==3||this.click_top_index==4||this.click_top_index==5){ //装备 饰品
                var equ = Helper.findItemId(data[i].p);
                itemname.setString(equ.itemname);
                itemlv.setString("强化等级:"+data[i].s);
                itemzizhi.setString("精炼等级:"+data[i].r);
                Helper.LoadFrameImageWithPlist(itemBg,equ.quality);
                Helper.LoadIcoImageWithPlist(itemIcon,equ);
            }
             if(self.isContainChoose(i)){
                 checkbox.setSelected(true);
             }
            checkbox.setTag(i);
            checkbox.addEventListener(function (sender,type) {
                if(type == ccui.CheckBox.EVENT_SELECTED){
                    if(self.click_top_index==0||self.click_top_index==2||self.click_top_index==4){
                        if(self.choose_num<8){
                            show_num = show_num +1;
                            self.add_new_item_index[sender.getTag()] = sender.getTag();
                            self.recoverNode.wgt.textNum.setString("选中数量:"+show_num);
                        }else{
                            //提示  最多只能勾选8个
                            sender.setSelected(false);
                        }
                    }else{
                        if(self.choose_num==0){
                            self.add_new_item_index[sender.getTag()] = sender.getTag();
                            self.choose_num = 1;
                            self.recoverNode.wgt.textNum.setString("选中数量:"+self.choose_num);
                        }else{
                            for(key in self.add_new_item_index){
                                if(self.recoverNode.wgt.listChange.getItem(key)!=null){
                                    var checkbox = ccui.helper.seekWidgetByName(self.recoverNode.wgt.listChange.getItem(key),"itemChange");
                                    checkbox.setSelected(false);
                                    self.add_new_item_index = {};
                                    self.add_new_item_index[sender.getTag()] = sender.getTag();
                                    self.choose_num = 1;
                                    self.recoverNode.wgt.textNum.setString("选中数量:"+self.choose_num);
                                }
                                else{
                                    self.add_new_item_index = {};
                                    self.add_new_item_index[sender.getTag()] = sender.getTag();
                                    self.choose_num = 1;
                                    self.recoverNode.wgt.textNum.setString("选中数量:"+self.choose_num);
                                }
                            }
                        }
                    }
                }
                else if(type==ccui.CheckBox.EVENT_UNSELECTED){
                        if(self.click_top_index==0||self.click_top_index==2||self.click_top_index==4){
                            self.delete_item_index[sender.getTag()] = sender.getTag();
                            show_num = show_num - 1
                            self.recoverNode.wgt.textNum.setString("选中数量:"+show_num);
                        }else{
                            delete self.add_new_item_index[sender.getTag()];
                            self.choose_num = 0;
                            self.recoverNode.wgt.textNum.setString("选中数量:"+self.choose_num);
                        }
                }
            });

        }
    },
    //加载返回材料预览界面listview的显示
    showRetrunListview:function (data) {
        this.recoverNode.wgt.listGet.removeAllChildren();
        for(var key in data){
            var getitem = ccsTool.load(res.uiRecoverGetItem,["item"]).wgt.item;
            getitem.removeFromParent(false);
            this.recoverNode.wgt.listGet.pushBackCustomItem(getitem);
            var bagBg = ccui.helper.seekWidgetByName(getitem,"bagBg");
            var bagIcon = ccui.helper.seekWidgetByName(getitem,"bagIcon");
            var textTipsTitle = ccui.helper.seekWidgetByName(getitem,"textTipsTitle");
            var hero = Helper.findHeroById(key);
            if(hero = "undefined"){
                hero = Helper.findItemId(key);
                Helper.LoadFrameImageWithPlist(bagBg,hero.quality);
            }else{
                Helper.LoadFrameImageWithPlist(bagBg,hero.armyquality);
            }
            Helper.LoadIcoImageWithPlist(bagIcon,hero);
            textTipsTitle.setString(data[key]);
        }
    },
     getDataByIndex:function (index) {
        var paixu = function (a,b) {
            if(ITEMCFG[a.p].quality>ITEMCFG[b.p].quality){
                return 1;
            }else{
                return -1;
            }
        }
        if(index==0||index==1){
            //分解士兵
            var soldier_data = new Array();
            for(var key in GLOBALDATA.soldiers){
                var role_sol = GLOBALDATA.soldiers[key];
                role_sol.myid = parseInt(key);
                if(role_sol.j!=1){
                    if(index==0){
                        if(role_sol.q<4){ //进阶等级小于4的士兵才能分解
                            soldier_data.push(role_sol)
                        }
                        for(var m=1;m<=role_sol.n-1;m++){
                            var obj = this.createNewSol(role_sol);
                            soldier_data.push(obj);
                        }
                    }else{
                        // 重生要判断是否升级，进阶或者突破过
                        if(role_sol.l>1||role_sol.q>0||role_sol.m==1){
                            soldier_data.push(role_sol);
                        }
                    }
                }else{//已上阵  要判断数量是否大于1
                    if(index==0){
                        if(role_sol.n>1){
                            for(var m=1;m<=role_sol.n-1;m++){
                                var obj = this.createNewSol(role_sol);
                                soldier_data.push(obj);
                            }
                        }
                    }
                }
            }
            return soldier_data.sort(paixu);
        }
        else if(index==2||index==3){ //分解装备
            var equ_array = new Array();
            for(var key in GLOBALDATA.depot){
                var role_dept = GLOBALDATA.depot[key];
                role_dept.myid = parseInt(key);
                if(ITEMCFG[role_dept.p].maintype==4){
                    if(role_dept.u==0){
                        if(index==2){
                            if(role_dept.d==0){ //未锻造过
                                equ_array.push(role_dept);
                            }
                        }else{
                            //装备重生
                            if(role_dept.s>1||role_dept.r>0||role_dept.d>0){
                                equ_array.push(role_dept);
                            }
                        }
                    }
                }
            }
            return equ_array.sort(paixu);
        }
        else if(index==4||index==5){
            var sp_array = new Array();
            for(var key in GLOBALDATA.depot){
                var role_dept = GLOBALDATA.depot[key];
                role_dept.myid = parseInt(key);
                if(role_dept.u==0){
                    if(ITEMCFG[role_dept.p].maintype==5){
                        if(index==4){
                            sp_array.push(role_dept);
                        }else{
                            if(role_dept.s>1||role_dept.r>0){
                                sp_array.push(role_dept);
                            }
                        }
                    }
                }
            }
            return sp_array.sort(paixu);
        }
    },
    //点击自动添加获取分解data
    setAutuBreakData:function (index) {
        if(index==0){
            //士兵
            this.break_choose = {};
            var count = 0;
            var soldier_data = this.getDataByIndex(index);
            for(var key in soldier_data){
                var role_sol = soldier_data[key];
                if(role_sol.j!=1){ //未上阵
                    var hero = Helper.findHeroById(role_sol.p);
                    if(hero.armyquality<4){
                        if(count<8){
                            this.second_break_choose[count] = role_sol;
                            count = count+1;
                        }else{
                            break;
                        }
                    }
                }
            }
        }else if(index==2){
            this.break_choose = {};
            var count = 0;
            for(var key in GLOBALDATA.depot){
                var role_equ = GLOBALDATA.depot[key];
                role_equ.myid = parseInt(key);
                if(role_equ.u==0){ //未装备
                    var equ = Helper.findItemId(role_equ.p);
                    if(equ.maintype==4){
                        if(equ.quality<4){
                            if(count<8){
                                this.second_break_choose[count] = role_equ;
                                count = count+1;
                            }else{
                                break;
                            }
                        }
                    }
                }
            }
        }else if(index==4){
            this.break_choose = {};
            var count = 0;
            for(var key in GLOBALDATA.depot){
                var role_equ = GLOBALDATA.depot[key];
                role_equ.myid = parseInt(key);
                if(role_equ.u==0){
                    var equ = Helper.findItemId(role_equ.p);
                    if(equ.maintype==5){
                        if(equ.quality<4){
                            if(count<8){
                                this.second_break_choose[count] = role_equ;
                                count = count+1;
                            }else{
                                break;
                            }
                        }
                    }
                }
            }
        }
    },
    //还原分解主界面的添加图标
    retrunImageicon:function () {
        for(var i=0;i<this.bagBg_array.length;i++){
            this.bagBg_array[i].loadTexture("common/break/break_bg2.png",ccui.Widget.PLIST_TEXTURE);
            this.bagIcon_array[i].setVisible(false);
            this.addAttImage_array[i].setVisible(true);
        }
        this.recoverNode.wgt.bagBg9.loadTexture("common/break/break_bg2.png",ccui.Widget.PLIST_TEXTURE);
        this.recoverNode.wgt.bagIcon9.setVisible(false);
        this.recoverNode.wgt.addAttImage9.setVisible(true);
    },

    //分解数据中是否含有紫色品级及以上的材料
    isHasHighQuality:function (index) {
        for(key in this.break_choose){
            var equ = Helper.findItemId(this.break_choose[key].p);
            if(equ.quality>=4){
                return true;
            }
        }
        return false;
    },
    //分解 重生返回的材料计算
    getReturn:function (index) {
        var return_data = {};
        if(index==0||index==1){
            for(var key in this.break_choose){
                if(index==0){
                    //士兵分解 本卡被分解成军魂
                    var thisquality = Helper.findHeroById(this.break_choose[key].p).armyquality;
                    var xishu = this.getXishu(thisquality,1);
                    if(return_data[17]!=null){
                        return_data[17] = return_data[17]+1*xishu;
                    }else{
                        return_data[17] = 1*xishu;
                    }
                }
                //升级材料
                var cold = 0;
                if(this.break_choose[key].l>1){
                    cold = UPGRADECFG[this.break_choose[key].l-1].amycost;
                }else{
                    cold = 0;
                }
                if(cold>0){
                    if(return_data[1]!=null){
                        return_data[1] = return_data[1] + cold;
                    }else{
                        return_data[1] = cold;
                    }
                }
                //突破材料
                if(this.break_choose[key].m==1){
                    //已突破
                    if(ARMYBREAKCFG[this.break_choose[key].p]!=null){
                        var break_array = ARMYBREAKCFG[this.break_choose[key].p].cost;
                        for(var key in break_array){
                            return_data[break_array[key][0]] = break_array[key][1];
                        }
                    }
                }
                //觉醒材料
                for(var i=1;i<=this.break_choose[key].w;i++){
                    var equ_array = ARMYAWAKECFG[i].equcost;
                    var otcost_array = ARMYAWAKECFG[i].otcost;
                    for(var k=0;k<equ_array.length;k++){
                        if(return_data[equ_array[k]]!=null){
                            return_data[equ_array[k]] = return_data[equ_array[k]]+1;
                        }
                        else{
                            return_data[equ_array[k]] = 1;
                        }
                    }
                    for(var j=0;j<otcost_array.length;j++){
                        if(otcost_array[j][0]!=-1){
                            if(return_data[otcost_array[j][0]]!=null){
                                return_data[otcost_array[j][0]] = return_data[otcost_array[j][0]]+otcost_array[j][1];
                            }else{
                                return_data[otcost_array[j][0]] = otcost_array[j][1];
                            }
                        }else{
                            //分解时 整卡全部返还成军魂  id 17
                            if(index==0){
                                var thisquality = Helper.findHeroById(this.break_choose[key].p).armyquality;
                                var xishu = this.getXishu(thisquality,1);
                                return_data[17] = return_data[17]+otcost_array[j][1]*xishu;
                            }else{
                                if(return_data[this.break_choose[key].p]!=null){
                                    return_data[this.break_choose[key].p] = return_data[this.break_choose[key].p]+otcost_array[j][1];
                                }else{
                                    return_data[this.break_choose[key].p] = otcost_array[j][1];
                                }
                            }
                        }
                    }
                }
                //进阶材料
                var promote_id = HEROCFG[this.break_choose[key].p].promote; //对应该士兵在进阶表里的id范围
                var jinjie_lv = this.break_choose[key].q;
                if(jinjie_lv>0){
                    if(promote_id!=null){
                        for(var z=promote_id[0];z<=promote_id[1];z++){
                            if(ARMYPROMOTECFG[z].promotelv<=jinjie_lv){
                                var cost_array = ARMYPROMOTECFG[z].cost;
                                for(var a=0;a<cost_array.length;a++){
                                    if(index == 0){
                                        //分解时 英雄全部换算成军魂返回
                                        if(Helper.findItemId(cost_array[a][0]).maintype==2){
                                            return_data[17] = return_data[17]+cost_array[a][1]*xishu;
                                        }else{
                                            if(return_data[cost_array[a][0]]!=null){
                                                return_data[cost_array[a][0]] = return_data[cost_array[a][0]]+cost_array[a][1];
                                            }else{
                                                return_data[cost_array[a][0]] = cost_array[a][1];
                                            }
                                        }
                                    }else{
                                        if(return_data[cost_array[a][0]]!=null){
                                            return_data[cost_array[a][0]] = return_data[cost_array[a][0]]+cost_array[a][1];
                                        }else{
                                            return_data[cost_array[a][0]] = cost_array[a][1];
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
                //改造材料
                var gaizao_lv = this.break_choose[key].sq;
                if(gaizao_lv>0){
                    var gaizao_array = HEROCFG[this.break_choose[key].p].xreform;
                    if(gaizao_array!=null){
                        for(var m=gaizao_array[0];m<=gaizao_array[1];m++){
                            if(ARMYREFORMCFG[m].reformtimes<=gaizao_lv){
                                var material_array = ARMYREFORMCFG[m].material;
                                for(var x=0;x<material_array.length;x++){
                                    if(index==0){
                                        //分解时 士兵转换为军魂返回
                                        if(Helper.findItemId(material_array[x][0]).maintype==2){
                                            return_data[17] = return_data[17]+material_array[x][1]*xishu;
                                        }else{
                                            if(return_data[material_array[x][0]]!=null){
                                                return_data[material_array[x][0]] = return_data[material_array[x][0]]+material_array[x][1];
                                            }else{
                                                return_data[material_array[x][0]] = material_array[x][1];
                                            }
                                        }
                                    }else{
                                        if(return_data[material_array[x][0]]!=null){
                                            return_data[material_array[x][0]] = return_data[material_array[x][0]]+material_array[x][1];
                                        }else{
                                            return_data[material_array[x][0]] = material_array[x][1];
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
            return return_data;
        }
        else if(index==2||index==3){ //装备
            for(var key in this.break_choose){
                //装备分解 被分解成军备值
                if(index==2){
                    //士兵分解 本卡被分解成军魂
                    var thisquality = Helper.findItemId(this.break_choose[key].p).quality;
                    var xishu = this.getXishu(thisquality,1);
                    if(return_data[16]!=null){
                        return_data[16] = return_data[16]+1*xishu;
                    }else{
                        return_data[16] = 1*xishu;
                    }
                }
                if(index==2){ //分解红色装备 返还对应的红色精华
                    if(Helper.findItemId(this.break_choose[key].p).quality==6){
                        if(return_data[19]!=null){
                            return_data[19] =  return_data[19] +120;
                        }else{
                            return_data[19] = 120;
                        }
                    }
                }
                //强化材料
                if(this.break_choose[key].s>1){
                    var cold=0;
                    if(ITEMCFG[this.break_choose[key].p].quality==2){
                        cold = EQUIPQIANGHUACFG[this.break_choose[key].s].tcost2;
                    }else if(ITEMCFG[this.break_choose[key].p].quality==3){
                        cold = EQUIPQIANGHUACFG[this.break_choose[key].s].tcost3;
                    }else if(ITEMCFG[this.break_choose[key].p].quality==4){
                        cold = EQUIPQIANGHUACFG[this.break_choose[key].s].tcost4;
                    }else if(ITEMCFG[this.break_choose[key].p].quality==5){
                        cold = EQUIPQIANGHUACFG[this.break_choose[key].s].tcost5;
                    }
                    if(return_data[1]!=null){
                        return_data[1] = return_data[1] + cold;
                    }else{
                        return_data[1] = cold;
                    }
                }
                //精炼
                if(this.break_choose[key].r<=0&&this.break_choose[key].e<=0){

                }else{
                    var jingl_lv = this.break_choose[key].r;
                    var nowexp = 0;
                    var str = "texp{0}";
                    var quality = ITEMCFG[this.break_choose[key].p].quality;
                    var keystr = str.format(quality.toString());
                    nowexp = EQUIPJINGLIANCFG[jingl_lv][keystr];
                    nowexp = nowexp + this.break_choose[key].e;
                    var thing_array = this.makeExpToThing(nowexp,1);
                    if(thing_array[0]!=0){
                        if(return_data[22014]!=null){
                            return_data[22014] = return_data[22014]+thing_array[0];
                        }else{
                            return_data[22014] = thing_array[0];
                        }
                    }else if(thing_array[1]!=0){
                        if(return_data[22013]!=null){
                            return_data[22013] = return_data[22013]+thing_array[1];
                        }else{
                            return_data[22013] = thing_array[1];
                        }
                    }else if(thing_array[2]!=0){
                        if(return_data[22012]!=null){
                            return_data[22012] = return_data[22012]+thing_array[2];
                        }else{
                            return_data[22012] = thing_array[2];
                        }
                    }else if(thing_array[3]!=0){
                        if(return_data[22012]!=null){
                            return_data[22012] = return_data[22012]+thing_array[3];
                        }else{
                            return_data[22012] = thing_array[3];
                        }
                    }
                }
                //锻造
                if(this.break_choose[key].d>0){
                    for(var i=1;i<=this.break_choose[key].d;i++){
                        var str = "cost{0}";
                        var keystr = str.format(i.toString());
                        var array = EQUIPDUANZAOCFG[this.break_choose[key].p][keystr];
                        for(var k=0;k<array.length;k++){
                            //判断如果是装备物品 则换算成军备值返还  其余原样返还
                            if(Helper.findItemId(array[k][0]).maintype==4){
                                var xishu = this.getXishu(Helper.findItemId(array[k][0]).quality,1);
                                if(return_data[16]!=null){
                                    return_data[16] = return_data[16] + array[k][1]*xishu;
                                }else{
                                    return_data[16] = array[k][1]*xishu;
                                }
                            }else{
                                if(return_data[array[k][0]]!=null){
                                    return_data[array[k][0]] = return_data[array[k][0]] + array[k][1];
                                }else{
                                    return_data[array[k][0]] = array[k][1];
                                }
                            }
                        }
                    }
                }
            }
            return return_data;
        }
        else if(index==4||index==5){ //饰品
            for(var key in this.break_choose){
                if(index==4){
                    return_data[22070] = this.getXishu(Helper.findItemId(this.break_choose[key].p).quality,1)*1
                }
                //强化
                if(this.break_choose[key].s<=1 && this.break_choose[key].e<=0){
                }else{
                    var qianghua_lv = this.break_choose[key].s;
                    var nowexp = 0;
                    var str = "cost{0}";
                    var quality = ITEMCFG[this.break_choose[key].p].quality;
                    var keystr = str.format(quality.toString());
                    nowexp = ACCQIANGHUACFG[qianghua_lv][keystr];
                    nowexp = nowexp + this.break_choose[key].e;
                    var thing_array = this.makeExpToThing(nowexp,2);
                    if(thing_array[0]!=0){
                        if(return_data[22069]!=null){
                            return_data[22069] = return_data[22069]+thing_array[0];
                        }else{
                            return_data[22069] = thing_array[0];
                        }
                    }else if(thing_array[1]!=0){
                        if(return_data[22068]!=null){
                            return_data[22068] = return_data[22068]+thing_array[1];
                        }else{
                            return_data[22068] = thing_array[1];
                        }
                    }
                }
                //精炼
                if(this.break_choose[key].r>0){
                    var jinglian_lv = this.break_choose[key].r;
                    var id = this.break_choose[key].p;
                    for(var i=1;i<=jinglian_lv;i++){
                        var cailiao_array = ACCJINGLIANCFG[id*1000+i].cost;
                        for(var k=0;k<cailiao_array.length;k++){
                            // 判断是否为饰品
                            if(Helper.findItemId(cailiao_array[k][0]).maintype==5){
                                if(index==4){
                                    //分解时  饰品换成精炼石返还
                                    var xishu = this.getXishu(Helper.findItemId(cailiao_array[k][0]).quality,1);
                                    if(return_data[22070]!=null){
                                        return_data[22070] =  return_data[22070]+cailiao_array[k][1]*xishu;
                                    }else{
                                        return_data[22070] = cailiao_array[k][1]*xishu;
                                    }
                                }
                            }else{
                                if(return_data[cailiao_array[k][0]]!=null){
                                    return_data[cailiao_array[k][0]] = return_data[cailiao_array[k][0]] + cailiao_array[k][1];
                                }else{
                                    return_data[cailiao_array[k][0]] = cailiao_array[k][1];
                                }
                            }
                        }
                    }
                }

            }
            return return_data;
        }

    },
    makeExpToThing:function (exp,type) {
        var result = new Array();
        if(type==1){ //装备精炼经验转换成对应道具
            var a = Math.floor(exp/50);
            result.push(a);
            var last_a = exp%50;
            var b = Math.floor(last_a/25);
            result.push(b);
            var last_b = last_a%25;
            var c = Math.floor(last_b/10);
            result.push(c);
            var last_c = last_b%10;
            var d = Math.floor(last_c/5);
            result.push(d);
        }
        else if(type==2){ //饰品强化经验转换成对应道具
            var a = Math.floor(exp/500);
            result.push(a);
            var last_a = exp%500;
            var b = Math.floor(last_a/100);
            result.push(b);
        }
        return result;
    },
    //获取转换系数
    getXishu:function (quality,type) {
        var xishu = 1;
        if(type==1){ //士兵 装备
            if(quality==1){
                xishu = 5;
            }else if(quality==2){
                xishu = 10;
            }else if(quality==3){
                xishu = 20;
            }else if(quality==4){
                xishu = 40;
            }else if(quality==5){
                xishu = 80;
            }else if(quality==6){
                xishu = 160;
            }
            return xishu;
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
    createNewSol:function (obj_sol) {
        var obj = objClone(obj_sol);
        obj.j=0;//未上阵
        obj.l=1;
        obj.m=0;//未突破
        obj.q=0;
        obj.w=0;
        obj.n=1;
        obj.sq=0;
        return obj;
    },
    isContainChoose:function (i) {//列表的位置  判断是否存在于待分解项中
        var result = false;
        for (var key in this.choose_position){
            if(key == i){
                result = true;
                break;
            }
        }
        return result;
    },
    dealRedPoint:function (data) {
        var redInfo = RedPoint.recoverPanleRedPoint(data);
        if(redInfo!=null){
            if(redInfo.soldier==true){
                this.recoverNode.wgt.taskImageHero.setVisible(true);
            }else{
                this.recoverNode.wgt.taskImageHero.setVisible(false);
            }
            if(redInfo.equip==true){
                this.recoverNode.wgt.taskImageEqu.setVisible(true);
            }else{
                this.recoverNode.wgt.taskImageEqu.setVisible(false);
            }
            if(redInfo.baowu==true){
                this.recoverNode.wgt.taskImageOrn.setVisible(true);
            }else{
                this.recoverNode.wgt.taskImageOrn.setVisible(false);
            }
        }
    }
});