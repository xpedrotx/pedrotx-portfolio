document.addEventListener("DOMContentLoaded", () => {
  // === 1. ATUALIZAÇÃO DE ANO (RODAPÉ) ===
  const yearEl = document.getElementById("currentYear");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // === 2. GESTÃO DE TEMA (DARK/LIGHT MODE) ===
  const toggleButton = document.getElementById("toggle-mode");
  // Seleciona todas as imagens normais e backgrounds que devem mudar
  const themeImages = document.querySelectorAll(".theme-img");
  const themeBackgrounds = document.querySelectorAll(".theme-bg");

  const aplicarTema = (tema) => {
    const isLight = tema === "claro";
    
    // 1. Alterna classe no Body (CSS Variáveis fazem o resto das cores)
    document.body.classList.toggle("light-mode", isLight);
    localStorage.setItem("modoTema", tema);

    // 2. Troca atributos SRC de imagens normais (Logo, Hero, Sobre)
    themeImages.forEach(img => {
      const newSrc = isLight ? img.dataset.imgLight : img.dataset.imgDark;
      if (newSrc) img.src = newSrc;
    });

    // 3. Troca Background-Image dos cards de portfólio
    themeBackgrounds.forEach(bg => {
      const newBg = isLight ? bg.dataset.imgLight : bg.dataset.imgDark;
      if (newBg) bg.style.backgroundImage = `url('${newBg}')`;
    });

    // 4. Troca Ícone do Botão
    if (toggleButton) {
      // Se for claro mostra lua (para voltar ao escuro), se for escuro mostra sol
      toggleButton.innerHTML = isLight 
        ? '<i class="bi bi-moon-stars-fill"></i>' 
        : '<i class="bi bi-sun-fill"></i>';
    }
  };

  // Carrega tema salvo ou usa o padrão 'escuro'
  const temaSalvo = localStorage.getItem("modoTema") || "escuro";
  aplicarTema(temaSalvo);

  // Evento de clique no botão
  if (toggleButton) {
    toggleButton.addEventListener("click", () => {
      const temaAtual = document.body.classList.contains("light-mode") ? "claro" : "escuro";
      const novoTema = temaAtual === "claro" ? "escuro" : "claro";
      aplicarTema(novoTema);
    });
  }

  // === 3. ANIMAÇÕES DE SCROLL (INTERSECTION OBSERVER) ===
  const observerOptions = {
    threshold: 0.15,
    rootMargin: "0px 0px -50px 0px"
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("active");
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  // Observa todos os elementos com classes de fade
  document.querySelectorAll(".fade-in, .fade-text, .fade-img").forEach(el => {
    observer.observe(el);
  });

  // Animação de entrada do Header (Hero)
  setTimeout(() => {
    document.querySelectorAll(".fade-header-effect").forEach(el => el.classList.add("visible"));
    const header = document.querySelector("header");
    if (header) {
      header.style.opacity = "1";
      header.style.transform = "translateY(0)";
    }
  }, 300);

  // Efeito Header Scrolled (Fundo fica sólido ao rolar)
  const header = document.querySelector("header");
  if(header){
      window.addEventListener("scroll", () => {
          header.classList.toggle("scrolled", window.scrollY > 50);
      });
  }

  // === 4. NAVEGAÇÃO SUAVE E MENU MOBILE ===
  const smoothScrollTo = (targetId) => {
    const targetElement = document.querySelector(targetId);
    if (targetElement) {
      const offsetTop = targetElement.offsetTop - 90;
      window.scrollTo({
        top: offsetTop,
        behavior: "smooth"
      });
    }
  };

  // Captura cliques em links internos
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = anchor.getAttribute('href');
      smoothScrollTo(targetId);
      
      // Fecha menu mobile se estiver aberto
      if (menu) {
        menu.classList.remove("abrir-menu");
        if (overlay) overlay.style.display = "none";
      }
    });
  });

  // Lógica do Menu Hambúrguer
  const btnMenu = document.getElementById("hamburger-btn");
  const menu = document.getElementById("menu-mobile");
  const overlay = document.getElementById("overlay-menu");
  const btnFechar = document.querySelector(".btn-fechar");

  if (btnMenu && menu) {
    btnMenu.addEventListener("click", () => {
      menu.classList.add("abrir-menu");
      if (overlay) {
          overlay.style.display = "block";
          setTimeout(() => overlay.style.opacity = "1", 10);
      }
    });

    const fecharMenu = () => {
      menu.classList.remove("abrir-menu");
      if (overlay) {
          overlay.style.opacity = "0";
          setTimeout(() => overlay.style.display = "none", 300);
      }
    };

    if (overlay) overlay.addEventListener("click", fecharMenu);
    if (btnFechar) btnFechar.addEventListener("click", fecharMenu);
  }

  // === 5. BARRA DE PROGRESSO E BOTÃO TOP ===
  const progressBar = document.getElementById("progress-bar");
  const progressBarContainer = document.getElementById("progress-bar-container");
  const scrollTopBtn = document.getElementById("scrollTopBtn");

  // Animação inicial de carregamento (fake loader)
  let progresso = 0;
  const intervalo = setInterval(() => {
    progresso += 5;
    if (progressBar) progressBar.style.width = `${progresso}%`;
    if (progresso >= 100) {
      clearInterval(intervalo);
      setTimeout(() => {
        if (progressBarContainer) progressBarContainer.style.display = "none";
      }, 500);
    }
  }, 50);

  // Evento de Scroll Único para UI
  window.addEventListener("scroll", () => {
    const scrollTop = window.scrollY;
    
    // Atualiza barra de progresso (se não estiver oculta)
    if (progressBarContainer && progressBarContainer.style.display !== 'none') {
        const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
        progressBar.style.width = `${(scrollTop / totalHeight) * 100}%`;
    }

    // Mostra/Esconde botão voltar ao topo
    if (scrollTopBtn) {
      scrollTopBtn.classList.toggle("show", scrollTop > 300);
    }
  });

  if (scrollTopBtn) {
    scrollTopBtn.addEventListener("click", (e) => {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

// === 6. FORMULÁRIO COM API PRÓPRIA ===
  const form = document.getElementById("meuFormulario");
  if (form) {
    const statusMensagem = document.getElementById("statusMensagem");
    const btnEnviar = document.getElementById("btnEnviar");
    const spinner = btnEnviar?.querySelector(".spin");

    form.addEventListener("submit", async function (e) {
      e.preventDefault();

      // UI Loading
      if(spinner) spinner.style.display = "inline-block";
      btnEnviar.disabled = true;
      statusMensagem.textContent = "Enviando...";
      statusMensagem.style.color = "var(--cor-texto)"; 

      const formData = new FormData(form);
      const token = formData.get('cf-turnstile-response');

      // Dados para enviar
      const data = {
        nome: form.nome.value,
        email: form.email.value,
        mensagem: form.mensagem.value,
        token: token
      };

      try {
        const response = await fetch('/api/send-email', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        });

        if (response.ok) {
          statusMensagem.textContent = "✅ Mensagem enviada com sucesso!";
          statusMensagem.style.color = "green"; 
          form.reset();
        } else {
          throw new Error('Falha no envio');
        }
      } catch (error) {
        console.error("Erro API:", error);
        statusMensagem.textContent = "❌ Erro ao enviar. Tente novamente.";
        statusMensagem.style.color = "red";
      } finally {
        if(spinner) spinner.style.display = "none";
        btnEnviar.disabled = false;
        setTimeout(() => {
            statusMensagem.textContent = "";
        }, 5000);
      }
    });
  }
});