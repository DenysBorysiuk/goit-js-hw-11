import './css/styles.css';
import { getImages } from './js/apiService';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const form = document.querySelector('#search-form');
const gallery = document.querySelector('.gallery');

form.addEventListener('submit', onSubmit);

function onSubmit(e) {
  e.preventDefault();

  const searchTerm = e.target.searchQuery.value;

  try {
    getImages(searchTerm).then(renderMarkup);
  } catch (error) {
    console.log(error);
  }
}

function renderMarkup({ data: { hits, totalHits } }) {
  console.log(hits);
  gallery.innerHTML = '';
  if (totalHits === 0) {
    Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );
  } else {
    Notify.success(`Hooray! We found ${totalHits} images.`);
    const markup = hits
      .map(
        ({
          webformatURL,
          largeImageURL,
          tags,
          likes,
          views,
          comments,
          downloads,
        }) => {
          return `<a class="gallery-link" href="${largeImageURL}">
  <img class="gallery-image" src="${webformatURL}" height="200px" alt="${tags}" data-source="${largeImageURL}" loading="lazy" />
  <div class="info">
     <p class="info-item">
       <b>Likes</b>
       ${likes}
     </p>
     <p class="info-item">
       <b>Views</b>
       ${views}
     </p>
     <p class="info-item">
       <b>Comments</b>
       ${comments}
     </p>
     <p class="info-item">
       <b>Downloads</b>
       ${downloads}
     </p>
   </div>
   </a>`;
        }
      )
      .join('');

    gallery.insertAdjacentHTML('beforeend', markup);
    var lightbox = new SimpleLightbox('.gallery a', {
      /* options */
      captionSelector: 'img',
      captionType: 'attr',
      captionsData: 'alt',
      captionPosition: 'bottom',
      captionDelay: 250,
    });
  }
}

// const { height: cardHeight } = document
//   .querySelector('.gallery')
//   .firstElementChild.getBoundingClientRect();

// window.scrollBy({
//   top: cardHeight * 2,
//   behavior: 'smooth',
// });
