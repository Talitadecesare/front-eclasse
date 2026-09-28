// BASE_URL aponta para o JSON local enquanto a API não está integrada.
// Quando a API estiver pronta, basta trocar para: 'http://localhost:3000/api'
const BASE_URL = 'http://localhost:3000/api/';

//Função interna
async function _get(endpoint) {
    try {
    const response = await fetch(`${BASE_URL}${endpoint}`);
    if (!response.ok)  {
    throw new Error(`Erro ao buscar os ${endpoint}: ${response.status}`);
    }
    const data = await response.json();
    return data;
} catch (error) {
    console.error(`Erro ao buscar os ${endpoint}:`, error);
    return rotas[endpoint] ?? [];
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