import './css/styles.css';
import { getImages } from './js/apiService';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const form = document.querySelector('#search-form');
const gallery = document.querySelector('.gallery');
const guard = document.querySelector('.js-guard');
const options = {
  root: null,
  rootMargin: '100px',
  threshold: 1.0,
};
let searchTerm;
let page = 1;
var lightbox = new SimpleLightbox('.gallery a');
const observer = new IntersectionObserver(onLoad, options);

form.addEventListener('submit', onSubmit);

function onSubmit(e) {
  e.preventDefault();
  searchTerm = e.target.searchQuery.value;
  gallery.innerHTML = '';
  page = 1;
  if (searchTerm === '') {
    return Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );
  }
  getImages(searchTerm, page)
    .then(resp => {
      // console.log(resp.data);
      if (resp.data.totalHits === 0) {
        searchTerm = '';
        return Notify.failure(
          'Sorry, there are no images matching your search query. Please try again.'
        );
      }
      Notify.success(`"Hooray! We found ${resp.data.totalHits} images."`);
      gallery.insertAdjacentHTML('beforeend', createMarkup(resp.data));
      observer.observe(guard);
      lightbox.refresh();
    })
    .catch(error => console.log(error));
}

function onLoad(entries, observer) {
  // console.log(observer);
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      getImages(searchTerm, page)
        .then(resp => {
          page += 1;
          gallery.insertAdjacentHTML('beforeend', createMarkup(resp.data));
          lightbox.refresh();
          if (resp.data.hits < 40) {
            observer.unobserve(guard);
            searchTerm = '';
            return Notify.failure(
              "We're sorry, but you've reached the end of search results."
            );
          }
        })
        .catch(error => {
          console.log(error);
          observer.unobserve(guard);
          return Notify.failure(
            "We're sorry, but you've reached the end of search results."
          );
        });
    }
  });
}

function createMarkup({ hits }) {
  // console.log(data);
  return hits
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
  <img class="gallery-image" src="${webformatURL}" width="400px" height="250px" alt="${tags}" data-source="${largeImageURL}" loading="lazy" />
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
}

// const { height: cardHeight } = document
//   .querySelector('.gallery')
//   .firstElementChild.getBoundingClientRect();

// window.scrollBy({
//   top: cardHeight * 2,
//   behavior: 'smooth',
// });

// function renderMarkup({ data: { hits, totalHits } }) {
//   // console.log(data);
//   if (totalHits === 0) {
//     searchTerm = '';
//     Notify.failure(
//       'Sorry, there are no images matching your search query. Please try again.'
//     );
//   } else {
//     totalFind = totalHits;
//     const markup = hits
//       .map(
//         ({
//           webformatURL,
//           largeImageURL,
//           tags,
//           likes,
//           views,
//           comments,
//           downloads,
//         }) => {
//           return `<a class="gallery-link" href="${largeImageURL}">
//   <img class="gallery-image" src="${webformatURL}" width="400px" height="250px" alt="${tags}" data-source="${largeImageURL}" loading="lazy" />
//   <div class="info">
//      <p class="info-item">
//        <b>Likes</b>
//        ${likes}
//      </p>
//      <p class="info-item">
//        <b>Views</b>
//        ${views}
//      </p>
//      <p class="info-item">
//        <b>Comments</b>
//        ${comments}
//      </p>
//      <p class="info-item">
//        <b>Downloads</b>
//        ${downloads}
//      </p>
//    </div>
//    </a>`;
//         }
//       )
//       .join('');

//     gallery.insertAdjacentHTML('beforeend', markup);
//     var lightbox = new SimpleLightbox('.gallery a', {
//       /* options */
//       captionSelector: 'img',
//       captionType: 'attr',
//       captionsData: 'alt',
//       captionPosition: 'bottom',
//       captionDelay: 250,
//     });
//   }
// }
