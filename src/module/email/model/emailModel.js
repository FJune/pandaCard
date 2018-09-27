
/**
 ** @Author:pandayu
 ** @Version:1.0
 ** @DateTime:2018-09-09
 ** @Project:pandaCard CardGame
 ** @Contact: QQ:815099602
 **/
 /*
by xiongrui 2016.1107
* */

var emailModel = {
    //阅读邮件
    readEmail:function (mailid) {
        Network.getInstance().send({
            task:"mail.read",
            id:mailid
        });
    },
    //领取邮件附件
    getThingByEmail:function (mailid) {
        Network.getInstance().send({
            task:"mail.receive",
            id:mailid
        });
    },
    //删除邮件
    deleteEmail:function (mailid) {
        Network.getInstance().send({
            task:"mail.remove",
            id:mailid
        });
    },
    //测试   发送邮件
    sendEmail:function (recid,title,content,profit) {
        Network.getInstance().send({
            task:"mail.send",
            recid:recid,
            title:title,
            content:content,
            profit:profit
        });
    }
}