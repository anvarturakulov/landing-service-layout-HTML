document.addEventListener("DOMContentLoaded", function () {
  // кнопка меню бургер 
  let burgerButton = document.getElementById('nav-icon');

  let mainMenu = document.querySelector('.mobileMenu');

  burgerButton.addEventListener('click', () => {
    burgerButton.classList.toggle('open');
    if (burgerButton.classList.contains('open')) {
      mainMenu.classList.add('active');
    } else {
      mainMenu.classList.remove('active');
    }
  });

  mainMenu.addEventListener('click', () => {
    mainMenu.classList.remove('active');
    burgerButton.classList.toggle('open')
  })

  // скрытый инпут против спама формы (это не удалять!!)
  if (document.querySelector('.ncapt')) {
    const input = document.querySelectorAll('.ncapt');
    for (let inp of input) {
      inp.insertAdjacentHTML('afterend', '<input type="hidden" name="ncapt" value="' + document.querySelector('.ncapt').textContent + '">');
    }
  }

  // Отправка форм ajax (это не удалять!!)
  const ajaxSend = async (formData, formUrl) => {
    const fetchResp = await fetch(formUrl, {
      method: 'POST',
      body: formData
    });
    if (!fetchResp.ok) {
      throw new Error(`Ошибка по адресу ${url}, статус ошибки ${fetchResp.status}`);
    }
    return await fetchResp.text();
  };

  const forms = document.querySelectorAll('form.send-form');

  forms.forEach(form => {
    form.addEventListener('submit', function (event) {
      event.preventDefault();

      const formData = new FormData(this);
      const formUrl = this.getAttribute('action');
      const length = this.querySelector('input[type="tel"]').value.length;

      if (length < 17) {
        this.querySelector('input[type="tel"]').focus();
      } else {
        ajaxSend(formData, formUrl)
          .then((data) => {
            var parser = new DOMParser();
            var doc = parser.parseFromString(data, "text/html");
            //form.innerHTML = doc.getElementsByClassName("form-send__message")[0].innerHTML;
            form.innerHTML = '<span class="form-send">...отправляю</span>';
            setTimeout(function () {
              window.location = "/thanks/";
            }, 500);
          })
          .catch((err) => console.error(err));
      }
      return false;
    });
  });

  // Модальные окна
  const buttons = document.querySelectorAll('.trigger[data-modal-trigger]');
  const body = document.querySelector('body');

  for (let button of buttons) {
    modalEvent(button);
  }

  function modalEvent(button) {
    button.addEventListener('click', () => {
      const trigger = button.getAttribute('data-modal-trigger');
      const modal = document.querySelector(`[data-modal=${trigger}]`);
      // console.log(trigger)
      if (trigger == 'trigger-2') {
        modal.querySelector('.input-service-name').value = button.getAttribute('data-service')
      }
      const contentWrapper = modal.querySelector('.content-wrapper');
      const close = modal.querySelector('.close');

      close.addEventListener('click', () => {
        modal.classList.remove('open');
        body.classList.remove('blur');
      });
      modal.addEventListener('click', () => {
        modal.classList.remove('open');
        body.classList.remove('blur');
      });
      contentWrapper.addEventListener('click', (e) => e.stopPropagation());

      modal.classList.toggle('open');
      body.classList.toggle('blur');
    });
  }

  // lazy load background image (при прокрутке к блоку подгружаем картинку)
  var lazyBackgrounds = [].slice.call(document.querySelectorAll(".lazy-background"));

  if ("IntersectionObserver" in window) {
    let lazyBackgroundObserver = new IntersectionObserver(function (entries, observer) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          lazyBackgroundObserver.unobserve(entry.target);
        }
      });
    });

    lazyBackgrounds.forEach(function (lazyBackground) {
      lazyBackgroundObserver.observe(lazyBackground);
    });
  }

  // Маска телефона
  [].forEach.call(document.querySelectorAll('input[type="tel"]'), function (input) {
    var keyCode;
    function mask(event) {
      event.keyCode && (keyCode = event.keyCode);
      var pos = this.selectionStart;
      /*if (pos < 3) event.preventDefault();*/
      if (pos < 3) this.setSelectionRange(3, 3);
      var matrix = "+7 (___) ___ ____",
        i = 0,
        def = matrix.replace(/\D/g, ""),
        val = this.value.replace(/\D/g, ""),
        new_value = matrix.replace(/[_\d]/g, function (a) {
          return i < val.length ? val.charAt(i++) || def.charAt(i) : a
        });
      i = new_value.indexOf("_");
      if ((i == 4 && keyCode == 56) || (i == 4 && keyCode == 104)) {
        event.preventDefault();
      }
      if (i != -1) {
        i < 5 && (i = 3);
        new_value = new_value.slice(0, i)
      }
      var reg = matrix.substr(0, this.value.length).replace(/_+/g,
        function (a) {
          return "\\d{1," + a.length + "}"
        }).replace(/[+()]/g, "\\$&");
      reg = new RegExp("^" + reg + "$");
      if (!reg.test(this.value) || this.value.length < 5 || keyCode > 47 && keyCode < 58) this.value = new_value;
      if (event.type == "blur" && this.value.length < 5) this.value = ""
    }
    input.addEventListener("input", mask, false);
    input.addEventListener("focus", mask, false);
    input.addEventListener("blur", mask, false);
    input.addEventListener("keydown", mask, false)
  });
  // вопрос-ответы

  const questions = document.querySelectorAll('.faq');
  questions.forEach((question) => {
    const opener = question.querySelector('.faq-title')
    opener.addEventListener('click', () => {
      [...questions].filter(q => q !== question).forEach(q => q.classList.remove('opened'))
      question.classList.toggle('opened')
    })
  })

  // добавим карту позже по скролу (src оставить, я потом поменяю)
  if (document.getElementById('yamap')) {
    let ok = false;
    window.addEventListener('scroll', function () {
      if (ok === false) {
        ok = true;
        setTimeout(() => {
          let script = document.createElement('script');
          script.src = 'https://api-maps.yandex.ru/services/constructor/1.0/js/?um=constructor%3A47e6049e656568366a693434fb12f0e962bb403d3710817b3253c77d392e2778&amp;width=100%25&amp;height=500&amp;lang=ru_RU&amp;scroll=false';
          document.getElementById('yamap').replaceWith(script);
        }, 500)
      }
    });

    // блок с контактами на карте выравниваем под .container, т.к. сама карта width=100%
    if (window.matchMedia('screen and (min-width: 768px)').matches) {
      // let leftOffset = document.querySelector("footer .container").getBoundingClientRect().left;
      // document.querySelector(".contacts").style.left = leftOffset + 15 + 'px';
    }

  }

  let splide = new Splide('.splide', {
    type: 'loop',
    perPage: 5,
    breakpoints: {
      420: {
        perPage: 1,
      },
      576: {
        perPage: 2,
      },
      768: {
        perPage: 3,
      },
      992: {
        perPage: 4,
      }
    }
  });

  splide.mount();

  document.querySelectorAll("a[href^='#']").forEach(link => {
    link.addEventListener("click", function (e) {
      e.preventDefault();
      let href = this.getAttribute("href").substring(1);
      const scrollTarget = document.getElementById(href);
      const topOffset = document.querySelector(".nav-bar-box").offsetHeight;
      // const topOffset = 10; // если не нужен отступ сверху
      const elementPosition = scrollTarget.getBoundingClientRect().top;
      const offsetPosition = elementPosition - topOffset;

      window.scrollBy({
        top: offsetPosition,
        behavior: "smooth"
      });
    });
  });

  window.addEventListener('scroll', () => {
    let navBarBox = document.querySelector('.nav-bar-box');
    let navBarBackground = document.querySelector('.nav-bar-background')
    if (document.body.scrollTop > 50 || document.documentElement.scrollTop > 50) {
      navBarBox.classList.add('nav-bar-fixed')
      if (document.documentElement.clientWidth < 769) {
        navBarBackground.classList.add('nav-bar-background-mobile')
      }
      navBarBackground.classList.add('display-block')

    } else {
      navBarBox.classList.remove('nav-bar-fixed')
      navBarBackground.classList.remove('display-block')
      navBarBackground.classList.remove('nav-bar-background-mobile')
    }
  })

});
