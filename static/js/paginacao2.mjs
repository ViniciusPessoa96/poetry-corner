class Pilha {

    //last in, first out

    pilha = []

    inserir(item){
        this.pilha.push(item);
    }

    remover(){
        const item = this.pilha.pop(this.pilha.length-1)
        return item;
    }

    limpar(){
        this.pilha = []
    }

    len(){
        return this.pilha.length
    }
}

class MecanismoDePaginacao {

    paginaAtual = null
    numeroPaginaAtual = null
    grupos = []
    itensPorPagina
    p1 = new Pilha()
    p2 = new Pilha()
    inicializado = false
    vazio = true

    setItensPorPagina(numero){
        this.itensPorPagina = numero
    }

    resetar(){
        this.paginaAtual = null
        this.numeroPaginaAtual = null
        this.grupos = []
        this.itensPorPagina = null
        this.p1 = new Pilha()
        this.p2 = new Pilha()
        this.inicializado = false
        this.vazio = true
    }

    paginar(L){

        this.particionarEmGrupos(L)
        this.inicializar()

    }

    particionarEmGrupos(L){

    }

    inicializar(){
        if (this.vazio){
            return
        }

        this.grupos.reverse()

        for (let g of this.grupos){
            this.p1.inserir(g)
        }

        this.paginaAtual = this.p1.remover()
        this.numeroPaginaAtual = 1
        this.inicializado = true

    }

    ehPrimeiraPagina(){
        if (this.p2.len() == 0){
            return true
        } else {
            return false
        }
    }

    ehUltimaPagina(){
        if (this.p1.len() == 0){
            return true
        } else {
            return false
        }
    }

    proximo(){

        if (this.vazio) {
            return
        }

        if (this.ehUltimaPagina()){
            return
        }

        let ultimoElemento = this.p1.remover()
        this.p2.inserir(this.paginaAtual)
        this.paginaAtual = ultimoElemento
        this.numeroPaginaAtual += 1

    }

    anterior(){

        if (this.vazio) {
            return
        }

        if (this.ehPrimeiraPagina()){
            return
        }

        let ultimoElemento = this.p2.remover()
        this.p1.inserir(this.paginaAtual)
        this.paginaAtual = ultimoElemento
        this.numeroPaginaAtual -= 1

    }

    quantidadeDePaginas(){
        if (this.vazio) {
            return
        }

        let qtdPaginas = this.grupos.length
        return qtdPaginas
    }

    irParaPagina(paginaDesejada){

        if (paginaDesejada > this.quantidadeDePaginas() || paginaDesejada < 1 || paginaDesejada == this.numeroPaginaAtual){
            //numero de pagina invalido ou é o mesmo que a pagina exibida no momento
            return
        }

        if (paginaDesejada > this.numeroPaginaAtual){
            //avancar
            let distancia = Math.abs(paginaDesejada - this.numeroPaginaAtual)
            for (let n=0; n < distancia; n++){
                this.proximo()
            }
        } else {
            //retroceder
            let distancia = Math.abs(this.numeroPaginaAtual - paginaDesejada)
            for (let n=0; n < distancia; n++){
                this.anterior()
            }
        }
    }

}


export class PaginadorDeBotoes extends MecanismoDePaginacao {

    particionarEmGrupos(L){

    let a = 0
    let b = 10

    const listLength = L.length

    let i = Math.ceil(listLength / 9)

    for (let n=0; n < i; n++){
        this.grupos.push(L.slice(a,b))
        a = a + 9
        b = b + 9
    }

    this.vazio = false

    }

}

export class PaginadorDeConteudo extends MecanismoDePaginacao {

    particionarEmGrupos(L){

        if (L.length == 0) {
            return
        }

        let i = 0

        while (i <= (L.length - 1)){
            let grupo = []
            for (let n=0; n < this.itensPorPagina; n++){
                if ((L.length -1) >= i+n){
                    grupo.push(L[i+n])
                } else {
                    break
                }
            }
            this.grupos.push(grupo)
            i = i + this.itensPorPagina
        }

        this.vazio = false
    }

}


function testarPaginadorDeBotoes(){

    const paginador = new PaginadorDeBotoese()

    let lista = []

    for (let n = 0; n < 3; n++){
        lista.push(n)
    }

    paginador.paginar(lista)

    console.log(paginador.grupos)

    console.log(paginador.paginaAtual)
    paginador.proximo()
    console.log(paginador.paginaAtual)
    paginador.anterior()
    console.log(paginador.paginaAtual)

}

