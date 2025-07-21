document.addEventListener('DOMContentLoaded', () => {
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));

  if (!currentUser) {
    document.body.innerHTML = '';
    alert("Please log in to view your cart.");
    window.location.href = "login.html";
    return;
  }

  if (currentUser) {
    loadHeader(() => updateCartCount()); // Update after header loads
    loadFooter();
    loadCart();

    const clearBtn = document.getElementById('clearCartBtn');
    if (clearBtn) {
        clearBtn.addEventListener('click', () => {
        localStorage.removeItem('cart');
        loadCart();
        updateCartCount();
        });
      }
    }
});

function loadCart() {
  const cart = JSON.parse(localStorage.getItem('cart')) || [];
  const cartItemsContainer = document.getElementById('cartItems');
  const totalAmountElement = document.getElementById('totalAmount');
  cartItemsContainer.innerHTML = '';
  let total = 0;

  if (cart.length === 0) {
    cartItemsContainer.innerHTML = '<p>Your cart is empty.</p>';
    totalAmountElement.textContent = '0';
    return;
  }

  cart.forEach((item, index) => {
    total += item.price * item.quantity;

    const itemCard = document.createElement('div');
    itemCard.className = 'col-md-4 mb-3';
    itemCard.innerHTML = `
      <div class="card h-100">
        <img src="${item.image}" class="card-img-top" style="height: 200px; object-fit: contain;" />
        <div class="card-body d-flex flex-column">
          <h5 class="card-title">${item.title}</h5>
          <p class="card-text">$${item.price} x ${item.quantity}</p>
          <div class="d-flex justify-content-between align-items-center my-2">
            <button class="btn btn-sm btn-secondary decrease-btn" data-index="${index}">-</button>
            <span>${item.quantity}</span>
            <button class="btn btn-sm btn-secondary increase-btn" data-index="${index}">+</button>
          </div>
          <button class="btn btn-danger mt-auto remove-item-btn" data-index="${index}">Remove</button>
        </div>
      </div>
    `;
    cartItemsContainer.appendChild(itemCard);
  });

  totalAmountElement.textContent = total.toFixed(2);

  document.querySelectorAll('.remove-item-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const index = e.target.getAttribute('data-index');
      removeItem(index);
    });
  });

  document.querySelectorAll('.increase-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const index = e.target.getAttribute('data-index');
      changeQuantity(index, 1);
      updateCartCount();
    });
  });

  document.querySelectorAll('.decrease-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const index = e.target.getAttribute('data-index');
      changeQuantity(index, -1);
      updateCartCount();
    });
  });

  updateCartCount();
}

function removeItem(index) {
  let cart = JSON.parse(localStorage.getItem('cart')) || [];
  cart.splice(index, 1);
  localStorage.setItem('cart', JSON.stringify(cart));
  loadCart();
  updateCartCount();
}

function changeQuantity(index, delta) {
  let cart = JSON.parse(localStorage.getItem('cart')) || [];
  cart[index].quantity += delta;
  if (cart[index].quantity <= 0) {
    cart.splice(index, 1);
  }
  localStorage.setItem('cart', JSON.stringify(cart));
  loadCart();
}

function updateCartCount() {
  const cart = JSON.parse(localStorage.getItem('cart')) || [];
  const totalCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const badge = document.getElementById('cartCount');
  if (badge) {
    badge.textContent = totalCount;
    badge.style.display = totalCount > 0 ? 'inline-block' : 'none';
  }
}
