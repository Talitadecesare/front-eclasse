// Estado global da aplicação
let state = {
    jogos: [],
    times: [],
    competidores: [],
    confrontos: [],
};

// Inicialização
document.addEventListener('DOMContentLoaded', async () => {
    await carregarDados();
    configurarNavegacao();
    renderizarTudo();
});

// Busca todos os dados via service
async function carregarDados() {
    try {
        const [jogos, times, competidores, confrontos] = await Promise.all([
            getJogos(),
            getTimes(),
            getCompetidores(),
            getConfrontos(),
        ]);

        state.jogos = jogos;
        state.times = times;
        state.competidores = competidores;
        state.confrontos = confrontos;
    } catch (erro) {
        console.error('Erro ao carregar dados:', erro);
    }
}

// Configura cliques na navegação lateral
function configurarNavegacao() {
    const itens = document.querySelectorAll('#sidebar-nav li');

    itens.forEach(item => {
        item.addEventListener('click', () => {
            const view = item.getAttribute('data-view');
            trocarView(view);
            itens.forEach(i => i.classList.remove('active'));
            item.classList.add('active');
        });
    });
}

function trocarView(viewId) {
    document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
    document.getElementById(`view-${viewId}`).classList.add('active');
}

function renderizarTudo() {
    renderizarDashboard();
    renderizarJogos();
    renderizarTimes();
    renderizarCompetidores();
    renderizarConfrontos();
}

// --- Funções de renderização ---

function renderizarDashboard() {
    const stats = document.getElementById('dashboard-stats');
    const proximos = document.getElementById('upcoming-matches');

    const encerrados = state.confrontos.filter(c => c.status === 'finished').length;
    const agendados = state.confrontos.filter(c => c.status === 'scheduled').length;

    stats.innerHTML = `
        <div class="card">
            <span class="card-tag">Torneio</span>
            <h3>${state.times.length}</h3>
            <p class="subtitle">Equipes</p>
        </div>
        <div class="card">
            <span class="card-tag">Atletas</span>
            <h3>${state.competidores.length}</h3>
            <p class="subtitle">Competidores</p>
        </div>
        <div class="card">
            <span class="card-tag">Encerrados</span>
            <h3>${encerrados}</h3>
            <p class="subtitle">Resultados</p>
        </div>
        <div class="card">
            <span class="card-tag">Pendentes</span>
            <h3>${agendados}</h3>
            <p class="subtitle">Agendamentos</p>
        </div>
    `;

    const lista = state.confrontos.filter(c => c.status === 'scheduled').slice(0, 3);

    proximos.innerHTML = lista.map(c => {
        const jogo = state.jogos.find(j => j.id == c.gameId);
        const time1 = state.times.find(t => t.id == c.team1Id);
        const time2 = state.times.find(t => t.id == c.team2Id);
        return `
            <div class="card">
                <span class="card-tag">${jogo?.name || 'Jogo'}</span>
                <div class="match-card">
                    <div class="team-score"><strong>${time1?.name || 'TBD'}</strong></div>
                    <div class="vs">VS</div>
                    <div class="team-score"><strong>${time2?.name || 'TBD'}</strong></div>
                </div>
            </div>
        `;
    }).join('');
}

// Botões de editar/excluir reutilizáveis nos cards
function botoes(tipo, colecao, id) {
    return `
        <div style="margin-top: 0.8rem; display:flex; gap: 0.5rem;">
            <button onclick="abrirFormulario('${tipo}', ${id})" style="padding: 4px 8px; font-size: 0.7rem;">Editar</button>
            <button onclick="excluirItem('${colecao}', ${id})" style="padding: 4px 8px; font-size: 0.7rem;">Excluir</button>
        </div>`;
}

function renderizarJogos() {
    const lista = document.getElementById('list-jogos');
    lista.innerHTML = state.jogos.map(j => `
        <div class="card">
            <span class="card-tag">${j.genre}</span>
            <h3>${j.name}</h3>
            <p class="subtitle">ID: ${j.id}</p>
            ${botoes('jogo', 'jogos', j.id)}
        </div>
    `).join('');
}

function renderizarTimes() {
    const lista = document.getElementById('list-times');
    lista.innerHTML = state.times.map(t => `
        <div class="card" style="border-right: 4px solid ${t.color}">
            <span class="card-tag">EQUIPE</span>
            <h3>${t.name}</h3>
            <p class="subtitle">${state.competidores.filter(c => c.teamId == t.id).length} Jogadores</p>
            ${botoes('time', 'times', t.id)}
        </div>
    `).join('');
}

