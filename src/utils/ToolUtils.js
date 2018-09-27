
/**
 ** @Author:pandayu
 ** @Version:1.0
 ** @DateTime:2018-09-09
 ** @Project:pandaCard CardGame
 ** @Contact: QQ:815099602
 **/
 /**
 */

var Toast = (function () {
    var instance = null; //单例实例
    function getToast(){
        var ToastInstance = {
            IntervalTime:0,
            ItemArray:[],
            cacheArray:[],
            addNode:function(item) {
                var self = this;
                var NowScene = cc.director.getRunningScene();
                if(NowScene != this.scene){
                    this.cacheArray = [];
                    this.isCanNew = undefined;
                }
                item.retain();
                this.cacheArray.push(item);  //先暂时缓存
                if(this.isCanNew === undefined){
                    this.isCanNew = false;
                    this.scene = cc.director.getRunningScene();
                    this.ToastLayout = new ccui.Layout();
                    this.scene.addChild(this.ToastLayout,9999);

                    this.ToastLayout.schedule(function(dt){
                        self.IntervalTime = self.IntervalTime + dt;
                        //准备移动
                        if(self.IntervalTime > 1){
                            self.IntervalTime = 0;

                            self.ToastLayout.runAction(cc.sequence(cc.callFunc(function() {
                                for(var i = 0;i<self.ItemArray.length;i++){
                                    var fadeMove = cc.spawn(
                                        cc.moveBy(0.5,cc.p(0,150)),
                                        cc.fadeOut(0.5)
                                    );
                                    self.ItemArray[i].runAction(cc.sequence(fadeMove,cc.removeSelf(true)));
                                }
                                self.ItemArray = [];
                            })));
                        }
                        //准备添加新的
                        var Item = self.cacheArray[0];
                        if(Item != null){
                            self.ToastLayout.addChild(Item);
                            Item.release();
                            self.ItemArray.push(Item);
                            self.cacheArray.splice(0,1);
                            var tHeight = 0;
                            for(var i = self.ItemArray.length -1;i>=0;i--){
                                self.ItemArray[i].setPosition(cc.winSize.width/2,cc.winSize.height/2+tHeight);
                                tHeight = tHeight + self.ItemArray[i].getContentSize().height;
                            }
                        }
                        //删除ToastLayout
                        if(self.ToastLayout.getChildrenCount() == 0){
                            self.ToastLayout.removeFromParent(true);
                            self.ToastLayout = undefined;
                            self.isCanNew = undefined;
                        }
                    },0.1);
                }
                self.IntervalTime = 0;
            },
        };
        return ToastInstance;
    }
    //返回对象
    return {
        getInstance: function() {
            if (instance === null) {
                instance = getToast();
            }
            return instance;
        }
    };
})();

var ShowTipsTool = {
    //显示错误的tips  参数：id为STRINGCFG中的id
    ErrorTipsFromStringById:function (id) {
        var refinePrompt;
            if(STRINGCFG[id] != null){
                refinePrompt = new cc.LabelTTF(STRINGCFG[id].string, "Arial", 30);
                refinePrompt.setHorizontalAlignment(cc.TEXT_ALIGNMENT_CENTER);
                refinePrompt.setColor(cc.color.RED);
            }else{
                refinePrompt = new cc.LabelTTF("undefined Network status "+id, "Arial", 30);
                refinePrompt.setHorizontalAlignment(cc.TEXT_ALIGNMENT_CENTER);
                refinePrompt.setColor(cc.color.RED);
        }
        Toast.getInstance().addNode(refinePrompt);
    },
    //显示tips
    TipsFromText:function (text,color,fontsize) {
        var refinePrompt = new cc.LabelTTF(text, "Arial", fontsize);
        refinePrompt.setHorizontalAlignment(cc.TEXT_ALIGNMENT_CENTER);
        refinePrompt.setColor(color);
        Toast.getInstance().addNode(refinePrompt);
    },
};

