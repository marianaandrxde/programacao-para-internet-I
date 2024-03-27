# Buscador

## Descrição
Buscador é uma implementação que atribui pontuações a partir da análise de páginas HTML. Através de uma página inicial recebida
como parâmetro, o buscador solicita ao usuário a inserção de um termo, que será utilizado para efetuar a busca e cálculo de pontuações.
O programa baixa o conteúdo das outras páginas, a partir dos links referenciados na página atual e adiciona a um array, para evitar que 
a página seja acessada duas vezes e, consequentemente, prolongue o processo.

### Pontuações

- Links recebidos de outras páginas (+10pts cada);
- Quantidade dos termos buscados (+5pts cada ocorrência);
- Uso do termo buscado em tags Title e Meta (+20pts cada);
- Uso do termo buscado em tags h1 (+15pts cada);
- Uso do termo buscado em tags h2 (+10pts cada);
- Uso do termo buscado em tags p (+5pts cada);
- Uso do termo buscado em tags a (+2pts cada);
- Penalização por autoreferência (-20pts cada);
- Frescor do conteúdo (+30pts para páginas publicadas no ano corrente, com uma redução de -5pts para cada ano anterior).

### Critérios de Desempate

- Maior quantidade de termos buscados no corpo do texto;
- Maior frescor do conteúdo;
- Maior número de links recebidos.

## Linguagens

<img src="https://img.shields.io/badge/JavaScript-323330?style=for-the-badge&logo=javascript&logoColor=F7DF1E">&nbsp;
<img src="https://img.shields.io/badge/Node%20js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white">&nbsp;
<img src="https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white">


## Instalações
O projeto foi desenvolvido para executar em sistema operacional Linux.
- Primeiro, instale o Node.js e NPM
- Instale o Cheerio

      npm install cheerio

- Instale a Readline-Sync

      npm install readline-sync
      
### Versões

##### Node v18.17.0
##### Cheerio v1.0.0-rc.12
##### Readline-Sync v1.4.10


## Para executar
- Faça o download do arquivo ZIP do repositório ou clone-o.
- Substitua o path do arquivo passado como parâmetro para a instância da classe Buscador, 
na linha 276 do arquivo buscador.js, para o path correspondente à localização 
do arquivo localmente.
- Após, execute usando
  
        node buscador.js
  

## Resultado

#### Simulação utilizando o termo MATRIX
  
![image](https://github.com/marianaandrxde/programacao-para-internet-I/assets/126893887/8f448887-3ef1-4a3c-b351-3340345d94da)


<hr> 

## Componentes
<p style="font-size: 16px;">Ana Beatriz Brito de Farias</p>
<p style="font-size: 16px;">Henrique Ferreira Paiva</p>
<p style="font-size: 16px;">Mariana Oliveira Andrade</p>


