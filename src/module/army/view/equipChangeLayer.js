
/**
 ** @Author:pandayu
 ** @Version:1.0
 ** @DateTime:2018-09-09
 ** @Project:pandaCard CardGame
 ** @Contact: QQ:815099602
 **/
 /**
 * 装备更换和穿戴界面UI的创建
 */

var equipChangeLayer = ModalDialog.extend({
    LayerName:"equipChangeLayer",
    ctor:function(equipType, index){
        this._super();
        this.equipType = equipType;
        this.armyId = index;
        this.wearIp = 0;
    },

    onEnter:function(){
        this._super();
        //配饰穿戴
        var self = this;
        this.evnetqWear = cc.EventListener.create({
            event: cc.EventListener.CUSTOM,
            eventName: "army.wear",
            callback: function(event){
                var resData = event.getUserData();
                if(resData.status == 0){//穿戴成功
                    self.removeFromParent(true);
                }
            }
        });
        cc.eventManager.addListener(this.evnetqWear, 1);
    },
    //初始化ui
    initUI:function () {
        this.customWidget();  //自定义Widget
        this.updateInfo();
    },
    //自定义Widget
    customWidget:function(){
        var wgtArr = [];
        wgtArr.push("equipList");   //list列表
		wgtArr.push("backBtn");   //返回按钮
        wgtArr.push("Text_no");   //提示

        var uiChangeLayer = ccsTool.load(res.uiEquipChangeLayer,wgtArr);
        //控件的名字赋值给this变量
        for(var key in uiChangeLayer.wgt){
            this[key] = uiChangeLayer.wgt[key];
        }
        this.addChild(uiChangeLayer.node);

        //返回按钮
        this.backBtn.addTouchEventListener(this.backEvent, this);
    },
    updateInfo:function(){
        //100021 攻击配饰 100022 防御配饰  100023 武器  100024 头盔 100025 战甲  100026 靴子
        var equipArrayName = [STRINGCFG[100021].string,STRINGCFG[100022].string,STRINGCFG[100023].string,STRINGCFG[100024].string,STRINGCFG[100025].string,STRINGCFG[100026].string];

        var depotArray = [];
        for(var key in GLOBALDATA.depot){
            var equipAttr = Helper.findEqById(GLOBALDATA.depot[key].p);
            if(equipAttr != null && equipAttr.type == this.equipType && GLOBALDATA.depot[key].u == 0){
                var temp = objClone(GLOBALDATA.depot[key]);
                temp.id = key;
                depotArray.push(temp);
            }
        }
        depotArray.sort(this.compareTh);  //排序
        //处理list
        if(depotArray.length != 0){
            for(var i=0;i<depotArray.length;i++){
                var wgtArr = [];
                wgtArr.push("equipBackGround");   //最大的底
                wgtArr.push("equipImageBg");   //装备图片
                wgtArr.push("equipName");   //装备名称
                wgtArr.push("equipType");   //装备类型
                wgtArr.push("equipRefineAttr");   //装备属性
                wgtArr.push("equipRefineLev");   //精炼等级
                wgtArr.push("dressBtn");   //穿戴按钮

                var equItem = ccsTool.load(res.uiEquipShowLayer,wgtArr);
                var wgt = {};
                //控件的名字赋值给wgt变量
                for(var key in equItem.wgt){
                    wgt[key] = equItem.wgt[key];
                }
				wgt.equipBackGround.removeFromParent(false);
                this.equipList.pushBackCustomItem(wgt.equipBackGround);
                //装备图片
                var equipImage = new EquipItem(depotArray[i].id);
                var size = wgt.equipImageBg.getContentSize();
                equipImage.setPosition(cc.p(size.width/2, size.height/2));
                wgt.equipImageBg.addChild(equipImage, 2);
                //装备名称
                var itemCfg = Helper.findItemId(depotArray[i].p);
                wgt.equipName.setString(itemCfg.itemname);
                Helper.setNamecolorByQuality(wgt.equipName,itemCfg.quality);
                //装备类型
                var equipAttri = Helper.findEqById(depotArray[i].p);
                wgt.equipType.setString("【"+equipArrayName[equipAttri.type -1]+"】");
                //装备属性
                var equipItem = new equAttr(depotArray[i].p, depotArray[i].s, depotArray[i].r, depotArray[i].d);
                attrItem = equipItem.getAllAttrForShow();
                var strAttr ='';
                for(var attr in attrItem){
                    strAttr = strAttr+attrItem[attr].name+'+'+attrItem[attr].value+'\n';
                }
                wgt.equipRefineAttr.setString(strAttr);
                //精炼等级
                if(depotArray[i].r == 0){
                    wgt.equipRefineLev.setVisible(false);
                }else{
                    wgt.equipRefineLev.setVisible(true);
                    var strText = StringFormat(STRINGCFG[100027].string,depotArray[i].r);  //100027 精炼$1阶
                    wgt.equipRefineLev.setString(strText);
                }
                //穿戴按钮
                wgt.dressBtn.setTag(depotArray[i].id);
                wgt.dressBtn.addTouchEventListener(this.wearEvent, this);
            }
        }else{
            if(GLOBALDATA.base.lev >= 7){
                this.Text_no.setVisible(false);
            }else{
                this.Text_no.setVisible(true);
            }
        }
    },
    //排序
    compareTh:function (a,b) {
        var last = Helper.findItemId(a.p);
        var next = Helper.findItemId(b.p);
        if(last.quality > next.quality){
            return -1;
        }else if(last.quality == next.quality){
            if(a.d > b.d){  //锻造等级
                return -1;
            }else if(a.d == b.d){
                if(a.s > b.s){  //强化等级
                    return -1;
                }else if(a.s == b.s){
                    if(a.r > b.r){  //精炼等级
                        return -1;
                    }else if(a.r == b.r){
                        if(a.id < b.id){
                            return -1;
                        }
                    }
                }
            }
        }
        return 1;
    },
    //穿戴的事件
    wearEvent:function(sender,type){
        if(ccui.Widget.TOUCH_ENDED==type){
            this.wearIp = sender.getTag();
            armyModel.equipDress(this.armyId+1,this.wearIp);
        }
    },
    backEvent:function(sender,type){
        if(ccui.Widget.TOUCH_ENDED==type){
            this.removeFromParent();
        }
    },
    onExit:function(){
        this._super();
        cc.eventManager.removeListener(this.evnetqWear);
        // 发送更新消息
        if(this.armyId != -1){
            var evn = new cc.EventCustom('updateUI');
            evn.setUserData(this.armyId);
            cc.eventManager.dispatchEvent(evn);
        }
        cc.log('equipChangeLayer onExit');
    }
});