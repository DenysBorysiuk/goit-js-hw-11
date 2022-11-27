export function createMarkup(arr) {
  return arr
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
