// Lógica da tela de login.
const form = document.getElementById("login-form");
const erro = document.getElementById("erro");
const botao = document.getElementById("botao-entrar");

form.addEventListener("submit", async (evento) => {
  evento.preventDefault(); // não recarrega a página
  erro.textContent = "";
  botao.disabled = true;
  botao.textContent = "Entrando...";

  const email = document.getElementById("email").value.trim();
  const senha = document.getElementById("senha").value;

  // Pede ao Supabase para fazer o login.
  const { error } = await sb.auth.signInWithPassword({
    email: email,
    password: senha,
  });

  if (error) {
    // Deu errado: mostra mensagem clara, sem travar a página.
    erro.textContent = "Email ou senha incorretos.";
    botao.disabled = false;
    botao.textContent = "Entrar";
    return;
  }

  // Deu certo: vai para a página de dentro.
  window.location.href = "home.html";
});
