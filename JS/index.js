document.addEventListener("DOMContentLoaded", () => {
    const cnpjInput = document.getElementById("cnpj");
    const continuarBtn = document.getElementById("continuar-btn");
    const cnpjError = document.getElementById("cnpj-error");
    const fileInputs = [
        { id: "contratoSocial", name: "Contrato Social e última alteração" },
        { id: "cartaoCNPJ", name: "Cartão CNPJ atualizado" },
        { id: "relacaoFaturamento", name: "Relação de faturamento dos últimos 12 meses" },
    ];

    // Função para validar CNPJ
    function validarCNPJ(cnpj) {
        cnpj = cnpj.replace(/[^\d]+/g, '');

        if (cnpj.length !== 14) return false;

        // Elimina CNPJs inválidos conhecidos
        if (/^(\d)\1+$/.test(cnpj)) return false;

        let tamanho = cnpj.length - 2;
        let numeros = cnpj.substring(0, tamanho);
        let digitos = cnpj.substring(tamanho);
        let soma = 0;
        let pos = tamanho - 7;

        for (let i = tamanho; i >= 1; i--) {
            soma += numeros.charAt(tamanho - i) * pos--;
            if (pos < 2) pos = 9;
        }

        let resultado = (soma % 11 < 2) ? 0 : 11 - (soma % 11);
        if (resultado != digitos.charAt(0)) return false;

        tamanho += 1;
        numeros = cnpj.substring(0, tamanho);
        soma = 0;
        pos = tamanho - 7;

        for (let i = tamanho; i >= 1; i--) {
            soma += numeros.charAt(tamanho - i) * pos--;
            if (pos < 2) pos = 9;
        }

        resultado = (soma % 11 < 2) ? 0 : 11 - (soma % 11);
        return resultado == digitos.charAt(1);
    }

    // Função para buscar dados do CNPJ
    async function buscarDadosCNPJ(cnpj) {
        try {
            const response = await fetch(`https://brasilapi.com.br/api/cnpj/v1/${cnpj}`);
            if (!response.ok) throw new Error("Erro ao buscar dados do CNPJ");

            const data = await response.json();

            // Preencher campos da empresa
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

            // Armazenar dados dos sócios
            armazenarDadosSocios(data.qsa);

            cnpjError.style.display = "none";
        } catch (error) {
            console.error(error);
            cnpjError.textContent = "Erro ao consultar o CNPJ. Tente novamente.";
            cnpjError.style.display = "block";
        }
    }

    // Função para armazenar os dados dos sócios
    function armazenarDadosSocios(qsaData) {
        if (!Array.isArray(qsaData)) return;

        const sociosData = qsaData.map((socio) => ({
            nome: socio.nome_socio,
            qualificacao: socio.qualificacao_socio,
            faixaEtaria: socio.faixa_etaria,
            dataEntrada: socio.data_entrada_sociedade,
            cpfCnpj: socio.cnpj_cpf_do_socio,
        }));

        localStorage.setItem("sociosData", JSON.stringify(sociosData));
    }

    // Função para formatar valor para moeda brasileira (R$)
    function formatarParaMoeda(valor) {
        const numero = parseFloat(valor.toString().replace(/[^\d.-]/g, '').replace(',', '.')) || 0;
        return numero.toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL',
        });
    }

    // Validação dos campos obrigatórios e arquivos anexados
    function validarFormulario() {
        const allFieldsFilled = Array.from(document.querySelectorAll("#pj-form input[required]"))
            .every((input) => input.value.trim() !== "");

        const allFilesUploaded = fileInputs.every((fileInput) => {
            const inputElement = document.getElementById(fileInput.id);
            return inputElement.files.length > 0;
        });

        continuarBtn.disabled = !(allFieldsFilled && allFilesUploaded);
    }

    // Eventos para validar o formulário dinamicamente
    document.querySelectorAll("#pj-form input[required]").forEach((field) => {
        field.addEventListener("input", validarFormulario);
    });

    fileInputs.forEach((fileInput) => {
        const inputElement = document.getElementById(fileInput.id);
        inputElement.addEventListener("change", validarFormulario);
    });

    // Validação e consulta do CNPJ ao perder o foco
    cnpjInput.addEventListener("blur", () => {
        const cnpj = cnpjInput.value;

        if (validarCNPJ(cnpj)) {
            buscarDadosCNPJ(cnpj);
        } else {
            cnpjError.textContent = "CNPJ inválido. Verifique o número e tente novamente.";
            cnpjError.style.display = "block";
        }

        validarFormulario(); // Revalidar após o preenchimento do CNPJ
    });

    // Botão para salvar e continuar
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

    // Validação inicial ao carregar a página
    validarFormulario();
});
