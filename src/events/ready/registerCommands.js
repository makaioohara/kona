const { client } = require('../../../config.json');

module.exports = async (client) => {
  try {
    const globalCommands = await client.application.commands.fetch();

    const localCommands = require('../../utils/getApplicationCommands')(); 

    for (const localCommand of localCommands) {
      const { name, description, options } = localCommand;

      const existingCommand = globalCommands.find(
        (cmd) => cmd.name === name
      );

      if (existingCommand) {
        if (localCommand.deleted) {
          await existingCommand.delete();
          console.log(`Deleted command "${name}".`);
          continue;
        }

      } else {
        if (localCommand.deleted) {
          console.log(
            `Skipping registering command "${name}" as it's set to delete.`
          );
          continue;
        }

        await client.application.commands.create({
          name,
          description,
          options,
        });

        console.log(`Registered command "${name}."`);
      }
    }
  } catch (error) {
    console.log(`There was an error: ${error}`);
  }
};
