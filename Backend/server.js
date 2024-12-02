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

// **NOVO: Endpoint para consultar dados**
app.get('/consultar/:tabela', async (req, res) => {
    const { tabela } = req.params;

    const query = `SELECT * FROM ${tabela}`;

    try {
        const resultado = await pool.query(query);
        res.json(resultado.rows); // Retorna os dados como JSON
    } catch (error) {
        console.error('Erro ao consultar dados:', error);
        res.status(500).send('Erro ao consultar dados.');
    }
});
app.get('/tabelas', async (req, res) => {
    const query = `
        SELECT table_name
        FROM information_schema.tables
        WHERE table_schema = 'public';
    `;

    try {
        const resultado = await pool.query(query);
        res.json(resultado.rows); // Retorna a lista de tabelas no formato JSON
    } catch (error) {
        console.error('Erro ao listar tabelas:', error);
        res.status(500).send('Erro ao listar tabelas.');
    }
});
app.post('/pessoa-juridica', async (req, res) => {
    const {
        cnpj, razao_social, nome_fantasia, inscricao_estadual, ramo_atividade,
        data_fundacao, capital_social, telefones, conta_bancaria, email, site,
        contador, telefone_contador, logradouro, numero_complemento, bairro, cidade, uf
    } = req.body;

    try {
        const query = `
            INSERT INTO PessoaJuridica (
                cnpj, razao_social, nome_fantasia, inscricao_estadual, ramo_atividade,
                data_fundacao, capital_social, telefones, conta_bancaria, email, site,
                contador, telefone_contador, logradouro, numero_complemento, bairro, cidade, uf
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18)
            RETURNING id;
        `;
        const values = [
            cnpj, razao_social, nome_fantasia, inscricao_estadual, ramo_atividade,
            data_fundacao, capital_social, telefones, conta_bancaria, email, site,
            contador, telefone_contador, logradouro, numero_complemento, bairro, cidade, uf
        ];
        const result = await pool.query(query, values);
        res.json({ message: "Pessoa Jurídica cadastrada com sucesso!", id: result.rows[0].id });
    } catch (error) {
        console.error("Erro ao cadastrar Pessoa Jurídica:", error);
        res.status(500).send("Erro ao cadastrar Pessoa Jurídica.");
    }
});
app.post('/referencias-comerciais', async (req, res) => {
    const { pessoa_juridica_id, fornecedor, telefone, ramo, contato } = req.body;

    try {
        const query = `
            INSERT INTO ReferenciasComerciais (pessoa_juridica_id, fornecedor, telefone, ramo, contato)
            VALUES ($1, $2, $3, $4, $5);
        `;
        await pool.query(query, [pessoa_juridica_id, fornecedor, telefone, ramo, contato]);
        res.json({ message: "Referência Comercial cadastrada com sucesso!" });
    } catch (error) {
        console.error("Erro ao cadastrar Referência Comercial:", error);
        res.status(500).send("Erro ao cadastrar Referência Comercial.");
    }
});
app.post('/referencias-bancarias', async (req, res) => {
    const {
        pessoa_juridica_id, banco, agencia, conta_bancaria, data_abertura, telefone, gerente, observacoes
    } = req.body;

    try {
        const query = `
            INSERT INTO ReferenciasBancarias (pessoa_juridica_id, banco, agencia, conta_bancaria, data_abertura, telefone, gerente, observacoes)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8);
        `;
        await pool.query(query, [pessoa_juridica_id, banco, agencia, conta_bancaria, data_abertura, telefone, gerente, observacoes]);
        res.json({ message: "Referência Bancária cadastrada com sucesso!" });
    } catch (error) {
        console.error("Erro ao cadastrar Referência Bancária:", error);
        res.status(500).send("Erro ao cadastrar Referência Bancária.");
    }
});
app.post('/socios', async (req, res) => {
    const { pessoa_juridica_id, nome, cpf, telefone, email, cargo } = req.body;

    try {
        const query = `
            INSERT INTO Socios (pessoa_juridica_id, nome, cpf, telefone, email, cargo)
            VALUES ($1, $2, $3, $4, $5, $6);
        `;
        await pool.query(query, [pessoa_juridica_id, nome, cpf, telefone, email, cargo]);
        res.json({ message: "Sócio cadastrado com sucesso!" });
    } catch (error) {
        console.error("Erro ao cadastrar Sócio:", error);
        res.status(500).send("Erro ao cadastrar Sócio.");
    }
});

