export const discordConfig = {
  enable: process.env.ALLOW_DISCORD_WEBHOOK == 'true' ? true : false,
  webHookUrl: process.env.DISCORD_WEBHOOK_URL,
};
