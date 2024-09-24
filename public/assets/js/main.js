let sortableImportance;

let CAREERS = [];
let TRAITS = [];
let IMPORTANCE = [];
let RATINGS = []; 

let DEFAULT_CAREERS = 10;
let DEFAULT_TRAITS = 10;
let Current_Career = 1;
let Current_Trait = 1;

let init = false;

(function() {
  "use strict";


  /**
   * Easy selector helper function
   */
  const select = (el, all = false) => {
    el = el.trim()
    if (all) {
      return [...document.querySelectorAll(el)]
    } else {
      return document.querySelector(el)
    }
  }

  /**
   * Easy event listener function
   */
  const on = (type, el, listener, all = false) => {
    let selectEl = select(el, all)
    if (selectEl) {
      if (all) {
        selectEl.forEach(e => e.addEventListener(type, listener))
      } else {
        selectEl.addEventListener(type, listener)
      }
    }
  }

  /**
   * Easy on scroll event listener 
   */
  const onscroll = (el, listener) => {
    el.addEventListener('scroll', listener)
  }

  /**
   * Navbar links active state on scroll
   */
  let navbarlinks = select('#navbar .scrollto', true)
  const navbarlinksActive = () => {
    let position = window.scrollY + 200
    navbarlinks.forEach(navbarlink => {
      if (!navbarlink.hash) return
      let section = select(navbarlink.hash)
      if (!section) return
      if (position >= section.offsetTop && position <= (section.offsetTop + section.offsetHeight)) {
        navbarlink.classList.add('active')
      } else {
        navbarlink.classList.remove('active')
      }
    })
  }
  window.addEventListener('load', navbarlinksActive)
  onscroll(document, navbarlinksActive)

  /**
   * Scrolls to an element with header offset
   */
  const scrollto = (el) => {
    let header = select('#header')
    let offset = header.offsetHeight

    let elementPos = select(el).offsetTop
    window.scrollTo({
      top: elementPos - offset,
      behavior: 'smooth'
    })
  }

  /**
   * Toggle .header-scrolled class to #header when page is scrolled
   */
  let selectHeader = select('#header')
  if (selectHeader) {
    const headerScrolled = () => {
      if (window.scrollY > 100) {
        selectHeader.classList.add('header-scrolled')
      } else {
        selectHeader.classList.remove('header-scrolled')
      }
    }
    window.addEventListener('load', headerScrolled)
    onscroll(document, headerScrolled)
  }

  /**
   * Back to top button
   */
  let backtotop = select('.back-to-top')
  if (backtotop) {
    const toggleBacktotop = () => {
      if (window.scrollY > 100) {
        backtotop.classList.add('active')
      } else {
        backtotop.classList.remove('active')
      }
    }
    window.addEventListener('load', toggleBacktotop)
    onscroll(document, toggleBacktotop)
  }

  /**
   * Mobile nav toggle
   */
  on('click', '.mobile-nav-toggle', function(e) {
    select('#navbar').classList.toggle('navbar-mobile')
    this.classList.toggle('bi-list')
    this.classList.toggle('bi-x')
  })

  /**
   * Mobile nav dropdowns activate
   */
  on('click', '.navbar .dropdown > a', function(e) {
    if (select('#navbar').classList.contains('navbar-mobile')) {
      e.preventDefault()
      this.nextElementSibling.classList.toggle('dropdown-active')
    }
  }, true)

  /**
   * Scrool with ofset on links with a class name .scrollto
   */
  on('click', '.scrollto', function(e) {
    if (select(this.hash)) {
      e.preventDefault()

      let navbar = select('#navbar')
      if (navbar.classList.contains('navbar-mobile')) {
        navbar.classList.remove('navbar-mobile')
        let navbarToggle = select('.mobile-nav-toggle')
        navbarToggle.classList.toggle('bi-list')
        navbarToggle.classList.toggle('bi-x')
      }
      scrollto(this.hash)
    }
  }, true)

  /**
   * Scroll with ofset on page load with hash links in the url
   */
  window.addEventListener('load', () => {
    if (window.location.hash) {
      if (select(window.location.hash)) {
        scrollto(window.location.hash)
      }
    }
  });

  /**
   * Preloader
   */
  let preloader = select('#preloader');
  if (preloader) {
    window.addEventListener('load', () => {
      preloader.remove()
    });
  }

  /**
   * Initiate glightbox 
   */
  const glightbox = GLightbox({
    selector: '.glightbox'
  });

  /**
   * Testimonials slider
   */
  new Swiper('.testimonials-slider', {
    speed: 600,
    loop: true,
    autoplay: {
      delay: 5000,
      disableOnInteraction: false
    },
    slidesPerView: 'auto',
    pagination: {
      el: '.swiper-pagination',
      type: 'bullets',
      clickable: true
    },
    breakpoints: {
      320: {
        slidesPerView: 1,
        spaceBetween: 20
      },

      1200: {
        slidesPerView: 3,
        spaceBetween: 20
      }
    }
  });


  window.addEventListener('load', () => {
    let portfolioContainer = select('.portfolio-container');
    if (portfolioContainer) {
      let portfolioIsotope = new Isotope(portfolioContainer, {
        itemSelector: '.portfolio-item'
      });

      let portfolioFilters = select('#portfolio-flters li', true);

      on('click', '#portfolio-flters li', function(e) {
        e.preventDefault();
        portfolioFilters.forEach(function(el) {
          el.classList.remove('filter-active');
        });
        this.classList.add('filter-active');

        portfolioIsotope.arrange({
          filter: this.getAttribute('data-filter')
        });
        portfolioIsotope.on('arrangeComplete', function() {
          AOS.refresh()
        });
      }, true);
    }

  });

  /**
   * Animation on scroll
   */
  window.addEventListener('load', () => {
    AOS.init({
      duration: 1000,
      easing: 'ease-in-out',
      once: true,
      mirror: false
    })
  });

  /**
   * Initiate Pure Counter 
   */
  new PureCounter();

  

})()

