
var CHANNEL_ACCESS_TOKEN = PropertiesService.getScriptProperties().getProperty('auto_comfort_boyfriend_channel_access_token');

var SPREADSHEET_ID = PropertiesService.getScriptProperties().getProperty('auto_comfort_boyfriend_sheet_id');

var SHEET_NAME = 'sheet1'; 
var LOG_SHEET_NAME = 'message_logs';


function doPost(e) {
  try {
    var msg = JSON.parse(e.postData.contents);
    var replyToken = msg.events[0].replyToken;
    var userMessage = msg.events[0].message.text;
    var userId = msg.events[0].source.userId;
    
    var commandList = getCommandsFromSheet();

    var replyMessage = "嗨寶貝這句我還沒學會 可以跟我講哦～ 愛你的崴";
    logToSheet(userId, userMessage);

    // 2. 特殊指令：Help
    if (userMessage.toLowerCase() === "help" || userMessage === "說明" || userMessage === "指令") {
      replyMessage = generateHelpMessage(commandList);
    } 
    else {
      // 3. 一般指令匹配
      for (var i = 0; i < commandList.length; i++) {
        var cmd = commandList[i];
        
        if (userMessage.includes(cmd.keyword)) {
          // 判斷是否有多行回應 (陣列)
          if (Array.isArray(cmd.reply)) {
            replyMessage = cmd.reply[Math.floor(Math.random() * cmd.reply.length)];
          } else {
            replyMessage = cmd.reply;
          }
          break; 
        }
      }
    }

    if (replyMessage === "") {
      return ContentService.createTextOutput(JSON.stringify({status: 'success'}));
    }

    sendLineMessage(replyToken, replyMessage);
    return ContentService.createTextOutput(JSON.stringify({status: 'success'})).setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({status: 'error', message: err.message})).setMimeType(ContentService.MimeType.JSON);
  }
}
function doGet(e) {
  var commandList = getCommandsFromSheet();
  replyMessage = generateHelpMessage(commandList);
  return ContentService.createTextOutput(replyMessage)
    .setMimeType(ContentService.MimeType.TEXT);
}

function logToSheet(userId, message) {
  try {
    var sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName(LOG_SHEET_NAME);
    if (!sheet) return;

    sheet.appendRow([new Date(), userId, message]);
    
  } catch (e) {
    console.log("Log error: " + e.message); 
  }
}

function getCommandsFromSheet() {

  var sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName(SHEET_NAME);
  
  var lastRow = sheet.getLastRow();
  if (lastRow <= 1) return []; 

  var data = sheet.getRange(2, 1, lastRow - 1, 3).getValues();
  
  var commands = [];
  

  for (var i = 0; i < data.length; i++) {
    var row = data[i];
    var keyword = row[0];
    var rawReply = row[1];    
    
    if (!keyword) continue;

    var replyData;
    if (rawReply.toString().indexOf('\n') > -1) {
      replyData = rawReply.toString().split('\n');
    } else {
      replyData = rawReply;
    }

    commands.push({
      keyword: keyword,
      reply: replyData,
    });
  }
  
  return commands;
}

function generateHelpMessage(commandList) {
  var helpText = "寶貝，我現在學會了這些新招式：\n\n";
  
  for (var i = 0; i < commandList.length; i++) {
    helpText += "✨ " + commandList[i].keyword + "\n";
  }
  
  helpText += "\n(我是連上雲端大腦的機器人喔！)";
  return helpText;
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
