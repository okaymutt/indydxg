/*
  INDYDXG LIBRARY UI
  Works alongside the existing script.js:
  - Leaves the track catalog and audio player intact.
  - Supports SINGLE entries later by setting type: "SINGLE".
  - Keeps album/EP track playback and Android Media Session controls.
*/
(() => {
  "use strict";

  const singlesTab = document.getElementById("singles-tab");
  const projectsTab = document.getElementById("projects-tab");
  const singlesView = document.getElementById("singles-view");
  const projectsView = document.getElementById("projects-view");
  const singlesList = document.getElementById("release-list");
  const projectGrid = document.getElementById("project-grid");
  const projectDetail = document.getElementById("project-detail");
  const projectContent = document.getElementById("project-content");
  const backButton = document.getElementById("back-to-projects");
  const releaseCount = document.getElementById("release-count");

  if (!Array.isArray(window.releases) && typeof releases === "undefined") {
    console.error("Library UI: releases catalog was not found. Check script.js load order.");
    return;
  }

  const catalog = releases;
  const singles = catalog.filter(release => String(release.type).toUpperCase() === "SINGLE");
  const projects = catalog.filter(release => String(release.type).toUpperCase() !== "SINGLE");

  function releaseDate(release) {
    return release.date || release.year || "DATE UNKNOWN";
  }

  function makeCover(release, className) {
    if (release.cover) {
      const img = document.createElement("img");
      img.className = className;
      img.src = release.cover;
      img.alt = `${release.title} cover artwork`;
      img.loading = "lazy";
      img.addEventListener("error", () => {
        const placeholder = document.createElement("div");
        placeholder.className = `${className} cover-placeholder`;
        placeholder.setAttribute("aria-label", "Cover artwork unavailable");
        placeholder.textContent = "INDYDXG";
        img.replaceWith(placeholder);
      }, { once: true });
      return img;
    }

    const placeholder = document.createElement("div");
    placeholder.className = `${className} cover-placeholder`;
    placeholder.setAttribute("aria-hidden", "true");
    placeholder.textContent = "INDYDXG";
    return placeholder;
  }

  function makeTrackList(release, parent) {
    const trackList = document.createElement("div");
    trackList.className = "track-list";

    const releaseIndex = catalog.indexOf(release);

    release.tracks.forEach((track, index) => {
      const button = document.createElement("button");
      button.className = "track-button";
      button.type = "button";
      button.dataset.releaseIndex = String(releaseIndex);
      button.dataset.trackIndex = String(index);
      button.textContent = `${String(index + 1).padStart(2, "0")}  ${track.title}  ▶`;
      button.addEventListener("click", () => {
        playTrack(track, release, button);
      });
      trackList.appendChild(button);
    });

    parent.appendChild(trackList);
  }

  function showTab(tabName) {
    const showSingles = tabName === "singles";

    singlesView.hidden = !showSingles;
    projectsView.hidden = showSingles;

    singlesTab.classList.toggle("active", showSingles);
    projectsTab.classList.toggle("active", !showSingles);
    singlesTab.setAttribute("aria-selected", String(showSingles));
    projectsTab.setAttribute("aria-selected", String(!showSingles));

    if (showSingles) {
      projectGrid.hidden = false;
      projectDetail.hidden = true;
      releaseCount.textContent = String(singles.length).padStart(2, "0");
    } else {
      releaseCount.textContent = String(projects.length).padStart(2, "0");
    }
  }

  function renderSingles() {
    singlesList.replaceChildren();

    if (singles.length === 0) {
      const empty = document.createElement("p");
      empty.className = "library-empty";
      empty.textContent = "no public singles listed yet :3";
      singlesList.appendChild(empty);
      return;
    }

    singles.forEach((release, number) => {
      const article = document.createElement("article");
      article.className = "release single-release";

      const cover = makeCover(release, "release-cover");
      const body = document.createElement("div");
      body.className = "single-info";

      const type = document.createElement("div");
      type.className = "release-type";
      type.textContent = `SINGLE / ${releaseDate(release)}`;

      const title = document.createElement("h3");
      title.textContent = release.title;

      const description = document.createElement("p");
      description.textContent = `${release.tracks.length} TRACK${release.tracks.length === 1 ? "" : "S"}`;

      body.append(type, title, description);
      makeTrackList(release, body);

      const side = document.createElement("div");
      side.className = "release-side";
      side.textContent = `NO. ${String(number + 1).padStart(2, "0")}`;

      article.append(cover, body, side);
      singlesList.appendChild(article);
    });
  }

  function openProject(release) {
    projectGrid.hidden = true;
    projectDetail.hidden = false;
    projectContent.replaceChildren();

    const heading = document.createElement("div");
    heading.className = "project-detail-heading";

    const cover = makeCover(release, "project-detail-cover");
    const info = document.createElement("div");
    info.className = "project-detail-info";

    const type = document.createElement("p");
    type.className = "project-type";
    type.textContent = release.type || "PROJECT";

    const title = document.createElement("h2");
    title.textContent = release.title;

    const date = document.createElement("p");
    date.textContent = releaseDate(release);

    const count = document.createElement("p");
    count.textContent = `${release.tracks.length} TRACK${release.tracks.length === 1 ? "" : "S"}`;

    info.append(type, title, date, count);
    heading.append(cover, info);
    projectContent.appendChild(heading);
    makeTrackList(release, projectContent);

    releaseCount.textContent = String(release.tracks.length).padStart(2, "0");
  }

  function renderProjects() {
    projectGrid.replaceChildren();

    projects.forEach(release => {
      const card = document.createElement("button");
      card.className = "project-card";
      card.type = "button";
      card.setAttribute("aria-label", `Open ${release.title}`);

      card.appendChild(makeCover(release, "project-cover"));

      const title = document.createElement("span");
      title.className = "project-title";
      title.textContent = release.title;

      const date = document.createElement("span");
      date.className = "project-date";
      date.textContent = releaseDate(release);

      const type = document.createElement("span");
      type.className = "project-type";
      type.textContent = release.type || "PROJECT";

      card.append(title, date, type);
      card.addEventListener("click", () => openProject(release));
      projectGrid.appendChild(card);
    });

    if (projects.length === 0) {
      const empty = document.createElement("p");
      empty.className = "library-empty";
      empty.textContent = "no projects listed yet.";
      projectGrid.appendChild(empty);
    }
  }

  /*
    The original playTrackAt() assumed every catalog entry was a visible
    .release row. This version finds the correct track button in either view.
  */
  playTrackAt = function(index) {
    if (!currentRelease || index < 0 || index >= currentRelease.tracks.length) return;

    const releaseIndex = catalog.indexOf(currentRelease);
    const button = document.querySelector(
      `[data-release-index="${releaseIndex}"][data-track-index="${index}"]`
    );

    playTrack(currentRelease.tracks[index], currentRelease, button || null);
  };

  singlesTab.addEventListener("click", () => showTab("singles"));
  projectsTab.addEventListener("click", () => showTab("projects"));

  backButton.addEventListener("click", () => {
    projectDetail.hidden = true;
    projectGrid.hidden = false;
    releaseCount.textContent = String(projects.length).padStart(2, "0");
  });

  renderSingles();
  renderProjects();

  // There are currently no SINGLE entries, so open PRXJECTS on first load.
  showTab(singles.length > 0 ? "singles" : "projects");
})();
