document.addEventListener("DOMContentLoaded", () => {
    const commercialRefsContainer = document.getElementById('commercialRefsContainer');
    const bankRefsContainer = document.getElementById('bankRefsContainer');
    const concluirCadastroBtn = document.getElementById('concluirCadastroBtn');
    const MAX_REFERENCES = 3; // Limite máximo de referências

    // === Função Genérica para Adicionar Referências ===
    function adicionarReferencia(container, className, template, maxRefs, alertMsg) {
        const currentRefs = container.querySelectorAll(`.${className}`).length;
        if (currentRefs >= maxRefs) {
            alert(alertMsg);
            return;
        }

        const refDiv = document.createElement('div');
        refDiv.className = `card p-3 mb-3 ${className}`;
        refDiv.innerHTML = template;
        container.appendChild(refDiv);
    }

    // Template de Referência Comercial
    const comercialTemplate = `
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

    // Template de Referência Bancária
    const bancarioTemplate = `
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

    // === Adicionar Referências ===
    window.adicionarReferenciaComercial = function () {
        adicionarReferencia(
            commercialRefsContainer,
            'commercial-ref-form',
            comercialTemplate,
            MAX_REFERENCES,
            `Você pode adicionar no máximo ${MAX_REFERENCES} referências comerciais.`
        );
    };

    window.adicionarReferenciaBancaria = function () {
        adicionarReferencia(
            bankRefsContainer,
            'bank-ref-form',
            bancarioTemplate,
            MAX_REFERENCES,
            `Você pode adicionar no máximo ${MAX_REFERENCES} referências bancárias.`
        );
    };

    // === Remover Referências com Delegação de Eventos ===
    commercialRefsContainer.addEventListener('click', (event) => {
        if (event.target.classList.contains('remove-button')) {
            const refDiv = event.target.closest('.commercial-ref-form');
            if (refDiv) refDiv.remove();
        }
    });

    bankRefsContainer.addEventListener('click', (event) => {
        if (event.target.classList.contains('remove-button')) {
            const refDiv = event.target.closest('.bank-ref-form');
            if (refDiv) refDiv.remove();
        }
    });

    // === Evento de Concluir Cadastro ===
    concluirCadastroBtn.addEventListener('click', async () => {
        const commercialRefs = Array.from(commercialRefsContainer.querySelectorAll('.commercial-ref-form')).map(ref => ({
            fornecedor: ref.querySelector('input[placeholder="Nome do Fornecedor"]').value.trim(),
            telefone: ref.querySelector('input[placeholder="Telefone"]').value.trim(),
            ramo: ref.querySelector('input[placeholder="Ramo de Atividade"]').value.trim(),
            contato: ref.querySelector('input[placeholder="Nome do Contato"]').value.trim(),
        }));
    
        const bankRefs = Array.from(bankRefsContainer.querySelectorAll('.bank-ref-form')).map(ref => ({
            banco: ref.querySelector('input[placeholder="Nome do Banco"]').value.trim(),
            agencia: ref.querySelector('input[placeholder="Agência"]').value.trim(),
            conta: ref.querySelector('input[placeholder="Conta"]').value.trim(),
            dataAbertura: ref.querySelector('input[type="date"]').value.trim(),
            telefone: ref.querySelector('input[placeholder="Telefone"]').value.trim(),
            gerente: ref.querySelector('input[placeholder="Nome do Gerente"]').value.trim(),
            observacoes: ref.querySelector('textarea[placeholder="Observações"]').value.trim(),
        }));
    
        try {
            const response = await fetch('http://localhost:3000/referencias', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ commercialRefs, bankRefs }),
            });
    
            if (!response.ok) throw new Error('Erro ao enviar os dados.');
    
            const result = await response.json();
            alert(result.message);
        } catch (error) {
            console.error('Erro ao concluir cadastro:', error);
            alert('Erro ao concluir cadastro. Tente novamente.');
        }
    });
    
});
