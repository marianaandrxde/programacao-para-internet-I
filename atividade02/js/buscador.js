import fs from 'fs';
import cheerio from 'cheerio';
import urlModule from 'url';

class PontuacaoPagina {
    constructor() {
        this.pontuacaoTermos = 0;
        this.pontuacaoTags = 0;
        this.pontuacaoLinks = 0;
        this.autoreferencias = 0;
        this.frescor = 0;
    }
}

class Buscador {
    constructor(paginaInicial) {
        this.paginaInicial = paginaInicial;
        this.linksVisitados = [];
        this.pontuacoes = [];
    }

    async buscar(termo) {
        await this.analisarPagina(this.paginaInicial, termo);
        this.pontuacoes.sort(this.compararPontuacoes);
        return this.pontuacoes;
    }

    async analisarPagina(pagina, termo) {
        if (this.linksVisitados.includes(pagina)) {
            return;
        }

        this.linksVisitados.push(pagina); // Adiciona o link visitado ao array
        const pontuacaoPagina = new PontuacaoPagina();

        await this.calcularPontuacoes(pagina, termo, pontuacaoPagina);
        this.pontuacoes.push({ pagina, pontuacaoPagina });

        const links = await this.extrairLinks(pagina);
        for (const link of links) {
            await this.analisarPagina(link, termo);
        }
    }

    async calcularPontuacaoTermos(pagina, termo, pontuacaoPagina) {
        try {
            const html = await fs.promises.readFile(pagina, 'utf8');
    
            // Criar uma instância do Cheerio para manipular o HTML
            const $ = cheerio.load(html);
    
            // Capturar todo o conteúdo HTML
            const conteudoHTML = $('html').html();
    
            // Criar uma expressão regular para corresponder ao termo com fronteiras de palavras
            const regex = new RegExp(`\\b${termo}\\b`, 'gi');
    
            // Usar a expressão regular para encontrar todas as ocorrências do termo no conteúdo HTML
            const matches = conteudoHTML.match(regex);
    
            // Contar o número de ocorrências encontradas
            const frequencia = matches ? matches.length : 0;
    
            pontuacaoPagina.pontuacaoTermos = frequencia * 5;
        } catch (error) {
            console.error("Ocorreu um erro ao calcular a pontuação dos termos:", error);
        }
    }

   
    async calcularPontuacaoTags(pagina, termo, pontuacaoPagina) {
        try {
            const html = await fs.promises.readFile(pagina, 'utf8');
            const $ = cheerio.load(html);
    
            const regex = new RegExp(termo, 'gi');
    
            // Correspondências no corpo do HTML
            const matches = html.match(regex);
            const frequencia = matches ? matches.length : 0;
    
            let relevancia = 0;
    
            // Título
            $('title').each(function () {
                const count = $(this).text().match(regex);
                if (count) {
                    relevancia += count.length * 20;
                    console.log('title')
                }
            });
    
            // Meta tags
            $('meta').each(function () {
                const content = $(this).attr('content');
                if (content && content.match(regex)) {
                    const count = content.match(regex);
                    relevancia += count.length * 20;
                    console.log('meta')

                }
            });
    
            // Outros elementos relevantes (h1, h2, p, a)
            $('h1, h2').each(function () {
                const count = $(this).text().match(regex);
                if (count) {
                    if ($(this).is('h1')) {
                        relevancia += count.length * 15;
                        console.log('h1')

                    } else {
                        relevancia += count.length * 10;
                        console.log('h2')

                    }
                }
            });
    
            $('p').each(function () {
                const count = $(this).text().match(regex);
                if (count) {
                    relevancia += count.length * 5;
                    console.log('p')

                }
            });
    
            $('a').each(function () {
                const count = $(this).text().match(regex);
                if (count) {
                    relevancia += count.length * 2;
                    console.log('a')

                }
            });
    
            pontuacaoPagina.pontuacaoTags = relevancia;
        } catch (error) {
            console.error("Ocorreu um erro ao calcular a pontuação das tags:", error);
        }
    }

    
    

    async calcularPontuacaoLinks(pagina, pontuacaoPagina) {
        try {
            const html = await fs.promises.readFile(pagina, 'utf8');
            const $ = cheerio.load(html);

            let count = 0;

            $('a').each(function() {
                const link = $(this).attr('href');
                if (link && link.endsWith('.html')) {
                    count++;
                }
            });

            pontuacaoPagina.pontuacaoLinks = count * 10;
        } catch (error) {
            console.error("Ocorreu um erro ao calcular a pontuação dos links:", error);
        }
    }

