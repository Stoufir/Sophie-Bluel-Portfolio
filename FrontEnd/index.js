/* Variables */

const url = "http://localhost:5678/"
const gallery = document.querySelector('.gallery')

/* Récupération des travaux */

async function getWorks(){
    const response = await fetch(url + "api/works");
    return await response.json()
}
getWorks();

/* Affichage des travaux dans le DOM */

async function displayWorks() {
    const arrayWorks = await getWorks()
    arrayWorks.forEach(work => {
        const figure = document.createElement("figure")

        const img = document.createElement("img")
        img.src = work.imageUrl
        figure.appendChild(img)

        const figcaption = document.createElement("figcaption")
        figcaption.textContent = work.title
        figure.appendChild(figcaption)
        
        gallery.appendChild(figure)
    });
}

displayWorks()

