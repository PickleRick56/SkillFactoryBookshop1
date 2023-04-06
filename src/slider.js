import './style.css';
import './slider.css';
import './mediaQueries.css';
document.addEventListener("DOMContentLoaded", () => {
  checkZero();
  sliderStarter();
  bookRequest("Architecture", 0);
  document.querySelector(":root").style.setProperty("--hidden", "hidden");
  if (localStorage.getItem("cartCount") === null) {
    console.log(localStorage.getItem("cartCount"));
    cart.dataset.styleType = "0";
    
  } else {
    cart.dataset.styleType = localStorage.getItem("cartCount");
    document.querySelector(":root").style.setProperty("--hidden", "visible");
  }
  document.querySelector(":root").style.setProperty("--hidden", "hidden");
  checkZero();
});



function sliderStarter() {
  setInterval(() => forward(), 5000);
}

let position = 0;

let slider = document.querySelector(".slider");
let dots = document.querySelector(".dots");
let allDots = dots.children;
let cards = document.querySelector(".cards");
let catalog = document.querySelector(".catalog_ul");
let loadMoreButton = document.querySelector(".load_more");
let cart = document.querySelector(".cart");

const imageCollection = [
  "img/banner0.png",
  "img/banner1.png",
  "img/banner2.png",
];

slider.src = `img/banner0.png`;

function forward() {
  position = Number(position) + 1;

  if (position > imageCollection.length - 1) {
    position = 0;
    slider.src = `${imageCollection[position]}`;
  } else {
    slider.src = `${imageCollection[position]}`;
  }
  for (let key of allDots) {
    key.style.backgroundColor = "#EFEEF6";
  }
  document.querySelector(`.dot${position}`).style.backgroundColor = "#9E98DC";
}

function directSelection(evt) {
  let index = evt.target.className;
  index = index.slice(-1);
  position = index;
  for (let key of allDots) {
    key.style.backgroundColor = "#EFEEF6";
  }
  slider.src = `${imageCollection[position]}`;
  document.querySelector(`.dot${position}`).style.backgroundColor = "#9E98DC";
}

dots.addEventListener("click", directSelection, false);

// BOOKS
function bookRequest(category, startPositon) {
  fetch(
      `https://www.googleapis.com/books/v1/volumes?q="subject:${category}"&key=AIzaSyARaQbqJaGTu2k41QqIQHeM5DIhY69brqs&printType=books&startIndex=${startPositon}&maxResults=6&langRestrict=en`
    )
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      console.log(data);

      for (let i = 0; i < data.items.length; i++) {
        cards.innerHTML += `   <div class="card">
          <img class="card_cover" src="${
            data.items[i].volumeInfo.imageLinks.thumbnail
          }" alt="">
          <div class="description">
  
              <div class="author">${data.items[i].volumeInfo.authors}</div>
              <div class="title">${data.items[i].volumeInfo.title}</div>
              ${
                data.items[i].volumeInfo.ratingsCount
                  ? `<div class="ratingsCount">${star(
                      data.items[i].volumeInfo.ratingsCount
                    )} </div>`
                  : ` <div class="ratingsCount"> </div>`
              }
              <div class="review">${reviewer(
                data.items[i].volumeInfo.description
              )} </div>
         
              ${
                data.items[i].saleInfo.retailPrice
                  ? `<div class="price">${data.items[i].saleInfo.retailPrice.amount}${data.items[i].saleInfo.retailPrice.currencyCode}</div>`
                  : `<div class="price">
                 ${data.items[i].saleInfo.saleability.replace(/_/g, " ")}
               </div>`
              }


              <button class="buy" data-id=${data.items[i].id} > ${buyOrIn(data.items[i].id)}</button>
  
          </div>
  
      </div>`;
      }
    })

    .catch(() => {
      console.log("error");
    });
   
}
checkZero();
catalog.addEventListener("click", (e) => {
  cleanBeforeRequest();
  let category = e.target.closest("a");
  catalogClassToDefault(category);

  category = category.innerText.replace(/\s/g, "");

  bookRequest(category, 0);
});
loadMoreButton.addEventListener("click", () => {
  let activeCategory = document.querySelector(".catalog_ul_a_active").innerText;
  let cardNumber = document.querySelectorAll(".card");

  bookRequest(activeCategory, cardNumber.length);
});

