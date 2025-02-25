module.exports = async (client, interaction) => {
    if (!interaction.isChatInputCommand()) return;

    try {
      const commandObject = client.commands.get(interaction.commandName);

      if (!commandObject) return;

      if (commandObject.permissionsRequired?.length) {
        for (const permission of commandObject.permissionsRequired) {
          if (!interaction.member.permissions.has(permission)) {
            interaction.reply({
              content: 'Not enough permissions.',
              ephemeral: true,
            });
            return;
          }
        }
      }

      if (commandObject.botPermissions?.length) {
        const bot = interaction.guild.members.me;

        if (!bot.permissions.has(permission)) {
          interaction.reply({
            content: "I don't have enough permissions.",
            ephemeral: true,
          });
          return;
        }
      }

      await commandObject.callback(client, interaction);
    } catch (error) {
      console.log(`There was an error running this command: ${error}`);
    }
};