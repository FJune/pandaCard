
/**
 ** @Author:pandayu
 ** @Version:1.0
 ** @DateTime:2018-09-09
 ** @Project:pandaCard CardGame
 ** @Contact: QQ:815099602
 **/
 /**
 * 配饰精炼强化层的创建
 */

var accDetailsLayer = ModalDialog.extend({
    LayerName:"accDetailsLayer",
    ctor:function(equipId, pos,eqInfo){  //pos为-1 表示查看装备属性  eqInfo传进来的装备信息(默认不传)
        this._super();
        this.equipId = equipId;
        this.eqInfo = eqInfo;
        this.pos = pos;
        this.equipAttri = null;
    },

    onEnter:function(){
        this._super();
        var self = this;
        this.evnUpdateUI = cc.EventListener.create({
            event:cc.EventListener.CUSTOM,
            eventName: "updateEquUI",
            callback:function(event){
                var data = event.getUserData();
                self.equipId = data.equipId;
                self.pos = data.pos;
                self.updateInfo(self.equipId);
            }
        });
        cc.eventManager.addListener(this.evnUpdateUI, this);
        //添加卸下的返回事件
        this.evnTakeOff = cc.EventListener.create({
            event:cc.EventListener.CUSTOM,
            eventName: "army.take_off",
            callback:function(event){
                var resData = event.getUserData();
                if(resData.status == 0){
                    self.removeFromParent(true);
                }
            }
        });
        cc.eventManager.addListener(this.evnTakeOff, this);
    },

    //初始化ui
    initUI:function () {
        this.customWidget();  //自定义Widget
        this.updateInfo(this.equipId);
    },
    //自定义Widget
    customWidget:function(){
        var wgtArr = [];
        wgtArr.push("equipBgImage");   //装备图片
        wgtArr.push("equipName");   //装备名称
        wgtArr.push("strenLev");   //强化等级
        wgtArr.push("accBaseAttr");   //强化属性
        wgtArr.push("refineLev");   //精炼等级
        wgtArr.push("accRefineAttr");   //精炼属性
		wgtArr.push("suitBg");   //缘分士兵背景
		for(var i=1;i<=3;i++){
			//三个缘分士兵
			wgtArr.push("bootBg"+i);
			wgtArr.push("bootIcon"+i);
			wgtArr.push("bootText"+i);
			//三个阶段
			wgtArr.push("effect_"+i);
			wgtArr.push("efeectDes_"+i);
			wgtArr.push("efeectKai_"+i);
		}
        wgtArr.push("backBtn");   //返回按钮
        wgtArr.push("strenBtn");   //强化按钮
        wgtArr.push("refineBtn");   //精炼按钮
        wgtArr.push("unsnatchBtn");   //卸下按钮
        wgtArr.push("changeBtn");   //更换按钮
        var uiDetailsLayer = ccsTool.load(res.uiAccDetailsLayer,wgtArr);
        //控件的名字赋值给this变量
        for(var key in uiDetailsLayer.wgt){
            this[key] = uiDetailsLayer.wgt[key];
        }
        this.addChild(uiDetailsLayer.node);
        //返回按钮
        this.backBtn.addTouchEventListener(this.accPromteLayerEvent, this);
        //强化按钮
        this.strenBtn.addTouchEventListener(this.accPromteLayerEvent, this);
        //精炼按钮
        this.refineBtn.addTouchEventListener(this.accPromteLayerEvent, this);
        //卸下按钮
        this.unsnatchBtn.addTouchEventListener(this.accPromteLayerEvent, this);
        //更换按钮
        this.changeBtn.addTouchEventListener(this.accPromteLayerEvent, this);
        //如果是查看状态
        if(this.pos == -1){
            this.strenBtn.setVisible(false);   //强化按钮
            this.refineBtn.setVisible(false);   //精炼按钮
            this.unsnatchBtn.setVisible(false);   //卸下按钮
            this.changeBtn.setVisible(false);   //更换按钮
        }
    },
    updateInfo:function(equipId){
        var eqInfo = GLOBALDATA.depot[equipId] || this.eqInfo;
        //装备属性
        this.equipAttri = Helper.findEqById(eqInfo.p);
        var itemCfg = Helper.findItemId(eqInfo.p);
        //装备图片
        var eqItem = this.equipBgImage.getChildByName("eqItem");
        if(eqItem != undefined) {
            this.equipBgImage.removeChild(eqItem);
        }
        var equipImage = new EquipItem(equipId,this.eqInfo);
        equipImage.setName("eqItem");
        var size = this.equipBgImage.getContentSize();
        equipImage.setPosition(cc.p(size.width/2, size.height/2));
        this.equipBgImage.addChild(equipImage, 2);
        //装备名称
        this.equipName.setString(itemCfg.itemname);
        Helper.setNamecolorByQuality(this.equipName,itemCfg.quality);
        //强化等级
		var maxlevel = MAXACCLEVEL;
		if(GLOBALDATA.base.lev <= maxlevel){
			maxlevel = GLOBALDATA.base.lev;
		}
        this.strenLev.setString(STRINGCFG[100028].string+"："+eqInfo.s+'/'+maxlevel);  //100028 强化等级
        //强化属性
        var equItem = new equAttr(eqInfo.p, eqInfo.s, eqInfo.r, eqInfo.d);
        var attrItem = equItem.getStrengthAttrForShow();
        var strAttr = '';
        for(var attr in attrItem){
            strAttr =strAttr + attrItem[attr].name+'+'+ attrItem[attr].value+'\n';
        }
        this.accBaseAttr.setString(strAttr);
        //精炼等级
        this.refineLev.setString(STRINGCFG[100029].string+"："+eqInfo.r);  // 100029 精炼等级
        //精炼属性
        var attrItem = equItem.getRefineAttrForShow();
        var strAttr ='';
        for(var attr in attrItem){
            strAttr = strAttr + attrItem[attr].name+'+'+attrItem[attr].value+'\n';
        }
        this.accRefineAttr.setString(strAttr);
        //缘分士兵
        var isFind = false;   //已经找到
        var ConfigArray = [];
        for(var key in ACCRELATIONCFG){
            if(ACCRELATIONCFG[key].accid == eqInfo.p){
                ConfigArray.push(ACCRELATIONCFG[key]);
                isFind = true;
            }else if(isFind){  //当后面的不在是查找的内容的时候
                break;
            }
        }
        if(ConfigArray.length != 0){
            //缘分士兵背景
            this.suitBg.setVisible(true);
            var ConfigF = ConfigArray[0];
            //三个缘分士兵
            for(var i=1;i<=3;i++){
                var itemCfg = Helper.findItemId(ConfigF.hero[i-1]);
                Helper.LoadFrameImageWithPlist(this["bootBg"+i],itemCfg.quality);  //品质边框
                Helper.LoadIcoImageWithPlist(this["bootIcon"+i],itemCfg);   //icon
                //名字
                this["bootText"+i].setString(itemCfg.itemname);
                Helper.setNamecolorByQuality(this["bootText"+i],itemCfg.quality);
            }
            //三个阶段
            for(var i=1;i<=3;i++){
                var Config = ConfigArray[i-1];
                var strText = StringFormat(STRINGCFG[100176].string,Config.level);  //100176	精炼$1阶开启
                this["efeectKai_"+i].setString(strText);
                this["efeectDes_"+i].setString(this.getAttrDes(Config.attr));
                if(eqInfo.r >= Config.level){
                    this["effect_"+i].setColor(cc.color(255,255,0));
                    this["efeectKai_"+i].setColor(cc.color(255,255,0));
                    this["efeectDes_"+i].setColor(cc.color(255,255,0));
                }else{
                    this["effect_"+i].setColor(cc.color(255,255,255));
                    this["efeectKai_"+i].setColor(cc.color(255,255,255));
                    this["efeectDes_"+i].setColor(cc.color(255,255,255));
                }
            }
        }else{
            //缘分士兵背景
            this.suitBg.setVisible(false);
        }
    },
    //属性说明
    getAttrDes:function(arr){
        var formatNum = function (type,val) {
            if(type == 2){
                return (val/100)+'%';
            }
            return val;
        };
        var strText = "";
        for (var i=0;i<arr.length;i++){
            var baseItem = arr[i];
            strText = strText + ATTRIBUTEIDCFG[baseItem[0]].describe;
            strText = strText + "+" + formatNum(baseItem[1],baseItem[2])+"\n";
        }
        return strText;
    },
    accPromteLayerEvent:function(sender, type){
        if(ccui.Widget.TOUCH_ENDED==type){
            switch (sender.name){
                case'backBtn':
                    this.removeFromParent(true);
                    break;
                case'strenBtn'://强化
                    this.setLocalZOrder(0);
                    var _accStrenLayer = new accStrenLayer(this.equipId);
                    _accStrenLayer.accDetail = this;
                    //this.getParent().curModule.addChild(_accStrenLayer, 2);
                    this.getParent().addChild(_accStrenLayer, 2);
                    break;
                case'refineBtn'://精炼
                    this.setLocalZOrder(0);
                    var _accRefineLayer = new accRefineLayer(this.equipId);
                    _accRefineLayer.accDetail = this;
                    //this.getParent().curModule.addChild(_accRefineLayer, 2);
                    this.getParent().addChild(_accRefineLayer, 2);
                    break;
                case'unsnatchBtn'://卸下
                    armyModel.unsnatchDress(this.pos+1, this.equipAttri.type);
                    break;
                case'changeBtn'://更换
                    var _accChangeLayer = new accChangeLayer(this.equipAttri.type,this.pos);
                    this.getParent().addChild(_accChangeLayer, 2);
                    this.removeFromParent(true);
                default:
                    break;
            }
        }
    },
    onExit:function () {
        this._super();
        cc.eventManager.removeListener(this.evnUpdateUI);
        cc.eventManager.removeListener(this.evnTakeOff);
        // 发送更新消息
        if(this.pos != -1){
            var evn = new cc.EventCustom('updateUI');
            evn.setUserData(this.pos);
            cc.eventManager.dispatchEvent(evn);
        }
        cc.log('accDetailsLayer onExit');
    }
});