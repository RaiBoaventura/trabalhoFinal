### index.js

### **1. `validarCNPJ(cnpj)`**
- **Objetivo**: Verifica se um CNPJ é válido usando os dois dígitos verificadores.
- **Como funciona**:
  1. Remove caracteres não numéricos.
  2. Verifica o tamanho (14 dígitos) e se todos os números são iguais (ex.: `11111111111111`, inválido).
  3. Calcula o primeiro e o segundo dígitos verificadores usando uma fórmula específica.
  4. Retorna `true` se o CNPJ for válido, caso contrário, `false`.

---

### **2. `buscarDadosCNPJ(cnpj)`**
- **Objetivo**: Consulta informações de um CNPJ na API `BrasilAPI` e preenche os campos do formulário com os dados recebidos.
- **Como funciona**:
  1. Faz uma requisição `fetch` para a URL da API.
  2. Se bem-sucedido, chama `preencherDadosEmpresa(data)` para atualizar os campos do formulário.
  3. Em caso de erro, exibe uma mensagem e estiliza o campo como inválido.

---

### **3. `formatarMoeda(inputElement)`**
- **Objetivo**: Formata o valor digitado pelo usuário como moeda BRL (ex.: `12345` → `R$ 123,45`).
- **Como funciona**:
  1. Remove caracteres não numéricos.
  2. Divide o valor por 100 para representar valores em centavos.
  3. Usa `Intl.NumberFormat` para formatar o valor como moeda brasileira.

---

### **4. `removerFormatacao(valor)`**
- **Objetivo**: Remove a formatação de um valor monetário e retorna o número bruto.
- **Como funciona**:
  1. Remove todos os caracteres que não são números, vírgulas ou pontos.
  2. Substitui a vírgula por ponto para representar valores decimais no padrão numérico.
  3. Retorna o número como `float`.

---

### **5. `preencherDadosEmpresa(data)`**
- **Objetivo**: Atualiza os campos do formulário com os dados retornados da API do CNPJ.
- **Como funciona**:
  1. Preenche os campos de texto, como razão social, nome fantasia e endereço, usando os valores do objeto `data`.
  2. Se `capital_social` existir, formata o valor como moeda e também o armazena no campo oculto `capitalSocialNumInput`.

---

### **6. `setupDropZone(dropZoneId, inputId, listId)`**
- **Objetivo**: Configura uma área de drag-and-drop para upload de arquivos.
- **Como funciona**:
  1. Encontra os elementos DOM da zona de upload (`dropZone`), input de arquivo (`input`) e lista de arquivos (`list`).
  2. Prevê ações como arrastar (drag), soltar (drop) e clique para abrir o seletor de arquivos.
  3. Define classes visuais (ex.: `drag-over`) para estilizar a zona de upload.
  4. Chama `handleFiles(files, list)` quando arquivos são adicionados.

---

### **7. `handleFiles(files, list)`**
- **Objetivo**: Gerencia os arquivos adicionados (exibindo-os na lista e permitindo a remoção).
- **Como funciona**:
  1. Cria itens de lista para cada arquivo.
  2. Adiciona um link para download, o tamanho do arquivo e um botão de remoção.
  3. O botão de remoção remove o arquivo da lista.

---

### **8. `validarFormulario()`**
- **Objetivo**: Valida se:
  - Todos os campos obrigatórios do formulário estão preenchidos.
  - Todos os arquivos obrigatórios foram enviados.
- **Como funciona**:
  1. Verifica se todos os campos marcados como `required` têm valores.
  2. Confirma que os arquivos necessários foram adicionados.
  3. Habilita ou desabilita o botão "Continuar" com base na validação.

---

### **9. `continuarBtn.addEventListener("click", async () => {...})`**
- **Objetivo**: Monta os dados do formulário, envia para a API e exibe mensagens de sucesso ou erro.
- **Como funciona**:
  1. Coleta os valores de todos os campos e os organiza em um objeto `empresaData`.
  2. Chama a função `enviarPessoaJuridica` para enviar os dados para o backend.
  3. Exibe um alerta com a mensagem de resposta ou uma mensagem de erro.

---

