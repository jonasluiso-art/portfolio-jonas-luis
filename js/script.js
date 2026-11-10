/* =========================================================
   Interações do portfólio - JavaScript puro (sem bibliotecas)
   1. Menu responsivo (hambúrguer)
   2. Tema claro/escuro (salvo no navegador)
   3. Destaque do link da seção visível
   4. Filtro do portfólio (mostrar/esconder trabalhos)
   5. Validação e envio simulado do formulário
   ========================================================= */

// ---------- 1. Menu responsivo ----------
const btnMenu = document.getElementById('btnMenu');
const menu = document.getElementById('menu');

btnMenu.addEventListener('click', function () {
  const aberto = menu.classList.toggle('aberto'); // toggle devolve true se adicionou
  btnMenu.classList.toggle('aberto', aberto);
  btnMenu.setAttribute('aria-expanded', aberto);
});

// Ao escolher um link no celular, o menu fecha sozinho
menu.querySelectorAll('a').forEach(function (link) {
  link.addEventListener('click', function () {
    menu.classList.remove('aberto');
    btnMenu.classList.remove('aberto');
    btnMenu.setAttribute('aria-expanded', false);
  });
});

// ---------- 2. Tema claro/escuro ----------
const btnTema = document.getElementById('btnTema');

function aplicarTema(escuro) {
  document.body.classList.toggle('escuro', escuro);
  btnTema.textContent = escuro ? '☀️' : '🌙';
}

// localStorage guarda a escolha; try/catch porque o navegador pode bloquear o acesso
let temaSalvo = null;
try { temaSalvo = localStorage.getItem('tema'); } catch (e) { /* segue com o padrão */ }
aplicarTema(temaSalvo === 'escuro');

btnTema.addEventListener('click', function () {
  const escuro = !document.body.classList.contains('escuro');
  aplicarTema(escuro);
  try { localStorage.setItem('tema', escuro ? 'escuro' : 'claro'); } catch (e) { /* ignora */ }
});

// ---------- 3. Link ativo conforme a seção visível ----------
const linksMenu = menu.querySelectorAll('a');
const secoes = document.querySelectorAll('main section');

function marcarSecaoAtual() {
  let atual = secoes[0].id;
  secoes.forEach(function (secao) {
    // a seção é a "atual" quando o topo dela passou do meio da tela
    if (secao.getBoundingClientRect().top <= window.innerHeight / 2) atual = secao.id;
  });
  // no fim da página, a última seção pode ser curta demais para chegar ao meio
  if (window.innerHeight + window.scrollY >= document.body.scrollHeight - 2) {
    atual = secoes[secoes.length - 1].id;
  }
  linksMenu.forEach(function (link) {
    link.classList.toggle('ativo', link.getAttribute('href') === '#' + atual);
  });
}
window.addEventListener('scroll', marcarSecaoAtual);
marcarSecaoAtual();

// ---------- 4. Filtro do portfólio ----------
const botoesFiltro = document.querySelectorAll('#filtros button');
const trabalhos = document.querySelectorAll('.trabalho');

botoesFiltro.forEach(function (botao) {
  botao.addEventListener('click', function () {
    const filtro = botao.dataset.filtro;
    botoesFiltro.forEach(function (b) { b.classList.remove('ativo'); });
    botao.classList.add('ativo');
    // esconde os trabalhos que não são da categoria escolhida
    trabalhos.forEach(function (t) {
      t.classList.toggle('oculto', filtro !== 'todos' && t.dataset.categoria !== filtro);
    });
  });
});

// ---------- 5. Validação e envio simulado do formulário ----------
const form = document.getElementById('formContato');
const modal = document.getElementById('modal');

// Formato usuario@dominio.com: texto, @, texto, ponto, texto (sem espaços)
const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Mostra ou limpa a mensagem de erro de um campo; devolve true se o campo é válido
function validarCampo(id, idErro, mensagemErro) {
  const campo = document.getElementById(id);
  const erro = document.getElementById(idErro);
  const valido = mensagemErro === '';
  erro.textContent = mensagemErro;
  campo.parentElement.classList.toggle('invalido', !valido);
  return valido;
}

function validarFormulario() {
  const nome = form.nome.value.trim();
  const email = form.email.value.trim();
  const mensagem = form.mensagem.value.trim();

  const nomeOk = validarCampo('nome', 'erroNome',
    nome === '' ? 'Informe seu nome.' : nome.length < 3 ? 'O nome deve ter pelo menos 3 letras.' : '');
  const emailOk = validarCampo('email', 'erroEmail',
    email === '' ? 'Informe seu e-mail.' : !regexEmail.test(email) ? 'E-mail inválido. Ex: usuario@dominio.com' : '');
  const mensagemOk = validarCampo('mensagem', 'erroMensagem',
    mensagem === '' ? 'Escreva uma mensagem.' : mensagem.length < 10 ? 'A mensagem deve ter pelo menos 10 caracteres.' : '');

  return nomeOk && emailOk && mensagemOk;
}

form.addEventListener('submit', function (evento) {
  evento.preventDefault(); // impede o envio real (não há servidor): o envio é simulado

  if (!validarFormulario()) {
    form.querySelector('.invalido input, .invalido textarea').focus(); // foca no 1º campo com erro
    return;
  }

  const primeiroNome = form.nome.value.trim().split(' ')[0];
  document.getElementById('modalTexto').textContent =
    'Obrigado, ' + primeiroNome + '! Recebi sua mensagem e responderei em breve.';
  form.reset();          // limpa os campos
  modal.hidden = false;  // abre a caixa modal
  document.getElementById('btnFecharModal').focus();
});

// Fecha o modal pelo botão, clicando fora da caixa ou com a tecla Esc
function fecharModal() { modal.hidden = true; }
document.getElementById('btnFecharModal').addEventListener('click', fecharModal);
modal.addEventListener('click', function (e) { if (e.target === modal) fecharModal(); });
document.addEventListener('keydown', function (e) { if (e.key === 'Escape') fecharModal(); });

// Ano atual no rodapé
document.getElementById('ano').textContent = new Date().getFullYear();
