// app.js — utilitários compartilhados (fetch, toast, render helpers)

/** Wrapper de fetch com tratamento de erro e JSON automático. */
async function api(path, options = {}) {
  const url = (window.API_BASE || "") + path;
  const res = await fetch(url, {
    headers: { "Content-Type": "application/json", ...(options.headers || {}) },
    ...options,
  });
  const text = await res.text();
  const data = text ? JSON.parse(text) : null;
  if (!res.ok) {
    const msg = (data && data.error) || `Erro ${res.status}`;
    throw new Error(msg);
  }
  return data;
}

/** Exibe um toast temporário. */
function toast(message, isError = false) {
  const el = document.createElement("div");
  el.className = "toast" + (isError ? " error" : "");
  el.textContent = message;
  document.body.appendChild(el);
  setTimeout(() => el.remove(), 3200);
}

/** Formata data ISO -> dd/mm/aaaa. */
function formatDate(iso) {
  if (!iso) return "—";
  const d = new Date(iso);
  if (isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("pt-BR");
}

/** Escapa HTML para evitar XSS ao renderizar dados do servidor. */
function escapeHtml(s) {
  if (s === null || s === undefined) return "";
  return String(s)
    .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;").replace(/'/g, "&#039;");
}

/** Renderiza estado de carregamento num container. */
function showLoading(containerId) {
  const el = document.getElementById(containerId);
  if (el) el.innerHTML = '<div class="loading">Carregando…</div>';
}

/** Renderiza estado vazio. */
function showEmpty(containerId, icon, message) {
  const el = document.getElementById(containerId);
  if (el) el.innerHTML = `<div class="empty"><div class="icon">${icon}</div><p>${escapeHtml(message)}</p></div>`;
}

/** Renderiza banner de erro. */
function showError(containerId, message) {
  const el = document.getElementById(containerId);
  if (el) el.innerHTML = `<div class="error-banner">⚠ ${escapeHtml(message)}</div>`;
}

/** Marca o link de navegação da página atual. */
function markActiveNav(page) {
  document.querySelectorAll(".nav a").forEach((a) => {
    if (a.getAttribute("data-page") === page) a.classList.add("active");
  });
}