document.addEventListener('DOMContentLoaded', function() {
  // calculateAndDisplayRatings(RATINGS, IMPORTANCE, CAREERS);
  document.querySelector('.btn-next-career').addEventListener('click', function(event) {
      event.preventDefault();
      validateForm(collectCareerData, '.needs-validation-career');
  });

  document.querySelector('.btn-next-trait').addEventListener('click', function(event) {
    event.preventDefault();
    validateForm(collectTraitData, '.needs-validation-trait');
  });

  document.querySelector('.btn-next-importance').addEventListener('click', function(event) {
    event.preventDefault();
    // validateForm(collectImptData, '.needs-validation-impt');
    extractRankingOrder();
  });

  document.querySelector('.btn-get-started').addEventListener('click', function(event) {
    if (!init) {
      init = true;
      populateCareersForm();
      document.getElementById('team').style.display = 'none';
      document.getElementById('faq').style.display = 'block';
      document.getElementById('career_qns').style.display = 'block';
      window.scrollTo({
        top: document.getElementById('faq').offsetTop,
        behavior: 'smooth'
      });
    } else {
      window.scrollTo({
        top: document.getElementById('faq').offsetTop,
        behavior: 'smooth'
      });
    }
  });

  document.getElementById('add-career').addEventListener('click', addCareerInput);
  document.getElementById('remove-career').addEventListener('click', removeCareerInput);

  document.getElementById('add-trait').addEventListener('click', addTraitInput);
  document.getElementById('remove-trait').addEventListener('click', removeTraitInput);

  populateTraitsForm();
});

function addCareerInput() {
  Current_Career++;
  const careersForm = document.getElementById('careers-form');
  const careerTemplate = careersForm.querySelector('.form-group');
  const careerGroup = careerTemplate.cloneNode(true);
  const careerLabel = careerGroup.querySelector('label');
  const careerInput = careerGroup.querySelector('input');

  careerLabel.setAttribute('for', `career${Current_Career}`);
  careerLabel.textContent = `Career ${Current_Career}:`;

  careerInput.setAttribute('id', `career${Current_Career}`);
  careerInput.setAttribute('name', `career${Current_Career}`);
  careerInput.value = '';

  careersForm.appendChild(careerGroup);
  
}

function removeCareerInput() {
  if (Current_Career > 3) {
    const careersForm = document.getElementById('careers-form');
    careersForm.removeChild(careersForm.lastChild);
    Current_Career--;
    window.scrollTo(0, document.body.scrollHeight);
  } else {
    alert('You need to have at least 3 careers!');
  }
}

function populateCareersForm() {

  for (let i = 2; i <= DEFAULT_CAREERS; i++) {
    addCareerInput();
  }

}

