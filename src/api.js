import axios from "axios";


export async function fetchImages(searchQuery,loadMore = 1){
    const response = await axios.get(
      `https://pixabay.com/api/?key=43652750-d633fc097b58da3bac7af6bee&q=${searchQuery}&image_type=photo&pretty=true&per_page=40&page=${loadMore}`
    );
    return response.data;
}


