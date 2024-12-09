const apiBaseUrl = 'http://localhost:3000';

document.addEventListener('DOMContentLoaded', () => {
    carregarPessoasJuridicas();

    const form = document.getElementById('pessoaJuridicaForm');

    if (form) {
        form.addEventListener('submit', async (event) => {
            event.preventDefault();

            const id = document.getElementById('id').value;
            const cnpj = document.getElementById('cnpj').value;
            const razao_social = document.getElementById('razao_social').value;
            const nome_fantasia = document.getElementById('nome_fantasia').value;
            const email = document.getElementById('email').value;

            const payload = { cnpj, razao_social, nome_fantasia, email };

            try {
                if (id) {
                    // Atualizar
                    const response = await fetch(`${apiBaseUrl}/pessoa-juridica/${id}`, {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(payload),
                    });
                    const data = await response.json();
                    alert(data.message || 'Atualizado com sucesso!');
                } else {
                    // Cadastrar
                    const response = await fetch(`${apiBaseUrl}/pessoa-juridica`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(payload),
                    });
                    const data = await response.json();
                    alert(data.message || 'Cadastrado com sucesso!');
                }

                carregarPessoasJuridicas();
                form.reset();
                document.getElementById('formHeader').innerText = 'Cadastrar Pessoa Jurídica';
                document.getElementById('submitButton').innerText = 'Cadastrar';
            } catch (error) {
                console.error('Erro:', error);
                alert('Erro ao realizar a operação.');
            }
        });
    }
});

// Tornar as funções globais
window.carregarPessoasJuridicas = async function carregarPessoasJuridicas() {
    try {
        const response = await fetch(`${apiBaseUrl}/consultar/PessoaJuridica`);
        const data = await response.json();

        const tabela = document.getElementById('tabelaPessoasJuridicas');
        tabela.innerHTML = ''; // Limpa a tabela antes de inserir novos dados

        data.forEach(pessoa => {
            tabela.innerHTML += `
                <tr>
                    <td>${pessoa.id}</td>
                    <td>${pessoa.cnpj}</td>
                    <td>${pessoa.razao_social}</td>
                    <td>${pessoa.nome_fantasia}</td>
                    <td>${pessoa.email}</td>
                    <td>
                        <button class="btn btn-warning btn-sm" onclick="editarPessoa(${pessoa.id})">Editar</button>
                        <button class="btn btn-danger btn-sm" onclick="deletarPessoa(${pessoa.id})">Excluir</button>
                        <button class="btn btn-info btn-sm" onclick="verPessoa(${pessoa.id})">Ver</button>
                    </td>
                </tr>
            `;
        });
    } catch (error) {
        console.error('Erro ao carregar dados:', error);
    }
};

window.editarPessoa = async function editarPessoa(id) {
    try {
        const response = await fetch(`${apiBaseUrl}/pessoa-juridica/${id}`);
        const pessoa = await response.json();

        // Preencher os campos do formulário
        document.getElementById('id').value = pessoa.id;
        document.getElementById('cnpj').value = pessoa.cnpj;
        document.getElementById('razao_social').value = pessoa.razao_social;
        document.getElementById('nome_fantasia').value = pessoa.nome_fantasia;
        document.getElementById('email').value = pessoa.email;

        // Alterar o formulário para modo de edição
        document.getElementById('formHeader').innerText = 'Editar Pessoa Jurídica';
        document.getElementById('submitButton').innerText = 'Atualizar';
    } catch (error) {
        console.error('Erro ao carregar Pessoa Jurídica para edição:', error);
    }
};

window.verPessoa = async function verPessoa(id) {
    try {
        const response = await fetch(`${apiBaseUrl}/pessoa-juridica/${id}`);
        const pessoa = await response.json();

        const detalhes = `
            <p><strong>CNPJ:</strong> ${pessoa.cnpj}</p>
            <p><strong>Razão Social:</strong> ${pessoa.razao_social}</p>
            <p><strong>Nome Fantasia:</strong> ${pessoa.nome_fantasia}</p>
            <p><strong>Email:</strong> ${pessoa.email}</p>
        `;

        document.getElementById('detalhesEmpresa').innerHTML = detalhes;
        new bootstrap.Modal(document.getElementById('verEmpresaModal')).show();
    } catch (error) {
        console.error('Erro ao carregar os detalhes da empresa:', error);
    }
};

window.deletarPessoa = async function deletarPessoa(id) {
    if (!confirm('Tem certeza que deseja excluir esta Pessoa Jurídica?')) return;

    try {
        await fetch(`${apiBaseUrl}/pessoa-juridica/${id}`, { method: 'DELETE' });
        alert('Pessoa Jurídica excluída com sucesso!');
        carregarPessoasJuridicas();
    } catch (error) {
        console.error('Erro ao excluir Pessoa Jurídica:', error);
    }
};