var EquipItem = cc.Layer.extend({
    eqId:null,
    eqInfo:null,
    ctor:function (eqId,eqInfo) {  //eqInfo默认不传
        this._super();
        this.eqId = eqId;
        this.eqInfo = eqInfo;
        this.setContentSize(94,94);
        this.ignoreAnchorPointForPosition(false);
        this.setAnchorPoint(0.5,0.5);
        this.initUI();
    },
    initUI:function () {
        var uiEquip = ccsTool.load(res.uiEquipItem,["eqFrame","eqImg","eqRefine","eqLevel","eqJieji","FileNode_DZ"]);
        this.addChild(uiEquip.node);

        var eqInfo = GLOBALDATA.depot[this.eqId] || this.eqInfo;
        var itemCfg = Helper.findItemId(eqInfo.p);
        //装备品质边框
        Helper.LoadFrameImageWithPlist(uiEquip.wgt.eqFrame,itemCfg.quality);
        //装备图片
        Helper.LoadIcoImageWithPlist(uiEquip.wgt.eqImg,itemCfg);
        //装备等级
        if(eqInfo.s>1){
            uiEquip.wgt.eqLevel.setString("+"+eqInfo.s);
        } else {
            uiEquip.wgt.eqLevel.setVisible(false);
        }
        //装备精炼
        if(eqInfo.r>=1){
            uiEquip.wgt.eqRefine.setString(eqInfo.r);
        } else {
            uiEquip.wgt.eqRefine.setVisible(false);
        }
        //装备锻造
        if(eqInfo.d >= 1){
            var strText = StringFormat(STRINGCFG[100127].string,eqInfo.d);  //100127	$1阶
            uiEquip.wgt.eqJieji.setString(strText);
            //锻造特效
            var act = ccs.load(res.effEquDZItem_json);
            uiEquip.wgt.FileNode_DZ.runAction(act.action);
            act.action.play("effDzAction", true);
            uiEquip.wgt.FileNode_DZ.setVisible(true);
        }else{
            uiEquip.wgt.eqJieji.setVisible(false);
            uiEquip.wgt.FileNode_DZ.setVisible(false);
        }
    }
});

//对象深度复制，创建一个新的对象
//使用方式  var temp = objClone(soldier);
/*var objClone= function(source) {
    var result={};
    for (var key in source) {
        result[key] = typeof source[key]==='object'? objClone(source[key]): source[key];
    }
    return result;
};*/
function objClone(obj) {
    // Handle the 3 simple types, and null or undefined
    if (null == obj || "object" != typeof obj) return obj;

    // Handle Date
    if (obj instanceof Date) {
        var copy = new Date();
        copy.setTime(obj.getTime());
        return copy;
    }

    // Handle Array
    if (obj instanceof Array) {
        var copy = [];
        for(var i = 0,len = obj.length;i < len;++i){
            copy[i] = objClone(obj[i]);
        }
        return copy;
    }

    // Handle Object
    if (obj instanceof Object) {
        var copy = {};
        for (var attr in obj) {
            if (obj.hasOwnProperty(attr)) copy[attr] = objClone(obj[attr]);
        }
        return copy;
    }
};
//获取控件
var seekNodeByName = function(root, name) {
    if (!root)
        return null;
    if (root.getName() === name || root.getUserData() === name)
        return root;
    var arrayRootChildren = root.getChildren();
    var length = arrayRootChildren.length;
    for (var i = 0; i < length; i++) {
        var child = arrayRootChildren[i];
        var res = seekNodeByName(child, name);
        if (res !== null)
            return res;
    }
    return null;
};
//执行控件的点击等事件
var dealNodeTouchEvent = function(node){
    if(node != null){
        node._releaseUpEvent();
    }

/*    var NodeType = node.getDescription();
    if(NodeType == "CheckBox"){
        if(node.isSelected()){

        }else{

        }
    }else{
        if (node._touchEventCallback)
            node._touchEventCallback(node, ccui.Widget.TOUCH_ENDED);
        if (node._touchEventListener && node._touchEventSelector)
            node._touchEventSelector.call(node._touchEventListener, node, ccui.Widget.TOUCH_ENDED);
        if (node._clickEventListener)
            node._clickEventListener(node);
    }*/
};
//是否正在进行新手指引 返回值 为true的时候表示正在进行新手指引
var isRunNewGuide = function(){
    return true;
};
//随机生成min-max之间的整数
var randNum= function(min,max) {
    var rand = Math.random();
    var dis = 1/(max-min+1);
    var result = 1;
    for (var i = 1;i<=(max-min+1);i++){
        if(rand<dis*i){
            result = min+i-1;
            break;
        }
    }
    return result;
};

