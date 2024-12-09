Esse é o código de backend em **Node.js** usando o **Express** para criar uma API REST que gerencia o cadastro de **Pessoas Jurídicas**. O banco de dados utilizado é o **PostgreSQL**, conectado através do módulo `pg`.

### **Detalhamento das Funcionalidades**

---

#### **1. Configuração Inicial**
- **Dependências**:
  - `express`: Para criar e configurar o servidor.
  - `pg`: Para conectar e executar consultas no PostgreSQL.
  - `body-parser`: Para analisar o corpo das requisições em JSON.
  - `cors`: Para permitir requisições de diferentes origens (cross-origin).
  
```javascript
const express = require('express');
const { Pool } = require('pg');
const bodyParser = require('body-parser');
const cors = require('cors');
```

- **Conexão com o Banco de Dados**:
  - Configurado usando um pool de conexões para maior eficiência.
  ```javascript
  const pool = new Pool({
      user: 'postgres',
      host: 'localhost',
      database: 'CNPJteste',
      password: 'admin',
      port: 5432,
  });
  ```
  - Teste de conexão:
    ```javascript
    pool.connect((err) => {
        if (err) {
            console.error('Erro ao conectar ao PostgreSQL:', err);
        } else {
            console.log('Conectado ao PostgreSQL com sucesso!');
        }
    });
    ```

---

#### **2. Rotas da API**

##### **a. Criar Pessoa Jurídica**
- **Endpoint**: `POST /pessoa-juridica`
- **Descrição**: Insere uma nova Pessoa Jurídica no banco de dados.
- **Validação**: Verifica se os campos obrigatórios (`cnpj`, `razao_social`, `email`) estão presentes.
- **Consulta SQL**:
  ```sql
  INSERT INTO pessoajuridica (cnpj, razao_social, nome_fantasia, email)
  VALUES ($1, $2, $3, $4) RETURNING id;
  ```
- **Exemplo de Resposta**:
  ```json
  { "message": "Pessoa Jurídica criada com sucesso!", "id": 1 }
  ```

---

##### **b. Listar Pessoas Jurídicas**
- **Endpoint**: `GET /consultar/PessoaJuridica`
- **Descrição**: Retorna todas as Pessoas Jurídicas cadastradas.
- **Consulta SQL**:
  ```sql
  SELECT * FROM pessoajuridica ORDER BY id;
  ```
- **Exemplo de Resposta**:
  ```json
  [
      { "id": 1, "cnpj": "123456789", "razao_social": "Empresa A", "nome_fantasia": "Fantasia A", "email": "a@empresa.com" },
      { "id": 2, "cnpj": "987654321", "razao_social": "Empresa B", "nome_fantasia": "Fantasia B", "email": "b@empresa.com" }
  ]
  ```

---

##### **c. Buscar Pessoa Jurídica por ID**
- **Endpoint**: `GET /pessoa-juridica/:id`
- **Descrição**: Retorna os dados de uma Pessoa Jurídica pelo `id`.
- **Consulta SQL**:
  ```sql
  SELECT * FROM pessoajuridica WHERE id = $1;
  ```
- **Validação**: Verifica se o resultado está vazio para retornar 404.
- **Exemplo de Resposta**:
  ```json
  { "id": 1, "cnpj": "123456789", "razao_social": "Empresa A", "nome_fantasia": "Fantasia A", "email": "a@empresa.com" }
  ```

---

##### **d. Atualizar Pessoa Jurídica**
- **Endpoint**: `PUT /pessoa-juridica/:id`
- **Descrição**: Atualiza os dados de uma Pessoa Jurídica existente.
- **Validação**:
  - Verifica se os campos obrigatórios estão presentes.
  - Retorna 404 se o `id` não for encontrado.
- **Consulta SQL**:
  ```sql
  UPDATE pessoajuridica
  SET cnpj = $1, razao_social = $2, nome_fantasia = $3, email = $4
  WHERE id = $5;
  ```
- **Exemplo de Resposta**:
  ```json
  { "message": "Pessoa Jurídica atualizada com sucesso!" }
  ```

---

##### **e. Excluir Pessoa Jurídica**
- **Endpoint**: `DELETE /pessoa-juridica/:id`
- **Descrição**: Exclui uma Pessoa Jurídica pelo `id`.
- **Validação**:
  - Retorna 404 se o `id` não for encontrado.
- **Consulta SQL**:
  ```sql
  DELETE FROM pessoajuridica WHERE id = $1;
  ```
- **Exemplo de Resposta**:
  ```json
  { "message": "Pessoa Jurídica excluída com sucesso!" }
  ```

---

#### **3. Configuração do Servidor**
- O servidor é configurado para rodar na porta `3000`:
  ```javascript
  app.listen(3000, () => {
      console.log('Servidor rodando na porta 3000');
  });
  ```

---

### **Possíveis Melhorias**
1. **Tratamento de Erros Detalhado**:
   - Retornar mensagens mais específicas dependendo do tipo de erro (ex.: violação de chave única para CNPJ).
   
2. **Validação de Entrada**:
   - Usar bibliotecas como `Joi` ou `express-validator` para validar e sanitizar os dados de entrada.

3. **Segurança**:
   - Usar variáveis de ambiente (via `dotenv`) para proteger informações sensíveis como credenciais do banco de dados.

4. **Paginação e Filtros**:
   - Implementar paginação na rota de listagem (`/consultar/PessoaJuridica`) para melhorar a performance.

