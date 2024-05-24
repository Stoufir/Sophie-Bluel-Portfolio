/* Variables */

let modal = null;
const modalGallery = document.querySelector(".modalGallery");

/*****  Gestion des modales *****/

/* Ouvrir la modale */
const openModal = function (e) {
  e.preventDefault();
  modal = document.querySelector(e.target.getAttribute("href"));
  modal.style.display = null;
  modal.removeAttribute("aria-hidden");
  modal.setAttribute("aria-modal", "true");
  modal.addEventListener("click", closeModal);
  modal
    .querySelector(".js-modal-stop")
    .addEventListener("click", stopPropagation);
  modalAddProject.style.display = "none";
  modalDeleteProject.style.display = "flex";
  displayModalProjects();
  initializeCloseButtons();
  displayCategoryModal();
};

/* Ajouter l'event openModal au click */
modifyButton.addEventListener("click", openModal);

/* Fermer la modale */
const closeModal = function () {
  if (modal === null) return;
  modal.style.display = "none";
  modal.setAttribute("aria-hidden", "true");
  modal.removeAttribute("aria-modal");
  modal.removeEventListener("click", closeModal);
  modal
    .querySelector(".js-modal-stop")
    .removeEventListener("click", stopPropagation);
  modal = null;
  resetAddProjectModal();
};

/* Stopper la propagation */
const stopPropagation = function (e) {
  e.stopPropagation();
};

/* Nettoyer les projets dans la modale */
function cleanModalProjects() {
  modalGallery.innerHTML = "";
}

/* Créer un projet avec un bouton poubelle */
function createModalWork(work) {
  const projectContainer = document.createElement("div");
  projectContainer.classList.add("projectContainer");
  const projectImage = document.createElement("img");
  projectImage.src = work.imageUrl;
  const projectButton = document.createElement("button");
  projectButton.type = "button";
  projectButton.classList.add("deleteButton");
  const trashIcon = document.createElement("i");
  trashIcon.classList.add("fa-solid", "fa-trash-can", "trashIcon");
  projectButton.appendChild(trashIcon);
  projectContainer.appendChild(projectImage);
  projectContainer.appendChild(projectButton);
  projectContainer.setAttribute("id", work.id);
  modalGallery.appendChild(projectContainer);

  projectButton.addEventListener("click", async (e) => {
    e.preventDefault();
    const id = projectButton.parentElement.getAttribute("id");
    const init = {
      method: "DELETE",
      headers: {
        "content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
    };
    fetch(url + "api/works/" + id, init).then((response) => {
      displayModalProjects();
      displayGalleryWorks();
    });
  });
}

/* Afficher les projets dans la modale */
async function displayModalProjects() {
  const arrayWorks = await getWorks();
  if (!arrayWorks) {
    console.error("Erreur lors de la récupération des travaux.");
    return;
  }
  cleanModalProjects();
  arrayWorks.forEach((work) => {
    createModalWork(work);
  });
  displayAddModal();
}

/* Ajouter l'event closeModal au click */
function initializeCloseButtons() {
  const closeButtons = document.querySelectorAll(".closeModal");
  closeButtons.forEach((button) => {
    button.removeEventListener("click", closeModal);
    button.addEventListener("click", closeModal);
  });
}

/*****  Gestion de la seconde modale *****/

/* Variables */

const btnAddModal = document.querySelector(".modalDeleteProject .modalButton");
const modalDeleteProject = document.querySelector(".modalDeleteProject");
const modalAddProject = document.querySelector(".modalAddProject");
const arrowLeft = document.querySelector(".fa-arrow-left");

/* Faire apparaître la seconde modale et ajout du retour à la première modale au click */
function displayAddModal() {
  btnAddModal.addEventListener("click", () => {
    modalAddProject.style.display = "flex";
    modalDeleteProject.style.display = "none";
  });
  arrowLeft.addEventListener("click", () => {
    modalAddProject.style.display = "none";
    modalDeleteProject.style.display = "flex";
    resetAddProjectModal();
    displayModalProjects();
  });
}


/* Prévisualisation de l'image */
/* Variables */

const previewImg = document.querySelector(".containerFile img");
const inputFile = document.querySelector(".containerFile input");
const labelFile = document.querySelector(".containerFile label");
const iconFile = document.querySelector(".containerFile .fa-image");
const pFile = document.querySelector(".containerFile p");
const inputText = document.getElementById("title");

/* Changer le visuel lorsqu'on ajoute un fichier  */
inputFile.addEventListener("change", () => {
  const file = inputFile.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function (e) {
      previewImg.src = e.target.result;
      previewImg.style.display = "flex";
      labelFile.style.display = "none";
      iconFile.style.display = "none";
      pFile.style.display = "none";
    };
    reader.readAsDataURL(file);
  }
});

/* Reset de la modale "ajout" */
function resetAddProjectModal() {
  previewImg.src = "";
  previewImg.style.display = "none";
  labelFile.style.display = "flex";
  iconFile.style.display = "flex";
  pFile.style.display = "flex";
  inputText.value = "";
  inputFile.value = "";
  addErrorMessage.textContent = "";
  submitButton.classList.remove("active");
}

/* Créer la liste de catégorie */

async function displayCategoryModal() {
  const select = document.querySelector(".modalAddProject select");
  const categorys = await getCategories();
  select.innerHTML ="";
  categorys.forEach((category) => {
    const option = document.createElement("option");
    option.value = category.id;
    option.textContent = category.name;
    select.appendChild(option);
  });
}

/* Faire un post pour ajouter un projet */
/* Variables */

const form = document.querySelector(".modalAddProject form");
const title = document.querySelector(".modalAddProject #title");
const category = document.querySelector(".modalAddProject #category");
const submitButton = document.querySelector(".validateButton");
const addErrorMessage = document.querySelector(".modalAddProject .errorMessage");

/* Vérifier si le formulaire est complet */
function isFormComplete() {
  return (
    title.value.trim() !== "" &&
    category.value.trim() !== "" &&
    inputFile.files.length > 0
  );
}

/* Mettre à jour le bouton "Valider" */
function updateSubmitButton() {
  if (isFormComplete()) {
    submitButton.classList.add("active");
    addErrorMessage.textContent = "";
  } else {
    submitButton.classList.remove("active");
  }
}

/* Ecouter le changement du formulaire */
form.addEventListener("change", updateSubmitButton);

/* POST pour l'ajout d'un projet lorsqu'on soumet le formulaire*/
form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const formData = new FormData(form);
  fetch(url + "api/works", {
    method: "POST",
    body: formData,
    headers: {
      Authorization: "Bearer " + localStorage.getItem("token"),
    },
  })
    .then((response) => {
      if (!response.ok) {
        addErrorMessage.textContent = "Veuillez remplir tous les champs du formulaire.";
        throw new Error("La requête a échoué : " + response.status);
      }
      addErrorMessage.textContent = "";
      return response.json();
    })
    .then((data) => {
      displayGalleryWorks();
      closeModal();
    })
    .catch((error) => {
      console.error("Une erreur est survenue lors de l'envoi du formulaire :", error
      );
    });
});