//判断对象是否为空  对象为空返回true
var isEmptyObject = function(obj) {
    for (var key in obj) {
        return false;
    }
    return true;
};

/*
 格式化字符串  text为原有的字符串(需要替换的部分使用$1) args为替换字符
 当替换一个$1时 args可以为字符串也可以为字符串数组
 当替换多个$1时 args为字符串数组
 例子：
 var ts = "ghj$1sfghj$1";
 var desc1 = StringFormat(ts,"sds"); //ghjsdssfghj$1
 var desc2 = StringFormat(ts,["sds"]); //ghjsdssfghj$1
 var desc3 = StringFormat(ts,["sds","sdw"]);  //ghjsdssfghjsdw
 */
var StringFormat = function (text,args){
    String.prototype.customFormat = function (args) {
        var result = this;
        if (arguments.length > 0) {
            if(typeof(args) !== "object"){
                result = result.replace('$1', args);
            }else{
                for (var key in args) {
                    if(args[key]!=undefined){
                        result = result.replace('$1', args[key]);
                    }
                }
            }
        }
        return result;
    };
    return text.customFormat(args);
};
var StringColorFormat = function (pNode,text) {
    var richText = ccui.RichText.create();

    var colorFormat = function (pNode,richText,text){
        if (arguments.length > 0){
            var str_array = text.split("#");
            if(str_array.length>1){
                for(var i=0;i<str_array.length;i++){
                    if((i/2)!=0){
                        var re = new ccui.RichElementText(4, cc.color.GREEN, 255, str_array[i], "Normal", 18);
                        richText.insertElement(re,i);
                    }else{
                        var re = new ccui.RichElementText(1, cc.color.BLACK, 255, str_array[i], "Normal", 18);
                        richText.insertElement(re,i);
                    }
                }
            }

            var  str_array1 = text.split("*");
            if(str_array1.length>1){
                for(var i=0;i<str_array1.length;i++){
                    if((i/2)!=0){
                        var re = new ccui.RichElementText(2, cc.color.YELLOW, 255, str_array1[i], "Normal", 18);
                        richText.insertElement(re,i);
                    }else{
                        var re = new ccui.RichElementText(1, cc.color.BLACK, 255, str_array1[i], "Normal", 18);
                        richText.insertElement(re,i);
                    }
                }
            }

            var str_array2 = text.split("%");
            if(str_array2.length>1){
                for(var i=0;i<str_array2.length;i++){
                    if((i/2)!=0){
                        var re = new ccui.RichElementText(2, cc.color(118, 0, 255), 255, str_array2[i], "Normal", 18);
                        richText.insertElement(re,i);
                    }else{
                        var re = new ccui.RichElementText(1, cc.color.BLACK, 255, str_array2[i], "Normal", 18);
                        richText.insertElement(re,i);
                    }
                }
            }
        }
        richText.x = 0;
        richText.y = 0;
        richText.ignoreContentAdaptWithSize(false);
        richText.width = pNode.getContentSize().width;
        richText.height = pNode.getContentSize().height;
        richText.setAnchorPoint(cc.p(0.5, 0.5));
        richText.setPosition(cc.p(pNode.getContentSize().width / 2+20, pNode.getContentSize().height / 2-20));
        pNode.addChild(richText);
    };
    colorFormat(pNode,richText,text);
};

