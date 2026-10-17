
"use strict";

// =====================================================
// 1. CONFIGURAÇÕES E ELEMENTOS DA PÁGINA
// =====================================================

const URL_BASE = "https://pokeapi.co/api/v2/pokemon/";
const URL_TIPOS = "https://pokeapi.co/api/v2/type/";

const campoBusca = document.getElementById("campo-busca");
const botaoBuscar = document.getElementById("botao-buscar");
const botaoAleatorio = document.getElementById("botao-aleatorio");
const areaResultado = document.getElementById("resultado");
const listaFavoritos = document.getElementById("lista-favoritos");

// Configuração do Supabase (config.js)
const supabaseClient = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_ANON_KEY
);

// =====================================================
// 2. TRADUÇÃO DOS TIPOS
// =====================================================

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

const todosTipos = Object.keys(nomesTiposPT);

function traduzirTipos(lista) {
    return lista
        .map(tipo => nomesTiposPT[tipo] || tipo)
        .join(", ");
}

function formatarNome(nome) {
    return nome
        .split("-")
        .map(parte =>
            parte.charAt(0).toUpperCase() + parte.slice(1)
        )
        .join(" ");
}

// Evita inserir HTML vindo de dados externos
function escaparHTML(valor) {
    return String(valor).replace(/[&<>"']/g, caractere => {
        const entidades = {
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#39;"
        };

        return entidades[caractere];
    });
}

// =====================================================
// 3. CÁLCULO DE FRAQUEZAS E RESISTÊNCIAS
// =====================================================

async function calcularRelacoesDeTipo(tiposPokemon) {
    const multiplicadores = {};

    todosTipos.forEach(tipo => {
        multiplicadores[tipo] = 1;
    });

    const respostas = await Promise.all(
        tiposPokemon.map(async tipo => {
            const resposta = await fetch(
                URL_TIPOS + encodeURIComponent(tipo)
            );

            if (!resposta.ok) {
                throw new Error("erro-tipo");
            }

            return resposta.json();
        })
    );

    respostas.forEach(dadosTipo => {
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
    });

    return multiplicadores;
}

function organizarRelacoes(relacoesTipo) {
    const grupos = {
        fraquezas4x: [],
        fraquezas2x: [],
        resistenciasMeio: [],
        resistenciasQuarto: [],
        imunidades: []
    };

    for (const [tipo, valor] of Object.entries(relacoesTipo)) {
        if (valor === 4) {
            grupos.fraquezas4x.push(tipo);
        } else if (valor === 2) {
            grupos.fraquezas2x.push(tipo);
        } else if (valor === 0.5) {
            grupos.resistenciasMeio.push(tipo);
        } else if (valor === 0.25) {
            grupos.resistenciasQuarto.push(tipo);
        } else if (valor === 0) {
            grupos.imunidades.push(tipo);
        }
    }

    return grupos;
}

function criarGrupoRelacao(classe, icone, titulo, tipos, descricao) {
    if (tipos.length === 0) {
        return "";
    }

    return `
        <div class="grupo-relacao ${classe}">
            <span class="icone">${icone}</span>
            <div>
                <strong>${titulo}</strong>
                <p>${traduzirTipos(tipos)} — ${descricao}</p>
            </div>
        </div>
    `;
}

// =====================================================
// 4. BUSCAR POKÉMON NA POKEAPI
// =====================================================

let numeroBusca = 0;

async function buscarPokemon(termo) {
    const buscaAtual = ++numeroBusca;

    areaResultado.innerHTML = "<p>Carregando Pokémon...</p>";

    try {
        const resposta = await fetch(
            URL_BASE + encodeURIComponent(String(termo))
        );

        if (!resposta.ok) {
            if (resposta.status === 404) {
                throw new Error("nao-encontrado");
            }

            throw new Error("erro-api");
        }

        const dados = await resposta.json();

        const nome = formatarNome(dados.name);
        const imagem = dados.sprites.front_default || "";
        const altura = dados.height / 10;
        const peso = dados.weight / 10;

        const nomesTipos = dados.types.map(
            item => item.type.name
        );

        const tipos = nomesTipos
            .map(tipo => `
                <span class="tipo">
                    ${nomesTiposPT[tipo] || escaparHTML(tipo)}
                </span>
            `)
            .join("");

        const relacoesTipo = await calcularRelacoesDeTipo(
            nomesTipos
        );

        // Evita que uma busca antiga substitua a mais recente
        if (buscaAtual !== numeroBusca) {
            return;
        }

        const grupos = organizarRelacoes(relacoesTipo);

        const {
            fraquezas4x,
            fraquezas2x,
            resistenciasMeio,
            resistenciasQuarto,
            imunidades
        } = grupos;

        // =================================================
        // 5. CARTÃO DO POKÉMON
        // =================================================

        areaResultado.innerHTML = `
            <article class="cartao">

                ${
                    imagem
                        ? `<img
                            src="${escaparHTML(imagem)}"
                            alt="Imagem de ${escaparHTML(nome)}"
                          >`
                        : "<p>Imagem indisponível</p>"
                }

                <h2>#${dados.id} — ${escaparHTML(nome)}</h2>

                <p>
                    <b>Altura:</b> ${altura} m ·
                    <b>Peso:</b> ${peso} kg
                </p>

                <p><b>Tipo:</b> ${tipos}</p>

                <hr>

                <div class="relacoes-tipo">
                    <h3>Vantagens e fraquezas</h3>

                    ${criarGrupoRelacao(
                        "perigo",
                        "💀",
                        "Fraqueza extrema",
                        fraquezas4x,
                        "recebe 4x de dano"
                    )}

                    ${criarGrupoRelacao(
                        "fraqueza",
                        "⚠️",
                        "Fraqueza",
                        fraquezas2x,
                        "recebe 2x de dano"
                    )}

                    ${criarGrupoRelacao(
                        "resistencia",
                        "🛡️",
                        "Resistência",
                        resistenciasMeio,
                        "recebe metade do dano"
                    )}

                    ${criarGrupoRelacao(
                        "resistencia-forte",
                        "🛡️",
                        "Resistência forte",
                        resistenciasQuarto,
                        "recebe apenas ¼ do dano"
                    )}

                    ${criarGrupoRelacao(
                        "imunidade",
                        "🚫",
                        "Imunidade",
                        imunidades,
                        "não recebe dano"
                    )}
                </div>

                <button
                    id="adicionar-favorito"
                    class="botao-favorito"
                    type="button"
                >
                    ⭐ Adicionar aos favoritos
                </button>

            </article>
        `;

        const botaoFavorito = document.getElementById(
            "adicionar-favorito"
        );

        botaoFavorito.addEventListener("click", async () => {
            botaoFavorito.disabled = true;
            botaoFavorito.textContent = "Salvando...";

            const sucesso = await adicionarFavorito(dados);

            botaoFavorito.disabled = false;
            botaoFavorito.textContent = sucesso
                ? "⭐ Salvo nos favoritos"
                : "⭐ Adicionar aos favoritos";
        });

    } catch (erro) {
        if (buscaAtual !== numeroBusca) {
            return;
        }

        console.error("Erro ao buscar Pokémon:", erro);

        const mensagem = erro.message === "nao-encontrado"
            ? `Nenhum Pokémon encontrado para
               "${escaparHTML(termo)}".
               Confira a grafia e tente novamente.`
            : "Não foi possível consultar a PokeAPI agora. Verifique sua conexão e tente novamente.";

        areaResultado.innerHTML = `
            <div class="erro">${mensagem}</div>
        `;
    }
}

