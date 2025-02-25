document.addEventListener("DOMContentLoaded", function () {
  
  // === ATUALIZA O ANO NO RODAPÉ ===
  document.getElementById("currentYear").textContent = new Date().getFullYear();

  // === ANIMAÇÃO DE FADE-IN AO ROLAR ===
  const elementos = document.querySelectorAll(".fade-img, .fade-text, .fade-in");

  function mostrarElemento() {
    const alturaJanela = window.innerHeight;

    elementos.forEach((elemento) => {
      const distanciaTopo = elemento.getBoundingClientRect().top;
      const distanciaBase = elemento.getBoundingClientRect().bottom;

      if (distanciaTopo < alturaJanela * 0.85 && distanciaBase > 50) {
        elemento.classList.add("active");
      } else {
        elemento.classList.remove("active");
      }
    });
  }

  window.addEventListener("scroll", mostrarElemento);
  mostrarElemento();

  // === ENVIO DE FORMULÁRIO COM EMAILJS ===
  emailjs.init("EyFjlaZ9pgbY9vl3f");

  const form = document.getElementById("meuFormulario");
  const statusMensagem = document.getElementById("statusMensagem");
  const btnEnviar = document.getElementById("btnEnviar");
  const spinner = btnEnviar.querySelector(".spin");

  form.addEventListener("submit", function (event) {
    event.preventDefault();

    var captchaResponse = grecaptcha.getResponse();
    if (!captchaResponse) {
      statusMensagem.textContent = "Por favor, complete o CAPTCHA.";
      statusMensagem.style.color = "red";
      return;
    }

    spinner.style.display = "inline-block";
    btnEnviar.disabled = true;
    statusMensagem.textContent = "";

    const templateParams = {
      nome: document.getElementById("nome").value,
      email: document.getElementById("email").value,
      mensagem: document.getElementById("mensagem").value
    };

    emailjs.send("service_149im5g", "template_wmyjv0i", templateParams)
      .then(() => {
        statusMensagem.textContent = "✅ Mensagem enviada com sucesso!";
        statusMensagem.style.color = "green";
        form.reset();
        grecaptcha.reset();
      })
      .catch(() => {
        statusMensagem.textContent = "❌ Erro ao enviar. Tente novamente.";
        statusMensagem.style.color = "red";
      })
      .finally(() => {
        spinner.style.display = "none";
        btnEnviar.disabled = false;
      });
  });

  // === MODO CLARO/ESCURO COM RECARREGAMENTO E ÍCONE DA ABA ===
  const toggleButton = document.getElementById("toggle-mode");
  const favicon = document.querySelector("link[rel='icon']");
  const imgTopoSite = document.querySelector(".topo-do-site .img-topo-site img");
  const imgSobre = document.querySelector(".img-sobre img");
  const logoHeader = document.querySelector("header .logo img");
  const logoFooter = document.querySelector("footer .logo-footer img");
  const portfolioImages = document.querySelectorAll(".img-port");

  function atualizarImagensModo(tema) {
    const imagens = {
      claro: {
        favicon: "images/icone_aba_white.png",
        imgTopo: "images/pedrotxdev_white.png",
        imgSobre: "images/foto_sobre_mim_white.png",
        logoHeader: "images/logo_pedrotxdev_white.png",
        logoFooter: "images/logo_pedrotxdev_white.png",
        portfolio: [
          "images/portfolio-1-white.png",
          "images/portfolio-2-white.png",
          "images/portfolio-3-white.png"
        ]
      },
      escuro: {
        favicon: "images/icone_aba.png",
        imgTopo: "images/pedrotxdev.png",
        imgSobre: "images/foto_sobre_mim.png",
        logoHeader: "images/logo_pedrotxdev.png",
        logoFooter: "images/logo_pedrotxdev.png",
        portfolio: [
          "images/portfolio-1.png",
          "images/portfolio-2.png",
          "images/portfolio-3.png"
        ]
      }
    };

    const temaAtual = imagens[tema];

    if (favicon) favicon.href = temaAtual.favicon;
    if (imgTopoSite) imgTopoSite.src = temaAtual.imgTopo;
    if (imgSobre) imgSobre.src = temaAtual.imgSobre;
    if (logoHeader) logoHeader.src = temaAtual.logoHeader;
    if (logoFooter) logoFooter.src = temaAtual.logoFooter;

    portfolioImages.forEach((img, index) => {
      img.style.backgroundImage = `url('${temaAtual.portfolio[index]}')`;
    });
  }

  const temaSalvo = localStorage.getItem("modoTema") || "escuro";

  document.body.classList.toggle("light-mode", temaSalvo === "claro");
  toggleButton.innerHTML = temaSalvo === "claro"
    ? '<i class="bi bi-moon-fill"></i>'
    : '<i class="bi bi-brightness-high" style="color: white !important;"></i>';

  atualizarImagensModo(temaSalvo);

  toggleButton.addEventListener("click", function () {
    const novoTema = document.body.classList.contains("light-mode") ? "escuro" : "claro";
    localStorage.setItem("modoTema", novoTema);
    location.reload();
  });

  // === ANIMAÇÃO DO HEADER AO ROLAR ===
  const header = document.querySelector("header");

  setTimeout(() => {
    header.style.opacity = "1";
    header.style.transform = "translateY(0)";
  }, 300);

  window.addEventListener("scroll", function () {
    header.classList.toggle("scrolled", window.scrollY > 50);
  });

  // === BOTÃO VOLTAR AO TOPO ===
  const scrollTopBtn = document.getElementById("scrollTopBtn");

  scrollTopBtn.style.display = "none";

  window.addEventListener("scroll", function () {
    scrollTopBtn.style.display = window.scrollY > 200 ? "block" : "none";
  });

  scrollTopBtn.addEventListener("click", function () {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  // === BARRA DE CARREGAMENTO ===
  const progressBar = document.getElementById("progress-bar");

  function atualizarBarraProgresso() {
    const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollTop = window.scrollY;
    const progresso = (scrollTop / totalHeight) * 100;
    progressBar.style.width = progresso + "%";
  }

  window.addEventListener("scroll", atualizarBarraProgresso);

  let progresso = 0;
  let intervalo = setInterval(() => {
    progresso += 5;
    progressBar.style.width = progresso + "%";
    if (progresso >= 100) {
      clearInterval(intervalo);
      setTimeout(() => {
        document.getElementById("progress-bar-container").style.display = "none";
      }, 500);
    }
  }, 50);
});
