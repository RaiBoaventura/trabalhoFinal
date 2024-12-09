# Trabalho feito por:
** Raí Boaventura GRR20241361
** Melissa
** Pedro 

# Cadastro e Gerenciamento de Pessoas Jurídicas

Este projeto é uma aplicação completa para **cadastro**, **edição**, **listagem** e **remoção** de Pessoas Jurídicas. A aplicação é composta por uma interface web interativa, um back-end em Node.js, e persistência dos dados em um banco de dados PostgreSQL.

---

## Objetivo do Projeto

Facilitar o gerenciamento de empresas, oferecendo uma interface intuitiva para cadastrar e atualizar informações, além de suportar a validação de dados como CNPJ e e-mail.

---

## Principais Recursos

1. **Cadastro de Empresas**:
   - Permite adicionar informações como CNPJ, razão social, endereço, e dados financeiros.
   - Upload de documentos (contrato social, cartão CNPJ e relação de faturamento).

2. **CRUD Completo**:
   - Cadastrar novas empresas.
   - Editar empresas existentes.
   - Visualizar lista de empresas cadastradas.
   - Remover empresas com confirmação.

3. **Validação de Dados no Front-End**:
   - Validação de CNPJ e preenchimento automático via API externa.
   - Campos obrigatórios são verificados antes do envio.

4. **Persistência no Back-End**:
   - Os dados são armazenados em um banco de dados PostgreSQL.

---

## Tecnologias Utilizadas

### Front-End
- **HTML5 e CSS3** para estrutura e estilo.
- **Bootstrap 5.3** para design responsivo.
- **JavaScript Modular** para lógica da aplicação.

### Back-End
- **Node.js** com **Express.js** para construção do servidor.
- **PostgreSQL** para gerenciamento do banco de dados.

---


## Configuração e Execução

### Pré-requisitos
- **Node.js** (v16 ou superior)
- **PostgreSQL** instalado e configurado.


### Configurando o Back-End

1. Navegue até o diretório do projeto e instale as dependências:
   ```bash
   npm install
   ```
2. Abra o arquivo `server.js` e configure o acesso ao banco de dados:
   ```javascript
   const pool = new Pool({
       user: 'postgres',         // Seu usuário do PostgreSQL
       host: 'localhost',        // Endereço do servidor do banco
       database: 'CNPJteste',    // Nome do banco de dados
       password: 'admin',        // Sua senha do PostgreSQL
       port: 5432,               // Porta padrão do PostgreSQL
   });
   ```
3. Inicie o servidor:
   ```bash
   node server.js
   ```
4. O servidor estará disponível em `http://localhost:3000`.

---

### Configurando o Front-End

1. Certifique-se de que o servidor está em execução.
2. Abra o arquivo `crud.html` ou `index.html` no navegador.

---

## Funcionalidades em Detalhes

### Front-End

#### **index.html**: Página Inicial

- Formulário para cadastro de novas empresas.
- Validação de CNPJ e preenchimento automático via API externa.
- Upload de documentos diretamente no formulário.

#### **crud.html**: Gerenciamento de Empresas

- **Cadastrar**: Adiciona novas empresas.
- **Listar**: Exibe as empresas cadastradas em uma tabela.
- **Editar**: Permite modificar os dados de uma empresa existente.
- **Excluir**: Remove empresas com confirmação.

### Back-End

#### **Endpoints da API**

| Método | Endpoint                          | Descrição                                  |
|--------|-----------------------------------|-------------------------------------------|
| `POST` | `/pessoa-juridica`                | Cadastra uma nova Pessoa Jurídica.        |
| `GET`  | `/consultar/PessoaJuridica`       | Lista todas as Pessoas Jurídicas.         |
| `GET`  | `/pessoa-juridica/:id`            | Retorna os detalhes de uma Pessoa Jurídica. |
| `PUT`  | `/pessoa-juridica/:id`            | Atualiza uma Pessoa Jurídica pelo ID.     |
| `DELETE` | `/pessoa-juridica/:id`          | Remove uma Pessoa Jurídica pelo ID.       |

#### **Exemplo de Endpoint (Cadastro de Pessoa Jurídica)**

```javascript
app.post('/pessoa-juridica', async (req, res) => {
    const { cnpj, razao_social, nome_fantasia, email } = req.body;

    if (!cnpj || !razao_social || !email) {
        return res.status(400).json({ error: "CNPJ, razão social e e-mail são obrigatórios." });
    }

    const query = `
        INSERT INTO pessoajuridica (cnpj, razao_social, nome_fantasia, email)
        VALUES ($1, $2, $3, $4) RETURNING id;
    `;
    const result = await pool.query(query, [cnpj, razao_social, nome_fantasia, email]);
    res.status(201).json({ message: "Pessoa Jurídica criada com sucesso!", id: result.rows[0].id });
});
```

---

## Fluxo de Cadastro

1. **Preencher o formulário**:
   - Insira o CNPJ, razão social e outros dados obrigatórios.
   - Faça upload de documentos.

2. **Validar os dados**:
   - O CNPJ é validado automaticamente.
   - Erros de preenchimento são destacados em vermelho.

3. **Enviar os dados**:
   - Clique em "Salvar" para cadastrar ou editar os dados.
   - Uma mensagem de sucesso será exibida.

---

## Testando Localmente

### Testando o Front-End
Abra os arquivos HTML (`index.html` ou `crud.html`) no navegador e interaja com a interface.

### Testando a API
Use o **Postman** ou o comando `curl` para fazer chamadas às rotas. Exemplo:

```bash
curl -X POST http://localhost:3000/pessoa-juridica \
-H "Content-Type: application/json" \
-d '{
  "cnpj": "12345678000190",
  "razao_social": "Empresa Teste",
  "nome_fantasia": "Fantasia Teste",
  "email": "contato@empresa.com"
}'
```

---


