# 📱 Blog EducaTech Mobile - Tech Challenge Fase 04

<div align="center">
  <img src="https://img.shields.io/badge/Expo-54.0.22-000020?style=for-the-badge&logo=expo&logoColor=white" alt="Expo" />
  <img src="https://img.shields.io/badge/React_Native-0.81.5-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React Native" />
  <img src="https://img.shields.io/badge/TypeScript-5.9.2-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/React_Native_Paper-5.14.5-6200EE?style=for-the-badge&logo=material-design&logoColor=white" alt="React Native Paper" />
</div>

<div align="center">
  <h3>🎯 Aplicação Mobile para professores e alunos interagirem em uma comunidade educacional</h3>
  <p>Construído com Expo, React Native, TypeScript e React Native Paper</p>
</div>

## 🌟 Visão Geral

O **App Blog EducaTech** é a evolução mobile da plataforma de blog educacional. Desenvolvido para dispositivos Android e iOS, o aplicativo permite que professores gerenciem conteúdo e alunos consumam materiais didáticos de qualquer lugar. A aplicação utiliza o poder do **Expo Router** para navegação fluida e integração nativa.

## 🤝 GRUPO

* RM 362457 - Alessandra Guedes
* RM 362166 - Ana Carolina
* RM 363723 - Vinicius Faria
* RM 360942 - Vitor Freire

## ✨ Principais Características

-   🔐 **Autenticação Integrada** - Suporte para Login, Cadastro de Alunos e Cadastro de Professores.
-   📱 **Navegação em Abas** - Interface intuitiva separando o Feed Geral da Área Administrativa.
-   🛡️ **Controle de Acesso** - A aba "Admin" é visível e acessível apenas para usuários com perfil de Professor.
-   🎨 **UI Nativa & Responsiva** - Componentes visuais consistentes utilizando React Native Paper.
-   ⚡ **Integração com API** - Comunicação eficiente com o backend via Axios com interceptadores de token.
-   💾 **Armazenamento Seguro** - Persistência de tokens de autenticação via `expo-secure-store`.

## 🚀 Início Rápido

### Pré-requisitos

-   Node.js 18.x ou superior
-   Gerenciador de pacotes (npm ou yarn)
-   Dispositivo móvel com o app **Expo Go** instalado ou emulador (Android Studio/Xcode).

### Instalação

1.  **Clone o repositório**
    ```bash
    git clone <url-do-repositorio>
    cd tech-challenge-fase-4
    ```
2.  **Instale as dependências**
    ```bash
    npm install
    ```
3.  **Inicie o servidor de desenvolvimento**
    ```bash
    npm start
    # ou
    npx expo start
    ```
4.  **Execute no dispositivo**
    -   Pressione `a` para abrir no Emulador Android.
    -   Pressione `i` para abrir no Simulador iOS.
    -   Ou escaneie o QR Code exibido no terminal com o app **Expo Go** no seu celular.

### Scripts Disponíveis
```bash
npm start           # Inicia o Metro Bundler / Expo
npm run android     # Inicia diretamente no Android
npm run ios         # Inicia diretamente no iOS
npm run web         # Inicia versão Web (Beta)
npm run lint        # Executa verificação de código
npm run reset-project # Reseta caches do projeto
```
## 🛠 Tecnologias Utilizadas

### Mobile (Frontend)
* **Framework Core:** Expo (~54.0.22) & React Native (0.81.5)
* **Linguagem:** TypeScript (~5.9.2)
* **Estilização:** React Native Paper (^5.14.5) & Vector Icons
* **Roteamento:** Expo Router (~6.0.15) (File-based routing)
* **Armazenamento Local:** Expo Secure Store & Async Storage

### Integração com Backend
* **API:** Integração com API RESTful
* **Serviço Externo:** https://blog-dinamico-app.onrender.com
* **Cliente HTTP:** Axios (com interceptors para JWT)

## 🏗 Estrutura do Projeto

A estrutura segue o padrão do Expo Router, onde a pasta `app` define as rotas da aplicação.

```plaintext
tech-challenge-fase-4/
├── app/                        # Rotas e Telas da aplicação
│   ├── (auth)/                 # Grupo de rotas de autenticação (sem tabs)
│   │   ├── login.tsx           # Tela de Login
│   │   ├── signup-professor.tsx # Cadastro de Professor
│   │   └── signup-student.tsx   # Cadastro de Aluno
│   ├── (tabs)/                 # Navegação principal por Abas
│   │   ├── _layout.tsx         # Configuração da TabBar e regras de acesso
│   │   ├── admin.tsx           # Dashboard do Professor (Protegido)
│   │   └── index.tsx           # Feed de Posts (Home)
│   ├── post/                   # Rotas dinâmicas de posts
│   │   ├── [id].tsx            # Detalhes do Post
│   │   └── create-edit.tsx     # Criação/Edição de conteúdo
│   ├── users/                  # Gerenciamento de usuários
│   └── _layout.tsx             # Layout raiz (Root Provider)
├── src/
│   ├── actions/                # Funções de interação com a API (auth, posts, users)
│   ├── components/             # Componentes reutilizáveis (Ex: PostCard)
│   ├── contexts/               # Context API (AuthContext)
│   ├── lib/                    # Configurações de libs (axios, secure-store)
│   └── types/                  # Definições de Tipos TypeScript
├── assets/                     # Imagens, fontes e ícones
└── package.json                # Dependências e scripts
```
## 🎯 Papéis e Funcionalidades

### 👥 Alunos (Usuários Básicos)
* Fazer cadastro e login no aplicativo.
* Visualizar o Feed de notícias na aba Home.
* Ler detalhes dos posts.

### 👨‍🏫 Professores (Admin)
* **Acesso Exclusivo:** Visualização da aba Admin na barra de navegação inferior.
* Criar, editar e excluir postagens.
* Gerenciar conteúdo da plataforma diretamente pelo celular.

## 🚀 Implantação e Distribuição

A aplicação utiliza o ecossistema Expo, facilitando a geração de builds.

* **EAS Build:** Ferramenta utilizada para gerar os binários (.apk, .aab, .ipa).
* **Expo Go:** Utilizado para testes rápidos durante o desenvolvimento.

Para gerar uma build de produção (exemplo Android):

```bash
npm install -g eas-cli
eas login
eas build -p android --profile production
```

## 🔒 Segurança

* **🛡️ Secure Store:** Armazenamento criptografado do Token JWT no dispositivo do usuário.
* **🔐 Interceptors:** Renovação e validação automática de sessões via Axios.
* **🚫 Rotas Protegidas:** Lógica condicional no `_layout.tsx` das abas impede renderização de telas administrativas para usuários não autorizados.

## 📝 Licença

Este projeto é parte do FIAP Tech Challenge Fase 4 - Pós Tech FullStack Development

<div align="center">
<p><strong>Desenvolvido com ❤️ para a educação</strong></p>
<p>FIAP Tech Challenge - Fase 4 | 2025</p>
</div>
