
/**
 ** @Author:pandayu
 ** @Version:1.0
 ** @DateTime:2018-09-09
 ** @Project:pandaCard CardGame
 ** @Contact: QQ:815099602
 **/
 /**
 * 强化大师层UI的创建
 */

var equipMasterLayer = ModalDialog.extend({
    LayerName:"equipMasterLayer",
    ctor:function(index){
        this._super();
        this.index = index;
        this.eType = 1;
    },

    onEnter:function(){
        this._super();
        this.initCustomEvent();
    },
    //初始化ui
    initUI:function () {
        this.customWidget();  //自定义Widget
        this.updateInfo(this.equipId);
        //默认选择第一个标签
        this.changeBtn1.setBrightStyle(ccui.Widget.BRIGHT_STYLE_HIGH_LIGHT);
        this.changeBtn1.setTouchEnabled(false);
    },
    initCustomEvent:function () {
        var self = this;
        this.evnUpdateUI = cc.EventListener.create({
            event:cc.EventListener.CUSTOM,
            eventName: "updateEquMaster",
            callback:function(event){
                self.updateInfo();
            }
        });
        cc.eventManager.addListener(this.evnUpdateUI, this);
    },
    //自定义Widget
    customWidget:function(){
        var wgtArr = [];
		wgtArr.push("backBtn");  //返回按钮
		for(var i=1;i<=4;i++){
			wgtArr.push("changeBtn"+i);  //标签按钮
			wgtArr.push("Image_equ"+i);  //装备的大背景
			wgtArr.push("bootBg"+i);  //装备的背景
			wgtArr.push("boot_no"+i);  //无装备的文字
			wgtArr.push("bootText"+i);  //装备名称
			wgtArr.push("bootBarBg"+i);  //装备进度条的背景
			wgtArr.push("LoadingBar"+i);  //装备进度条
			wgtArr.push("bootTextBar"+i);  //进度文字
		}
		wgtArr.push("strenLevDes");  //强化或者精炼
		wgtArr.push("bootTextDes");  //点击装备可去的文字
		wgtArr.push("strenLevMaster");  //强化大师现在级别
		for(var i=1;i<=3;i++){
			wgtArr.push("bootNowM"+i);  //现在的属性说明
			wgtArr.push("bootNextM"+i);  //下一级的属性说明
		}


        var uiMasterLayer = ccsTool.load(res.uiEquipMasterLayer,wgtArr);
        //控件的名字赋值给this变量
        for(var key in uiMasterLayer.wgt){
            this[key] = uiMasterLayer.wgt[key];
        }
        this.addChild(uiMasterLayer.node);

        //返回按钮
        this.backBtn.addTouchEventListener(this.backEvent, this);
        //四个标签按钮
        for(var i=1;i<=4;i++){
            this["changeBtn"+i].setTag(i);
            this["changeBtn"+i].addTouchEventListener(this.changeBtnEvent, this);
        }
        //四个装备大背景
        for(var i=1;i<=4;i++){
            this["Image_equ"+i].addTouchEventListener(this.clickEquEvent, this);
        }
    },
    updateInfo:function(){
        var eqArray = GLOBALDATA.army.equips[this.index];
        if(this.eType == 1){  //装备强化
            var per = 10;
            //装备的大背景
            this.Image_equ3.setVisible(true);
            this.Image_equ4.setVisible(true);
            //计算最低的强化等级
            var minLv = MAXEQULEVEL;
            for(var i =1;i<=4;i++){
                if(eqArray[i+1]!=0){
                    var eqInfo = GLOBALDATA.depot[eqArray[i+1]];
                    if(eqInfo.s < minLv){
                        minLv = eqInfo.s;
                    }
                }else{
                    minLv = 0;
                    break;
                }
            }
            //获取当前对应的强化大师数据
            var nowData = this.getSomeMinData(1,1,minLv,MAXEQULEVEL);    //当前级别强化大师数据
            var nextData = this.getSomeMinData(1,1,minLv+per,MAXEQULEVEL);  //下一级别强化大师数据
            //设置四个装备
            for(var i = 1;i<=4;i++){
                if(eqArray[i+1]!=0){
                    var eqInfo = GLOBALDATA.depot[eqArray[i+1]];
                    var itemCfg = Helper.findItemId(eqInfo.p);
                    this["bootBg"+i].setVisible(true);  //装备的背景
                    this["bootText" + i].setVisible(true);  //装备名称
                    this["bootBarBg" + i].setVisible(true);  //装备进度条的背景
                    this["boot_no"+i].setVisible(false);  //无装备的文字
                    //装备图片
                    this["bootBg"+i].removeAllChildren(true);
                    var equipImage = new EquipItem(eqArray[i+1]);
                    var size = this["bootBg"+i].getContentSize();
                    equipImage.setPosition(cc.p(size.width/2, size.height/2));
                    this["bootBg"+i].addChild(equipImage, 2);
                    //装备名称
                    this["bootText"+i].setString(itemCfg.itemname);
                    Helper.setNamecolorByQuality(this["bootText"+i],itemCfg.quality);
                    if(nextData == null){  //下一级为空
                        //进度文字
                        this["bootTextBar"+i].setString(eqInfo.s+"/MAX");
                        //装备进度条
                        this["LoadingBar"+i].setPercent(100);
                    }else{
                        //进度文字
                        this["bootTextBar"+i].setString(eqInfo.s+"/"+nextData.goal);
                        //装备进度条
                        var percent = Math.floor(eqInfo.s/nextData.goal*100);
                        if(percent > 100){
                            percent = 100;
                        }
                        this["LoadingBar"+i].setPercent(percent);
                    }
                    //装备大背景的点击
                    this["Image_equ"+i].setTouchEnabled(true);
                    this["Image_equ"+i].setTag(eqArray[i+1]);
                }else {
                    this["bootBg" + i].setVisible(false);  //装备的背景
                    this["bootText" + i].setVisible(false);  //装备名称
                    this["bootBarBg" + i].setVisible(false);  //装备进度条的背景
                    this["boot_no" + i].setVisible(true);  //无装备的文字
                    //装备大背景的点击
                    this["Image_equ" + i].setTouchEnabled(false);
                }
            }
            //点击装备可去的文字
            this.bootTextDes.setString(STRINGCFG[100155].string);   //100155	点击装备可直接去强化
            //强化或者精炼
            this.strenLevDes.setString(STRINGCFG[100174].string);   //100174	强化进度
            if(nowData == null){  //当前为空
                //强化大师现在级别
                this.strenLevMaster.setString(STRINGCFG[100159].string);   //100159	未强化
                //现在的属性说明
                var strText = StringFormat(STRINGCFG[100169].string,per);  //100169	全身装备每强化$1级
                this.bootNowM1.setString(strText);
                this.bootNowM2.setString(STRINGCFG[100173].string);  //100173	属性得到一次提升
                this.bootNowM3.setVisible(false);
            }else{
                //强化大师现在级别
                var strText = StringFormat(STRINGCFG[100161].string,Math.floor(minLv/per));  //100161	装备强化大师$1级
                this.strenLevMaster.setString(strText);
                //现在的属性说明
                this.bootNowM1.setString(strText);
                strText = StringFormat(STRINGCFG[100165].string,Math.floor(minLv/per)*per);  //100165	全身装备强化$1级
                this.bootNowM2.setString("("+strText+")");
                this.bootNowM3.setVisible(true);
                this.bootNowM3.setString(this.getAttrDes(nowData.attr));
            }
            if(nextData == null){  //下一级为空
                //下一级的属性说明
                this.bootNextM1.setString("MAX");
                this.bootNextM2.setString("MAX");
                this.bootNextM3.setVisible(false);
            }else{
                //下一级的属性说明
                var strText = StringFormat(STRINGCFG[100161].string,Math.floor(minLv/per)+1);  //100161	装备强化大师$1级
                this.bootNextM1.setString(strText);
                strText = StringFormat(STRINGCFG[100165].string,Math.floor(minLv/per)*per+per);  //100165	全身装备强化$1级
                this.bootNextM2.setString("("+strText+")");
                this.bootNextM3.setVisible(true);
                this.bootNextM3.setString(this.getAttrDes(nextData.attr));
            }
        }else if(this.eType == 2){  //装备精炼
            var per = 2;
            //装备的大背景
            this.Image_equ3.setVisible(true);
            this.Image_equ4.setVisible(true);
            //计算最低的精炼等级
            var minLv = MAXEQUREFINE;
            for(var i =1;i<=4;i++){
                if(eqArray[i+1]!=0){
                    var eqInfo = GLOBALDATA.depot[eqArray[i+1]];
                    if(eqInfo.r < minLv){
                        minLv = eqInfo.r;
                    }
                }else{
                    minLv = 0;
                    break;
                }
            }
            //获取当前对应的强化大师数据
            var nowData = this.getSomeMinData(1,2,minLv,MAXEQUREFINE);    //当前级别强化大师数据
            var nextData = this.getSomeMinData(1,2,minLv+per,MAXEQUREFINE);  //下一级别强化大师数据
            //设置四个装备
            for(var i = 1;i<=4;i++){
                if(eqArray[i+1]!=0){
                    var eqInfo = GLOBALDATA.depot[eqArray[i+1]];
                    var itemCfg = Helper.findItemId(eqInfo.p);
                    this["bootBg"+i].setVisible(true);  //装备的背景
                    this["bootText" + i].setVisible(true);  //装备名称
                    this["bootBarBg" + i].setVisible(true);  //装备进度条的背景
                    this["boot_no"+i].setVisible(false);  //无装备的文字
                    //装备图片
                    this["bootBg"+i].removeAllChildren(true);
                    var equipImage = new EquipItem(eqArray[i+1]);
                    var size = this["bootBg"+i].getContentSize();
                    equipImage.setPosition(cc.p(size.width/2, size.height/2));
                    this["bootBg"+i].addChild(equipImage, 2);
                    //装备名称
                    this["bootText"+i].setString(itemCfg.itemname);
                    Helper.setNamecolorByQuality(this["bootText"+i],itemCfg.quality);
                    if(nextData == null){  //下一级为空
                        //进度文字
                        this["bootTextBar"+i].setString(eqInfo.r+"/MAX");
                        //装备进度条
                        this["LoadingBar"+i].setPercent(100);
                    }else{
                        //进度文字
                        this["bootTextBar"+i].setString(eqInfo.r+"/"+nextData.goal);
                        //装备进度条
                        var percent = Math.floor(eqInfo.r/nextData.goal*100);
                        if(percent > 100){
                            percent = 100;
                        }
                        this["LoadingBar"+i].setPercent(percent);
                    }
                    //装备大背景的点击
                    this["Image_equ"+i].setTouchEnabled(true);
                    this["Image_equ"+i].setTag(eqArray[i+1]);
                }else{
                    this["bootBg"+i].setVisible(false);  //装备的背景
                    this["bootText" + i].setVisible(false);  //装备名称
                    this["bootBarBg" + i].setVisible(false);  //装备进度条的背景
                    this["boot_no"+i].setVisible(true);  //无装备的文字
                    //装备大背景的点击
                    this["Image_equ"+i].setTouchEnabled(false);
                }
            }
            //点击装备可去的文字
            this.bootTextDes.setString(STRINGCFG[100156].string);   //100156	点击装备可直接去精炼
            //强化或者精炼
            this.strenLevDes.setString(STRINGCFG[100175].string);   //100175	精炼进度
            if(nowData == null){  //当前为空
                //强化大师现在级别
                this.strenLevMaster.setString(STRINGCFG[100160].string);   //100160	未精炼
                //现在的属性说明
                var strText = StringFormat(STRINGCFG[100170].string,per);  //100170	全身装备每精炼$1级
                this.bootNowM1.setString(strText);
                this.bootNowM2.setString(STRINGCFG[100173].string);  //100173	属性得到一次提升
                this.bootNowM3.setVisible(false);
            }else{
                //强化大师现在级别
                var strText = StringFormat(STRINGCFG[100162].string,Math.floor(minLv/per));  //100162	装备精炼大师$1级
                this.strenLevMaster.setString(strText);
                //现在的属性说明
                this.bootNowM1.setString(strText);
                strText = StringFormat(STRINGCFG[100166].string,Math.floor(minLv/per)*per);  //100166	全身装备精炼$1级
                this.bootNowM2.setString("("+strText+")");
                this.bootNowM3.setVisible(true);
                this.bootNowM3.setString(this.getAttrDes(nowData.attr));
            }
            if(nextData == null){  //下一级为空
                //下一级的属性说明
                this.bootNextM1.setString("MAX");
                this.bootNextM2.setString("MAX");
                this.bootNextM3.setVisible(false);
            }else{
                //下一级的属性说明
                var strText = StringFormat(STRINGCFG[100162].string,Math.floor(minLv/per)+1);  //100162	装备精炼大师$1级
                this.bootNextM1.setString(strText);
                strText = StringFormat(STRINGCFG[100166].string,Math.floor(minLv/per)*per+per);  //100166	全身装备精炼$1级
                this.bootNextM2.setString("("+strText+")");
                this.bootNextM3.setVisible(true);
                this.bootNextM3.setString(this.getAttrDes(nextData.attr));
            }
        }else if(this.eType == 3){  //配饰强化
            var per = 10;
            //装备的大背景
            this.Image_equ3.setVisible(false);
            this.Image_equ4.setVisible(false);
            //计算最低的精炼等级
            var minLv = MAXACCLEVEL;
            for(var i =1;i<=2;i++){
                if(eqArray[i-1]!=0){
                    var eqInfo = GLOBALDATA.depot[eqArray[i-1]];
                    if(eqInfo.s < minLv){
                        minLv = eqInfo.s;
                    }
                }else{
                    minLv = 0;
                    break;
                }
            }
            //获取当前对应的强化大师数据
            var nowData = this.getSomeMinData(2,1,minLv,MAXACCLEVEL);    //当前级别强化大师数据
            var nextData = this.getSomeMinData(2,1,minLv+per,MAXACCLEVEL);  //下一级别强化大师数据
            //设置四个装备
            for(var i = 1;i<=2;i++){
                if(eqArray[i-1]!=0){
                    var eqInfo = GLOBALDATA.depot[eqArray[i-1]];
                    var itemCfg = Helper.findItemId(eqInfo.p);
                    this["bootBg"+i].setVisible(true);  //装备的背景
                    this["bootText" + i].setVisible(true);  //装备名称
                    this["bootBarBg" + i].setVisible(true);  //装备进度条的背景
                    this["boot_no"+i].setVisible(false);  //无装备的文字
                    //装备图片
                    this["bootBg"+i].removeAllChildren(true);
                    var equipImage = new EquipItem(eqArray[i-1]);
                    var size = this["bootBg"+i].getContentSize();
                    equipImage.setPosition(cc.p(size.width/2, size.height/2));
                    this["bootBg"+i].addChild(equipImage, 2);
                    //装备名称
                    this["bootText"+i].setString(itemCfg.itemname);
                    Helper.setNamecolorByQuality(this["bootText"+i],itemCfg.quality);
                    if(nextData == null){  //下一级为空
                        //进度文字
                        this["bootTextBar"+i].setString(eqInfo.s+"/MAX");
                        //装备进度条
                        this["LoadingBar"+i].setPercent(100);
                    }else{
                        //进度文字
                        this["bootTextBar"+i].setString(eqInfo.s+"/"+nextData.goal);
                        //装备进度条
                        var percent = Math.floor(eqInfo.s/nextData.goal*100);
                        if(percent > 100){
                            percent = 100;
                        }
                        this["LoadingBar"+i].setPercent(percent);
                    }
                    //装备大背景的点击
                    this["Image_equ"+i].setTouchEnabled(true);
                    this["Image_equ"+i].setTag(eqArray[i-1]);
                }else{
                    this["bootBg"+i].setVisible(false);  //装备的背景
                    this["bootText" + i].setVisible(false);  //装备名称
                    this["bootBarBg" + i].setVisible(false);  //装备进度条的背景
                    this["boot_no"+i].setVisible(true);  //无装备的文字
                    //装备大背景的点击
                    this["Image_equ"+i].setTouchEnabled(false);
                }
            }
            //点击装备可去的文字
            this.bootTextDes.setString(STRINGCFG[100157].string);   //100157	点击配饰可直接去强化
            //强化或者精炼
            this.strenLevDes.setString(STRINGCFG[100174].string);   //100174	强化进度
            if(nowData == null){  //当前为空
                //强化大师现在级别
                this.strenLevMaster.setString(STRINGCFG[100159].string);   //100159	未强化
                //现在的属性说明
                var strText = StringFormat(STRINGCFG[100171].string,per);  //100171	全身配饰每强化$1级
                this.bootNowM1.setString(strText);
                this.bootNowM2.setString(STRINGCFG[100173].string);  //100173	属性得到一次提升
                this.bootNowM3.setVisible(false);
            }else{
                //强化大师现在级别
                var strText = StringFormat(STRINGCFG[100163].string,Math.floor(minLv/per));  //100163	配饰强化大师$1级
                this.strenLevMaster.setString(strText);
                //现在的属性说明
                this.bootNowM1.setString(strText);
                strText = StringFormat(STRINGCFG[100167].string,Math.floor(minLv/per)*per);  //100167	全身配饰强化$1级
                this.bootNowM2.setString("("+strText+")");
                this.bootNowM3.setVisible(true);
                this.bootNowM3.setString(this.getAttrDes(nowData.attr));
            }
            if(nextData == null){  //下一级为空
                //下一级的属性说明
                this.bootNextM1.setString("MAX");
                this.bootNextM2.setString("MAX");
                this.bootNextM3.setVisible(false);
            }else{
                //下一级的属性说明
                var strText = StringFormat(STRINGCFG[100163].string,Math.floor(minLv/per)+1);  //100163	配饰强化大师$1级
                this.bootNextM1.setString(strText);
                strText = StringFormat(STRINGCFG[100167].string,Math.floor(minLv/per)*per+per);  //100167	全身配饰强化$1级
                this.bootNextM2.setString("("+strText+")");
                this.bootNextM3.setVisible(true);
                this.bootNextM3.setString(this.getAttrDes(nextData.attr));
            }
        }else if(this.eType == 4){  //配饰精炼
            var per = 2;
            //装备的大背景
            this.Image_equ3.setVisible(false);
            this.Image_equ4.setVisible(false);
            //计算最低的精炼等级
            var minLv = MAXACCREFINE;
            for(var i =1;i<=2;i++){
                if(eqArray[i-1]!=0){
                    var eqInfo = GLOBALDATA.depot[eqArray[i-1]];
                    if(eqInfo.r < minLv){
                        minLv = eqInfo.r;
                    }
                }else{
                    minLv = 0;
                    break;
                }
            }
            //获取当前对应的强化大师数据
            var nowData = this.getSomeMinData(2,2,minLv,MAXACCREFINE);    //当前级别强化大师数据
            var nextData = this.getSomeMinData(2,2,minLv+per,MAXACCREFINE);  //下一级别强化大师数据
            //设置四个装备
            for(var i = 1;i<=2;i++){
                if(eqArray[i-1]!=0){
                    var eqInfo = GLOBALDATA.depot[eqArray[i-1]];
                    var itemCfg = Helper.findItemId(eqInfo.p);
                    this["bootBg"+i].setVisible(true);  //装备的背景
                    this["bootText" + i].setVisible(true);  //装备名称
                    this["bootBarBg" + i].setVisible(true);  //装备进度条的背景
                    this["boot_no"+i].setVisible(false);  //无装备的文字
                    //装备图片
                    this["bootBg"+i].removeAllChildren(true);
                    var equipImage = new EquipItem(eqArray[i-1]);
                    var size = this["bootBg"+i].getContentSize();
                    equipImage.setPosition(cc.p(size.width/2, size.height/2));
                    this["bootBg"+i].addChild(equipImage, 2);
                    //装备名称
                    this["bootText"+i].setString(itemCfg.itemname);
                    Helper.setNamecolorByQuality(this["bootText"+i],itemCfg.quality);
                    if(nextData == null){  //下一级为空
                        //进度文字
                        this["bootTextBar"+i].setString(eqInfo.r+"/MAX");
                        //装备进度条
                        this["LoadingBar"+i].setPercent(100);
                    }else{
                        //进度文字
                        this["bootTextBar"+i].setString(eqInfo.r+"/"+nextData.goal);
                        //装备进度条
                        var percent = Math.floor(eqInfo.r/nextData.goal*100);
                        if(percent > 100){
                            percent = 100;
                        }
                        this["LoadingBar"+i].setPercent(percent);
                    }
                    //装备大背景的点击
                    this["Image_equ"+i].setTouchEnabled(true);
                    this["Image_equ"+i].setTag(eqArray[i-1]);
                }else{
                    this["bootBg"+i].setVisible(false);  //装备的背景
                    this["bootText" + i].setVisible(false);  //装备名称
                    this["bootBarBg" + i].setVisible(false);  //装备进度条的背景
                    this["boot_no"+i].setVisible(true);  //无装备的文字
                    //装备大背景的点击
                    this["Image_equ"+i].setTouchEnabled(false);
                }
            }
            //点击装备可去的文字
            this.bootTextDes.setString(STRINGCFG[100158].string);   //100158	点击配饰可直接去精炼
            //强化或者精炼
            this.strenLevDes.setString(STRINGCFG[100175].string);   //100175	精炼进度
            if(nowData == null){  //当前为空
                //强化大师现在级别
                this.strenLevMaster.setString(STRINGCFG[100160].string);   //100160	未精炼
                //现在的属性说明
                var strText = StringFormat(STRINGCFG[100172].string,per);  //100172	全身配饰每精炼$1级
                this.bootNowM1.setString(strText);
                this.bootNowM2.setString(STRINGCFG[100173].string);  //100173	属性得到一次提升
                this.bootNowM3.setVisible(false);
            }else{
                //强化大师现在级别
                var strText = StringFormat(STRINGCFG[100164].string,Math.floor(minLv/per));  //100164	配饰精炼大师$1级
                this.strenLevMaster.setString(strText);
                //现在的属性说明
                this.bootNowM1.setString(strText);
                strText = StringFormat(STRINGCFG[100168].string,Math.floor(minLv/per)*per);  //100168	全身配饰精炼$1级
                this.bootNowM2.setString("("+strText+")");
                this.bootNowM3.setVisible(true);
                this.bootNowM3.setString(this.getAttrDes(nowData.attr));
            }
            if(nextData == null){  //下一级为空
                //下一级的属性说明
                this.bootNextM1.setString("MAX");
                this.bootNextM2.setString("MAX");
                this.bootNextM3.setVisible(false);
            }else{
                //下一级的属性说明
                var strText = StringFormat(STRINGCFG[100164].string,Math.floor(minLv/per)+1);  //100164	配饰精炼大师$1级
                this.bootNextM1.setString(strText);
                strText = StringFormat(STRINGCFG[100168].string,Math.floor(minLv/per)*per+per);  //100168	全身配饰精炼$1级
                this.bootNextM2.setString("("+strText+")");
                this.bootNextM3.setVisible(true);
                this.bootNextM3.setString(this.getAttrDes(nextData.attr));
            }
        }
    },
    //获取当前对应的强化大师数据
    getSomeMinData:function(mtype,ftype,nowlv,maxlv){
        var data = null;
        if(nowlv > maxlv){
            return null;
        }else{
            for(var key in EQUIPDASHICFG){
                var dashi = EQUIPDASHICFG[key];
                if(dashi.type1 == mtype && dashi.type2 == ftype){
                    if(nowlv < dashi.goal){
                        break;
                    }
                    data = dashi;
                }
            }
        }
        return data;
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
    //四个装备大背景的点击事件
    clickEquEvent:function(sender, type){
        if(ccui.Widget.TOUCH_ENDED==type) {
            var tag = sender.getTag();
            if(this.eType == 1){  //装备强化
                var _equipStrenLayer = new equipStrenLayer(tag);
                this.addChild(_equipStrenLayer);
            }else if(this.eType == 2){  //装备精炼
                var _equipRefineLayer = new equipRefineLayer(tag);
                this.addChild(_equipRefineLayer);
            }else if(this.eType == 3){  //配饰强化
                var _accStrenLayer = new accStrenLayer(tag);
                this.addChild(_accStrenLayer);
            }else if(this.eType == 4){  //配饰精炼
                var _accRefineLayer = new accRefineLayer(tag);
                this.addChild(_accRefineLayer);
            }
        }
    },
    //四个标签按钮的事件
    changeBtnEvent:function(sender, type){
        if(ccui.Widget.TOUCH_ENDED==type) {
            var tag = sender.getTag();
            this.eType = tag;
            for(var i=1;i<=4;i++){
                if(i == tag){
                    this["changeBtn"+i].setBrightStyle(ccui.Widget.BRIGHT_STYLE_HIGH_LIGHT);
                    this["changeBtn"+i].setTouchEnabled(false);
                }else{
                    this["changeBtn"+i].setBrightStyle(ccui.Widget.BRIGHT_STYLE_NORMAL);
                    this["changeBtn"+i].setTouchEnabled(true);
                }
            }
            this.updateInfo();
        }
    },
    //返回按钮
    backEvent:function(sender, type){
        if(ccui.Widget.TOUCH_ENDED==type) {
            this.removeFromParent(true);
        }
    },
    onExit:function () {
        this._super();
        cc.eventManager.removeListener(this.evnUpdateUI);
    }
});