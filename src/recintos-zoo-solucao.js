class Animal {
  constructor(tipo, ehCarnivoro, tamanho, biomas){
    this.tipo = tipo;
    this.ehCarnivoro = ehCarnivoro;
    this.tamanho = tamanho;
    this.biomas = biomas;
  }
}

class AnimalExistente extends Animal {
    constructor(tipo, ehCarnivoro, tamanho, quantidade){
    super(tipo, ehCarnivoro, tamanho)
    this.quantidade = quantidade
  }
  tamanhoTotal() {
      return this.tamanho * this.quantidade
  }
}

class Recinto {
  constructor(numero, biomas, tamanhoTotal, animais = []){
    this.numero = numero;
    this.biomas = biomas;
    this.tamanhoTotal = tamanhoTotal;
    this.animais = animais
  }
  espacoLivre() {
    return this.tamanhoTotal - this.animais.reduce((acc, animal) => {
      return acc + animal.tamanhoTotal()
    }, 0)
  }
}

class Resultado {
  constructor(erro = 0, recintosViaveis = 0){
    this.erro = erro;
    this.recintosViaveis = recintosViaveis;
  }
}

// Animais que o zoologico está habilitado a tratar
const leao = new Animal("leao", true, 3, ["savana"])
const leopardo = new Animal("leopardo", true, 2, ["savana"])
const crocodilo = new Animal("crocodilo", true, 3, ["rio"])
const macaco = new Animal("macaco", false, 1, ["savana", "floresta"])
const gazela = new Animal("gazela", false, 2, ["savana"])
const hipopotamo = new Animal("hipopotamo", false, 4, ["savana", "rio"])

const animais = [leao, leopardo, crocodilo, macaco, gazela, hipopotamo]

// Recintos existentes
const recintos = [
  new Recinto(1, ["savana"], 10, [
    new AnimalExistente(macaco.tipo, macaco.ehCarnivoro, macaco.tamanho, 3)
  ]), 
  new Recinto(2, ["floresta"], 5), 
  new Recinto(3, ["savana", "rio"], 7, [
    new AnimalExistente(gazela.tipo, gazela.ehCarnivoro, gazela.tamanho, 1),
  ]),
  new Recinto(4, ["rio"], 8),
  new Recinto(5, ["savana"], 9, [
    new AnimalExistente(leao.tipo, leao.ehCarnivoro, leao.tamanho, 1)
  ])
]

// A função valida se o novo animal consta na lista dos animais habilitados.
function validarAnimal(animal){
  return animais.some(animalHabilitado => animalHabilitado.tipo == animal)
}

// A função valida se a quantidade é maior que 0 e se é um número inteiro.
function validarQuantidade(quantidade) {
  return Number.isInteger(quantidade) && quantidade > 0 
}

// A função verifica se o recinto possui umaa especie diferente e retorna o valor do espaço extra.
function definirEspacoExtra(recinto, animalHabilitado) {
  let validaAnimalEspecieDiferente = recinto.animais.some(animalExistente => animalExistente.tipo != animalHabilitado.tipo);
  return validaAnimalEspecieDiferente ? 1 : 0;
}

// A função retorna os recintos que possuem um bioma adequadro para o novo animal
function filtrarRecintosBiomaAdequado(animalHabilitado){
  return recintos.filter(recinto => animalHabilitado.biomas.some(bioma => recinto.biomas.includes(bioma)))
}

// A função retorna os recintos que estão vazios ou que possuem animais da mesma espécie que o novo animal
function filtrarRecintosMesmaEspecieVazio(recintosViaveis, animalHabilitado){
  return recintosViaveis.filter(recinto => {
    return recinto.animais.length == 0 || recinto.animais.some(animalExistente => animalExistente.tipo == animalHabilitado.tipo)
  })
}

