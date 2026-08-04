const { SlashCommandBuilder, EmbedBuilder, AttachmentBuilder } = require('discord.js');
const path = require('path');
const fs = require('fs');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('supercomputer')
    .setDescription('Consult the Fortress of Solitude supercomputer')
    .addStringOption(opt =>
      opt.setName('query')
        .setDescription('What do you want to consult?')
        .setRequired(true)
    ),

  async execute(interaction) {
    const query = interaction.options.getString('query');

    const answers = [
      'Analysis complete. Success probability: 87.4%. Proceed with caution.',
      'Insufficient data for a definitive conclusion. Requesting additional information.',
      'The probability of this hypothesis being true is only 12.8%.',
      'Calculation finished. The result is favorable to your intentions.',
      'Warning: this line of reasoning may lead to unpredictable consequences.',
      'Processing... Result: the answer you seek is closer than you imagine.',
      'Pattern analysis complete. Recommend prolonged observation before acting.',
      'This question has been formulated 47 times in this system\'s history. The answer remains the same: yes.',
      'Negative. Available data contradicts this possibility.',
      'Affirmative. All sensors indicate this is the correct decision.',
      'Risk calculation: moderate. Potential benefit: high. Proceed carefully.',
      'The supercomputer detects no immediate threats related to this query.',
      'Simulation result: 9 out of 10 scenarios end satisfactorily.',
      'Access denied to part of the files. Information classified at Kryptonian level.',
      'Emotional analysis detected in the query. Filtering... Logical answer: it is possible.',
      'The Fortress crystals vibrate at a positive frequency. Interpretation: yes.',
      'Future projection calculated. The path you are considering is the most stable.',
      'Alert: this decision may significantly alter the flow of events in Metropolis.',
      'Query processed. The universe tends toward balance. Your action will be part of it.',
      'Answer calculated with 99.97% accuracy: the truth lies in the details you have not yet observed.'
    ];

    const answer = answers[Math.floor(Math.random() * answers.length)];

    const loadingEmbed = new EmbedBuilder()
      .setColor(0x00d4ff)
      .setTitle('❄️ Fortress of Solitude Supercomputer')
      .setDescription('Processing query...\n\n`▱▱▱▱▱▱▱▱▱▱ 0%`')
      .setFooter({ text: 'Kryptonian OS • Crystal Core' });

    await interaction.reply({ embeds: [loadingEmbed] });

    const bars = [
      ['▰▱▱▱▱▱▱▱▱▱', '12%'],
      ['▰▰▱▱▱▱▱▱▱▱', '25%'],
      ['▰▰▰▱▱▱▱▱▱▱', '38%'],
      ['▰▰▰▰▱▱▱▱▱▱', '50%'],
      ['▰▰▰▰▰▱▱▱▱▱', '63%'],
      ['▰▰▰▰▰▰▱▱▱▱', '75%'],
      ['▰▰▰▰▰▰▰▱▱▱', '88%'],
      ['▰▰▰▰▰▰▰▰▰▰', '100%']
    ];

    for (const [bar, percent] of bars) {
      loadingEmbed.setDescription(`Processing query...\n\n\`${bar} ${percent}\``);
      await interaction.editReply({ embeds: [loadingEmbed] });
      await new Promise(r => setTimeout(r, 350));
    }

    const finalEmbed = new EmbedBuilder()
      .setColor(0x00d4ff)
      .setTitle('❄️ Fortress of Solitude Supercomputer')
      .addFields(
        { name: 'Query', value: query, inline: false },
        { name: 'Analysis Result', value: answer, inline: false }
      )
      .setFooter({ text: 'Kryptonian OS • Crystal Core • Access Authorized' })
      .setTimestamp();

    const gifPath = path.join(__dirname, '..', 'supercomputer.gif');

    if (fs.existsSync(gifPath)) {
      const file = new AttachmentBuilder(gifPath);
      finalEmbed.setImage('attachment://supercomputer.gif');
      await interaction.editReply({ embeds: [finalEmbed], files: [file] });
    } else {
      await interaction.editReply({ embeds: [finalEmbed] });
    }
  }
};
