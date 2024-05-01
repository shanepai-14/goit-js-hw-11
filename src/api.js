import axios from "axios";
import Notiflix from "notiflix";
import { loader } from './index';

export async function fetchImages(searchQuery,loadMore = 1){
  try{
    const response = await axios.get(
      `https://pixabay.com/api/?key=43652750-d633fc097b58da3bac7af6bee&q=${searchQuery}&safesearch="true"&orientation="horizontal"&image_type=photo&pretty=true&per_page=40&page=${loadMore}`
    );

    if(response.data.total === response.data.totalHits){
        return [];
    }

    return response.data;
  }catch (error){
    if (error.response && error.response.status === 400) {
      const responseData = error.response.data;
      if (responseData.includes("[ERROR 400] \"page\" is out of valid range.")) {

          Notiflix.Notify.info(`"We're sorry, but you've reached the end of search results."`);
          loader.classList.add('hidden');
      
      } else {
          // Handle other types of errors
          console.error("Error:", responseData);
      }
    }
    console.log(error);
  }
}


