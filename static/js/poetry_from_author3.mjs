class ElementoVisual {

    estrutura = null
    elementoMaisExterno = null
    elementoPai

    constructor(){

    }

    setElementoPai(elemento){
        this.elementoPai = elemento
    }

    zerarEstrutura(){

    }

    createHtmlFromString(string){

        let htmlString = string
        htmlString = htmlString.trim()
    
        const templateElement = document.createElement('template')
        templateElement.innerHTML = htmlString
    
        const element = templateElement.content.firstChild
    
        return element
    }

    inicializarEstrutura(){

    }
    
    integrarDadosComEstrutura(dados){

    }

    renderizar(dados){
        this.integrarDadosComEstrutura(dados)
    }
}

export class Botoes extends ElementoVisual {

    funcaoDeClick

    setFuncaoDeClick(funcaoDeClick){
        this.funcaoDeClick = funcaoDeClick
    }

    botoesDoMeio(botoes){

        //console.log(botoes)

        for (let botao of botoes){
            let btn = this.createHtmlFromString(
                `<a href="#" class="link-numerico" data-pg_number=${botao}>${botao}</>`)
            btn.onclick = this.funcaoDeClick
            this.estrutura['botoesDoMeio']['listaDosElementos'].push(btn)
        }
    }

    zerarEstrutura(){
        this.estrutura['linkPrimeiraPagina'].remove()
        this.estrutura['linkPaginaAnterior'].remove()
        this.estrutura['linkProximaPagina'].remove()
        this.estrutura['linkUltimaPagina'].remove()
        this.estrutura['botoesDoMeio']['listaDosElementos'].map((b) => {b.remove()})
        this.estrutura['divPaginador'].remove()
        this.estrutura = null
        this.elementoMaisExterno = null
    }

    inicializarEstrutura(){

        if (this.estrutura){
            this.zerarEstrutura()
        }
        
        const divPaginador = this.createHtmlFromString(`<div class="paginador"></div>`)
        this.elementoMaisExterno = divPaginador
        const linkPrimeiraPagina = this.createHtmlFromString(`<a href="#" data-func='primeira_pagina' id='link-primeira-pagina'>Primeira</a>`)
        linkPrimeiraPagina.onclick = this.funcaoDeClick
        const linkPaginaAnterior = this.createHtmlFromString(`<a href="#" data-func='pagina_anterior' id="link-pagina-anterior"> << </a>`)
        linkPaginaAnterior.onclick = this.funcaoDeClick

        const linkProximaPagina = this.createHtmlFromString(`<a href="#" data-func='proxima_pagina' id="link-proxima-pagina"> >> </a>`)
        linkProximaPagina.onclick = this.funcaoDeClick
        const linkUltimaPagina = this.createHtmlFromString(`<a href="#" data-func='ultima_pagina' id='link-ultima-pagina'>Última</a>`)
        linkUltimaPagina.onclick = this.funcaoDeClick

        this.estrutura = {'divPaginador' : divPaginador, 
        'linkPrimeiraPagina': linkPrimeiraPagina, 
        'linkPaginaAnterior': linkPaginaAnterior,
        'linkProximaPagina' : linkProximaPagina,
        'linkUltimaPagina': linkUltimaPagina,
        'botoesDoMeio': {'listaDosNumeros': [],
                        'listaDosElementos': [],}}
    }

    integrarDadosComEstrutura(dados){

        //dados, nesse caso, é um array de números

        this.estrutura['botoesDoMeio']['listaDosNumeros'] = []
        this.estrutura['botoesDoMeio']['listaDosElementos'] = []
        this.estrutura['botoesDoMeio']['listaDosNumeros'] = dados
        this.botoesDoMeio(dados)

    }

    renderizar(dados){

        this.inicializarEstrutura()

        this.integrarDadosComEstrutura(dados)

        this.estrutura['divPaginador'].append(
            this.estrutura['linkPrimeiraPagina']
        )
        this.estrutura['divPaginador'].append(
            this.estrutura['linkPaginaAnterior']
        )

        for (let botaoMeio of this.estrutura['botoesDoMeio']['listaDosElementos']){
            this.estrutura['divPaginador'].append(botaoMeio)
        }

        this.estrutura['divPaginador'].append(
            this.estrutura['linkProximaPagina']
        )

        this.estrutura['divPaginador'].append(
            this.estrutura['linkUltimaPagina']
        )

        this.elementoPai.append(this.estrutura['divPaginador'])

    }

}


export class Poemas extends ElementoVisual {

    zerarEstrutura(){

        this.estrutura['listaDePoemas'].map((p) => {p.remove()})

        this.estrutura = null

    }

    inicializarEstrutura(){

        if (this.estrutura != null){
            this.zerarEstrutura()
        }

        this.estrutura = {'listaDePoemas': []}
    }

    criarHtmlParaPoema(poema){

        const modeloPoema = this.createHtmlFromString(`<div class="poem"><h3>${poema['title']}</h3></div>`)

        for (let line of poema['lines']){
            let lineSpan = document.createElement('span')
            lineSpan.innerHTML = line;
            modeloPoema.append(lineSpan)
            modeloPoema.append(document.createElement('br'))
        }

        return modeloPoema
    }

    integrarDadosComEstrutura(dados){

        //dados, nesse caso, é uma estrutura com dois atributos title e lines. sendo title uma string e lines um array de string.

        for (let item of dados){
            const poema = this.criarHtmlParaPoema(item)
            this.estrutura['listaDePoemas'].push(poema)
        }

    }

    renderizar(dados){

        this.inicializarEstrutura()

        this.integrarDadosComEstrutura(dados)

        for (let poema of this.estrutura['listaDePoemas']){
            this.elementoPai.append(poema)
        }

    }

}


class Pagina extends ElementoVisual{


    zerarEstrutura(){
        this.estrutura['Pagina'].remove()
    }

    inicializarEstrutura(){
        if (this.estrutura != null){
            this.zerarEstrutura()
            this.estrutura = null
        }

        this.estrutura= {'Pagina': null, 
        'Poemas' : new Poemas(), 
        'Botoes' : new Botoes()}

        this.estrutura['Pagina'] = document.createElement('div')
    }

    renderizar(dados){
        this.inicializarEstrutura()

        const poemas = this.estrutura['Poemas'].renderizar(dados)
        const botoes = this.estrutura['Botoes'].renderizar(dados)

        this.estrutura['Pagina'].append(poemas)
        this.estrutura['Pagina'].append(botoes)
    }

}

