window.addEventListener("DOMContentLoaded", () => {
  // Atualiza ano no rodapé
  const yearEl = document.getElementById("currentYear");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Fade-in inicial
  setTimeout(() => {
    document.querySelectorAll(".fade-header-effect").forEach(el => el.classList.add("visible"));
    const header = document.querySelector("header");
    if (header) {
      header.style.opacity = "1";
      header.style.transform = "translateY(0)";
    }
  }, 300);

  // Animação de scroll (fade-in)
  const elementos = document.querySelectorAll(".fade-img, .fade-text, .fade-in");
  const mostrarElemento = () => {
    const alturaJanela = window.innerHeight;
    elementos.forEach(el => {
      const rect = el.getBoundingClientRect();
      el.classList.toggle("active", rect.top < alturaJanela * 0.85 && rect.bottom > 50);
    });
  };
  mostrarElemento();
  window.addEventListener("scroll", () => requestAnimationFrame(mostrarElemento));

  // Barra de progresso
  const progressBar = document.getElementById("progress-bar");
  const atualizarBarraProgresso = () => {
    const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollTop = window.scrollY;
    if (progressBar) progressBar.style.width = `${(scrollTop / totalHeight) * 100}%`;
  };
  window.addEventListener("scroll", atualizarBarraProgresso);

  // Animação inicial da barra
  let progresso = 0;
  const intervalo = setInterval(() => {
    progresso += 5;
    if (progressBar) progressBar.style.width = `${progresso}%`;
    if (progresso >= 100) {
      clearInterval(intervalo);
      setTimeout(() => {
        const container = document.getElementById("progress-bar-container");
        if (container) container.style.display = "none";
      }, 500);
    }
  }, 50);

  // Botão "voltar ao topo"
  const scrollTopBtn = document.getElementById("scrollTopBtn");
  if (scrollTopBtn) {
    window.addEventListener("scroll", () => {
      scrollTopBtn.classList.toggle("show", window.scrollY > 200);
    });
    scrollTopBtn.addEventListener("click", e => {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  // === MENU HAMBÚRGUER ===
  const btnMenu = document.getElementById("hamburger-btn");
  const menu = document.getElementById("menu-mobile");
  const overlay = document.getElementById("overlay-menu");
  const btnFechar = document.querySelector(".btn-fechar");
  const linksMenu = document.querySelectorAll("#menu-mobile nav ul li a");

  if (btnMenu && menu) {
    btnMenu.addEventListener("click", () => {
      menu.classList.add("abrir-menu");
      if (overlay) overlay.style.display = "block";
    });

    if (overlay) {
      overlay.addEventListener("click", () => {
        menu.classList.remove("abrir-menu");
        overlay.style.display = "none";
      });
    }

    if (btnFechar) {
      btnFechar.addEventListener("click", () => {
        menu.classList.remove("abrir-menu");
        if (overlay) overlay.style.display = "none";
      });
    }

    linksMenu.forEach(link => {
      link.addEventListener("click", () => {
        menu.classList.remove("abrir-menu");
        if (overlay) overlay.style.display = "none";
      });
    });
  }

  // Tema claro/escuro com persistência + imagens dinâmicas
  const toggleButton = document.getElementById("toggle-mode");
  const favicon = document.querySelector("link[rel='icon']");
  const imgTopoSite = document.querySelector(".topo-do-site .img-topo-site img");
  const imgSobre = document.querySelector(".img-sobre img");
  const logoHeader = document.querySelector("header .logo img");
  const logoFooter = document.querySelector("footer .logo-footer img");
  const portfolioImages = document.querySelectorAll(".img-port");

  const imagensTema = {
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

  const aplicarTema = tema => {
    document.body.classList.toggle("light-mode", tema === "claro");
    localStorage.setItem("modoTema", tema);
    const config = imagensTema[tema];
    if (favicon) favicon.href = config.favicon;
    if (imgTopoSite) imgTopoSite.src = config.imgTopo;
    if (imgSobre) imgSobre.src = config.imgSobre;
    if (logoHeader) logoHeader.src = config.logoHeader;
    if (logoFooter) logoFooter.src = config.logoFooter;
    portfolioImages.forEach((img, i) => {
      img.style.backgroundImage = `url('${config.portfolio[i]}')`;
    });
    if (toggleButton) {
      toggleButton.innerHTML = tema === "claro"
        ? '<i class="bi bi-moon-fill"></i>'
        : '<i class="bi bi-brightness-high" style="color: white !important;"></i>';
    }
  };

  const temaSalvo = localStorage.getItem("modoTema") || "escuro";
  aplicarTema(temaSalvo);

  if (toggleButton) {
    toggleButton.addEventListener("click", () => {
      const novoTema = document.body.classList.contains("light-mode") ? "escuro" : "claro";
      aplicarTema(novoTema);
    });
  }

  // Envio do formulário com EmailJS (sem reCAPTCHA)
  emailjs.init("EyFjlaZ9pgbY9vl3f");
  const form = document.getElementById("meuFormulario");
  const statusMensagem = document.getElementById("statusMensagem");
  const btnEnviar = document.getElementById("btnEnviar");
  const spinner = btnEnviar?.querySelector(".spin") || null;

  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();

      spinner && (spinner.style.display = "inline-block");
      btnEnviar.disabled = true;
      statusMensagem.textContent = "";

      const data = {
        nome: form.nome.value,
        email: form.email.value,
        mensagem: form.mensagem.value
      };

      emailjs.send("service_149im5g", "template_wmyjv0i", data)
        .then(() => {
          statusMensagem.textContent = "✅ Mensagem enviada com sucesso!";
          statusMensagem.style.color = "green";
          form.reset();
        })
        .catch(() => {
          statusMensagem.textContent = "❌ Erro ao enviar. Tente novamente.";
          statusMensagem.style.color = "red";
        })
        .finally(() => {
          spinner && (spinner.style.display = "none");
          btnEnviar.disabled = false;
        });
    });
  }
});
