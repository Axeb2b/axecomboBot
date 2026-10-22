# Combo Bot

## Deploy
1. Create bot via @BotFather → get BOT_TOKEN
2. wrangler kv namespace create SESSIONS → copy ID into wrangler.toml
3. wrangler secret put BOT_TOKEN / WEBHOOK_SECRET / ADMIN_CHAT_ID
4. wrangler deploy
5. curl -X POST https://api.telegram.org/bot<TOKEN>/setWebhook -d url=https://combo-bot.<sub>.workers.dev -d secret_token=<WEBHOOK_SECRET>

## Test
curl -X POST https://combo-bot.<sub>.workers.dev -H "X-Telegram-Bot-Api-Secret-Token: <secret>" -d '{"update_id":1,"message":{"chat":{"id":123},"text":"/start"}}'
