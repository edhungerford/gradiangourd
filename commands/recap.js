const axios = require('axios');
const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('recap')
    .setDescription('Finds the most recent recap (default), or a different one by name.')
    .addStringOption(option =>
        option.setName('title')
        .setDescription('The session title')
    ),
    async execute(interaction) {
        const title = interaction.options.getString('title') ?? "latest";
        const story = await axios.get('https://gradia.edsite.black/api/story');
        async function postRecap(storyObject){
            const messages = storyObject.story.split("\n");
            await interaction.editReply("**" + storyObject.title + "**");
            await messages.forEach( message => {
                interaction.followUp(message);
            })
            if(storyObject.stinger !== ""){
                interaction.followUp("> *" + storyObject.stinger + "*")
            }
        }
        if(title !== "latest"){
            var results = story.data.filter(session => {
                return session.title.toUpperCase().startsWith(title.toUpperCase())
            })
            if(results.length > 0){
                postRecap(results[0])
            } else {
                await interaction.editReply("Couldn't find a session with that name.")
            }
        } else {
            postRecap(story.data[story.data.length - 1])
        }
        
    },

}
