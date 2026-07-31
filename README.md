# Cadastro de Pessoas — Vue.js

![Vue.js](https://img.shields.io/badge/Vue.js-3-42b883?logo=vuedotjs&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-4-646cff?logo=vite&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-f7df1e?logo=javascript&logoColor=black)

Interface web responsiva para cadastro e gerenciamento de pessoas. A aplicação foi desenvolvida com Vue.js e consome uma API REST em Spring Boot para realizar operações de consulta, cadastro, edição, ativação, desativação e exclusão.

> Este repositório contém o front-end da aplicação. Para utilizar todas as funcionalidades, é necessário executar uma API compatível com os endpoints descritos neste documento.

## Funcionalidades

- Listagem de todas as pessoas cadastradas;
- Filtro local por nome, CPF ou e-mail;
- Visualização somente de pessoas ativas;
- Busca pela API por nome, CPF ou ID;
- Cadastro e edição de pessoas;
- Visualização detalhada de cada cadastro;
- Ativação e desativação de pessoas;
- Exclusão permanente com modal de confirmação;
- Máscara de CPF e validação dos campos do formulário;
- Tratamento de mensagens de validação e erros da API;
- Indicadores de carregamento e mensagens de sucesso;
- Menu e páginas adaptados para dispositivos móveis;
- Página personalizada para rotas não encontradas.

## Tecnologias utilizadas

- [Vue.js 3](https://vuejs.org/) com Composition API e `<script setup>`;
- [Vue Router](https://router.vuejs.org/) para navegação entre páginas;
- [Axios](https://axios-http.com/) para comunicação com a API;
- [Vite](https://vite.dev/) para desenvolvimento e build;
- JavaScript;
- CSS responsivo com variáveis de tema.

## Pré-requisitos

Antes de começar, tenha instalado:

- [Node.js](https://nodejs.org/) 16 ou superior;
- npm;
- Uma API Spring Boot compatível, por padrão em `http://localhost:8080/api`.

## Como executar

1. Clone o repositório:

   ```bash
   git clone https://github.com/oPauLoHiga/VueProjetoPessoa.git
   cd VueProjetoPessoa
   ```

2. Instale as dependências:

   ```bash
   npm install
   ```

3. Crie o arquivo `.env` na raiz do projeto, usando o `.env.example` como modelo:

   ```env
   VITE_API_URL=http://localhost:8080/api
   ```

   Altere o endereço se a sua API estiver em outra URL ou porta.

4. Inicie o backend Spring Boot.

5. Inicie o front-end:

   ```bash
   npm run dev
   ```

6. Abra no navegador o endereço exibido pelo Vite, normalmente `http://localhost:5173`.

## Scripts disponíveis

| Comando | Descrição |
| --- | --- |
| `npm run dev` | Inicia o servidor de desenvolvimento |
| `npm run build` | Gera a versão de produção na pasta `dist` |
| `npm run preview` | Executa localmente uma prévia do build |

## Rotas da aplicação

| Rota | Página |
| --- | --- |
| `/` | Página inicial e visão geral da API |
| `/pessoas` | Lista de pessoas |
| `/pessoas/nova` | Cadastro de uma nova pessoa |
| `/pessoas/:id` | Detalhes de uma pessoa |
| `/pessoas/:id/editar` | Edição de uma pessoa |
| `/buscar` | Busca por nome, CPF ou ID |

## Endpoints esperados

A variável `VITE_API_URL` define a URL base. Considerando o valor padrão `http://localhost:8080/api`, o front-end utiliza:

| Método | Endpoint | Finalidade |
| --- | --- | --- |
| `GET` | `/pessoas` | Listar todas as pessoas |
| `GET` | `/pessoas/ativas` | Listar somente pessoas ativas |
| `GET` | `/pessoas/{id}` | Buscar uma pessoa pelo ID |
| `GET` | `/pessoas/cpf/{cpf}` | Buscar uma pessoa pelo CPF |
| `GET` | `/pessoas/buscar?nome=` | Buscar pessoas pelo nome |
| `POST` | `/pessoas` | Cadastrar uma pessoa |
| `PUT` | `/pessoas/{id}` | Atualizar uma pessoa |
| `PATCH` | `/pessoas/{id}/desativar` | Desativar uma pessoa |
| `PATCH` | `/pessoas/{id}/ativar` | Ativar uma pessoa |
| `DELETE` | `/pessoas/{id}` | Excluir uma pessoa |

## Estrutura do projeto

```text
src/
├── assets/styles/      # Estilos globais, layout e variáveis do tema
├── components/ui/      # Componentes reutilizáveis de alerta e confirmação
├── router/             # Configuração das rotas
├── services/           # Cliente HTTP e integração com a API
├── utils/              # Tratamento de erros, máscaras e formatação
├── views/pessoas/      # Telas de lista, busca, cadastro e detalhes
├── App.vue             # Estrutura principal e menu de navegação
└── main.js             # Inicialização da aplicação
```

## Observações sobre a integração

- O backend deve permitir requisições da origem usada pelo Vite, por exemplo `http://localhost:5173`;
- As mensagens de validação da API podem ser exibidas diretamente no formulário;
- Em produção, configure o servidor para redirecionar rotas da SPA para o `index.html`.

## Autor

Desenvolvido por [@oPauLoHiga](https://github.com/oPauLoHiga).
