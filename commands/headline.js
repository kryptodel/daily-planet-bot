const { SlashCommandBuilder, AttachmentBuilder } = require('discord.js');
const { createCanvas, loadImage, registerFont } = require('canvas');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('headline')
    .setDescription('Gera uma página oficial do jornal Daily Planet')
    .addStringOption(opt =>
      opt.setName('title')
        .setDescription('Título da matéria (headline)')
        .setRequired(true)
    )
    .addStringOption(opt =>
      opt.setName('content')
        .setDescription('Texto da matéria (use \\n para pular linha/parágrafo)')
        .setRequired(true)
    )
    .addAttachmentOption(opt =>
      opt.setName('image1')
        .setDescription('Primeira foto da matéria (opcional)')
        .setRequired(false)
    )
    .addAttachmentOption(opt =>
      opt.setName('image2')
        .setDescription('Segunda foto da matéria (opcional)')
        .setRequired(false)
    ),

  async execute(interaction) {
    const title = interaction.options.getString('title');
    const content = interaction.options.getString('content').replace(/\\n/g, '\n');
    const image1 = interaction.options.getAttachment('image1');
    const image2 = interaction.options.getAttachment('image2');

    await interaction.deferReply();

    try {
      const canvas = createCanvas(1000, 1400);
      const ctx = canvas.getContext('2d');

      // ========== FUNDO ==========
      ctx.fillStyle = '#f5f0e6'; // papel de jornal
      ctx.fillRect(0, 0, 1000, 1400);

      // Borda externa
      ctx.strokeStyle = '#1a1a1a';
      ctx.lineWidth = 8;
      ctx.strokeRect(15, 15, 970, 1370);

      // ========== CABEÇALHO ==========
      ctx.fillStyle = '#1a1a1a';
      ctx.fillRect(40, 40, 920, 110);

      // Logo / Nome do jornal
      ctx.fillStyle = '#f5f0e6';
      ctx.font = 'bold 52px Georgia';
      ctx.textAlign = 'center';
      ctx.fillText('Daily Planet', 500, 100);

      // Subtítulo do cabeçalho
      ctx.font = '16px Georgia';
      ctx.fillText('A GREAT METROPOLITAN NEWSPAPER  •  METROPOLIS', 500, 130);

      // Linha dourada
      ctx.strokeStyle = '#c9a227';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(60, 165);
      ctx.lineTo(940, 165);
      ctx.stroke();

      // Data e volume
      const today = new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });

      ctx.fillStyle = '#333';
      ctx.font = '14px Georgia';
      ctx.textAlign = 'left';
      ctx.fillText(`Volume 12  |  Issue 47`, 60, 190);

      ctx.textAlign = 'right';
      ctx.fillText(today, 940, 190);

      // ========== TÍTULO ==========
      ctx.fillStyle = '#111';
      ctx.font = 'bold 42px Georgia';
      ctx.textAlign = 'center';

      // Quebra de linha do título
      const titleLines = wrapText(ctx, title.toUpperCase(), 880, 42);
      let titleY = 250;
      for (const line of titleLines.slice(0, 3)) {
        ctx.fillText(line, 500, titleY);
        titleY += 48;
      }

      // Linha abaixo do título
      ctx.strokeStyle = '#1a1a1a';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(80, titleY + 10);
      ctx.lineTo(920, titleY + 10);
      ctx.stroke();

      // ========== AUTOR ==========
      ctx.fillStyle = '#444';
      ctx.font = 'italic 16px Georgia';
      ctx.textAlign = 'left';
      ctx.fillText(`By ${interaction.user.username}  •  Daily Planet Staff`, 80, titleY + 40);

      // ========== IMAGENS ==========
      let contentStartY = titleY + 70;
      const hasImage1 = image1 && image1.contentType?.startsWith('image/');
      const hasImage2 = image2 && image2.contentType?.startsWith('image/');

      if (hasImage1 || hasImage2) {
        const imgWidth = hasImage1 && hasImage2 ? 420 : 860;
        const imgHeight = 280;

        if (hasImage1) {
          const img = await loadImage(image1.url);
          const x = hasImage2 ? 60 : 70;
          drawImageCover(ctx, img, x, contentStartY, imgWidth, imgHeight);
        }

        if (hasImage2) {
          const img = await loadImage(image2.url);
          drawImageCover(ctx, img, 520, contentStartY, 420, imgHeight);
        }

        contentStartY += imgHeight + 30;
      }

      // ========== TEXTO DA MATÉRIA ==========
      ctx.fillStyle = '#1a1a1a';
      ctx.font = '18px Georgia';
      ctx.textAlign = 'left';

      const paragraphs = content.split(/\n+/); // separa por parágrafos
      let y = contentStartY;
      const maxY = 1320;
      const lineHeight = 26;
      const maxWidth = 880;

      for (const paragraph of paragraphs) {
        if (y > maxY) break;

        const lines = wrapText(ctx, paragraph.trim(), maxWidth, 18);

        for (const line of lines) {
          if (y > maxY) break;
          ctx.fillText(line, 60, y);
          y += lineHeight;
        }

        y += 14; // espaço entre parágrafos
      }

      // ========== RODAPÉ ==========
      ctx.strokeStyle = '#1a1a1a';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(60, 1350);
      ctx.lineTo(940, 1350);
      ctx.stroke();

      ctx.fillStyle = '#555';
      ctx.font = '13px Georgia';
      ctx.textAlign = 'center';
      ctx.fillText('THE MOST TRUSTED NEWSPAPER IN METROPOLIS  •  DAILY PLANET', 500, 1375);

      // ========== ENVIAR ==========
      const attachment = new AttachmentBuilder(canvas.toBuffer('image/png'), {
        name: 'daily-planet-page.png'
      });

      await interaction.editReply({ files: [attachment] });

    } catch (error) {
      console.error('Erro ao gerar a página do jornal:', error);
      await interaction.editReply({
        content: '❌ Falha ao gerar a página do Daily Planet.'
      });
    }
  }
};

// ========== FUNÇÕES AUXILIARES ==========

function wrapText(ctx, text, maxWidth, fontSize) {
  const words = text.split(' ');
  const lines = [];
  let currentLine = '';

  for (const word of words) {
    const testLine = currentLine ? `${currentLine} ${word}` : word;
    const metrics = ctx.measureText(testLine);

    if (metrics.width > maxWidth && currentLine) {
      lines.push(currentLine);
      currentLine = word;
    } else {
      currentLine = testLine;
    }
  }

  if (currentLine) lines.push(currentLine);
  return lines;
}

function drawImageCover(ctx, img, x, y, w, h) {
  // Desenha a imagem cobrindo a área (crop centralizado)
  const imgRatio = img.width / img.height;
  const areaRatio = w / h;

  let sx, sy, sw, sh;

  if (imgRatio > areaRatio) {
    // imagem mais larga
    sh = img.height;
    sw = img.height * areaRatio;
    sx = (img.width - sw) / 2;
    sy = 0;
  } else {
    // imagem mais alta
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

  // borda na imagem
  ctx.strokeStyle = '#1a1a1a';
  ctx.lineWidth = 2;
  ctx.strokeRect(x, y, w, h);
          }
