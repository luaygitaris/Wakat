document.addEventListener("DOMContentLoaded", function () {
  function switchPage(parentId, subId) {
    document.querySelectorAll(".content").forEach((content) => {
      content.style.display = "none";
    });

    const pageToShow = document.getElementById(`${parentId}-${subId}-aaa`);
    if (pageToShow) {
      pageToShow.style.display = "block";
    }
  }

  function handleMenuClick(menuItem, parentId, subId) {
    // Hapus semua active class
    document.querySelectorAll(".side-menu").forEach((menu) => {
      menu.classList.remove("side-menu--active");
    });

    // Tambahkan active class pada menu yang diklik
    menuItem.classList.add("side-menu--active");

    // Tentukan URL baru
    const newUrl = subId === "dashboard" ? "/" : `/${parentId}/${subId}`;
    history.pushState(null, "", newUrl);

    // Tampilkan halaman sesuai ID
    switchPage(parentId, subId);
  }

  function setupMenuListeners() {
    const subMenus = document.querySelectorAll("li[data-page] > a");

    subMenus.forEach((link) => {
      link.addEventListener("click", function (e) {
        e.preventDefault();

        const subLi = this.closest("li[data-page]");
        const subId = subLi.getAttribute("data-page");

        let parentLi = subLi.closest("ul").closest("li");
        let parentId = "dashboard"; // default fallback

        if (parentLi && parentLi.querySelector("a")) {
          const parentLink = parentLi.querySelector("a");
          const idParts = parentLink.id ? parentLink.id.split("-") : [];
          if (idParts.length > 0) {
            parentId = idParts[0];
          }
        }

        handleMenuClick(this, parentId, subId);
      });
    });

    // Jika buka halaman langsung dengan path tertentu
    const pathParts = window.location.pathname.split("/").filter(Boolean);
    if (pathParts.length === 2) {
      switchPage(pathParts[0], pathParts[1]);
    } else {
      // Default ke dashboard-dashboard
      switchPage("dashboard", "dashboard");
    }
  }

  setupMenuListeners();
});

document.addEventListener("DOMContentLoaded", function () {
  const toggleMenu = (menuLink) => {
    const parentLi = menuLink.closest("li");
    const submenu = parentLi.querySelector("ul");
    const icon = menuLink.querySelector(".side-menu__sub-icon");

    if (submenu) {
      submenu.classList.toggle("side-menu__sub-open");
    }

    if (icon) {
      icon.classList.toggle("rotate-180");
    }
  };

  // Ambil semua menu yang punya submenu
  const menuLinks = document.querySelectorAll(".side-nav > ul > li > a");

  menuLinks.forEach((link) => {
    link.addEventListener("click", function (e) {
      e.preventDefault(); // Hindari href="javascript:;"
      toggleMenu(this);
    });
  });
});

document.addEventListener("DOMContentLoaded", function () {
  const mobileMenu = document.querySelector(".mobile-menu");
  const openToggler = document.querySelector(".mobile-menu-bar .mobile-menu-toggler");
  const closeToggler = document.querySelector(".scrollable .mobile-menu-toggler");

  if (openToggler && mobileMenu) {
    openToggler.addEventListener("click", function (e) {
      e.preventDefault();
      mobileMenu.classList.add("mobile-menu--active");
    });
  }

  if (closeToggler && mobileMenu) {
    closeToggler.addEventListener("click", function (e) {
      e.preventDefault();
      mobileMenu.classList.remove("mobile-menu--active");
    });
  }

  const menuLinks = mobileMenu.querySelectorAll("a");

  menuLinks.forEach((link) => {
    link.addEventListener("click", function (e) {
      const parentLi = this.closest("li");
      const submenu = parentLi?.querySelector("ul");

      // Jika menu utama (punya submenu), hanya toggle dropdown, jangan tutup mobile menu
      if (submenu) {
        e.preventDefault();
        submenu.classList.toggle("menu__sub-open");
        const icon = this.querySelector(".menu__sub-icon");
        if (icon) icon.classList.toggle("rotate-180");
        return;
      }

      // Jika submenu (tidak punya submenu lagi), lakukan navigasi dan tutup mobile menu
      e.preventDefault();
      let parentId = "";
      let subId = "";
      const subTitle = this.querySelector(".menu__title")?.textContent.trim().toLowerCase() || "";
      if (["home", "dashboard", "waris", "dalil", "hitung", "riwayat", "zakat"].includes(subTitle)) {
        subId = subTitle === "home" ? "dashboard" : subTitle;
      }
      const parentTitle = this.closest("ul")?.closest("li")?.querySelector("a .menu__title")?.textContent.trim().toLowerCase() || "";
      if (parentTitle.includes("dashboard")) parentId = "dashboard";
      else if (parentTitle.includes("waris")) parentId = "waris";
      else if (parentTitle.includes("zakat")) parentId = "zakat";
      if (!parentId) parentId = subId;
      if (parentId && subId) {
        document.querySelectorAll(".content").forEach((content) => {
          content.style.display = "none";
        });
        const pageToShow = document.getElementById(`${parentId}-${subId}-aaa`);
        if (pageToShow) {
          pageToShow.style.display = "block";
        }
        const newUrl = subId === "dashboard" ? "/" : `/${parentId}/${subId}`;
        history.pushState(null, "", newUrl);
        mobileMenu.classList.remove("mobile-menu--active"); // Tutup hanya jika submenu
      }
    });
  });
});


