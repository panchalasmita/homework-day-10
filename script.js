// 1. Store food data using an Array of Objects
const foodData = [
    {
        id: 1,
        name: "Classic Cheeseburger",
        image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500",
        description: "Juicy beef patty with melted cheddar, fresh lettuce, tomatoes, and our secret sauce.",
        price: 8.99,
        rating: 4.5,
        isSpecial: false
    },
    {
        id: 2,
        name: "Margherita Pizza",
        image: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=500",
        description: "Traditional Italian pizza with fresh mozzarella, tomatoes, and basil.",
        price: 12.50,
        rating: 4.8,
        isSpecial: true
    },
    {
        id: 3,
        name: "Chicken Biryani",
        image: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=500",
        description: "Aromatic basmati rice cooked with tender chicken and authentic spices.",
        price: 14.99,
        rating: 4.7,
        isSpecial: true
    },
    {
        id: 4,
        name: "Caesar Salad",
        image: "https://images.unsplash.com/photo-1546793665-c74683f339c1?w=500",
        description: "Crisp romaine lettuce, croutons, parmesan cheese, and classic Caesar dressing.",
        price: 7.99,
        rating: 4.2,
        isSpecial: false
    },
    {
        id: 5,
        name: "Sushi Platter",
        image: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=500",
        description: "Assorted fresh sushi rolls including salmon, tuna, and avocado.",
        price: 18.99,
        rating: 4.9,
        isSpecial: true
    }
];

// Cart State
let cart = [];

// 2. Dynamically display food items using JavaScript DOM Manipulation
function renderMenu() {
    const menuContainer = document.getElementById('food-container');
    const specialContainer = document.getElementById('special-container');
    
    menuContainer.innerHTML = '';
    specialContainer.innerHTML = '';

    foodData.forEach(food => {
        const card = createFoodCard(food);
        menuContainer.appendChild(card);

        if (food.isSpecial) {
            specialContainer.appendChild(createFoodCard(food));
        }
    });
}

function createFoodCard(food) {
    const div = document.createElement('div');
    div.className = 'food-card';
    div.onclick = () => openModal(food);
    div.innerHTML = `
        <img src="${food.image}" alt="${food.name}">
        <div class="food-info">
            <h3>${food.name}</h3>
            <p class="price">$${food.price.toFixed(2)}</p>
            <p>⭐ ${food.rating}</p>
        </div>
    `;
    return div;
}

// 3. Modal Logic for Complete Details
function openModal(food) {
    document.getElementById('modal-img').src = food.image;
    document.getElementById('modal-name').innerText = food.name;
    document.getElementById('modal-desc').innerText = food.description;
    document.getElementById('modal-price').innerText = food.price.toFixed(2);
    document.getElementById('modal-rating').innerText = food.rating;
    
    // Set up the Add to Cart button inside the modal
    const addBtn = document.getElementById('modal-add-btn');
    addBtn.onclick = () => {
        addToCart(food.id);
        closeModal();
    };
    
    document.getElementById('food-modal').classList.remove('hidden');
}

function closeModal() {
    document.getElementById('food-modal').classList.add('hidden');
}

// 4. Cart Logic
function addToCart(foodId) {
    const food = foodData.find(item => item.id === foodId);
    const existingItem = cart.find(item => item.id === foodId);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ ...food, quantity: 1 });
    }
    
    updateCartUI();
    alert(`${food.name} added to cart!`);
}

function updateQuantity(foodId, change) {
    const item = cart.find(item => item.id === foodId);
    if (item) {
        item.quantity += change;
        if (item.quantity <= 0) {
            cart = cart.filter(i => i.id !== foodId);
        }
    }
    updateCartUI();
}

function updateCartUI() {
    const cartItemsContainer = document.getElementById('cart-items');
    const cartCount = document.getElementById('cart-count');
    const orderSummary = document.getElementById('order-summary');
    
    cartCount.innerText = cart.reduce((sum, item) => sum + item.quantity, 0);

    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<p>Your cart is empty.</p>';
        orderSummary.classList.add('hidden');
        return;
    }

    orderSummary.classList.remove('hidden');
    cartItemsContainer.innerHTML = '';
    
    let subtotal = 0;

    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        subtotal += itemTotal;

        const div = document.createElement('div');
        div.className = 'cart-item';
        div.innerHTML = `
            <div>
                <h4>${item.name}</h4>
                <p>$${item.price.toFixed(2)} each</p>
            </div>
            <div class="qty-controls">
                <button onclick="updateQuantity(${item.id}, -1)">-</button>
                <span style="margin: 0 10px;">${item.quantity}</span>
                <button onclick="updateQuantity(${item.id}, 1)">+</button>
            </div>
            <div>
                <strong>$${itemTotal.toFixed(2)}</strong>
            </div>
        `;
        cartItemsContainer.appendChild(div);
    });

    const tax = subtotal * 0.10;
    const total = subtotal + tax;

    document.getElementById('subtotal').innerText = subtotal.toFixed(2);
    document.getElementById('tax').innerText = tax.toFixed(2);
    document.getElementById('total-amount').innerText = total.toFixed(2);
    document.getElementById('payment-total').innerText = total.toFixed(2);
}

// 5. Navigation Logic
function showSection(sectionId) {
    document.querySelectorAll('.section').forEach(section => {
        section.classList.remove('active');
    });
    document.getElementById(sectionId).classList.add('active');
    window.scrollTo(0, 0);
}

// 6. Payment Gateway Simulation (Async/Await, Promise, setTimeout)
function simulatePaymentProcessing() {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve("Success");
        }, 3000); // Simulate 3 seconds of processing
    });
}

async function handlePlaceOrder() {
    const placeOrderBtn = document.getElementById('place-order-btn');
    const processingMsg = document.getElementById('processing-msg');
    
    // Show processing state
    placeOrderBtn.classList.add('hidden');
    processingMsg.classList.remove('hidden');

    // Await the promise
    await simulatePaymentProcessing();

    // Generate random Order ID
    const orderId = 'ORD-' + Math.floor(100000 + Math.random() * 900000);
    document.getElementById('order-id').innerText = orderId;

    // Hide processing, show confirmation
    processingMsg.classList.add('hidden');
    showSection('confirmation');
}

function resetApp() {
    cart = [];
    updateCartUI();
    document.getElementById('place-order-btn').classList.remove('hidden');
    showSection('home');
}

// Initialize the app
document.addEventListener('DOMContentLoaded', () => {
    renderMenu();
});