function cleanBeforeRequest() {
  cards.innerHTML = "";
}

function catalogClassToDefault(e) {
  let liList = document.querySelectorAll(".catalog_ul_a");
  for (let key of liList) {
    key.className = "catalog_ul_a";
  }
  e.className = "catalog_ul_a catalog_ul_a_active";
}

function star(num) {
  // if(num>5){num=5}
  let starsCount = "";
  for (let i = 0; i < num; i++) {
    starsCount += `<svg width="12" height="11" viewBox="0 0 12 11" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M6 0L7.80568 3.5147L11.7063 4.1459L8.92165 6.9493L9.52671 10.8541L6 9.072L2.47329 10.8541L3.07835 6.9493L0.293661 4.1459L4.19432 3.5147L6 0Z" fill="#F2C94C"/>
    </svg>`;
  }

  for (let i = 0; i < 5 - num; i++) {
    starsCount += `<svg width="12" height="11" viewBox="0 0 12 11" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M6 0L7.80568 3.5147L11.7063 4.1459L8.92165 6.9493L9.52671 10.8541L6 9.072L2.47329 10.8541L3.07835 6.9493L0.293661 4.1459L4.19432 3.5147L6 0Z" fill="#EEEDF5"/>
    </svg>`;
  }

  return starsCount;
}

function reviewer(description) {
  if (description) {
    if (description.length > 99) {
      return `${description.slice(0, 96)}` + "...";
    } else {
      return description;
    }
  } else {
    return `no description`;
  }
}

// CART
function purchase(button) {
  if (button.innerText === "BUY NOW") {

    if (localStorage.getItem("cartId") == null) {
      let arr = Array(button.dataset.id);
      localStorage.setItem("cartId", JSON.stringify(arr));
      console.log(arr);
    } else {
      let arr = JSON.parse(localStorage.getItem("cartId"));
      if (arr.length == 0) {
        let y = button.dataset.id;
        arr = Array(y);
        localStorage.setItem("cartId", JSON.stringify(arr));
      } else {
        let y = button.dataset.id;
        arr.push(y);

        localStorage.setItem("cartId", JSON.stringify(arr));
      }

    }

    button.innerText = "in the cart";
    cart.dataset.styleType = Number(cart.dataset.styleType) + 1;
    localStorage.setItem("cartCount", `${cart.dataset.styleType}`);
    document.querySelector(":root").style.setProperty("--hidden", "visible");
  } else if (button.innerText === "IN THE CART") {

    let arr = JSON.parse(localStorage.getItem("cartId"));
    let y = arr.filter(item => {
      return item != button.dataset.id;
    });
    console.log(y);
    localStorage.setItem("cartId", JSON.stringify(y));

    button.innerText = "BUY NOW";
    cart.dataset.styleType = Number(cart.dataset.styleType) - 1;
    localStorage.setItem("cartCount", `${cart.dataset.styleType}`);
    // document.querySelector(":root").style.setProperty("--hidden", "visible");
    checkZero();
  }
}

function findIdInCart(button) {
  if (localStorage.getItem("cartId") == null) {
    return true;
  } else {
    let cartArray = JSON.parse(localStorage.getItem("cartId"));
    console.log(cartArray);
    let y = cartArray.filter(item => {
      return item == button.dataset.id;
    });
    console.log(y);
    if (y.length > 0) {
      return false;
    } else {
      return true;
    }

  }
}

function buyOrIn(buttonId) {
  if (localStorage.getItem("cartId") == null) {
    return "BUY NOW";
  } else {
    let cartArray = JSON.parse(localStorage.getItem("cartId"));
    let y = cartArray.filter(item => {
      return item == buttonId;
    });
    console.log(y);
    if (y.length > 0) {
      return "IN THE CART";
    } else {
      return "BUY NOW";
    }

  }
}


document.addEventListener("click", (e) => {
  const {
    target
  } = e;
  if (target.tagName === 'BUTTON' && target.classList.contains("buy")) {
    purchase(target);
  }
})

function checkZero() {
  if (localStorage.getItem("cartCount") > 0) {
    document.querySelector(":root").style.setProperty("--hidden", "visible");
  } else {
    document.querySelector(":root").style.setProperty("--hidden", "hidden");
  }
}