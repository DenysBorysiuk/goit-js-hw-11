import axios from 'axios';

const API_KEY = '31604324-7a50cb95f9ef385a3991a2501';
const BASE_URL = 'https://pixabay.com/api/';

export async function getImages(searchTerm) {
  try {
    const response = await axios.get(
      `${BASE_URL}?key=${API_KEY}&q=${searchTerm}&image_type=photo&orientation=horizontal&safesearch=true`
    );
    return response;
  } catch (error) {
    console.error(error);
  }
}

// export async function getPictures() {
//   try {
//     const response = await axios.get({
//       baseURL: 'https://pixabay.com/api/',
//       params: {
//         KEY: '31604324-7a50cb95f9ef385a3991a2501',
//       },
//     });
//     console.log(response);
//   } catch (error) {
//     console.error(error);
//   }
// }
