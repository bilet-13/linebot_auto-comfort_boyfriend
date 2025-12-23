# LINE Bot - Auto Comfort Boyfriend

A LINE chatbot that responds with comforting messages, deployed using Google Apps Script for serverless, zero-cost hosting.

## Features

- Responds to specific keywords with personalized messages
- Random comfort message selection
- Serverless deployment (no server maintenance needed)
- Completely free to run

## How It Works

This bot uses:
- **Google Apps Script** as the webhook server (free, serverless)
- **LINE Messaging API** for chatbot functionality
- Keyword-based response system

When a user sends a message to the LINE bot, LINE Platform sends a webhook POST request to your Google Apps Script, which processes the message and replies accordingly.

## Prerequisites

1. LINE account
2. Google account
3. Basic understanding of LINE Messaging API

## Setup Instructions

### Step 1: Create LINE Bot

1. Go to [LINE Developers Console](https://developers.line.biz/)
2. Create a new Provider (if you don't have one)
3. Create a new Messaging API channel
4. Note down your **Channel Access Token**

### Step 2: Deploy Google Apps Script

1. Go to [Google Apps Script](https://script.google.com/)
2. Create a new project
3. Copy the content from `auto_comfort_hook.gs` into the script editor
4. Set up Script Properties:
   - Click **Project Settings** (gear icon)
   - Scroll to **Script Properties**
   - Click **Add script property**
   - Name: `auto_comfort_boyfriend_channel_access_token`
   - Value: Your LINE Channel Access Token
   - Click **Save**

### Step 3: Deploy as Web App

1. In the Apps Script editor, click **Deploy** → **New deployment**
2. Click **Select type** → **Web app**
3. Configure settings:
   - **Description**: LINE Bot Webhook (or any name)
   - **Execute as**: Me (your email)
   - **Who has access**: **Anyone** (IMPORTANT!)
4. Click **Deploy**
5. Authorize the app when prompted
6. Copy the **Web app URL** (looks like `https://script.google.com/macros/s/.../exec`)

### Step 4: Configure LINE Webhook

1. Go back to [LINE Developers Console](https://developers.line.biz/)
2. Select your Messaging API channel
3. Go to **Messaging API** tab
4. Find **Webhook settings**
5. Set **Webhook URL** to your Google Apps Script Web App URL
6. Enable **Use webhook**
7. Click **Verify** to test the connection (should show success)

### Step 5: Enable Bot Features

In the LINE Developers Console:
1. Disable **Auto-reply messages** (unless you want both)
2. Disable **Greeting messages** (optional)
3. Enable **Webhooks**

## Testing

### Test the Webhook

Open your Web App URL in a browser. You should see:
```
LINE Bot webhook is running!
```

If you get a login page or 302 error, check your deployment settings (especially "Who has access" should be "Anyone").

### Test the Bot

1. Add your bot as a friend using the QR code from LINE Developers Console
2. Send a message like "想你" or "需要安慰"
3. Bot should respond with a comfort message

## Customization

Edit `auto_comfort_hook.gs` to add your own keywords and responses:

```javascript
if (userMessage.includes("your_keyword")) {
  replyMessage = "Your custom response";
}
```

### Adding Random Responses

```javascript
else if (userMessage.includes("keyword")) {
  var choices = [
    "Response 1",
    "Response 2",
    "Response 3"
  ];
  replyMessage = choices[Math.floor(Math.random() * choices.length)];
}
```

After making changes:
1. Save the script
2. Deploy → **Manage deployments**
3. Click **Edit** (pencil icon) on your deployment
4. Click **Deploy** to update

## Troubleshooting

### Error: 302 Found

**Cause**: Deployment access settings are wrong

**Solution**:
- Redeploy with "Who has access" set to **Anyone**
- Create a NEW deployment instead of editing existing one

### Error: Script function not found: doGet

**Cause**: Missing doGet() function for browser testing

**Solution**: Code already includes doGet() function

### Bot doesn't respond

**Check**:
1. Webhook URL is correct in LINE Developers
2. Webhook is enabled
3. Script Properties has the correct Channel Access Token
4. Auto-reply is disabled in LINE settings

### Invalid reply token

**Cause**: Trying to reply to old messages or testing with dummy data

**Solution**: Only reply to messages received within a few minutes

## Architecture

```
User sends message
       ↓
LINE Platform
       ↓
Google Apps Script (Webhook)
       ↓
Process message & generate response
       ↓
LINE Messaging API (Reply)
       ↓
User receives message
```

## Limitations

- Google Apps Script has execution time limits (6 minutes per execution)
- Apps Script quotas: 20,000 URL Fetch calls per day (plenty for personal use)
- Reply tokens expire after a short time
- Can only reply to messages, cannot initiate conversations

## Cost

**Completely FREE!**
- LINE Messaging API: Free tier includes 500 messages/month
- Google Apps Script: Free with generous quotas

## Files

- `auto_comfort_hook.gs` - Main bot logic and webhook handler
- `LINE_SETUP_GUIDE.md` - Detailed LINE setup instructions
- `README.md` - This file

## License

MIT License - Feel free to customize and use for your own projects!

## Contributing

Feel free to fork and submit pull requests for improvements!

## Support

For issues related to:
- LINE API: Check [LINE Developers Documentation](https://developers.line.biz/en/docs/)
- Google Apps Script: Check [Apps Script Documentation](https://developers.google.com/apps-script)
