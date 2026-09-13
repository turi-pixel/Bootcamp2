# Pokédex Web

## Autor
Victor Augusto — RA: 22611054

## Descrição
Aplicação web que busca Pokémon pelo nome ou número e exibe imagem, número,
tipos, altura, peso e habilidades. Útil para fãs consultarem rapidamente os
dados de qualquer Pokémon da Pokédex Nacional.

## API utilizada
- **PokeAPI** — documentação: https://pokeapi.co/docs/v2
- Endpoint consumido: `https://pokeapi.co/api/v2/pokemon/{nome-ou-id}`

## Funcionalidades
- Busca por nome (em inglês) ou número, pelo botão **Buscar** ou tecla **Enter**
- Botão **🎲 Aleatório** que sorteia um Pokémon entre 1 e 1025
- Exibição de 6 informações da resposta: imagem, número, nome, tipos, altura (m), peso (kg) e habilidades
- Conversão de unidades (decímetros → metros; hectogramas → kg)
- Mensagens amigáveis e distintas para **busca sem resultado** e **falha de conexão/API fora do ar**

## Como executar localmente
1. Clone: `git clone https://github.com/SEU-USUARIO/bootcamp2-app.git`
2. Abra o arquivo `index.html` no navegador
   (ou use a extensão *Live Server* do VS Code)

## Links
- **Aplicação no ar (GitHub Pages):** https://SEU-USUARIO.github.io/bootcamp2-app/
- **Repositório:** https://github.com/SEU-USUARIO/bootcamp2-app
