const express = require('express');
const { Pool } = require('pg');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(bodyParser.json());
app.use(cors());

// Configuração do PostgreSQL
const pool = new Pool({
    user: 'seu_usuario',
    host: 'localhost',
    database: 'nome_do_banco',
    password: 'sua_senha',
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

// Endpoint para salvar dados
app.post('/salvar', async (req, res) => {
    const { tabela, dados } = req.body;
    const campos = Object.keys(dados).join(", ");
    const valores = Object.values(dados);
    const placeholders = valores.map((_, index) => `$${index + 1}`).join(", ");

    const query = `INSERT INTO ${tabela} (${campos}) VALUES (${placeholders})`;

    try {
        await pool.query(query, valores);
        res.send('Dados salvos com sucesso!');
    } catch (error) {
        console.error('Erro ao salvar dados:', error);
        res.status(500).send('Erro ao salvar dados.');
    }
});

app.listen(3000, () => {
    console.log('Servidor rodando na porta 3000');
});
