// Pre-React crash reporter — s'exécute avant le module graph React
(function () {
  function esc(s) {
    return String(s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function showStartupError(msg, detail) {
    var root = document.getElementById("root");
    if (root && !root.innerHTML.trim()) {
      root.innerHTML =
        '<div style="padding:32px;font-family:monospace;background:#0b1220;color:#f87171;min-height:100vh">' +
        '<b style="font-size:16px">' + esc(msg) + "</b><br><br>" +
        '<pre style="white-space:pre-wrap;font-size:11px;background:#1e293b;padding:16px;border-radius:8px;color:#fca5a5">' +
        esc(detail) +
        "</pre></div>";
    }
  }

  window.addEventListener("error", function (e) {
    showStartupError(
      "Erreur au démarrage",
      (e.message || "") + "\n\n" + (e.filename || "") + ":" + (e.lineno || "") + "\n\n" + (e.error && e.error.stack ? e.error.stack : "")
    );
  });

  window.addEventListener("unhandledrejection", function (e) {
    var r = e.reason;
    showStartupError(
      "Erreur au chargement du module",
      (r && r.message ? r.message : String(r)) + "\n\n" + (r && r.stack ? r.stack : "")
    );
  });
})();
