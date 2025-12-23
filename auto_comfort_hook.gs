// 填入剛剛在 LINE Developers 取得的資訊
var CHANNEL_ACCESS_TOKEN = PropertiesService.getScriptProperties().getProperty('auto_comfort_boyfriend_channel_access_token')

// 用來測試 webhook 是否正常運作 (瀏覽器測試用)
function doGet() {
  return ContentService.createTextOutput('LINE Bot webhook is running!');
}

function doPost(e) {
  try {
    // 解析 LINE 傳來的訊息
    var msg = JSON.parse(e.postData.contents);
    
    // 取出 Reply Token (回覆用的票據)
    var replyToken = msg.events[0].replyToken;
    
    // 取出使用者傳來的文字
    var userMessage = msg.events[0].message.text;
    
    // 預設回覆訊息 (這裡可以設定你的邏輯)
    var replyMessage = "寶貝，我還沒學會這句話的意思，但我正在聽！";

    // --- 特殊關鍵字範例 (你可以之後自己擴充) ---
    if (userMessage.includes("想你")) {
      // 只要句子裡有 "想你" (例如：我很想你、想你了) 都會觸發
      replyMessage = "我也超想你～～ 我的寶貝";
      
    } else if (userMessage.includes("需要安慰")) {
      // 隨機抽選邏輯
      var choices = [
        "我的寶貝~~ 摸摸喔 沒事的喔 摸摸你的頭 把你抱在我的懷裡", 
        "誰讓你生氣了 我的寶貝 看我揍飛他", 
      ];
      replyMessage = choices[Math.floor(Math.random() * choices.length)];
      
    }
    // ----------------------------------------

    // 發送回覆給 LINE
    sendLineMessage(replyToken, replyMessage);
    
    return ContentService.createTextOutput(JSON.stringify({status: 'success'})).setMimeType(ContentService.MimeType.JSON);
    
  } catch (err) {
    // 錯誤處理
    return ContentService.createTextOutput(JSON.stringify({status: 'error', message: err.message})).setMimeType(ContentService.MimeType.JSON);
  }
}

function sendLineMessage(replyToken, text) {
  var url = 'https://api.line.me/v2/bot/message/reply';
  var payload = {
    'replyToken': replyToken,
    'messages': [{
        'type': 'text',
        'text': text
    }]
  };
  
  var options = {
    'method': 'post',
    'headers': {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + CHANNEL_ACCESS_TOKEN
    },
    'payload': JSON.stringify(payload)
  };
  
  UrlFetchApp.fetch(url, options);
}
