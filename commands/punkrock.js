const { SlashCommandBuilder, EmbedBuilder, AttachmentBuilder } = require('discord.js');
const path = require('path');
const fs = require('fs');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('punkrock')
    .setDescription('Measures how punk rock you really are')
    .addUserOption(opt =>
      opt.setName('user')
        .setDescription('Who do you want to measure?')
        .setRequired(false)
    ),

  async execute(interaction) {
    const target = interaction.options.getUser('user') || interaction.user;
    const member = interaction.options.getMember('user') || interaction.member;
    const name = member?.displayName || target.globalName || target.username;

    const percentage = Math.floor(Math.random() * 101);

    let phrase = '';
    let color = 0x1a1a2e;

    if (percentage >= 90) {
      phrase = 'You still believe doing the right thing matters, even when nobody else does. That is the real rebellion.';
      color = 0xe10600;
    } else if (percentage >= 75) {
      phrase = 'You protect people who cannot protect themselves. Quiet strength. Zero tolerance for cruelty.';
      color = 0xc41e3a;
    } else if (percentage >= 55) {
      phrase = 'You refuse to become cold just because the world is. That stubborn hope is dangerous in the best way.';
      color = 0x8b0000;
    } else if (percentage >= 35) {
      phrase = 'You care, but you hide it. The fire is still there, it just needs a reason to come out.';
      color = 0x4a4a4a;
    } else {
      phrase = 'You have been worn down by the noise. The fight is still possible, but you stopped believing it was worth it.';
      color = 0x2b2b2b;
    }

    const loadingEmbed = new EmbedBuilder()
      .setColor(0x1a1a2e)
      .setTitle('Punk Rock Meter')
      .setDescription('Scanning **' + name + '**...\n\n`▱▱▱▱▱▱▱▱▱▱ 0%`')
      .setFooter({ text: 'Daily Planet • Underground Analysis' });

    await interaction.reply({ embeds: [loadingEmbed] });

    const bars = [
      ['▰▰▱▱▱▱▱▱▱▱', '20%'],
      ['▰▰▰▰▱▱▱▱▱▱', '40%'],
      ['▰▰▰▰▰▰▱▱▱▱', '60%'],
      ['▰▰▰▰▰▰▰▰▱▱', '80%'],
      ['▰▰▰▰▰▰▰▰▰▰', '100%']
    ];

    for (const [bar, percent] of bars) {
      loadingEmbed.setDescription('Scanning **' + name + '**...\n\n`' + bar + ' ' + percent + '`');
      await interaction.editReply({ embeds: [loadingEmbed] });
      await new Promise(r => setTimeout(r, 400));
    }

    const finalEmbed = new EmbedBuilder()
      .setColor(color)
      .setTitle('Punk Rock Meter')
      .setDescription('**' + name + '** is **' + percentage + '%** punk rock.\n\n' + phrase)
      .setThumbnail(target.displayAvatarURL({ size: 256 }))
      .setFooter({ text: 'Daily Planet • Metropolis' })
      .setTimestamp();

    const imagePath = path.join(__dirname, '..', 'punkrock.png');

    if (fs.existsSync(imagePath)) {
      const file = new AttachmentBuilder(imagePath);
      finalEmbed.setImage('attachment://punkrock.png');
      await interaction.editReply({ embeds: [finalEmbed], files: [file] });
    } else {
      await interaction.editReply({ embeds: [finalEmbed] });
    }
  }
};
