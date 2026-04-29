window.addEventListener("load", () => {
  document.querySelector(".page").classList.add("loaded");
});

const menuItems = document.querySelectorAll(".menu-item");

menuItems.forEach((item) => {
  item.addEventListener("mouseenter", () => {
    document.body.classList.add("menu-hover");
  });

  item.addEventListener("mouseleave", () => {
    document.body.classList.remove("menu-hover");
  });
});
