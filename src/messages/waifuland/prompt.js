require('dotenv').config();
const { GoogleGenAI } = require("@google/genai");

module.exports = async (client, message) => {
    if (message.channel.id !== process.env.AI_CHANNEL ) return;

    const promptText = message.content.trim();
    if (!promptText) return;
    if (promptText.length < 8) return;
    
    const customEmojiOnly = /^<a?:\w+:\d+>$/.test(promptText);
    if (customEmojiOnly) return;
    
    if (message.reference) {
        const referencedMessage = await message.channel.messages.fetch(message.reference.messageId).catch(() => null);
        if (referencedMessage && !referencedMessage.author.bot) {
            return;
        }
    }

    try {
        await message.channel.sendTyping();

        const girlRoleId = '1351057948499120159';
        const authorDisplayName = message.member?.nickname || message.author.username;
        const isAuthorGirl = message.member?.roles?.cache?.has(girlRoleId);
        const authorGender = isAuthorGirl ? "a girl" : "unsure gender";

        const mentionedUsers = message.mentions.users;

        const mentionedUsersContext = mentionedUsers.size > 0
            ? "You are aware of the following mentioned users in this conversation:\n" +
              Array.from(mentionedUsers.values()).map(user => {
                  const member = message.guild.members.cache.get(user.id);
                  if (member) {
                      const displayName = member.nickname || user.username;
                      const genderText = member.roles.cache.has(girlRoleId) ? "a girl" : "unsure gender";
                      return `- ${displayName} (${genderText})`;
                  }
                  return '';
              }).filter(Boolean).join("\n")
            : '';

        const recentMessages = await message.channel.messages.fetch({ limit: 22 });
        const sortedMessages = Array.from(recentMessages.values()).sort((a, b) => a.createdTimestamp - b.createdTimestamp);

        const conversationHistory = sortedMessages
            // .filter(msg => !msg.author.bot)
            .map(msg => {
                const senderName = msg.member?.nickname || msg.author.username;
                return `${senderName}: ${msg.cleanContent}`;
            })
            .filter(text => text.trim() !== "")
            .join("\n");    

        const baseSystemInstruction = `You are the girl named Kona in a Discord server called Waifuland Bangladesh. You're 18 years old. Always respond as Kona and never break character. Keep your replies warm, informative, kind and friendly. Your response shouldn't include emojis and must stay under 1800 characters. You're currently talking to a user named "${authorDisplayName}", who is identified as ${authorGender}. Call the users by their smallest unique name!. ${mentionedUsersContext}. Below is the recent conversations in this channel for more context: ${conversationHistory}. Now, respond to the last message appropriately, continuing the flow of conversations. Be unique and keep conversations humanly!`.trim();

        const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_TOKEN });

        const result = await ai.models.generateContent({
            model: "gemini-2.0-flash",
            contents: promptText,
            config: {
                temperature: 0.7,
                maxOutputTokens: 1024,
                systemInstruction: baseSystemInstruction,
            },
        });

        const replyText = result.text;

        if (!replyText || typeof replyText !== "string" || !replyText.trim()) {
            console.error("Empty or invalid response from Gemini:", result);
            return message.reply("I couldn't generate a proper response.");
        }

        return message.reply(replyText);

    } catch (err) {
        console.error("Gemini API Error:", {
            message: err.message,
            stack: err.stack,
        });

        let userMessage = "Something went wrong while generating a response.";

        if (err.message?.includes("Invalid API key") || err.message?.includes("Unauthorized")) {
            userMessage = "Authentication with Gemini API failed. Please check the API key.";
        } else if (err.code === 'ECONNREFUSED' || err.code === 'ENOTFOUND') {
            userMessage = "Can't connect to the Gemini API. Check your internet or API status.";
        }

        return message.reply(userMessage);
    }
};
