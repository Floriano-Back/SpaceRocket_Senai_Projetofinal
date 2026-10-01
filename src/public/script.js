const $ = s => document.querySelector(s);
const e = s => String(s ?? '').replace(/[&<>"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
let S = JSON.parse(localStorage.getItem('sr') || '{}');
let V = [];
$('#api').value = localStorage.getItem('srapi') || $('#api').value;
$('#api').onchange = () => localStorage.setItem('srapi', $('#api').value.trim());

function toast(t, ok) {
  const d = document.createElement('div');
  d.className = ok ? 'ok' : 'er'; d.textContent = t;
  $('#msg').append(d); setTimeout(() => d.remove(), 4000);
}

async function api(path, method = 'GET', body) {
  const h = {'Content-Type': 'application/json'};
  if (S.token) h.Authorization = 'Bearer ' + S.token;
  let r;
  try { r = await fetch($('#api').value.trim() + path, {method, headers: h, body: body ? JSON.stringify(body) : undefined}); }
  catch { throw new Error('Não foi possível conectar ao back-end (servidor ligado? CORS habilitado?)'); }
  let d = {}; try { d = await r.json(); } catch {}
  if (S.token && (r.status === 401 || d.msg === 'Negado!!!')) {
    S = {}; save(); go(); throw new Error('Sessão expirada. Faça login novamente.');
  }
  if (!r.ok) throw new Error(d.msg || d.erro || d.message || 'Erro ' + r.status);
  return d;
}
const run = async f => { try { await f(); } catch (x) { toast(x.message, false); } };
const admin = () => S.user && S.user.tipo_usuario === 'ADMIN';
const save = () => localStorage.setItem('sr', JSON.stringify(S));

function setNav(items) {
  $('#nav').innerHTML = items.map(([k, t]) => `<button class="s" onclick="go('${k}')">${t}</button>`).join('');
}
function go(v) {
  $('#who').textContent = S.user ? `${S.user.name || S.user.email} (${S.user.tipo_usuario})` : '';
  $('#out').hidden = !S.token;
  if (!S.token) { setNav([]); return authView(); }
  setNav([['voos', 'Voos'], ['ag', 'Agendamentos'], ['av', 'Avaliações'], ...(admin() ? [['pas', 'Passageiros']] : [])]);
  run(() => v === 'ag' ? agView() : v === 'av' ? avView() : v === 'pas' && admin() ? pasView() : voosView());
}
$('#out').onclick = () => { S = {}; save(); go(); };

/* ---------- Login / Cadastro ---------- */
function authView(tab = 'login') {
  $('#app').innerHTML = `<div class="card box">
    <div class="tabs"><button class="${tab=='login'?'on':'s'}" onclick="authView('login')">Entrar</button>
    <button class="${tab=='reg'?'on':'s'}" onclick="authView('reg')">Cadastrar</button></div>
    ${tab == 'login' ? `<form id="f">
      <div class="g"><div><label>E-mail</label><input name="email" type="email" required></div>
      <div><label>Senha</label><input name="senha" type="password" required></div></div>
      <button>Entrar</button></form>` : `<form id="f">
      <div class="g"><div><label>Tipo de usuário</label><select name="tipo" id="tipo"><option>PASSAGEIRO</option><option>ADMIN</option></select></div>
      <div><label>Nome</label><input name="nome" required></div>
      <div><label>E-mail</label><input name="email" type="email" required></div>
      <div><label>Senha</label><input name="senha" type="password" required></div></div>
      <div id="pas"><div class="g">
      <div><label>CPF</label><input name="cpf"></div>
      <div><label>Nascimento</label><input name="data_nascimento" type="date"></div>
      <div><label>Telefone</label><input name="telefone"></div>
      <div><label>Peso (kg)</label><input name="peso" type="number" step="0.01"></div>
      <div><label>Altura (m)</label><input name="altura" type="number" step="0.01"></div></div>
      <div class="g"><div><label>CEP</label><input name="cep"></div><div><label>Rua</label><input name="rua"></div>
      <div><label>Cidade</label><input name="cidade"></div><div><label>Estado</label><input name="estado"></div></div></div>
      <button>Cadastrar</button></form>`}</div>`;
  if (tab == 'reg') $('#tipo').onchange = () => $('#pas').hidden = $('#tipo').value == 'ADMIN';
  $('#f').onsubmit = ev => { ev.preventDefault(); run(() => tab == 'login' ? login(fd(ev)) : cadastrar(fd(ev))); };
}
const fd = ev => Object.fromEntries(new FormData(ev.target));

async function login(f) {
  // o back-end espera a senha no campo "senha_hash"
  const r = await api('/auth/login', 'POST', {email: f.email, senha_hash: f.senha});
  S = {token: r.token, user: JSON.parse(atob(r.token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')))};
  if (!admin()) {
    const ps = await api('/passageiros');
    const p = ps.find(x => x.email === S.user.email);
    S.pid = p ? p.id_passageiro : null;
  }
  save(); toast('Login efetuado!', true); go('voos');
}

async function cadastrar(f) {
  if (f.tipo == 'ADMIN') {
    await api('/users', 'POST', {nome: f.nome, email: f.email, senha_hash: f.senha, tipo_usuario: 'ADMIN'});
  } else {
    const b = {nome: f.nome, email: f.email, senha: f.senha, cpf: f.cpf, data_nascimento: f.data_nascimento,
      telefone: f.telefone, peso: +f.peso || null, altura: +f.altura || null};
    if (f.cep) b.endereco = {cep: f.cep, rua: f.rua, cidade: f.cidade, estado: f.estado};
    await api('/passageiros', 'POST', b);
  }
  toast('Cadastro realizado! Faça login.', true); authView('login');
}

/* ---------- Voos ---------- */
const ST = ['AGENDADO', 'EMBARQUE', 'FINALIZADO', 'PENDENTE', 'CANCELADO'];
async function voosView() {
  const r = await api(admin() ? '/voos/all' : '/voos');
  V = r.resultado || [];
  if (!admin()) {
    try { const av = (await api('/avaliacoes')).result || []; S.apto = av.length ? av[0].condicao_fisica : null; }
    catch { S.apto = null; }
  }
  $('#app').innerHTML = (admin() ? '' : aviso()) + (admin() ? `<div class="card"><h2 id="ft">Cadastrar voo</h2><form id="vf">
    <input type="hidden" name="id">
    <div class="g"><div><label>Código</label><input name="codigo_voo" required></div>
    <div><label>Origem</label><input name="origem" required></div>
    <div><label>Destino</label><input name="destino" required></div>
    <div><label>Data</label><input name="data_voo" type="date" required></div>
    <div><label>Horário</label><input name="horario_voo" type="time" step="1" required></div>
    <div><label>Capacidade</label><input name="capacidade" type="number" min="1" required></div>
    <div><label>Valor (R$)</label><input name="valor" type="number" step="0.01" min="0" required></div>
    <div><label>Status (edição)</label><select name="vooStatus">${ST.map(s => `<option>${s}</option>`).join('')}</select></div></div>
    <button>Salvar</button> <button type="button" class="s" onclick="voosView()">Limpar</button></form></div>` : '') +
    `<div class="card x"><h2>${admin() ? 'Todos os voos' : 'Voos disponíveis'}</h2><table>
    <tr><th>Código</th><th>Rota</th><th>Data</th><th>Valor</th><th>Vagas</th><th>Status</th><th></th></tr>
    ${V.map(v => `<tr><td>${e(v.codigo_voo)}</td><td>${e(v.origem)} → ${e(v.destino)}</td>
    <td>${e(String(v.data_voo).slice(0, 10))} ${e(String(v.horario_voo).slice(0, 5))}</td>
    <td>R$ ${Number(v.valor).toFixed(2)}</td><td>${e(v.vagas_disponiveis ?? v.capacidade)}</td>
    <td><span class="tag">${e(v.vooStatus)}</span></td><td>${admin()
      ? `<button class="s" onclick="editarVoo(${v.id_voo})">Editar</button> <button class="d" onclick="delVoo(${v.id_voo})">Excluir</button>`
      : `<button onclick="agendar(${v.id_voo})" ${S.apto === 'APTO' ? '' : 'disabled title="Necessário estar APTO na avaliação física"'}>Agendar</button>`}</td></tr>`).join('') || '<tr><td colspan="7">Nenhum voo.</td></tr>'}
    </table></div>`;
  if (admin()) $('#vf').onsubmit = ev => { ev.preventDefault(); run(() => salvarVoo(fd(ev))); };
}
function editarVoo(id) {
  const v = V.find(x => x.id_voo == id), f = $('#vf');
  f.id.value = id; f.codigo_voo.value = v.codigo_voo; f.codigo_voo.disabled = true;
  f.capacidade.value = v.capacidade; f.capacidade.disabled = true;
  f.origem.value = v.origem; f.destino.value = v.destino;
  f.data_voo.value = String(v.data_voo).slice(0, 10); f.horario_voo.value = String(v.horario_voo).slice(0, 8);
  f.valor.value = v.valor; f.vooStatus.value = v.vooStatus;
  $('#ft').textContent = 'Editar voo ' + v.codigo_voo; scrollTo(0, 0);
}
async function salvarVoo(f) {
  if (f.id) {
    await api('/voos/' + f.id, 'PUT', {origem: f.origem, destino: f.destino, data_voo: f.data_voo,
      horario_voo: f.horario_voo, valor: +f.valor, vooStatus: f.vooStatus});
    toast('Voo atualizado!', true);
  } else {
    await api('/voos', 'POST', {codigo_voo: f.codigo_voo, origem: f.origem, destino: f.destino, data_voo: f.data_voo,
      horario_voo: f.horario_voo, capacidade: +f.capacidade, valor: +f.valor});
    toast('Voo cadastrado!', true);
  }
  voosView();
}
const delVoo = id => confirm('Excluir este voo?') && run(async () => { await api('/voos/' + id, 'DELETE'); toast('Voo excluído.', true); voosView(); });

/* ---------- Agendamentos ---------- */
const agora = () => new Date().toISOString().slice(0, 19).replace('T', ' ');
async function agendar(id_voo, id_passageiro = S.pid) {
  if (!id_passageiro) return toast('Seu usuário não possui cadastro de passageiro.', false);
  await run(async () => {
    await api('/agendamentos', 'POST', {id_passageiro, id_voo, data_agendamento: agora()});
    toast('Agendamento criado!', true); go('ag');
  });
}
async function agView() {
  const [a, vs, ps] = await Promise.all([
    api('/agendamentos'),
    api(admin() ? '/voos/all' : '/voos'),
    admin() ? api('/passageiros') : Promise.resolve([])
  ]);
  V = vs.resultado || [];
  let L = a.result || [];
  if (!admin()) L = L.filter(x => x.id_passageiro == S.pid);
  const vn = id => { const v = V.find(x => x.id_voo == id); return v ? `${v.codigo_voo} (${v.origem} → ${v.destino})` : 'Voo #' + id; };
  const pn = id => { const p = ps.find(x => x.id_passageiro == id); return p ? p.nome : '#' + id; };
  $('#app').innerHTML = (admin() ? `<div class="card"><h2>Novo agendamento</h2><form id="af"><div class="g">
    <div><label>Passageiro</label><select name="p" required>${ps.map(p => `<option value="${p.id_passageiro}">${e(p.nome)}</option>`).join('')}</select></div>
    <div><label>Voo</label><select name="v" required>${V.map(v => `<option value="${v.id_voo}">${e(v.codigo_voo)} - ${e(v.origem)} → ${e(v.destino)}</option>`).join('')}</select></div></div>
    <button>Agendar</button></form></div>` : '') +
    `<div class="card x"><h2>${admin() ? 'Todos os agendamentos' : 'Meus agendamentos'}</h2><table>
    <tr><th>#</th>${admin() ? '<th>Passageiro</th>' : ''}<th>Voo</th><th>Data</th><th>Status</th><th></th></tr>
    ${L.map(x => `<tr><td>${x.id_agendamento}</td>${admin() ? `<td>${e(pn(x.id_passageiro))}</td>` : ''}
    <td>${e(vn(x.id_voo))}</td><td>${e(String(x.data_agendamento).replace('T', ' ').slice(0, 16))}</td>
    <td><span class="tag">${e(x.agendamentosStatus || x.agendamentoStatus)}</span></td>
    <td><button class="d" onclick="delAg(${x.id_agendamento})">Cancelar</button></td></tr>`).join('') || `<tr><td colspan="6">Nenhum agendamento.</td></tr>`}
    </table></div>`;
  if (admin()) $('#af').onsubmit = ev => { ev.preventDefault(); const f = fd(ev); agendar(+f.v, +f.p); };
}
const delAg = id => confirm('Cancelar este agendamento?') && run(async () => { await api('/agendamentos/' + id, 'DELETE'); toast('Agendamento cancelado.', true); agView(); });

/* ---------- Avaliações físicas ---------- */
const aviso = () => `<div class="card note ${S.apto === 'APTO' ? 'apto' : 'inapto'}">${S.apto === 'APTO'
  ? 'Você está APTO para voar.'
  : S.apto ? 'Sua última avaliação física deu ' + S.apto + ': não é possível agendar voos.'
  : 'Você ainda não tem avaliação física. Procure a administração antes de agendar.'}</div>`;

const imcCalc = (p, a) => p > 0 && a > 0 ? Math.round(p / (a * a) * 100) / 100 : null;
function imcInfo(i) {
  if (i < 18.5) return ['Abaixo do peso', false];
  if (i < 25) return ['Peso normal', true];
  if (i < 30) return ['Sobrepeso', true];
  if (i < 35) return ['Obesidade Grau I', false];
  if (i < 40) return ['Obesidade Grau II', false];
  return ['Obesidade Grau III', false];
}

async function avView() {
  const [a, ps] = await Promise.all([api('/avaliacoes'), admin() ? api('/passageiros') : Promise.resolve([])]);
  const L = a.result || [];
  $('#app').innerHTML = (admin() ? `<div class="card"><h2>Nova avaliação física</h2><form id="avf"><div class="g">
    <div><label>Passageiro</label><select name="id_passageiro" required>${ps.map(p => `<option value="${p.id_passageiro}">${e(p.nome)}</option>`).join('')}</select></div>
    <div><label>Peso (kg)</label><input name="peso" type="number" step="0.01" min="20" max="300" required></div>
    <div><label>Altura (m)</label><input name="altura" type="number" step="0.01" min="0.5" max="2.5" required></div>
    <div><label>Observação</label><input name="observacao"></div></div>
    <p id="prev" class="note">Informe peso e altura para ver o IMC.</p>
    <button>Salvar avaliação</button></form></div>` : '') +
    `<div class="card x"><h2>${admin() ? 'Avaliações físicas' : 'Minhas avaliações físicas'}</h2><table>
    <tr><th>#</th>${admin() ? '<th>Passageiro</th>' : ''}<th>Peso</th><th>Altura</th><th>IMC</th><th>Classificação</th><th>Condição</th><th>Data</th>${admin() ? '<th></th>' : ''}</tr>
    ${L.map(x => `<tr><td>${x.id_avaliacao}</td>${admin() ? `<td>${e(x.nome_passageiro)}</td>` : ''}
    <td>${Number(x.peso).toFixed(1)} kg</td><td>${Number(x.altura).toFixed(2)} m</td><td>${Number(x.imc).toFixed(2)}</td>
    <td>${e(x.classificacao)}</td><td><span class="tag ${x.condicao_fisica === 'APTO' ? 'apto' : 'inapto'}">${e(x.condicao_fisica)}</span></td>
    <td>${e(String(x.data_avaliacao).replace('T', ' ').slice(0, 16))}</td>
    ${admin() ? `<td><button class="d" onclick="delAv(${x.id_avaliacao})">Excluir</button></td>` : ''}</tr>`).join('') || `<tr><td colspan="9">Nenhuma avaliação.</td></tr>`}
    </table></div>`;
  if (!admin()) return;
  const f = $('#avf');
  f.peso.oninput = f.altura.oninput = () => {
    const i = imcCalc(+f.peso.value, +f.altura.value);
    if (!i) return $('#prev').textContent = 'Informe peso e altura para ver o IMC.';
    const [c, ok] = imcInfo(i);
    $('#prev').innerHTML = `IMC <b>${i.toFixed(2)}</b> — ${c} → <span class="tag ${ok ? 'apto' : 'inapto'}">${ok ? 'APTO' : 'INAPTO'}</span>`;
  };
  f.onsubmit = ev => { ev.preventDefault(); const d = fd(ev); run(async () => {
    const r = await api('/avaliacoes', 'POST', {id_passageiro: +d.id_passageiro, peso: +d.peso, altura: +d.altura, observacao: d.observacao});
    toast(`Avaliação salva: IMC ${r.result.imc} (${r.result.condicao_fisica})`, true); avView();
  }); };
}
const delAv = id => confirm('Excluir esta avaliação?') && run(async () => { await api('/avaliacoes/' + id, 'DELETE'); toast('Avaliação excluída.', true); avView(); });

/* ---------- Passageiros (admin) ---------- */
let PS = [];
async function pasView() {
  PS = await api('/passageiros');
  const linhas = q => PS.filter(p => [p.nome, p.email, p.cpf].join(' ').toLowerCase().includes(q.toLowerCase()))
    .map(p => `<tr><td>${p.id_passageiro}</td><td>${e(p.nome)}</td><td>${e(p.email)}</td><td>${e(p.cpf)}</td><td>${e(p.telefone)}</td>
      <td><button class="d" onclick="delPas(${p.id_passageiro})">Excluir</button></td></tr>`).join('')
    || '<tr><td colspan="6">Nenhum passageiro encontrado.</td></tr>';
  $('#app').innerHTML = `<div class="card x"><h2>Passageiros cadastrados (${PS.length})</h2>
    <div class="g"><input id="busca" placeholder="Buscar por nome, e-mail ou CPF"></div>
    <table><tr><th>#</th><th>Nome</th><th>E-mail</th><th>CPF</th><th>Telefone</th><th></th></tr>
    <tbody id="pl">${linhas('')}</tbody></table></div>`;
  $('#busca').oninput = ev => $('#pl').innerHTML = linhas(ev.target.value);
}
const delPas = id => {
  const p = PS.find(x => x.id_passageiro == id);
  if (!confirm(`Excluir o passageiro "${p ? p.nome : id}"? Isso remove também o usuário, as avaliações físicas e os agendamentos dele.`)) return;
  run(async () => { await api('/passageiros/' + id, 'DELETE'); toast('Passageiro excluído.', true); pasView(); });
};

go('voos');