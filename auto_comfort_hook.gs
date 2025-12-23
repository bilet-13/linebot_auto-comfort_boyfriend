
var CHANNEL_ACCESS_TOKEN = PropertiesService.getScriptProperties().getProperty('auto_comfort_boyfriend_channel_access_token');

var SPREADSHEET_ID = PropertiesService.getScriptProperties().getProperty('auto_comfort_boyfriend_sheet_id');

var SHEET_NAME = 'sheet1'; 


function doPost(e) {
  try {
    var msg = JSON.parse(e.postData.contents);
    var replyToken = msg.events[0].replyToken;
    var userMessage = msg.events[0].message.text;
    
    var commandList = getCommandsFromSheet();

    var replyMessage = "";

    if (userMessage.toLowerCase() === "help" || userMessage === "說明" || userMessage === "指令") {
      replyMessage = generateHelpMessage(commandList);
    } 
    else {
      for (var i = 0; i < commandList.length; i++) {
        var cmd = commandList[i];
        
        if (userMessage.includes(cmd.keyword)) {
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
    var desc = row[2];   
    
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
      description: desc
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
