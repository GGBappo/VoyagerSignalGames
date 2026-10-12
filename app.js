(function () {
  const data = window.VSG_SITE_DATA || {};
  const currentPage = document.body.dataset.page;

  const escapeHtml = (value) =>
    String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");

  const renderActions = (items = []) =>
    items
      .map(
        (item) =>
          `<a class="button ${item.style === "secondary" ? "button-secondary" : ""}" href="${escapeHtml(item.href)}">${escapeHtml(item.label)}</a>`
      )
      .join("");

  const renderHeader = () => {
    const header = document.querySelector(".site-header");
    if (!header) return;

    header.innerHTML = `
      <a class="brand" href="index.html" aria-label="${escapeHtml(data.studioName)} home">
        <img src="${escapeHtml(data.logo)}" alt="${escapeHtml(data.studioName)} logo">
      </a>
      <button class="nav-toggle" type="button" aria-expanded="false" aria-controls="site-nav">
        <span></span><span></span><span></span>
        <span class="sr-only">Toggle navigation</span>
      </button>
      <nav id="site-nav" class="site-nav" aria-label="Main navigation">
        ${(data.nav || [])
          .map(
            (item) =>
              `<a class="${item.page === currentPage ? "active" : ""}" href="${escapeHtml(item.href)}">${escapeHtml(item.label)}</a>`
          )
          .join("")}
      </nav>
    `;

    const navToggle = header.querySelector(".nav-toggle");
    const siteNav = header.querySelector(".site-nav");
    navToggle.addEventListener("click", () => {
      const isOpen = navToggle.getAttribute("aria-expanded") === "true";
      navToggle.setAttribute("aria-expanded", String(!isOpen));
      siteNav.classList.toggle("is-open", !isOpen);
    });
  };

  const renderFooter = () => {
    const footer = document.querySelector(".site-footer");
    if (!footer) return;

    footer.innerHTML = `
      <img src="${escapeHtml(data.logo)}" alt="">
      <p>${escapeHtml(data.footerText)}</p>
    `;
  };

  const renderers = {
    heroActions: renderActions,
    gameActions: renderActions,
    storeLinks: renderActions,
    communityActions: renderActions,
    joinActions: renderActions,
    facts: (items) =>
      items
        .map(
          (item) => `
            <article class="fact">
              <span>${escapeHtml(item.label)}</span>
              <strong>${escapeHtml(item.value)}</strong>
            </article>
          `
        )
        .join(""),
    values: (items) =>
      items
        .map(
          (item) => `
            <article class="value-card">
              <h3>${escapeHtml(item.title)}</h3>
              <p>${escapeHtml(item.text)}</p>
            </article>
          `
        )
        .join(""),
    gameFacts: (items) =>
      items
        .map(
          (item) => `
            <div>
              <dt>${escapeHtml(item.label)}</dt>
              <dd>${escapeHtml(item.value)}</dd>
            </div>
          `
        )
        .join(""),
    gamePillars: (items) =>
      items
        .map(
          (item) => `
            <article>
              <h3>${escapeHtml(item.title)}</h3>
              <p>${escapeHtml(item.text)}</p>
            </article>
          `
        )
        .join(""),
    artwork: (items) =>
      items
        .map(
          (item) => `
            <article class="art-card">
              <img src="${escapeHtml(item.image)}" alt="${escapeHtml(item.title)}">
              <div>
                <h3>${escapeHtml(item.title)}</h3>
                <p>${escapeHtml(item.text)}</p>
              </div>
            </article>
          `
        )
        .join(""),
    updates: (items) =>
      items
        .map(
          (item) => `
            <article class="update-card">
              <span>${escapeHtml(item.date)}</span>
              <h2>${escapeHtml(item.title)}</h2>
              <p>${escapeHtml(item.text)}</p>
            </article>
          `
        )
        .join(""),
    developers: (items) =>
      items
        .map(
          (item) => `
            <article class="developer-card">
              <div class="developer-avatar" aria-hidden="true">${escapeHtml(item.name.charAt(0))}</div>
              <div>
                <h2>${escapeHtml(item.name)}</h2>
                ${item.pronouns ? `<em>${escapeHtml(item.pronouns)}</em>` : ""}
                <span>${escapeHtml(item.role)}</span>
                <div class="team-tags">
                  ${(item.teams || []).map((team) => `<b class="team-tag team-${escapeHtml(team.toLowerCase())}">${escapeHtml(team)}</b>`).join("")}
                </div>
                <p>${escapeHtml(item.bio)}</p>
                <strong>${escapeHtml(item.discord)}</strong>
              </div>
            </article>
          `
        )
        .join(""),
    socials: (items) =>
      items
        .map((item) => `<a href="${escapeHtml(item.href)}">${escapeHtml(item.label)}</a>`)
        .join("")
  };

  renderHeader();
  renderFooter();

  document.querySelectorAll("[data-field]").forEach((element) => {
    const key = element.getAttribute("data-field");
    const value = data[key];

    if (!value) return;

    if (key === "studioBody" && Array.isArray(value)) {
      element.innerHTML = value.map((paragraph) => `<p>${escapeHtml(paragraph)}</p>`).join("");
      return;
    }

    if (key === "emailLink") {
      element.textContent = data.email;
      element.setAttribute("href", `mailto:${data.email}`);
      return;
    }

    element.textContent = value;
  });

  document.querySelectorAll("[data-repeat]").forEach((element) => {
    const key = element.getAttribute("data-repeat");
    if (renderers[key] && data[key]) {
      element.innerHTML = renderers[key](data[key]);
    }
  });
})();
