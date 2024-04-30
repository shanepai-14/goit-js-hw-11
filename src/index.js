import simpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";
import Notiflix from "notiflix";
import { fetchImages} from './api';


let search;
let page = 2;
const loader = document.getElementById('loader');
const form = document.getElementById("search-form");
const gallery = document.querySelector(".gallery");
const lightbox = new SimpleLightbox('.gallery div article a', { 
    captionsData: "alt",
    captionDelay: 250,
    captionType: "alt",
   });


form.addEventListener("submit",async function(event) {

  event.preventDefault();
  const searchQuery = form.elements.searchQuery.value.trim();
  loader.classList.remove('hidden');
 try{
    const hits = await fetchImages(searchQuery)
    console.log(hits);
    search = searchQuery;
   
    gallery.innerHTML = '';
    renderImages(hits.hits);
    Notiflix.Notify.success(`✅ Successfully search for ${searchQuery}`);
    lightbox.refresh();
 }catch(error){
    console.log(error);
    
 }

 console.log(search);
});


function renderImages(image){
    const markup = image
    .map(({ previewURL,downloads,comments,views,tags, largeImageURL,likes }) => {
      return `<div class="my-1  px-1 w-full md:w-1/2 lg:my-4 lg:px-4 lg:w-1/5">
      <article class="overflow-hidden bg-white rounded-lg shadow-lg">
          <a href="${largeImageURL}">
              <img alt="${tags}" class="object-cover block h-[200px] w-full" src="${previewURL}">
          </a>
          <header class="flex items-center justify-between leading-tight p-2 md:p-4">
              <h1 class="text-lg">
                  <a class="no-underline hover:underline text-black" href="#">
                      Article Title
                  </a>
              </h1>
              <p class="text-grey-darker text-sm">
                  11/1/19
              </p>
          </header>
          <footer class="flex items-center justify-between leading-none p-2 md:p-4">
              <a class="flex items-center no-underline hover:underline text-black" href="#">
                  <img alt="Placeholder" class="block rounded-full" src="https://picsum.photos/32/32/?random">
                  <p class="ml-2 text-sm">
                      Author Name
                  </p>
              </a>
              <a class="no-underline text-grey-darker hover:text-red-dark" href="#">
                  <span class="hidden">Like</span>
                  <i class="fa fa-heart"></i>
              </a>
          </footer>
      </article>
  </div>
`;
    })
    .join("");
   
  gallery.insertAdjacentHTML('beforeend',markup);
  smoothScroll();
  loader.classList.add('hidden');
}

function isGalleryScrolledToBottom() {
    const gallery = document.querySelector(".gallery");
    if (gallery) {
      const galleryRect = gallery.getBoundingClientRect();
      // Calculate the bottom position of the gallery
      const galleryBottom = galleryRect.top + galleryRect.height;
      // Check if the bottom position of the gallery is within the viewport
      return galleryBottom <= (window.innerHeight || document.documentElement.clientHeight);
    }
    return false;
  }



  function smoothScroll(){
    if (gallery) {
        const firstChild = gallery.firstElementChild;
        if (firstChild) {
          const { height: cardHeight } = firstChild.getBoundingClientRect();
          window.scrollBy({
            top: cardHeight * 2,
            behavior: "smooth"
          });
        } else {
          console.error("Gallery has no children.");
        }
      } else {
        console.error("No element found with class 'gallery'.");
      }
  }

  let isFetching = false; // Flag to track whether data is currently being fetched

  window.addEventListener("scroll", async function() {
    // Check if data is currently being fetched
    if (!isFetching) {
      // Check if the user has scrolled to the bottom of the gallery
      if (isGalleryScrolledToBottom()) {
        // Set the flag to indicate that data is being fetched
        isFetching = true;
        loader.classList.remove('hidden');

        setTimeout(async function() {
            await addImagesByScroll();
          
          }, 2000);

    
      }
    }
  });

 async function addImagesByScroll(){
    try{
        const hits = await fetchImages(search,page);
        console.log(hits);
        renderImages(hits.hits);
        Notiflix.Notify.success(`✅ Successfully loadedmore`);
        lightbox.refresh();
        
        page+=1;
     }catch(error){
        console.log(error);
        
     }finally {
        // Reset the flag after data fetching is complete
        isFetching = false;
      }
  }