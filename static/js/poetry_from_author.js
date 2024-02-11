import MecanismoDePaginacao from './paginacao.mjs';

function heyOher(){
    console.log('hey oh')
}

function createHtmlFromString(string){

    let htmlString = string
    htmlString = htmlString.trim()

    const templateElement = document.createElement('template')
    templateElement.innerHTML = htmlString

    const element = templateElement.content.firstChild

    return element

}

function createHtmlForPoem(poemData){

    let divPoemString = `<div class="poem"><h3>${poemData['title']}</h3></div>`
    divPoemString = divPoemString.trim()
    const htmlPoemTemplate = document.createElement('template')
    htmlPoemTemplate.innerHTML = divPoemString;

    let poemElement = htmlPoemTemplate.content.firstChild;

    for (let line of poemData['lines']){

        let lineSpan = document.createElement('span')
        lineSpan.innerHTML = line;
        poemElement.append(lineSpan)
        poemElement.append(document.createElement('br'))
    }

    const contentDisplayInner = document.getElementsByClassName('content_display_inner')[0]
    contentDisplayInner.append(poemElement)
}

function limparPoemas(){
    const poemElements = document.getElementsByClassName('poem')

    while (poemElements.length != 0){
        poemElements[0].remove()
    }
}


function renderizarPoemas(poemArray){
    for (let poem of poemArray){
        createHtmlForPoem(poem)
    }
}

const paginador = new MecanismoDePaginacao();

class BotoesDePaginacao{

    botoesExibidos = []
    paginador

    setPaginador(paginador){
        this.paginador = paginador
    }

    limparBotoes(){

        this.botoesExibidos = []
        const linksNumericos = document.getElementsByClassName('link-numerico')
        while (linksNumericos.length != 0){
            linksNumericos[0].remove()
        }
    }

    determinarQuantidadeDeBotoes(paginaClicada){

        let numeroBotoes = 0

        let paginasRestantes = paginador.quantidadeDePaginas() - paginaClicada

        console.log(paginasRestantes)

        if (paginasRestantes == 0){
            return
        }

        //console.log(paginasRestantes)

        if (paginasRestantes <= 9){
            numeroBotoes = paginasRestantes
        } else {
            numeroBotoes = 9
        }
        return numeroBotoes
    }

    removerBotoesDePaginacao(){

        const divPaginador = document.getElementsByClassName('paginador')[0]

        if (divPaginador) {
            divPaginador.remove()
        }

    }

    criarHtmlParaBotoes(primeiraPagina, numeroBotoes){

        this.removerBotoesDePaginacao()

        const divPaginador = createHtmlFromString(`<div class="paginador"></div>`)
        const linkPrimeiraPagina = createHtmlFromString(`<a href="#" id='link-primeira-pagina'>Primeira</a>`)
        const linkPaginaAnterior = createHtmlFromString(`<a href="#" id="link-pagina-anterior"> << </a>`)

        divPaginador.append(linkPrimeiraPagina)
        divPaginador.append(linkPaginaAnterior)

        //console.log(numeroBotoes)
        
        //let middle = ''
        for (let n=primeiraPagina; n <= primeiraPagina+numeroBotoes; n++){
            this.botoesExibidos.push(n)
            //let newBtn = `<a href="#" class="link-numerico" onclick=this.mudarPagina data-pg_number=${n}>${n}</>`
            const newBtnElement = createHtmlFromString(
                `<a href="#" class="link-numerico" onclick=this.mudarPagina data-pg_number=${n}>${n}</>`)
            newBtnElement.onclick = this.mudarPagina.bind(this)
            divPaginador.append(newBtnElement)
            //middle = middle + newBtn
        }

        //console.log(this.botoesExibidos)

        const linkProximaPagina = createHtmlFromString(`<a href="#" id="link-proxima-pagina"> >> </a>`)
        const linkUltimaPagina = createHtmlFromString(`<a href="#" id='link-ultima-pagina'>Última</a>`)

        divPaginador.append(linkProximaPagina)
        divPaginador.append(linkUltimaPagina)

        const contentDisplayInner = document.getElementsByClassName('content_display_inner')[0]
        contentDisplayInner.append(divPaginador)
    }

    atualizarBotoes(paginaClicada){

        let numeroBotoes = this.determinarQuantidadeDeBotoes(paginaClicada)
        this.limparBotoes()
        this.criarHtmlParaBotoes(paginaClicada, numeroBotoes)
    }

    atualizarConteudo(paginaDesejada){

        this.paginador.irParaPagina(paginaDesejada)
        const novaPagina = this.paginador.paginaAtual
        //console.log(novaPagina)
        limparPoemas()
        renderizarPoemas(novaPagina)

    }

    ehUltimaPagina(numeroPagina){
        return (numeroPagina == this.paginador.quantidadeDePaginas())
    }

    mudarPagina(e){

        let pageNumber = Number(e.srcElement.dataset.pg_number)

        //e se for a última página?
        //if (this.ehUltimaPagina(pageNumber)){
        //    return
        //}

        //console.log(pageNumber)
        if (pageNumber == this.botoesExibidos[this.botoesExibidos.length-1]){
            
            if (!this.ehUltimaPagina(pageNumber)) {
                //hora de atualizar os botões
                this.atualizarBotoes(pageNumber)
            }
        }
        //mudar para a pagina desejada
        this.atualizarConteudo(pageNumber)
    }

    inicializarBotoes() {

        let numeroBotoes = this.determinarQuantidadeDeBotoes()
        this.criarHtmlParaBotoes(1, numeroBotoes)
    }
}

const botoesPaginadores = new BotoesDePaginacao()
botoesPaginadores.setPaginador(paginador)

const authorNameHeader = document.getElementById('author_name_header');
const authorName = authorNameHeader.dataset.authorname;

const contentDisplayInner = document.getElementsByClassName('content_display_inner')[0]
const loading = document.createElement('div')
let loadingContent = `Loading...`
loading.innerHTML = loadingContent
contentDisplayInner.append(loading)


fetch(`http://localhost:5002/get_poetry_from/${authorName}`)
.then(res => {
    res = res.json()
    res.then(data => {
        //navegar pelos dados e construir visualizações para os dados
 
        paginador.paginar(data)
        const paginaAtual = paginador.paginaAtual
        //console.log(paginaAtual)
        loading.remove()
        renderizarPoemas(paginaAtual)
        botoesPaginadores.inicializarBotoes()
    })
    .catch(e => {
        console.log(e)
    })
})

/* testando a classe do Paginador */

function paginadorTeste(){
    paginador.proximo()
    console.log(paginador.paginaAtual)
    paginador.anterior()
    console.log(paginador.paginaAtual)
}

