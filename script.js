// 📌 DOM Elements
const API_URL = "https://interveiw-mock-api.vercel.app/api/getProducts";
const loadBtn = document.getElementById("loadBtn");              // loadbtn container
const emptystate = document.getElementById("emptystate");       // Empty state container
const productgrid = document.getElementById("productgrid");     // Product cards container
const sort = document.getElementById("sort");                   // Sort dropdown
const pcount = document.getElementById("pcount");               // Product count display
const mainContent = document.querySelector(".main");            // Main content section
const loaderScreen = document.getElementById("loader-wrapper"); // Loader screen

let products = []; // Holds fetched product data

// 🚀 Page loader animation: Hides loader and shows main content after 3 seconds
window.addEventListener("load", () => {
  setTimeout(() => {
    loaderScreen.style.display = "none";      // Hide loader
    mainContent.style.display = "block";      // Show main content
  }, 3000); // Match this delay with your loader CSS animation duration
});

// 🎯 Load button click event (fetches products and displays them)
loadBtn.addEventListener("click", async () => {
  loadBtn.classList.add("loading"); // Start button animation

  // Wait for animation to play before starting fetch
  setTimeout(async () => {
    try {
      const res = await fetch(API_URL);           // Fetch product data from API
      const result = await res.json();            // Parse JSON response
      console.log(result);                        // Debug log

      // Transform product data into simpler format
      products = result.data.map((item) => {
        const p = item.product;
        return {
          title: p.title,
          price: parseFloat(p.variants[0].price),
          image: p.image?.src || "https://via.placeholder.com/200",
          description: p.product_type || p.tags || "Product",
        };
      });

      renderProducts(products);                   // Render the products
      console.log("Rendering products:", products); // Debug log

    } catch (err) {
      console.error("Error fetching products:", err); // Error log
      productgrid.innerHTML = "<p style='color:red;'>Failed to load products.</p>"; // Error message
    } finally {
      loadBtn.classList.remove("loading"); // Stop button animation
    }
  }, 1000); // Delay for loader dots animation
});

// 🔁 Sorting event handler (based on price)
sort.addEventListener("change", () => {
  if (!products.length) return; // Do nothing if no products are loaded

  const sorted = [...products]; // Copy the array to sort without mutating original

  // Sort logic
  if (sort.value === "low") {
    sorted.sort((a, b) => a.price - b.price); // Low to high
  } else if (sort.value === "high") {
    sorted.sort((a, b) => b.price - a.price); // High to low
  }

  renderProducts(sorted); // Render sorted products
});

// 🧩 Function to render products to the DOM
function renderProducts(productList) {
  if (!pcount || !productgrid || !emptystate) return; // Safety check

  productgrid.innerHTML = "";                          // Clear existing cards
  pcount.innerText = `${productList.length} Products`; // Update product count

  if (productList.length === 0) {
    emptystate.style.display = "block";                // Show empty state if no products
    return;
  } else {
    emptystate.style.display = "none";                 // Hide empty state
  }

  // Create and add each product card with a delay for animation
  productList.forEach((product, index) => {
    const delay = index * 200; // Staggered animation delay

    setTimeout(() => {
      // Create product card element
      const card = document.createElement("div");
      card.className = "card";

      // Set initial animation styles
      card.style.opacity = "0";
      card.style.transform = "translateY(20px)";
      card.style.transition = "opacity 0.5s ease, transform 0.5s ease";

      // Set card content
      card.innerHTML = `
        <img src="${product.image}" alt="${product.title}" />
        <h3>${product.title}</h3>
        <div class="price">Rs. ${product.price.toFixed(2)}</div>
        <button class="add-btn">ADD TO CART</button>
      `;

      productgrid.appendChild(card); // Append to product grid

      // Trigger fade-in animation
      requestAnimationFrame(() => {
        card.style.opacity = "1";
        card.style.transform = "translateY(0)";
      });
    }, delay); // Stagger based on index
  });
}
