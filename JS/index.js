document.addEventListener("DOMContentLoaded", () => {
    const cnpjInput = document.getElementById("cnpj");
    const continuarBtn = document.getElementById("continuar-btn");
    const cnpjError = document.getElementById("cnpj-error");
    const fileInputs = [
        { id: "contratoSocial", name: "Contrato Social e última alteração" },
        { id: "cartaoCNPJ", name: "Cartão CNPJ atualizado" },
        { id: "relacaoFaturamento", name: "Relação de faturamento dos últimos 12 meses" },
    ];

    // === Validação do CNPJ ===
    function validarCNPJ(cnpj) {
        cnpj = cnpj.replace(/[^\d]+/g, '');
        if (cnpj.length !== 14 || /^(\d)\1+$/.test(cnpj)) return false;

        let tamanho = cnpj.length - 2;
        let numeros = cnpj.substring(0, tamanho);
        let digitos = cnpj.substring(tamanho);
        let soma = 0, pos = tamanho - 7;

        for (let i = tamanho; i >= 1; i--) {
            soma += numeros.charAt(tamanho - i) * pos--;
            if (pos < 2) pos = 9;
        }

        let resultado = soma % 11 < 2 ? 0 : 11 - (soma % 11);
        if (resultado != digitos.charAt(0)) return false;

        tamanho++;
        numeros = cnpj.substring(0, tamanho);
        soma = 0, pos = tamanho - 7;

        for (let i = tamanho; i >= 1; i--) {
            soma += numeros.charAt(tamanho - i) * pos--;
            if (pos < 2) pos = 9;
        }

        resultado = soma % 11 < 2 ? 0 : 11 - (soma % 11);
        return resultado == digitos.charAt(1);
    }

    // === Consultar CNPJ ===
    async function buscarDadosCNPJ(cnpj) {
        try {
            const response = await fetch(`https://brasilapi.com.br/api/cnpj/v1/${cnpj}`);
            if (!response.ok) throw new Error("Erro ao buscar dados do CNPJ");

            const data = await response.json();
            preencherDadosEmpresa(data);
            cnpjError.style.display = "none";
            cnpjInput.classList.remove("is-invalid");
            cnpjInput.classList.add("is-valid");
        } catch (error) {
            console.error(error);
            cnpjError.textContent = "Erro ao consultar o CNPJ. Tente novamente.";
            cnpjError.style.display = "block";
            cnpjInput.classList.add("is-invalid");
        }
    }

    function preencherDadosEmpresa(data) {
        document.getElementById("razaoSocial").value = data.razao_social || '';
        document.getElementById("nomeFantasia").value = data.nome_fantasia || '';
        document.getElementById("logradouro").value = data.logradouro || '';
        document.getElementById("ramoAtividade").value = data.cnae_fiscal_descricao || '';
        document.getElementById("dataFundacao").value = data.data_inicio_atividade || '';
        document.getElementById("capitalSocial").value = formatarParaMoeda(data.capital_social || '0');
        document.getElementById("numeroComplemento").value = data.numero || '';
        document.getElementById("bairro").value = data.bairro || '';
        document.getElementById("cidade").value = data.municipio || '';
        document.getElementById("uf").value = data.uf || '';
        document.getElementById("telefones").value = data.ddd_telefone_1 || '';
        document.getElementById("email").value = data.email || '';
        armazenarDadosSocios(data.qsa);
    }

    function armazenarDadosSocios(qsaData) {
        if (!Array.isArray(qsaData)) return;

        const sociosData = qsaData.map(socio => ({
            nome: socio.nome_socio,
            qualificacao: socio.qualificacao_socio,
            faixaEtaria: socio.faixa_etaria,
            dataEntrada: socio.data_entrada_sociedade,
            cpfCnpj: socio.cnpj_cpf_do_socio,
        }));
        localStorage.setItem("sociosData", JSON.stringify(sociosData));
    }

    function formatarParaMoeda(valor) {
        const numero = parseFloat(valor.toString().replace(/[^\d.-]/g, '').replace(',', '.')) || 0;
        return numero.toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL',
        });
    }

    // === Configurar Drag-and-Drop ===
    function setupDropZone(dropZoneId, inputId, listId) {
        const dropZone = document.getElementById(dropZoneId);
        const input = document.getElementById(inputId);
        const list = document.getElementById(listId);

        if (!dropZone || !input || !list) {
            console.error(`Elemento(s) não encontrado(s): ${dropZoneId}, ${inputId}, ${listId}`);
            return; // Não prosseguir se algum elemento não existir
        }

        ["dragenter", "dragover", "dragleave", "drop"].forEach(eventName => {
            dropZone.addEventListener(eventName, e => e.preventDefault());
        });

        ["dragenter", "dragover"].forEach(eventName => {
            dropZone.addEventListener(eventName, () => dropZone.classList.add("drag-over"));
        });

        ["dragleave", "drop"].forEach(eventName => {
            dropZone.addEventListener(eventName, () => dropZone.classList.remove("drag-over"));
        });

        dropZone.addEventListener("drop", e => {
            const files = e.dataTransfer.files;
            handleFiles(files, list);
        });

        dropZone.addEventListener("click", () => input.click());

        input.addEventListener("change", () => handleFiles(input.files, list));
    }

    function handleFiles(files, list) {
        Array.from(files).forEach(file => {
            const listItem = document.createElement("li");

            // Link para download
            const downloadLink = document.createElement("a");
            downloadLink.href = URL.createObjectURL(file);
            downloadLink.download = file.name;
            downloadLink.textContent = file.name;

            // Tamanho do arquivo
            const fileSize = document.createElement("span");
            fileSize.textContent = ` (${Math.round(file.size / 1024)} KB)`;

            // Botão de remover
            const removeButton = document.createElement("button");
            removeButton.textContent = "Remover";
            removeButton.className = "remove-btn";
            removeButton.addEventListener("click", () => listItem.remove());

            listItem.appendChild(downloadLink);
            listItem.appendChild(fileSize);
            listItem.appendChild(removeButton);
            list.appendChild(listItem);
        });
    }

    // Configuração das Zonas de Upload
    setupDropZone("contrato-drop-zone", "contratoSocial", "contrato-list");
    setupDropZone("cnpj-drop-zone", "cartaoCNPJ", "cnpj-list");
    setupDropZone("faturamento-drop-zone", "relacaoFaturamento", "faturamento-list");

    // === Validação de Formulário ===
    function validarFormulario() {
        const allFieldsFilled = Array.from(document.querySelectorAll("#pj-form input[required]"))
            .every(input => input.value.trim() !== "");
        const allFilesUploaded = fileInputs.every(fileInput => {
            const inputElement = document.getElementById(fileInput.id);
            return inputElement.files.length > 0;
        });

        continuarBtn.disabled = !(allFieldsFilled && allFilesUploaded);
    }

    // Eventos
    cnpjInput.addEventListener("blur", () => {
        const cnpj = cnpjInput.value;

        if (validarCNPJ(cnpj)) {
            buscarDadosCNPJ(cnpj);
        } else {
            cnpjError.textContent = "CNPJ inválido. Verifique o número e tente novamente.";
            cnpjError.style.display = "block";
            cnpjInput.classList.add("is-invalid");
        }

        validarFormulario();
    });

    continuarBtn.addEventListener("click", () => {
        const empresaData = {
            razaoSocial: document.getElementById("razaoSocial").value,
            nomeFantasia: document.getElementById("nomeFantasia").value,
            logradouro: document.getElementById("logradouro").value,
            numeroComplemento: document.getElementById("numeroComplemento").value,
            bairro: document.getElementById("bairro").value,
            cidade: document.getElementById("cidade").value,
            uf: document.getElementById("uf").value,
            telefones: document.getElementById("telefones").value,
            email: document.getElementById("email").value,
        };

        localStorage.setItem("empresaData", JSON.stringify(empresaData));
        window.location.href = "/HTML/socios.html";
    });

    fileInputs.forEach(fileInput => {
        const inputElement = document.getElementById(fileInput.id);
        inputElement.addEventListener("change", validarFormulario);
    });

    validarFormulario();
});
