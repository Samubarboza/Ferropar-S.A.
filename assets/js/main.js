(function() {
  "use strict";

  // Función para aplicar clase scrolled al hacer scroll
  function toggleScrolled() {
    const selectBody = document.querySelector('body');
    const selectHeader = document.querySelector('#header');
    if (!selectHeader.classList.contains('scroll-up-sticky') && !selectHeader.classList.contains('sticky-top') && !selectHeader.classList.contains('fixed-top')) return;
    window.scrollY > 100 ? selectBody.classList.add('scrolled') : selectBody.classList.remove('scrolled');
  }

  document.addEventListener('scroll', toggleScrolled);
  window.addEventListener('load', toggleScrolled);

  // Toggle de navegación móvil
  const mobileNavToggleBtn = document.querySelector('.mobile-nav-toggle');

  function mobileNavToogle() {
    document.querySelector('body').classList.toggle('mobile-nav-active');
    mobileNavToggleBtn.classList.toggle('bi-list');
    mobileNavToggleBtn.classList.toggle('bi-x');
  }
  mobileNavToggleBtn.addEventListener('click', mobileNavToogle);

  // Ocultar navegación móvil al hacer clic en enlaces
  document.querySelectorAll('#navmenu a').forEach(navmenu => {
    navmenu.addEventListener('click', () => {
      if (document.querySelector('.mobile-nav-active')) {
        mobileNavToogle();
      }
    });
  });

  // Toggle de dropdowns en navegación móvil
  document.querySelectorAll('.navmenu .toggle-dropdown').forEach(navmenu => {
    navmenu.addEventListener('click', function(e) {
      e.preventDefault();
      this.parentNode.classList.toggle('active');
      this.parentNode.nextElementSibling.classList.toggle('dropdown-active');
      e.stopImmediatePropagation();
    });
  });

  // Preloader
  const preloader = document.querySelector('#preloader');
  if (preloader) {
    window.addEventListener('load', () => {
      preloader.remove();
    });
  }

  // Botón de scroll top
  let scrollTop = document.querySelector('.scroll-top');

  function toggleScrollTop() {
    if (scrollTop) {
      window.scrollY > 100 ? scrollTop.classList.add('active') : scrollTop.classList.remove('active');
    }
  }
  scrollTop.addEventListener('click', (e) => {
    e.preventDefault();
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });

  window.addEventListener('load', toggleScrollTop);
  document.addEventListener('scroll', toggleScrollTop);

  // Animación on scroll (AOS)
  function aosInit() {
    AOS.init({
      duration: 450,
      easing: 'ease-in-out',
      once: true,
      mirror: false
    });
  }
  window.addEventListener('load', aosInit);

  // Inicialización de GLightbox
  const glightbox = GLightbox({
    selector: '.glightbox'
  });

  // Inicialización de Pure Counter
  new PureCounter();

  // Inicialización de Swiper sliders
  function initSwiper() {
    document.querySelectorAll(".init-swiper").forEach(function(swiperElement) {
      let config = JSON.parse(
        swiperElement.querySelector(".swiper-config").innerHTML.trim()
      );

      if (swiperElement.classList.contains("swiper-tab")) {
        initSwiperWithCustomPagination(swiperElement, config);
      } else {
        new Swiper(swiperElement, config);
      }
    });
  }

  window.addEventListener("load", initSwiper);

  // Inicialización de Isotope layout y filters
  document.querySelectorAll('.isotope-layout').forEach(function(isotopeItem) {
    let layout = isotopeItem.getAttribute('data-layout') ?? 'masonry';
    let filter = isotopeItem.getAttribute('data-default-filter') ?? '*';
    let sort = isotopeItem.getAttribute('data-sort') ?? 'original-order';

    let initIsotope;
    imagesLoaded(isotopeItem.querySelector('.isotope-container'), function() {
      initIsotope = new Isotope(isotopeItem.querySelector('.isotope-container'), {
        itemSelector: '.isotope-item',
        layoutMode: layout,
        filter: filter,
        sortBy: sort
      });
    });

    isotopeItem.querySelectorAll('.isotope-filters li').forEach(function(filters) {
      filters.addEventListener('click', function() {
        isotopeItem.querySelector('.isotope-filters .filter-active').classList.remove('filter-active');
        this.classList.add('filter-active');
        initIsotope.arrange({
          filter: this.getAttribute('data-filter')
        });
        if (typeof aosInit === 'function') {
          aosInit();
        }
      }, false);
    });
  });

  // Corrección de posición de scroll para enlaces con hash
  window.addEventListener('load', function(e) {
    if (window.location.hash) {
      if (document.querySelector(window.location.hash)) {
        setTimeout(() => {
          let section = document.querySelector(window.location.hash);
          let scrollMarginTop = getComputedStyle(section).scrollMarginTop;
          window.scrollTo({
            top: section.offsetTop - parseInt(scrollMarginTop),
            behavior: 'smooth'
          });
        }, 100);
      }
    }
  });

  // Scrollspy para navmenu
  let navmenulinks = document.querySelectorAll('.navmenu a');

  function navmenuScrollspy() {
    navmenulinks.forEach(navmenulink => {
      if (!navmenulink.hash) return;
      let section = document.querySelector(navmenulink.hash);
      if (!section) return;
      let position = window.scrollY + 200;
      if (position >= section.offsetTop && position <= (section.offsetTop + section.offsetHeight)) {
        document.querySelectorAll('.navmenu a.active').forEach(link => link.classList.remove('active'));
        navmenulink.classList.add('active');
      } else {
        navmenulink.classList.remove('active');
      }
    })
  }
  window.addEventListener('load', navmenuScrollspy);
  document.addEventListener('scroll', navmenuScrollspy);

})();