app.post('/salvar-tudo', async (req, res) => {
    const { pessoaJuridica, socios, commercialRefs, bankRefs } = req.body;

    const client = await pool.connect();

    try {
        // Inicia uma transação
        await client.query('BEGIN');

        // Inserir na tabela Pessoa Jurídica
        const pessoaJuridicaQuery = `
            INSERT INTO pessoajuridica (
                cnpj, razao_social, nome_fantasia, inscricao_estadual, ramo_atividade,
                data_fundacao, capital_social, telefones, conta_bancaria, email, site,
                contador, telefone_contador, logradouro, numero_complemento, bairro, cidade, uf
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18)
            RETURNING id;
        `;
        const pessoaJuridicaValues = [
            pessoaJuridica.cnpj, pessoaJuridica.razao_social, pessoaJuridica.nome_fantasia,
            pessoaJuridica.inscricao_estadual, pessoaJuridica.ramo_atividade, pessoaJuridica.data_fundacao,
            pessoaJuridica.capital_social, pessoaJuridica.telefones, pessoaJuridica.conta_bancaria,
            pessoaJuridica.email, pessoaJuridica.site, pessoaJuridica.contador,
            pessoaJuridica.telefone_contador, pessoaJuridica.logradouro, pessoaJuridica.numero_complemento,
            pessoaJuridica.bairro, pessoaJuridica.cidade, pessoaJuridica.uf,
        ];
        const pessoaJuridicaResult = await client.query(pessoaJuridicaQuery, pessoaJuridicaValues);
        const pessoaJuridicaId = pessoaJuridicaResult.rows[0].id;

        // Inserir Sócios
        for (const socio of socios) {
            const sociosQuery = `
                INSERT INTO socios (
                    nome, cep, endereco, numero, bairro, cidade, uf, telefone, email
                ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9);
            `;
            const sociosValues = [
                socio.nome, socio.cep, socio.endereco, socio.numero, socio.bairro,
                socio.cidade, socio.uf, socio.telefone, socio.email,
            ];
            await client.query(sociosQuery, sociosValues);
        }

        // Inserir Referências Comerciais
        for (const ref of commercialRefs) {
            const comercialQuery = `
                INSERT INTO referenciascomerciais (
                    pessoa_juridica_id, fornecedor, telefone, ramo_atividade, contato
                ) VALUES ($1, $2, $3, $4, $5);
            `;
            const comercialValues = [
                pessoaJuridicaId, ref.fornecedor, ref.telefone, ref.ramo, ref.contato,
            ];
            await client.query(comercialQuery, comercialValues);
        }

        // Inserir Referências Bancárias
        for (const ref of bankRefs) {
            const bancariaQuery = `
                INSERT INTO bancos (
                    banco, agencia, conta, data_abertura, telefone, gerente, observacoes
                ) VALUES ($1, $2, $3, $4, $5, $6, $7);
            `;
            const bancariaValues = [
                ref.banco, ref.agencia, ref.conta, ref.dataAbertura, ref.telefone, ref.gerente, ref.observacoes,
            ];
            await client.query(bancariaQuery, bancariaValues);
        }

        // Confirma a transação
        await client.query('COMMIT');

        res.json({ message: "Cadastro concluído com sucesso!" });
    } catch (error) {
        // Reverte a transação em caso de erro
        await client.query('ROLLBACK');
        console.error("Erro ao salvar os dados:", error);
        res.status(500).json({ message: "Erro ao salvar os dados." });
    } finally {
        client.release();
    }
});


// Servidor rodando na porta 3000
app.listen(3000, () => {
    console.log('Servidor rodando na porta 3000');
});
