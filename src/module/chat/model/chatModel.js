
/**
 ** @Author:pandayu
 ** @Version:1.0
 ** @DateTime:2018-09-09
 ** @Project:pandaCard CardGame
 ** @Contact: QQ:815099602
 **/
 var chatModel = {
    worldChatData:new Array(),
    //存入世界聊天内容
    saveWorldChat:function (chatdata) {
        if(this.worldChatData.length>=30){
            this.worldChatData.shift();
        }
        this.worldChatData.push(chatdata);
    },
    getWorldChatData:function () {
        return this.worldChatData;
    },
    //发送聊天消息
    sendChatMessage:function (content,channel) {
        Network.getInstance().send({
            task:"chat",
            content:content,
            channel:channel
        });
    }
}