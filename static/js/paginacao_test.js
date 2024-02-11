import MecanismoDePaginacao from "./paginacao.mjs";

const paginador = new MecanismoDePaginacao();

const numArr = []

for (let n=1; n <= 100; n++){
    numArr.push(n)
}

paginador.paginar(numArr)

console.log(paginador.grupos)

let paginaAtual = paginador.paginaAtual

console.log(paginaAtual[0])