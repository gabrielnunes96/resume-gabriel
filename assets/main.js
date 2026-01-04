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

      "hero.kicker": "Payments & FinTech",
      "hero.title": "Full Stack Developer que constrói sistemas rápidos, confiáveis e escaláveis.",
      "hero.subtitle":
        "Trabalho com .NET/C#, Node.js e bancos relacionais para entregar produtos de alta performance (de POCs a produção).",
      "stats.years": "Anos de experiência",
      "stats.boost": "Ganho de performance",
      "stats.tx": "Transações/Mês",
      "hero.ctaPrimary": "Ver projetos",
      "hero.ctaSecondary": "Download currículo",
      "hero.email": "E-mail",
      "hero.hello": "Olá, eu sou o Gabriel",
      "hero.role": "Full Stack Developer",
      "hero.mini": "Especialista em back-end e sistemas de alta performance para pagamentos.",

      "about.kicker": "Sobre",
      "about.title": "Um resumo rápido",
      "about.p1":
        "Atuo com microsserviços, integrações e processamento em lote. Gosto de sistemas bem observáveis, com foco em confiabilidade e tempo de resposta.",
      "about.p2":
        "No trabalho mais recente, liderei uma POC de conciliação que reduziu o tempo de processamento diário de 8–10h para 3–5h, processando 50k–100k registros/dia.",
      "about.fact1Label": "Localização",
      "about.fact2Label": "Foco",
      "about.fact2Value": "Payments • FinTech • Performance",
      "about.fact3Label": "Stack",
      "about.fact4Label": "Links",
      "about.resumeLink": "Currículos (HTML/PDF)",
      "about.note": "Dica: mova o mouse pela página — tem um efeito de “onda” sutil no fundo.",

      "skills.kicker": "Skills",
      "skills.title": "Tecnologias que uso",
      "skills.langs": "Linguagens & Frameworks",
      "skills.db": "Banco de dados",
      "skills.devops": "DevOps & Cloud",
      "skills.practice": "Práticas",
      "skills.queryOpt": "Otimização de queries",

      "projects.kicker": "Projetos em destaque",
      "projects.title": "O que construí",
      "projects.subtitle":
        "Uma seleção de projetos em que trabalhei, de experimentos pessoais a sistemas em produção.",
      "projects.recon.title": "Transaction Reconciliation System",
      "projects.recon.desc":
        "Sistema de processamento em lote de alta performance que concilia transações Visa/MasterCard. Reduziu o tempo em 50%+ tratando 100k+ registros/dia.",
      "projects.recon.tag": "Multi-threading",
      "projects.private": "Private (B2 Pagamentos)",
      "projects.crud.desc":
        "Uma API CRUD bem estruturada em .NET, demonstrando boas práticas de design e arquitetura.",
      "projects.customers.desc":
        "Microsserviço para gestão de clientes com foco em Clean Architecture e princípios de domínio.",
      "projects.romaji.desc":
        "Ferramenta CLI que converte Romaji em Hiragana/Katakana para ajudar no estudo de japonês.",
      "projects.ponto.title": "Registro de Ponto",
      "projects.ponto.desc": "Aplicação para controle de ponto com entrada/saída e geração de relatórios.",
      "projects.ponto.tag": "Time Tracking",

      "exp.kicker": "Experiência",
      "exp.title": "Minha jornada",
      "exp.subtitle": "O caminho que percorri de trainee a desenvolvedor pleno em 3 anos.",
      "exp.mid.title": "Full Stack Developer (Mid-Level)",
      "exp.mid.li1": "POC de conciliação: 8–10h → 3–5h (50%+) com 50k–100k registros/dia.",
      "exp.mid.li2": "Apps .NET multi-threaded para alto throughput.",
      "exp.mid.li3": "Microsserviços integrados com Visa/MasterCard.",
      "exp.mid.li4": "AWS + CI/CD no Azure DevOps.",
      "exp.jr.title": "Full Stack Developer (Junior)",
      "exp.jr.li1": "Features full-stack com Vue.js, Node.js e .NET.",
      "exp.jr.li2": "Automação para ingestão/parsing/conciliação de arquivos.",
      "exp.jr.li3": "Integrações REST com provedores de pagamento.",
      "exp.tr.title": "Systems Analyst Trainee",
      "exp.tr.li1": "Processos de conciliação em produção para VISA.",
      "exp.tr.li2": "Componentes Vue.js com arquitetura baseada em componentes.",
      "exp.tr.li3": "Workflows automatizados via Windows Task Scheduler.",

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

      "hero.kicker": "Payments & FinTech",
      "hero.title": "Full Stack Developer building fast, reliable, scalable systems.",
      "hero.subtitle":
        "I work with .NET/C#, Node.js, and relational databases to ship high-performance products (from POCs to production).",
      "stats.years": "Years of experience",
      "stats.boost": "Performance gain",
      "stats.tx": "Transactions/Month",
      "hero.ctaPrimary": "View projects",
      "hero.ctaSecondary": "Download resume",
      "hero.email": "Email",
      "hero.hello": "Hey, I'm Gabriel",
      "hero.role": "Full Stack Developer",
      "hero.mini": "Backend specialist focused on high-performance payment systems.",

      "about.kicker": "About",
      "about.title": "A quick summary",
      "about.p1":
        "I build microservices, integrations, and batch processing pipelines. I like observable systems with a focus on reliability and latency.",
      "about.p2":
        "Most recently, I led a reconciliation POC that reduced daily processing time from 8–10h to 3–5h, handling 50k–100k records/day.",
      "about.fact1Label": "Location",
      "about.fact2Label": "Focus",
      "about.fact2Value": "Payments • FinTech • Performance",
      "about.fact3Label": "Stack",
      "about.fact4Label": "Links",
      "about.resumeLink": "Resumes (HTML/PDF)",
      "about.note": "Tip: move your mouse — there’s a subtle “wave” background effect.",

      "skills.kicker": "Skills",
      "skills.title": "Tech I use",
      "skills.langs": "Languages & Frameworks",
      "skills.db": "Databases",
      "skills.devops": "DevOps & Cloud",
      "skills.practice": "Practices",
      "skills.queryOpt": "Query optimization",

      "projects.kicker": "Featured projects",
      "projects.title": "Things I’ve built",
      "projects.subtitle":
        "A selection of projects I’ve worked on, from personal experiments to production systems.",
      "projects.recon.title": "Transaction Reconciliation System",
      "projects.recon.desc":
        "High-throughput batch processing system that reconciles Visa/MasterCard transactions. Reduced processing time by 50%+ handling 100k+ records/day.",
      "projects.recon.tag": "Multi-threading",
      "projects.private": "Private (B2 Pagamentos)",
      "projects.crud.desc":
        "A clean and well-structured CRUD API built with .NET, showcasing best practices in API design and architecture.",
      "projects.customers.desc":
        "Customer management microservice focused on clean architecture and domain principles.",
      "projects.romaji.desc":
        "CLI tool that converts Romaji into Hiragana/Katakana to help with Japanese learning.",
      "projects.ponto.title": "Time Clock",
      "projects.ponto.desc": "Time tracking app with check-in/out and report generation.",
      "projects.ponto.tag": "Time Tracking",

      "exp.kicker": "Experience",
      "exp.title": "My journey",
      "exp.subtitle": "From trainee to mid-level developer in 3 years.",
      "exp.mid.title": "Full Stack Developer (Mid-Level)",
      "exp.mid.li1": "Reconciliation POC: 8–10h → 3–5h (50%+) with 50k–100k records/day.",
      "exp.mid.li2": "Multi-threaded .NET apps for high throughput.",
      "exp.mid.li3": "Microservices integrated with Visa/MasterCard.",
      "exp.mid.li4": "AWS + CI/CD in Azure DevOps.",
      "exp.jr.title": "Full Stack Developer (Junior)",
      "exp.jr.li1": "Full-stack features with Vue.js, Node.js, and .NET.",
      "exp.jr.li2": "Automation for ingestion/parsing/reconciliation pipelines.",
      "exp.jr.li3": "REST integrations with payment providers.",
      "exp.tr.title": "Systems Analyst Trainee",
      "exp.tr.li1": "Production reconciliation processes for VISA validation.",
      "exp.tr.li2": "Vue.js components with a component-based architecture.",
      "exp.tr.li3": "Automated workflows via Windows Task Scheduler.",

      "contact.kicker": "Contact",
      "contact.title": "Let’s talk",
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


