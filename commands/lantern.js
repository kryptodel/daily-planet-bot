const { SlashCommandBuilder, EmbedBuilder, AttachmentBuilder } = require('discord.js');
const path = require('path');
const fs = require('fs');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('lantern')
    .setDescription('Discover which Lantern Corps you belong to')
    .addUserOption(opt =>
      opt.setName('user')
        .setDescription('Who do you want to scan?')
        .setRequired(false)
    ),

  async execute(interaction) {
    const target = interaction.options.getUser('user') || interaction.user;
    const member = interaction.options.getMember('user') || interaction.member;
    const name = member?.displayName || target.globalName || target.username;

    const corps = [
      {
        name: 'Green Lantern Corps',
        color: 0x1db954,
        emotion: 'Willpower',
        oath: 'In brightest day, in blackest night,\nNo evil shall escape my sight.\nLet those who worship evil\'s might,\nBeware my power... Green Lantern\'s light!',
        description: 'Your will is unbreakable. You face fear head-on and never back down from what is right.',
        gif: 'green-lantern.gif'
      },
      {
        name: 'Sinestro Corps',
        color: 0xffd700,
        emotion: 'Fear',
        oath: 'In blackest day, in brightest night,\nBeware your fears made into light.\nLet those who try to stop what\'s right,\nBurn with my power... Sinestro\'s might!',
        description: 'You understand that fear can be a weapon. Control, order, and power come naturally to you.',
        gif: 'sinestro.gif'
      },
      {
        name: 'Red Lantern Corps',
        color: 0xe10600,
        emotion: 'Rage',
        oath: 'With blood and rage of crimson red,\nRipped from a corpse so freshly dead,\nTogether with our hellish hate,\nWe\'ll burn you all... that is your fate!',
        description: 'Your anger burns hotter than any star. When pushed too far, nothing can stop you.',
        gif: 'dc-injustice.gif'
      },
      {
        name: 'Blue Lantern Corps',
        color: 0x0096ff,
        emotion: 'Hope',
        oath: 'In fearful day, in raging night,\nWith strong hearts full, our souls ignite.\nWhen all seems lost in the war of light,\nLook to the stars... for hope burns bright!',
        description: 'You carry hope even when everything seems lost. Your light strengthens everyone around you.',
        gif: 'blue-lantern.gif'
      },
      {
        name: 'Star Sapphire Corps',
        color: 0xff69b4,
        emotion: 'Love',
        oath: 'For hearts long lost and full of fright,\nFor those alone in blackest night,\nFor love\'s embrace and protective might,\nWith the violet light... I give my life!',
        description: 'Love guides every decision you make. You would cross the universe for the ones you care about.',
        gif: 'star-sapphire.gif'
      },
      {
        name: 'Indigo Tribe',
        color: 0x4b0082,
        emotion: 'Compassion',
        oath: 'Tor lorek san, bor nakka mur,\nNatromo faan, orin kar.\nHraefen, norken, sorn kalor,\nIndigo light... of compassion\'s core!',
        description: 'You feel the pain of others as your own. Mercy and understanding define who you are.',
        gif: 'dc-comics-compassion.gif'
      },
      {
        name: 'Orange Lantern Corps',
        color: 0xff8c00,
        emotion: 'Avarice',
        oath: 'What\'s mine is mine and mine and mine,\nAnd mine, and mine, and mine!\nNot yours!',
        description: 'You protect what is yours with everything you have. Desire fuels your power.',
        gif: 'orange-lantern.gif'
      },
      {
        name: 'Black Lantern Corps',
        color: 0x111111,
        emotion: 'Death',
        oath: 'The Blackest Night falls from the skies,\nThe darkness grows as all light dies.\nWe crush our foes and our will be done.\nBlackest Night... the dead shall rise!',
        description: 'Darkness follows you. You have seen the end of things others refuse to face.',
        gif: 'black-lantern-corps-green-lantern.gif'
      },
      {
        name: 'White Lantern Corps',
        color: 0xf5f5f5,
        emotion: 'Life',
        oath: 'In brightest day, there is blackest night,\nBut life shall overcome with the white light.\nThe universe calls, and we answer the fight,\nWith the power of life... White Lantern\'s light!',
        description: 'You are a force of pure life. Where others fall, you rise and bring others with you.',
        gif: 'white-lantern.gif'
      }
    ];

    const result = corps[Math.floor(Math.random() * corps.length)];

    const loadingEmbed = new EmbedBuilder()
      .setColor(0x1a1a2e)
      .setTitle('Lantern Corps Analysis')
      .setDescription('Scanning emotional spectrum of **' + name + '**...\n\n`▱▱▱▱▱▱▱▱▱▱ 0%`')
      .setFooter({ text: 'Daily Planet • Oan Archives' });

    await interaction.reply({ embeds: [loadingEmbed] });

    const bars = [
      ['▰▰▱▱▱▱▱▱▱▱', '20%'],
      ['▰▰▰▰▱▱▱▱▱▱', '40%'],
      ['▰▰▰▰▰▰▱▱▱▱', '60%'],
      ['▰▰▰▰▰▰▰▰▱▱', '80%'],
      ['▰▰▰▰▰▰▰▰▰▰', '100%']
    ];

    for (const [bar, percent] of bars) {
      loadingEmbed.setDescription('Scanning emotional spectrum of **' + name + '**...\n\n`' + bar + ' ' + percent + '`');
      await interaction.editReply({ embeds: [loadingEmbed] });
      await new Promise(r => setTimeout(r, 400));
    }

    const finalEmbed = new EmbedBuilder()
      .setColor(result.color)
      .setTitle(result.name)
      .setDescription(
        '**' + name + '**\n\n' +
        '### Emotion: ' + result.emotion + '\n\n' +
        result.description + '\n\n' +
        '**Oath:**\n```\n' + result.oath + '\n```'
      )
      .setFooter({ text: 'Daily Planet • Emotional Spectrum Division' })
      .setTimestamp();

    const gifPath = path.join(__dirname, '..', result.gif);

    if (fs.existsSync(gifPath)) {
      const file = new AttachmentBuilder(gifPath);
      finalEmbed.setImage('attachment://' + result.gif);
      await interaction.editReply({ embeds: [finalEmbed], files: [file] });
    } else {
      await interaction.editReply({ embeds: [finalEmbed] });
    }
  }
};
