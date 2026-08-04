const { SlashCommandBuilder, AttachmentBuilder } = require('discord.js');
const { createCanvas, loadImage } = require('canvas');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('headline')
    .setDescription('Generate an official Daily Planet newspaper page')
    .addStringOption(opt =>
      opt.setName('title')
        .setDescription('Headline title')
        .setRequired(true)
    )
    .addStringOption(opt =>
      opt.setName('content')
        .setDescription('Article content (use \\n for paragraphs)')
        .setRequired(true)
    )
    .addAttachmentOption(opt =>
      opt.setName('image1')
        .setDescription('Main photo (top right) - image or GIF')
        .setRequired(false)
    )
    .addAttachmentOption(opt =>
      opt.setName('image2')
        .setDescription('Second photo (bottom - 4:3) - image or GIF')
        .setRequired(false)
    ),

  async execute(interaction) {
    const title = interaction.options.getString('title');
    const rawContent = interaction.options.getString('content').replace(/\\n/g, '\n');
    const image1 = interaction.options.getAttachment('image1');
    const image2 = interaction.options.getAttachment('image2');

    await interaction.deferReply();

    try {
      const canvas = createCanvas(1000, 1450);
      const ctx = canvas.getContext('2d');

      ctx.fillStyle = '#f4efe6';
      ctx.fillRect(0, 0, 1000, 1450);

      ctx.strokeStyle = '#222';
      ctx.lineWidth = 6;
      ctx.strokeRect(12, 12, 976, 1426);

      ctx.fillStyle = '#111';
      ctx.fillRect(30, 30, 940, 100);

      ctx.fillStyle = '#f4efe6';
      ctx.font = 'bold 46px Georgia';
      ctx.textAlign = 'left';

      const daily = 'Daily';
      const planet = 'Planet';
      const dailyWidth = ctx.measureText(daily).width;
      const planetWidth = ctx.measureText(planet).width;
      const logoSize = 64;
      const gap = 10;
      const totalWidth = dailyWidth + gap + logoSize + gap + planetWidth;
      const startX = 500 - totalWidth / 2;

      ctx.fillText(daily, startX, 82);

      const logoX = startX + dailyWidth + gap + logoSize / 2;
      const logoY = 68;
      const r = 28;

      ctx.beginPath();
      ctx.arc(logoX, logoY, r, 0, Math.PI * 2);
      ctx.fillStyle = '#e8b923';
      ctx.fill();

      ctx.strokeStyle = '#1a1a1a';
      ctx.lineWidth = 1.3;

      for (let i = -2; i <= 2; i++) {
        const y = logoY + i * 9;
        const halfW = Math.sqrt(Math.max(0, r * r - (i * 9) * (i * 9))) * 0.95;
        if (halfW > 0) {
          ctx.beginPath();
          ctx.moveTo(logoX - halfW, y);
          ctx.lineTo(logoX + halfW, y);
          ctx.stroke();
        }
      }

      ctx.beginPath();
      ctx.ellipse(logoX, logoY, r * 0.35, r, 0, 0, Math.PI * 2);
      ctx.stroke();
      ctx.beginPath();
      ctx.ellipse(logoX, logoY, r * 0.7, r, 0, 0, Math.PI * 2);
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(logoX, logoY, r, 0, Math.PI * 2);
      ctx.strokeStyle = '#1a1a1a';
      ctx.lineWidth = 2;
      ctx.stroke();

      ctx.save();
      ctx.translate(logoX, logoY);
      ctx.rotate(-0.25);

      ctx.fillStyle = '#1a3a8f';
      ctx.beginPath();
      ctx.moveTo(-48, -7);
      ctx.lineTo(48, -7);
      ctx.lineTo(52, 0);
      ctx.lineTo(48, 7);
      ctx.lineTo(-48, 7);
      ctx.lineTo(-52, 0);
      ctx.closePath();
      ctx.fill();

      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 11px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('DAILY PLANET', 0, 0);
      ctx.restore();

      ctx.fillStyle = '#f4efe6';
      ctx.font = 'bold 46px Georgia';
      ctx.textAlign = 'left';
      ctx.fillText(planet, startX + dailyWidth + gap + logoSize + gap, 82);

      ctx.font = '12px Georgia';
      ctx.textAlign = 'center';
      ctx.fillText('A GREAT METROPOLITAN NEWSPAPER  •  METROPOLIS', 500, 118);

      ctx.strokeStyle = '#c9a227';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(40, 145);
      ctx.lineTo(960, 145);
      ctx.stroke();

      const today = new Date().toLocaleDateString('en-US', {
        year: 'numeric', month: 'long', day: 'numeric'
      });

      ctx.fillStyle = '#333';
      ctx.font = '13px Georgia';
      ctx.textAlign = 'left';
      ctx.fillText('Volume 12  |  Issue 47', 45, 168);
      ctx.textAlign = 'right';
      ctx.fillText(today, 955, 168);

      ctx.fillStyle = '#111';
      ctx.font = 'bold 34px Georgia';
      ctx.textAlign = 'center';

      const titleLines = wrapText(ctx, title.toUpperCase(), 900);
      let titleY = 210;
      for (const line of titleLines.slice(0, 3)) {
        ctx.fillText(line, 500, titleY);
        titleY += 40;
      }

      ctx.strokeStyle = '#111';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(60, titleY + 6);
      ctx.lineTo(940, titleY + 6);
      ctx.stroke();

      ctx.fillStyle = '#444';
      ctx.font = 'italic 14px Georgia';
      ctx.textAlign = 'left';
      ctx.fillText(`By ${interaction.user.username}  •  Daily Planet Staff`, 60, titleY + 28);

      let contentY = titleY + 50;

      const hasImg1 = image1 && (image1.contentType?.startsWith('image/') || image1.contentType === 'image/gif');
      const hasImg2 = image2 && (image2.contentType?.startsWith('image/') || image2.contentType === 'image/gif');

      if (hasImg1) {
        const img = await loadImage(image1.url);
        drawImageCover(ctx, img, 530, contentY, 410, 240);
      }

      const img2W = 420;
      const img2H = 315;
      const img2Y = 1020;
      if (hasImg2) {
        const img = await loadImage(image2.url);
        drawImageCover(ctx, img, 55, img2Y, img2W, img2H);
      }

      const paragraphs = rawContent.split(/\n+/).filter(p => p.trim());

      const leftX = 55;
      const rightX = 530;
      const maxTextWidth = 450;
      const topLimit = contentY + 18;
      const bottomLimit = hasImg2 ? img2Y - 20 : 1360;
      const availableHeight = bottomLimit - topLimit;

      let fontSize = 17;
      let lineHeight = 24;
      let allLines = [];
      let totalHeight = 0;

      for (let size = 22; size >= 13; size--) {
        ctx.font = `${size}px Georgia`;
        const tempLines = [];
        let height = 0;

        for (const p of paragraphs) {
          const lines = wrapText(ctx, p.trim(), maxTextWidth);
          tempLines.push(...lines);
          tempLines.push('');
        }

        if (tempLines[tempLines.length - 1] === '') tempLines.pop();

        height = tempLines.length * (size + 7);

        if (height <= availableHeight || size === 13) {
          fontSize = size;
          lineHeight = size + 7;
          allLines = tempLines;
          totalHeight = height;
          break;
        }
      }

      if (totalHeight < availableHeight * 0.45 && fontSize < 20) {
        fontSize = Math.min(20, fontSize + 3);
        lineHeight = fontSize + 7;
        ctx.font = `${fontSize}px Georgia`;
        allLines = [];
        for (const p of paragraphs) {
          const lines = wrapText(ctx, p.trim(), maxTextWidth);
          allLines.push(...lines);
          allLines.push('');
        }
        if (allLines[allLines.length - 1] === '') allLines.pop();
      }

      let leftY = topLimit;
      let rightY = hasImg1 ? contentY + 255 : topLimit;
      let i = 0;

      while (i < allLines.length && leftY < (hasImg1 ? contentY + 250 : bottomLimit)) {
        if (allLines[i] !== '') {
          ctx.fillStyle = '#1a1a1a';
          ctx.font = `${fontSize}px Georgia`;
          ctx.textAlign = 'left';
          ctx.fillText(allLines[i], leftX, leftY);
        }
        leftY += allLines[i] === '' ? fontSize * 0.5 : lineHeight;
        i++;
      }

      const limitBeforeImg2 = hasImg2 ? img2Y - 15 : 1360;

      while (i < allLines.length) {
        if (leftY < limitBeforeImg2) {
          if (allLines[i] !== '') {
            ctx.fillStyle = '#1a1a1a';
            ctx.font = `${fontSize}px Georgia`;
            ctx.fillText(allLines[i], leftX, leftY);
          }
          leftY += allLines[i] === '' ? fontSize * 0.5 : lineHeight;
          i++;
        } else if (rightY < limitBeforeImg2) {
          if (allLines[i] !== '') {
            ctx.fillStyle = '#1a1a1a';
            ctx.font = `${fontSize}px Georgia`;
            ctx.fillText(allLines[i], rightX, rightY);
          }
          rightY += allLines[i] === '' ? fontSize * 0.5 : lineHeight;
          i++;
        } else break;
      }

      if (hasImg2) {
        let sideY = img2Y + 12;
        const sideMax = img2Y + img2H - 12;

        while (i < allLines.length && sideY < sideMax) {
          if (allLines[i] !== '') {
            ctx.fillStyle = '#1a1a1a';
            ctx.font = `${fontSize}px Georgia`;
            ctx.fillText(allLines[i], rightX, sideY);
          }
          sideY += allLines[i] === '' ? fontSize * 0.5 : lineHeight;
          i++;
        }
      }

      ctx.strokeStyle = '#222';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(50, 1395);
      ctx.lineTo(950, 1395);
      ctx.stroke();

      ctx.fillStyle = '#555';
      ctx.font = '12px Georgia';
      ctx.textAlign = 'center';
      ctx.fillText('THE MOST TRUSTED NEWSPAPER IN METROPOLIS  •  DAILY PLANET', 500, 1420);

      const attachment = new AttachmentBuilder(canvas.toBuffer('image/png'), {
        name: 'daily-planet-page.png'
      });

      await interaction.editReply({ files: [attachment] });

    } catch (error) {
      console.error(error);
      await interaction.editReply({ content: '❌ Failed to generate the newspaper page.' });
    }
  }
};

function wrapText(ctx, text, maxWidth) {
  const words = text.split(' ');
  const lines = [];
  let current = '';

  for (const word of words) {
    const test = current ? `${current} ${word}` : word;
    if (ctx.measureText(test).width > maxWidth && current) {
      lines.push(current);
      current = word;
    } else {
      current = test;
    }
  }
  if (current) lines.push(current);
  return lines;
}

function drawImageCover(ctx, img, x, y, w, h) {
  const imgRatio = img.width / img.height;
  const areaRatio = w / h;
  let sx, sy, sw, sh;

  if (imgRatio > areaRatio) {
    sh = img.height;
    sw = img.height * areaRatio;
    sx = (img.width - sw) / 2;
    sy = 0;
  } else {
    sw = img.width;
    sh = img.width / areaRatio;
    sx = 0;
    sy = (img.height - sh) / 2;
  }

  ctx.save();
  ctx.beginPath();
  ctx.rect(x, y, w, h);
  ctx.clip();
  ctx.drawImage(img, sx, sy, sw, sh, x, y, w, h);
  ctx.restore();
  }
