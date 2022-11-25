import axios from 'axios';

const API_KEY = '31604324-7a50cb95f9ef385a3991a2501';
const BASE_URL = 'https://pixabay.com/api/';

// export function fetchCountries(name) {
//   const url = `https://restcountries.com/v2/name/${name}?fields=name,capital,population,flag,languages`;
//   return fetch(url).then(response => {
//     if (!response.ok) {
//       throw new Error(response.status);
//     }
//     return response.json();
//   });
// }

export async function getPictures() {
  try {
    const response = await axios.get(`${BASE_URL}`);
    console.log(response);
  } catch (error) {
    console.error(error);
  }
}