    async contarAutoreferencias(pagina, pontuacaoPagina) {
        try {
            const html = await fs.promises.readFile(pagina, 'utf8');
            const $ = cheerio.load(html);

            let autoreferencias = 0;
            const paginaAtual = pagina.split('/').pop();

            $('a').each(function() {
                const link = $(this).attr('href');
                if (link && link.endsWith('.html')) {
                    const paginaLink = link.split('/').pop();
                    if (paginaAtual === paginaLink) {
                        autoreferencias++;
                    }
                }
            });

            if (autoreferencias === 0){
                pontuacaoPagina.autoreferencias = 0;
            } else {
                pontuacaoPagina.autoreferencias = autoreferencias * -20;
            }
        } catch (error) {
            console.error("Ocorreu um erro ao contar as autoreferências:", error);
        }
    }

    async calcularFrescor(pagina, pontuacaoPagina) {
        try {
          const html = fs.readFileSync(pagina, 'utf8');
          const $ = cheerio.load(html);
      
          const dataPublicacaoStr = $('p em').text().match(/\d{2}\/\d{2}\/\d{4}/);
      
          if (dataPublicacaoStr) {
            const dataPublicacaoParts = dataPublicacaoStr[0].split('/');
            const dataPublicacao = new Date(dataPublicacaoParts[2], dataPublicacaoParts[1] - 1, dataPublicacaoParts[0]);
      
            const anoAtual = new Date().getFullYear();
            const anoPublicacao = dataPublicacao.getFullYear();
            const diferencaAnos = anoAtual - anoPublicacao;
      
            pontuacaoPagina.frescor = 30 - (5 * diferencaAnos);
      
            return pontuacaoPagina.frescor;
          } else {
            console.error("Data de publicação não encontrada.");
            return 0;
          }
        } catch (error) {
          console.error("Ocorreu um erro ao calcular os pontos de frescor:", error);
          return 0;
        }
      }

    async extrairLinks(pagina) {
        try {
            const html = await fs.promises.readFile(pagina, 'utf8');
            const $ = cheerio.load(html);
            const links = [];
    
            $('a').each(function() {
                const link = $(this).attr('href');
                if (link) {
                    if (link.startsWith('http')) {
                        links.push(link);
                    } else {
                        const paginaAtual = pagina.split('/').slice(0, -1).join('/');
                        const linkCompleto = urlModule.resolve(paginaAtual, link);
                        links.push(linkCompleto);
                    }
                }
            });
    
            return links;
        } catch (error) {
            console.error("Ocorreu um erro ao extrair os links da página:", error);
            return [];
        }
    }

    async calcularPontuacoes(pagina, termo, pontuacaoPagina) {
        await Promise.all([
            this.calcularPontuacaoTermos(pagina, termo, pontuacaoPagina),
            this.calcularPontuacaoTags(pagina, termo, pontuacaoPagina),
            this.calcularPontuacaoLinks(pagina, pontuacaoPagina),
            this.contarAutoreferencias(pagina, pontuacaoPagina),
            this.calcularFrescor(pagina, pontuacaoPagina)
        ]);
    }

    compararPontuacoes(a, b) {
        if (a.pontuacaoPagina.pontuacaoTermos !== b.pontuacaoPagina.pontuacaoTermos) {
            return b.pontuacaoPagina.pontuacaoTermos - a.pontuacaoPagina.pontuacaoTermos;
        }
        if (a.pontuacaoPagina.frescor !== b.pontuacaoPagina.frescor) {
            return b.pontuacaoPagina.frescor - a.pontuacaoPagina.frescor;
        }
        return b.pontuacaoPagina.pontuacaoLinks - a.pontuacaoPagina.pontuacaoLinks;
    }
}

// Exemplo de utilização
const buscador = new Buscador('/home/oliveiras/Workspace/programacao-para-internet-I/atividade02/pаginas/matrix.html');
buscador.buscar('matrix')
    .then(pontuacoes => {
        console.log('      AUTORIDADE    | FREQUÊNCIA DO TERMO   | USO EM TAGS   | AUTORREFERÊNCIAS    | FRESCOR  DO CONTEÚDO')
        pontuacoes.forEach(({ pagina, pontuacaoPagina }) => {
            if (pontuacaoPagina.pontuacaoTermos > 0) {
                console.log("matrix", pagina);
                console.log("       ",pontuacaoPagina.pontuacaoLinks, "                 ",
                pontuacaoPagina.pontuacaoTermos, "                  ",
                pontuacaoPagina.pontuacaoTags, "               ",
                pontuacaoPagina.autoreferencias,"                 ",
                pontuacaoPagina.frescor);
                console.log("----------------------------------------------------------------------------------------------------------------");
            }
        });
    })
    .catch(error => {
        console.error("Ocorreu um erro ao buscar:", error);
    });
