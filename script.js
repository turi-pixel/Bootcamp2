// URL base da API: só o termo de busca muda a cada consulta
const URL_BASE = "https://pokeapi.co/api/v2/pokemon/";
// Referências aos elementos da página (as "alças" do HTML)
const campoBusca  = document.getElementById("campo-busca");
const botaoBuscar = document.getElementById("botao-buscar");
// botão aleatório:
const botaoAleatorio = document.getElementById("botao-aleatorio");
const areaResultado = document.getElementById("resultado");

// Função do tipo de pokemon para indentificar pontos fortes e fracos
async function calcularRelacoesDeTipo(tiposPokemon) {
    const multiplicadores = {};

    const todosTipos = [
        "normal", "fire", "water", "electric", "grass", "ice",
        "fighting", "poison", "ground", "flying", "psychic",
        "bug", "rock", "ghost", "dragon", "dark", "steel", "fairy"
    ];

    todosTipos.forEach(tipo => {
        multiplicadores[tipo] = 1;
    });

    for (const tipo of tiposPokemon) {

        const resposta = await fetch(
            `https://pokeapi.co/api/v2/type/${tipo}/`
        );

        if (!resposta.ok) {
            throw new Error("erro-tipo");
        }

        const dadosTipo = await resposta.json();
        const relacoes = dadosTipo.damage_relations;

        relacoes.double_damage_from.forEach(item => {
            multiplicadores[item.name] *= 2;
        });

        relacoes.half_damage_from.forEach(item => {
            multiplicadores[item.name] *= 0.5;
        });

        relacoes.no_damage_from.forEach(item => {
            multiplicadores[item.name] *= 0;
        });
    }

    return multiplicadores;
}

// 1. TRADUÇÃO DOS TIPOS
const nomesTiposPT = {
    normal: "Normal",
    fire: "Fogo",
    water: "Água",
    electric: "Elétrico",
    grass: "Planta",
    ice: "Gelo",
    fighting: "Lutador",
    poison: "Venenoso",
    ground: "Terra",
    flying: "Voador",
    psychic: "Psíquico",
    bug: "Inseto",
    rock: "Pedra",
    ghost: "Fantasma",
    dragon: "Dragão",
    dark: "Sombrio",
    steel: "Aço",
    fairy: "Fada"
};


// 2. FUNÇÃO PARA TRADUZIR
function traduzirTipos(lista) {
    return lista
        .map(tipo => nomesTiposPT[tipo] || tipo)
        .join(", ");
}

// ---------- Função principal: consulta a API e monta o cartão ---------
async function buscarPokemon(termo) {
areaResultado.innerHTML = "<p>Carregando...</p>";  // feedback imediato
try {
// 1) Requisição assíncrona
const resposta = await fetch(URL_BASE + termo);
// 2) A API respondeu, mas achou o que pedimos? (404 = não achou)
if (!resposta.ok) throw new Error("nao-encontrado");
// 3) Converte o corpo da resposta em objeto JavaScript
const dados = await resposta.json();
// 4) Extrai as informações mapeadas no Passo 1 (são 5 — mínimo era 3)
const nome   = dados.name;
const imagem = dados.sprites.front_default;
const altura = dados.height / 10;   // decímetros → metros
const peso   = dados.weight / 10;   // hectogramas → kg
const tipos  = dados.types
.map(t => `<span class="tipo">${t.type.name}</span>`)
.join("");

//Nova Função...
const nomesTipos = dados.types.map(t => t.type.name);

const relacoesTipo = await calcularRelacoesDeTipo(nomesTipos);

const fraquezas4x = [];
const fraquezas2x = [];
const resistenciasMeio = [];
const resistenciasQuarto = [];
const imunidades = [];

for (const tipo in relacoesTipo) {

    const valor = relacoesTipo[tipo];

    if (valor === 4) {
        fraquezas4x.push(tipo);
    } else if (valor === 2) {
        fraquezas2x.push(tipo);
    } else if (valor === 0.5) {
        resistenciasMeio.push(tipo);
    } else if (valor === 0.25) {
        resistenciasQuarto.push(tipo);
    } else if (valor === 0) {
        imunidades.push(tipo);
    }
}

// 5) Monta o HTML do cartão e injeta na página
areaResultado.innerHTML = `
<article class="cartao">

    <img src="${imagem}" alt="Imagem de ${nome}">

    <h2>#${dados.id} — ${nome}</h2>

    <p>
        <b>Altura:</b> ${altura} m ·
        <b>Peso:</b> ${peso} kg
    </p>

    <p><b>Tipo:</b> ${tipos}</p>

    <hr>

    <div class="relacoes-tipo">

    <h3>Vantagens e fraquezas</h3>

    ${
        fraquezas4x.length
        ? `
        <div class="grupo-relacao perigo">
            <span class="icone">💀</span>
            <div>
                <strong>Fraqueza extrema</strong>
                <p>${traduzirTipos(fraquezas4x)} — recebe 4x de dano</p>
            </div>
        </div>
        `
        : ""
    }

    ${
        fraquezas2x.length
        ? `
        <div class="grupo-relacao fraqueza">
            <span class="icone">⚠️</span>
            <div>
                <strong>Fraqueza</strong>
                <p>${traduzirTipos(fraquezas2x)} — recebe 2x de dano</p>
            </div>
        </div>
        `
        : ""
    }

    ${
        resistenciasMeio.length
        ? `
        <div class="grupo-relacao resistencia">
            <span class="icone">🛡️</span>
            <div>
                <strong>Resistência</strong>
                <p>${traduzirTipos(resistenciasMeio)} — recebe metade do dano</p>
            </div>
        </div>
        `
        : ""
    }

    ${
        resistenciasQuarto.length
        ? `
        <div class="grupo-relacao resistencia-forte">
            <span class="icone">🛡️</span>
            <div>
                <strong>Resistência forte</strong>
                <p>${traduzirTipos(resistenciasQuarto)} — recebe apenas ¼ do dano</p>
            </div>
        </div>
        `
        : ""
    }

    ${
        imunidades.length
        ? `
        <div class="grupo-relacao imunidade">
            <span class="icone">🚫</span>
            <div>
                <strong>Imunidade</strong>
                <p>${traduzirTipos(imunidades)} — não recebe dano</p>
            </div>
        </div>
        `
        : ""
    }

</div>

</article>`;

} catch (erro) {
// Cai aqui em DOIS casos: 404 (lançado acima) ou falha de rede/API fora do ar
const mensagem = erro.message === "nao-encontrado"
? `Nenhum Pokémon encontrado para "<b>${termo}</b>". Confira a grafia e tente de 
novo.`
: "Não foi possível consultar a PokeAPI agora. Verifique sua conexão e tente novamente.";
areaResultado.innerHTML = `<div class="erro">${mensagem}</div>`;
}
}
// ---------- Eventos: clique no botão e tecla Enter ---------
function dispararBusca() {
const termo = campoBusca.value.toLowerCase().trim();
if (termo) buscarPokemon(termo);
}
botaoBuscar.addEventListener("click", dispararBusca);
campoBusca.addEventListener("keydown", (e) => {
if (e.key === "Enter") dispararBusca();
});

botaoAleatorio.addEventListener("click", () => {

    const idAleatorio = Math.floor(Math.random() * 1025) + 1;

    buscarPokemon(idAleatorio);
});