# ⚽ Álbum Copa 2026 — FSaid & Romeo

App PWA para controle de figurinhas do Álbum da Copa do Mundo 2026.

---

## 🚀 Como publicar no Vercel (passo a passo)

### 1. Instalar o Node.js
Acesse https://nodejs.org e baixe a versão LTS. Instale normalmente.

### 2. Criar conta no GitHub
Acesse https://github.com e crie uma conta gratuita (se ainda não tiver).

### 3. Criar conta no Vercel
Acesse https://vercel.com e crie uma conta gratuita usando o GitHub.

### 4. Subir o projeto no GitHub

Abra o Terminal no Mac e execute:

```bash
# Instalar o git (se não tiver)
# Baixe em https://git-scm.com

# Entrar na pasta do projeto
cd caminho/para/album-copa

# Instalar dependências
npm install

# Iniciar repositório git
git init
git add .
git commit -m "Álbum Copa 2026"

# Criar repositório no GitHub (via site) e depois:
git remote add origin https://github.com/SEU_USUARIO/album-copa.git
git push -u origin main
```

### 5. Publicar no Vercel

1. Acesse https://vercel.com/dashboard
2. Clique em **"Add New Project"**
3. Selecione o repositório `album-copa`
4. Clique em **"Deploy"** — o Vercel detecta automaticamente que é Vite
5. Aguarde ~1 minuto e pronto! Você receberá uma URL tipo:
   `https://album-copa.vercel.app`

---

## 📱 Instalar no iPhone como app

1. Abra o **Safari** no iPhone (obrigatório — não funciona no Chrome)
2. Acesse a URL do seu app no Vercel
3. Toque no ícone de **compartilhar** (quadrado com seta para cima)
4. Role e toque em **"Adicionar à Tela de Início"**
5. Confirme o nome e toque em **"Adicionar"**

O app aparecerá na sua tela inicial com ícone próprio, abre em tela cheia sem barra do Safari, e **funciona offline**! ✅

---

## 💾 Sobre os dados

Os dados (compras e figurinhas marcadas) são salvos automaticamente no dispositivo via `localStorage`. Isso significa:
- ✅ Persistem mesmo fechando o app
- ✅ Funcionam sem internet
- ⚠️ São locais — cada dispositivo tem seus próprios dados

---

## 🛠️ Rodar localmente (opcional)

```bash
npm install
npm run dev
```

Acesse http://localhost:5173
