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

const {
  Client,
  GatewayIntentBits,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  AttachmentBuilder,
  ContextMenuCommandBuilder,
  ApplicationCommandType
} = require('discord.js');

const { createCanvas, loadImage } = require('canvas');

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

   new ContextMenuCommandBuilder()
  .setName('quote')
  .setType(ApplicationCommandType.Message),

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
      .setName('lantern')
      .setDescription('Find out which Lantern Corps you would belong to.'),

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
  .setDescription('Issue an official Daily Planet press badge')
  .addUserOption(opt =>
    opt.setName('user')
      .setDescription('The person who will receive the badge')
      .setRequired(true)),
    new SlashCommandBuilder()
      .setName('8ball')
      .setDescription('Ask a question and the magic 8-ball will answer')
      .addStringOption(opt => opt.setName('question').setDescription('Your question').setRequired(true)),

    new SlashCommandBuilder()
  .setName('wanted')
  .setDescription('Create a Wanted poster')
  .addUserOption(opt => 
    opt.setName('user')
      .setDescription('The person to put on the poster')
      .setRequired(true)
  )
  .addStringOption(opt => 
    opt.setName('reward')
      .setDescription('Reward amount (example: $10,000)')
      .setRequired(true)
  )
  .addStringOption(opt => 
    opt.setName('crime')
      .setDescription('Crime committed')
      .setRequired(true)
  ),

    new SlashCommandBuilder()
      .setName('supercomputer')
      .setDescription('Consult the Fortress of Solitude supercomputer')
      .addStringOption(opt => opt.setName('query').setDescription('What do you want to consult?').setRequired(true)),
  ].map(cmd => cmd.toJSON());

  const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);

  try {
    console.log('Registering slash commands...');
    await rest.put(
      Routes.applicationCommands(process.env.CLIENT_ID),
      { body: commands }
    );
    console.log('Slash commands registered successfully!');
  } catch (error) {
    console.error('Error registering commands:', error);
  }
});


    
        client.on('interactionCreate', async interaction => {


    

    if (
    interaction.isMessageContextMenuCommand() &&
    interaction.commandName === "quote"
) {

    const message = interaction.targetMessage;
    const user = message.author;
    const member = await interaction.guild.members.fetch(user.id);

    let content = message.content?.trim();

    if (!content && message.attachments.size > 0)
        content = "Image";

    if (!content)
        content = "No text";

    await interaction.deferReply();

    try {

        const {
            createCanvas,
            loadImage
        } = require("canvas");

        const {
            AttachmentBuilder
        } = require("discord.js");

        const canvas = createCanvas(1200, 700);
        const ctx = canvas.getContext("2d");

        const WIDTH = canvas.width;
        const HEIGHT = canvas.height;

        const COLORS = {

            background: "#143A63",

            panel: "#1A4E85",

            gold: "#F2C94C",

            white: "#F8F8F8",

            black: "#111111",

            shadow: "rgba(0,0,0,.25)",

            text: "#202020"

        };

        const avatar = await loadImage(
            member.displayAvatarURL({
                extension: "png",
                size: 512
            })
        );

        const displayName = member.displayName;

        const date = new Date(message.createdTimestamp)
            .toLocaleDateString("pt-BR");

        const time = new Date(message.createdTimestamp)
            .toLocaleTimeString("pt-BR", {

                hour: "2-digit",
                minute: "2-digit"

            });

        function roundRect(x, y, w, h, r) {

            ctx.beginPath();

            ctx.moveTo(x + r, y);

            ctx.arcTo(x + w, y, x + w, y + h, r);

            ctx.arcTo(x + w, y + h, x, y + h, r);

            ctx.arcTo(x, y + h, x, y, r);

            ctx.arcTo(x, y, x + w, y, r);

            ctx.closePath();

        }

        function drawHalftone() {

            ctx.fillStyle = COLORS.background;
            ctx.fillRect(0, 0, WIDTH, HEIGHT);

            for (let y = 0; y < HEIGHT; y += 10) {

                for (let x = 0; x < WIDTH; x += 10) {

                    ctx.beginPath();

                    ctx.arc(x, y, 1.2, 0, Math.PI * 2);

                    ctx.fillStyle = "rgba(255,255,255,.05)";

                    ctx.fill();

                }

            }

        }

        function drawSkyline() {

            ctx.fillStyle = "#10263D";

            for (let i = 0; i < 45; i++) {

                const w = 18 + Math.random() * 28;

                const h = 60 + Math.random() * 140;

                ctx.fillRect(

                    i * 28,

                    HEIGHT - h,

                    w,

                    h

                );

            }

        }

        function drawFrame() {

            ctx.lineWidth = 10;

            ctx.strokeStyle = COLORS.gold;

            ctx.strokeRect(

                18,

                18,

                WIDTH - 36,

                HEIGHT - 36

            );

            ctx.lineWidth = 5;

            ctx.strokeStyle = COLORS.black;

            ctx.strokeRect(

                30,

                30,

                WIDTH - 60,

                HEIGHT - 60

            );

        }

        function drawHeader() {

            ctx.fillStyle = COLORS.black;

            ctx.fillRect(0, 0, WIDTH, 72);

            ctx.fillStyle = COLORS.gold;

            ctx.font = "bold 34px Anton";

            ctx.textAlign = "center";

            ctx.fillText(

                "DAILY PLANET",

                WIDTH / 2,

                47

            );

            ctx.font = "20px Arial";

            ctx.fillStyle = "#DDDDDD";

            ctx.fillText(

                "COMIC QUOTE",

                WIDTH / 2,

                67

            );

        }

        drawHalftone();
        drawSkyline();
        drawFrame();
        drawHeader();
      

function drawUserPanel() {

    const panelX = 45;
    const panelY = 95;
    const panelW = 270;
    const panelH = 560;


    ctx.shadowColor = COLORS.shadow;
    ctx.shadowBlur = 20;
    ctx.shadowOffsetY = 8;

    roundRect(
        panelX,
        panelY,
        panelW,
        panelH,
        22
    );

    ctx.fillStyle = COLORS.panel;
    ctx.fill();

    ctx.shadowBlur = 0;
    ctx.shadowOffsetY = 0;

    ctx.lineWidth = 6;
    ctx.strokeStyle = COLORS.black;
    ctx.stroke();


    ctx.fillStyle = COLORS.gold;

    roundRect(
        panelX,
        panelY,
        panelW,
        75,
        22
    );

    ctx.fill();


    ctx.fillStyle = COLORS.black;
    ctx.font = "bold 22px Anton";
    ctx.textAlign = "center";

    ctx.fillText(
        "DAILY PLANET",
        panelX + panelW / 2,
        panelY + 46
    );


    const avatarSize = 180;

    const avatarX =
        panelX + (panelW - avatarSize) / 2;

    const avatarY = panelY + 95;

    ctx.save();

    ctx.beginPath();

    ctx.arc(
        avatarX + avatarSize / 2,
        avatarY + avatarSize / 2,
        avatarSize / 2,
        0,
        Math.PI * 2
    );

    ctx.closePath();

    ctx.clip();

    ctx.drawImage(
        avatar,
        avatarX,
        avatarY,
        avatarSize,
        avatarSize
    );

    ctx.restore();

    ctx.beginPath();

    ctx.arc(
        avatarX + avatarSize / 2,
        avatarY + avatarSize / 2,
        avatarSize / 2,
        0,
        Math.PI * 2
    );

    ctx.lineWidth = 8;
    ctx.strokeStyle = COLORS.white;
    ctx.stroke();

    ctx.lineWidth = 4;
    ctx.strokeStyle = COLORS.black;
    ctx.stroke();


    ctx.fillStyle = COLORS.white;

    ctx.font = "bold 34px Anton";

    ctx.textAlign = "center";

    let nickname = displayName;

    if (nickname.length > 18)
        nickname = nickname.slice(0, 15) + "...";

    ctx.fillText(
        nickname,
        panelX + panelW / 2,
        avatarY + 235
    );


    let role = "MEMBRO";

    if (member.roles.highest) {

        role = member.roles.highest.name.toUpperCase();

        if (role === "@EVERYONE")
            role = "MEMBRO";

        if (role.length > 20)
            role = role.slice(0, 17) + "...";

    }

    ctx.font = "20px Arial";
    ctx.fillStyle = "#DDDDDD";

    ctx.fillText(
        role,
        panelX + panelW / 2,
        avatarY + 270
    );


    ctx.strokeStyle = COLORS.gold;
    ctx.lineWidth = 3;

    ctx.beginPath();

    ctx.moveTo(
        panelX + 30,
        avatarY + 295
    );

    ctx.lineTo(
        panelX + panelW - 30,
        avatarY + 295
    );

    ctx.stroke();


    ctx.fillStyle = COLORS.gold;

    ctx.font = "bold 18px Arial";

    ctx.fillText(
        date,
        panelX + panelW / 2,
        avatarY + 335
    );


    ctx.fillStyle = "#CCCCCC";

    ctx.font = "16px Arial";

    ctx.fillText(
        time,
        panelX + panelW / 2,
        avatarY + 362
    );


    ctx.fillStyle = "rgba(255,255,255,.06)";

    roundRect(
        panelX + 25,
        panelY + 470,
        panelW - 50,
        55,
        12
    );

    ctx.fill();

    ctx.fillStyle = COLORS.gold;

    ctx.font = "bold 22px Anton";

    ctx.fillText(
        "DAILY PLANET",
        panelX + panelW / 2,
        panelY + 505
    );

}


drawUserPanel();


const bubble = {
    x: 350,
    y: 100,
    width: 810,
    height: 520,
    radius: 30
};

function drawSpeechBubble() {

    ctx.shadowColor = COLORS.shadow;
    ctx.shadowBlur = 22;
    ctx.shadowOffsetY = 10;

    ctx.fillStyle = COLORS.white;

    roundRect(
        bubble.x,
        bubble.y,
        bubble.width,
        bubble.height,
        bubble.radius
    );

    ctx.fill();

    ctx.shadowBlur = 0;
    ctx.shadowOffsetY = 0;

    ctx.lineWidth = 8;
    ctx.strokeStyle = COLORS.black;
    ctx.stroke();


    ctx.beginPath();

    ctx.moveTo(
        bubble.x,
        bubble.y + 170
    );

    ctx.lineTo(
        bubble.x - 45,
        bubble.y + 205
    );

    ctx.lineTo(
        bubble.x,
        bubble.y + 235
    );

    ctx.closePath();

    ctx.fillStyle = COLORS.white;
    ctx.fill();

    ctx.lineWidth = 8;
    ctx.stroke();


    ctx.fillStyle = "rgba(0,0,0,.08)";
    ctx.font = "160px Georgia";

    ctx.textAlign = "left";

    ctx.fillText(
        "“",
        bubble.x + 25,
        bubble.y + 120
    );

    ctx.textAlign = "right";

    ctx.fillText(
        "”",
        bubble.x + bubble.width - 25,
        bubble.y + bubble.height - 15
    );

}

drawSpeechBubble();



const padding = 55;

const maxWidth =
    bubble.width - padding * 2;

const maxHeight =
    bubble.height - padding * 2;

function splitLongWord(word, maxWidth) {

    const pieces = [];

    let current = "";

    for (const letter of word) {

        const test = current + letter;

        if (ctx.measureText(test).width > maxWidth) {

            pieces.push(current);

            current = letter;

        } else {

            current = test;

        }

    }

    if (current.length)
        pieces.push(current);

    return pieces;

}

function wrapText(text, size) {

    ctx.font = `bold ${size}px Arial`;

    const words = text.split(/\s+/);

    const lines
  
const glow = ctx.createLinearGradient(
    0,
    0,
    0,
    180
);

glow.addColorStop(
    0,
    "rgba(255,255,255,.18)"
);

glow.addColorStop(
    1,
    "rgba(255,255,255,0)"
);

ctx.fillStyle = glow;

ctx.fillRect(
    0,
    0,
    WIDTH,
    180
);


ctx.strokeStyle = "rgba(255,255,255,.06)";
ctx.lineWidth = 2;

for(let i=0;i<18;i++){

    ctx.beginPath();

    ctx.moveTo(
        360+i*42,
        HEIGHT-90
    );

    ctx.lineTo(
        380+i*42,
        HEIGHT-60
    );

    ctx.stroke();

}


ctx.beginPath();

ctx.arc(
    WIDTH-70,
    65,
    26,
    0,
    Math.PI*2
);

ctx.fillStyle=COLORS.gold;
ctx.fill();

ctx.lineWidth=4;
ctx.strokeStyle=COLORS.black;
ctx.stroke();

ctx.fillStyle=COLORS.black;

ctx.font="bold 16px Anton";

ctx.textAlign="center";

ctx.fillText(
    "DP",
    WIDTH-70,
    71
);


ctx.textAlign="left";

ctx.fillStyle="rgba(255,255,255,.45)";

ctx.font="18px Arial";

ctx.fillText(

    "Daily Planet • Comic Quote",

    40,

    HEIGHT-18

);

ctx.strokeStyle="rgba(255,255,255,.15)";
ctx.lineWidth=2;

ctx.strokeRect(
    38,
    38,
    WIDTH-76,
    HEIGHT-76
);


const attachment = new AttachmentBuilder(

    canvas.toBuffer("image/png"),

    {

        name:"quote.png"

    }

);

await interaction.editReply({

    files:[attachment]

});

}catch(err){

    console.error(err);

    await interaction.editReply({

        content:"❌ Falha ao gerar a quote."

    });

}

return;

    }

    
              
  if (!interaction.isChatInputCommand()) return;

  const { commandName } = interaction;

  if (commandName === 'headline') {
    const title = interaction.options.getString('title');
    const content = interaction.options.getString('content');

    const embed = new EmbedBuilder()
      .setColor(0x1a1a2e)
      .setAuthor({ name: 'DAILY PLANET', iconURL: 'https://cdn.discordapp.com/attachments/1524550838758932686/1532553820838563954/Novo_projeto_56_D87546D.png?ex=6a6d4578&is=6a6bf3f8&hm=82b8964e447e4fdb44587aebb223b80c9380d32473c0bb56321258fa9b033f07&' })
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
      .setDescription(`**${p1.username}** ❤️ ** ${p2.username}**\n\n**Compatibility:**  ${percentage}%\n\n ${phrase}`)
      .setFooter({ text: 'Research conducted by the Daily Planet gossip department' });

    await interaction.reply({ embeds: [embed] });
  }

  if (commandName === 'marry') {
    const p1 = interaction.options.getUser('person1');
    const p2 = interaction.options.getUser('person2');

    const embed = new EmbedBuilder()
      .setColor(0xffd700)
      .setTitle('💒 Official Daily Planet Ceremony')
      .setDescription(`Today, before the readers of Metropolis...\n\n**${p1}** and ** ${p2}**\n\nare officially **married** by the power vested in this bot!\n\nMay your love be stronger than kryptonite 💚`)
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
      .setAuthor({ name: 'DAILY PLANET — Today\'s Edition', iconURL: 'https://cdn.discordapp.com/attachments/1524550838758932686/1532553820838563954/Novo_projeto_56_D87546D.png?ex=6a6d4578&is=6a6bf3f8&hm=82b8964e447e4fdb44587aebb223b80c9380d32473c0bb56321258fa9b033f07&' })
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
  const target = interaction.options.getUser('user');

  const roles = [
    'Investigative Reporter',
    'War Photographer',
    'Gossip Columnist',
    'International Correspondent',
    'Sports Editor',
    'Crime Beat Reporter',
    'Political Correspondent',
    'Feature Writer',
    'Night Shift Reporter',
    'Junior Reporter'
  ];

  const role = roles[Math.floor(Math.random() * roles.length)];
  const badgeId = `DP-${Math.floor(100000 + Math.random() * 900000)}`;

  await interaction.deferReply();

  try {
    const canvas = createCanvas(600, 900);
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = '#0f1c2e';
    ctx.fillRect(0, 0, 600, 900);

    ctx.strokeStyle = '#d4af37';
    ctx.lineWidth = 12;
    ctx.strokeRect(15, 15, 570, 870);

    ctx.strokeStyle = '#f0e6c8';
    ctx.lineWidth = 3;
    ctx.strokeRect(30, 30, 540, 840);

    ctx.beginPath();
    ctx.arc(300, 68, 26, 0, Math.PI * 2);
    ctx.fillStyle = '#0a1220';
    ctx.fill();

    ctx.beginPath();
    ctx.arc(300, 68, 26, 0, Math.PI * 2);
    ctx.strokeStyle = '#d4af37';
    ctx.lineWidth = 5;
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(300, 68, 18, 0, Math.PI * 2);
    ctx.fillStyle = '#1a2a40';
    ctx.fill();

    ctx.beginPath();
    ctx.arc(300, 68, 18, 0, Math.PI * 2);
    ctx.strokeStyle = '#b8962e';
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(300, 68, 9, 0, Math.PI * 2);
    ctx.fillStyle = '#0a1220';
    ctx.fill();

    ctx.fillStyle = '#d4af37';
    ctx.font = 'bold 28px Georgia';
    ctx.textAlign = 'center';
    ctx.fillText('DAILY PLANET', 300, 130);

    ctx.fillStyle = '#a0b4c8';
    ctx.font = '15px Georgia';
    ctx.fillText('METROPOLIS  •  PRESS CREDENTIAL', 300, 155);

    ctx.beginPath();
    ctx.moveTo(80, 175);
    ctx.lineTo(520, 175);
    ctx.strokeStyle = '#d4af37';
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.fillStyle = '#1a2a40';
    ctx.fillRect(175, 200, 250, 250);

    ctx.strokeStyle = '#d4af37';
    ctx.lineWidth = 5;
    ctx.strokeRect(175, 200, 250, 250);

    const avatar = await loadImage(
      target.displayAvatarURL({ extension: 'png', size: 512 })
    );
    ctx.drawImage(avatar, 185, 210, 230, 230);

    ctx.fillStyle = 'rgba(15, 28, 46, 0.15)';
    ctx.fillRect(185, 210, 230, 230);

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 32px Georgia';
    ctx.fillText(target.username.toUpperCase(), 300, 500);

    ctx.fillStyle = '#d4af37';
    ctx.font = 'bold 20px Georgia';
    ctx.fillText(role.toUpperCase(), 300, 540);

    ctx.beginPath();
    ctx.moveTo(120, 570);
    ctx.lineTo(480, 570);
    ctx.strokeStyle = '#3a5068';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    ctx.fillStyle = '#a0b4c8';
    ctx.font = '16px Georgia';
    ctx.fillText('BADGE ID', 300, 610);

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 26px Courier New';
    ctx.fillText(badgeId, 300, 650);

    ctx.fillStyle = '#a0b4c8';
    ctx.font = '15px Georgia';
    ctx.fillText('ISSUED', 300, 700);

    ctx.fillStyle = '#ffffff';
    ctx.font = '18px Georgia';
    ctx.fillText(new Date().toLocaleDateString('en-US'), 300, 730);

    ctx.beginPath();
    ctx.moveTo(80, 780);
    ctx.lineTo(520, 780);
    ctx.strokeStyle = '#d4af37';
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.fillStyle = '#a0b4c8';
    ctx.font = '13px Georgia';
    ctx.fillText('Authorized by Perry White  •  Editor-in-Chief', 300, 820);

    ctx.fillStyle = '#d4af37';
    ctx.font = 'bold 14px Georgia';
    ctx.fillText('THE MOST TRUSTED NEWSPAPER IN METROPOLIS', 300, 855);

    const attachment = new AttachmentBuilder(canvas.toBuffer('image/png'), {
      name: 'press-badge.png'
    });

    const embed = new EmbedBuilder()
      .setColor(0x0f1c2e)
      .setTitle('📋 Press Badge Issued')
      .setDescription(
        `**${target}** has been officially hired by the **Daily Planet**!\n\n` +
        `**Position:** ${role}\n` +
        `**Badge ID:** \`${badgeId}\`\n\n` +
        `Welcome to the team. Don't disappoint Perry White.`
      )
      .setImage('attachment://press-badge.png')
      .setFooter({ text: 'Daily Planet • Metropolis' })
      .setTimestamp();

    await interaction.editReply({
      embeds: [embed],
      files: [attachment]
    });

  } catch (error) {
    console.error('Error generating press badge:', error);
    await interaction.editReply({
      content: '❌ Failed to generate the press badge.'
    });
  }
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
    'Answer calculated with 99.97% accuracy: the truth lies in the details you have not yet observed.'
  ];

  const answer = answers[Math.floor(Math.random() * answers.length)];

  const stages = [
    { bar: '▰▱▱▱▱▱▱▱', text: 'Initializing...' },
    { bar: '▰▰▰▱▱▱▱▱', text: 'Accessing archives...' },
    { bar: '▰▰▰▰▰▱▱▱', text: 'Running simulations...' },
    { bar: '▰▰▰▰▰▰▰▱', text: 'Finalizing...' }
  ];

  await interaction.deferReply();

  for (const stage of stages) {
    const embed = new EmbedBuilder()
      .setColor(0x00d4ff)
      .setDescription(
`\`\`\`
${stage.bar}
${stage.text}
\`\`\`

**Query:** \`${query}\``
      );

    await interaction.editReply({ embeds: [embed] });
    await new Promise(r => setTimeout(r, 700));
  }

  const finalEmbed = new EmbedBuilder()
    .setColor(0x00d4ff)
    .setAuthor({
      name: 'Fortress of Solitude Supercomputer',
    })
    .setThumbnail('https://cdn.discordapp.com/attachments/1524550838758932686/1532553820838563954/Novo_projeto_56_D87546D.png')
    .setDescription(
`**Query**

\`\`\`
${query}
\`\`\`

**Result**

${answer}`
    )
    .setImage('attachment://supercomputer.gif')
    .setFooter({ text: 'Kryptonian OS • Sector 2814' })
    .setTimestamp();

  await interaction.editReply({
    embeds: [finalEmbed],
    files: ['supercomputer.gif']
  });
            }
       
        if (commandName === 'lantern') {
  const corps = [
    {
      name: 'Green Lantern Corps',
      color: 0x00ff00,
      emoji: '🟢',
      gif: 'green-lantern.gif',
      message: 'The ring has scanned your willpower... and found it unbreakable. You have been selected to protect Sector 2814 and beyond.',
      oath: `In brightest day, in blackest night,
No evil shall escape my sight.
Let those who worship evil's might,
Beware my power—Green Lantern's light!`
    },
    {
      name: 'Sinestro Corps',
      color: 0xffff00,
      emoji: '🟡',
      gif: 'sinestro.gif',
      message: 'Fear is the purest emotion. The yellow ring has chosen you to spread terror across the stars in the name of order.',
      oath: `In blackest day, in brightest night,
Beware your fears made into light.
Let those who try to stop what's right,
Burn like my power—Sinestro's might!`
    },
    {
      name: 'Red Lantern Corps',
      color: 0xff0000,
      emoji: '🔴',
      gif: 'dc-injustice.gif',
      message: 'Rage has consumed your heart. The red ring answers only to pure, burning hatred. Bleed for the Corps.',
      oath: `With blood and rage of crimson red,
Ripped from a corpse so freshly dead,
Together with our hellish hate,
We'll burn you all—that is your fate!`
    },
    {
      name: 'Blue Lantern Corps',
      color: 0x00bfff,
      emoji: '🔵',
      gif: 'blue-lantern.gif',
      message: 'In the darkest hour, hope still burns. The blue ring has found a soul capable of inspiring others when all seems lost.',
      oath: `In fearful day, in raging night,
With strong hearts full, our souls ignite.
When all seems lost in the War of Light,
Look to the stars—for hope burns bright!`
    },
    {
      name: 'Orange Lantern Corps',
      color: 0xffa500,
      emoji: '🟠',
      gif: 'orange-lantern.gif',
      message: 'Greed is eternal. The orange ring belongs to you now... and only you. Everything else is yours to take.',
      oath: `What's mine is mine and mine and mine.
And mine and mine and mine!
Not yours!`
    },
    {
      name: 'Star Sapphire Corps',
      color: 0xda70d6,
      emoji: '🟣',
      gif: 'star-sapphire.gif',
      message: 'Love is the most powerful force in the universe. The violet light has chosen you to protect those you hold dear... by any means necessary.',
      oath: `For hearts long lost and full of fright,
For those alone in Blackest Night,
Accept our ring and join our fight.
Love conquers all—with violet light!`
    },
    {
      name: 'Black Lantern Corps',
      color: 0x1a1a1a,
      emoji: '⚫',
      gif: 'black-lantern-corps-green-lantern.gif',
      message: 'Death has claimed you. Rise, Black Lantern. The Blackest Night is upon us... and the dead shall feast.',
      oath: `The Blackest Night falls from the skies,
The darkness grows as all light dies.
We crave your hearts and your demise,
By my black hand—the dead shall rise!`
    },
    {
      name: 'White Lantern Corps',
      color: 0xffffff,
      emoji: '⚪',
      gif: 'white-lantern.gif',
      message: 'Life itself has answered. The white light of the Entity flows through you. You are the embodiment of existence.',
      oath: `In brightest day, there will be light.
To cleanse the soul and set wrongs right.
When darkness falls, look to the skies.
A new dawn comes. Let there be light!`
    },
    {
      name: 'Indigo Tribe',
      color: 0x4b0082,
      emoji: '💜',
      gif: 'dc-comics-compassion.gif',
      message: 'Compassion has found a new vessel. The indigo light forces understanding upon those who once knew only cruelty.',
      oath: `Tor lorek san, bor nakka mur,
Natromo faan tornek wot ur.
Ter lantern ker lo Abin Sur,
Taan lek lek nok—Formorrow Sur!`
    }
  ];

  const chosen = corps[Math.floor(Math.random() * corps.length)];

  const embed = new EmbedBuilder()
    .setColor(chosen.color)
    .setAuthor({
      name: 'LANTERN CORPS RECRUITMENT',
      iconURL: 'https://cdn.discordapp.com/attachments/1524550838758932686/1532553820838563954/Novo_projeto_56_D87546D.png?ex=6a6d4578&is=6a6bf3f8&hm=82b8964e447e4fdb44587aebb223b80c9380d32473c0bb56321258fa9b033f07&'
    })
    .setTitle(`${chosen.emoji} ${chosen.name}`)
    .setDescription(
`${chosen.message}

**Oath of the Corps:**
\`\`\`
${chosen.oath}
\`\`\``
    )
    .setImage(`attachment://${chosen.gif}`)
    .addFields(
      {
        name: 'Recruit',
        value: interaction.user.username,
        inline: true
      },
      {
        name: 'Date',
        value: new Date().toLocaleDateString('en-US'),
        inline: true
      }
    )
    .setFooter({
      text: 'The ring always finds those worthy • Daily Planet Archives'
    })
    .setTimestamp();
          await interaction.reply({
    embeds:[embed],
    files:[chosen.gif]
});
        }

  
if (commandName === 'wanted') {
  const target = interaction.options.getUser('user');
  const reward = interaction.options.getString('reward') || '$50,000';
  const crime = interaction.options.getString('crime') || 'Crimes against Metropolis';

  await interaction.deferReply();

  try {
    const canvas = createCanvas(900, 1300);
    const ctx = canvas.getContext('2d');

    const paper = await loadImage('https://cdn.discordapp.com/attachments/1525521626047713442/1532786886534365264/36cb406532ca909724daffd01f08ba27.jpg?ex=6a6e1e87&is=6a6ccd07&hm=0ebd9dbcd7f013789c811885e63c2f21214a7390dab1432ccc2152c0d926ac12&');
    ctx.drawImage(paper, 0, 0, 900, 1300);

    const vignette = ctx.createRadialGradient(450, 650, 300, 450, 650, 750);
    vignette.addColorStop(0, 'rgba(0,0,0,0)');
    vignette.addColorStop(1, 'rgba(0,0,0,0.45)');
    ctx.fillStyle = vignette;
    ctx.fillRect(0, 0, 900, 1300);

    ctx.lineWidth = 18;
    ctx.strokeStyle = '#2a1a0a';
    ctx.strokeRect(25, 25, 850, 1250);

    ctx.lineWidth = 5;
    ctx.strokeStyle = '#5c3b1e';
    ctx.strokeRect(45, 45, 810, 1210);

    ctx.textAlign = 'center';
    ctx.fillStyle = '#1a0f05';
    ctx.shadowColor = 'rgba(0,0,0,0.6)';
    ctx.shadowBlur = 8;

    ctx.font = 'bold 92px Georgia';
    ctx.fillText('WANTED', 450, 130);

    ctx.shadowBlur = 0;
    ctx.font = 'bold 36px Georgia';
    ctx.fillText('DEAD OR ALIVE', 450, 185);

    ctx.beginPath();
    ctx.moveTo(160, 210);
    ctx.lineTo(740, 210);
    ctx.lineWidth = 3;
    ctx.strokeStyle = '#2a1a0a';
    ctx.stroke();

    ctx.fillStyle = '#3d2a15';
    ctx.fillRect(200, 245, 500, 500);

    ctx.fillStyle = '#6b4e2e';
    ctx.fillRect(215, 260, 470, 470);

    ctx.fillStyle = '#f0e6d0';
    ctx.fillRect(230, 275, 440, 440);

    const avatar = await loadImage(
      target.displayAvatarURL({ extension: 'png', size: 512 })
    );

    ctx.drawImage(avatar, 240, 285, 420, 420);

    const imageData = ctx.getImageData(240, 285, 420, 420);
    const data = imageData.data;

    for (let i = 0; i < data.length; i += 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];

      const tr = Math.min(255, r * 0.393 + g * 0.769 + b * 0.189);
      const tg = Math.min(255, r * 0.349 + g * 0.686 + b * 0.168);
      const tb = Math.min(255, r * 0.272 + g * 0.534 + b * 0.131);

      const noise = (Math.random() - 0.5) * 25;
      data[i]     = Math.max(0, Math.min(255, tr * 0.85 + noise));
      data[i + 1] = Math.max(0, Math.min(255, tg * 0.85 + noise));
      data[i + 2] = Math.max(0, Math.min(255, tb * 0.85 + noise));
    }

    ctx.putImageData(imageData, 240, 285);

    ctx.fillStyle = 'rgba(120, 90, 50, 0.18)';
    ctx.fillRect(240, 285, 420, 420);

    ctx.fillStyle = '#1a0f05';
    ctx.font = 'bold 48px Georgia';
    ctx.fillText(target.username.toUpperCase(), 450, 800);

    ctx.font = 'bold 30px Georgia';
    ctx.fillText('WANTED FOR', 450, 855);

    ctx.font = '26px Georgia';
    ctx.fillStyle = '#2e1c0c';

    const words = crime.split(' ');
    let line = '';
    let lines = [];
    for (const word of words) {
      const test = line + word + ' ';
      if (ctx.measureText(test).width > 620) {
        lines.push(line.trim());
        line = word + ' ';
      } else {
        line = test;
      }
    }
    lines.push(line.trim());

    let y = 900;
    for (const l of lines.slice(0, 4)) {
      ctx.fillText(l, 450, y);
      y += 36;
    }

    const boxY = y + 25;

    ctx.fillStyle = '#5c0000';
    ctx.fillRect(160, boxY, 580, 140);

    ctx.strokeStyle = '#1a0000';
    ctx.lineWidth = 6;
    ctx.strokeRect(160, boxY, 580, 140);

    ctx.fillStyle = '#f0d78c';
    ctx.font = 'bold 34px Georgia';
    ctx.fillText('REWARD', 450, boxY + 50);

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 58px Georgia';
    ctx.fillText(reward, 450, boxY + 115);

    ctx.beginPath();
    ctx.arc(760, 340, 78, 0, Math.PI * 2);
    ctx.fillStyle = '#7a0000';
    ctx.fill();

    ctx.lineWidth = 5;
    ctx.strokeStyle = '#e8c96a';
    ctx.stroke();

    ctx.save();
    ctx.translate(760, 340);
    ctx.rotate(-0.4);

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 22px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('MOST', 0, -10);
    ctx.fillText('WANTED', 0, 20);
    ctx.restore();

    ctx.beginPath();
    ctx.moveTo(130, 1185);
    ctx.lineTo(770, 1185);
    ctx.strokeStyle = '#2a1a0a';
    ctx.lineWidth = 2.5;
    ctx.stroke();

    ctx.fillStyle = '#1a0f05';
    ctx.font = 'bold 22px Georgia';
    ctx.fillText('METROPOLIS POLICE DEPARTMENT', 450, 1225);

    ctx.font = '18px Georgia';
    ctx.fillText('Issued by the Daily Planet Archives', 450, 1260);

    const attachment = new AttachmentBuilder(canvas.toBuffer('image/png'), {
      name: 'wanted.png'
    });

    await interaction.editReply({ files: [attachment] });

  } catch (error) {
    console.error(error);
    await interaction.editReply({
      content: '❌ Failed to generate the Wanted poster.'
    });
  }
}
});

client.on('messageCreate', async (message) => {
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
        .setFooter({
          text: 'The power of Shazam has been unleashed'
        })
        .setTimestamp();

      await message.reply({
        embeds: [fallbackEmbed]
      });
    }
  }
});

client.login(process.env.TOKEN);
