const imagesArea = document.querySelector('.images');
const gallery = document.querySelector('.gallery');
const galleryHeader = document.querySelector('.gallery-header');
const searchBtn = document.getElementById('search-btn'); 
const search = document.getElementById('search');
const spinner = document.querySelector('.spinner');
const sliderBtn = document.getElementById('create-slider');
const sliderContainer = document.getElementById('sliders');
const durationInput = document.getElementById('duration');
// selected image 
let sliders = [];


// If this key doesn't work
// Find the name in the url and go to their website
// to create your own api key
const KEY = '15674931-a9d714b6e9d654524df198e00&q';

// show images 
const showImages = (images) => {
  imagesArea.style.display = 'block';
  gallery.innerHTML = '';
  // show gallery title
  galleryHeader.style.display = 'block';
  images.forEach(image => {
    let div = document.createElement('div');
    div.className = 'col-lg-3 col-md-4 col-xs-6 img-item mb-2';
    div.innerHTML = ` <img class="img-fluid img-thumbnail image"  onclick=selectImage(event,"${image.webformatURL}") src="${image.webformatURL}" alt="${image.tags}">`;
    gallery.appendChild(div)

  })
  toggleDisplay();
  showMessage('danger', 'Image loaded.');
}

//get  image  from api
const getImages = async (query) => {
  const response = await fetch(`https://pixabay.com/api/?key=${KEY}=${query}&image_type=photo&pretty=true`);
  try {
    const data = await response.json();
    if (data.hits.length) {
      toggleDisplay();
      showImages(data.hits);
      imageSelectUnselect(); 
    } else {
      showMessage('not-found', 'Image not found! Please try another image.')
    }
  } catch (error) {
    showMessage('not-found', 'Something is wrong! Please try again.')
  }
}

let slideIndex = 0;

 //image select count
const selectImage = (event, img) => {
  let element = event.target;
  element.classList.toggle('added');
  let item = sliders.indexOf(img);
  if (item === -1) {
    sliders.push(img);
  } else {
    sliders.splice(item, 1);
  }
  document.getElementById('count').innerText = sliders.length;
  imageSelectUnselect(); 
}

let timer;
//create images slider
const createSlider = () => {
  search.value = '';
  if (sliders.length < 2) {
    alert('Select at least 2 image.')
    return;
  }
  sliderContainer.innerHTML = '';
  const prevNext = document.createElement('div');
  prevNext.className = "prev-next d-flex w-100 justify-content-between align-items-center";
  prevNext.innerHTML = ` 
  <span class="prev" onclick="changeItem(-1)"><i class="fas fa-chevron-left"></i></span>
  <span class="next" onclick="changeItem(1)"><i class="fas fa-chevron-right"></i></span>
  `;

  sliderContainer.appendChild(prevNext);
  //show main aria
  document.querySelector('.main').style.display = 'block';
  // hide image aria
  imagesArea.style.display = 'none';
  const duration = Math.abs(durationInput.value) || 1.5;
  console.log(duration);
  sliders.forEach(slide => {
    let item = document.createElement('div')
    item.className = "slider-item";
    item.innerHTML = `<img class="w-100"
    src="${slide}"
    alt="">`;
    sliderContainer.appendChild(item)
  })
  changeSlide(0);
  timer = setInterval(function () {
    slideIndex++;
    changeSlide(slideIndex);
  }, duration * 1000);
}

// change slider index 
const changeItem = index => {
  changeSlide(slideIndex += index);
}

// change slide item
const changeSlide = (index) => {

  const items = document.querySelectorAll('.slider-item');
  if (index < 0) {
    slideIndex = items.length - 1
    index = slideIndex;
  };

  if (index >= items.length) {
    index = 0;
    slideIndex = 0;
  }

  items.forEach(item => {
    item.style.display = "none"
  })

  items[index].style.display = "block"
}

//search files enter keyup
search.addEventListener('keyup', (e) => {
  if (e.key === 'Enter') {
    searchBtn.click();
  };
});

//search button click
searchBtn.addEventListener('click', function () {
  document.querySelector('.main').style.display = 'none';
  clearInterval(timer);
  const regex = /[a-zA-Z]/; 
  if (search.value.match(regex)) {
    getImages(search.value);
  } else {
    showMessage('not-danger', 'Please input a name.')
  }
  sliders.length = 0;
  document.getElementById('count').innerText = sliders.length;
})

//slider button click 
sliderBtn.addEventListener('click', function () {
  createSlider()
})

// display for spinner 
const toggleDisplay = () => {
  spinner.classList.toggle('d-none');
}

//show status 
const showMessage = (status, message) => {
  const parentDiv = document.getElementById('message');
  parentDiv.innerHTML = '';
  const messageDiv = document.createElement('p');
  messageDiv.classList = `text-center message alert ${status == 'danger' ? 'alert-danger' : ' alert-danger'}`;
  messageDiv.innerText = message;
  parentDiv.appendChild(messageDiv);

  if (status !== 'danger') {
    imagesArea.style.display = 'none';
  }
  setTimeout(() => {
    parentDiv.innerHTML = '';
  }, 2000)

}
//onload clear option
const clearAll = () => {
  search.value = '';
  durationInput.value = '';
};
//image title-attribute set
const imageSelectUnselect = () => {
  const images = document.querySelectorAll('.image');
  [...images].forEach(image => {
    if (image.classList.contains('added')) {
      image.setAttribute("title", "unselect");
    } else {
      image.setAttribute("title", "select");
    }
  });
}