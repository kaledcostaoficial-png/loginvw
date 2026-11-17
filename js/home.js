// Página de dentro (só para quem está logado).
async function iniciar() {
  const sessao = await exigirLogin(); // de guard.js
  if (!sessao) return; // já foi redirecionado para o login

  // Mostra o email de quem está logado.
  document.getElementById("email-usuario").textContent = sessao.user.email;
  document.getElementById("conteudo").style.visibility = "visible";

  // Botão Sair: encerra a sessão e volta ao login.
  document.getElementById("botao-sair").addEventListener("click", async () => {
    await sb.auth.signOut();
    window.location.href = "index.html";
  });
}

iniciar();
