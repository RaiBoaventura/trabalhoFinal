document.addEventListener("DOMContentLoaded", () => {
    const socioContainer = document.getElementById("socio-container");
    const addSocioBtn = document.getElementById("add-socio-btn");
    const avancarBtn = document.getElementById("avancar-btn");

    // Recupera os sócios armazenados no localStorage
    let sociosData = JSON.parse(localStorage.getItem("sociosData")) || [];
    console.log("Sócios carregados do localStorage:", sociosData);

    let socioIndex = sociosData.length; // Define o índice inicial baseado na quantidade de sócios

    // === Função para criar campos de sócio ===
    function criarCamposSocio(socio = {}, index) {
        console.log("Criando campos para sócio:", socio, "Índice:", index);

        const socioDiv = document.createElement("div");
        socioDiv.classList.add("card", "p-4", "mb-4");
        socioDiv.id = `socio-${index}`;
        socioDiv.innerHTML = `
            <h5>Sócio ${index + 1}</h5>
            <div class="mb-3">
                <label for="nome-socio-${index}" class="form-label">Nome:</label>
                <input type="text" id="nome-socio-${index}" class="form-control required-socio" value="${socio.nome || ''}">
            </div>
            <div class="mb-3">
                <label for="cep-socio-${index}" class="form-label">CEP:</label>
                <input type="text" id="cep-socio-${index}" class="form-control required-socio" value="${socio.cep || ''}">
            </div>
            <div class="mb-3">
                <label for="endereco-socio-${index}" class="form-label">Endereço:</label>
                <input type="text" id="endereco-socio-${index}" class="form-control required-socio" value="${socio.endereco || ''}">
            </div>
            <div class="mb-3">
                <label for="numero-socio-${index}" class="form-label">Número:</label>
                <input type="text" id="numero-socio-${index}" class="form-control required-socio" value="${socio.numero || ''}">
            </div>
            <div class="mb-3">
                <label for="bairro-socio-${index}" class="form-label">Bairro:</label>
                <input type="text" id="bairro-socio-${index}" class="form-control required-socio" value="${socio.bairro || ''}">
            </div>
            <div class="mb-3">
                <label for="cidade-socio-${index}" class="form-label">Cidade:</label>
                <input type="text" id="cidade-socio-${index}" class="form-control required-socio" value="${socio.cidade || ''}">
            </div>
            <div class="mb-3">
                <label for="uf-socio-${index}" class="form-label">UF:</label>
                <input type="text" id="uf-socio-${index}" class="form-control required-socio" value="${socio.uf || ''}">
            </div>
            <div class="mb-3">
                <label for="telefone-socio-${index}" class="form-label">Telefone:</label>
                <input type="text" id="telefone-socio-${index}" class="form-control required-socio" value="${socio.telefone || ''}">
            </div>
            <div class="mb-3">
                <label for="email-socio-${index}" class="form-label">E-mail:</label>
                <input type="email" id="email-socio-${index}" class="form-control required-socio" value="${socio.email || ''}">
            </div>
            <button type="button" class="btn btn-danger" onclick="removerSocio(${index})">Remover Sócio</button>  
        `;
        socioContainer.appendChild(socioDiv);

        // Adiciona evento para validação ao alterar qualquer campo
        socioDiv.querySelectorAll(".required-socio").forEach((input) => {
            input.addEventListener("input", validarFormulario);
        });

        validarFormulario(); // Revalida ao criar campos
    }

    // === Função para remover sócio ===
    window.removerSocio = (index) => {
        console.log("Removendo sócio:", index);

        const socioDiv = document.getElementById(`socio-${index}`);
        sociosData = sociosData.filter((_, i) => i !== index); // Remove o sócio pelo índice
        socioDiv.remove();
        atualizarStorage(); // Atualiza o localStorage
        validarFormulario(); // Revalida após remoção
    };

    // === Função para atualizar o localStorage ===
    function atualizarStorage() {
        console.log("Atualizando localStorage:", sociosData);

        localStorage.setItem("sociosData", JSON.stringify(sociosData));
    }

    // === Função para validar se todos os campos obrigatórios estão preenchidos ===
    function validarFormulario() {
        const camposObrigatorios = document.querySelectorAll(".required-socio");
        const todosPreenchidos = Array.from(camposObrigatorios).every((input) => input.value.trim() !== "");

        avancarBtn.disabled = !todosPreenchidos;
    }

    // === Evento para adicionar novo sócio ===
    addSocioBtn.addEventListener("click", () => {
        console.log("Adicionando novo sócio");

        const novoSocio = {};
        sociosData.push(novoSocio);
        criarCamposSocio(novoSocio, socioIndex);
        socioIndex++;
        atualizarStorage(); // Atualiza o localStorage após adicionar sócio
    });

    // === Evento de avançar para a próxima página ===
    avancarBtn.addEventListener("click", () => {
        atualizarStorage(); // Certifica-se de salvar os dados antes de avançar
        window.location.href = "bancos.html"; // Redireciona para a página de bancos
    });

    // === Carregar sócios armazenados ao iniciar ===
    if (sociosData.length > 0) {
        console.log("Carregando sócios armazenados");

        sociosData.forEach((socio, index) => {
            criarCamposSocio(socio, index);
        });
    } else {
        console.log("Nenhum sócio armazenado no localStorage");
    }

    validarFormulario(); // Verifica o formulário ao carregar a página
});
