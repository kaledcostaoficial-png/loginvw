# Painel de Login — Plano de Implementação

> **Para quem for executar:** SUB-SKILL OBRIGATÓRIA: usar
> superpowers:subagent-driven-development (recomendado) ou
> superpowers:executing-plans para implementar tarefa por tarefa. Os passos
> usam caixas de seleção (`- [ ]`) para acompanhamento.

**Objetivo:** Colocar no ar um site de login (email + senha) onde só o
administrador cria contas, usando Supabase; depois, um painel próprio para o
admin criar, listar e remover usuários.

**Arquitetura:** Páginas web simples (HTML/CSS/JavaScript) que falam com o
Supabase Auth pela biblioteca oficial do navegador. A criação/remoção de
usuários (que exige privilégio de admin) roda em Edge Functions no servidor,
onde a chave de administrador fica escondida. Hospedagem estática gratuita.

**Tech Stack:** Supabase (Auth + Edge Functions), HTML/CSS/JavaScript puro,
biblioteca `@supabase/supabase-js`, hospedagem Vercel ou Netlify.

**Spec:** `docs/design.md`

## Restrições Globais (valem para todas as tarefas)

- **Sem 2FA** — login é só email + senha.
- **Sem auto-cadastro** — a opção de cadastro público do Supabase fica
  DESLIGADA; só o admin cria contas.
- **A chave `service_role` (admin) do Supabase NUNCA aparece no navegador** —
  só é usada dentro de Edge Functions, no servidor.
- **As páginas usam só a chave pública (`anon`)** do Supabase.
- Textos da interface em **português do Brasil**.

## Foco de Revisão (casos que precisam funcionar bem)

- **Senha errada ou usuário inexistente:** mostrar mensagem de erro clara, sem
  travar a página. (Tarefa 2)
- **Acessar página protegida sem estar logado:** redirecionar para o login,
  nunca mostrar o conteúdo protegido. (Tarefa 3)
- **Usuário comum tentando usar funções de admin:** o bloqueio acontece no
  servidor (Edge Function), não só escondendo o botão na tela. (Tarefas 6 e 7)
- **Criar usuário com email que já existe:** mostrar erro claro, sem criar
  duplicado. (Tarefa 6)
- **Sessão expirada / recarregar a página:** o usuário continua logado se a
  sessão é válida, ou é mandado ao login de forma limpa. (Tarefa 3)

---

# FASE 1 — Login no ar

### Tarefa 1: Criar e configurar o projeto no Supabase

**Arquivos:**
- Criar: `.env.example` (anota os nomes das chaves, sem valores reais)
- Criar: `README.md` (passo a passo de configuração)

**Interfaces:**
- Produz: a **URL do projeto** e a **chave pública (anon)**, usadas por todas
  as páginas. A **chave service_role** fica guardada só para as Edge Functions
  (Fase 2), nunca no site.

- [ ] **Passo 1: Criar o projeto no Supabase**
  No site supabase.com: criar conta (grátis) e um novo projeto. Anotar a
  região e a senha do banco.

- [ ] **Passo 2: Desligar o auto-cadastro**
  Em Authentication → Providers/Settings, DESLIGAR "Allow new users to sign
  up". Isso garante que só o admin cria contas.

- [ ] **Passo 3: Pegar as chaves**
  Em Project Settings → API: copiar a **Project URL** e a **anon public key**.
  Guardar a **service_role key** em lugar seguro (será usada só na Fase 2).

- [ ] **Passo 4: Criar um usuário de teste**
  Em Authentication → Users → Add user: criar um email/senha de teste.

- [ ] **Passo 5: Registrar as chaves nos arquivos**
  Escrever no `.env.example` os nomes `SUPABASE_URL` e `SUPABASE_ANON_KEY`
  (sem os valores reais) e, no `README.md`, onde colá-los.

- [ ] **Passo 6: Verificar**
  Conferir no painel do Supabase que o usuário de teste aparece em
  Authentication → Users e que o auto-cadastro está desligado.

- [ ] **Passo 7: Commit**
  ```bash
  git add .env.example README.md
  git commit -m "chore: configura projeto Supabase e documenta chaves"
  ```

---

### Tarefa 2: Tela de login

**Arquivos:**
- Criar: `index.html` (a tela de login)
- Criar: `css/styles.css` (visual limpo e simples)
- Criar: `js/supabaseClient.js` (cria a conexão com o Supabase usando URL +
  anon key)
- Criar: `js/login.js` (lógica do botão entrar)

**Interfaces:**
- Consome: `SUPABASE_URL` e `SUPABASE_ANON_KEY` (Tarefa 1).
- Produz: `supabaseClient.js` exporta uma conexão `supabase` usada pelas
  outras páginas. Ao logar com sucesso, redireciona para `home.html`.

