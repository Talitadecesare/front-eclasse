// BASE_URL aponta para o JSON local enquanto a API não está integrada.
// Quando a API estiver pronta, basta trocar para: 'http://localhost:3000/api'
const BASE_URL = 'http://localhost:3000/';

async function _get(endpoint) {
    try {
    const response = await fetch(`${BASE_URL}${endpoint}`);
    if (!response.ok)  {
    throw new Error(`Erro ao buscar os ${endpoint}: ${response.status}`);
    }
    const data = await response.json();
    return data;
} catch (error) {
    console.error(`Erro ao buscar jogos ${endpoint}:`, error);
    return [];
}
    
}

// Retorna todos os times
async function getTimes() {
    const response = await fetch(`${BASE_URL}times`);
    const data = await response.json();
    return data;
}

// Retorna todos os competidores
async function getCompetidores() {
    const response = await fetch(`${BASE_URL}competidores`);
    const data = await response.json();
    return data;
}

// Retorna todos os confrontos
async function getConfrontos() {
    const response = await fetch(`${BASE_URL}confrontos`);
    const data = await response.json();
    return data;
}