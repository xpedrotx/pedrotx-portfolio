// Inicializa o EmailJS
(function () {
    emailjs.init("EkhuuhuLdExZxwEEL"); // Substitua pelo seu User ID do EmailJS
})();

// Manipulação do formulário
document.getElementById("contact-form").addEventListener("submit", function (event) {
    event.preventDefault(); // Evita o recarregamento da página

    // Captura os dados do formulário
    const formData = {
        nome: document.getElementById("nome").value,
        email: document.getElementById("email").value,
        celular: document.getElementById("celular").value,
        mensagem: document.getElementById("mensagem").value,
    };

    // Validação simples dos campos
    if (!formData.nome || !formData.email || !formData.mensagem) {
        alert("Por favor, preencha todos os campos obrigatórios!");
        return;
    }

    // Envia os dados para o EmailJS
    emailjs
        .send("service_jlz9nti", "template_1h78tk9", formData)
        .then(
            function (response) {
                alert("Mensagem enviada com sucesso!"); // Mensagem de sucesso
                document.getElementById("contact-form").reset(); // Limpa o formulário
            },
            function (error) {
                alert("Erro ao enviar mensagem. Tente novamente mais tarde."); // Mensagem de erro
                console.error("Erro:", error); // Detalhes do erro no console
            }
        );
});
