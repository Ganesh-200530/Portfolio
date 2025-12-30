export const observeReveals = () => {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
      }
    });
  }, { threshold: 0.1 });

  const elements = document.querySelectorAll('.reveal');
  elements.forEach((el) => observer.observe(el));
};
