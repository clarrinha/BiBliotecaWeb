#  Sistema de Gerenciamento de Biblioteca Online

<p align="center">
  <img src="https://img.shields.io/badge/Status-Em%20Desenvolvimento-yellow" alt="Status">
  <img src="https://img.shields.io/badge/Projeto-Acadêmico-blue" alt="Projeto">
  <img src="https://img.shields.io/badge/HTML5-E34F26?logo=html5&logoColor=white" alt="HTML5">
  <img src="https://img.shields.io/badge/CSS3-1572B6?logo=css3&logoColor=white" alt="CSS3">
  <img src="https://img.shields.io/badge/JavaScript-F7DF1E?logo=javascript&logoColor=black" alt="JavaScript">
  <img src="https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white" alt="TypeScript">
  <img src="https://img.shields.io/badge/PostgreSQL-4169E1?logo=postgresql&logoColor=white" alt="PostgreSQL">
  <img src="https://img.shields.io/badge/Cloudflare-Workers-F38020?logo=cloudflare&logoColor=white" alt="Cloudflare Workers">
</p>

---

#  Sobre o Projeto

O Sistema de Gerenciamento de Biblioteca Online foi desenvolvido com o objetivo de modernizar e facilitar a administração de bibliotecas através de uma plataforma digital intuitiva, organizada e eficiente.

O sistema permite o gerenciamento completo do acervo bibliográfico, incluindo cadastro de livros, autores, categorias, membros, empréstimos e reservas, centralizando todas as informações em um único ambiente.

---

#  Objetivos

- Automatizar o gerenciamento de bibliotecas;
- Organizar o acervo bibliográfico;
- Facilitar o controle de empréstimos e devoluções;
- Gerenciar reservas de livros;
- Centralizar informações dos membros;
- Melhorar a experiência dos usuários;
- Garantir maior organização e controle dos dados.

---

#  Funcionalidades

##  Gerenciamento de Livros

- Cadastro de livros;
- Atualização de informações;
- Consulta ao acervo;
- Controle de disponibilidade;
- Organização das obras cadastradas.

##  Gerenciamento de Autores

- Cadastro de autores;
- Atualização de informações;
- Associação de autores aos livros;
- Consulta de autores cadastrados.

##  Gerenciamento de Categorias

- Cadastro de categorias;
- Organização dos livros por gênero;
- Consulta de categorias disponíveis.

##  Gerenciamento de Membros

- Cadastro de membros;
- Atualização de dados;
- Consulta de registros;
- Controle dos usuários da biblioteca.

##  Gerenciamento de Empréstimos

- Registro de empréstimos;
- Controle de devoluções;
- Histórico de movimentações;
- Consulta de empréstimos ativos.

##  Gerenciamento de Reservas

- Registro de reservas;
- Consulta de reservas;
- Controle de disponibilidade dos livros.

---

#  Arquitetura do Projeto

O sistema está dividido em duas camadas principais:

### Front-end (`web/`)

Responsável pela interface do usuário, páginas HTML, estilização, navegação e comunicação com a API.

### Back-end (`functions/`)

Responsável pelas regras de negócio, processamento das requisições, endpoints da API e integração com o banco de dados.

### Banco de Dados

O banco de dados é modelado em PostgreSQL e sua estrutura está definida no arquivo:

```text
schema-postgres.sql
```

---

#  Tecnologias Utilizadas

## Front-end

- HTML
- CSS
- JavaScript
- Vite

## Back-end

- TypeScript
- Cloudflare Workers
- Bun Runtime

## Banco de Dados

- PostgreSQL

## Ferramentas

- Git
- GitHub
- Visual Studio Code

---

#  Estrutura do Projeto

```bash
BIBLIOTECAWEB/
│
├── doc/
│   └── README.md
│
├── functions/
│   ├── node_modules/
│   ├── .env
│   ├── bun.lock
│   ├── index.ts
│   ├── package.json
│   └── tsconfig.json
│
├── web/
│   ├── node_modules/
│   ├── public/
│   │
│   ├── app.js
│   ├── config.js
│   ├── schema-postgres.sql
│   ├── style.css
│   │
│   ├── index.html
│   ├── livros.html
│   ├── autores.html
│   ├── categorias.html
│   ├── membros.html
│   ├── emprestimos.html
│   ├── sobre.html
│   │
│   ├── package.json
│   ├── vite.config.ts
│   ├── bun.lock
│   └── .gitignore
│
├── fork.json
└── .gitignore
```

---

#  Módulos do Sistema

| Módulo | Descrição |
|---------|-----------|
| Livros | Gerenciamento do acervo bibliográfico |
| Autores | Cadastro e gerenciamento de autores |
| Categorias | Organização dos livros por categoria |
| Membros | Controle dos usuários da biblioteca |
| Empréstimos | Registro e controle de empréstimos |
| Reservas | Gerenciamento de reservas |

---

#  Como Executar o Projeto

## 1 Clonar o Repositório

```bash
git clone https://github.com/clarrinha/BiBliotecaWeb
```

## 2️ Entrar na Pasta do Projeto

```bash
cd bibliotecaweb
```

---

## 3️ Instalar Dependências do Back-end

```bash
cd functions
bun install
```

---

## 4️ Executar o Back-end

```bash
bun run dev
```

---

## 5️ Instalar Dependências do Front-end

```bash
cd ../web
bun install
```

---

## 6️ Executar o Front-end

```bash
bun run dev
```

---

## 7️ Acessar o Sistema

Após iniciar o projeto, acesse:

```text
http://localhost:3000
```

---

#  Banco de Dados

O projeto utiliza PostgreSQL para armazenamento dos dados.

Principais entidades:

- Livros
- Autores
- Categorias
- Membros
- Empréstimos
- Reservas

A estrutura completa pode ser encontrada no arquivo:

```text
web/schema-postgres.sql
```


# Desenvolvimento

Projeto desenvolvido para fins acadêmicos na disciplina de Programação Web.

### Integrante

- Maria Clara Nascimento


