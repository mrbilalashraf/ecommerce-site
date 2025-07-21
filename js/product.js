document.addEventListener("DOMContentLoaded", () => {
  loadHeader();
  
  const urlParams = new URLSearchParams(window.location.search);
  const productId = urlParams.get("id");
  
  if (productId) {
      fetch(`https://fakestoreapi.com/products/${productId}`)
      .then(res => res.json())
      .then(product => renderProductDetail(product))
      .catch(err => {
          document.getElementById("productDetail").innerHTML = `<p class="text-danger">Product not found</p>`;
          console.error("Error fetching product:", err);
        });
    }
});

function renderProductDetail(product) {
    const detailContainer = document.getElementById("productDetail");
    
    detailContainer.innerHTML = `
    <div class="col-md-6">
    <img src="${product.image}" alt="${product.title}" class="img-fluid" style="max-height: 400px; object-fit: contain;">
    </div>
    <div class="col-md-6">
    <h2>${product.title}</h2>
    <p class="text-muted">${product.category}</p>
    <h4 class="text-primary">$${product.price}</h4>
    <p>${product.description}</p>
    <button class="btn btn-primary" id="addToCartBtn">Add to Cart</button>
    </div>
    `;

    // Add to cart functionality
    document.getElementById("addToCartBtn").addEventListener("click", () => {
        addToCart(product);
        alert("Product added to cart!");
    });
    loadFooter();
}
