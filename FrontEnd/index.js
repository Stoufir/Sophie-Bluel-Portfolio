/* Variables */

const url = "http://localhost:5678/";
const gallery = document.querySelector(".gallery");
const filters = document.querySelector(".filters");
const loginLink = document.querySelector('a[href="Login.html"]');
const modifyButton = document.querySelector(".modifyButton")

/* Récupération des travaux */

async function getWorks() {
  const response = await fetch(url + "api/works");
  return await response.json();
}
getWorks();

/* Affichage des travaux dans le DOM */

async function displayWorks() {
  const arrayWorks = await getWorks();
  arrayWorks.forEach((work) => {
    createWork(work);
  });
}

async function UpdateWorks() {
  gallery.innerHTML = "";
  displayWorks();
}


function createWork(work) {
  const figure = document.createElement("figure");
  const img = document.createElement("img");
  img.src = work.imageUrl;
  figure.appendChild(img);
  const figcaption = document.createElement("figcaption");
  figcaption.textContent = work.title;
  figure.appendChild(figcaption);
  gallery.appendChild(figure);
}

displayWorks();

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
      buttonId = e.target.id;
      gallery.innerHTML = "";
      buttons.forEach((btn) => {
        btn.classList.remove("active-button");
      });
      if (buttonId !== "0") {
        e.target.classList.add("active-button");
        const workByCategory = works.filter((work) => {
          return work.categoryId == buttonId;
        });
        workByCategory.forEach((work) => {
          createWork(work);
        });
      } else {
        e.target.classList.add("active-button");
        await displayWorks();
      }
    });
  });
}

filterByCategory();

// Fonction pour vérifier si l'utilisateur est authentifié */
function estAuthentifie() {
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
    if (estAuthentifie()) {
        // Utilisateur authentifié
        console.log('L\'utilisateur est authentifié.');
        loginLink.textContent= "logout";
        loginLink.addEventListener("click", disconnection)
        modifyButton.style.display = "flex"
    } else {
        // Utilisateur déconnecté
        console.log('L\'utilisateur est déconnecté.');
        loginLink.textContent= "login";
        modifyButton.style.display = "none"
    }
});

/*window.addEventListener('beforeunload', function(event) {

  localStorage.removeItem('token');
  localStorage.removeItem('authentifie');
});*/
