// URL base da API: só o termo de busca muda a cada consulta
const URL_BASE = "https://pokeapi.co/api/v2/pokemon/";
// Referências aos elementos da página (as "alças" do HTML)
const campoBusca  = document.getElementById("campo-busca");
const botaoBuscar = document.getElementById("botao-buscar");
// botão aleatório:
const botaoAleatorio = document.getElementById("botao-aleatorio");
const areaResultado = document.getElementById("resultado");
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
// 5) Monta o HTML do cartão e injeta na página
areaResultado.innerHTML = `
<article class="cartao">
<img src="${imagem}" alt="Imagem de ${nome}">
<h2>#${dados.id} — ${nome}</h2>
<p><b>Altura:</b> ${altura} m · <b>Peso:</b> ${peso} kg</p>
<p>${tipos}</p>
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