
//script for products, loads and shows products

const productsContainer = document.getElementById("products-container");
const productTemplate = document.getElementById("product-template");
let allProducts = [];

if (productsContainer && productTemplate){
    fetch("index.json")
    .then((response) => {
        if (!response.ok) {
            throw new Error("Network response was not ok"); //if it does not render error will show 
        }
        return response.json(); //convert from JSON to javascript
    })
    .then((products) => { //saves, shows and adds event listener
        allProducts = products;
        renderProducts();
        setupFilters();
    })
    .catch((error) => console.error("Error loading products:", error));
}
//finds objects and fills in the info pulled 
function createProductCard(product){ 
    const clone = productTemplate.content.cloneNode(true);

     const img = clone.querySelector(".product-image");
            img.src = product ["product-photo"];
            img.alt = product["product-name"] || "";

            clone.querySelector(".product-name").textContent = product["product-name"];
            clone.querySelector(".product-price").textContent = product["product-price"];
            clone.querySelector(".product-description").textContent = product ["product-description"];

            const addButton = clone.querySelector(".add-to-cart");
            addButton.addEventListener("click", () => addToCart(product));

            return clone;
}



//filter function
function parsePrice(product){ //convert from string to number
    return parseFloat (product["product-price"].replace(/[^0-9.]/g, "")); //remove everything but # or .
}

//show only products user filters 
function renderProducts(){
    if (!productsContainer || !productTemplate) return; // make sure user is on product page 

    const priceFilter = document.getElementById("price-filter");
    const sortFilter = document.getElementById("sort-filter");
    let filtered = [...allProducts];

    //filter through by number value 
    if (priceFilter){
        const value = priceFilter.value;
        filtered = filtered.filter((product) =>{
            const price = parsePrice(product);
            if (value === "under-70") return price < 70;
            if (value === "70-100") return price >= 70 && price <= 100;
            if (value === "over-100") return price > 100;
            return true;
        });
    }
    // get user choice to filter
    if (sortFilter){
        const sortValue = sortFilter.value;
        if (sortValue === "price-asc"){
            filtered.sort((a, b) => parsePrice(a) - parsePrice(b));
        } else if (sortValue === "price-desc"){
            filtered.sort((a, b) => parsePrice(b) - parsePrice(a));
        }
    }
    productsContainer.innerHTML = "";
    filtered.forEach((product) => {
        const card = createProductCard(product);
        productsContainer.appendChild(card);
    });
}
// add event listener on the filter methods
function setupFilters(){
    const priceFilter = document.getElementById("price-filter");
    const sortFilter = document.getElementById("sort-filter");

    if (priceFilter){
        priceFilter.addEventListener("change", renderProducts);
    }
    if (sortFilter){
        sortFilter.addEventListener("change", renderProducts);
    }
}



//cart counter
    function getCart(){ //return empty array if nothing is added 
        return JSON.parse(localStorage.getItem("cart")) || [];
    }
    function saveCart(cart){
        localStorage.setItem("cart", JSON.stringify(cart));
    }
    function updateCartCount (){

        const cart = getCart();
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        document.querySelectorAll(".cart-counter").forEach(counter => {
            counter.textContent = totalItems; //update header cart 
        });
    }

    function addToCart(product){
        const cart = getCart();
        const item = cart.find(i => i["product-name"] === product["product-name"]);

        if (item){
            item.quantity++;
        } else{
            cart.push({...product,quantity: 1});
        }

        saveCart(cart);
        updateCartCount();
        alert(`${product["product-name"]} was added to your cart.`);
    }

    function removeFromCart(name){
        const cart = getCart().filter(item => item["product-name"] !==name);
        saveCart(cart);
        updateCartCount();
        renderCartPage();
    }

    function renderCartPage(){
        const container = document.getElementById("cart-items");
        const totalEl = document.getElementById("cart-total");

        if (!container || !totalEl) return; // make sure user is on checkout page 

        const cart = getCart();
        container.innerHTML = "";

        if (cart.length === 0){
            container.textContent = "Your cart is empty, go shop!";
            totalEl.textContent = "";
            return;
        }
        let total = 0;

        cart.forEach(item => {
            const price = parseFloat(item["product-price"].replace(/[^0-9.]/g, ""));
            const lineTotal = price * item.quantity;
            total += lineTotal;

            const row=document.createElement("div");
            row.className = "cart-row";
                // build html of what user added 
            row.innerHTML = `
            <img src="${item["product-photo"]}" class="cart-image" alt="">
            <div class="cart-info">
            <h3>${item["product-name"]}</h3>
            <p>Quantity: ${item.quantity}</p>
            <p>Price: ${item["product-price"]}</p>
            <p>Subtotal: $${lineTotal.toFixed(2)}</p>
            <button class="remove-item">Remove</button>
            </div>
            `;
            row.querySelector(".remove-item").addEventListener("click", () =>{
                removeFromCart(item["product-name"]);
            });
            container.appendChild(row);

        });
        totalEl.textContent = `Total: $${total.toFixed(2)}`;
    }









 // contact form 
   const form = document.getElementById("form");
   const popUp = document.getElementById("pop-up");
   const closePopUp = document.getElementById("close-pop-up");

    if (form && popUp && closePopUp){ // make sure on the contact page 
        form.addEventListener("submit", (e) => {
            e.preventDefault();

        const requiredFields = form.querySelectorAll("[required]");
        let valid = true;

        requiredFields.forEach((field) => {
            if(!field.value.trim()){
                valid = false;
                field.style.border = "4px solid #ff4d4d";
            } else{
                field.style.border = "4px solid #f7dde2";
            }
        });

        if (!valid){
            alert("Please fill out all required fields before submitting.");
            return; //make sure pop up doesnt show until everything required is complete
        }

        popUp.style.display = "flex";
        form.reset();
    });

    closePopUp.addEventListener("click", () => {
        popUp.style.display = "none";
    });
}






   //carousel for homepage
   const carouselImages = document.querySelector(".carousel-images");
   const prevButton = document.querySelector(".carousel-button.prev");
   const nextButton = document.querySelector(".carousel-button.next");
   const carouselName = document.querySelector(".carousel-name");

   if (carouselImages && prevButton && nextButton && carouselName){ // make sure on the homepage 
    let slides =[];
    let currentIndex = 0;
    

    fetch("exclusive.json")
    .then((response) => {
        if (!response.ok){
            throw new Error ("Failed to load exclusive.json");
        }
        return response.json(); // make sure it is changed from JSON to array 
    })
    .then((images) => {
        images.forEach((imgData, index) => {
            const img = document.createElement("img");
            img.src =imgData.image;
            img.alt = imgData.name || "";
            img.classList.add("carousel-slide");
            if (index === 0) img.classList.add("active");
            carouselImages.appendChild(img);
        });
        slides = Array.from(document.querySelectorAll(".carousel-slide"));
    })

    .catch ((error) =>
        console.error("Error loading carousel images", error)
);

//only show one image at a time 
function showSlide(index){ 
    slides.forEach((slide, i) => {
        slide.classList.toggle("active", i === index);
    });
}

prevButton.addEventListener("click", () =>{
    if (!slides.length) return;
    currentIndex = (currentIndex - 1 + slides.length) % slides.length;
    showSlide(currentIndex);
});

nextButton.addEventListener("click", () => {
    if (!slides.length) return;
    currentIndex = (currentIndex + 1) % slides.length;
    showSlide(currentIndex);
});
}

renderCartPage();