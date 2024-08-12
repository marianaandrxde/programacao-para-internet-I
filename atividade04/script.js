// Questão 1 - Refatore o código de forma que seja possível passar uma mensagem de erro
//específica e que possa ser passado o id do componente HTML que irá receber a
//mensagem de erro. 

document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('botaoErro').addEventListener('click', function () {
        mostrarErro("mensagemErro", "Oioi! Esta é a mensagem de erro ;)")
    });
});

function mostrarErro(idComponente, mensagem) {
    var errorMessage = document.getElementById(idComponente);
    errorMessage.innerHTML = mensagem;
    errorMessage.classList.remove('oculto');
    setTimeout(function () {
        errorMessage.classList.add('oculto');
    }, 3000);
}

// Questão 2 - Altere o código anterior validando se o campo foi preenchido:
// a) Retire os espaços usando a função trim() das strings e faça um if testando se a
// string resultante é nula/vazia;
// b) Sinalize que o conteúdo do campo não pode ser vazio usando a função de
// exibir mensagens de erro da questão anterior.
document.addEventListener('DOMContentLoaded', function () {
    var botaoExibir = document.getElementById('botaoExibir');
    botaoExibir.addEventListener('click', exibirConteudo);
});

function exibirConteudo() {
    var caixaDeTexto = document.getElementById('caixaDeTexto');
    var conteudo = caixaDeTexto.value.trim();

    var divConteudo = document.getElementById('conteudo');
    var divMensagemErro = document.getElementById('mensagemErro');

    if (conteudo === '') {
        mostrarErro("mensagemErro", "O campo não pode estar vazio!");
    } else {
        divConteudo.innerHTML = conteudo;
        divMensagemErro.classList.add('oculto'); 
    }
}

document.addEventListener('DOMContentLoaded', function () {
    var botaoCalcular = document.getElementById('calcular');
    botaoCalcular.addEventListener('click', calcularTaxaEngajamento);
});

function calcularTaxaEngajamento() {
    var interacoes = document.getElementById('interacoes').value.trim();
    var visualizacoes = document.getElementById('visualizacoes').value.trim();
    
    var mensagemErro = document.getElementById('mensagemErro');
    var resultado = document.getElementById('resultado');

    if (isNaN(interacoes) || isNaN(visualizacoes) || interacoes === '' || visualizacoes === '') {
        mostrarErro("Por favor, insira valores numéricos válidos.");
        resultado.innerHTML = ''; 
        return;
    }
    
    interacoes = parseFloat(interacoes);
    visualizacoes = parseFloat(visualizacoes);

    if (visualizacoes === 0) {
        mostrarErro("Número de visualizações não pode ser zero.");
        resultado.innerHTML = ''; 
        return;
    }

    var taxaEngajamento = (interacoes / visualizacoes) * 100;
    resultado.innerHTML = `Taxa de Engajamento: ${taxaEngajamento.toFixed(1)}%`;
    mensagemErro.classList.add('oculto'); 
}

function mostrarErro(mensagem) {
    var errorMessage = document.getElementById('mensagemErro');
    
    if (errorMessage) {
        errorMessage.innerHTML = mensagem;
        errorMessage.classList.remove('oculto');
        
        setTimeout(function () {
            errorMessage.classList.add('oculto');
        }, 3000);
    } else {
        console.error('Elemento com ID "mensagemErro" não encontrado.');
    }
}
