
/**
 ** @Author:pandayu
 ** @Version:1.0
 ** @DateTime:2018-09-09
 ** @Project:pandaCard CardGame
 ** @Contact: QQ:815099602
 **/
 /**
 */
var newGuideModel = {
    ver:1,  //新手指引版本号
    //是否正在进行新手指引 返回值 为true的时候表示正在进行新手指引
    isRunNewGuide:function(){
        // if(this.ver == 1 && this.getGuideId() != 54){
        //     return true;
        // }
        //版本号等于服务器的版本号 引导的id不为最终的引导id 等级小于10
        if(this.ver == GLOBALDATA.guid.v && this.getGuideId() != 64
        && GLOBALDATA.base.lev < 10){
            return true;
        }
        return false;
    },
    //添加新手引导界面  parentNode父节点 pnum层数 data传递的参数
    addNewGuideLayer:function(parentNode,pnum,data){
        var addEvent = function () {
            var evn = new cc.EventCustom('show.newguide');
            evn.setUserData(data);
            cc.eventManager.dispatchEvent(evn);
        };
        var _newGuideLayer = new newGuideLayer(addEvent);
        parentNode.addChild(_newGuideLayer,pnum);
    },
    //获取新手引导保存的数据
    getGuideId:function () {
        return GLOBALDATA.guid.nid || 1;
        // return cc.sys.localStorage.getItem("guideid"+GLOBALDATA.id) || 1;
    },
    //保存新手引导的引导数据
    setGuideId:function(id){
        GLOBALDATA.guid.nid = id;
        this.sendGuidId(id);
        // cc.sys.localStorage.setItem("guideid"+GLOBALDATA.id,id);
    },
    //发送网络消息
    sendGuidId:function (id) {
        Network.getInstance().send({
            task:"guid.new",
            nid:id
        });
    },
    //新手引导界面的状态  true表示正在运行 false 表示没有运行
    setRunState:function(isRun){
        GLOBALDATA.guid.isRun = isRun;
    },
    //获取新手引导界面的状态
    getRunState:function () {
        return (GLOBALDATA.guid.isRun == true)?true:false;
    },
};