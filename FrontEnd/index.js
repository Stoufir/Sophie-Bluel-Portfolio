/* Variables */

const url = "http://localhost:5678/";
const gallery = document.querySelector(".gallery");
const filters = document.querySelector(".filters");
const loginLink = document.querySelector('a[href="Login.html"]');
const modifyButton = document.querySelector(".modifyButton");
const filterButtons = document.querySelectorAll (".filters button")
let activeFilterButton = 0;

/* Récupération des travaux */

async function getWorks() {
  const response = await fetch(url + "api/works");
  return await response.json();
}

/* Affichage des travaux dans le DOM */

function cleanWorksGallery() {
  gallery.innerHTML = "";
}

async function displayGalleryWorks() {
  const arrayWorks = await getWorks();
  if (!arrayWorks) {
    console.error('Erreur lors de la récupération des travaux.');
    return;
  }
  cleanWorksGallery();
  arrayWorks.forEach((work) => {
    if (activeFilterButton === 0 || work.categoryId === activeFilterButton) {
      createWork(work);

    }
  });
}

displayGalleryWorks();

/* Créer un travail */

function createWork(work) {
  const figure = document.createElement("figure");
  const img = document.createElement("img");
  const figcaption = document.createElement("figcaption");

  img.src = work.imageUrl;
  img.alt = work.title;
  figcaption.textContent = work.title;

  figure.appendChild(img); 
  figure.appendChild(figcaption);
  gallery.appendChild(figure);
}


/*****  Affichage des boutons par catégorie *****/

/* Récupération des catégories */

async function getCategories() {
  const response = await fetch(url + "api/categories");
  return await response.json();
}

/* Creation des boutons */

async function displayFilters() {
  const AllBtn = document.createElement("button");
  AllBtn.textContent = "Tous";
  AllBtn.id = "0";
  AllBtn.classList.add("active-button");
  filters.appendChild(AllBtn);
  const categories = await getCategories();
  categories.forEach((category) => {
    const btn = document.createElement("button");
    btn.textContent = category.name;
    btn.id = category.id;
    filters.appendChild(btn);
  });
}

displayFilters();

/* Filtre par catégorie */

async function filterByCategory() {
  const works = await getWorks();
  const buttons = document.querySelectorAll(".filters button");
  buttons.forEach((button) => {
    button.addEventListener("click", async (e) => {
      let buttonId = e.target.id;
      buttons.forEach((btn) => {
        btn.classList.remove("active-button");
      });
      e.target.classList.add("active-button");
      if (buttonId !== "0") {
        activeFilterButton = parseInt(buttonId) ;
        console.log(activeFilterButton);
      } else {
        activeFilterButton = 0;
      }
      await displayGalleryWorks();
    });
  });
}

filterByCategory();



// Fonction pour vérifier si l'utilisateur est authentifié */

function isAuthenticated() {
    return localStorage.getItem('authentifie') === 'true' || localStorage.getItem('authentifie') === 'false';
}

/* Fonction pour déconnecter l'utilisateur */

async function disconnection(event) {
  localStorage.removeItem("authentifie");
  localStorage.removeItem("token");
  loginLink.textContent ="login";
  loginLink.removeEventListener("click", disconnection);
}

// Vérifier si l'utilisateur est authentifié lors du chargement de la page
window.addEventListener('load', function() {
    if (isAuthenticated()) {
        loginLink.textContent= "logout";
        loginLink.addEventListener("click", disconnection)
        modifyButton.style.display = "flex"
    } else {
        loginLink.textContent= "login";
        modifyButton.style.display = "none"
    }
});

window.addEventListener('beforeunload', function(event) {
  localStorage.removeItem('token');
  localStorage.removeItem('authentifie');
});
