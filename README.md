# Painel de Login

Site de login na internet onde **só o administrador cria as contas**.
Feito com páginas web simples (HTML/CSS/JavaScript) + **Supabase** para a
parte de login e segurança.

## Como está organizado

- `docs/design.md` — o que o projeto é e por quê.
- `docs/superpowers/plans/` — o plano de construção, tarefa por tarefa.
- `.env.example` — modelo de onde colar as chaves do Supabase.

## Configuração (passo a passo)

### 1. Criar o projeto no Supabase

1. Acesse https://supabase.com e crie uma conta (gratuita).
2. Crie um **novo projeto**. Guarde a senha do banco num lugar seguro.
3. Aguarde alguns minutos até o projeto ficar pronto.

### 2. Desligar o auto-cadastro (importante!)

No painel do Supabase: **Authentication → Sign In / Providers → Email**,
e DESLIGUE a opção **"Allow new users to sign up"**.
Assim, ninguém se cadastra sozinho — só você cria contas.

### 3. Pegar as chaves

No painel: **Project Settings → API**. Copie:

- **Project URL** → vai em `SUPABASE_URL`
- **anon public** → vai em `SUPABASE_ANON_KEY`
- **service_role** → guarde num lugar seguro (usaremos só na Fase 2; NÃO
  coloque no site).

### 4. Guardar as chaves no projeto

Copie o arquivo `.env.example` para um novo arquivo chamado `.env` e cole
os valores reais. O `.env` **não** vai para o histórico (está no
`.gitignore`), então suas chaves ficam protegidas.
