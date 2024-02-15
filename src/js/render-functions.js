const loader = document.querySelector('.loader');
loader.style.display = 'inline-block';
const script = document.createElement('script');
script.src = './js/pixabay-api.js';

script.onload = function() {
  loader.style.display = 'none';
};
document.body.appendChild(script);