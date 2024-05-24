/* Variables */

const url = "http://localhost:5678/";
const gallery = document.querySelector(".gallery");
const filters = document.querySelector(".filters");
const loginLink = document.querySelector('a[href="Login.html"]');
const modifyButton = document.querySelector(".modifyButton");
const filterButtons = document.querySelectorAll(".filters button");
let activeFilterButton = 0;

/*****  Affichage des travaux dans la galerie *****/

/* Récupération des travaux */

async function getWorks() {
  const response = await fetch(url + "api/works");
  return await response.json();
}

/* Nettoyer de la galerie */

function cleanWorksGallery() {
  gallery.innerHTML = "";
}
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

/* Afficher les travaux dans le DOM */

async function displayGalleryWorks() {
  const arrayWorks = await getWorks();
  if (!arrayWorks) {
    console.error("Erreur lors de la récupération des travaux.");
    return;
  }
  cleanWorksGallery();
  arrayWorks.forEach((work) => {
    if (activeFilterButton === 0 || work.categoryId === activeFilterButton) {
      createWork(work);
    }
  });
}

/*****  Affichage des boutons par catégorie *****/

/* Récupérer les catégories */

async function getCategories() {
  const response = await fetch(url + "api/categories");
  return await response.json();
}

/* Créer les boutons de filtre et ajout des écouteurs d'événements */
async function setupFilters() {
  /* Bouton "Tous" */
  const allBtn = document.createElement("button");
  allBtn.textContent = "Tous";
  allBtn.id = "0";
  allBtn.classList.add("activeButton");
  filters.appendChild(allBtn);

  /* Boutons par catégorie */
  const categories = await getCategories();
  categories.forEach((category) => {
    const btn = document.createElement("button");
    btn.textContent = category.name;
    btn.id = category.id;
    filters.appendChild(btn);
  });

  /* Ajout des écouteurs événements */
  const buttons = document.querySelectorAll(".filters button");
  buttons.forEach((button) => {
    button.addEventListener("click", async (e) => {
      let buttonId = e.target.id;
      buttons.forEach((btn) => {
        btn.classList.remove("activeButton");
      });
      e.target.classList.add("activeButton");
      activeFilterButton = buttonId !== "0" ? parseInt(buttonId) : 0;
      await displayGalleryWorks();
    });
  });
}

/*****  Fonctions complémentaires *****/

/* Vérifier si l'utilisateur est authentifié */

function isAuthenticated() {
  return (
    localStorage.getItem("authentifie") === "true" ||
    localStorage.getItem("authentifie") === "false"
  );
}

/* Déconnecter l'utilisateur */

async function disconnection(event) {
  localStorage.removeItem("authentifie");
  localStorage.removeItem("token");
  loginLink.textContent = "login";
  loginLink.removeEventListener("click", disconnection);
}

/* Gérer l'authentification et mettre à jour l'interface utilisateur */
function handleAuthentication() {
  if (isAuthenticated()) {
    loginLink.textContent = "logout";
    loginLink.addEventListener("click", disconnection);
    modifyButton.style.display = "flex";
    filters.style.display = "none";
  } else {
    loginLink.textContent = "login";
    modifyButton.style.display = "none";
    filters.style.display = "flex"
  }
}

/* Intialiser la page Index */

async function initIndex() {
  await handleAuthentication();
  await setupFilters();
  await displayGalleryWorks();
}

/* EventListener load */

window.addEventListener("load", initIndex);

/* Supprimer les éléments du localStorage */

function clearLocalStorage () {
  localStorage.removeItem("token");
  localStorage.removeItem("authentifie");
}
/* EventListener beforeunload */
window.addEventListener("beforeunload", clearLocalStorage)
