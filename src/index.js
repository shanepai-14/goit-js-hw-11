import simpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";
import Notiflix from "notiflix";
import { fetchImages} from './api';


let search;
let page = 1;
let lastPage = false;
export const loader = document.getElementById('loader');
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
  lastPage = false;
  page = 1;
 try{
    const hits = await fetchImages(searchQuery)
   
   
    if(hits.length != 0){
        search = searchQuery;
   
        gallery.innerHTML = '';
        renderImages(hits.hits);
        Notiflix.Notify.success(`✅ Hooray! We found ${hits.totalHits} images.`);
        lightbox.refresh();
        return;
    }
    
    loader.classList.add('hidden');
    Notiflix.Notify.failure(`Sorry, there are no images matching your search query. Please try again.`);

 }catch(error){

    loader.classList.add('hidden');
    Notiflix.Notify.failure(`Sorry, there are no images matching your search query. Please try again.`);
 }


});


function renderImages(image){
    const markup = image
    .map(({ webformatURL,downloads,comments,views,tags, largeImageURL,likes }) => {
      return `<div class="my-1  px-1 w-full md:w-1/2  lg:w-1/5">
      <article class="overflow-hidden bg-white rounded-lg shadow-lg">
          <a href="${largeImageURL}">
              <img alt="${tags}" class="object-cover block h-[200px] w-full" src="${webformatURL}">
          </a>
          <div class="flex justify-between p-2 items-center">
          <p class="flex flex-col items-center">
            <b>Likes</b> 
            ${likes}
          </p>
          <p class="flex flex-col items-center">
            <b>Views</b> 
            ${views}
          </p>
          <p class="flex flex-col items-center">
            <b>Comments</b> 
            ${comments}
          </p>
          <p class="flex flex-col items-center">
            <b>Downloads</b> 
            ${downloads}
          </p>
        </div>
         
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
      if (isGalleryScrolledToBottom() && lastPage == false) {
        // Set the flag to indicate that data is being fetched
        isFetching = true;
        loader.classList.remove('hidden');
 
        setTimeout(async function() {
            await addImagesByScroll();
          
          }, 2000);

    
      }else{
        loader.classList.add('hidden');
      }
    }
  });

 async function addImagesByScroll(){
    page+=1;
  
    try{
     
      const hits = await fetchImages(search,page);
      const totalHits = hits.totalHits;
      const perPage = 40;
      const totalPages = Math.ceil(totalHits / perPage);

      if(page >= totalPages){
        Notiflix.Notify.info(`"We're sorry, but you've reached the end of search results."`);
        loader.classList.add('hidden');
        lastPage = true;
      }
      if(hits.length != 0){

        renderImages(hits.hits);
        lightbox.refresh();
    
        return
      }
      return
     }catch(error){
      Notiflix.Notify.failure(`Something went wrong please try again`);
        
     }finally {
        // Reset the flag after data fetching is complete
        isFetching = false;
      }
  }