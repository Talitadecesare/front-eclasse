// BASE_URL aponta para a API unificada rodando localmente
const BASE_URL = 'http://localhost:3000/api/';

// Função genérica auxiliar para requisições GET
async function getData(endpoint) {
    try {
        const response = await fetch(`${BASE_URL}${endpoint}`);
        if (!response.ok) {
            throw new Error(`Erro na requisição: ${response.statusText}`);
        }
        return await response.json();
    } catch (error) {
        alert(`Tivemos problemas para buscar dados. ERRO: ${error.message}`);
    }
}

// Função genérica auxiliar para enviar dados (POST, PUT, DELETE)
async function sendData(endpoint, method, body = null) {
    try {
        const config = {
            method: method,
            headers: {
                'Content-Type': 'application/json'
            }
        };

        if (body) {
            config.body = JSON.stringify(body);
        }

        const response = await fetch(`${BASE_URL}${endpoint}`, config);

        if (!response.ok) {
            throw new Error(`Erro na operação ${method}: ${response.statusText}`);
        }

        // Se a resposta for 204 No Content (comum em DELETE), não tenta ler o JSON
        if (response.status === 204) {
            return true;
        }

        return await response.json();
    } catch (error) {
        alert(`Tivemos problemas para salvar/remover os dados. ERRO: ${error.message}`);
    }
}

async function getJogos() {
    return getData('jogos');
}

async function getTimes() {
    return getData('times');
}

async function getCompetidores() {
    return getData('competidores');
}

async function getConfrontos() {
    return getData('confrontos');
}

async function criarJogo(jogo) {
    // Exemplo de objeto recebido: { name: "Valorant", genre: "FPS" }
    return sendData('jogos', 'POST', jogo);
}

async function criarTime(time) {
    // Exemplo de objeto recebido: { name: "FURIA", tag: "FUR" }
    return sendData('times', 'POST', time);
}

async function criarCompetidor(competidor) {
    // Exemplo de objeto recebido: { nickname: "Fallen", name: "Gabriel Toledo", team_id: 1 }
    return sendData('competidores', 'POST', competidor);
}

async function criarConfronto(confronto) {
    return sendData('confrontos', 'POST', confronto);
}

async function atualizarJogo(id, jogo) {
    return sendData(`jogos/${id}`, 'PUT', jogo);
}

async function atualizarTime(id, time) {
    return sendData(`times/${id}`, 'PUT', time);
}

async function atualizarCompetidor(id, competidor) {
    return sendData(`competidores/${id}`, 'PUT', competidor);
}

async function atualizarConfronto(id, confronto) {
    return sendData(`confrontos/${id}`, 'PUT', confronto);
}

async function deletarJogo(id) {
    return sendData(`jogos/${id}`, 'DELETE');
}

async function deletarTime(id) {
    return sendData(`times/${id}`, 'DELETE');
}

async function deletarCompetidor(id) {
    return sendData(`competidores/${id}`, 'DELETE');
}

async function deletarConfronto(id) {
    return sendData(`confrontos/${id}`, 'DELETE');
}
