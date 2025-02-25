const { EmbedBuilder } = require('discord.js');

module.exports = {
  name: 'emotes',
  description: 'Shows all available emotes for non-nitro users.',
  
  callback: async (client, interaction) => {
    try {
      const applicationEmojis = await client.application.emojis.fetch();

      if (applicationEmojis.size === 0) {
        return interaction.reply('No application emojis available.');
      }

      const emojiList = applicationEmojis.map(emoji => emoji.toString()).join(' ');

      const botMember = await interaction.guild.members.fetch(client.user.id);
      const botRoleColor = botMember.roles.highest.color || 0x000000;

      const embed = new EmbedBuilder()
        .setColor(botRoleColor)
        .setTitle('Custom emotes!')
        .setDescription(`Use \`?:emojiname:\` in the chat to use emotes listed below!\n\n${emojiList}`)
        .setFooter({ text: 'This message will disappear in 25 seconds.' });

      const message = await interaction.reply({ embeds: [embed] });

      setTimeout(() => {
        message.delete().catch(console.error);
      }, 25000);

    } catch (error) {
      console.error(error);
      return interaction.reply('An error occurred while fetching the emojis.');
    }
  },
};
