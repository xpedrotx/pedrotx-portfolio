  // Atualiza o ano no rodapé
document.addEventListener("DOMContentLoaded", function () {

  document.getElementById("currentYear").textContent = new Date().getFullYear();

  // === FADES E ANIMAÇÕES DE SCROLL ===
  const elementos = document.querySelectorAll(".fade-img, .fade-text, .fade-in");

  function mostrarElemento() {
    const alturaJanela = window.innerHeight;

    elementos.forEach((elemento) => {
      const distanciaTopo = elemento.getBoundingClientRect().top;
      const distanciaBase = elemento.getBoundingClientRect().bottom;

      if (distanciaTopo < alturaJanela * 0.85 && distanciaBase > 50) {
        if (elemento.classList.contains("fade-img")) {
          elemento.classList.add("active");

          const textoRelacionado = elemento.closest(".flex").querySelector(".fade-text");
          if (textoRelacionado && !textoRelacionado.classList.contains("active")) {
            setTimeout(() => {
              textoRelacionado.classList.add("active");
            }, 300);
          }
        } else {
          elemento.classList.add("active"); 
        }
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

  // === MODO CLARO/ESCURO ===
  const toggleButton = document.getElementById("toggle-mode");
  const imgTopoSite = document.querySelector(".topo-do-site .img-topo-site img");
  const imgSobre = document.querySelector(".img-sobre img");
  const logoHeader = document.querySelector("header .logo img");
  const logoFooter = document.querySelector("footer .logo-footer img");
  const portfolioImages = document.querySelectorAll(".img-port");

  toggleButton.innerHTML = '<i class="bi bi-brightness-high" style="color: white !important;"></i>';

  toggleButton.addEventListener("click", function () {
    document.body.classList.toggle("light-mode");

    if (document.body.classList.contains("light-mode")) {
      toggleButton.innerHTML = '<i class="bi bi-moon-fill"></i>';
      if (imgTopoSite) imgTopoSite.src = "images/pedrotxdev_white.png";
      if (imgSobre) imgSobre.src = "images/foto_sobre_mim_white.png";
      if (logoHeader) logoHeader.src = "images/logo_pedrotxdev_white.png";
      if (logoFooter) logoFooter.src = "images/logo_pedrotxdev_white.png";
      if (portfolioImages.length >= 3) {
        portfolioImages[0].style.backgroundImage = "url('images/portfolio-1-white.png')";
        portfolioImages[1].style.backgroundImage = "url('images/portfolio-2-white.png')";
        portfolioImages[2].style.backgroundImage = "url('images/portfolio-3-white.png')";
      }
    } else {
      toggleButton.innerHTML = '<i class="bi bi-brightness-high" style="color: white !important;"></i>';
      if (imgTopoSite) imgTopoSite.src = "images/pedrotxdev.png";
      if (imgSobre) imgSobre.src = "images/foto_sobre_mim.png";
      if (logoHeader) logoHeader.src = "images/logo_pedrotxdev.png";
      if (logoFooter) logoFooter.src = "images/logo_pedrotxdev.png";
      if (portfolioImages.length >= 3) {
        portfolioImages[0].style.backgroundImage = "url('images/portfolio-1.png')";
        portfolioImages[1].style.backgroundImage = "url('images/portfolio-2.png')";
        portfolioImages[2].style.backgroundImage = "url('images/portfolio-3.png')";
      }
    }
  });

  // === ANIMAÇÃO DO HEADER AO ROLAR ===
  const header = document.querySelector("header");

  setTimeout(() => {
    header.style.opacity = "1";
    header.style.transform = "translateY(0)";
  }, 300);

  window.addEventListener("scroll", function () {
    if (window.scrollY > 50) {
      header.classList.add("scrolled");
    } else {
      header.classList.remove("scrolled");
    }
  });

  // === BOTÃO VOLTAR AO TOPO ===
  const scrollTopBtn = document.getElementById("scrollTopBtn");

  window.addEventListener("scroll", function () {
    scrollTopBtn.style.display = window.scrollY > 200 ? "block" : "none";
  });

  scrollTopBtn.addEventListener("click", function () {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
});