// Animación de elementos al aparecer
document.addEventListener("DOMContentLoaded", function() {
  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('show');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.2
  });

  const fadeInElements = document.querySelectorAll('.fade-in-up');
  fadeInElements.forEach(element => {
    observer.observe(element);
  });
});

// Inicialización de GLightbox (duplicado)
document.addEventListener("DOMContentLoaded", function () {
  const lightbox = GLightbox({
      selector: '.glightbox'
  });
});

// Modal para galería de imágenes
document.addEventListener('DOMContentLoaded', function() {
  const modalImages = document.querySelectorAll('.open-modal-img');
  const modal = new bootstrap.Modal(document.getElementById('dynamicImageModal'));
  const modalImage = document.getElementById('modalImage');
  const prevBtn = document.querySelector('.modal-prev');
  const nextBtn = document.querySelector('.modal-next');
  
  let currentIndex = 0;
  const images = Array.from(modalImages).map(img => ({
    src: img.src,
    alt: img.alt
  }));

  modalImages.forEach((img, index) => {
    img.addEventListener('click', () => {
      currentIndex = index;
      updateModalImage();
      modal.show();
    });
  });

  prevBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    currentIndex = (currentIndex - 1 + images.length) % images.length;
    updateModalImage();
  });

  nextBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    currentIndex = (currentIndex + 1) % images.length;
    updateModalImage();
  });

  function updateModalImage() {
    modalImage.src = images[currentIndex].src;
    modalImage.alt = images[currentIndex].alt;
  }

  document.addEventListener('keydown', (e) => {
    if (modal._isShown) {
      if (e.key === 'ArrowLeft') {
        currentIndex = (currentIndex - 1 + images.length) % images.length;
        updateModalImage();
      } else if (e.key === 'ArrowRight') {
        currentIndex = (currentIndex + 1) % images.length;
        updateModalImage();
      }
    }
  });
});

document.addEventListener('DOMContentLoaded', function() {
  // Seleccionar todos los enlaces de servicios
  const serviceLinks = document.querySelectorAll('.services-list a');
  // Seleccionar la imagen de servicio
  const serviceImage = document.getElementById('service-image');
  
  // Añadir evento click a cada enlace
  serviceLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      
      // Remover la clase 'active' de todos los enlaces
      serviceLinks.forEach(l => l.classList.remove('active'));
      
      // Añadir la clase 'active' al enlace clickeado
      this.classList.add('active');
      
      // Cambiar la imagen según el atributo data-image
      const newImageSrc = this.getAttribute('data-image');
      serviceImage.src = newImageSrc;
      serviceImage.alt = this.textContent;
    });
  });
});



// Formulario de contacto
document.addEventListener('DOMContentLoaded', function() {
  const form = document.querySelector('.php-email-form');  // Selecciona el formulario
  const loading = form.querySelector('.loading');  // Selecciona el mensaje de carga
  const errorMessage = form.querySelector('.error-message');  // Selecciona el mensaje de error
  const sentMessage = form.querySelector('.sent-message');  // Selecciona el mensaje de éxito

  // Al enviar el formulario
  form.addEventListener('submit', function(event) {
    event.preventDefault();  // Evita el envío tradicional del formulario

    // Muestra el mensaje de "cargando"
    loading.style.display = 'block';
    errorMessage.style.display = 'none';
    sentMessage.style.display = 'none';

    // Captura los datos del formulario
    const formData = new FormData(form);

    // Crea una solicitud AJAX
    const xhr = new XMLHttpRequest();
    xhr.open('POST', form.action, true);

    // Cuando la solicitud termine
    xhr.onload = function() {
      loading.style.display = 'none';  // Oculta el mensaje de carga

      if (xhr.status === 200) {
        // Respuesta del servidor
        if (xhr.responseText === "success") {
          // Si la respuesta es "success", muestra el mensaje de éxito
          sentMessage.style.display = 'block';
          form.reset();  // Reinicia el formulario
        } else {
          // Si la respuesta no es "success", muestra el mensaje de error
          errorMessage.style.display = 'block';
        }
      } else {
        // Si hubo un error con la solicitud, muestra el mensaje de error
        errorMessage.style.display = 'block';
      }
    };

    // Envia la solicitud AJAX con los datos del formulario
    xhr.send(formData);
  });
});
