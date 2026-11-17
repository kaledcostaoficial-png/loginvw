// "Guarda" de página: protege qualquer página que exija login.
// Se NÃO houver sessão ativa, manda a pessoa de volta para o login.
// Devolve a sessão (quando existe) para a página usar.
async function exigirLogin() {
  const { data } = await sb.auth.getSession();
  if (!data.session) {
    window.location.href = "index.html";
    return null;
  }
  return data.session;
}
