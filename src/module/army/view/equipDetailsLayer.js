
/**
 ** @Author:pandayu
 ** @Version:1.0
 ** @DateTime:2018-09-09
 ** @Project:pandaCard CardGame
 ** @Contact: QQ:815099602
 **/
 /**
 * 装备强化与精炼层UI的创建
 */

var equipDetailsLayer = ModalDialog.extend({
    LayerName:"equipDetailsLayer",
    ctor:function(equipId, pos,eqInfo){  //pos为-1 表示装备属性查看  eqInfo传进来的装备信息(默认不传)
        this._super();
        this.equipId = equipId;
        this.eqInfo = eqInfo;
        this.pos = pos;
        this.equipBgPosX = 0;  //装备背景的位置
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
        //处理红点
        this.dealRedPoint();
    },
    //自定义Widget
    customWidget:function(){
        var wgtArr = [];
		wgtArr.push("equipBg");  //装备图片的底图
        wgtArr.push("equipBgImage");   //装备图片
		wgtArr.push("Image_duanzao");   //锻造背景
		wgtArr.push("duanzaoLev");   //锻造等级
		wgtArr.push("duanzaoAttr");   //锻造属性
		wgtArr.push("equipName");   //装备名称
		wgtArr.push("strenLev");   //强化等级
		wgtArr.push("equipBaseAttr");   //强化属性
		wgtArr.push("refineLev");   //精炼等级
		wgtArr.push("equipRefineAttr");   //精炼属性
		wgtArr.push("suitName");   //套装名称
		//套装装备
		for(var i = 1;i<=4;i++){
			wgtArr.push("bootBg"+i);
			wgtArr.push("bootIcon"+i);
			wgtArr.push("bootBlack"+i);
			wgtArr.push("bootText"+i);
		}
		//套装激活
		for(var i = 1;i<=3;i++){
			wgtArr.push("effect_"+i);
			wgtArr.push("efeectDes_"+i);
		}
		wgtArr.push("backBtn");   //返回按钮
        wgtArr.push("duanZaoBtn");   //锻造按钮
		wgtArr.push("strengthBtn");   //强化按钮
		wgtArr.push("refineBtn");   //精炼按钮
		wgtArr.push("unsnatchBtn");   //卸下按钮
		wgtArr.push("changeBtn");   //更换按钮
        //红点
        wgtArr.push("imageTips");

        var uiDetailsLayer = ccsTool.load(res.uiEquipDetailsLayer,wgtArr);
        //控件的名字赋值给this变量
        for(var key in uiDetailsLayer.wgt){
            this[key] = uiDetailsLayer.wgt[key];
        }
        this.addChild(uiDetailsLayer.node);

        //返回按钮
        this.backBtn.addTouchEventListener(this.equiPromteLayerEvent, this);
        //锻造按钮
        this.duanZaoBtn.addTouchEventListener(this.equiPromteLayerEvent, this);
        //强化按钮
        this.strengthBtn.addTouchEventListener(this.equiPromteLayerEvent, this);
        //精炼按钮
        this.refineBtn.addTouchEventListener(this.equiPromteLayerEvent, this);
        //卸下按钮
        this.unsnatchBtn.addTouchEventListener(this.equiPromteLayerEvent, this);
        //更换按钮
        this.changeBtn.addTouchEventListener(this.equiPromteLayerEvent, this);
        //装备背景的位置
        this.equipBgPosX = this.equipBgImage.getPositionX();
        //装备查看的状态
        if(this.pos == -1){
            this.duanZaoBtn.setVisible(false);   //锻造按钮
            this.strengthBtn.setVisible(false);   //强化按钮
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

        //锻造 信息
        var equItem = new equAttr(eqInfo.p, eqInfo.s, eqInfo.r, eqInfo.d);
        var duanzaoAtt = EQUIPDUANZAOCFG[eqInfo.p];

        if(duanzaoAtt != null){
            this.equipBgImage.setPositionX(this.equipBgPosX);
            this.Image_duanzao.setVisible(true);  //锻造背景
            var dzLv = eqInfo.d || 0;
            this.duanzaoLev.setString(STRINGCFG[100129].string+"："+dzLv+'/'+MAXEQUFPRGE); //锻造等级 100129
            if(dzLv > 0){
                var attrItem = equItem.getForgeAttrForShow();
                var strAttr = '';
                for(var attr in attrItem){
                    strAttr = strAttr + attrItem[attr].name+'+'+ attrItem[attr].value+'\n';
                }
                this.duanzaoAttr.setString(strAttr);
                this.duanzaoAttr.setVisible(true);  //锻造属性
            }else{
                this.duanzaoAttr.setVisible(false);  //锻造属性
            }
        }else{
            var size = this.equipBg.getContentSize();  //装备图片的底图
            this.equipBgImage.setPositionX(size.width/2);
            this.Image_duanzao.setVisible(false);  //锻造背景
        }

        //强化 信息
		var maxlevel = MAXEQULEVEL;
		if(GLOBALDATA.base.lev * 2 <= maxlevel){
			maxlevel = GLOBALDATA.base.lev * 2;
		}
        this.strenLev.setString(STRINGCFG[100028].string+"："+eqInfo.s+'/'+maxlevel);  //100028 强化等级
        //var attrItem = eqItem.getLvAttrForShow();
        var attrItem = equItem.getStrengthAttrForShow();
        var strAttr = '';
        for(var attr in attrItem){
            strAttr = strAttr + attrItem[attr].name+'+'+ attrItem[attr].value+'\n';
        }
        this.equipBaseAttr.setString(strAttr);

        //精炼 信息
        this.refineLev.setString(STRINGCFG[100029].string+"："+eqInfo.r);  // 100029 精炼等级
        var attrItem = equItem.getRefineAttrForShow();
        var strAttr ='';
        for(var attr in attrItem){
            strAttr = strAttr + attrItem[attr].name+'+'+attrItem[attr].value+'\n';
        }
        this.equipRefineAttr.setString(strAttr);
        //套装名称
        var suitAtt = EQUIPSUITCFG[this.equipAttri.suit_id] || {};
        this.suitName.setString(suitAtt.name);
        //套装装备
        var count = 0;
        for(var i = 1;i<=4;i++){
            var suitId = suitAtt.equips[i-1];  //套装装备的id
            var itemInfo = Helper.findItemId(suitId);
            //装备品质边框
            Helper.LoadFrameImageWithPlist(this["bootBg"+i],itemInfo.quality);
            //装备图片
            Helper.LoadIcoImageWithPlist(this["bootIcon"+i],itemInfo);
            //装备名称
            this["bootText"+i].setString(itemInfo.itemname);
            Helper.setNamecolorByQuality(this["bootText"+i],itemInfo.quality);
            if(this.pos != -1){  //不是装备查看状态
                var eqId = GLOBALDATA.army.equips[this.pos][2+i-1];
                var eqInfo = GLOBALDATA.depot[eqId];
                if(eqInfo != null && eqInfo.p == suitId){
                    count++;
                    this["bootBlack"+i].setVisible(false);
                }else{
                    this["bootBlack"+i].setVisible(true);
                }
            }else{
                this["bootBlack"+i].setVisible(true);
            }
        }
        //套装激活
        for(var i = 1;i<=3;i++){
            var attrItem = this.getSuitAttr(suitAtt["attribute"+(i+1)]);
            var strAttr ='';
            for(var attr in attrItem){
                strAttr = strAttr + attrItem[attr].name+"+"+attrItem[attr].value+"  ";
            }
            this["efeectDes_"+i].setString(strAttr);
            if(i+1<=count){
                this["effect_"+i].setColor(cc.color(0,255,0));
                this["efeectDes_"+i].setColor(cc.color(0,255,0));
            }else{
                this["effect_"+i].setColor(cc.color(34,22,22));
                this["efeectDes_"+i].setColor(cc.color(34,22,22));
            }
        }
    },
    //获取套装属性
    getSuitAttr:function(arr){
        var attr = [];
        var formatNum = function(type,val){
            if(type == 2){
                return (val/100)+'%';
            }
            return val;
        };
        for(var i=0;i<arr.length;i++){
            var item ={};
            item.name = ATTRIBUTEIDCFG[arr[i][0]].describe;
            item.value = formatNum(arr[i][1],arr[i][2]);
            attr.push(item);
        }
        return attr;
    },
    equiPromteLayerEvent:function(sender, type){
        if(ccui.Widget.TOUCH_ENDED==type){
            switch (sender.name){
                case'backBtn':
                    this.removeFromParent(true);
                    break;
                case 'duanZaoBtn':
                    var _equipForginLayer = new equipForginLayer(this.pos,this.equipAttri.type);
                    this.getParent().addChild(_equipForginLayer,3);
                    break;
                case'strengthBtn':
                    this.setLocalZOrder(0);
                    var _equipStrenLayer = new equipStrenLayer(this.equipId);
                    _equipStrenLayer.eqDetail = this;
                    //this.getParent().curModule.addChild(_equipStrenLayer,2);
                    this.getParent().addChild(_equipStrenLayer,2);
                    break;
                case'refineBtn':
                    this.setLocalZOrder(0);
                    var _equipRefineLayer = new equipRefineLayer(this.equipId);
                    _equipRefineLayer.eqDetail = this;
                    //this.getParent().curModule.addChild(_equipRefineLayer, 2);
                    this.getParent().addChild(_equipRefineLayer, 2);
                    break;
                case'unsnatchBtn':
                    armyModel.unsnatchDress(this.pos+1, this.equipAttri.type);
                    break;
                case'changeBtn':
                    var _equipChangeLayer = new equipChangeLayer(this.equipAttri.type, this.pos);
                    this.getParent().addChild(_equipChangeLayer, 2);
                    this.removeFromParent(true);
                default:
                    break;
            }
        }
    },
    //处理红点
    dealRedPoint:function(data){
        var redInfo = armyRedPoint.equPanleRedPoint(this.equipId,data);
        if(redInfo != null){
            this.imageTips.setVisible(false);
            if(redInfo == true){
                this.imageTips.setVisible(true);
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
        cc.log('equipDetailsLayer onExit');
    }
});