- [ ] **Passo 1: Montar a página de login**
  `index.html` com campos de **email** e **senha** e um botão **Entrar**, mais
  um espaço para mensagem de erro. Estilo em `css/styles.css`.

- [ ] **Passo 2: Criar a conexão com o Supabase**
  Em `js/supabaseClient.js`, inicializar `@supabase/supabase-js` com a URL e a
  anon key (carregadas via script da biblioteca).

- [ ] **Passo 3: Lógica do login**
  Em `js/login.js`, ao clicar em Entrar, chamar
  `supabase.auth.signInWithPassword({ email, senha })`. Se der certo, ir para
  `home.html`. Se der erro, mostrar mensagem clara em português (ex.: "Email ou
  senha incorretos").

- [ ] **Passo 4: Verificar (manual, no navegador)**
  Abrir `index.html` localmente. Testar:
  - senha errada → aparece a mensagem de erro, a página não trava;
  - usuário de teste correto → redireciona para `home.html`.

- [ ] **Passo 5: Commit**
  ```bash
  git add index.html css/styles.css js/supabaseClient.js js/login.js
  git commit -m "feat: tela de login com Supabase"
  ```

---

### Tarefa 3: Página protegida e sair (logout)

**Arquivos:**
- Criar: `home.html` (página de "logado")
- Criar: `js/guard.js` (verifica se há sessão; se não, manda pro login)
- Criar: `js/home.js` (mostra o email logado e o botão Sair)

**Interfaces:**
- Consome: a conexão `supabase` de `supabaseClient.js` (Tarefa 2).
- Produz: `guard.js` com uma verificação reutilizável de sessão para proteger
  qualquer página futura (inclusive o painel de admin da Fase 2).

- [ ] **Passo 1: Proteger a página**
  Em `js/guard.js`, usar `supabase.auth.getSession()`. Se NÃO houver sessão,
  redirecionar imediatamente para `index.html`.

- [ ] **Passo 2: Conteúdo da página logada**
  `home.html` mostra "Você está logado como {email}" e um botão **Sair**. Em
  `js/home.js`, Sair chama `supabase.auth.signOut()` e volta para o login.

- [ ] **Passo 3: Verificar (manual, no navegador)**
  - Abrir `home.html` SEM estar logado → deve mandar pro login;
  - logar e abrir `home.html` → mostra o email; recarregar a página → continua
    logado;
  - clicar em Sair → volta ao login e `home.html` deixa de abrir.

- [ ] **Passo 4: Commit**
  ```bash
  git add home.html js/guard.js js/home.js
  git commit -m "feat: pagina protegida e logout"
  ```

---

### Tarefa 4: Colocar no ar (deploy)

**Arquivos:**
- Criar: `vercel.json` ou configuração equivalente (se necessário)

**Interfaces:**
- Consome: todas as páginas das Tarefas 2 e 3.
- Produz: uma **URL pública** (ex.: `seu-projeto.vercel.app`) com o login
  funcionando na internet.

- [ ] **Passo 1: Subir para um repositório Git**
  Criar repositório (ex.: GitHub) e enviar o projeto.

- [ ] **Passo 2: Conectar à hospedagem gratuita**
  Importar o repositório na Vercel (ou Netlify) como site estático.

- [ ] **Passo 3: Liberar a URL no Supabase**
  Em Authentication → URL Configuration, adicionar a URL pública nas
  "Redirect URLs"/"Site URL".

- [ ] **Passo 4: Verificar (no ar)**
  Abrir a URL pública em outro dispositivo/navegador e fazer login com o
  usuário de teste. Deve funcionar igual ao local.

- [ ] **Passo 5: Commit**
  ```bash
  git add vercel.json
  git commit -m "chore: configuracao de deploy"
  ```

---

# FASE 2 — Painel do administrador

### Tarefa 5: Marcar quem é administrador

**Arquivos:**
- Modificar: (configuração no painel do Supabase — sem arquivo de código)
- Criar: `docs/admin.md` (anota como um usuário vira admin)

**Interfaces:**
- Produz: uma marca de **admin** no usuário dono, que as Edge Functions vão
  checar. Abordagem: usar o campo `app_metadata.role = "admin"` do usuário
  (definido pelo admin no painel ou via função), que **não** pode ser alterado
  pelo próprio usuário comum.

- [ ] **Passo 1: Definir o dono como admin**
  No usuário do dono, definir `app_metadata` com `{ "role": "admin" }`
  (pelo painel do Supabase ou SQL). Documentar em `docs/admin.md`.

- [ ] **Passo 2: Verificar**
  Conferir que o usuário do dono tem `role: admin` em `app_metadata` e que um
  usuário comum NÃO tem.

- [ ] **Passo 3: Commit**
  ```bash
  git add docs/admin.md
  git commit -m "docs: define marcacao de administrador"
  ```

---

### Tarefa 6: Função para criar usuários (servidor)

**Arquivos:**
- Criar: `supabase/functions/criar-usuario/index.ts` (Edge Function)

**Interfaces:**
- Consome: a chave `service_role` (via variável de ambiente da função, nunca no
  navegador) e a marca de admin da Tarefa 5.
- Produz: endpoint que recebe `{ email, senha }` e cria o usuário. Retorna
  sucesso ou erro. Será chamado pela tela da Tarefa 8.

- [ ] **Passo 1: Checar quem chamou**
  A função lê o token de quem chamou (`Authorization`), confirma que é um
  usuário logado E que tem `app_metadata.role === "admin"`. Se não for,
  responde 403 (proibido). Este é o bloqueio no SERVIDOR.

- [ ] **Passo 2: Criar o usuário**
  Com um cliente admin (`service_role`), chamar
  `auth.admin.createUser({ email, password, email_confirm: true })`.

- [ ] **Passo 3: Tratar email duplicado**
  Se o email já existir, retornar mensagem clara ("Este email já tem conta"),
  sem criar duplicado.

- [ ] **Passo 4: Verificar**
  - Chamar a função SEM ser admin → recebe 403;
  - como admin, criar um email novo → usuário aparece no Supabase;
  - criar o mesmo email de novo → mensagem de "já existe".

- [ ] **Passo 5: Commit**
  ```bash
  git add supabase/functions/criar-usuario/index.ts
  git commit -m "feat: edge function para criar usuarios (so admin)"
  ```

---

### Tarefa 7: Funções para listar e remover usuários (servidor)

**Arquivos:**
- Criar: `supabase/functions/listar-usuarios/index.ts`
- Criar: `supabase/functions/remover-usuario/index.ts`

**Interfaces:**
- Consome: mesma checagem de admin da Tarefa 6.
- Produz: endpoint que devolve a lista de usuários (email + id) e endpoint que
  remove um usuário por `id`. Usados pela tela da Tarefa 8.

- [ ] **Passo 1: Reusar a checagem de admin**
  As duas funções repetem a verificação da Tarefa 6 (logado + role admin), 403
  se não for.

- [ ] **Passo 2: Listar**
  `listar-usuarios` usa `auth.admin.listUsers()` e devolve só o necessário
  (email e id).

- [ ] **Passo 3: Remover**
  `remover-usuario` recebe `{ id }` e chama `auth.admin.deleteUser(id)`.
  Impedir o admin de remover a própria conta (mensagem clara).

- [ ] **Passo 4: Verificar**
  - Não-admin → 403 nas duas;
  - admin lista → vê os usuários criados;
  - admin remove um usuário comum → some da lista;
  - admin tenta remover a si mesmo → bloqueado com mensagem.

- [ ] **Passo 5: Commit**
  ```bash
  git add supabase/functions/listar-usuarios/index.ts supabase/functions/remover-usuario/index.ts
  git commit -m "feat: edge functions listar e remover usuarios (so admin)"
  ```

---

### Tarefa 8: Tela do painel de admin

**Arquivos:**
- Criar: `admin.html`
- Criar: `js/admin.js`

**Interfaces:**
- Consome: `guard.js` (Tarefa 3) e as três Edge Functions (Tarefas 6 e 7).
- Produz: a tela onde o dono cria, vê e remove usuários.

- [ ] **Passo 1: Proteger e checar admin na tela**
  `admin.html` usa `guard.js` (precisa estar logado). Em `js/admin.js`, se o
  usuário logado não for admin, mostrar aviso e mandar para `home.html`.
  (Lembrando: o bloqueio de verdade é no servidor, Tarefas 6 e 7; aqui é só
  para a tela não confundir.)

- [ ] **Passo 2: Formulário de criar usuário**
  Campos email + senha + botão Criar, que chama a função `criar-usuario` e
  mostra o resultado (sucesso ou erro).

- [ ] **Passo 3: Lista de usuários com remover**
  Ao abrir, chamar `listar-usuarios` e mostrar a lista. Cada linha tem um botão
  **Remover** que chama `remover-usuario` e atualiza a lista.

- [ ] **Passo 4: Verificar (no ar, ponta a ponta)**
  - Logar como admin → abre o painel, cria um usuário, ele aparece na lista;
  - sair e logar com esse novo usuário → entra no `home.html`, mas se tentar
    abrir `admin.html` é barrado;
  - voltar como admin → remover o usuário, ele some.

- [ ] **Passo 5: Commit**
  ```bash
  git add admin.html js/admin.js
  git commit -m "feat: painel de admin para criar e remover usuarios"
  ```
