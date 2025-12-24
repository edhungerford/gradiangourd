const axios = require('axios');
const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('character')
		.setDescription('Finds a character by name.')
		.addStringOption(option => 
			option.setName('name')
			.setDescription('The name of the character')
			.setRequired(true))
		.addStringOption(option =>
			option.setName('game')
			.setDescription("The TTRPG game you're querying")
			.setRequired(true)
			.addChoices(
					{ name: 'Tails of Gradia', value: 'gradia' },
					{ name: 'South of Snaplands', value: 'snaplands' },
					{ name: 'Scalesagas', value: 'scalesagas'}
				)
			),			
	async execute(interaction) {
		const name = interaction.options.getString('name');
		const game = interaction.options.getString('game');
		const char = await axios.get(`https://gradia.edsite.black/api/${game}/characters`);
		var results = char.data.filter(character => {
			return character.name.toUpperCase().startsWith(name.toUpperCase());
		})
		if(results.length > 0){
			const card = {
				color: 0xca4a00,
				title: results[0].name,
				image: {'url': results[0].url},
				description: results[0].description,
				fields: [{name: 'Pronouns', value: results[0].pronouns}]
			}
			if(results.length > 1) card.footer = {text: "I found more than one character that matched your search parameters. If this isn't the character you were looking for, try being a little more specific!"};
			interaction.editReply({embeds: [card]});
		} else {
			interaction.editReply("Couldn't find a character with that name.");
		}
	},
};
