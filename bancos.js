document.addEventListener("DOMContentLoaded", () => {
    const commercialRefsContainer = document.getElementById('commercialRefsContainer');
    const bankRefsContainer = document.getElementById('bankRefsContainer');

    // Limite máximo de referências
    const MAX_REFERENCES = 3;

    // Função para adicionar referência comercial
    window.adicionarReferenciaComercial = function () {
        const currentRefs = commercialRefsContainer.querySelectorAll('.commercial-ref-form').length;
        if (currentRefs >= MAX_REFERENCES) {
            alert(`Você pode adicionar no máximo ${MAX_REFERENCES} referências comerciais.`);
            return;
        }

        const refDiv = document.createElement('div');
        refDiv.className = 'card p-3 mb-3 commercial-ref-form';
        refDiv.innerHTML = `
            <h4 class="card-title">Referência Comercial</h4>
            <div class="mb-3">
                <label class="form-label">Fornecedor:</label>
                <input type="text" class="form-control" placeholder="Nome do Fornecedor">
            </div>
            <div class="mb-3">
                <label class="form-label">Telefone:</label>
                <input type="text" class="form-control" placeholder="Telefone">
            </div>
            <div class="mb-3">
                <label class="form-label">Ramo:</label>
                <input type="text" class="form-control" placeholder="Ramo de Atividade">
            </div>
            <div class="mb-3">
                <label class="form-label">Contato:</label>
                <input type="text" class="form-control" placeholder="Nome do Contato">
            </div>
            <button type="button" class="btn btn-danger remove-button mt-2">Remover Referência</button>
        `;
        commercialRefsContainer.appendChild(refDiv);
    };

    // Função para adicionar referência bancária
    window.adicionarReferenciaBancaria = function () {
        const currentRefs = bankRefsContainer.querySelectorAll('.bank-ref-form').length;
        if (currentRefs >= MAX_REFERENCES) {
            alert(`Você pode adicionar no máximo ${MAX_REFERENCES} referências bancárias.`);
            return;
        }

        const refDiv = document.createElement('div');
        refDiv.className = 'card p-3 mb-3 bank-ref-form';
        refDiv.innerHTML = `
            <h4 class="card-title">Referência Bancária</h4>
            <div class="mb-3">
                <label class="form-label">Banco:</label>
                <input type="text" class="form-control" placeholder="Nome do Banco">
            </div>
            <div class="mb-3">
                <label class="form-label">Agência:</label>
                <input type="text" class="form-control" placeholder="Agência">
            </div>
            <div class="mb-3">
                <label class="form-label">Conta:</label>
                <input type="text" class="form-control" placeholder="Conta">
            </div>
            <div class="mb-3">
                <label class="form-label">Data de Abertura:</label>
                <input type="date" class="form-control">
            </div>
            <div class="mb-3">
                <label class="form-label">Telefone:</label>
                <input type="text" class="form-control" placeholder="Telefone">
            </div>
            <div class="mb-3">
                <label class="form-label">Gerente:</label>
                <input type="text" class="form-control" placeholder="Nome do Gerente">
            </div>
            <div class="mb-3">
                <label class="form-label">Observações:</label>
                <textarea class="form-control" placeholder="Observações"></textarea>
            </div>
            <button type="button" class="btn btn-danger remove-button mt-2">Remover Referência</button>
        `;
        bankRefsContainer.appendChild(refDiv);
    };

    // Event delegation para remover referências comerciais
    commercialRefsContainer.addEventListener('click', (event) => {
        if (event.target.classList.contains('remove-button')) {
            const refDiv = event.target.closest('.commercial-ref-form');
            if (refDiv) refDiv.remove();
        }
    });

    // Event delegation para remover referências bancárias
    bankRefsContainer.addEventListener('click', (event) => {
        if (event.target.classList.contains('remove-button')) {
            const refDiv = event.target.closest('.bank-ref-form');
            if (refDiv) refDiv.remove();
        }
    });
});
