(function () {
  const saved = localStorage.getItem("canisTheme") || "light";
  document.documentElement.setAttribute("data-theme", saved);

  document.addEventListener("DOMContentLoaded", () => {
    const toggle = document.getElementById("themeToggle");
    if (toggle) {
      toggle.addEventListener("click", () => {
        const current = document.documentElement.getAttribute("data-theme");
        const next = current === "dark" ? "light" : "dark";
        document.documentElement.setAttribute("data-theme", next);
        localStorage.setItem("canisTheme", next);
      });
    }

    const accountBtn = document.getElementById("accountBtn");
    const accountDropdown = document.getElementById("accountDropdown");
    if (accountBtn && accountDropdown) {
      accountBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        accountDropdown.classList.toggle("open");
      });
      document.addEventListener("click", () => {
        accountDropdown.classList.remove("open");
      });
    }
  });
})();