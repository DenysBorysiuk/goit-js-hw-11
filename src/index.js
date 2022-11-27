import './css/styles.css';
import { getImages } from './js/apiService';
import { createMarkup } from './js/createMarkup';
import refs from './js/refs';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const options = {
  root: null,
  rootMargin: '100px',
  threshold: 1.0,
};
let searchTerm;
let page = 1;
var lightbox = new SimpleLightbox('.gallery a');
const observer = new IntersectionObserver(onLoad, options);

refs.form.addEventListener('submit', onSubmit);

function onSubmit(e) {
  e.preventDefault();
  searchTerm = e.target.searchQuery.value;
  refs.gallery.innerHTML = '';
  page = 1;
  if (searchTerm === '') {
    return Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );
  }
  getImages(searchTerm, page)
    .then(resp => {
      if (resp.data.totalHits === 0) {
        searchTerm = '';
        return Notify.failure(
          'Sorry, there are no images matching your search query. Please try again.'
        );
      }
      Notify.success(`"Hooray! We found ${resp.data.totalHits} images."`);
      refs.gallery.insertAdjacentHTML(
        'beforeend',
        createMarkup(resp.data.hits)
      );
      observer.observe(refs.guard);
      lightbox.refresh();
    })
    .catch(error => console.log(error));
}

function onLoad(entries, observer) {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      getImages(searchTerm, page)
        .then(resp => {
          page += 1;
          refs.gallery.insertAdjacentHTML(
            'beforeend',
            createMarkup(resp.data.hits)
          );
          lightbox.refresh();
          if (resp.data.hits < 40) {
            observer.unobserve(refs.guard);
            searchTerm = '';
            return Notify.failure(
              "We're sorry, but you've reached the end of search results."
            );
          }
        })
        .catch(error => {
          if (error.response) {
            observer.unobserve(refs.guard);
            Notify.failure(
              "We're sorry, but you've reached the end of search results."
            );
          }
        });
    }
  });
}
