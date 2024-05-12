let modal = null;

document.addEventListener("DOMContentLoaded", function () {
  var closeButtons = document.querySelectorAll(".CloseModal");
  closeButtons.forEach(function (button) {
    button.addEventListener("click", function (e) {
      closeModal(e);
    });
  });
});

const focusableSelector = "button, a,";

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
    displayModalProjects();
};

const closeModal = function (e) {
  if (modal === null) return;
  e.preventDefault();
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

const stopPropagation = function (e) {
  e.stopPropagation();
};

modifyButton.addEventListener("click", openModal);

window.addEventListener("keydown", function (e) {
  if (e.key === "Tab" && modal !== null) {
    focusInModal(e);
  }
});

function displayModalProjects() {
  const gallery = document.querySelector(".modal-gallery");
  gallery.innerHTML = ""
  fetchModalProjects();

}

function fetchModalProjects() {
  fetch(url + "api/works/")
    .then((response) => {
      if (!response.ok) {
        throw new Error("La requête a échoué : " + response.status);
      }
      return response.json();
    })
    .then((data) => {
      const gallery = document.querySelector(".modal-gallery");

      data.forEach((projet) => {
        const projectContainer = document.createElement("div");
        projectContainer.classList.add("project-container");
        const projectImage = document.createElement("img");
        projectImage.src = projet.imageUrl;
        const projectButton = document.createElement("button");
        projectButton.type = "button";
        projectButton.classList.add("delete-button");
        const trashIcon = document.createElement("i");
        trashIcon.classList.add("fa-solid", "fa-trash-can", "trash-icon");
        projectButton.appendChild(trashIcon);
        projectContainer.appendChild(projectImage);
        projectContainer.appendChild(projectButton);
        projectContainer.setAttribute("id", projet.id);
        gallery.appendChild(projectContainer);
      });
      deleteProject();
    })
    .catch((error) => {
      console.error(
        "Une erreur est survenue lors de la récupération des données :",
        error
      );
    });
}

function deleteProject() {
  const trashAll = document.querySelectorAll(".delete-button");
  trashAll.forEach((trash) => {
    trash.addEventListener("click", async (e) => {
      e.preventDefault();
      const id = trash.parentElement.getAttribute("id");
      const init = {
        method: "DELETE",
        headers: {
          "content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      };
      fetch("http://localhost:5678/api/works/" + id, init)
        .then((response) => {
          if (!response.ok) {
            console.log("le delete n'a pas marché");
          } 
          trash.parentElement.remove();
          UpdateWorks();
        })
    });
  });
}


/*** Faire apparaître la deuxième modal ***/

const btnAddModal = document.querySelector(".modalDeleteProject .modal-button")
const modalDeleteProject = document.querySelector(".modalDeleteProject")
const modalAddProject = document.querySelector(".modalAddProject")
const arrowLeft = document.querySelector(".fa-arrow-left")

function displayAddModal() {
  btnAddModal.addEventListener("click" ,() => {
    modalAddProject.style.display ="flex";
    modalDeleteProject.style.display ="none";
  })
  arrowLeft.addEventListener("click", () =>{
    modalAddProject.style.display = "none";
    modalDeleteProject.style.display= "flex";
    resetAddProjectModal();
    displayModalProjects();
  })
}

displayAddModal()

/** Prévisualisation de l'image **/

const previewImg = document.querySelector(".containerFile img")
const inputFile = document.querySelector(".containerFile input")
const labelFile = document.querySelector(".containerFile label")
const iconFile = document.querySelector(".containerFile .fa-image")
const pFile = document.querySelector(".containerFile p")
const inputText = document.getElementById("title")

inputFile.addEventListener("change", ()=> {
  const file = inputFile.files[0]
  console.log(file);
  if (file) {
    const reader = new FileReader();
    reader.onload = function (e){
      previewImg.src = e.target.result
      previewImg.style.display ="flex";
      labelFile.style.display = "none";
      iconFile.style.display = "none";
      pFile.style.display ="none";
    }
    reader.readAsDataURL(file);
  }
})

function resetAddProjectModal() {
  previewImg.src= "";
  previewImg.style.display = "none";
  labelFile.style.display = "flex";
  iconFile.style.display = "flex";
  pFile.style.display ="flex";
  inputText.value = ""
}


/* créer la liste de catégorie */

async function displayCategoryModal () {
  const select = document.querySelector(".modalAddProject select")
  const categorys = await getCategories()
  categorys.forEach(category => {
    const option = document.createElement("option")
    option.value = category.id
    option.textContent = category.name
    select.appendChild(option)
  })
}

displayCategoryModal()




/* faire un post pour ajouter un projet */

const form = document.querySelector(".modalAddProject form");
const title = document.querySelector(".modalAddProject #title");
const category = document.querySelector(".modalAddProject #category");

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
        throw new Error("La requête a échoué : " + response.status);
      }
      return response.json();
    })
    .then((data) => {
      console.log(data);
      UpdateWorks();
      resetAddProjectModal();
    })
    .catch((error) => {
      console.error("Une erreur est survenue lors de l'envoi du formulaire :", error);
    });
});
