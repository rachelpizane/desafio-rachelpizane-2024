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
  espacoAtual() {
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

// Essa função valida se o novo animal consta na lista dos animais habilitados.
function validarAnimal(animal){
  return animais.some(animalHabilitado => animalHabilitado.tipo == animal)
}

// Essa função valida se a quantidade é maior que 0 e se é um número inteiro.
function validarQuantidade(quantidade) {
  return Number.isInteger(quantidade) && quantidade > 0 
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

}

export { analisaRecintosSolucao as analisaRecintosSolucao};

function testarSolucoes(animal, quantidade){
  let resultado = analisaRecintosSolucao(animal, quantidade)
  console.log(`Erro: ${resultado.erro} \nRecintos Viáveis: ${resultado.recintosViaveis}`)
}

testarSolucoes("UNICORNIO", 1)
testarSolucoes("MACACO", -5)