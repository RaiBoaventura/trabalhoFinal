document.addEventListener("DOMContentLoaded", () => {
    const cnpjInput = document.getElementById("cnpj");
    const continuarBtn = document.getElementById("continuar-btn");
    const cnpjError = document.getElementById("cnpj-error");
    const capitalSocialInput = document.getElementById("capital_social");
    const capitalSocialNumInput = document.getElementById("capital_social_num");
    const fileInputs = [
        { id: "contrato_Social", name: "Contrato Social e última alteração" },
        { id: "cartao_CNPJ", name: "Cartão CNPJ atualizado" },
        { id: "relacao_Faturamento", name: "Relação de faturamento dos últimos 12 meses" },
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
   // === Formatar Capital Social ===
function formatarMoeda(inputElement) {
    let valor = inputElement.value.replace(/[^\d]/g, ""); // Remove caracteres não numéricos
    if (valor) {
        valor = (parseInt(valor, 10) / 100).toFixed(2); // Divide por 100 para representar valores monetários
        inputElement.value = new Intl.NumberFormat("pt-BR", {
            style: "currency",
            currency: "BRL"
        }).format(valor);
    }
}

function removerFormatacao(valor) {
    return parseFloat(valor.replace(/[^\d,-]/g, '').replace(',', '.')) || 0;
}

// Evento para formatar o capital social ao digitar
capitalSocialInput.addEventListener("input", () => {
    // Formata para exibição
    formatarMoeda(capitalSocialInput);

    // Remove a formatação para obter o valor numérico
    const numericValue = removerFormatacao(capitalSocialInput.value);

    // Atualiza o campo oculto com o valor numérico
    capitalSocialNumInput.value = numericValue;
});

// Preenchimento automático com formatação
function preencherDadosEmpresa(data) {
    document.getElementById("razao_social").value = data.razao_social || '';
    document.getElementById("nome_fantasia").value = data.nome_fantasia || '';
    document.getElementById("logradouro").value = data.logradouro || '';
    document.getElementById("ramo_atividade").value = data.cnae_fiscal_descricao || '';
    document.getElementById("data_fundacao").value = data.data_inicio_atividade || '';

    if (data.capital_social) {
        // Atualiza o campo formatado e o campo numérico
        capitalSocialInput.value = new Intl.NumberFormat("pt-BR", {
            style: "currency",
            currency: "BRL"
        }).format(data.capital_social);
        capitalSocialNumInput.value = data.capital_social;
    }

    document.getElementById("numero_complemento").value = data.numero || '';
    document.getElementById("bairro").value = data.bairro || '';
    document.getElementById("cidade").value = data.municipio || '';
    document.getElementById("uf").value = data.uf || '';
    document.getElementById("telefones").value = data.ddd_telefone_1 || '';
    document.getElementById("email").value = data.email || '';
}



    function formatarParaMoeda(valor, valorF) {
        var valorF=valor
        const numero = parseFloat(valorF.toString().replace(/[^\d.-]/g, '').replace(',', '.')) || 0;
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
            return;
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
            const downloadLink = document.createElement("a");
            downloadLink.href = URL.createObjectURL(file);
            downloadLink.download = file.name;
            downloadLink.textContent = file.name;

            const fileSize = document.createElement("span");
            fileSize.textContent = ` (${Math.round(file.size / 1024)} KB)`;

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
    setupDropZone("contrato-drop-zone", "contrato_Social", "contrato-list");
    setupDropZone("cnpj-drop-zone", "cartao_CNPJ", "cnpj-list");
    setupDropZone("faturamento-drop-zone", "relacao_Faturamento", "faturamento-list");

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

    continuarBtn.addEventListener("click", async () => {
        const empresaData = {
            cnpj: document.getElementById("cnpj").value,
            razao_social: document.getElementById("razao_social").value,
            nome_fantasia: document.getElementById("nome_fantasia").value,
            conta_bancaria: document.getElementById("conta_bancaria").value,
            inscricao_estadual: document.getElementById("inscricao_estadual").value,
            ramo_atividade: document.getElementById("ramo_atividade").value,
            data_fundacao: document.getElementById("data_fundacao").value,
            capital_social: capitalSocialNumInput.value, // Usa valor numérico para o banco
            telefones: document.getElementById("telefones").value,
            email: document.getElementById("email").value,
            site: document.getElementById("site").value,
            contador: document.getElementById("contador").value,
            telefone_contador: document.getElementById("telefone_contador").value,
            logradouro: document.getElementById("logradouro").value,
            numero_complemento: document.getElementById("numero_complemento").value,
            bairro: document.getElementById("bairro").value,
            cidade: document.getElementById("cidade").value,
            uf: document.getElementById("uf").value,
        };

        try {
            const response = await enviarPessoaJuridica(empresaData);
            alert(response.message || "Dados salvos com sucesso!");
            localStorage.setItem("empresaId", response.id);
            window.location.href = "socios.html";
        } catch (error) {
            console.error("Erro ao salvar os dados:", error);
            alert("Erro ao salvar os dados.");
        }
    });

    fileInputs.forEach(fileInput => {
        const inputElement = document.getElementById(fileInput.id);
        inputElement.addEventListener("change", validarFormulario);
    });

    validarFormulario();
});