function renderizarCompetidores() {
    const lista = document.getElementById('list-competidores');
    lista.innerHTML = state.competidores.map(c => {
        const time = state.times.find(t => t.id == c.teamId);
        return `
            <div class="card">
                <span class="card-tag">${time?.name || 'Sem Time'}</span>
                <h3>${c.nickname}</h3>
                <p class="subtitle">${c.name}</p>
                ${botoes('competidor', 'competidores', c.id)}
            </div>
        `;
    }).join('');
}

function renderizarConfrontos() {
    const lista = document.getElementById('list-confrontos');
    lista.innerHTML = state.confrontos.map(c => {
        const jogo = state.jogos.find(j => j.id == c.gameId);
        const time1 = state.times.find(t => t.id == c.team1Id);
        const time2 = state.times.find(t => t.id == c.team2Id);
        const data = new Date(c.date).toLocaleString('pt-BR');

        return `
            <div class="card">
                <span class="card-tag">${jogo?.name || 'Jogo'} | ${data}</span>
                <div class="match-card">
                    <div class="team-score">
                        <strong>${time1?.name || '???'}</strong>
                        <div class="score">${c.score1}</div>
                    </div>
                    <div class="vs">VS</div>
                    <div class="team-score">
                        <strong>${time2?.name || '???'}</strong>
                        <div class="score">${c.score2}</div>
                    </div>
                </div>
                <div style="margin-top: 1rem; text-align: center;">
                    <span class="card-tag" style="background: ${c.status === 'finished' ? '#10b981' : '#f59e0b'}">
                        ${c.status === 'finished' ? 'FINALIZADO' : 'AGENDADO'}
                    </span>
                    ${c.status === 'scheduled'
                        ? `<button onclick="encerrarConfrontos(${c.id})" style="padding: 4px 8px; font-size: 0.7rem; margin-left: 8px;">Finalizar</button>`
                        : ''}
                </div>
                <div style="display:flex; justify-content:center;">
                    ${botoes('confronto', 'confrontos', c.id)}
                </div>
            </div>
        `;
    }).join('');
}

// --- Modal e formulários ---

const modal = document.getElementById('modal-container');
const formContent = document.getElementById('form-content');

const COLECOES = {
    jogo: 'jogos',
    time: 'times',
    competidor: 'competidores',
    confronto: 'confrontos',
};