function addTraitInput() {
  Current_Trait++;
  const traitsForm = document.getElementById('traits-form');
  const traitTemplate = traitsForm.querySelector('.form-group');
  const traitGroup = traitTemplate.cloneNode(true);
  const traitLabel = traitGroup.querySelector('label[for^="trait"]');
  const traitInput = traitGroup.querySelector('input[id^="trait"]');
  traitLabel.setAttribute('for', `trait${Current_Trait}`);
  traitLabel.textContent = `Trait ${Current_Trait}:`;

  traitInput.setAttribute('id', `trait${Current_Trait}`);
  traitInput.setAttribute('name', `trait${Current_Trait}`);
  traitInput.value = '';

  traitsForm.appendChild(traitGroup);

}

function removeTraitInput() {
  if (Current_Trait > 3) {
    const traitsForm = document.getElementById('traits-form');
    traitsForm.removeChild(traitsForm.lastChild);
    Current_Trait--;
    window.scrollTo(0, document.body.scrollHeight);
  } else {
    alert('You need to have at least 3 traits!');
  }
}

function populateTraitsForm() {


  for (let i = 2; i <= DEFAULT_TRAITS; i++) {
    addTraitInput();
  }
}

function validateForm(callback, form_name) {
  var forms = document.querySelectorAll(form_name);
  Array.prototype.slice.call(forms)
      .forEach(function (form) {
          form.addEventListener('submit', function (event) {
              if (!form.checkValidity()) {
                  event.preventDefault();
                  event.stopPropagation();
              }

              form.classList.add('was-validated');

              if (form.checkValidity()) {
                  callback();
              }
          }, false);
      });

  forms[0].dispatchEvent(new Event('submit'));
}

function validateCareerForm(callback, form_name, careerIndex) {
  var forms = document.querySelectorAll(form_name);
  Array.prototype.slice.call(forms)
      .forEach(function (form) {
          form.addEventListener('submit', function (event) {
              if (!form.checkValidity()) {
                  event.preventDefault();
                  event.stopPropagation();
              }

              form.classList.add('was-validated');

              if (form.checkValidity()) {
                  callback(careerIndex);
              }
          }, false);
      });

  forms[0].dispatchEvent(new Event('submit'));
}

function collectCareerData() {
  let isValid = true;
  CAREERS = [];
  // Collect careers (elements)
  for (let i = 1; i <= Current_Career; i++) {
      const career = document.getElementById(`career${i}`).value.trim();
      if (career === '') {
          isValid = false;
          break;
      }
      CAREERS.push(career);
  }

  if (isValid) {
      // Log the collected data
      // console.log("Careers:", CAREERS);
      document.getElementById('career_qns').style.display = 'none';
      document.getElementById('trait_qns').style.display = 'block';
  }
}

function generateImportanceGrid(traits) {
  const importanceBars = document.getElementById('importance-bars');
  importanceBars.innerHTML = '';

  traits.forEach((trait, index) => {
    const traitBar = document.createElement('div');
    traitBar.className = 'trait-bar';
    traitBar.setAttribute('data-id', trait);
    traitBar.innerHTML = `
      <div class="card"><div class="card-body"><h3 class="card-title text-center">${trait}</h3></div></div>
    `;
    importanceBars.appendChild(traitBar);
  });

  // Initialize the sortable functionality
  sortableImportance = new Sortable(importanceBars, {
    animation: 150,
    ghostClass: 'blue-background-class',
  });
}

function extractRankingOrder() {
  IMPORTANCE = [];

  const order = sortableImportance.toArray();
  // console.log('Current order:', order);

  const traitOrderMap = new Map();
  order.forEach((trait, index) => {
    traitOrderMap.set(trait, order.length - 1 - index);
  });

  TRAITS.forEach(trait => {
    const importanceValue = traitOrderMap.get(trait);
    IMPORTANCE.push(parseInt(importanceValue));
  });

  // console.log("Importance:", IMPORTANCE);

  generateCareerRatings(CAREERS, TRAITS);
  document.getElementById('trait_impt').style.display = 'none';
  document.getElementById('career_trait_1').style.display = 'block';
}

function collectTraitData() {
  let isValid = true;
  TRAITS = [];
  for (let i = 1; i <= Current_Trait; i++) {
      const career = document.getElementById(`trait${i}`).value.trim();
      if (career === '') {
          isValid = false;
          break;
      }
      TRAITS.push(career);
  }

  if (isValid) {
      // Log the collected data
      // console.log("Traits:", TRAITS);
      generateImportanceGrid(TRAITS);
      document.getElementById('trait_qns').style.display = 'none';
      document.getElementById('trait_impt').style.display = 'block';
  }
}


