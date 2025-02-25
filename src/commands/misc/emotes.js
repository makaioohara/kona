const { EmbedBuilder } = require('discord.js');

module.exports = {
  name: 'emotes',
  description: 'Shows all available emotes for non-nitro users.',
  
  callback: async (client, interaction) => {
    try {
      if (!interaction.channel.nsfw) {
        return interaction.reply('This command is made to be used in an NSFW channel!');
      }
      const applicationEmojis = await client.application.emojis.fetch();

      if (applicationEmojis.size === 0) {
        return interaction.reply('No emotes available!');
      }

      const emojiList = applicationEmojis.map(emoji => emoji.toString()).join(' ');

      const botMember = await interaction.guild.members.fetch(client.user.id);
      const botRoleColor = botMember.roles.highest.color || 0x000000;

      const embed = new EmbedBuilder()
        .setColor(botRoleColor)
        .setTitle('Custom emotes!')
        .setDescription(`Use \`?:emojiname:\` in the chat to use emotes listed below!\n\n${emojiList}`)
        .setFooter({ text: 'Be sure to use these emotes!' });

      await interaction.reply({ embeds: [embed] });

    } catch (error) {
      console.error(error);
      return interaction.reply('An error occurred while fetching the emotes!');
    }
  },
};
