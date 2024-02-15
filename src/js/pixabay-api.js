import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";

document.getElementById('searchForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const query = document.getElementById('searchInput').value.trim();

    if (query === "") {
        iziToast.error({
            title: 'Error',
            message: 'Please enter a search query.'
        });
        return;
    }

    const apiKey = '42374416-80395e50359da313800ed9b7e';

    fetch(`https://pixabay.com/api/?key=${apiKey}&q=${query}&image_type=photo&orientation=horizontal&safesearch=true`)
        .then(response => response.json())
        .then(data => {
            if (data.hits.length === 0) {
                iziToast.error({
                    title: 'Error',
                    message: 'Sorry, there are no images matching your search query. Please try again.'
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

                const lightbox = new SimpleLightbox('.gallery-link'); // Initialize SimpleLightbox with the appropriate selector
                lightbox.refresh();
            }
        })
        .catch(error => {
            console.error('Error fetching data:', error);
            iziToast.error({
                title: 'Error',
                message: 'An error occurred while fetching data. Please try again later.'
            });
        });
});

const galleryList = document.querySelector('.gallery');

function createGallery(imagesArray) {
    const galleryItems = imagesArray.map(image => {
        const listItem = document.createElement('li');
        listItem.classList.add('gallery-item');

        const link = document.createElement('a');
        link.classList.add('gallery-link');
        link.href = image.original;

        const imageElement = document.createElement('img');
        imageElement.classList.add('gallery-image');
        imageElement.src = image.preview;
        imageElement.alt = image.description;
        imageElement.dataset.source = image.original;

        link.appendChild(imageElement);
        listItem.appendChild(link);

        return listItem;
    });

    galleryList.append(...galleryItems);
}

createGallery(images);
galleryList.addEventListener('click', onGalleryItemClick);

function onGalleryItemClick(event) {
    event.preventDefault();

    if (event.target.nodeName !== 'IMG') {
        return;
    }

    const largeImageURL = event.target.dataset.source;
    const largeAlt = event.target.alt;

    const instance = basicLightbox.create(`<img src="${largeImageURL}" class="largeImage" alt="${largeAlt}">`, {
        onShow: (instance) => {
            const onKeyUp = (event) => {
                if (event.code === 'Escape') {
                    instance.close();
                }
            };

            window.addEventListener('keyup', onKeyUp);
            instance.__onKeyUp = onKeyUp;
        },
        onClose: (instance) => {
            window.removeEventListener('keyup', instance.__onKeyUp);
        }
    });

    instance.show();
}
