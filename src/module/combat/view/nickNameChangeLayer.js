
/**
 ** @Author:pandayu
 ** @Version:1.0
 ** @DateTime:2018-09-09
 ** @Project:pandaCard CardGame
 ** @Contact: QQ:815099602
 **/

var nickNameChangeLayer = ModalDialog.extend({
    LayerName:"nickNameChangeLayer",
    ctor:function(){
        this._super();
        //this.LayerName = "nickNameChangeLayer";
    },

    onEnter:function(){
        this._super();
        //this.initNickNameUI();
        //this.initUI();

        var self = this;
        this.changeNickEvn = cc.EventListener.create({
            event:cc.EventListener.CUSTOM,
            eventName:'role.rename',
            callback: function(event){
                var resData = event.getUserData();
                if(resData.status==0){
                    self.initUI();
                    var upNickNameEvn = new cc.EventCustom('upNickName');
                    upNickNameEvn.setUserData();
                    cc.eventManager.dispatchEvent(upNickNameEvn);
                    self.nickNameNode.wgt.btnBack.setVisible(true);
                    self.nickNameNode.wgt.Panel_change.setVisible(false);
                }else{
                    ShowTipsTool.ErrorTipsFromStringById(resData.status);
                }
            }
        });
        cc.eventManager.addListener(this.changeNickEvn, this);
    },

    initUI:function(){
        this.nickNameNode = ccsTool.load(res.uiNickNameChangeLayer, ['btnBack', 'btnChange', 'bagBg', 'commanderName', 'lvText', 'areText',
        'muiscCheck', 'Panel_change', 'ImageFastWar', 'btnBack1', 'btnOk', 'TextField_name', 'btnCancel', 'diamondImageBg', 'diamondValue', 'changeText',
        "Image_48"]);
        //var nickNameEffect = this.nickNameNode.node;
        this.addChild(this.nickNameNode.node, 10);
        var nickNameAction = this.nickNameNode.action;
        this.nickNameNode.node.runAction(nickNameAction);
        nickNameAction.gotoFrameAndPlay(0, false);

        this.nickNameNode.wgt.btnBack.addTouchEventListener(this.touchEvent, this);//返回事件
        this.nickNameNode.wgt.btnChange.addTouchEventListener(this.touchEvent, this);//更改昵称按钮
        //this.nickNameNode.wgt.commanderName.ignoreContentAdaptWithSize(true);
        this.nickNameNode.wgt.commanderName.setString(STRINGCFG[100313].string + GLOBALDATA.name);
        this.nickNameNode.wgt.lvText.setString(StringFormat(STRINGCFG[100084].string, GLOBALDATA.base.lev));
        this.nickNameNode.wgt.areText.setString(StringFormat(STRINGCFG[100083].string, getCommanderPower()))//战斗力的显示
        this.nickNameNode.wgt.btnCancel.addTouchEventListener(this.touchEvent, this);
        this.nickNameNode.wgt.btnOk.addTouchEventListener(this.touchEvent, this);
        if(this.nickNameNode.wgt.muiscCheck.isSelected()){//音效的播放与否

        }else{

        }

    },

    touchEvent:function(sender, type){
        if(ccui.Widget.TOUCH_ENDED == type){
            switch (sender.name){
                case "btnBack":
                    this.removeFromParentAndCleanup(true);
                    break;
                case"btnChange":
                    this.nickNameNode.wgt.Panel_change.setVisible(true);
                    this.nickNameNode.wgt.btnBack.setVisible(false);
                    //创建输入框
                    this.box = new cc.EditBox(cc.size(300, 40), new cc.Scale9Sprite());
                    this.box.setPlaceholderFontColor(cc.color.WHITE);//提示字体的颜色控制
                    this.box.setPlaceholderFontSize(24);//提示字体的大小
                    this.box.setFontSize(24);
                    this.box.setPlaceHolder(STRINGCFG[100312].string);
                    this.box.setAnchorPoint(cc.p(0, 0));
                    this.box.setDelegate(this);
                    this.box.setMaxLength(8);//输入的最大长度
                    this.nickNameNode.wgt.Image_48.addChild(this.box);
                    this.box.setVisible(true);
                    if(GLOBALDATA.base.cn > 1){
                        this.nickNameNode.wgt.changeText.setVisible(false);
                        this.nickNameNode.wgt.diamondImageBg.setVisible(true);
                        this.nickNameNode.wgt.diamondValue.setString("1000");
                    }else{
                        this.nickNameNode.wgt.changeText.setVisible(true);
                        this.nickNameNode.wgt.diamondImageBg.setVisible(false);
                    }
                    break;
                case "btnCancel":
                    this.nickNameNode.wgt.Panel_change.setVisible(false);
                    this.nickNameNode.wgt.btnBack.setVisible(true);
                    this.box.removeFromParent();
                    break;
                case"btnOk":
                    if(GLOBALDATA.base.cn > 1){
                        if(GLOBALDATA.base.diamond < 1000){
                            ShowTipsTool.TipsFromText(STRINGCFG[100079].string,cc.color.RED,30);
                        }else{
                            var account = this.box.getString();
                            //var account = this.nickNameNode.wgt.userName.getString();
                            cc.log(account.length);
                            if(account == ''||account.length>8){
                                var embattleText = new cc.LabelTTF(STRINGCFG[100311].string, "Arial", 24);
                                embattleText.setColor(cc.color.RED);
                                embattleText.setPosition(cc.p(320, 600));
                                this.addChild(embattleText, 15);
                                embattleText.runAction(cc.sequence(cc.delayTime(1), cc.spawn(cc.moveBy(2, cc.p(0, 80)), cc.fadeOut(1.0)))
                                    ,new cc.CallFunc(function(){this.removeChild(embattleText)}));
                            }else{
                                if(account == GLOBALDATA.name){
                                    ShowTipsTool.TipsFromText(STRINGCFG[300].string, cc.color.RED, 30);
                                    this.box.removeFromParent();
                                    this.box = new cc.EditBox(cc.size(300, 40), new cc.Scale9Sprite());
                                    this.box.setPlaceholderFontColor(cc.color.WHITE);//提示字体的颜色控制
                                    this.box.setPlaceholderFontSize(24);//提示字体的大小
                                    this.box.setFontSize(24);
                                    this.box.setPlaceHolder(STRINGCFG[100312].string);
                                    this.box.setAnchorPoint(cc.p(0, 0));
                                    this.box.setDelegate(this);
                                    this.box.setMaxLength(8);//输入的最大长度
                                    this.nickNameNode.wgt.Image_48.addChild(this.box);
                                    this.box.setVisible(true);
                                }else{
                                    commanderModel.nickChange(account);
                                    this.box.removeFromParent();
                                }
                            }
                        }
                    }else{
                        var account = this.box.getString();
                        //var account = this.nickNameNode.wgt.TextField_name.getString();
                        cc.log(account.length);
                        if(account == ''||account.length>8){
                            var embattleText = new cc.LabelTTF(STRINGCFG[100311].string, "Arial", 24);
                            embattleText.setColor(cc.color.RED);
                            embattleText.setPosition(cc.p(320, 600));
                            this.addChild(embattleText, 15);
                            embattleText.runAction(cc.sequence(cc.delayTime(1), cc.spawn(cc.moveBy(2, cc.p(0, 80)), cc.fadeOut(1.0)))
                                ,new cc.CallFunc(function(){this.removeChild(embattleText)}));
                        }else{
                            commanderModel.nickChange(account);
                            this.box.removeFromParent();
                        }
                    }
                    break;
                default:
                    break;
            }
        }
    },

    onExit:function () {
        this._super();
        cc.eventManager.removeListener(this.changeNickEvn);
        cc.log('armyChoiseLayer onExit');
    }

});