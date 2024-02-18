import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";
import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";

const loader = document.querySelector('.loader');
loader.style.display = 'none';

document.getElementById('searchForm').addEventListener('submit', (event) => {
    event.preventDefault();

    const query = document.getElementById('searchInput').value.trim();

    if (query === "") {
        iziToast.error({
            title: 'Error',
            message: 'Please enter a search query.',
            position:'topRight'
        });
        return;
    }

    loader.style.display = 'inline-block';

    const apiKey = '42374416-80395e50359da313800ed9b7e';

    fetch(`https://pixabay.com/api/?key=${apiKey}&q=${query}&image_type=photo&orientation=horizontal&safesearch=true`)
        .then(response => response.json())
        .then(data => {
            loader.style.display = 'none';

            if (data.hits.length === 0) {
                iziToast.error({
                    title: 'Error',
                    message: 'Sorry, there are no images matching your search query. Please try again.',
                    position: 'topRight'
                });
            } else {
                document.getElementById('imageGallery').innerHTML = '';

                data.hits.forEach(image => {
                    const card = document.createElement('div');
                    card.classList.add('card');

                    const link = document.createElement('a');
                    link.href = image.largeImageURL;
                    link.classList.add('gallery-link'); 

                    const img = document.createElement('img');
                    img.src = image.webformatURL;
                    img.alt = image.tags;

                    const details = document.createElement('div');
                    details.classList.add('details');
                    details.innerHTML = `
                        <p>Likes: ${image.likes}</p>
                        <p>Views: ${image.views}</p>
                        <p>Comments: ${image.comments}</p>
                        <p>Downloads: ${image.downloads}</p>
                    `;

                    link.appendChild(img);
                    card.appendChild(link);
                    card.appendChild(details)

                    document.getElementById('imageGallery').appendChild(card);
                });

                const lightbox = new SimpleLightbox('.gallery-link'); 
                lightbox.refresh();
            }
        })
        .catch(error => {
            console.log('Error fetching data:', error);
            loader.style.display = 'none';
            iziToast.error({
                title: 'Error',
                message: 'An error occurred while fetching data. Please try again later.',
                position:'topRight'
            });
        });
});


