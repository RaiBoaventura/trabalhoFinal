const express = require('express');
const { Pool } = require('pg');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(bodyParser.json());
app.use(cors());

// Configuração do PostgreSQL
const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'CNPJ',
    password: 'admin',
    port: 5432,
});

// Testar a conexão com o banco de dados
pool.connect((err) => {
    if (err) {
        console.error('Erro ao conectar ao PostgreSQL:', err);
    } else {
        console.log('Conectado ao PostgreSQL com sucesso!');
    }
});

// **Criar Pessoa Jurídica**
app.post('/pessoa-juridica', async (req, res) => {
    const { cnpj, razao_social, nome_fantasia, email } = req.body;

    if (!cnpj || !razao_social || !email) {
        return res.status(400).json({ error: "CNPJ, razão social e e-mail são obrigatórios." });
    }

    try {
        const query = `
            INSERT INTO pessoajuridica (cnpj, razao_social, nome_fantasia, email)
            VALUES ($1, $2, $3, $4) RETURNING id;
        `;
        const values = [cnpj, razao_social, nome_fantasia, email];
        const result = await pool.query(query, values);
        res.status(201).json({ message: "Pessoa Jurídica criada com sucesso!", id: result.rows[0].id });
    } catch (error) {
        console.error("Erro ao criar Pessoa Jurídica:", error);
        res.status(500).json({ error: "Erro ao criar Pessoa Jurídica." });
    }
});

// **Listar Pessoas Jurídicas**
app.get('/consultar/PessoaJuridica', async (req, res) => {
    try {
        const query = `SELECT * FROM pessoajuridica ORDER BY id`;
        const result = await pool.query(query);
        res.json(result.rows);
    } catch (error) {
        console.error("Erro ao listar Pessoas Jurídicas:", error);
        res.status(500).json({ error: "Erro ao listar Pessoas Jurídicas." });
    }
});

// **Buscar Pessoa Jurídica por ID**
app.get('/pessoa-juridica/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const query = `SELECT * FROM pessoajuridica WHERE id = $1`;
        const result = await pool.query(query, [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: "Pessoa Jurídica não encontrada." });
        }

        res.json(result.rows[0]);
    } catch (error) {
        console.error("Erro ao buscar Pessoa Jurídica:", error);
        res.status(500).json({ error: "Erro ao buscar Pessoa Jurídica." });
    }
});

// **Atualizar Pessoa Jurídica**
app.put('/pessoa-juridica/:id', async (req, res) => {
    const { id } = req.params;
    const { cnpj, razao_social, nome_fantasia, email } = req.body;

    if (!cnpj || !razao_social || !email) {
        return res.status(400).json({ error: "CNPJ, razão social e e-mail são obrigatórios." });
    }

    try {
        const query = `
            UPDATE pessoajuridica
            SET cnpj = $1, razao_social = $2, nome_fantasia = $3, email = $4
            WHERE id = $5;
        `;
        const values = [cnpj, razao_social, nome_fantasia, email, id];
        const result = await pool.query(query, values);

        if (result.rowCount === 0) {
            return res.status(404).json({ error: "Pessoa Jurídica não encontrada." });
        }

        res.json({ message: "Pessoa Jurídica atualizada com sucesso!" });
    } catch (error) {
        console.error("Erro ao atualizar Pessoa Jurídica:", error);
        res.status(500).json({ error: "Erro ao atualizar Pessoa Jurídica." });
    }
});

// **Excluir Pessoa Jurídica**
app.delete('/pessoa-juridica/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const query = `DELETE FROM pessoajuridica WHERE id = $1`;
        const result = await pool.query(query, [id]);

        if (result.rowCount === 0) {
            return res.status(404).json({ error: "Pessoa Jurídica não encontrada." });
        }

        res.json({ message: "Pessoa Jurídica excluída com sucesso!" });
    } catch (error) {
        console.error("Erro ao excluir Pessoa Jurídica:", error);
        res.status(500).json({ error: "Erro ao excluir Pessoa Jurídica." });
    }
});

// Servidor rodando na porta 3000
app.listen(3000, () => {
    console.log('Servidor rodando na porta 3000');
});
