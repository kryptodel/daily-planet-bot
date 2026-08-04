const { SlashCommandBuilder, AttachmentBuilder } = require('discord.js');
const { createCanvas, loadImage } = require('canvas');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('headline')
    .setDescription('Gera uma página oficial do jornal Daily Planet')
    .addStringOption(opt =>
      opt.setName('title')
        .setDescription('Título da matéria')
        .setRequired(true)
    )
    .addStringOption(opt =>
      opt.setName('content')
        .setDescription('Texto da matéria (use \\n para parágrafos)')
        .setRequired(true)
    )
    .addAttachmentOption(opt =>
      opt.setName('image1')
        .setDescription('Foto principal (aparece no topo)')
        .setRequired(false)
    )
    .addAttachmentOption(opt =>
      opt.setName('image2')
        .setDescription('Segunda foto (aparece mais embaixo)')
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

      // ========== FUNDO ==========
      ctx.fillStyle = '#f4efe6';
      ctx.fillRect(0, 0, 1000, 1450);

      // Borda
      ctx.strokeStyle = '#222';
      ctx.lineWidth = 6;
      ctx.strokeRect(12, 12, 976, 1426);

      // ========== MASTHEAD ==========
      ctx.fillStyle = '#111';
      ctx.fillRect(30, 30, 940, 95);

      ctx.fillStyle = '#f4efe6';
      ctx.font = 'bold 48px Georgia';
      ctx.textAlign = 'center';
      ctx.fillText('Daily Planet', 500, 85);

      ctx.font = '13px Georgia';
      ctx.fillText('A GREAT METROPOLITAN NEWSPAPER  •  METROPOLIS', 500, 110);

      // Linha dourada
      ctx.strokeStyle = '#c9a227';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(40, 140);
      ctx.lineTo(960, 140);
      ctx.stroke();

      // Volume + Data
      const today = new Date().toLocaleDateString('en-US', {
        year: 'numeric', month: 'long', day: 'numeric'
      });

      ctx.fillStyle = '#333';
      ctx.font = '13px Georgia';
      ctx.textAlign = 'left';
      ctx.fillText('Volume 12  |  Issue 47', 45, 162);

      ctx.textAlign = 'right';
      ctx.fillText(today, 955, 162);

      // ========== TÍTULO ==========
      ctx.fillStyle = '#111';
      ctx.font = 'bold 36px Georgia';
      ctx.textAlign = 'center';

      const titleLines = wrapText(ctx, title.toUpperCase(), 900, 36);
      let titleY = 210;
      for (const line of titleLines.slice(0, 3)) {
        ctx.fillText(line, 500, titleY);
        titleY += 42;
      }

      // Linha
      ctx.strokeStyle = '#111';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(60, titleY + 8);
      ctx.lineTo(940, titleY + 8);
      ctx.stroke();

      // Autor
      ctx.fillStyle = '#444';
      ctx.font = 'italic 15px Georgia';
      ctx.textAlign = 'left';
      ctx.fillText(`By ${interaction.user.username}  •  Daily Planet Staff`, 60, titleY + 32);

      let currentY = titleY + 55;

      // ========== IMAGEM 1 (topo direita) ==========
      const hasImg1 = image1 && image1.contentType?.startsWith('image/');
      const hasImg2 = image2 && image2.contentType?.startsWith('image/');

      if (hasImg1) {
        const img = await loadImage(image1.url);
        drawImageCover(ctx, img, 520, currentY, 420, 260);
      }

      // ========== TEXTO EM COLUNAS ==========
      const paragraphs = rawContent.split(/\n+/).filter(p => p.trim());
      const allLines = [];

      ctx.font = '16px Georgia';
      for (const p of paragraphs) {
        const lines = wrapText(ctx, p.trim(), 430, 16);
        allLines.push(...lines, ''); // linha vazia = espaço entre parágrafos
      }

      // Coluna esquerda
      let leftY = currentY + 20;
      let rightY = currentY + 20;
      const leftX = 55;
      const rightX = 520;
      const colWidth = 430;
      const lineHeight = 22;
      const maxY = 1280;

      let lineIndex = 0;

      // Primeiro preenche a coluna esquerda até a altura da imagem 1
      const img1Bottom = hasImg1 ? currentY + 270 : currentY;

      while (lineIndex < allLines.length && leftY < img1Bottom) {
        if (allLines[lineIndex] === '') {
          leftY += 10;
        } else {
          ctx.fillStyle = '#1a1a1a';
          ctx.font = '16px Georgia';
          ctx.textAlign = 'left';
          ctx.fillText(allLines[lineIndex], leftX, leftY);
          leftY += lineHeight;
        }
        lineIndex++;
      }

      // Continua preenchendo as duas colunas
      while (lineIndex < allLines.length) {
        // Coluna esquerda
        if (leftY < maxY) {
          if (allLines[lineIndex] === '') {
            leftY += 10;
          } else {
            ctx.fillStyle = '#1a1a1a';
            ctx.font = '16px Georgia';
            ctx.fillText(allLines[lineIndex], leftX, leftY);
            leftY += lineHeight;
          }
          lineIndex++;
          continue;
        }

        // Coluna direita (só depois da imagem 1)
        if (rightY < maxY && lineIndex < allLines.length) {
          if (allLines[lineIndex] === '') {
            rightY += 10;
          } else {
            ctx.fillStyle = '#1a1a1a';
            ctx.font = '16px Georgia';
            ctx.fillText(allLines[lineIndex], rightX, rightY);
            rightY += lineHeight;
          }
          lineIndex++;
        } else {
          break;
        }
      }

      // ========== IMAGEM 2 (mais embaixo) ==========
      if (hasImg2) {
        const img = await loadImage(image2.url);
        const img2Y = Math.max(leftY, rightY) + 25;
        if (img2Y + 240 < 1380) {
          drawImageCover(ctx, img, 55, img2Y, 890, 240);
        }
      }

      // ========== RODAPÉ ==========
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
      await interaction.editReply({ content: '❌ Falha ao gerar a página do jornal.' });
    }
  }
};

// ========== HELPERS ==========
function wrapText(ctx, text, maxWidth, fontSize) {
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

  ctx.strokeStyle = '#222';
  ctx.lineWidth = 2;
  ctx.strokeRect(x, y, w, h);
}
