
/**
 ** @Author:pandayu
 ** @Version:1.0
 ** @DateTime:2018-09-09
 ** @Project:pandaCard CardGame
 ** @Contact: QQ:815099602
 **/
 var friendModel = {
    //添加好友
    addFriend:function (idorname) {
        Network.getInstance().send({
            task:"friend.append",
            id:idorname
        });
    },

    //删除好友
    deleteFriend:function (id) {
        Network.getInstance().send({
            task:"friend.remove",
            id:id
        });
    },

    //赠送砖石
    giveDiamond:function (id,type) {
        Network.getInstance().send({
            task:"friend.give",
            id:id,
            typ:type   //1 单个  2 全部可赠送项
        });
    },

    //领取砖石
    getDiamond:function (id,type) {
        Network.getInstance().send({
            task:"friend.receive",
            id:id,
            typ:type   //1 单个  2 全部可领取项
        });
    },

    //申请好友
    applyFriend:function (id,type,opt) {
        Network.getInstance().send({
            task:"friend.apply",
            id:id,
            typ:type,   //1 单个  2 全部
            opt:opt    //1同意 2拒绝
        });
    },

    //黑名单
    blackListAbout:function (id,type,opt) {
        Network.getInstance().send({
            task:"friend.blacklist",
            id:id,
            typ:type,   //1 单个  2 全部
            opt:opt    //1加入 2移除
        });
    },
    //推荐好友
    getVisitFriend:function () {
        Network.getInstance().send({
            task:"friend.serch"
        });
    }
}