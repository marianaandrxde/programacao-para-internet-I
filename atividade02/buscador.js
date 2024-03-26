import fs, { readSync } from 'fs';
import cheerio from 'cheerio';
import path from 'path';
import readline from 'readline-sync';

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
            return this.pontuacoes;
        }


        async analisarPagina(pagina, termo) {
            if (this.linksVisitados.includes(pagina)) {
                return;
            }

            this.linksVisitados.push(pagina); 
            let pontuacaoPagina = new PontuacaoPagina();

            await this.calcularPontuacoes(pagina, termo, pontuacaoPagina);
            this.pontuacoes.push({ pagina, pontuacaoPagina });

            let links = await this.extrairLinks(pagina);
            for (let link of links) {
                await this.analisarPagina(link, termo);
            }
        }


        async calcularPontuacaoTermos(pagina, termo, pontuacaoPagina) {
            try {
                let html = await fs.promises.readFile(pagina, 'utf8');
        
                let $ = cheerio.load(html);
        
                $('a').each(function() {
                    $(this).contents().unwrap();
                });
        
                let conteudoHTML = $('html').html();
                let regex = new RegExp(`\\b${termo}\\b`, 'gi');
                let matches = conteudoHTML.match(regex);
                let frequencia = matches ? matches.length : 0;
        
                pontuacaoPagina.pontuacaoTermos = frequencia * 5;
            } catch (error) {
                console.error("Ocorreu um erro ao calcular a pontuação dos termos:", error);
            }
        }
        
   
        async calcularPontuacaoTags(pagina, termo, pontuacaoPagina) {
            try {
                let html = await fs.promises.readFile(pagina, 'utf8');
                let $ = cheerio.load(html);
        
                let regex = new RegExp(termo, 'gi');        
                let relevancia = 0;
        
                $('title').each(function () {
                    let count = $(this).text().match(regex);
                    if (count) {
                        relevancia += count.length * 20;
                    }
                });
        
                $('meta').each(function () {
                    let content = $(this).attr('content');
                    if (content && content.match(regex)) {
                        let count = content.match(regex);
                        relevancia += count.length * 20;

                    }
                });
        
                $('h1, h2').each(function () {
                    let count = $(this).text().match(regex);
                    if (count) {
                        if ($(this).is('h1')) {
                            relevancia += count.length * 15;
                        } else {
                            relevancia += count.length * 10;
                        }
                    }
                });
        
                $('p').each(function () {
                    let count = $(this).text().match(regex);
                    if (count) {
                        relevancia += count.length * 5;
                    }
                });
        
                $('a').each(function () {
                    let text = $(this).text();
                    if (text.match(regex)) {
                        let count = text.match(regex);
                        relevancia += count.length * 2;
                    }
                });
                pontuacaoPagina.pontuacaoTags = relevancia;
            } catch (error) {
                console.error("Ocorreu um erro ao calcular a pontuação das tags:", error);
            }
        }
    

        async calcularPontuacaoLinks(pagina, pontuacaoPagina) {
            try {
                let html = await fs.promises.readFile(pagina, 'utf8');
                let $ = cheerio.load(html);

                let count = 0;

                $('a').each(function() {
                    let link = $(this).attr('href');
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
                let html = await fs.promises.readFile(pagina, 'utf8');
                let $ = cheerio.load(html);

                let autoreferencias = 0;
                let paginaAtual = pagina.split('/').pop();

                $('a').each(function() {
                    let link = $(this).attr('href');
                    if (link && link.endsWith('.html')) {
                        let paginaLink = link.split('/').pop();
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
            let html = fs.readFileSync(pagina, 'utf8');
            let $ = cheerio.load(html);
        
            let dataPublicacaoStr = $('p em').text().match(/\d{2}\/\d{2}\/\d{4}/);
        
            if (dataPublicacaoStr) {
                let dataPublicacaoParts = dataPublicacaoStr[0].split('/');
                let dataPublicacao = new Date(dataPublicacaoParts[2], dataPublicacaoParts[1] - 1, dataPublicacaoParts[0]);
        
                let anoAtual = new Date().getFullYear();
                let anoPublicacao = dataPublicacao.getFullYear();
                let diferencaAnos = anoAtual - anoPublicacao;
        
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


        async  extrairLinks(pagina) {
            try {
                let html = await fs.promises.readFile(pagina, 'utf8');
                let $ = cheerio.load(html);
                let links = [];
        
                $('ul li a').each(function() {
                    let link = $(this).attr('href');
                    if (link) {
                        let linkCompleto;
                        if (link.startsWith('http')) {
                            linkCompleto = link;
                        } else {
                            let nomeArquivo = path.basename(pagina);
                            let pastaAtual = path.dirname(pagina);
                            let linkRelativo = link.startsWith('/') ? link.slice(1) : link;
                            linkCompleto = path.join(pastaAtual, linkRelativo);
                        }
                        links.push(linkCompleto);
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
                this.calcularFrescor(pagina, pontuacaoPagina),
            ]);

            this.somarPontuacaoTotal(pontuacaoPagina)
        }


        compararPontuacoes(a, b) {
            let pontuacaoA = a.pontuacaoPagina.somarPontuacaoTotal;
            let pontuacaoB = b.pontuacaoPagina.somarPontuacaoTotal;
        
            if (pontuacaoA !== pontuacaoB) {
                return pontuacaoB - pontuacaoA; 
            }
        
            if (a.pontuacaoPagina.pontuacaoTermos !== b.pontuacaoPagina.pontuacaoTermos) {
                return b.pontuacaoPagina.pontuacaoTermos - a.pontuacaoPagina.pontuacaoTermos;
            }
        
            if (a.pontuacaoPagina.frescor !== b.pontuacaoPagina.frescor) {
                return b.pontuacaoPagina.frescor - a.pontuacaoPagina.frescor;
            }
        
            return b.pontuacaoPagina.pontuacaoLinks - a.pontuacaoPagina.pontuacaoLinks;
        }
        
        
        somarPontuacaoTotal(pontuacaoPagina) {
        pontuacaoPagina.somarPontuacaoTotal = pontuacaoPagina.pontuacaoTermos +
                                            pontuacaoPagina.pontuacaoTags +
                                            pontuacaoPagina.pontuacaoLinks +
                                            pontuacaoPagina.autoreferencias +
                                            pontuacaoPagina.frescor;
        }
    }

let buscador = new Buscador('/home/oliveiras/Workspace/programacao-para-internet-I/atividade02/matrix.html');
let termo = readline.question('Digite o termo a ser buscado: ')
buscador.buscar(termo)
    .then(pontuacoes => {
        console.log(`---------------------------------------------BUSCA PELA PALAVRA ${termo}--------------------------------------------------------`)
        console.log('      AUTORIDADE    | FREQUÊNCIA DO TERMO   | USO EM TAGS   | AUTORREFERÊNCIAS    | FRESCOR  DO CONTEÚDO     |     TOTAL');
pontuacoes
    .filter(({ pontuacaoPagina }) => pontuacaoPagina.pontuacaoTermos > 0)
    .sort(buscador.compararPontuacoes)
    .forEach(({ pagina, pontuacaoPagina }) => {
        console.log(pagina);
        console.log("       ", pontuacaoPagina.pontuacaoLinks, "                 ",
            pontuacaoPagina.pontuacaoTermos, "                  ",
            pontuacaoPagina.pontuacaoTags, "               ",
            pontuacaoPagina.autoreferencias, "                      ",
            pontuacaoPagina.frescor, "                  ",
            pontuacaoPagina.somarPontuacaoTotal);
        console.log("------------------------------------------------------------------------------------------------------------------------------");
    });
    })
    .catch(error => {
        console.error("Ocorreu um erro ao buscar:", error);
    });
