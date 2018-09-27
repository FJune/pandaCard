
/**
 ** @Author:pandayu
 ** @Version:1.0
 ** @DateTime:2018-09-09
 ** @Project:pandaCard CardGame
 ** @Contact: QQ:815099602
 **/
 /**
 * 士兵布阵层的创建
 * 在部队模块，点击布阵按钮，显示布阵层
 */

var embattleLayer = ModalDialog.extend({
    LayerName:"embattleLayer",
    uiEmbattleLayer:null,
    armyIconArray:[],
    armyNum:0,
    embattleArray:[],
    sp1:null,
    sp2:null,
    ctor:function(){
        this._super();
        //this.LayerName = "embattleLayer";
    },

    onEnter:function(){
        this._super();
        //this.initArmyEmbattleUI();

    },

    initUI:function(){
        this.uiEmbattleLayer = ccs.load(res.uiEmbattleLayer).node;
        this.addChild(this.uiEmbattleLayer);
        this.embattleArray = GLOBALDATA.army.em.concat();

        var lev50 = ccui.helper.seekWidgetByName(this.uiEmbattleLayer, "Text_4");
        var lev60 = ccui.helper.seekWidgetByName(this.uiEmbattleLayer, "Text_5");
        var lev40 = ccui.helper.seekWidgetByName(this.uiEmbattleLayer, "Text_6");
        if(GLOBALDATA.base.lev >= 0 && GLOBALDATA.base.lev < 40){
            this.armyNum = 5;
        }else if(GLOBALDATA.base.lev>=40&&GLOBALDATA.base.lev<50){
            this.armyNum = 6;
            lev40.removeFromParent();
        }else if(GLOBALDATA.base.lev>=50&&GLOBALDATA.base.lev<60){
            this.armyNum = 7;
            lev40.removeFromParent();
            lev50.removeFromParent();
        }else {
            this.armyNum = 8;
            lev40.removeFromParent();
            lev50.removeFromParent();
            lev60.removeFromParent();
        }
        this.armyHeadInit();

        this.saveBtn = ccui.helper.seekWidgetByName(this.uiEmbattleLayer, "saveBtn");
        this.saveBtn.addTouchEventListener(this.saveEvent, this);

        /*var listener1 = cc.EventListener.create({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches:true,
            onTouchBegan: function(touch, event){
                var target = event.getCurrentTarget();

                var locationInNode = target.convertToNodeSpace(touch.getLocation());
                var s = target.getContentSize();
                var rect = cc.rect(0, 0, s.width, s.height);

                if (cc.rectContainsPoint(rect, locationInNode)) {
                    cc.log("sprite began... x = " + locationInNode.x + ", y = " + locationInNode.y);
                    //target.opacity = 180;
                    return true;
                }
                return false;
            },

            onTouchMoved:function(touch, event){
                var target = event.getCurrentTarget();
                var delta = touch.getDelta();
                target.x += delta.x;
                target.y += delta.y;
            },

            onTouchEnded:function(touch, event){
                var target = event.getCurrentTarget();

            }
        });
        for(var i=0;i<this.armyIconArray.length;i++){
            cc.eventManager.addListener(listener1, this.armyIconArray[i]);
        }*/
    },


    armyHeadInit:function(){

        for(var i=0;i<8;i++){
            var icon = "Image_head"+(i+1);
            var headIcon = ccui.helper.seekWidgetByName(this.uiEmbattleLayer, icon);
            headIcon.setVisible(false);
        }
        for(var i=0;i<this.armyNum;i++){
            var armyIcon = "armyHeadBg_"+(i+1);
            var armyHead = ccui.helper.seekWidgetByName(this.uiEmbattleLayer, armyIcon);
            armyHead.setTag(i);
            armyHead.addTouchEventListener(this.armyHeadEvent, this);
            var armyBool = this.embattleArray[i];
            if(GLOBALDATA.army.battle[armyBool-1] != 0 && GLOBALDATA.army.battle[armyBool-1] !=-1){
                //this.armyAttribute = Helper.findHeroById(GLOBALDATA.army.battle[armyBool-1]);
                //var iSolHead = cc.spriteFrameCache.getSpriteFrame(this.armyAttribute.armymodel+".png");
                var iSolHead = cc.spriteFrameCache.getSpriteFrame(ITEMCFG[GLOBALDATA.army.battle[armyBool-1]].icon);
                var sprite = new cc.Sprite(iSolHead);
                sprite.setPosition(59, 57);
                //sprite.setScale(1.3);
                armyHead.addChild(sprite);
                this.armyIconArray.push(sprite);
            }
        }
    },

    armyHeadEvent:function(sender, type){
        switch (type){
            case ccui.Widget.TOUCH_ENDED:
                cc.log(sender.getTag());
               if(this.sp1!=null){
                   this.armyHead1=sender;
                   this.sp2 = sender.getTag();
                   this.armyHead2.setHighlighted(false);
               }else{
                   this.armyHead2=sender;
                   this.sp1 = sender.getTag();
                   this.armyHead2.setHighlighted(true);
               }

                if(this.sp1!=null&&this.sp2!=null){
                    var sp3;
                    sp3=this.embattleArray[this.sp1];
                    this.embattleArray[this.sp1]=this.embattleArray[this.sp2];
                    this.embattleArray[this.sp2]=sp3;

                    this.armyHead1.removeAllChildren();
                    this.armyHead2.removeAllChildren();
                    var armyBool = this.embattleArray[this.sp2];
                    if(GLOBALDATA.army.battle[armyBool-1] !=0&&GLOBALDATA.army.battle[armyBool-1] !=-1) {
                        //var armyAttr1 = Helper.findHeroById(GLOBALDATA.army.battle[armyBool-1]);
                        //var iSolHead = cc.spriteFrameCache.getSpriteFrame(armyAttr1.armymodel + ".png");
                        var iSolHead = cc.spriteFrameCache.getSpriteFrame(ITEMCFG[GLOBALDATA.army.battle[armyBool-1]].icon);
                        var sprite = new cc.Sprite(iSolHead);
                        sprite.setPosition(59, 57);
                        //sprite.setScale(1.3);
                        this.armyHead1.addChild(sprite);
                    }

                    var armyBool = this.embattleArray[this.sp1];
                    if(GLOBALDATA.army.battle[armyBool-1] !=0&&GLOBALDATA.army.battle[armyBool-1] !=-1) {
                        //var armyAttr1 = Helper.findHeroById(GLOBALDATA.army.battle[armyBool-1]);
                        //var iSolHead = cc.spriteFrameCache.getSpriteFrame(armyAttr1.armymodel + ".png");
                        var iSolHead = cc.spriteFrameCache.getSpriteFrame(ITEMCFG[GLOBALDATA.army.battle[armyBool-1]].icon);
                        var sprite = new cc.Sprite(iSolHead);
                        sprite.setPosition(59, 57);
                        //sprite.setScale(1.3);
                        this.armyHead2.addChild(sprite);
                    }

                    //this.armyHeadInit();
                    this.sp1 = null;
                    this.sp2 = null;
                }
                break;
            default:
                break;
        }
    },

    saveEvent:function(sender, type){
        var self = this;
        switch (type){
            case ccui.Widget.TOUCH_ENDED:
                //GLOBALDATA.army.em = this.embattleArray;
                armyModel.embattle(this.embattleArray);
                this.emabattleProm = cc.EventListener.create({
                    event:cc.EventListener.CUSTOM,
                    eventName:"army.embattle",
                    callback:function(event){
                        var emabattleData = event.getUserData();
                        if(emabattleData.status != 0){
                            self.armyHeadInit();
                        }else{
                            GLOBALDATA.army.em = self.embattleArray;
                            self.removeFromParent(true);
                        }
                    }
                });
                cc.eventManager.addListener(this.emabattleProm, this);
                break;
            default:
                break;
        }
    },

    onExit:function () {
        this._super();
        cc.eventManager.removeListener(this.emabattleProm);
    }
});