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
            getJogos() || [],
            getTimes() || [],
            getCompetidores() || [],
            getConfrontos() || [],
        ]);

        state.jogos = jogos || [];
        state.times = times || [];
        state.competidores = competidores || [];
        state.confrontos = confrontos || [];
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

    const encerrados = state.confrontos.filter(c => c.status === 'Finalizada').length;
    const agendados = state.confrontos.filter(c => c.status === 'Agendada').length;

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

    const lista = state.confrontos.filter(c => c.status === 'Agendada').slice(0, 3);

    proximos.innerHTML = lista.map(c => {
        const jogo = state.jogos.find(j => j.id == c.game_id);
        const time1 = state.times.find(t => t.id == c.team_home_id);
        const time2 = state.times.find(t => t.id == c.team_away_id);
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

function renderizarJogos() {
    const lista = document.getElementById('list-jogos');
    lista.innerHTML = state.jogos.map(j => `
        <div class="card" style="position: relative;">
            <span class="card-tag">${j.genre}</span>
            <h3>${j.name}</h3>
            <p class="subtitle">ID: ${j.id}</p>
            <button onclick="deletarItemGeral(${j.id}, 'jogo')" class="btn-delete-card" style="position: absolute; right: 10px; bottom: 10px; padding: 4px 8px; font-size: 0.7rem; background: #ef4444; color: white; border: none; border-radius: 4px; cursor: pointer;">Excluir</button>
        </div>
    `).join('');
}

function renderizarTimes() {
    const lista = document.getElementById('list-times');
    lista.innerHTML = state.times.map(t => `
        <div class="card" style="border-right: 4px solid #6366f1; position: relative;">
            <span class="card-tag">TAG: ${t.tag}</span>
            <h3>${t.name}</h3>
            <p class="subtitle">${state.competidores.filter(c => c.team_id == t.id).length} Jogadores</p>
            <button onclick="deletarItemGeral(${t.id}, 'time')" class="btn-delete-card" style="position: absolute; right: 10px; bottom: 10px; padding: 4px 8px; font-size: 0.7rem; background: #ef4444; color: white; border: none; border-radius: 4px; cursor: pointer;">Excluir</button>
        </div>
    `).join('');
}

function renderizarCompetidores() {
    const lista = document.getElementById('list-competidores');
    lista.innerHTML = state.competidores.map(c => {
        const time = state.times.find(t => t.id == c.team_id);
        return `
            <div class="card" style="position: relative;">
                <span class="card-tag">${time?.name || 'Sem Time'}</span>
                <h3>${c.nickname}</h3>
                <p class="subtitle">${c.name}</p>
                <button onclick="deletarItemGeral(${c.id}, 'competidor')" class="btn-delete-card" style="position: absolute; right: 10px; bottom: 10px; padding: 4px 8px; font-size: 0.7rem; background: #ef4444; color: white; border: none; border-radius: 4px; cursor: pointer;">Excluir</button>
            </div>
        `;
    }).join('');
}

function renderizarConfrontos() {
    const lista = document.getElementById('list-confrontos');
    lista.innerHTML = state.confrontos.map(c => {
        const jogo = state.jogos.find(j => j.id == c.game_id);
        const time1 = state.times.find(t => t.id == c.team_home_id);
        const time2 = state.times.find(t => t.id == c.team_away_id);
        const data = c.match_date ? new Date(c.match_date).toLocaleString('pt-BR') : 'Sem data';

        return `
            <div class="card" style="position: relative;">
                <span class="card-tag">${jogo?.name || 'Jogo'} | ${data}</span>
                <div class="match-card">
                    <div class="team-score">
                        <strong>${time1?.name || '???'}</strong>
                        <div class="score">${c.score_home}</div>
                    </div>
                    <div class="vs">VS</div>
                    <div class="team-score">
                        <strong>${time2?.name || '???'}</strong>
                        <div class="score">${c.score_away}</div>
                    </div>
                </div>
                <div style="margin-top: 1rem; text-align: center;">
                    <span class="card-tag" style="background: ${c.status === 'Finalizada' ? '#10b981' : '#f59e0b'}">
                        ${c.status === 'Finalizada' ? 'FINALIZADO' : 'AGENDADO'}
                    </span>
                    ${c.status === 'Agendada'
                        ? `<button onclick="encerrarConfrontoInterface(${c.id})" style="padding: 4px 8px; font-size: 0.7rem; margin-left: 8px; cursor: pointer;">Finalizar</button>`
                        : ''}
                </div>
                <button onclick="deletarItemGeral(${c.id}, 'confronto')" class="btn-delete-card" style="position: absolute; right: 10px; top: 10px; padding: 4px 8px; font-size: 0.7rem; background: #ef4444; color: white; border: none; border-radius: 4px; cursor: pointer;">X</button>
            </div>
        `;
    }).join('');
}

// --- Modal e formulários ---

const modal = document.getElementById('modal-container');
const formContent = document.getElementById('form-content');

function fecharModal() {
    modal.style.opacity = '0';
    modal.style.pointerEvents = 'none';
    setTimeout(() => {
        modal.style.display = 'none';
    }, 300);
}

window.abrirFormulario = function (tipo) {
    modal.style.display = 'flex';
    setTimeout(() => {
        modal.style.opacity = '1';
        modal.style.pointerEvents = 'all';
    }, 10);

    const optionsTimes = state.times.map(t => `<option value="${t.id}">${t.name}</option>`).join('');
    const optionsJogos = state.jogos.map(j => `<option value="${j.id}">${j.name}</option>`).join('');

    const formularios = {
        jogo: `
            <h2>Adicionar Jogo</h2>
            <form onsubmit="salvarItemInterface(event, 'jogo')">
                <div class="form-group">
                    <label>Nome do Jogo</label>
                    <input type="text" name="name" required placeholder="Ex: CS2">
                </div>
                <div class="form-group">
                    <label>Gênero</label>
                    <input type="text" name="genre" required placeholder="Ex: FPS">
                </div>
                <div style="display:flex; gap: 1rem; margin-top: 1rem;">
                    <button type="submit" class="btn-primary">Salvar</button>
                    <button type="button" onclick="fecharModal()">Cancelar</button>
                </div>
            </form>
        `,
        time: `
            <h2>Adicionar Time</h2>
            <form onsubmit="salvarItemInterface(event, 'time')">
                <div class="form-group">
                    <label>Nome da Equipe</label>
                    <input type="text" name="name" required placeholder="Ex: Ninjas da Noite">
                </div>
                <div class="form-group">
                    <label>Tag (Sigla)</label>
                    <input type="text" name="tag" required maxlength="10" placeholder="Ex: NDN">
                </div>
                <div style="display:flex; gap: 1rem; margin-top: 1rem;">
                    <button type="submit" class="btn-primary">Salvar</button}
