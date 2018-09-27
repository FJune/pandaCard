
/**
 ** @Author:pandayu
 ** @Version:1.0
 ** @DateTime:2018-09-09
 ** @Project:pandaCard CardGame
 ** @Contact: QQ:815099602
 **/
 /**
 * 乱世佳人层的创建
 */

var DateLayer = baseLayer.extend({
    LayerName:"DateLayer",
    dateNum:[],//好友度数组
    mytag:null,//标记
    ctor:function(){
        this._super();
        //this.LayerName = "DateLayer";
    },

    onEnter:function(){
        this._super();
        var self = this;
        //this.initDateUI();
        //this.initUI();

        this.alliancegirlEvent = cc.EventListener.create({
            event: cc.EventListener.CUSTOM,
            eventName: "alliancegirl.tryst",
            callback: function(event){
                var resData = event.getUserData();
                if(resData.status == 0){
                    self.loadData(self.mytag);
                    var _textExp = "textExp"+self.mytag;
                    var _LoadingBar = "LoadingBar"+self.mytag;
                    var textExp = ccui.helper.seekWidgetByName(self.dateLayerObj.node, _textExp);
                    var LoadingBar = ccui.helper.seekWidgetByName(self.dateLayerObj.node, _LoadingBar);
                    textExp.setString(GLOBALDATA.alliancegirl.normal + "/" + ALLIANCEGIRLCFG[self.mytag].endprogress);
                    LoadingBar.setPercent(GLOBALDATA.alliancegirl.normal / (ALLIANCEGIRLCFG[self.mytag].endprogress) * 100);
                    self.dateLayerObj.wgt.textDateNum.setString(STRINGCFG[100314].string+ GLOBALDATA.alliancegirl.tryst_num);
                    var str = "imageTips" + self.mytag;
                    var imageTips = ccui.helper.seekWidgetByName(self.dateLayerObj.node, str);
                    if(GLOBALDATA.alliancegirl.tryst_num == 0 && GLOBALDATA.alliancegirl.normal < self.dateNum[self.mytag]){
                        imageTips.setVisible(false);
                    }
                }
            }
        });
        cc.eventManager.addListener(this.alliancegirlEvent, 1);

        this.getGiftEvn = cc.EventListener.create({
            event: cc.EventListener.CUSTOM,
            eventName: "alliancegirl.getreward",
            callback:function(event){
                var resData = event.getUserData();
                if(resData.status == 0){
                    self.resourceGet(resData);
                    self.dateLayerObj.wgt.btnGet.setVisible(false);
                    var str = "imageTips" + self.mytag;
                    var imageTips = ccui.helper.seekWidgetByName(self.dateLayerObj.node, str);
                    if(self.mytag == 8 || self.mytag == 9){
                        if(GLOBALDATA.alliancegirl.profit_special[0] == 1 || GLOBALDATA.alliancegirl.profit_special[1] == 1){
                            imageTips.setVisible(false);
                        }
                    }else{
                        imageTips.setVisible(false);
                        if(GLOBALDATA.alliancegirl.tryst_num > 0){
                            var str = "imageTips" + (self.mytag+1);
                            var imageTips = ccui.helper.seekWidgetByName(self.dateLayerObj.node, str);
                            imageTips.setVisible(true);
                        }
                    }
                }
            }
        });
        cc.eventManager.addListener(this.getGiftEvn, 1);
    },

    initUI:function(){
        this.dateLayerObj = ccsTool.load(res.uidateLayer, ["textDateNum", "textDateTime", "Button_pass1", "LoadingBar1",
        "textExp1", "Button_pass2", "LoadingBar2", "textExp2", "Button_pass3", "LoadingBar3", "textExp3",
        "Button_pass4", "LoadingBar4", "textExp4", "Button_pass5", "LoadingBar5", "textExp5", "Button_pass6",
        "LoadingBar6", "textExp6", "Button_pass7", "LoadingBar7", "textExp7", "Button_pass8", "LoadingBar8",
        "textExp8", "Button_pass9", "LoadingBar9", "textExp9","Panel_Go", "btnBack", "btnGo", "bagBg1", "bagIcon1",
        "bagName1", "bagBg2", "bagIcon2", "bagName2","bagBg3", "bagIcon3", "bagName3","bagBg4", "bagIcon4", "bagName4",
        "bagBg5", "bagIcon5", "bagName5","bagBg6", "bagIcon6", "bagName6","LoadingBar", "textBar", "nodeBox",
        "textGNo", "btnRecharge", "bagNum1", "bagNum2", "bagNum3", "bagNum4", "bagNum5", "bagNum6", "btnGet", "ImageFastWar",
        "imageTips1", "imageTips2", "imageTips3", "imageTips4", "imageTips5", "imageTips6", "imageTips7", "imageTips8",
        "imageTips9"]);
        this.addChild(this.dateLayerObj.node, 1);

        this.dateNum = [0, 10, 40, 86, 300, 500, 1000, 2000, 60, 360];

        this.dateLayerObj.wgt.btnBack.addTouchEventListener(this.TouchEvent, this);
        this.dateLayerObj.wgt.Panel_Go.addTouchEventListener(this.TouchEvent, this);
        this.dateLayerObj.wgt.Button_pass1.addTouchEventListener(this.TouchEvent, this);
        this.dateLayerObj.wgt.Button_pass1.setTag(1);
        this.dateLayerObj.wgt.Button_pass2.addTouchEventListener(this.TouchEvent, this);
        this.dateLayerObj.wgt.Button_pass2.setTag(2);
        this.dateLayerObj.wgt.Button_pass3.addTouchEventListener(this.TouchEvent, this);
        this.dateLayerObj.wgt.Button_pass3.setTag(3);
        this.dateLayerObj.wgt.Button_pass4.addTouchEventListener(this.TouchEvent, this);
        this.dateLayerObj.wgt.Button_pass4.setTag(4);
        this.dateLayerObj.wgt.Button_pass5.addTouchEventListener(this.TouchEvent, this);
        this.dateLayerObj.wgt.Button_pass5.setTag(5);
        this.dateLayerObj.wgt.Button_pass6.addTouchEventListener(this.TouchEvent, this);
        this.dateLayerObj.wgt.Button_pass6.setTag(6);
        this.dateLayerObj.wgt.Button_pass7.addTouchEventListener(this.TouchEvent, this);
        this.dateLayerObj.wgt.Button_pass7.setTag(7);
        this.dateLayerObj.wgt.Button_pass8.addTouchEventListener(this.TouchEvent, this);
        this.dateLayerObj.wgt.Button_pass8.setTag(8);
        this.dateLayerObj.wgt.Button_pass9.addTouchEventListener(this.TouchEvent, this);
        this.dateLayerObj.wgt.Button_pass9.setTag(9);
        var cout = this.dateNum.indexOf(GLOBALDATA.alliancegirl.normal);
        var str = "imageTips" + cout;
        var imageTips = ccui.helper.seekWidgetByName(this.dateLayerObj.node, str);
        if(cout > GLOBALDATA.alliancegirl.profit_normal){
            imageTips.setVisible(true);
        }

        //乱世佳人选择界面的初始化
        for(var i=1;i<10;i++){
            var _textExp = "textExp"+i;//好感比数
            var _LoadingBar = "LoadingBar"+i;//精度条
            var textExp = ccui.helper.seekWidgetByName(this.dateLayerObj.node, _textExp);
            var LoadingBar = ccui.helper.seekWidgetByName(this.dateLayerObj.node, _LoadingBar);
            if(i != 8 && i != 9){
                //当普通佳人奖励领取进度大于等于i时
                if(GLOBALDATA.alliancegirl.profit_normal >= i){
                    textExp.setVisible(false);
                    LoadingBar.setPercent(this.dateNum[i] / ALLIANCEGIRLCFG[i].endprogress * 100);
                }else{
                    //当约会次数满级时
                    if(GLOBALDATA.alliancegirl.normal >=  this.dateNum[i]){
                        if(GLOBALDATA.alliancegirl.profit_normal+1 >= i){
                            textExp.setVisible(false);
                            LoadingBar.setPercent(this.dateNum[i] / ALLIANCEGIRLCFG[i].endprogress * 100);
                            var str = "imageTips" + i;
                            var imageTips = ccui.helper.seekWidgetByName(this.dateLayerObj.node, str);
                            imageTips.setVisible(true);
                        }else{
                            LoadingBar.setPercent(0);
                            textExp.setString(0 + "/" + ALLIANCEGIRLCFG[i].endprogress);
                        }
                    }else{
                        //当约会次数大于零且小于最大约会数时
                        if(GLOBALDATA.alliancegirl.normal >= 0 && GLOBALDATA.alliancegirl.normal <= this.dateNum[i]){
                            //当领取进度与本身进度相差为1时
                            if(i-1 == GLOBALDATA.alliancegirl.profit_normal){
                                var str = "imageTips" + i;
                                var imageTips = ccui.helper.seekWidgetByName(this.dateLayerObj.node, str);
                                if(GLOBALDATA.alliancegirl.tryst_num > 0 && GLOBALDATA.alliancegirl.profit_normal == i-1){
                                    imageTips.setVisible(true);
                                }
                                textExp.setString(GLOBALDATA.alliancegirl.normal + "/" + ALLIANCEGIRLCFG[i].endprogress);
                                LoadingBar.setPercent(GLOBALDATA.alliancegirl.normal / ALLIANCEGIRLCFG[i].endprogress * 100);
                                //当领取进度与本身进度相差为2或大于2时
                            }else if(i-1 > GLOBALDATA.alliancegirl.profit_normal){
                                textExp.setString(0 + "/" + ALLIANCEGIRLCFG[i].endprogress);
                                LoadingBar.setPercent(0);
                            }
                        }/*else{
                            if(GLOBALDATA.alliancegirl.normal - this.dateNum[i-1] >= this.dateNum[i]){
                                textExp.setString(ALLIANCEGIRLCFG[i].endprogress/10 + "/" + ALLIANCEGIRLCFG[i].endprogress);
                                LoadingBar.setPercent(100);
                                this.dateLayerObj.wgt.btnGo.setVisible(false);
                                this.dateLayerObj.wgt.btnRecharge.setVisible(false);
                                this.dateLayerObj.wgt.textGNo.setVisible(false);
                            }else if(GLOBALDATA.alliancegirl.normal - this.dateNum[i-1] < 0){
                                var str = "imageTips" + i;
                                var imageTips = ccui.helper.seekWidgetByName(this.dateLayerObj.node, str);
                                if(GLOBALDATA.alliancegirl.profit_normal > 0 && GLOBALDATA.alliancegirl.profit_normal == i-1){
                                    imageTips.setVisible(true);
                                }
                                textExp.setString("0/" + ALLIANCEGIRLCFG[i].endprogress);
                                LoadingBar.setPercent(0);
                                this.dateLayerObj.wgt.btnGo.setVisible(false);
                                this.dateLayerObj.wgt.btnRecharge.setVisible(false);
                                this.dateLayerObj.wgt.textGNo.setVisible(false);
                            }
                        }*/
                    }
                }
            }else{
                if(GLOBALDATA.alliancegirl.special >= 6 && i == 8){
                    textExp.setVisible(false);
                    LoadingBar.setPercent(100);
                    if(GLOBALDATA.alliancegirl.profit_special[0] == 0){
                        var str = "imageTips" + i;
                        var imageTips = ccui.helper.seekWidgetByName(this.dateLayerObj.node, str);
                        imageTips.setVisible(true);
                    }else{
                        var str = "imageTips" + i;
                        var imageTips = ccui.helper.seekWidgetByName(this.dateLayerObj.node, str);
                        imageTips.setVisible(false);
                    }
                }else if(GLOBALDATA.alliancegirl.special >= 36 && i == 9){
                    textExp.setVisible(false);
                    LoadingBar.setPercent(100);
                    if(GLOBALDATA.alliancegirl.profit_special[1] == 0){
                        var str = "imageTips" + i;
                        var imageTips = ccui.helper.seekWidgetByName(this.dateLayerObj.node, str);
                        imageTips.setVisible(true);
                    }else{
                        var str = "imageTips" + i;
                        var imageTips = ccui.helper.seekWidgetByName(this.dateLayerObj.node, str);
                        imageTips.setVisible(false);
                    }
                }else{
                    textExp.setString(GLOBALDATA.alliancegirl.special + "/" + ALLIANCEGIRLCFG[i].endprogress);
                    LoadingBar.setPercent(GLOBALDATA.alliancegirl.special / ALLIANCEGIRLCFG[i].endprogress * 100);
                }
            }
        }
        this.dateLayerObj.wgt.textDateNum.setString(STRINGCFG[100314].string+ GLOBALDATA.alliancegirl.tryst_num);
        var timestamp = parseInt(Date.parse(new Date()) / 1000);
        var time = GLOBALDATA.extend.ut.girl_tryst - timestamp;
        if(time <= 0){
            this.dateLayerObj.wgt.textDateTime.setVisible(false);
        }else{
            this.schedule(function(){
                time--;
                if(time>0){
                    this.dateLayerObj.wgt.textDateTime.setString(STRINGCFG[100315].string+Helper.formatTime(time));
                }
            }, 1, time);
        }
    },



    TouchEvent:function(sender, type){
        if(ccui.Widget.TOUCH_ENDED == type){
            switch (sender.name){
                case "btnBack":
                    this.removeFromParent();
                    break;
                case"Button_pass1":
                case"Button_pass2":
                case"Button_pass3":
                case"Button_pass4":
                case"Button_pass5":
                case"Button_pass6":
                case"Button_pass7":
                case"Button_pass8":
                case"Button_pass9":
                    this.mytag = sender.getTag();
                    this.dateLayerObj.wgt.btnGet.setVisible(false);
                    this.dateLayerObj.wgt.Panel_Go.setVisible(true);
                    this.loadData(this.mytag);
                    break;
                case"Panel_Go":
                    sender.setVisible(false);
                    break;
                default:
                    break;
            }
        }
    },

    loadData:function(mytag){
        var prize = ALLIANCEGIRLCFG[mytag].item;
        for(var i = 0;i < prize.length; i++){
            var _bagBg = "bagBg" + (i+1);
            var _bagName = "bagName"+(i+1);
            var _bagIcon = "bagIcon"+(i+1);
            var _bagNum = "bagNum"+(i+1);
            var bagBg = ccui.helper.seekWidgetByName(this.dateLayerObj.node, _bagBg);
            var bagName = ccui.helper.seekWidgetByName(this.dateLayerObj.node, _bagName);
            var bagIcon = ccui.helper.seekWidgetByName(this.dateLayerObj.node, _bagIcon);
            var bagNum = ccui.helper.seekWidgetByName(this.dateLayerObj.node, _bagNum);
            var prizef = prize[i];
            Helper.LoadFrameImageWithPlist(bagBg, ITEMCFG[prizef[0]].quality);
            Helper.LoadIcoImageWithPlist(bagIcon, ITEMCFG[prizef[0]]);
            bagName.setString(ITEMCFG[prizef[0]].itemname);
            if(prizef[1] > 1){
                bagNum.setString(prizef[1]);
            }else{
                bagNum.setVisible(false);
            }
        }

        if(6 - prize.length > 0){
            var _bagBg = "bagBg" + (7 - (6 - prize.length));
            var bagBg = ccui.helper.seekWidgetByName(this.dateLayerObj.node, _bagBg);
            bagBg.setVisible(false);
        }

        if(mytag <= GLOBALDATA.alliancegirl.profit_normal){
            this.dateLayerObj.wgt.textGNo.setVisible(false);
            this.dateLayerObj.wgt.btnGo.setVisible(false);
            this.dateLayerObj.wgt.btnRecharge.setVisible(false);
            this.dateLayerObj.wgt.btnGet.setVisible(false);
            this.dateLayerObj.wgt.LoadingBar.setPercent(100);
            this.dateLayerObj.wgt.textBar.setString(STRINGCFG[100301].string + ALLIANCEGIRLCFG[mytag].endprogress + "/" + ALLIANCEGIRLCFG[mytag].endprogress);
        }else{
            if(mytag >= 8 && mytag <= 9){
                if(GLOBALDATA.alliancegirl.special >= 6 && mytag == 8){
                    this.dateLayerObj.wgt.btnGo.setVisible(false);
                    this.dateLayerObj.wgt.btnRecharge.setVisible(false);
                    this.dateLayerObj.wgt.textGNo.setVisible(false);
                    this.dateLayerObj.wgt.LoadingBar.setPercent(100);
                    this.dateLayerObj.wgt.textBar.setString(STRINGCFG[100301].string + ALLIANCEGIRLCFG[mytag].endprogress + "/" + ALLIANCEGIRLCFG[mytag].endprogress);
                    if(GLOBALDATA.alliancegirl.profit_special[0] == 1){
                        this.dateLayerObj.wgt.btnGet.setVisible(false);
                    }else if(GLOBALDATA.alliancegirl.profit_special[0] == 0){
                        this.dateLayerObj.wgt.btnGet.setVisible(true);
                    }
                }else if(GLOBALDATA.alliancegirl.special >= 36 && mytag == 9){
                    this.dateLayerObj.wgt.btnGo.setVisible(false);
                    this.dateLayerObj.wgt.btnRecharge.setVisible(false);
                    this.dateLayerObj.wgt.textGNo.setVisible(false);
                    this.dateLayerObj.wgt.LoadingBar.setPercent(100);
                    this.dateLayerObj.wgt.textBar.setString(STRINGCFG[100301].string + ALLIANCEGIRLCFG[mytag].endprogress + "/" + ALLIANCEGIRLCFG[mytag].endprogress);
                    if(GLOBALDATA.alliancegirl.profit_special[1] == 1){
                        this.dateLayerObj.wgt.btnGet.setVisible(false);
                    }else if(GLOBALDATA.alliancegirl.profit_special[1] == 0){
                        this.dateLayerObj.wgt.btnGet.setVisible(true);
                    }
                }else{
                    this.dateLayerObj.wgt.btnGo.setVisible(false);
                    this.dateLayerObj.wgt.btnGet.setVisible(false);
                    this.dateLayerObj.wgt.btnRecharge.setVisible(true);
                    this.dateLayerObj.wgt.textGNo.setVisible(true);
                    var str = StringFormat(STRINGCFG[100302].string, (ALLIANCEGIRLCFG[mytag].endprogress - GLOBALDATA.alliancegirl.special)*10);
                    this.dateLayerObj.wgt.textGNo.setString(str);
                    this.dateLayerObj.wgt.btnRecharge.setPosition(cc.p(this.dateLayerObj.wgt.ImageFastWar.getContentSize().width / 2,
                        this.dateLayerObj.wgt.btnRecharge.getPositionY()));
                    this.dateLayerObj.wgt.LoadingBar.setPercent(GLOBALDATA.alliancegirl.special / this.dateNum[mytag - 1] * 100);
                    this.dateLayerObj.wgt.textBar.setString(STRINGCFG[100301].string + GLOBALDATA.alliancegirl.special + "/" + ALLIANCEGIRLCFG[mytag].endprogress);
                }
            }else{
                if(GLOBALDATA.alliancegirl.normal >= this.dateNum[GLOBALDATA.alliancegirl.profit_normal + 1]){
                    if(mytag-1 == GLOBALDATA.alliancegirl.profit_normal){
                        this.dateLayerObj.wgt.btnGo.setVisible(false);
                        this.dateLayerObj.wgt.btnRecharge.setVisible(false);
                        var str = "imageTips" + this.mytag;
                        var imageTips = ccui.helper.seekWidgetByName(this.dateLayerObj.node, str);
                        imageTips.setVisible(true);
                        this.dateLayerObj.wgt.textGNo.setVisible(false);
                        this.dateLayerObj.wgt.btnGet.setVisible(true);
                        this.dateLayerObj.wgt.LoadingBar.setPercent(100);
                        this.dateLayerObj.wgt.textBar.setString(STRINGCFG[100301].string + ALLIANCEGIRLCFG[mytag].endprogress + "/" + ALLIANCEGIRLCFG[mytag].endprogress);
                    }else if(mytag == GLOBALDATA.alliancegirl.profit_normal){
                        this.dateLayerObj.wgt.btnGo.setVisible(false);
                        this.dateLayerObj.wgt.btnRecharge.setVisible(false);
                        this.dateLayerObj.wgt.btnGet.setVisible(false);
                        this.dateLayerObj.wgt.textGNo.setVisible(false);
                        this.dateLayerObj.wgt.LoadingBar.setPercent(100);
                        this.dateLayerObj.wgt.textBar.setString(STRINGCFG[100301].string + ALLIANCEGIRLCFG[mytag].endprogress + "/" + ALLIANCEGIRLCFG[mytag].endprogress);
                    }else if(mytag > GLOBALDATA.alliancegirl.profit_normal){
                        this.dateLayerObj.wgt.btnGo.setVisible(false);
                        this.dateLayerObj.wgt.btnRecharge.setVisible(false);
                        this.dateLayerObj.wgt.btnGet.setVisible(false);
                        this.dateLayerObj.wgt.textGNo.setVisible(false);
                        this.dateLayerObj.wgt.LoadingBar.setPercent(0);
                        this.dateLayerObj.wgt.textBar.setString(STRINGCFG[100301].string + 0 + "/" + ALLIANCEGIRLCFG[mytag].endprogress);
                    }
                }else{
                    if(mytag > GLOBALDATA.alliancegirl.profit_normal+1){
                        this.dateLayerObj.wgt.btnGo.setVisible(false);
                        this.dateLayerObj.wgt.btnRecharge.setVisible(false);
                        this.dateLayerObj.wgt.LoadingBar.setPercent(0);
                        this.dateLayerObj.wgt.textBar.setString(STRINGCFG[100301].string + 0 + "/" + ALLIANCEGIRLCFG[mytag].endprogress);
                        this.dateLayerObj.wgt.textGNo.setVisible(false);
                    }else if(mytag <= GLOBALDATA.alliancegirl.profit_normal){
                        this.dateLayerObj.wgt.btnGo.setVisible(false);
                        this.dateLayerObj.wgt.btnRecharge.setVisible(false);
                        this.dateLayerObj.wgt.LoadingBar.setPercent(100);
                        this.dateLayerObj.wgt.textBar.setString(STRINGCFG[100301].string + ALLIANCEGIRLCFG[mytag].endprogress + "/" + ALLIANCEGIRLCFG[mytag].endprogress);
                        this.dateLayerObj.wgt.textGNo.setVisible(false);
                    }else if(mytag <= GLOBALDATA.alliancegirl.profit_normal+1){
                        this.dateLayerObj.wgt.btnGo.setVisible(true);
                        this.dateLayerObj.wgt.btnRecharge.setVisible(true);
                        this.dateLayerObj.wgt.btnRecharge.setPosition(cc.p(410, this.dateLayerObj.wgt.btnRecharge.getPositionY()));
                        this.dateLayerObj.wgt.LoadingBar.setPercent(GLOBALDATA.alliancegirl.normal/this.dateNum[mytag]*100);
                        this.dateLayerObj.wgt.textBar.setString(STRINGCFG[100301].string + GLOBALDATA.alliancegirl.normal + "/" + ALLIANCEGIRLCFG[mytag].endprogress);
                        this.dateLayerObj.wgt.textGNo.setVisible(true);
                        var str = StringFormat(STRINGCFG[100302].string, (this.dateNum[mytag] - GLOBALDATA.alliancegirl.normal)*10);
                        this.dateLayerObj.wgt.textGNo.setString(str);
                    }
                }
                this.dateLayerObj.wgt.btnGo.addTouchEventListener(this.dateEvent, this, this);
            }
        }


        this.dateLayerObj.wgt.btnRecharge.addTouchEventListener(this.dateEvent, this);
        this.dateLayerObj.wgt.btnGet.addTouchEventListener(this.dateEvent, this);
    },

    dateEvent:function(sender, type){
        if(ccui.Widget.TOUCH_ENDED == type){
            switch (sender.name){
                case"btnGo":
                    if(GLOBALDATA.alliancegirl.normal +1 == this.dateNum[this.mytag]){
                        var str = "imageTips" + this.mytag;
                        var imageTips = ccui.helper.seekWidgetByName(this.dateLayerObj.node, str);
                        imageTips.setVisible(true);
                        this.dateLayerObj.wgt.btnGet.setVisible(true);
                        this.dateLayerObj.wgt.btnGo.setVisible(false);
                        this.dateLayerObj.wgt.btnRecharge.setVisible(false);
                    }
                    if(GLOBALDATA.alliancegirl.tryst_num > 0 ){
                        commanderModel.dateEvn();
                        if(GLOBALDATA.alliancegirl.tryst_num == 2){
                            this.dateLayerObj.wgt.textDateTime.setVisible(true);
                            var time = 43200;
                            this.schedule(function(){
                                time--;
                                if(time>0){
                                    this.dateLayerObj.wgt.textDateTime.setString(STRINGCFG[100315].string+ Helper.formatTime(time));
                                }
                            }, 1, time);
                        }
                    }else{
                        ShowTipsTool.TipsFromText(STRINGCFG[100316].string,cc.color.RED,30);
                    }
                    break;
                case"btnRecharge":

                    break;
                case"btnGet":
                    commanderModel.dateGetEvent(this.mytag);
                    this.dateLayerObj.wgt.Panel_Go.setVisible(true);
                    break;
                default:
                    break;
            }
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

    onExit:function(){
        this._super();
        cc.eventManager.removeListener(this.alliancegirlEvent);
        cc.eventManager.removeListener(this.getGiftEvn);
    }
});