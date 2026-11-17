# Painel de Login — Documento de Design

**Data:** 2026-11-17
**Dono:** Kaled

---

## O que é e por quê

Um site de login na internet. O administrador (o dono) cria as contas dos
usuários, e só quem tem conta criada consegue entrar. No futuro, esse login
vai dar acesso a um programa do dono ("Topton"), mas por enquanto o foco é
só o sistema de login funcionando e no ar.

## Objetivos

- Ter uma **tela de login** (email + senha) na internet, acessível de qualquer
  lugar.
- Ter um **painel de administrador** onde o dono cria, vê e remove contas de
  usuários.
- Guardar as senhas de forma **segura** (sem o dono precisar programar isso do
  zero).
- Ser **gratuito pra começar** e simples de manter por um iniciante.

## Não-objetivos (o que NÃO vamos fazer agora)

- **Sem verificação de duas etapas (2FA)** — decisão do dono.
- **Sem auto-cadastro** — o usuário não se cadastra sozinho; só o admin cria
  contas.
- **Sem o programa "Topton" ainda** — ele vem depois; aqui é só o login.
- **Sem pagamentos/assinaturas** por enquanto.

## Anti-objetivos (o que seria um fracasso mesmo que "funcione")

- Senhas guardadas de forma insegura (texto puro) — inaceitável.
- A "chave mestra" de administrador exposta no navegador, onde qualquer um
  poderia roubar — inaceitável.

## Como vamos construir (abordagem escolhida)

Usar o **Supabase** como base de login. Ele é uma ferramenta profissional,
gratuita pra começar, que já cuida da parte difícil e perigosa: guardar
senhas com segurança e controlar quem está logado.

Por cima do Supabase, construímos um site simples (páginas web) com:

- **Tela de login** — email e senha.
- **Página "logado"** — para onde o usuário vai depois de entrar (por enquanto
  só mostra que deu certo).
- **Painel de admin** — página protegida, só o dono acessa, para criar e
  remover usuários.

### Abordagens consideradas

1. **Supabase (ESCOLHIDA).** Base de login pronta e segura. Rápido de montar,
   seguro por padrão, grátis pra começar. O dono continua dono de tudo.
2. **Fazer o login "na mão" do zero.** Descartada: a parte de segurança de
   senha é onde iniciantes são invadidos. Mais trabalho e mais risco, sem
   ganho real para este caso.
3. **Usar só o painel do próprio Supabase pra criar usuários.** Parcialmente
   usada no começo (Fase 1), mas o dono quer o painel dele próprio, então
   construímos isso na Fase 2.

## Plano em fases (pra ir ao ar rápido)

- **Fase 1 — Login no ar.** Tela de login + página de "logado". As contas,
  nessa fase, são criadas pelo dono direto no painel do Supabase. Objetivo:
  ver o login funcionando de verdade na internet.
- **Fase 2 — Painel do admin.** Construir no site a tela onde o dono cria, lista
  e remove usuários, usando uma função segura no servidor (a "chave mestra"
  fica escondida no servidor, nunca no navegador).

## Detalhes técnicos (para quem for construir)

- **Login/segurança:** Supabase Auth (email + senha).
- **Criação de usuários pelo admin:** precisa de privilégio de administrador,
  que **não pode** ficar no navegador. Será feita por uma **Edge Function** do
  Supabase (código que roda no servidor com a chave de administrador),
  acessível só para o dono.
- **Site (as páginas):** páginas web simples (HTML/CSS/JavaScript) usando a
  biblioteca oficial do Supabase para o navegador. Escolha pensada para um
  iniciante conseguir entender e mexer.
- **Hospedagem:** a definir na etapa do plano — caminho gratuito e simples
  (ex.: Vercel ou Netlify). Será recomendado o mais fácil.

## O que fica a cargo de quem constrói

- Estrutura exata das pastas e arquivos do site.
- Visual/estilo da tela de login (será proposto um visual limpo e simples).
- Nomes técnicos internos (tabelas, funções).
