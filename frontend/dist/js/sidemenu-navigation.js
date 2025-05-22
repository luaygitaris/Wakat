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
    document.querySelectorAll(".side-menu").forEach((menu) => {
      menu.classList.remove("side-menu--active");
    });

    menuItem.classList.add("side-menu--active");

    const newUrl = `${parentId}/${subId}`;
    history.pushState(null, "", newUrl);

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



document.addEventListener('DOMContentLoaded', function () {
  const toggleMenu = (menuLink) => {
    const parentLi = menuLink.closest('li');
    const submenu = parentLi.querySelector('ul');
    const icon = menuLink.querySelector('.side-menu__sub-icon');

    if (submenu) {
      submenu.classList.toggle('side-menu__sub-open');
    }

    if (icon) {
      icon.classList.toggle('rotate-180');
    }
  };

  // Ambil semua menu yang punya submenu
  const menuLinks = document.querySelectorAll('.side-nav > ul > li > a');

  menuLinks.forEach(link => {
    link.addEventListener('click', function (e) {
      e.preventDefault(); // Hindari href="javascript:;"
      toggleMenu(this);
    });
  });
});