// tipo = 'jogo' | 'time' | 'competidor' | 'confronto'; id opcional (se vier, é edição)
window.abrirFormulario = function (tipo, id = null) {
    const colecao = COLECOES[tipo];
    const item = id ? state[colecao].find(i => i.id == id) : null;
    const v = item || {};
    const idArg = id ? id : 'null';

    modal.style.display = 'flex';
    setTimeout(() => {
        modal.style.opacity = '1';
        modal.style.pointerEvents = 'all';
    }, 10);

    const opcoes = (lista, selecionado) =>
        lista.map(o => `<option value="${o.id}" ${o.id == selecionado ? 'selected' : ''}>${o.name}</option>`).join('');

    const titulo = (t) => (item ? 'Editar ' : 'Adicionar ') + t;
    const botao = item ? 'Atualizar' : 'Salvar';
    const dataPadrao = v.date ? String(v.date).slice(0, 16) : new Date().toISOString().slice(0, 16);

    const acoes = `
        <div style="display:flex; gap: 1rem;">
            <button type="submit" class="btn-primary">${botao}</button>
            <button type="button" onclick="fecharModal()">Cancelar</button>
        </div>`;

    const formularios = {
        jogo: `
            <h2>${titulo('Jogo')}</h2>
            <form onsubmit="salvarItem(event, 'jogos', ${idArg})">
                <div class="form-group">
                    <label>Nome do Jogo</label>
                    <input type="text" name="name" required value="${v.name || ''}">
                </div>
                <div class="form-group">
                    <label>Gênero</label>
                    <input type="text" name="genre" required value="${v.genre || ''}">
                </div>
                ${acoes}
            </form>`,
        time: `
            <h2>${titulo('Time')}</h2>
            <form onsubmit="salvarItem(event, 'times', ${idArg})">
                <div class="form-group">
                    <label>Nome da Equipe</label>
                    <input type="text" name="name" required value="${v.name || ''}">
                </div>
                <div class="form-group">
                    <label>Cor Identidade</label>
                    <input type="color" name="color" value="${v.color || '#6366f1'}">
                </div>
                ${acoes}
            </form>`,
        competidor: `
            <h2>${titulo('Competidor')}</h2>
            <form onsubmit="salvarItem(event, 'competidores', ${idArg})">
                <div class="form-group">
                    <label>Nome Completo</label>
                    <input type="text" name="name" required value="${v.name || ''}">
                </div>
                <div class="form-group">
                    <label>Nickname</label>
                    <input type="text" name="nickname" required value="${v.nickname || ''}">
                </div>
                <div class="form-group">
                    <label>Time</label>
                    <select name="teamId" required>${opcoes(state.times, v.teamId)}</select>
                </div>
                ${acoes}
            </form>`,
        confronto: `
            <h2>${titulo('Confronto')}</h2>
            <form onsubmit="salvarItem(event, 'confrontos', ${idArg})">
                <div class="form-group">
                    <label>Jogo</label>
                    <select name="gameId" required>${opcoes(state.jogos, v.gameId)}</select>
                </div>
                <div style="display:grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
                    <div class="form-group">
                        <label>Time A</label>
                        <select name="team1Id" required>${opcoes(state.times, v.team1Id)}</select>
                    </div>
                    <div class="form-group">
                        <label>Time B</label>
                        <select name="team2Id" required>${opcoes(state.times, v.team2Id)}</select>
                    </div>
                </div>
                <div style="display:grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
                    <div class="form-group">
                        <label>Placar A</label>
                        <input type="number" name="score1" value="${v.score1 ?? 0}">
                    </div>
                    <div class="form-group">
                        <label>Placar B</label>
                        <input type="number" name="score2" value="${v.score2 ?? 0}">
                    </div>
                </div>
                <div class="form-group">
                    <label>Status</label>
                    <select name="status">
                        <option value="scheduled" ${v.status !== 'finished' ? 'selected' : ''}>Agendado</option>
                        <option value="finished" ${v.status === 'finished' ? 'selected' : ''}>Finalizado</option>
                    </select>
                </div>
                <div class="form-group">
                    <label>Data/Hora</label>
                    <input type="datetime-local" name="date" required value="${dataPadrao}">
                </div>
                ${acoes}
            </form>`,
    };

    formContent.innerHTML = formularios[tipo] || '';
};

window.fecharModal = function () {
    modal.style.opacity = '0';
    modal.style.pointerEvents = 'none';
    setTimeout(() => { modal.style.display = 'none'; }, 300);
};

const CAMPOS_NUMERICOS = ['teamId', 'gameId', 'team1Id', 'team2Id', 'score1', 'score2'];

// POST (id nulo) ou PUT (id informado)
window.salvarItem = async function (event, colecao, id = null) {
    event.preventDefault();
    const dados = Object.fromEntries(new FormData(event.target).entries());
    CAMPOS_NUMERICOS.forEach(campo => {
        if (dados[campo] !== undefined) dados[campo] = Number(dados[campo]);
    });

    try {
        if (id) await atualizarItem(colecao, id, dados);
        else await criarItem(colecao, dados);
        await carregarDados();
        renderizarTudo();
        fecharModal();
    } catch (erro) {
        alert('Erro ao salvar: ' + erro.message);
    }
};

// DELETE
window.excluirItem = async function (colecao, id) {
    if (!confirm('Tem certeza que deseja excluir?')) return;
    try {
        await deletarItem(colecao, id);
        await carregarDados();
        renderizarTudo();
    } catch (erro) {
        alert('Erro ao excluir: ' + erro.message);
    }
};

// PUT rápido: finaliza o confronto com o placar
window.encerrarConfrontos = async function (id) {
    const confronto = state.confrontos.find(c => c.id == id);
    if (!confronto) return;

    const time1 = state.times.find(t => t.id == confronto.team1Id);
    const time2 = state.times.find(t => t.id == confronto.team2Id);

    const placar1 = prompt(`Placar para ${time1?.name}:`, '0');
    const placar2 = prompt(`Placar para ${time2?.name}:`, '0');

    if (placar1 !== null && placar2 !== null) {
        try {
            await atualizarItem('confrontos', id, {
                score1: Number(placar1),
                score2: Number(placar2),
                status: 'finished',
            });
            await carregarDados();
            renderizarTudo();
        } catch (erro) {
            alert('Erro ao finalizar: ' + erro.message);
        }
    }
};