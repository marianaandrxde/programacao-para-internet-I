import axios from 'axios'

async function obterInformacoesDaUrl(url) {
  try {
    let response = await axios.get(url)
    let { status, headers, data } = response

    console.log(`Status da requisição: ${status}`)
    console.log('Cabeçalhos da resposta:')
    for (let header in headers) {
      console.log(` - ${header}: ${headers[header]}`)
    }
    console.log('Dados da resposta:')
    console.log(data)
  } catch (error) {
    console.error('Erro na requisição:', error.message)
  }
}

// Exemplo de uso da funçãogG
obterInformacoesDaUrl('https://www.wikipedia.org/')
