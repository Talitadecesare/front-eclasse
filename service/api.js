// BASE_URL aponta para a API (Express + Supabase).
const BASE_URL = 'http://localhost:3000/api';

//Função interna GET
async function _get(endpoint) {
    try {
        const response = await fetch(`${BASE_URL}${endpoint}`);
        if (!response.ok) {
            throw new Error(`Erro ao buscar os ${endpoint}: ${response.status}`);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error(`Erro ao buscar os ${endpoint}:`, error);
        return [];
    }
}

//Função interna POST
async function _post(endpoint, dados) {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dados),
    });
    if (!response.ok) {
        const erro = await response.json().catch(() => ({}));
        throw new Error(erro.erro || `Erro ao criar em ${endpoint}: ${response.status}`);
    }
    return await response.json();
}

//Função interna PUT
async function _put(endpoint, dados) {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dados),
    });
    if (!response.ok) {
        const erro = await response.json().catch(() => ({}));
        throw new Error(erro.erro || `Erro ao atualizar em ${endpoint}: ${response.status}`);
    }
    return await response.json();
}

//Função interna DELETE
async function _delete(endpoint) {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
        method: 'DELETE',
    });
    if (!response.ok) {
        const erro = await response.json().catch(() => ({}));
        throw new Error(erro.erro || `Erro ao excluir em ${endpoint}: ${response.status}`);
    }
}

// GET JOGOS
async function getJogos() {
    return _get('/jogos');
}

// GET TIMES
async function getTimes() {
    return _get('/times');
}

// GET COMPETIDORES
async function getCompetidores() {
    return _get('/competidores');
}

// GET CONFRONTOS
async function getConfrontos() {
    return _get('/confrontos');
}

// POST (colecao: 'jogos' | 'times' | 'competidores' | 'confrontos')
async function criarItem(colecao, dados) {
    return _post(`/${colecao}`, dados);
}

// PUT
async function atualizarItem(colecao, id, dados) {
    return _put(`/${colecao}/${id}`, dados);
}

// DELETE
async function deletarItem(colecao, id) {
    return _delete(`/${colecao}/${id}`);
}