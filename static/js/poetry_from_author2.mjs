import {PaginadorDeBotoes, PaginadorDeConteudo} from "./paginacao2.mjs";
import {Poemas, Botoes} from './poetry_from_author3.mjs';

const paginador = new PaginadorDeConteudo();
const paginadorBotoes = new PaginadorDeBotoes()
let botoesInicializados = false

const contentDisplayInner = document.getElementsByClassName('content_display_inner')[0]

const componentePoemas = new Poemas();
const componenteBotoes = new Botoes();
//componentePagina = new Pagina();

componentePoemas.setElementoPai(contentDisplayInner)
componenteBotoes.setElementoPai(contentDisplayInner)
componenteBotoes.setFuncaoDeClick(mudarPagina)

const authorNameHeader = document.getElementById('author_name_header');
const authorName = authorNameHeader.dataset.authorname;

function inicializarPaginador(dados){
    paginador.setItensPorPagina(5)
    paginador.paginar(dados)
}

function obterDadosDaApi(callback){
    fetch(`http://localhost:5002/get_poetry_from/${authorName}`)
    .then(res => {
        res = res.json()
        res.then(data => {
            console.log(data)
            inicializarPaginador(data)
            const paginaAExibir = paginador.paginaAtual
            callback(paginaAExibir)
        })
    }).catch((e) => {
        console.log(e)
    })
}

function gerarVisualizacaoParaOsPoemas(dadosPoemas){

    componentePoemas.renderizar(dadosPoemas)
}

function inicializarBotoes(){
    const quantidadeDePaginas = paginador.quantidadeDePaginas()

    const numeroDosBotoes = []

    for (let n=1; n <= quantidadeDePaginas; n++){
        numeroDosBotoes.push(n)
    }
    paginadorBotoes.setItensPorPagina(10)
    paginadorBotoes.paginar(numeroDosBotoes)
}

function checarSeBotoesEstaoEmFronteiras(botaoClicado){

    const botoesAtuais = paginadorBotoes.paginaAtual

   let botaoClicadoEhOUltimoDaExibicao = (botaoClicado == botoesAtuais[botoesAtuais.length-1])

   let botaoApontaParaPaginaForaDaExibicao = (botaoClicado > Math.max(...botoesAtuais) || botaoClicado < Math.min(...botoesAtuais))

    if (botaoClicadoEhOUltimoDaExibicao || botaoApontaParaPaginaForaDaExibicao) {
        return true
    } else {
        return false
    }

}

function limparBotoes(){
    const divDosBotoes = document.getElementsByClassName('div_dos_botoes')[0]

    for (let n=0; n < divDosBotoes.children.length; n++){
        divDosBotoes.children[0].remove()
    }
}

function modificarVisualizacaoDosBotoes(paginaDesejada) {

    /*
    if (paginaDesejada == Math.min(...paginadorBotoes.paginaAtual)){
        paginadorBotoes.anterior()
    }

    if (paginaDesejada == Math.max(...paginadorBotoes.paginaAtual)){
        paginadorBotoes.proximo()
    }*/

    let secaoEncontrada = null

    if (paginaDesejada >= Math.max(...paginadorBotoes.paginaAtual)){
        secaoEncontrada = false
        while (!secaoEncontrada){
            paginadorBotoes.proximo()
            if (paginadorBotoes.paginaAtual.includes(paginaDesejada) || paginadorBotoes.ehUltimaPagina()){
                secaoEncontrada = true
                break
            }
        }
    }

    if (paginaDesejada < Math.min(...paginadorBotoes.paginaAtual)){
        secaoEncontrada = false
        while (!secaoEncontrada){
            paginadorBotoes.anterior()
            if (paginadorBotoes.paginaAtual.includes(paginaDesejada) || paginadorBotoes.ehPrimeiraPagina()){
                secaoEncontrada = true
                break
            }
        }
    }

    //console.log(paginadorBotoes.paginaAtual)


}

