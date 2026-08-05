const { SlashCommandBuilder, AttachmentBuilder } = require('discord.js');
const { createCanvas, loadImage } = require('canvas');

module.exports = {
  data: new SlashCommandBuilder()
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

  async execute(interaction) {
    const target = interaction.options.getUser('user');
    const member = interaction.options.getMember('user');
    const displayName = member?.displayName || target.globalName || target.username;
    const reward = interaction.options.getString('reward') || '$50,000';
    const crime = interaction.options.getString('crime') || 'Crimes against Metropolis';

    await interaction.deferReply();

    try {
      const canvas = createCanvas(900, 1300);
      const ctx = canvas.getContext('2d');

      const paper = await loadImage('https://cdn.discordapp.com/attachments/1525521626047713442/1532786886534365264/36cb406532ca909724daffd01f08ba27.jpg');
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
        data[i] = Math.max(0, Math.min(255, tr * 0.85 + noise));
        data[i + 1] = Math.max(0, Math.min(255, tg * 0.85 + noise));
        data[i + 2] = Math.max(0, Math.min(255, tb * 0.85 + noise));
      }

      ctx.putImageData(imageData, 240, 285);

      ctx.fillStyle = 'rgba(120, 90, 50, 0.18)';
      ctx.fillRect(240, 285, 420, 420);

      ctx.fillStyle = '#1a0f05';
      ctx.font = 'bold 48px Georgia';
      ctx.fillText(displayName.toUpperCase(), 450, 800);

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

      let rewardFontSize = 58;
      ctx.font = `bold ${rewardFontSize}px Georgia`;
      while (ctx.measureText(reward).width > 520 && rewardFontSize > 24) {
        rewardFontSize -= 2;
        ctx.font = `bold ${rewardFontSize}px Georgia`;
      }

      ctx.fillStyle = '#ffffff';
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
};
