/* eslint-disable no-restricted-globals */
(() => {
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  // Footer year
  const yearEl = $("#year");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  // Canvas comet cursor (custom cursor with a short trail)
  const prefersReduced = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const canvas = $("#bgCanvas");
  const finePointer = window.matchMedia && window.matchMedia("(pointer: fine)").matches;
  if (canvas && !prefersReduced && finePointer) {
    const ctx = canvas.getContext("2d", { alpha: true, desynchronized: true });
    if (ctx) {
      document.documentElement.classList.add("has-comet-cursor");

      let dpr = Math.min(2, window.devicePixelRatio || 1);
      let w = 1;
      let h = 1;

      const mouse = { x: 0.62, y: 0.30, tx: 0.62, ty: 0.30, has: false };
      const trail = [];
      const TRAIL_MAX = 26;

      const resize = () => {
        dpr = Math.min(2, window.devicePixelRatio || 1);
        w = Math.max(1, Math.floor((window.innerWidth || 1) * dpr));
        h = Math.max(1, Math.floor((window.innerHeight || 1) * dpr));
        canvas.width = w;
        canvas.height = h;
      };
      resize();
      window.addEventListener("resize", resize, { passive: true });

      const onMove = (e) => {
        const ww = window.innerWidth || 1;
        const hh = window.innerHeight || 1;
        mouse.tx = Math.min(1, Math.max(0, e.clientX / ww));
        mouse.ty = Math.min(1, Math.max(0, e.clientY / hh));
        mouse.has = true;
      };
      window.addEventListener("pointermove", onMove, { passive: true });
      window.addEventListener(
        "touchmove",
        (e) => {
          const t = e.touches && e.touches[0];
          if (t) onMove(t);
        },
        { passive: true },
      );

      const drawComet = () => {
        // Smooth follow so it feels premium
        mouse.x += (mouse.tx - mouse.x) * 0.20;
        mouse.y += (mouse.ty - mouse.y) * 0.20;

        const cx = mouse.x * w;
        const cy = mouse.y * h;

        // Add to trail
        trail.unshift({ x: cx, y: cy });
        if (trail.length > TRAIL_MAX) trail.pop();

        // Clear (no accumulation => no random bright blobs under sections)
        ctx.clearRect(0, 0, w, h);

        // Tail
        ctx.save();
        ctx.globalCompositeOperation = "lighter";
        ctx.filter = "blur(0px)";

        for (let i = trail.length - 1; i >= 0; i--) {
          const p = trail[i];
          const t = 1 - i / trail.length;
          const r = (2 + t * 10) * dpr;
          const a = 0.02 + t * 0.20;

          const hue = 190 + 40 * t; // cyan -> indigo
          const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, r * 6);
          g.addColorStop(0, `hsla(${hue}, 95%, 62%, ${a})`);
          g.addColorStop(0.25, `hsla(${hue}, 95%, 58%, ${a * 0.35})`);
          g.addColorStop(1, `hsla(${hue}, 95%, 56%, 0)`);
          ctx.fillStyle = g;
          ctx.beginPath();
          ctx.arc(p.x, p.y, r * 3, 0, Math.PI * 2);
          ctx.fill();
        }

        // Head (small “comet” core)
        const head = trail[0];
        if (head) {
          ctx.filter = `blur(${1.5 * dpr}px)`;
          const hg = ctx.createRadialGradient(head.x, head.y, 0, head.x, head.y, 24 * dpr);
          hg.addColorStop(0, "rgba(255,255,255,0.28)");
          hg.addColorStop(0.2, "rgba(34,211,238,0.20)");
          hg.addColorStop(1, "rgba(34,211,238,0)");
          ctx.fillStyle = hg;
          ctx.beginPath();
          ctx.arc(head.x, head.y, 22 * dpr, 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.restore();
        requestAnimationFrame(drawComet);
      };

      // Start only after first movement (avoid a random dot on load)
      const startWhenReady = () => {
        if (!mouse.has) return requestAnimationFrame(startWhenReady);
        requestAnimationFrame(drawComet);
      };
      startWhenReady();
    }
  }

  // i18n
  const dict = {
    pt: {
      "nav.about": "Sobre",
      "nav.skills": "Skills",
      "nav.projects": "Projetos",
      "nav.experience": "Experiência",
      "nav.resume": "Currículo",
      "nav.contact": "Contato",
      "hero.kicker": "Meios de pagamento • .NET • DevOps",
      "hero.title": "Desenvolvedor back-end .NET que constrói, testa e coloca em produção sistemas de pagamento.",
      "hero.subtitle": "4+ anos integrando com Visa e Mastercard: conciliação, disputas e chargeback, SQL Server otimizado e o caminho até a produção com Azure DevOps, Docker e AWS.",
      "stats.years": "Anos em meios de pagamento",
      "stats.boost": "Menos tempo na conciliação diária",
      "stats.tests": "Testes automatizados numa migração",
      "hero.ctaPrimary": "Ver projetos",
      "hero.ctaSecondary": "Download currículo",
      "hero.email": "E-mail",
      "hero.hello": "Olá, eu sou o Gabriel",
      "hero.role": "Desenvolvedor Back-end .NET",
      "hero.mini": "Integrações com bandeiras, processamento em lote e performance, com testes e pipeline.",
      "about.kicker": "Sobre",
      "about.title": "Um resumo rápido",
      "about.p1": "Trabalho com integrações de pagamento, processamento em lote e APIs .NET. Gosto de sistemas testados, observáveis e fáceis de manter, e de levar o código até a produção: pipeline, container e infraestrutura.",
      "about.p2": "Duas entregas recentes: a POC de conciliação que reduziu o processamento diário de 8–10h para 3–5h (50k–100k registros/dia), e a migração do robô de disputas do SDK da Mastercard para a API de bandeira interna, que fiz sozinho de ponta a ponta, com 530+ testes automatizados.",
      "about.fact1Label": "Localização",
      "about.fact2Label": "Foco",
      "about.fact2Value": "Pagamentos • Back-end • DevOps",
      "about.fact3Label": "Stack",
      "skills.kicker": "Skills",
      "skills.title": "Tecnologias que uso",
      "skills.langs": "Linguagens & Frameworks",
      "skills.db": "Banco de dados",
      "skills.queryOpt": "Otimização de queries",
      "skills.devops": "DevOps & Cloud",
      "skills.practice": "Práticas",
      "skills.tests": "Testes automatizados (TDD)",
      "skills.secure": "Desenvolvimento seguro",
      "skills.micro": "Microsserviços",
      "skills.ai": "IA no desenvolvimento (Claude Code)",
      "projects.kicker": "Projetos em destaque",
      "projects.title": "O que construí",
      "projects.subtitle": "Uma seleção de projetos em que trabalhei, de experimentos pessoais a sistemas em produção.",
      "projects.migra.title": "Migração para a API de bandeira",
      "projects.migra.desc": "Tirei o robô de disputas do SDK da Mastercard, que tinha pacotes vulneráveis, e passei toda a comunicação para uma API .NET interna: 22 operações nas APIs V6 e Extended, rotas antigas mantidas e 530+ testes (antes, 1).",
      "projects.private": "Privado (B2 Pagamentos)",
      "projects.recon.title": "Sistema de conciliação de transações",
      "projects.recon.desc": "Processamento em lote que concilia transações Visa e Mastercard. A POC reduziu o tempo diário de 8–10h para 3–5h, com 50k–100k registros/dia.",
      "projects.devflow.desc": "Plugins para o Claude Code que levam uma demanda até o PR: especificação, plano, implementação com revisão de código e de segurança, validação e CI/CD (Azure Pipelines, GitHub Actions, GitLab), sempre com aprovação humana nos pontos-chave.",
      "projects.code": "Ver código →",
      "projects.tofalany.desc": "App desktop de texto, voz, vídeo e tela para um grupo pequeno, com servidor próprio: Electron e React no cliente, Node.js, SQLite e LiveKit no servidor, Docker Compose, deploy em VPS com HTTPS e testes e2e com Playwright.",
      "projects.customers.desc": "Duas APIs em C# que simulam um emissor de cartão: cadastro de clientes, e transações com débito e histórico, protegidas com JWT.",
      "exp.kicker": "Experiência",
      "exp.title": "Minha jornada",
      "exp.subtitle": "De trainee a pleno em 3 anos, na mesma empresa.",
      "exp.mid.when": "Mar 2025 — Atual",
      "exp.mid.title": "Desenvolvedor Full Stack Pleno",
      "exp.mid.company": "B2 Pagamentos • Remoto",
      "exp.mid.li1": "Migrei sozinho o robô de disputas do SDK da Mastercard para a API de bandeira interna: 22 operações, 530+ testes e pacotes vulneráveis removidos.",
      "exp.mid.li2": "POC de conciliação: 8–10h → 3–5h (50%+) com 50k–100k registros/dia.",
      "exp.mid.li3": "Apps .NET multi-threaded e SQL Server otimizado (procedures, índices, planos de execução).",
      "exp.mid.li4": "Pipelines CI/CD no Azure DevOps e infraestrutura AWS (EC2, VPC).",
      "exp.jr.when": "Mai 2024 — Mar 2025",
      "exp.jr.title": "Desenvolvedor Full Stack Júnior",
      "exp.jr.company": "B2 Pagamentos • Belo Horizonte",
      "exp.jr.li1": "Features full-stack com Vue.js, Node.js e .NET, com testes desde o início (TDD).",
      "exp.jr.li2": "Automação de ingestão, parsing e conciliação de arquivos Visa e Mastercard.",
      "exp.jr.li3": "Integrações REST com provedores de pagamento.",
      "exp.tr.when": "Abr 2022 — Mai 2024",
      "exp.tr.title": "Analista de Sistemas Trainee",
      "exp.tr.company": "B2 Pagamentos • Brasil",
      "exp.tr.li1": "Processos de leitura e conciliação de arquivos Visa em produção.",
      "exp.tr.li2": "Componentes front-end em Vue.js.",
      "exp.tr.li3": "Rotinas em lote agendadas no Windows Task Scheduler.",
      "contact.kicker": "Contato",
      "contact.title": "Vamos conversar",
      "contact.emailLabel": "E-mail",
      "footer.built": "Built with focus and passion.",
      "footer.top": "Voltar ao topo ↑",
    },
    en: {
      "nav.about": "About",
      "nav.skills": "Skills",
      "nav.projects": "Projects",
      "nav.experience": "Experience",
      "nav.resume": "Resume",
      "nav.contact": "Contact",
      "hero.kicker": "Payments • .NET • DevOps",
      "hero.title": "Back-end .NET developer who builds, tests and ships payment systems.",
      "hero.subtitle": "4+ years integrating with Visa and Mastercard: reconciliation, disputes and chargebacks, tuned SQL Server, and the road to production with Azure DevOps, Docker and AWS.",
      "stats.years": "Years in payments",
      "stats.boost": "Less time in daily reconciliation",
      "stats.tests": "Automated tests in one migration",
      "hero.ctaPrimary": "View projects",
      "hero.ctaSecondary": "Download resume",
      "hero.email": "Email",
      "hero.hello": "Hey, I'm Gabriel",
      "hero.role": "Back-end .NET Developer",
      "hero.mini": "Card-network integrations, batch processing and performance, backed by tests and pipelines.",
      "about.kicker": "About",
      "about.title": "A quick summary",
      "about.p1": "I work on payment integrations, batch processing and .NET APIs. I like systems that are tested, observable and easy to maintain, and I take code all the way to production: pipeline, container and infrastructure.",
      "about.p2": "Two recent deliveries: a reconciliation POC that cut daily processing from 8–10h to 3–5h (50k–100k records/day), and the migration of the disputes robot from the Mastercard SDK to the internal card-network API, which I built end to end on my own, with 530+ automated tests.",
      "about.fact1Label": "Location",
      "about.fact2Label": "Focus",
      "about.fact2Value": "Payments • Back-end • DevOps",
      "about.fact3Label": "Stack",
      "skills.kicker": "Skills",
      "skills.title": "Tech I use",
      "skills.langs": "Languages & Frameworks",
      "skills.db": "Databases",
      "skills.queryOpt": "Query optimization",
      "skills.devops": "DevOps & Cloud",
      "skills.practice": "Practices",
      "skills.tests": "Automated testing (TDD)",
      "skills.secure": "Secure development",
      "skills.micro": "Microservices",
      "skills.ai": "AI-assisted development (Claude Code)",
      "projects.kicker": "Featured projects",
      "projects.title": "Things I've built",
      "projects.subtitle": "From production systems at work to personal projects you can open and run.",
      "projects.migra.title": "Card-network API migration",
      "projects.migra.desc": "Moved the disputes robot off the Mastercard SDK, which carried vulnerable packages, and routed all traffic through an internal .NET API: 22 operations across the V6 and Extended APIs, legacy routes kept, and 530+ tests (up from 1).",
      "projects.private": "Private (B2 Pagamentos)",
      "projects.recon.title": "Transaction reconciliation system",
      "projects.recon.desc": "Batch processing that reconciles Visa and Mastercard transactions. The POC cut daily processing from 8–10h to 3–5h, at 50k–100k records/day.",
      "projects.devflow.desc": "Claude Code plugins that take a request all the way to a PR: specs, plan, implementation with code and security review, validation and CI/CD (Azure Pipelines, GitHub Actions, GitLab), with human approval at the key steps.",
      "projects.code": "View code →",
      "projects.tofalany.desc": "Desktop app for text, voice, video and screen sharing for a small group, self-hosted: Electron and React on the client, Node.js, SQLite and LiveKit on the server, Docker Compose, VPS deploy with HTTPS and Playwright e2e tests.",
      "projects.customers.desc": "Two C# APIs simulating a card issuer: customer management, and transactions with debit and history, secured with JWT.",
      "exp.kicker": "Experience",
      "exp.title": "My journey",
      "exp.subtitle": "From trainee to mid-level in 3 years, at the same company.",
      "exp.mid.when": "Mar 2025 — Present",
      "exp.mid.title": "Full Stack Developer (Mid-Level)",
      "exp.mid.company": "B2 Pagamentos • Remote",
      "exp.mid.li1": "Single-handedly migrated the disputes robot from the Mastercard SDK to the internal card-network API: 22 operations, 530+ tests, vulnerable packages removed.",
      "exp.mid.li2": "Reconciliation POC: 8–10h → 3–5h (50%+) at 50k–100k records/day.",
      "exp.mid.li3": "Multi-threaded .NET apps and tuned SQL Server (procedures, indexes, execution plans).",
      "exp.mid.li4": "CI/CD pipelines in Azure DevOps and AWS infrastructure (EC2, VPC).",
      "exp.jr.when": "May 2024 — Mar 2025",
      "exp.jr.title": "Full Stack Developer (Junior)",
      "exp.jr.company": "B2 Pagamentos • Belo Horizonte",
      "exp.jr.li1": "Full-stack features with Vue.js, Node.js and .NET, test-first (TDD).",
      "exp.jr.li2": "Automated ingestion, parsing and reconciliation of Visa and Mastercard files.",
      "exp.jr.li3": "REST integrations with payment providers.",
      "exp.tr.when": "Apr 2022 — May 2024",
      "exp.tr.title": "Systems Analyst Trainee",
      "exp.tr.company": "B2 Pagamentos • Brazil",
      "exp.tr.li1": "Production processes to read and reconcile Visa files.",
      "exp.tr.li2": "Front-end components in Vue.js.",
      "exp.tr.li3": "Batch routines scheduled with Windows Task Scheduler.",
      "contact.kicker": "Contact",
      "contact.title": "Let's talk",
      "contact.emailLabel": "Email",
      "footer.built": "Built with focus and passion.",
      "footer.top": "Back to top ↑",
    },
  };

  const setLang = (lang) => {
    const safe = lang === "en" ? "en" : "pt";
    document.documentElement.lang = safe === "en" ? "en" : "pt-BR";
    const strings = dict[safe];
    $$("[data-i18n]").forEach((el) => {
      const key = el.getAttribute("data-i18n");
      if (!key) return;
      const value = strings[key];
      if (typeof value === "string") el.textContent = value;
    });

    $$("[data-lang]").forEach((btn) => {
      const isActive = btn.getAttribute("data-lang") === safe;
      btn.classList.toggle("is-active", isActive);
      btn.setAttribute("aria-pressed", String(isActive));
    });

    try {
      localStorage.setItem("lang", safe);
    } catch {
      // ignore
    }

    // Keep resume link in sync with current language
    $$("[data-resume-link]").forEach((a) => {
      const href = a.getAttribute("href") || "./resume/index.html";
      const base = href.split("?")[0];
      a.setAttribute("href", `${base}?lang=${safe}`);
    });

    // Resume PDF link based on current language (open in a new tab)
    const resumePdfFile =
      safe === "en"
        ? "Gabriel Nunes Campos — Resume - EN - US.pdf"
        : "Gabriel Nunes Campos — Currículo - PT-BR.pdf";
    const resumePdfHref = `./resume/${encodeURIComponent(resumePdfFile)}`;
    $$("[data-resume-download]").forEach((a) => {
      a.setAttribute("href", resumePdfHref);
      a.setAttribute("target", "_blank");
      a.setAttribute("rel", "noreferrer");
    });
  };

  const initLang = () => {
    const params = new URLSearchParams(location.search);
    const fromUrl = params.get("lang");
    const fromStorage = (() => {
      try {
        return localStorage.getItem("lang");
      } catch {
        return null;
      }
    })();

    const navDefault = (navigator.language || "").toLowerCase().startsWith("pt") ? "pt" : "en";
    const preferred = fromUrl || fromStorage || navDefault;
    setLang(preferred);
  };

  $$("[data-lang]").forEach((btn) => {
    btn.addEventListener("click", () => setLang(btn.getAttribute("data-lang") || "pt"));
  });

  initLang();
})();