function processarCliqueDeBotaoNaoNumerico(btn){
    
    //console.log('btn nao numerico')

    const functBtn = btn.dataset['func']

    //console.log(functBtn)

    let paginaDesejada = null;

    switch (functBtn){
        case 'primeira_pagina':
            //ir para a primeira página
            paginaDesejada = 1;
            //return paginaDesejada
            break;
        case 'pagina_anterior':
            //ir para a página anterior
            if (paginador.numeroPaginaAtual != 1) {
                paginaDesejada = paginador.numeroPaginaAtual - 1
            } else {
                paginaDesejada = 1
            }
            //return paginaDesejada
            break;
        case 'proxima_pagina':
            //ir para a proxima pagina
            paginaDesejada = paginador.numeroPaginaAtual + 1
            //return paginaDesejada
            break;
        case 'ultima_pagina':
            //ir para a ultima pagina
            paginaDesejada = paginador.quantidadeDePaginas()
            //return paginaDesejada
            break;
        default:
            break;
    }

    return paginaDesejada;
}

function processarCliqueDeBotaoNumerico(btn){
    //console.log('btn numerico')
    const paginaDesejada = Number(btn.dataset.pg_number)
    return paginaDesejada
}

function identificarTipoDeClique(elemento){

    if (elemento.dataset['pg_number']){
        //botão númerico
        return processarCliqueDeBotaoNumerico
    }

    if (elemento.dataset['func']){
        //botão não númerico
        return processarCliqueDeBotaoNaoNumerico
    }

}

function verificarValidezDaPaginaRequisitada(paginaDesejada){

    let paginaEhValida = null

    if (paginaDesejada > paginador.quantidadeDePaginas() || paginaDesejada < 1){
        paginaEhValida = false
    } else {
        paginaEhValida = true
    }

    return paginaEhValida
}

function mudarPagina(e){

    const elemento = e.srcElement

    const funcaoTratadoraDeClique = identificarTipoDeClique(elemento)

    let paginaDesejada = funcaoTratadoraDeClique(elemento)

    let paginaDesejadaEhValida = verificarValidezDaPaginaRequisitada(paginaDesejada)

    let paginaDiferente = (paginaDesejada != paginador.numeroPaginaAtual)

    if (paginaDiferente && paginaDesejadaEhValida) {
        paginador.irParaPagina(paginaDesejada)
        let dadosPoemas = paginador.paginaAtual
        componenteBotoes.zerarEstrutura()
        gerarVisualizacaoParaOsPoemas(dadosPoemas)

        //os botões estão em fronteiras?
        if (checarSeBotoesEstaoEmFronteiras(paginaDesejada)){
            modificarVisualizacaoDosBotoes(paginaDesejada)
        }

        gerarVisualizacaoParaOsBotoes()
    }
}



/*
function gerarHtmlParaBotoes(botoes){

    const divDosBotoes = document.getElementsByClassName('div_dos_botoes')[0]

    for (let botao of botoes){
        const btnElement = document.createElement(`<button data-pg-number=${botao}>${botao}</button>`)
        btnElement.click = mudarPagina
        divDosBotoes.append(btnElement)
    }
}*/

function gerarVisualizacaoParaOsBotoes(){

    if (!botoesInicializados) {
        inicializarBotoes()
        botoesInicializados = true
    }

    const botoesAtuais = paginadorBotoes.paginaAtual

    console.log(botoesAtuais)

    componenteBotoes.renderizar(botoesAtuais)

    //gerarHtmlParaBotoes(botoesAtuais)S
}

/*
function separarDadosDosPoemasEBotoes(dados){

}*/

function gerarVisualizacaoParaOsDados(dados){
    //[dadosPoemas, dadosBotoes] = separarDadosDosPoemasEBotoes(dados)
    gerarVisualizacaoParaOsPoemas(dados)
    gerarVisualizacaoParaOsBotoes()
}

function carregamentoInicialDaPagina(){
    //fazer requisição para API e gerar visualização para os dados
    obterDadosDaApi(gerarVisualizacaoParaOsDados)

}

window.onload = () => {
    carregamentoInicialDaPagina()
}