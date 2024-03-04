
import axios from 'axios';
import cheerio from 'cheerio';

async function encontrarPalavras(url, palavra) {
  try {
    let response = await axios.get(url);
    let html = response.data;

    let $ = cheerio.load(html);

    let ocorrencias = $(`body`).text().split(palavra);

    for (let ocorrencia of ocorrencias) {
      let palavrasAnteriores = ocorrencia.split(' ').slice(-11, -1);
      let palavrasPosteriores = ocorrencia.split(' ').slice(1, 11);
      console.log(`Ocorrência: ${palavra}`);
      console.log(` - Palavras anteriores: ${palavrasAnteriores.join(' ')}`);
      console.log(` - Palavras posteriores: ${palavrasPosteriores.join(' ')}`);
      console.log('');
    }
  } catch (error) {
    console.error(`Erro ao encontrar palavras: ${error.message}`);
  }
}

let url = 'https://www.example.com';
let palavra = 'exemplo';

encontrarPalavras(url, palavra);