### **10. `fileInputs.forEach(fileInput => {...})`**
- **Objetivo**: Adiciona eventos para validar o formulário sempre que arquivos são adicionados ou removidos.
- **Como funciona**:
  1. Para cada entrada de arquivo configurada, registra um evento `change`.
  2. O evento chama `validarFormulario` para revalidar o estado do botão "Continuar".



### crud.js

Este código é uma aplicação simples para gerenciar entidades chamadas **Pessoa Jurídica** (empresas ou organizações) em um sistema web. Ele realiza operações de **CRUD** (Criar, Ler, Atualizar e Deletar) com integração a uma API. Vou detalhar cada função e seus objetivos:

---

### **Eventos na Inicialização**

1. **`carregarPessoasJuridicas` na inicialização**
   - A função `carregarPessoasJuridicas` é chamada assim que o DOM é carregado. Isso popula a tabela com todas as **Pessoas Jurídicas** já cadastradas.

2. **Adiciona o evento de envio no formulário**
   - Configura o formulário `#pessoaJuridicaForm` para enviar ou atualizar dados ao submeter.

---

### **Funções Globais**

#### **`carregarPessoasJuridicas`**
- **Objetivo**: Busca todas as **Pessoas Jurídicas** e exibe na tabela.
- **Funcionamento**:
  1. Faz um GET na API no endpoint `/consultar/PessoaJuridica`.
  2. Itera sobre a lista retornada e preenche a tabela HTML.
  3. Cada linha possui botões:
     - **Editar**: Chama a função `editarPessoa`.
     - **Excluir**: Chama a função `deletarPessoa`.
     - **Ver**: Mostra os detalhes da pessoa em um modal.

---

#### **`editarPessoa(id)`**
- **Objetivo**: Carrega os dados de uma **Pessoa Jurídica** específica no formulário para edição.
- **Funcionamento**:
  1. Faz um GET na API no endpoint `/pessoa-juridica/{id}`.
  2. Preenche os campos do formulário com os dados retornados.
  3. Altera o cabeçalho e o botão do formulário para indicar que está no modo de edição.

---

#### **`verPessoa(id)`**
- **Objetivo**: Exibe os detalhes de uma **Pessoa Jurídica** em um modal.
- **Funcionamento**:
  1. Faz um GET na API no endpoint `/pessoa-juridica/{id}`.
  2. Monta um conjunto de parágrafos (`<p>`) com os detalhes retornados.
  3. Exibe os dados no modal `#verEmpresaModal`.

---

#### **`deletarPessoa(id)`**
- **Objetivo**: Remove uma **Pessoa Jurídica** do sistema.
- **Funcionamento**:
  1. Pergunta ao usuário se ele confirma a exclusão.
  2. Se confirmado, faz um DELETE na API no endpoint `/pessoa-juridica/{id}`.
  3. Atualiza a tabela chamando `carregarPessoasJuridicas`.

---

#### **Evento de `submit` no formulário**
- **Objetivo**: Cria ou atualiza uma **Pessoa Jurídica**.
- **Funcionamento**:
  1. Coleta os dados do formulário (ID, CNPJ, razão social, nome fantasia e email).
  2. Decide entre:
     - **POST** (se não há ID): Cadastra uma nova Pessoa Jurídica.
     - **PUT** (se há ID): Atualiza uma Pessoa Jurídica existente.
  3. Após sucesso:
     - Atualiza a tabela chamando `carregarPessoasJuridicas`.
     - Reseta o formulário para o estado inicial.

---

### **Estrutura do Backend Esperada**

- **Endpoints**:
  1. **`GET /consultar/PessoaJuridica`**: Retorna todas as Pessoas Jurídicas.
  2. **`GET /pessoa-juridica/{id}`**: Retorna os detalhes de uma Pessoa Jurídica específica.
  3. **`POST /pessoa-juridica`**: Cria uma nova Pessoa Jurídica.
  4. **`PUT /pessoa-juridica/{id}`**: Atualiza os dados de uma Pessoa Jurídica existente.
  5. **`DELETE /pessoa-juridica/{id}`**: Remove uma Pessoa Jurídica.