function generateCareerRatings(careers, traits) {
  const faq = document.getElementById('faq');

  careers.forEach((career, careerIndex) => {
      const careerContainer = document.createElement('div');
      careerContainer.id = `career_trait_${careerIndex + 1}`;
      careerContainer.className = `container`;
      careerContainer.setAttribute('data-aos', 'fade-up');
      careerContainer.style.display = 'none';

      const sectionTitle = document.createElement('div');
      sectionTitle.className = 'section-title';
      sectionTitle.innerHTML = `
          <h2>Career Ratings</h2>
          <p>Rate each career based on the extent it satisfies the trait</p>
      `;
      careerContainer.appendChild(sectionTitle);

      const faqList = document.createElement('div');
      faqList.className = 'faq-list';
      const ul = document.createElement('ul');
      const li = document.createElement('li');
      li.setAttribute('data-aos', 'fade-up');

      const progressBar = document.createElement('div');
      progressBar.className = 'progress';
      progressBar.setAttribute('role', 'progressbar');
      progressBar.setAttribute('aria-valuemin', '0');
      progressBar.setAttribute('aria-valuemax', '100');

      const progressBarInner = document.createElement('div');
      progressBarInner.className = 'progress-bar bg-success';
      var percentage = 30 + (careerIndex + 1) * 7;
      progressBarInner.style.width = `${percentage}%`;
      progressBarInner.textContent = `${percentage}%`;

      progressBar.appendChild(progressBarInner);
      li.appendChild(progressBar);

      const icon = document.createElement('i');
      icon.className = 'bx bx-help-circle icon-help';
      li.appendChild(icon);
      const careerLink = document.createElement('a');
      careerLink.setAttribute('data-bs-toggle', 'collapse');
      careerLink.className = 'collapse';
      careerLink.setAttribute('data-bs-target', `#faq-list-${careerIndex + 1}`);
      careerLink.id = `career_name_${careerIndex + 1}`;
      careerLink.textContent = career;
      li.appendChild(careerLink);

      const supportText = document.createElement('p');
      supportText.textContent = 'Rate the jobs based on your qualities! Think about the job listed, does this job have each of the qualities? 1 = not true, 5 = very true.';
      li.appendChild(supportText);

      const form = document.createElement('form');
      form.className = `needs-validation-rating-${careerIndex + 1}`;
      form.noValidate = true;
      
      const headerRow = document.createElement('div');
      headerRow.className = 'd-flex align-items-center row';
      headerRow.innerHTML = `
      <div class="col-3"></div>
      <div class="col-8 d-flex justify-content-between">
                <div class="text-center" style="padding-right: 10px">1</div>
                <div class="text-center" style="padding-right: 10px">2</div>
                <div class="text-center" style="padding-right: 10px">3</div>
                <div class="text-center" style="padding-right: 10px">4</div>
                <div class="text-center" style="padding-right: 10px">5</div>
            </div>
      
      `;
      form.appendChild(headerRow);
    
      traits.forEach((trait, index) => {
          const traitRow = document.createElement('div');
          traitRow.className = 'd-flex align-items-center row mb-3';
    
          const traitLabel = document.createElement('div');
          traitLabel.className = 'col-3 text-center';
          traitLabel.textContent = trait;
          traitRow.appendChild(traitLabel);
    
          const radioGroup = document.createElement('div');
          radioGroup.className = 'd-flex justify-content-between col-8';
    
          for (let i = 0; i < 5; i++) {
              const radioWrapper = document.createElement('div');
              radioWrapper.className = 'form-check form-check-inline';
              if (i === 4) {
                radioWrapper.style.margin = '0px';
              }
              const radioInput = document.createElement('input');
              radioInput.type = 'radio';
              radioInput.name = `rating${careerIndex + 1}-${index + 1}`;
              radioInput.value = i;
              radioInput.className = 'form-check-input';
              radioInput.required = true;
              radioWrapper.appendChild(radioInput);
              radioGroup.appendChild(radioWrapper);
          }
    
          traitRow.appendChild(radioGroup);
          form.appendChild(traitRow);
      });


      const buttonWrapper = document.createElement('div');
      buttonWrapper.className = 'd-flex justify-content-center';
      const nextButton = document.createElement('button');
      nextButton.type = 'button';
      nextButton.className = `btn btn-special btn-next-rating-${careerIndex + 1}`;
      nextButton.textContent = 'Next';
      buttonWrapper.appendChild(nextButton);
      form.appendChild(buttonWrapper);
      li.appendChild(form);
      ul.appendChild(li);
      

      faqList.appendChild(ul);
      careerContainer.appendChild(faqList);
      faq.appendChild(careerContainer);

      document.querySelector(`.btn-next-rating-${careerIndex + 1}`).addEventListener('click', function(event) {
        event.preventDefault();
        validateCareerForm(collectRatingData, `.needs-validation-rating-${careerIndex + 1}`, careerIndex + 1);
      });
  
  });
}



