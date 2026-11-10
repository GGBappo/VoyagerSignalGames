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
      <div class="header-inner">
      <a class="brand" href="index.html" aria-label="${escapeHtml(data.studioName)} home">
        <span class="brand-orbit" aria-hidden="true"></span>
        <span>${escapeHtml(data.studioName)}</span>
      </a>
      <button class="nav-toggle" type="button" aria-expanded="false" aria-controls="site-nav">
        <span></span><span></span><span></span>
        <span class="sr-only">Toggle navigation</span>
      </button>
      <nav id="site-nav" class="site-nav" aria-label="Main navigation">
        ${(data.nav || [])
          .map(
            (item) => {
              const isCurrent = item.page === currentPage;
              const isParent = item.page === "projects" && currentPage === "game";
              const active = isCurrent || isParent ? ' class="active"' : "";
              const current = isCurrent ? ' aria-current="page"' : isParent ? ' aria-current="true"' : "";
              return `<a${active}${current} href="${escapeHtml(item.href)}">${escapeHtml(item.label)}</a>`;
            }
          )
          .join("")}
      </nav>
      </div>
    `;

    const navToggle = header.querySelector(".nav-toggle");
    const siteNav = header.querySelector(".site-nav");
    navToggle.addEventListener("click", () => {
      const isOpen = navToggle.getAttribute("aria-expanded") === "true";
      navToggle.setAttribute("aria-expanded", String(!isOpen));
      siteNav.classList.toggle("is-open", !isOpen);
    });
    header.addEventListener("keydown", (event) => {
      if (event.key !== "Escape" || navToggle.getAttribute("aria-expanded") !== "true") return;
      navToggle.setAttribute("aria-expanded", "false");
      siteNav.classList.remove("is-open");
      navToggle.focus();
    });
  };

  const renderFooter = () => {
    const footer = document.querySelector(".site-footer");
    if (!footer) return;

    footer.innerHTML = `
      <a class="brand" href="index.html">
        <span class="brand-orbit" aria-hidden="true"></span>
        <span>${escapeHtml(data.studioName)}</span>
      </a>
      <p>${escapeHtml(data.footerText)}</p>
    `;
  };

  const renderArtworkCard = (item) => {
    const original = encodeURIComponent(item.file);
    const preview = encodeURIComponent(item.file.replace(/\.png$/i, ".webp"));
    return `
      <article class="art-card">
        <a class="artwork-link" href="Art/${original}" aria-label="Enlarge ${escapeHtml(item.title)}">
          <img src="Art/previews/${preview}" alt="" loading="lazy" decoding="async">
          <span class="art-zoom" aria-hidden="true">↗</span>
        </a>
        <div class="art-card-copy">
          <h3>${escapeHtml(item.title)}</h3>
          <p>${escapeHtml(item.text)}</p>
        </div>
      </article>
    `;
  };

  const renderArtwork = (items, element) => {
    if (element.hasAttribute("data-featured")) {
      return items.filter((item) => item.featured).map(renderArtworkCard).join("");
    }

    const groups = new Map();
    for (const item of items) {
      if (!groups.has(item.group)) groups.set(item.group, []);
      groups.get(item.group).push(item);
    }
    return Array.from(groups, ([title, entries]) => `
      <section class="gallery-group">
        <h2>${escapeHtml(title)}</h2>
        <div class="art-grid">${entries.map(renderArtworkCard).join("")}</div>
      </section>
    `).join("");
  };

  const initArtworkViewer = () => {
    const links = document.querySelectorAll(".artwork-link");
    if (!links.length || typeof HTMLDialogElement === "undefined") return;

    const dialog = document.createElement("dialog");
    dialog.className = "art-viewer";
    dialog.setAttribute("aria-labelledby", "art-viewer-title");
    dialog.innerHTML = `
      <div class="art-viewer-content">
        <div class="art-viewer-header">
          <h2 id="art-viewer-title"></h2>
          <form method="dialog"><button type="submit" class="button button-secondary" autofocus>Close</button></form>
        </div>
        <img alt="">
        <div class="art-viewer-caption">
          <p></p>
          <a target="_blank" rel="noopener">Open original ↗</a>
        </div>
      </div>
    `;
    document.body.append(dialog);

    const image = dialog.querySelector("img");
    const title = dialog.querySelector("h2");
    const caption = dialog.querySelector("p");
    const original = dialog.querySelector("a");
    links.forEach((link) => {
      link.addEventListener("click", (event) => {
        if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
        event.preventDefault();
        const card = link.closest(".art-card");
        title.textContent = card.querySelector("h3").textContent;
        caption.textContent = card.querySelector("p").textContent;
        image.alt = title.textContent;
        image.src = link.href;
        original.href = link.href;
        dialog.showModal();
      });
    });
    dialog.addEventListener("click", (event) => {
      if (event.target === dialog) dialog.close();
    });
    dialog.addEventListener("close", () => image.removeAttribute("src"));
  };

  const renderers = {
    heroActions: renderActions,
    gameActions: renderActions,
    gamePageActions: renderActions,
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
    artwork: renderArtwork,
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
                  ${(item.teams || []).map((team) => `<b class="team-tag team-${team.toLowerCase().replace(/[^a-z0-9]+/g, "-")}">${escapeHtml(team)}</b>`).join("")}
                </div>
                <p>${escapeHtml(item.bio)}</p>
                <strong>${escapeHtml(item.discord)}</strong>
              </div>
            </article>
          `
        )
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
      element.innerHTML = renderers[key](data[key], element);
    }
  });
  initArtworkViewer();
})();
