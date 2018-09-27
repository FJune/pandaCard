
/**
 ** @Author:pandayu
 ** @Version:1.0
 ** @DateTime:2018-09-09
 ** @Project:pandaCard CardGame
 ** @Contact: QQ:815099602
 **/
 /*
* by xiongrui 11 11
* 快速战斗
* */
var quickFightLayer = ModalDialog.extend({
    quickFightNum:0,
    //quickFightLimit:3,
    ctor:function () {
        // 1. super init first
        this._super();
        this.LayerName = "quickFightLayer";
        this.quickFightLimit = Helper.getVipNumberByUneed(GLOBALDATA.base.vip,6);
        return true;
    },
    onEnter:function(){
        this._super();
        var self = this;
        this.quickFightNum = GLOBALDATA.base.fast;

        this.quickFightEvent = cc.EventListener.create({
            event:cc.EventListener.CUSTOM,
            eventName:"battle.fast",
            callback:function (event) {
                var state = event.getUserData().status;
                //0 返回成功  100 资源不足
                if(state==0){
                    //返回实际获得的物品id数组，奖励获得显示用
                    self.quickFightNum = GLOBALDATA.base.fast;
                    self.resourceGet(event.getUserData());
                    self.setThisFightGetShow();
                }
            }
        });
        cc.eventManager.addListener( this.quickFightEvent,1);
    },
    onExit:function () {
        this._super();
        cc.eventManager.removeListener(this.quickFightEvent);
    },
    initUI:function (){
        this.quickFight_node = ccs.load(res.uiQuickFightLayer).node;
        this.addChild(this.quickFight_node);
        this.quickFight_node.setAnchorPoint(0.5,0.5);
        this.quickFight_node.setPosition(cc.winSize.width/2,cc.winSize.height/2);
        this.btnFree = ccui.helper.seekWidgetByName(this.quickFight_node,"btnFree");
        this.btnFree.addTouchEventListener(this.btnTouchEvent,this);
        var btnBack = ccui.helper.seekWidgetByName(this.quickFight_node,"btnBack");
        btnBack.addTouchEventListener(this.btnTouchEvent,this);
        this.btnFast = ccui.helper.seekWidgetByName(this.quickFight_node,"btnFast");
        this.btnFast.addTouchEventListener(this.btnTouchEvent,this);

        this.bagBg1 = ccui.helper.seekWidgetByName(this.quickFight_node,"bagBg1");
        this.bagIcon1 = ccui.helper.seekWidgetByName(this.quickFight_node,"bagIcon1");
        this.bagPieces1 = ccui.helper.seekWidgetByName(this.quickFight_node,"bagPieces1");
        this.bagBg2 = ccui.helper.seekWidgetByName(this.quickFight_node,"bagBg2");
        this.bagIcon2 = ccui.helper.seekWidgetByName(this.quickFight_node,"bagIcon2");
        this.bagPieces2 = ccui.helper.seekWidgetByName(this.quickFight_node,"bagPieces2");
        this.bagBg3 = ccui.helper.seekWidgetByName(this.quickFight_node,"bagBg3");
        this.bagIcon3 = ccui.helper.seekWidgetByName(this.quickFight_node,"bagIcon3");
        this.bagPieces3 = ccui.helper.seekWidgetByName(this.quickFight_node,"bagPieces3");
        this.bagBg4 = ccui.helper.seekWidgetByName(this.quickFight_node,"bagBg4");
        this.bagIcon4 = ccui.helper.seekWidgetByName(this.quickFight_node,"bagIcon4");
        this.bagPieces4 = ccui.helper.seekWidgetByName(this.quickFight_node,"bagPieces4");
        this.diamondImageBg = ccui.helper.seekWidgetByName(this.quickFight_node,"diamondImageBg");
        this.diamondValue = ccui.helper.seekWidgetByName(this.quickFight_node,"diamondValue");
        this.textNum = ccui.helper.seekWidgetByName(this.quickFight_node,"textNum");
        this.textVip = ccui.helper.seekWidgetByName(this.quickFight_node,"textVip");

        //设置本次快速战斗有概率获得的物品,开始战斗按钮的界面显示
        this.setThisFightGetShow();
    },
    btnTouchEvent:function (sender,type) {
        if(ccui.Widget.TOUCH_ENDED==type){
            switch(sender.name){
                case "btnFree":
                    quickFightModel.startQuickFight();
                    break;
                case "btnFast":
                    quickFightModel.startQuickFight();
                    break;
                case "btnBack":
                    this.removeFromParent();
                    break;
                default:
                    break;
            }
        }
    },
    setThisFightGetShow:function () {
        this.quickFightNum = GLOBALDATA.base.fast;
        var imageArray = [[this.bagBg1,this.bagIcon1,this.bagPieces1],[this.bagBg2,this.bagIcon2,this.bagPieces2],[this.bagBg3,this.bagIcon3,this.bagPieces3],[this.bagBg4,this.bagIcon4,this.bagPieces4]];
        for(var j=0;j<imageArray.length;j++){
            imageArray[j][0].setVisible(false);
        }
        var tingitem = QUICKCOMBATCFG[this.quickFightNum+1].item;
        for(var i=0;i<tingitem.length;i++){
            imageArray[i][0].setVisible(true);
            var thing = Helper.findItemId(tingitem[i]);
            Helper.LoadIconFrameAndAddClick(imageArray[i][1],imageArray[i][0],imageArray[i][2],thing);
        }
        //判断是否为当天第一次快速战斗，切换快速战斗按钮的样式资源
        if(this.quickFightNum==0){
            this.btnFree.setVisible(true);
            this.btnFast.setVisible(false);
        }
        if(this.quickFightNum>0 && this.quickFightNum<=this.quickFightLimit){
            this.btnFree.setVisible(false);
            this.btnFast.setVisible(true);
            this.diamondValue.setString(parseInt(QUICKCOMBATCFG[this.quickFightNum+1].cost));
        }
        if(this.quickFightNum>this.quickFightLimit){
            this.btnFree.setVisible(false);
            this.btnFast.setVisible(true);
            this.btnFast.setEnable(false);
            this.btnFast.setBright(false);
        }
        this.textNum.setString(StringFormat(STRINGCFG[100053].string,[(this.quickFightLimit-this.quickFightNum).toString()]));
        var myvip = GLOBALDATA.base.vip;
        this.textVip.setString(StringFormat(STRINGCFG[100052].string,[myvip,this.quickFightLimit]));
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
});