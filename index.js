require('dotenv').config();
const express = require('express');
const fs = require('fs');
const path = require('path');
const {
  Client,
  GatewayIntentBits,
  Collection,
  REST,
  Routes,
  EmbedBuilder,
  AttachmentBuilder
} = require('discord.js');

const { createCanvas, loadImage } = require('canvas');

const app = express();
app.get('/', (req, res) => res.send('Daily Planet Bot is online!'));
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Keep-alive running on port ${PORT}`));

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

client.commands = new Collection();

const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

const commandsToRegister = [];

for (const file of commandFiles) {
  const filePath = path.join(commandsPath, file);
  const command = require(filePath);

  if ('data' in command && 'execute' in command) {
    client.commands.set(command.data.name, command);
    commandsToRegister.push(command.data.toJSON());
  } else {
    console.log(`[AVISO] O comando em ${file} está sem "data" ou "execute".`);
  }
}

client.once('ready', async () => {
  console.log(`🗞️ Daily Planet is online as ${client.user.tag}`);
  client.user.setActivity('Daily Planet • Metropolis', { type: 3 });

  const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);

  try {
    console.log('Registrando slash commands...');
    await rest.put(
      Routes.applicationCommands(process.env.CLIENT_ID),
      { body: commandsToRegister }
    );
    console.log('Slash commands registrados com sucesso!');
  } catch (error) {
    console.error('Erro ao registrar comandos:', error);
  }
});

client.on('interactionCreate', async interaction => {
  
  if (interaction.isMessageContextMenuCommand()) {
    const command = client.commands.get(interaction.commandName);
    if (!command) return;

    try {
      await command.execute(interaction);
    } catch (error) {
      console.error(error);
      await interaction.reply({ content: '❌ Erro ao executar o comando.', ephemeral: true }).catch(() => {});
    }
    return;
  }

  if (!interaction.isChatInputCommand()) return;

  const command = client.commands.get(interaction.commandName);
  if (!command) return;

  try {
    await command.execute(interaction);
  } catch (error) {
    console.error(`Erro no comando ${interaction.commandName}:`, error);

    const errorMsg = { content: '❌ Ocorreu um erro ao executar este comando.', ephemeral: true };

    if (interaction.replied || interaction.deferred) {
      await interaction.followUp(errorMsg).catch(() => {});
    } else {
      await interaction.reply(errorMsg).catch(() => {});
    }
  }
});

client.on('messageCreate', async message => {
  if (message.author.bot) return;

  if (message.content.trim().toUpperCase() === 'SHAZAM!') {
    try {
      const embed = new EmbedBuilder()
        .setColor(0xFFD700)
        .setTitle('⚡ SHAZAM! ⚡')
        .setDescription(`**${message.author}** said the magic word and transformed!`)
        .setImage('attachment://dc-animated.gif')
        .setFooter({
          text: 'The power of Shazam has been unleashed',
          iconURL: message.author.displayAvatarURL()
        })
        .setTimestamp();

      await message.reply({
        embeds: [embed],
        files: ['dc-animated.gif']
      });
    } catch (error) {
      console.error('Error sending SHAZAM GIF:', error);

      const fallbackEmbed = new EmbedBuilder()
        .setColor(0xFFD700)
        .setTitle('⚡ SHAZAM! ⚡')
        .setDescription(`**${message.author}** said the magic word and transformed!`)
        .setFooter({ text: 'The power of Shazam has been unleashed' })
        .setTimestamp();

      await message.reply({ embeds: [fallbackEmbed] });
    }
  }
});

client.on('messageCreate', async message => {
  if (message.author.bot) return;

  if (message.content.trim().toLowerCase() === 'what time is it?') {
    const gifs = [
      'ben10.gif',
      'alien-ben-10.gif'
    ];

    const selectedGif = gifs[Math.floor(Math.random() * gifs.length)];

    const embed = new EmbedBuilder()
  .setColor(0x39FF14) 
  .setTitle('🟢 OMNITRIX SIGNAL DETECTED')
  .setDescription(
    `## ⚡ IT'S HERO TIME!\n\n` +
    `**👤 User:** ${message.author}\n` +
    `**📡 Status:** Transformation Initiated...\n` +
    `**⚡ Power Level:** ██████████ **100%**\n\n` +
    `> *Choose your alien... and save the day!*`
  )
  .setThumbnail(message.author.displayAvatarURL({ dynamic: true }))
  .setImage(`attachment://${selectedGif}`)
  .setFooter({
    text: 'Ben 10 • The Universe Needs a Hero'
  })
  .setTimestamp();

    await message.reply({
      embeds: [embed],
      files: [selectedGif]
    });
  }
});

client.login(process.env.TOKEN);
