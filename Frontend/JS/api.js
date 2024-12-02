const API_BASE_URL = "http://localhost:3000";

/**
 * Envia os dados de Pessoa Jurídica ao servidor
 * @param {Object} data - Dados da empresa
 * @returns {Promise} - Resposta do servidor
 */
export async function enviarPessoaJuridica(data) {
    const response = await fetch(`${API_BASE_URL}/pessoa-juridica`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    });
    return response.json();
}

/**app.get("/pessoa-juridica", (req, res) => {
    const query = "SELECT * FROM pessoajuridica"; // Altere para o nome da tabela
    db.query(query, (err, results) => {
        if (err) {
            console.error("Erro ao consultar o banco:", err);
            res.status(500).send("Erro no servidor");
            return;
        }
        res.json(results); // Retorna os dados como JSON
    });
});
*/

/**
 * Envia os dados de sócios ao servidor
 * @param {Object} data - Dados dos sócios
 * @returns {Promise} - Resposta do servidor
 */
export async function enviarSocios(data) {
    const response = await fetch(`${API_BASE_URL}/socios`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    });
    return response.json();
}

/**
 * Envia as referências comerciais ao servidor
 * @param {Object} data - Dados das referências comerciais
 * @returns {Promise} - Resposta do servidor
 */
export async function enviarReferenciasComerciais(data) {
    const response = await fetch(`${API_BASE_URL}/referenciascomerciais`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    });
    return response.json();
}
/*app._router.stack.forEach((r) => {
    if (r.route && r.route.path) {
        console.log(r.route.path);
    }
});
*/
/**
 * Envia os dados bancários ao servidor
 * @param {Object} data - Dados bancários
 * @returns {Promise} - Resposta do servidor
 */
export async function enviarBancos(data) {
    const response = await fetch(`${API_BASE_URL}/bancos`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    });
    return response.json();
}
