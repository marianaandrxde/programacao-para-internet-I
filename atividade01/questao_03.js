import axios from 'axios';
import fs from 'fs';

async function baixarImagem(urlImagem, nomeArquivo) {
  try {
    let response = await axios.get(urlImagem, { responseType: 'arraybuffer' });
    let bufferImagem = Buffer.from(response.data, 'binary');
    await fs.promises.writeFile(nomeArquivo, bufferImagem);
    console.log(`Imagem baixada com sucesso: ${nomeArquivo}`);
  } catch (error) {
    console.error(`Erro ao baixar imagem: ${error.message}`);
  }
}

let urlImagem = 'https://www.google.com/url?sa=i&url=https%3A%2F%2Fpt.wikipedia.org%2Fwiki%2FInstituto_Federal_do_Piau%25C3%25AD&psig=AOvVaw0ZjxNPeMm4BmYG_MS8j7o9&ust=1709647656314000&source=images&cd=vfe&opi=89978449&ved=0CBIQjRxqFwoTCKjP_vzj2oQDFQAAAAAdAAAAABAD'; 
let nomeArquivo = 'logo_ifpi.jpg';

baixarImagem(urlImagem, nomeArquivo);
