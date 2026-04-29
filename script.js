const menuLinks = document.querySelectorAll(".menu");
const joker = document.querySelector(".joker-bg");

menuLinks.forEach((link) => {
  link.addEventListener("click", function (e) {
    e.preventDefault();

    const target = document.querySelector(this.getAttribute("href"));
    target.scrollIntoView({
      behavior: "smooth"
    });
  });

  link.addEventListener("mouseenter", () => {
    joker.classList.add("active");
  });

  link.addEventListener("mouseleave", () => {
    joker.classList.remove("active");
  });
});
