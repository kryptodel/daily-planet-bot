require('dotenv').config();
const express = require('express');
const app = express();

app.get('/', (req, res) => {
  res.send('Daily Planet Bot is online!');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Keep-alive running on port ${PORT}`);
});

require('dotenv').config();
const { Client, GatewayIntentBits, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

client.once('ready', async () => {
  console.log(`🗞️ Daily Planet is online as ${client.user.tag}`);
  client.user.setActivity('Daily Planet • Metropolis', { type: 3 });

  const { REST, Routes, SlashCommandBuilder } = require('discord.js');

  const commands = [
    new SlashCommandBuilder()
      .setName('headline')
      .setDescription('Create an official Daily Planet headline')
      .addStringOption(opt => opt.setName('title').setDescription('Headline title').setRequired(true))
      .addStringOption(opt => opt.setName('content').setDescription('Article content').setRequired(true)),

    new SlashCommandBuilder()
      .setName('ship')
      .setDescription('Calculate the compatibility between two people')
      .addUserOption(opt => opt.setName('person1').setDescription('First person').setRequired(true))
      .addUserOption(opt => opt.setName('person2').setDescription('Second person').setRequired(true)),

    new SlashCommandBuilder()
      .setName('marry')
      .setDescription('Marry two people in the Daily Planet')
      .addUserOption(opt => opt.setName('person1').setDescription('Spouse 1').setRequired(true))
      .addUserOption(opt => opt.setName('person2').setDescription('Spouse 2').setRequired(true)),

    new SlashCommandBuilder()
      .setName('news')
      .setDescription('Publish a news article on the Daily Planet')
      .addStringOption(opt => opt.setName('title').setDescription('News title').setRequired(true))
      .addStringOption(opt => opt.setName('content').setDescription('News content').setRequired(true)),

    new SlashCommandBuilder()
      .setName('breaking')
      .setDescription('Announce urgent breaking news')
      .addStringOption(opt => opt.setName('title').setDescription('Breaking news title').setRequired(true)),

    new SlashCommandBuilder()
      .setName('reporter')
      .setDescription('Get hired as a Daily Planet reporter'),

    new SlashCommandBuilder()
      .setName('8ball')
      .setDescription('Ask a question and the magic 8-ball will answer')
      .addStringOption(opt => opt.setName('question').setDescription('Your question').setRequired(true)),

    new SlashCommandBuilder()
      .setName('supercomputer')
      .setDescription('Consult the Fortress of Solitude supercomputer')
      .addStringOption(opt => opt.setName('query').setDescription('What do you want to consult?').setRequired(true)),
  ].map(cmd => cmd.toJSON());

  const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);

  try {
    console.log('Registering slash commands...');
    await rest.put(
      Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID),
      { body: commands }
    );
    console.log('Slash commands registered successfully!');
  } catch (error) {
    console.error('Error registering commands:', error);
  }
});

client.on('interactionCreate', async interaction => {
  if (!interaction.isChatInputCommand()) return;

  const { commandName } = interaction;

  if (commandName === 'headline') {
    const title = interaction.options.getString('title');
    const content = interaction.options.getString('content');

    const embed = new EmbedBuilder()
      .setColor(0x1a1a2e)
      .setAuthor({ name: 'DAILY PLANET', iconURL: 'https://i.imgur.com/8Km9tLL.png' })
      .setTitle(`📰 ${title.toUpperCase()}`)
      .setDescription(content)
      .addFields(
        { name: 'Reporter', value: interaction.user.username, inline: true },
        { name: 'Date', value: new Date().toLocaleDateString('en-US'), inline: true }
      )
      .setFooter({ text: 'The most trusted newspaper in Metropolis' })
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });
  }

  if (commandName === 'ship') {
    const p1 = interaction.options.getUser('person1');
    const p2 = interaction.options.getUser('person2');

    const seed = (BigInt(p1.id) + BigInt(p2.id)) % 101n;
    const percentage = Number(seed);

    let phrase = '';
    let emoji = '';

    if (percentage >= 90) {
      phrase = 'Wedding is booked! The Daily Planet is already preparing the coverage!';
      emoji = '💍';
    } else if (percentage >= 70) {
      phrase = 'Strong chemistry detected! This could make the front page.';
      emoji = '💘';
    } else if (percentage >= 40) {
      phrase = 'There\'s potential... but they still need more stories together.';
      emoji = '🤔';
    } else {
      phrase = 'Better if each one stays at their own desk.';
      emoji = '💔';
    }

    const embed = new EmbedBuilder()
      .setColor(0xff69b4)
      .setTitle(`${emoji} Compatibility Analysis — Daily Planet`)
      .setDescription(`**\( {p1.username}** ❤️ ** \){p2.username}**\n\n**Compatibility: \( {percentage}%**\n\n \){phrase}`)
      .setFooter({ text: 'Research conducted by the Daily Planet gossip department' });

    await interaction.reply({ embeds: [embed] });
  }

  if (commandName === 'marry') {
    const p1 = interaction.options.getUser('person1');
    const p2 = interaction.options.getUser('person2');

    const embed = new EmbedBuilder()
      .setColor(0xffd700)
      .setTitle('💒 Official Daily Planet Ceremony')
      .setDescription(`Today, before the readers of Metropolis...\n\n**\( {p1}** and ** \){p2}**\n\nare officially **married** by the power vested in this bot!\n\nMay your love be stronger than kryptonite 💚`)
      .setFooter({ text: 'Certificate issued by the Daily Planet • Metropolis' })
      .setTimestamp();

    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId('congratulate')
        .setLabel('Congratulate the couple')
        .setStyle(ButtonStyle.Success)
        .setEmoji('🎉')
    );

    await interaction.reply({ embeds: [embed], components: [row] });
  }

  if (commandName === 'news') {
    const title = interaction.options.getString('title');
    const content = interaction.options.getString('content');

    const embed = new EmbedBuilder()
      .setColor(0x1a1a2e)
      .setAuthor({ name: 'DAILY PLANET — Today\'s Edition', iconURL: 'https://i.imgur.com/8Km9tLL.png' })
      .setTitle(`🗞️ ${title}`)
      .setDescription(content)
      .addFields(
        { name: 'Reporter', value: interaction.user.username, inline: true },
        { name: 'Date', value: new Date().toLocaleDateString('en-US'), inline: true }
      )
      .setFooter({ text: 'Published in the Daily Planet • Metropolis' })
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });
  }
  
  if (commandName === 'breaking') {
    const title = interaction.options.getString('title');

    const embed = new EmbedBuilder()
      .setColor(0xff0000)
      .setTitle('🚨 BREAKING NEWS 🚨')
      .setDescription(`**${title.toUpperCase()}**`)
      .setFooter({ text: 'Broadcast live by the Daily Planet' })
      .setTimestamp();

    await interaction.reply({ content: '@here', embeds: [embed] });
  }
  
  if (commandName === 'reporter') {
    const roles = [
      'Investigative Reporter',
      'War Photographer',
      'Gossip Columnist',
      'International Correspondent',
      'Sports Editor',
      'Intern who makes coffee and writes stories',
      'Night Shift Reporter',
    ];

    const role = roles[Math.floor(Math.random() * roles.length)];

    const embed = new EmbedBuilder()
      .setColor(0x00aa00)
      .setTitle('📋 Contract Signed!')
      .setDescription(`Congratulations, **${interaction.user.username}**!\n\nYou have just been hired as:\n\n### ${role}\n\nof the **Daily Planet**.\n\nWelcome to the team. Don\'t disappoint Perry White.`)
      .setFooter({ text: 'Digitally signed by Perry White' });

    await interaction.reply({ embeds: [embed] });
  }
  
  if (commandName === '8ball') {
    const question = interaction.options.getString('question');

    const answers = [
      'It is certain.',
      'It is decidedly so.',
      'Without a doubt.',
      'Yes, definitely.',
      'You may rely on it.',
      'As I see it, yes.',
      'Most likely.',
      'Outlook good.',
      'Yes.',
      'Signs point to yes.',
      'Reply hazy, try again.',
      'Ask again later.',
      'Better not tell you now.',
      'Cannot predict now.',
      'Concentrate and ask again.',
      'Don\'t count on it.',
      'My reply is no.',
      'My sources say no.',
      'Outlook not so good.',
      'Very doubtful.',
      'Perry White would not approve of this question.',
      'Clark Kent is too busy to answer right now.',
      'Lois Lane would find out the truth.',
      'This smells like kryptonite... better not.',
    ];

    const answer = answers[Math.floor(Math.random() * answers.length)];

    const embed = new EmbedBuilder()
      .setColor(0x000000)
      .setTitle('🎱 Daily Planet Magic 8-Ball')
      .addFields(
        { name: 'Question', value: question },
        { name: 'Answer', value: `**${answer}**` }
      )
      .setFooter({ text: `Asked by ${interaction.user.username}` })
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });
  }

  if (commandName === 'supercomputer') {
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
      'Answer calculated with 99.97% accuracy: the truth lies in the details you have not yet observed.',
    ];

    const answer = answers[Math.floor(Math.random() * answers.length)];

    const embed = new EmbedBuilder()
      .setColor(0x00bfff)
      .setAuthor({
        name: 'FORTRESS OF SOLITUDE SUPERCOMPUTER',
        iconURL: 'https://i.imgur.com/3X5QZ8L.png'
      })
      .setTitle('❄️ Query in progress...')
      .addFields(
        { name: 'Query received', value: `\`\`\`${query}\`\`\`` },
        { name: 'Analysis result', value: `**${answer}**` }
      )
      .setFooter({ text: 'Operating System: Kryptonian OS • Access authorized' })
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });
  }
});

client.on('interactionCreate', async interaction => {
  if (!interaction.isButton()) return;
  if (interaction.customId === 'congratulate') {
    await interaction.reply({ content: `🎉 ${interaction.user} congratulated the couple!`, ephemeral: false });
  }
});

client.on('messageCreate', async (message) => {
  if (message.author.bot) return;
  if (message.content.toUpperCase() === 'SHAZAM!') {

    const shazamGif = 'https://tenor.com/pt-BR/view/dc-animated-batman-batb-brave-and-the-bold-gif-7515550034633410740';

    await message.reply({
      content: `⚡ **SHAZAM!** ⚡\n${message.author} has transformed!`,
      files: [shazamGif]
    });
  }
});
