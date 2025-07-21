let products = [];

document.addEventListener('DOMContentLoaded', () => {
    fetchProducts();

    const btn = document.getElementById("backToTopBtn");
    if (btn) {
      btn.addEventListener("click", () => {
        window.scrollTo({
          top: 0,
          behavior: "smooth"
        });
      });
    }
});

// Fetch products from the API
function fetchProducts() {
    fetch('https://fakestoreapi.com/products')
        .then(response => response.json())
        .then(data => {
            products = data;
            renderProducts();
            loadHeader();
            updateCartCount();
            loadFooter();
        })
        .catch(error => console.error('Error fetching products:', error));
}
function renderProducts(productList = products) {
  const productContainer = document.getElementById('productContainer');
  if (!productContainer) return;
  productContainer.innerHTML = '';

  productList.forEach(product => {
    const productCard = document.createElement('div');
    productCard.className = 'col-md-4 mb-4';
    productCard.innerHTML = `
      <div class="card product-card h-100" data-id="${product.id}">
        <img src="${product.image}" class="card-img-top" alt="${product.title}" 
             style="height: 200px; object-fit: contain;">
        <div class="card-body d-flex flex-column">
          <h5 class="card-title">${product.title}</h5>
          <p class="card-text">$${product.price}</p>
          <a href="#" class="btn btn-primary mt-auto add-to-cart-btn">Add to Cart</a>
        </div>
      </div>
    `;
    productContainer.appendChild(productCard);

    productCard.querySelector('.add-to-cart-btn').addEventListener('click', (e) => {
    e.preventDefault();
    addToCart(product);
    });

  });

  document.querySelectorAll('.product-card').forEach(card => {
    card.addEventListener('click', (e) => {
      if (!e.target.classList.contains('add-to-cart-btn')) {
        const productId = card.getAttribute('data-id');
        window.location.href = `product.html?id=${productId}`;
      }
    });
  });
}

function loadHeader() {
    fetch('navbar.html')
        .then(res => res.text())
        .then(data => {
        document.getElementById('navbar').innerHTML = data;

        setupNavbar();

        const searchInput = document.getElementById('searchInput');
        if (searchInput) {
            searchInput.addEventListener('input', handleSearch);
        }
        updateCartCount();
        })
        .catch(err => console.error('Navbar load failed:', err));
}

function setupNavbar() {
  const userInfo = document.getElementById('userInfo');
  const currentUser = JSON.parse(localStorage.getItem('currentUser'));

  if (!userInfo) return;

  if (currentUser) {
    userInfo.innerHTML = `
      <a class="nav-link dropdown-toggle" href="#" id="profileDropdown" role="button"
         data-bs-toggle="dropdown" aria-expanded="false">
        <img src="https://cdn-icons-png.flaticon.com/512/149/149071.png" width="25" height="25" class="rounded-circle" alt="Profile">
      </a>
      <ul class="dropdown-menu" aria-labelledby="profileDropdown">
        <li><span class="dropdown-item-text">Hello, ${currentUser.name.split(' ')[0]}</span></li>
        <li><hr class="dropdown-divider"></li>
        <li><button class="dropdown-item" id="logoutBtn">Logout</button></li>
      </ul>
    `;

    document.getElementById('logoutBtn').addEventListener('click', () => {
      localStorage.removeItem('currentUser');
      window.location.href = 'login.html';
    });
  } else {
    userInfo.innerHTML = `
      <a class="nav-link dropdown-toggle" href="#" id="profileDropdown" role="button"
         data-bs-toggle="dropdown" aria-expanded="false">
        <img src="https://cdn-icons-png.flaticon.com/512/149/149071.png" width="25" height="25" class="rounded-circle" alt="Profile">
      </a>
      <ul class="dropdown-menu" aria-labelledby="profileDropdown">
        <li><a class="dropdown-item" href="login.html">Login</a></li>
      </ul>
    `;
  }
}

function loadFooter() {
    fetch('footer.html')
      .then(res => res.text())
      .then(data => {
        document.getElementById('footer').innerHTML = data;
      });
}

function handleSearch() {
    const query = document.getElementById('searchInput').value.toLowerCase();
    const filteredProducts = products.filter(product => 
        product.title.toLowerCase().includes(query) || 
        product.description.toLowerCase().includes(query)
    );
    
    renderProducts(filteredProducts);
}

function addToCart(product) {
  let cart = JSON.parse(localStorage.getItem('cart')) || [];

  const existingIndex = cart.findIndex(p => p.id === product.id);
  if (existingIndex !== -1) {
    cart[existingIndex].quantity += 1;
  } else {
    cart.push({ ...product, quantity: 1 });
  }

  localStorage.setItem('cart', JSON.stringify(cart));
  alert("Product added to cart!");
  updateCartCount();
}

function updateCartCount() {
  const cart = JSON.parse(localStorage.getItem('cart')) || [];
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartCountElem = document.getElementById('cartCount');
  if (cartCountElem) {
    cartCountElem.textContent = cartCount;
  }
}


window.onscroll = function () {
  const btn = document.getElementById("backToTopBtn");
  if (!btn) return;
  if (document.body.scrollTop > 200 || document.documentElement.scrollTop > 200) {
    btn.style.display = "block";
  } else {
    btn.style.display = "none";
  }
};