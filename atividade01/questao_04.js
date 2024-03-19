import axios from "axios";

async function extrairLinks(url) {
  try {
    let response = await axios.get(url);
    let html = response.data;
    let regex = /href=["'](.*?)["']/gi;
    let links = [];
    let match;
    while ((match = regex.exec(html)) !== null) {
      links.push(match[1]);
    }

    console.log('Links encontrados:');
    for (let link of links) {
      console.log(` - ${link}`);
    }
  } catch (error) {
    console.error(`Erro ao extrair links: ${error.message}`);
  }
}

// exemplo
let url = 'https://classroom.google.com/';
extrairLinks(url);
