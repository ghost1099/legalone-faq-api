import express from 'express';
import axios from 'axios';
import * as cheerio from 'cheerio';

const app = express();
const PORT = process.env.PORT || 3000;

app.get('/faqs', async (req, res) => {
  try {
    const { data: html } = await axios.get('https://suporte.legalone.com.br/central/faces/central-solucoes-resultados.html');
    const $ = cheerio.load(html);
    const faqs = [];

    $('.resultado-pergunta').each((_, el) => {
      const pergunta = $(el).find('.pergunta').text().trim();
      const resposta = $(el).find('.resposta').text().trim();
      if (pergunta && resposta) {
        faqs.push({ pergunta, resposta });
      }
    });

    res.json(faqs);
  } catch (error) {
    res.status(500).json({ erro: 'Falha ao extrair FAQs', detalhes: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