---

### **Possíveis Melhorias**
1. **Validação no Frontend**:
   - Adicionar validação nos campos antes de enviar à API (ex.: formato do CNPJ, email obrigatório).
2. **Mensagens de Erro**:
   - Mostrar mensagens específicas caso a API retorne erros, como duplicidade de CNPJ.
3. **Paginação na Tabela**:
   - Implementar paginação para facilitar a visualização de grandes volumes de dados.
4. **Feedback Visual**:
   - Adicionar spinners ou indicações visuais durante operações assíncronas (carregamento ou exclusão).


### api.js

### **Funções**

#### **1. `enviarPessoaJuridica(data)`**
- **Objetivo**: Envia os dados de uma **Pessoa Jurídica** ao servidor para cadastro.
- **Parâmetro**:
  - `data`: Objeto contendo os dados da empresa, como CNPJ, razão social, nome fantasia, e-mail, etc.
- **Funcionamento**:
  1. Realiza uma chamada `POST` ao endpoint `/pessoa-juridica`.
  2. Configura o cabeçalho `Content-Type` para `application/json` para indicar que está enviando JSON.
  3. Envia os dados no corpo da requisição convertidos para JSON usando `JSON.stringify`.
  4. Aguarda a resposta e retorna o JSON da resposta.
  
##### **Exemplo de uso**:
```javascript
const dadosEmpresa = {
    cnpj: "12.345.678/0001-90",
    razao_social: "Empresa Exemplo Ltda",
    nome_fantasia: "Exemplo",
    email: "contato@exemplo.com",
};

enviarPessoaJuridica(dadosEmpresa)
    .then(resposta => console.log("Resposta do servidor:", resposta))
    .catch(erro => console.error("Erro:", erro));
```

---

#### **2. `enviarSocios(data)`**
- **Objetivo**: Envia os dados de **sócios** de uma empresa ao servidor para cadastro.
- **Parâmetro**:
  - `data`: Objeto contendo os dados dos sócios (ex.: nome, CPF, percentual de participação, etc.).
- **Funcionamento**:
  1. Realiza uma chamada `POST` ao endpoint `/socios`.
  2. Configura o cabeçalho `Content-Type` para `application/json` para indicar que está enviando JSON.
  3. Envia os dados no corpo da requisição convertidos para JSON usando `JSON.stringify`.
  4. Aguarda a resposta e retorna o JSON da resposta.
  
##### **Exemplo de uso**:
```javascript
const dadosSocios = [
    { nome: "João Silva", cpf: "123.456.789-00", participacao: 50 },
    { nome: "Maria Oliveira", cpf: "987.654.321-00", participacao: 50 },
];

enviarSocios(dadosSocios)
    .then(resposta => console.log("Resposta do servidor:", resposta))
    .catch(erro => console.error("Erro:", erro));
```

---

### **Detalhes Técnicos**
1. **URL Base**:
   - A constante `API_BASE_URL` define a URL base do servidor (`http://localhost:3000`), permitindo centralizar a configuração e alterar facilmente o endereço.

2. **Fetch API**:
   - A função `fetch` é usada para realizar chamadas HTTP. Ela retorna uma `Promise` que é resolvida quando a resposta do servidor está disponível.

3. **Cabeçalhos HTTP**:
   - O cabeçalho `Content-Type: application/json` é obrigatório para APIs que esperam dados em formato JSON.

---

### **Possíveis Melhorias**
1. **Validação de Dados**:
   - Antes de enviar a requisição, validar os dados para garantir que estão no formato correto (ex.: validação de CNPJ e CPF).

2. **Tratamento de Erros**:
   - Implementar um bloco `try-catch` ou verificar o status da resposta para lidar com erros do servidor ou da rede.
   ```javascript
   if (!response.ok) {
       throw new Error(`Erro ${response.status}: ${response.statusText}`);
   }
   ```

3. **Logs e Depuração**:
   - Adicionar mensagens no console para facilitar o rastreamento durante o desenvolvimento.

4. **Separar Endpoints**:
   - Caso a aplicação escale, seria interessante organizar os endpoints em um arquivo de configuração dedicado.