//使用ccsTool.load代替ccs.load,可以省去查找对应节点对象的代码
//例1--在保证节点结构不发生变化时，可使用这种方式
//var obj = ccsTool.load("res/xxx/jjj.json",['btnLogin']);
//使用obj.wgt.btnLogin获取btnLogin对象
var ccsTool = {};
ccsTool.seek = function(root,valueptr){
    var arrayRootChildren = root.getChildren();
    var length = arrayRootChildren.length;
    if(length == 0)return;
    for (var i = 0; i < length; i++) {
        if(valueptr.length == 0)return;
        var child = arrayRootChildren[i];
        var name = child.getName();
        var index = valueptr.indexOf(name);
        if(index>=0){
            this.obj.wgt[name] = child;
            valueptr.splice(index,1);
        }
        this.seek(child,valueptr);
    }
};
ccsTool.load = function(path,valueptr){
    this.obj = ccs.load(path);
    if(!this.obj.node)return null;
    this.obj.wgt = {};
    this.seek(this.obj.node,valueptr);
    return this.obj;
};
ccsTool.seekWidget = function(node,valueptr){
    this.obj = node;
    if(!this.obj)return null;
    this.obj.wgt = {};
    this.seek(this.obj,valueptr);
    return this.obj;
};

//英雄默认的一些信息
var HeroDefault = {
    //英雄的原地动作  heroid:英雄的id ParentNode:父节点 posx:x坐标 posy:y坐标
    // mtype:模型的缩放类型 1一般展示  2抽卡时 3战斗界面
    //tye: 1 英雄 2 怪物 3 指挥官
    runAdle:function(heroid,ParentNode,posx,posy,mtype,tye) {
        var roleAttr = null;
        var model = null;
        if(tye == 1){
            roleAttr = Helper.findHeroById(heroid);
            model = roleAttr.armymodel;
        }
        else if(tye == 2){
            roleAttr = Helper.findMonsterById(heroid);
            model = roleAttr.mastermodel;
        }else if(tye == 3){
            roleAttr = Helper.findCommanderById(heroid);
            model = roleAttr.commandermodel;
        }
        var scale = 1;
        if(mtype == 1 && tye==1) {  //一般展示
            scale = roleAttr.modelsize;
        }else if(mtype == 1 && tye==3){  //指挥官模型一般展示 对战界面
            scale = roleAttr.modelsize;
        }else if(mtype == 2 && tye==1){  //抽卡时
            scale = roleAttr.cardsize;
        }else if(mtype == 3 && tye==1){  //战斗界面
            scale = roleAttr.warsize;
        }else if(mtype==1&&tye==2){ //掠夺界面展示
            scale = roleAttr.modelsize;
        }else if(tye==3){
            scale = 0.7;
        }
        var offx = roleAttr.modelpos[0] || 0;
        var offy = roleAttr.modelpos[1] || 0;
        return this.runAdleByModel(model,ParentNode,posx,posy,offx,offy,scale);
    },
    //运行的模型  model:英雄的模型 ParentNode:父节点 posx:x坐标 posy:y坐标
    //offx 偏移x scale 缩放比例
    runAdleByModel:function(model,ParentNode,posx,posy,offx,offy,scale){
        var heroNode = new cc.Sprite();
        heroNode.setVisible(false);
        ParentNode.addChild(heroNode,10);
        cc.loader.load([res[model+'_plist'],res[model+'_png']],function (result, count, loadedCount) {

        }, function () {
            cc.spriteFrameCache.addSpriteFrames(res[model+'_plist']);
            var animFrames = [];
            var str = "";
            for (var i = 0; i < 20; i++) {
                str = model+'-idle01_'+i+'.png';
                var frame = cc.spriteFrameCache.getSpriteFrame(str);
                if (frame){
                    animFrames.push(frame);
                }else {
                    break;
                }
            }
            var animation = new cc.Animation(animFrames, 0.1);
            heroNode.setScale(scale);
            heroNode.setAnchorPoint(cc.p(0,0));
            heroNode.setPosition(cc.p(posx-(offx*scale),posy-(offy*scale)));
            heroNode.runAction(cc.animate(animation).repeatForever());
            heroNode.setVisible(true);
        });

        return heroNode;
    },
    //士兵兵种类型的图片  NodeImage:节点  type:类型
    setHeroTypeImage:function(NodeImage,type){
        var icon = StringFormat("common/i/i_039_$1.png", type);
        if(cc.spriteFrameCache.getSpriteFrame(icon)){
            NodeImage.loadTexture(icon, ccui.Widget.PLIST_TEXTURE);
        }else{
            NodeImage.loadTexture("common/i/i_039_1.png", ccui.Widget.PLIST_TEXTURE);
        }
    }
};

