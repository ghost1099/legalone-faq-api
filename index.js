import express from 'express';
import { chromium } from 'playwright';

const app = express();
const PORT = process.env.PORT || 3000;

app.get('/faqs', async (req, res) => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  await page.goto('https://suporte.legalone.com.br/central/faces/central-solucoes-resultados.html', { waitUntil: 'networkidle' });

  await page.waitForTimeout(5000); // Aguarda carregamento do JS

  const faqs = await page.evaluate(() => {
    const entries = [];
    const items = document.querySelectorAll('.resultado-pergunta');
    items.forEach(item => {
      const pergunta = item.querySelector('.pergunta')?.innerText.trim();
      const resposta = item.querySelector('.resposta')?.innerText.trim();
      if (pergunta && resposta) {
        entries.push({ pergunta, resposta });
      }
    });
    return entries;
  });

  await browser.close();
  res.json(faqs);
});

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
