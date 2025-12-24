const axios = require('axios');
const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
    .addStringOption(option =>
        option.setName('game')
        .setDescription('The game to fetch information from.')
        .setRequired(true)
        .addChoices(
            { name: 'Tails of Gradia', value: 'gradia' },
			{ name: 'South of Snaplands', value: 'snaplands' },
            { name: 'Scalesagas', value: 'scalesagas'},
			{ name: "Blue Skies, Black Smoke", value: 'bsbs'}
        )
    )
    .setName('recap')
    .setDescription('Finds the most recent recap (default), or a different one by name.')
    .addStringOption(option =>
        option.setName('title')
        .setDescription('The session title')
    ),
    async execute(interaction) {
        const title = interaction.options.getString('title') ?? "latest";
        const game = interaction.options.getString('game');
        const story = await axios.get('https://gradia.edsite.black/api/' + game + '/story');
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