// A função retorna os recintos que possuem um tamanho de espaço livre maior ou igual ao tamanho total do novo animal.
function filtrarRecintosEspacoLivre(recintosViaveis, animalHabilitado, tamanhoTotalAnimalHabilitado) {
  return recintosViaveis.filter(recinto => { 
    let espacoExtra = definirEspacoExtra(recinto, animalHabilitado)

    return recinto.espacoLivre() >= (tamanhoTotalAnimalHabilitado + espacoExtra)})
}

// A função retorna os recintos que estão vazios ou que não possuem animais carnívoros.
function filtrarRecintosSemCarnivorosVazio(recintosViaveis){
  return recintosViaveis.filter(recinto => {
    return recinto.animais.length == 0 || recinto.animais.every(animalExistente => !animalExistente.ehCarnivoro)
  })
}

// A função retorna os recintos que possuem os biomas savana e rio.
function filtrarRecintoBiomasSavanaRio(recintosViaveis, animalHabilitado){
  return recintosViaveis.filter(recinto => {
    return animalHabilitado.biomas.every(bioma => recinto.biomas.includes(bioma))
  })
}

// A função retorna recintos que não estejam vazios
function filtrarRecintosComAnimais(recintosViaveis){
  return recintosViaveis.filter(recinto => recinto.animais.length != 0)
}

// A função formata uma lista de recintos viáveis.
function formatarListaRecintosViaveis(recintosViaveis, animalHabilitado, tamanhoTotalAnimalHabilitado){
  recintosViaveis.sort((a, b) => a.numero - b.numero)

  return recintosViaveis.map(recinto => {
    let espacoExtra = definirEspacoExtra(recinto, animalHabilitado)

    return `Recinto ${recinto.numero} (espaço livre: ${recinto.espacoLivre() - (tamanhoTotalAnimalHabilitado + espacoExtra)} total: ${recinto.tamanhoTotal})`
  })
}

function analisaRecintosSolucao(animal, quantidade) {
  let resultado = new Resultado();
  animal = animal.toLowerCase();

  if(!validarAnimal(animal)){
    resultado.erro = "Animal inválido"
    return resultado
  }

  if(!validarQuantidade(quantidade)){
    resultado.erro = "Quantidade inválida"
    return resultado
  }

  let animalHabilitado = animais.find(animalHabilitado => animalHabilitado.tipo == animal)
  let tamanhoTotalAnimalHabilitado = quantidade * animalHabilitado.tamanho

  let recintosViaveis = filtrarRecintosBiomaAdequado(animalHabilitado)

  if(animalHabilitado.ehCarnivoro){
    recintosViaveis = filtrarRecintosMesmaEspecieVazio(recintosViaveis, animalHabilitado)

    recintosViaveis = filtrarRecintosEspacoLivre(recintosViaveis, animalHabilitado, tamanhoTotalAnimalHabilitado)

  } else {
    recintosViaveis = filtrarRecintosSemCarnivorosVazio(recintosViaveis)

    if(animalHabilitado.tipo == "hipopotamo"){
      let recintosBiomaSavanaRio = filtrarRecintoBiomasSavanaRio(recintosViaveis, animalHabilitado)
     
      recintosViaveis = filtrarRecintosMesmaEspecieVazio(recintosViaveis, animalHabilitado)
      recintosViaveis = recintosViaveis.concat(recintosBiomaSavanaRio)

    }

    if(animalHabilitado.tipo == "macaco" && quantidade == 1){
      recintosViaveis = filtrarRecintosComAnimais(recintosViaveis)

    }

    recintosViaveis = filtrarRecintosEspacoLivre(recintosViaveis, animalHabilitado, tamanhoTotalAnimalHabilitado)

  }

  if(recintosViaveis.length == 0){
    resultado.erro = "Não há recinto viável"

  } else {
    resultado.recintosViaveis = formatarListaRecintosViaveis(recintosViaveis, animalHabilitado, tamanhoTotalAnimalHabilitado)

  }

  return resultado
}


export { analisaRecintosSolucao };