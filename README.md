# LINE Bot - Auto Comfort Boyfriend

Keyword-based LINE chatbot with Google Sheets integration. Update responses without touching code.

## Features

- **Dynamic command management** - Edit responses in Google Sheets
- **Help command** - Auto-generated command list
- **Random responses** - Add multiple replies per keyword (newline-separated)
- **Zero cost** - Google Apps Script + Sheets (free tier)

## Stack

- LINE Messaging API (webhook receiver)
- Google Apps Script (serverless backend)
- Google Sheets (command database)

## Prerequisites

- LINE account
- Google account

## Quick Setup

### 1. Create Google Sheet

Create a new Google Sheet with this structure:

| Keyword | Reply | Description |
|---------|-------|-------------|
| 想你 | 我也超想你～～ 我的寶貝 | When user misses you |
| 需要安慰 | 我的寶貝~~ 摸摸喔<br>誰讓你生氣了 我揍飛他 | Random comfort (use newlines for multiple) |

- **Sheet name**: `sheet1`
- **Column A**: Trigger keyword
- **Column B**: Response (use `Alt+Enter` for multiple random responses)
- **Column C**: Description (optional)

Copy the Spreadsheet ID from URL: `docs.google.com/spreadsheets/d/{SPREADSHEET_ID}/edit`

### 2. Create LINE Bot

1. [LINE Developers Console](https://developers.line.biz/) → Create Messaging API channel
2. Copy **Channel Access Token**

### 3. Deploy Apps Script

1. [Google Apps Script](https://script.google.com/) → New project
2. Paste code from `auto_comfort_hook.gs`
3. **Project Settings** → **Script Properties** → Add two properties:
   - `auto_comfort_boyfriend_channel_access_token` = `YOUR_LINE_TOKEN`
   - `auto_comfort_boyfriend_sheet_id` = `YOUR_SPREADSHEET_ID`

4. **Deploy** → **New deployment** → **Web app**:
   - Execute as: **Me**
   - Who has access: **Anyone** ⚠️ (critical!)
5. Copy the Web App URL

### 4. Connect Webhook

LINE Developers Console → Your channel → **Messaging API** tab:
- Webhook URL: Paste your Web App URL
- Enable **Use webhook**
- Click **Verify** (should succeed)
- Disable **Auto-reply** and **Greeting messages**

## Usage

**Add the bot** using QR code from LINE Developers Console

**Test it**:
- Send "help" or "指令" → See all commands
- Send any keyword from your sheet → Get response
- Browser test: Open Web App URL → Should show help text

**Update commands**: Just edit the Google Sheet. Changes are live instantly (no redeployment needed).

## Troubleshooting

**302 Error (most common)**
- Deployment setting wrong → "Who has access" must be **Anyone**
- Solution: Create NEW deployment (don't edit existing one)

**Bot doesn't respond**
- Check webhook URL in LINE Developers
- Verify both Script Properties are set correctly
- Make sure Auto-reply is disabled in LINE

**Sheet not found**
- Sheet name must be exactly `sheet1`
- Check Spreadsheet ID is correct in Script Properties

## How It Works

```
User → LINE → Apps Script → Google Sheets (read commands) → Reply
```

Bot reads commands from Google Sheets on every message, so updates are instant.

## Limits

- LINE free tier: 500 messages/month
- Apps Script: 20k URL fetches/day
- Reply tokens expire in ~1 minute

## Files

- `auto_comfort_hook.gs` - Main webhook code
- `LINE_SETUP_GUIDE.md` - Detailed LINE setup