// =====================================================
// 6. ADICIONAR FAVORITOS NO SUPABASE
// =====================================================

async function adicionarFavorito(pokemon) {
    try {
        const { error } = await supabaseClient
            .from("favoritos")
            .upsert(
                {
                    pokemon_id: pokemon.id,
                    nome: pokemon.name,
                    imagem: pokemon.sprites.front_default
                },
                {
                    onConflict: "pokemon_id"
                }
            );

        if (error) {
            throw error;
        }

        await carregarFavoritos();

        return true;

    } catch (erro) {
        console.error("Erro ao adicionar favorito:", erro);

        alert("Erro ao salvar favorito no Supabase.");

        return false;
    }
}

// =====================================================
// 7. CARREGAR FAVORITOS DO SUPABASE
// =====================================================

async function carregarFavoritos() {
    listaFavoritos.textContent = "Carregando favoritos...";

    try {
        const { data, error } = await supabaseClient
            .from("favoritos")
            .select("*")
            .order("pokemon_id", { ascending: true });

        if (error) {
            throw error;
        }

        listaFavoritos.replaceChildren();

        if (!data || data.length === 0) {
            listaFavoritos.textContent =
                "Você ainda não adicionou nenhum Pokémon.";
            return;
        }

        data.forEach(pokemon => {
            const cartao = document.createElement("div");
            cartao.className = "cartao-favorito";

            const imagem = document.createElement("img");
            imagem.src = pokemon.imagem || "";
            imagem.alt = `Imagem de ${pokemon.nome}`;

            const nome = document.createElement("h3");
            nome.textContent =
                `#${pokemon.pokemon_id} — ${formatarNome(pokemon.nome)}`;

            const botaoRemover = document.createElement("button");
            botaoRemover.type = "button";
            botaoRemover.textContent = "🗑️ Remover";

            botaoRemover.addEventListener("click", async () => {
                botaoRemover.disabled = true;
                botaoRemover.textContent = "Removendo...";

                const sucesso = await removerFavorito(
                    pokemon.pokemon_id
                );

                if (!sucesso) {
                    botaoRemover.disabled = false;
                    botaoRemover.textContent = "🗑️ Remover";
                }
            });

            cartao.append(imagem, nome, botaoRemover);
            listaFavoritos.appendChild(cartao);
        });

    } catch (erro) {
        console.error("Erro ao carregar favoritos:", erro);

        listaFavoritos.textContent =
            "Não foi possível carregar os favoritos.";
    }
}

// =====================================================
// 8. REMOVER FAVORITOS DO SUPABASE
// =====================================================

async function removerFavorito(pokemonId) {
    try {
        const { error } = await supabaseClient
            .from("favoritos")
            .delete()
            .eq("pokemon_id", pokemonId);

        if (error) {
            throw error;
        }

        await carregarFavoritos();

        return true;

    } catch (erro) {
        console.error("Erro ao remover favorito:", erro);

        alert("Não foi possível remover o favorito.");

        return false;
    }
}

// =====================================================
// 9. EVENTOS DOS BOTÕES
// =====================================================

function dispararBusca() {
    const termo = campoBusca.value
        .toLowerCase()
        .trim();

    if (!termo) {
        areaResultado.textContent =
            "Digite o nome ou número de um Pokémon.";
        return;
    }

    buscarPokemon(termo);
}

botaoBuscar.addEventListener("click", dispararBusca);

campoBusca.addEventListener("keydown", evento => {
    if (evento.key === "Enter") {
        dispararBusca();
    }
});

botaoAleatorio.addEventListener("click", () => {
    const idAleatorio = Math.floor(
        Math.random() * 1025
    ) + 1;

    buscarPokemon(idAleatorio);
});

// =====================================================
// 10. INICIALIZAÇÃO
// =====================================================

carregarFavoritos();