function collectRatingData(careerIndex) {
  // console.log("Career Index:", careerIndex);
  if (RATINGS.length == parseInt(careerIndex) * TRAITS.length) {
    return;
  };

  for (let i = 1; i <= TRAITS.length; i++) {
      const selectedValue = document.querySelector(`input[name="rating${careerIndex}-${i}"]:checked`).value;
      RATINGS.push(selectedValue);
  }
  // console.log("Ratings:", RATINGS);

  if (RATINGS.length == CAREERS.length * TRAITS.length) {
      calculateAndDisplayRatings(RATINGS, IMPORTANCE, CAREERS);
  } else {
      document.getElementById(`career_trait_${careerIndex}`).style.display = 'none';
      document.getElementById(`career_trait_${careerIndex + 1}`).style.display = 'block';
  }
}

function calculateAndDisplayRatings(ratings, importance, careers) {
  const weightedScores = [];
  const unweightedScores = [];

  // console.log("Ratings:", ratings);
  // console.log("Importance:", importance);
  // console.log("Careers:", careers);

  for (let i = 0; i < careers.length; i++) {
      const careerRatings = ratings.slice(i * TRAITS.length, (i + 1) * TRAITS.length);
      const weightedScore = careerRatings.reduce((sum, rating, index) => sum + parseInt(rating) * importance[index], 0);
      const unweightedScore = careerRatings.reduce((sum, rating) => sum + parseInt(rating), 0);

      weightedScores.push({ career: careers[i], score: weightedScore });
      unweightedScores.push({ career: careers[i], score: unweightedScore });
  }

  weightedScores.sort((a, b) => b.score - a.score);
  unweightedScores.sort((a, b) => b.score - a.score);

  const weightedCareersDiv = document.getElementById('weighted-table');
  const unweightedCareersDiv = document.getElementById('unweighted-table');

  weightedCareersDiv.innerHTML = '';
  unweightedCareersDiv.innerHTML = '';

  weightedScores.forEach((item, index) => {
      // const careerDiv = document.createElement('div');
      // careerDiv.textContent = `${item.career}: ${item.score}`;
      // weightedCareersDiv.appendChild(careerDiv);
      const careerRow = document.createElement('tr');
      const careerIndex = document.createElement('th');
      careerIndex.scope = 'row';
      careerIndex.textContent = index + 1;
      careerRow.appendChild(careerIndex);
      const careerName = document.createElement('td');
      careerName.textContent = item.career;
      careerRow.appendChild(careerName);
      const careerScore = document.createElement('td');
      careerScore.textContent = item.score;
      careerRow.appendChild(careerScore);
      weightedCareersDiv.appendChild(careerRow);
  });

  unweightedScores.forEach((item, index) => {
      // const careerDiv = document.createElement('div');
      // careerDiv.textContent = `${item.career}: ${item.score}`;
      // unweightedCareersDiv.appendChild(careerDiv);
      const careerRow = document.createElement('tr');
      const careerIndex = document.createElement('th');
      careerIndex.scope = 'row';
      careerIndex.textContent = index + 1;
      careerRow.appendChild(careerIndex);
      const careerName = document.createElement('td');
      careerName.textContent = item.career;
      careerRow.appendChild(careerName);
      const careerScore = document.createElement('td');
      careerScore.textContent = item.score;
      careerRow.appendChild(careerScore);
      unweightedCareersDiv.appendChild(careerRow);
  });

  document.getElementById(`career_trait_${Current_Trait}`).style.display = 'none';
  document.getElementById('result').style.display = 'block';
}