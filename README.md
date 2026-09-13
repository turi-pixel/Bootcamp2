# 🎮 Pokédex Web

## 👨‍💻 Autor

**Victor Augusto Rosendo Galvão**  
RA: 22611054

## 📖 Sobre o projeto

A **Pokédex Web** é uma aplicação desenvolvida como parte do **Bootcamp II**.

A aplicação consome dados da **PokeAPI** e permite consultar Pokémon pelo nome ou pelo número da Pokédex Nacional. Além das informações básicas, a aplicação também consulta as relações entre tipos para apresentar as **fraquezas, resistências e imunidades** de cada Pokémon.

O projeto foi desenvolvido utilizando **HTML, CSS e JavaScript**, com consumo assíncrono da API através de `fetch()`.

## 🔎 Funcionalidades

- 🔍 Busca de Pokémon por **nome (em inglês) ou número**
- ⌨️ Busca através do botão **Buscar** ou da tecla **Enter**
- 🎲 Botão **Pokémon Aleatório** para sortear um Pokémon
- 🖼️ Exibição da imagem oficial do Pokémon
- 🔢 Número na Pokédex
- 📏 Altura em metros
- ⚖️ Peso em quilogramas
- 🧬 Exibição do(s) tipo(s) do Pokémon
- ⚠️ Identificação das fraquezas
- 🛡️ Identificação das resistências
- 🚫 Identificação das imunidades
- 🔄 Combinação das relações de dano para Pokémon com mais de um tipo
- ⏳ Feedback de carregamento durante as consultas
- ❌ Tratamento de Pokémon não encontrado
- 🌐 Tratamento de falhas de conexão ou indisponibilidade da API

## 🔌 API utilizada

Este projeto utiliza a **PokeAPI**, uma API pública com informações sobre o universo Pokémon.

Documentação:

https://pokeapi.co/docs/v2

Principais endpoints utilizados:

`https://pokeapi.co/api/v2/pokemon/{nome-ou-id}`

`https://pokeapi.co/api/v2/type/{tipo}`

O primeiro endpoint fornece os dados do Pokémon, enquanto o segundo é utilizado para consultar as relações entre os tipos e determinar fraquezas, resistências e imunidades.

## 🛠️ Tecnologias utilizadas

- HTML5
- CSS3
- JavaScript
- Fetch API
- PokeAPI
- Git
- GitHub
- GitHub Pages

## 🚀 Como executar localmente

Clone o repositório:

```bash
git clone https://github.com/turi-pixel/Bootcamp2.git