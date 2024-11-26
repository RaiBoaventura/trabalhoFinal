document.addEventListener("DOMContentLoaded", () => {
    const socioContainer = document.getElementById("socio-container");
    const addSocioBtn = document.getElementById("add-socio-btn");
    const avancarBtn = document.getElementById("avancar-btn");
    const sociosData = JSON.parse(localStorage.getItem("sociosData")) || [];
    let socioIndex = 0;

    // Função para criar campos de sócio
    function criarCamposSocio(socio = {}, index) {
        const socioDiv = document.createElement("div");
        socioDiv.classList.add("card", "p-4", "mb-4");
        socioDiv.id = `socio-${index}`;
        socioDiv.innerHTML = `
            <h5>Sócio</h5>
            <div class="mb-3">
                <label for="nome-socio-${index}" class="form-label">Nome:</label>
                <input type="text" id="nome-socio-${index}" class="form-control required-socio" value="${socio.nome || ''}">
            </div>
            <div class="mb-3">
                <label for="cep-socio-${index}" class="form-label">CEP:</label>
                <input type="text" id="cep-socio-${index}" class="form-control required-socio" placeholder="Digite o CEP">
            </div>
            <div class="mb-3">
                <label for="endereco-socio-${index}" class="form-label">Endereço:</label>
                <input type="text" id="endereco-socio-${index}" class="form-control required-socio">
            </div>
            <div class="mb-3">
                <label for="numero-socio-${index}" class="form-label">Número:</label>
                <input type="text" id="numero-socio-${index}" class="form-control required-socio">
            </div>
            <div class="mb-3">
                <label for="bairro-socio-${index}" class="form-label">Bairro:</label>
                <input type="text" id="bairro-socio-${index}" class="form-control required-socio">
            </div>
            <div class="mb-3">
                <label for="cidade-socio-${index}" class="form-label">Cidade:</label>
                <input type="text" id="cidade-socio-${index}" class="form-control required-socio">
            </div>
            <div class="mb-3">
                <label for="uf-socio-${index}" class="form-label">UF:</label>
                <input type="text" id="uf-socio-${index}" class="form-control required-socio">
            </div>
            <div class="mb-3">
                <label for="telefone-socio-${index}" class="form-label">Telefone:</label>
                <input type="text" id="telefone-socio-${index}" class="form-control required-socio">
            </div>
            <div class="mb-3">
                <label for="email-socio-${index}" class="form-label">E-mail:</label>
                <input type="email" id="email-socio-${index}" class="form-control required-socio">
            </div>
            <button type="button" class="btn btn-danger" onclick="removerSocio(${index})">Remover Sócio</button>  
        `;
        socioContainer.appendChild(socioDiv);

        // Adicionar evento para preenchimento automático a partir do CEP
        const cepInput = document.getElementById(`cep-socio-${index}`);
        cepInput.addEventListener("blur", () => buscarEnderecoPorCEP(cepInput.value, index));

        // Atualizar validação ao preencher campos
        socioDiv.querySelectorAll(".required-socio").forEach((input) => {
            input.addEventListener("input", validarCamposSocios);
        });

        validarCamposSocios(); // Verificar inicialmente
    }

    // Função para buscar dados de endereço a partir do CEP usando a API da BrasilAPI
    async function buscarEnderecoPorCEP(cep, index) {
        cep = cep.replace(/\D/g, ''); // Remove caracteres não numéricos

        if (cep.length !== 8) {
            alert("CEP inválido. Verifique e tente novamente.");
            return;
        }

        try {
            const response = await fetch(`https://brasilapi.com.br/api/cep/v1/${cep}`);
            if (!response.ok) throw new Error("Erro ao buscar dados do CEP");

            const data = await response.json();

            // Preencher os campos de endereço
            document.getElementById(`endereco-socio-${index}`).value = data.street || '';
            document.getElementById(`bairro-socio-${index}`).value = data.neighborhood || '';
            document.getElementById(`cidade-socio-${index}`).value = data.city || '';
            document.getElementById(`uf-socio-${index}`).value = data.state || '';

            validarCamposSocios(); // Revalidar após preenchimento
        } catch (error) {
            console.error(error);
            alert("Erro ao consultar o CEP. Tente novamente.");
        }
    }

    // Função para validar se todos os campos obrigatórios estão preenchidos
    function validarCamposSocios() {
        const camposObrigatorios = document.querySelectorAll(".required-socio");
        const todosPreenchidos = Array.from(camposObrigatorios).every((input) => input.value.trim() !== "");

        avancarBtn.disabled = !todosPreenchidos;
    }

    // Função para remover sócio
    window.removerSocio = (index) => {
        const socioDiv = document.getElementById(`socio-${index}`);
        socioDiv.remove();
        validarCamposSocios(); // Revalidar após remoção
    };

    // Evento para adicionar novo sócio
    addSocioBtn.addEventListener("click", () => {
        criarCamposSocio({}, socioIndex);
        socioIndex++;
    });

    // Redirecionar para a página bancos.html ao clicar em "Avançar"
    avancarBtn.addEventListener("click", () => {
        localStorage.setItem("sociosData", JSON.stringify(sociosData));
        window.location.href = "/HTML/bancos.html";
    });

    // Preencher os campos dos sócios automaticamente ao carregar
    if (sociosData.length > 0) {
        sociosData.forEach((socio, index) => {
            criarCamposSocio(socio, index);
            socioIndex = index + 1;
        });
    }

    validarCamposSocios(); // Verificar inicialmente ao carregar a página
});