//初始物品的预览
var showInitialItemPreview = function(parentNode,id){
    var itemCfg = Helper.findItemId(id);
    if(itemCfg.maintype == 2){  //士兵
        var userData = {};
        userData.isInit = true;
        userData.l = 1;  //等级
        userData.q = 0;  //进阶等级
        userData.m = 0;  //是否已经突破
        userData.w = 0;  //觉醒等级
        userData.sq = 0;  //改造等级
        var armyAttributeLayer = new armyAttriLayer(id,2,userData);
        parentNode.addChild(armyAttributeLayer,3);
    }else if(itemCfg.maintype == 4){  //装备
        var userData = {};
        userData.p = id;  //原型
        userData.s = 1;  //强化等级
        userData.r = 0;  //精炼等级
        userData.d = 0;  //锻造等级
        var _equipDetailsLayer = new equipDetailsLayer(null,-1,userData);
        parentNode.addChild(_equipDetailsLayer,3);
    }else if(itemCfg.maintype == 5){    //配饰
        var userData = {};
        userData.p = id;  //原型
        userData.s = 1;  //强化等级
        userData.r = 0;  //精炼等级
        userData.d = 0;  //锻造等级
        var _accDetailsLayer = new accDetailsLayer(null,-1,userData);
        parentNode.addChild(_accDetailsLayer,3);
    }else{
        var _itemSeeLayer = new itemSeeLayer(id,0);
        parentNode.addChild(_itemSeeLayer, 2);
    }
};

//把秒变成00:30的格式
//time 秒数
function formatTime(time) {
    var minite = Math.floor(time/60)>=10?Math.floor(time/60):'0'+(Math.floor(time/60));
    var second = (time%60)>=10?(time%60):'0'+(time%60);
    return minite+':'+second;
}
//释放资源，情况缓存
var gcRes = function(resources){
    if(resources)
    {
        for(var i in resources)
        {
            var resItem = resources[i];
            if(resItem.lastIndexOf('.plist') > 0)
            {
                cc.spriteFrameCache.removeSpriteFramesFromFile(resItem);
            }
            else if(resItem.lastIndexOf('.png') > 0){
                cc.textureCache.removeTextureForKey(resItem);
            }
            else if(resItem.lastIndexOf('.ExportJson') > 0||resItem.lastIndexOf('.json') > 0){
                cc.animationCache.removeAnimation(resItem);
                // cc.textureCache.removeAllTextures();
            }
            if(!cc.sys.isNative){
                resItem = cc.loader.getUrl(
                    (cc.loader.getBasePath&& cc.loader.getBasePath()) ||cc.loader.resPath, resItem);
            }
            //cc.loader.release(resItem);
        }
    }
};


