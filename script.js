/************************************************
 * 1. Плавная прокрутка при клике на ссылки меню
 ************************************************/
const navLinks = document.querySelectorAll('.nav__link');
navLinks.forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    const targetId = link.getAttribute('href').substring(1);
    const targetSection = document.getElementById(targetId);
    if (targetSection) {
      targetSection.scrollIntoView({ behavior: 'smooth' });
    }
  });
});
navLinks.forEach(link => {
  link.addEventListener('click', () => {
    navLinks.forEach(navLink => navLink.classList.remove('active'));
    link.classList.add('active');
  });
}
);


/********************************************
 * 2. Фильтрация меню (All, Coffee и т.д.)
 ********************************************/
const filterButtons = document.querySelectorAll('.filter-btn');
const menuItems = document.querySelectorAll('.menu-item');

function filterMenu(category) {
  menuItems.forEach(item => {
    const itemCategory = item.getAttribute('data-category');
    item.style.display = (category === 'all' || itemCategory === category) ? 'block' : 'none';
  });
}

filterButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    filterButtons.forEach(button => button.classList.remove('active'));
    btn.classList.add('active');
    const category = btn.getAttribute('data-category');
    filterMenu(category);
  });
});
filterMenu('all');

/********************************************
 * 3. Функциональность избранного
 ********************************************/
const favorites = []; // массив избранных товаров

const favoriteButtons = document.querySelectorAll('.favorite-btn');
favoriteButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    const productCard = btn.closest('.menu-item');
    const productName = productCard.getAttribute('data-name');
    const productPrice = productCard.getAttribute('data-price');
    const productImg = productCard.querySelector('img').src;
    btn.classList.toggle('favorited');
    const icon = btn.querySelector('i');
    if (btn.classList.contains('favorited')) {
      icon.classList.remove('far');
      icon.classList.add('fas');
      if (!favorites.find(item => item.name === productName)) {
        favorites.push({ name: productName, price: productPrice, img: productImg });
      }
    } else {
      icon.classList.remove('fas');
      icon.classList.add('far');
      const index = favorites.findIndex(item => item.name === productName);
      if (index !== -1) {
        favorites.splice(index, 1);
      }
    }
    updateFavoritesCount();
  });
});

function updateFavoritesCount() {
  document.getElementById('favorites-count').textContent = favorites.length;
}

/********************************************
 * 4. Открытие/закрытие панели корзины
 ********************************************/
const cartBtn = document.getElementById('cart-btn');
const cartOverlay = document.getElementById('cart-panel');
const closeCartBtn = document.getElementById('close-cart-panel');
const cartCount = document.getElementById('cart-count');
const cartItemsContainer = document.getElementById('cart-items');
const cartTotalPrice = document.getElementById('cart-total-price');
const checkoutBtn = document.getElementById('checkout-btn');

cartBtn.addEventListener('click', () => { 
  cartOverlay.style.width = '100%'; 
});
closeCartBtn.addEventListener('click', () => { 
  cartOverlay.style.width = '0'; 
});
cartOverlay.addEventListener('click', (e) => { 
  if (e.target === cartOverlay) cartOverlay.style.width = '0'; 
});

/********************************************
 * 5. Логика корзины с контролами количества
 ********************************************/
let cart = [];

function updateProductCardQuantity(productName, quantity) {
  const productCard = document.querySelector(`.menu-item[data-name="${productName}"]`);
  if (productCard) {
    const addBtn = productCard.querySelector('.add-to-cart-btn');
    const cartControl = productCard.querySelector('.cart-control');
    const quantityDisplay = productCard.querySelector('.quantity-display');
    if (quantity > 0) {
      addBtn.style.display = 'none';
      cartControl.style.display = 'flex';
      quantityDisplay.textContent = quantity;
    } else {
      addBtn.style.display = 'block';
      cartControl.style.display = 'none';
      quantityDisplay.textContent = '0';
    }
  }
}

function updateCartCountDisplay() {
  const totalCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  cartCount.textContent = totalCount;
}

function setItemQuantity(productName, price, quantity) {
  const existingItem = cart.find(item => item.name === productName);
  if (existingItem) {
    existingItem.quantity = quantity;
    if (existingItem.quantity <= 0) {
      cart = cart.filter(item => item.name !== productName);
    }
  } else {
    if (quantity > 0) {
      cart.push({ name: productName, price: parseFloat(price), quantity });
    }
  }
  updateCartCountDisplay();
  renderCart();
}

const productCards = document.querySelectorAll('.menu-item');
productCards.forEach(card => {
  const productName = card.getAttribute('data-name');
  const price = card.getAttribute('data-price');
  const addBtn = card.querySelector('.add-to-cart-btn');
  const cartControl = card.querySelector('.cart-control');
  const decrementBtn = cartControl.querySelector('.decrement-btn');
  const incrementBtn = cartControl.querySelector('.increment-btn');
  const quantityDisplay = cartControl.querySelector('.quantity-display');

  updateProductCardQuantity(productName, 0);

  addBtn.addEventListener('click', () => {
    setItemQuantity(productName, price, 1);
    updateProductCardQuantity(productName, 1);
  });

  incrementBtn.addEventListener('click', () => {
    let currentQty = parseInt(quantityDisplay.textContent);
    currentQty++;
    setItemQuantity(productName, price, currentQty);
    updateProductCardQuantity(productName, currentQty);
  });

  decrementBtn.addEventListener('click', () => {
    let currentQty = parseInt(quantityDisplay.textContent);
    currentQty--;
    setItemQuantity(productName, price, currentQty);
    updateProductCardQuantity(productName, currentQty);
  });
});

function renderCart() {
  cartItemsContainer.innerHTML = '';
  let total = 0;
  cart.forEach((item) => {
    total += item.price * item.quantity;
    
    const itemDiv = document.createElement('div');
    itemDiv.classList.add('cart-item');
    
    const nameSpan = document.createElement('span');
    nameSpan.classList.add('cart-item-name');
    nameSpan.textContent = item.name;
    
    const controlsDiv = document.createElement('div');
    controlsDiv.classList.add('cart-item-controls');
    
    const decBtn = document.createElement('button');
    decBtn.textContent = '–';
    
    const qtySpan = document.createElement('span');
    qtySpan.classList.add('cart-quantity-display');
    qtySpan.textContent = item.quantity;
    
    const incBtn = document.createElement('button');
    incBtn.textContent = '+';
    
    controlsDiv.appendChild(decBtn);
    controlsDiv.appendChild(qtySpan);
    controlsDiv.appendChild(incBtn);
    
    const priceSpan = document.createElement('span');
    priceSpan.classList.add('cart-item-price');
    priceSpan.textContent = '$' + (item.price * item.quantity).toFixed(2);
    
    itemDiv.appendChild(nameSpan);
    itemDiv.appendChild(controlsDiv);
    itemDiv.appendChild(priceSpan);
    
    cartItemsContainer.appendChild(itemDiv);
    
    incBtn.addEventListener('click', () => {
      item.quantity++;
      setItemQuantity(item.name, item.price, item.quantity);
      renderCart();
      updateProductCardQuantity(item.name, item.quantity);
    });
    
    decBtn.addEventListener('click', () => {
      item.quantity--;
      setItemQuantity(item.name, item.price, item.quantity);
      renderCart();
      updateProductCardQuantity(item.name, item.quantity);
    });
  });
  cartTotalPrice.textContent = '$' + total.toFixed(2);
}

/********************************************
 * 6. Оформление заказа (с очисткой корзины)
 ********************************************/
checkoutBtn.addEventListener('click', () => {
  if (cart.length === 0) {
    alert('Your cart is empty!');
    return;
  }
  alert('Thank you for your order!\nTotal: ' + cartTotalPrice.textContent);
  // Очищаем корзину
  cart = [];
  renderCart();
  updateCartCountDisplay(); // Сбрасываем индикатор корзины до 0
  // Сбрасываем количество на карточках товаров
  productCards.forEach(card => {
    const name = card.getAttribute('data-name');
    updateProductCardQuantity(name, 0);
  });
  cartOverlay.style.width = '0';
});

/********************************************
 * 7. Панель избранного
 ********************************************/
const favoritesBtn = document.getElementById('favorites-btn');
const favoritesOverlay = document.getElementById('favorites-panel');
const closeFavoritesBtn = document.getElementById('close-favorites-panel');
const favoritesItemsContainer = document.getElementById('favorites-items');

favoritesBtn.addEventListener('click', () => {
  renderFavorites();
  favoritesOverlay.style.width = '100%';
});
closeFavoritesBtn.addEventListener('click', () => {
  favoritesOverlay.style.width = '0';
});
favoritesOverlay.addEventListener('click', (e) => {
  if (e.target === favoritesOverlay) {
    favoritesOverlay.style.width = '0';
  }
});

function renderFavorites() {
  favoritesItemsContainer.innerHTML = '';
  if (favorites.length === 0) {
    favoritesItemsContainer.innerHTML = '<p>No favorites yet.</p>';
    return;
  }
  favorites.forEach((item, index) => {
    const favDiv = document.createElement('div');
    favDiv.classList.add('favorites-item');
    
    const img = document.createElement('img');
    img.src = item.img;
    img.alt = item.name;
    
    const nameSpan = document.createElement('span');
    nameSpan.classList.add('favorites-item-name');
    nameSpan.textContent = item.name;
    
    const removeBtn = document.createElement('button');
    removeBtn.classList.add('remove-favorite-btn');
    removeBtn.textContent = 'Remove';
    removeBtn.addEventListener('click', () => {
      favorites.splice(index, 1);
      updateFavoritesCount();
      renderFavorites();
      // Обновляем состояние на карточке товара (если она видна)
      const productCard = document.querySelector(`.menu-item[data-name="${item.name}"]`);
      if (productCard) {
        const favBtn = productCard.querySelector('.favorite-btn');
        if (favBtn.classList.contains('favorited')) {
          favBtn.classList.remove('favorited');
          const icon = favBtn.querySelector('i');
          icon.classList.remove('fas');
          icon.classList.add('far');
        }
      }
    });
    
    favDiv.appendChild(img);
    favDiv.appendChild(nameSpan);
    favDiv.appendChild(removeBtn);
    favoritesItemsContainer.appendChild(favDiv);
  });
}

/********************************************
 * 8. Авторизация (регистрация / логин / логаут)
 ********************************************/
const userBtn = document.getElementById('user-btn');
const userModal = document.getElementById('user-modal');
const closeUserModalBtn = document.getElementById('close-user-modal');

const loginForm = document.getElementById('login-form');
const registerForm = document.getElementById('register-form');
const loggedInInfo = document.getElementById('logged-in-info');

const loginUsernameInput = document.getElementById('login-username');
const loginPasswordInput = document.getElementById('login-password');
const loginSubmitBtn = document.getElementById('login-submit');

const registerUsernameInput = document.getElementById('register-username');
const registerPasswordInput = document.getElementById('register-password');
const registerPassword2Input = document.getElementById('register-password2');
const registerSubmitBtn = document.getElementById('register-submit');

const showRegisterLink = document.getElementById('show-register');
const showLoginLink = document.getElementById('show-login');

const loggedInUsernameSpan = document.getElementById('logged-in-username');
const logoutBtn = document.getElementById('logout-btn');

let users = JSON.parse(localStorage.getItem('users')) || [];
let loggedInUser = localStorage.getItem('loggedInUser') || null;

function showLoginForm() {
  loginForm.classList.add('active');
  registerForm.classList.remove('active');
  loggedInInfo.classList.remove('active');
}
function showRegisterForm() {
  registerForm.classList.add('active');
  loginForm.classList.remove('active');
  loggedInInfo.classList.remove('active');
}
function showLoggedInInfo() {
  loggedInInfo.classList.add('active');
  loginForm.classList.remove('active');
  registerForm.classList.remove('active');
  loggedInUsernameSpan.textContent = loggedInUser;
}

function saveUsers() {
  localStorage.setItem('users', JSON.stringify(users));
}
function saveLoggedInUser() {
  if (loggedInUser) {
    localStorage.setItem('loggedInUser', loggedInUser);
  } else {
    localStorage.removeItem('loggedInUser');
  }
}

function checkAuthState() {
  if (loggedInUser) {
    showLoggedInInfo();
  } else {
    showLoginForm();
  }
}
checkAuthState();

userBtn.addEventListener('click', () => { userModal.style.display = 'flex'; });
closeUserModalBtn.addEventListener('click', () => { userModal.style.display = 'none'; });
window.addEventListener('click', (e) => { if (e.target === userModal) userModal.style.display = 'none'; });

showRegisterLink.addEventListener('click', (e) => { e.preventDefault(); showRegisterForm(); });
showLoginLink.addEventListener('click', (e) => { e.preventDefault(); showLoginForm(); });

function registerUser(username, password) {
  const existingUser = users.find(u => u.username === username);
  if (existingUser) {
    alert('Username already taken!');
    return false;
  }
  users.push({ username, password });
  saveUsers();
  return true;
}

registerSubmitBtn.addEventListener('click', () => {
  const username = registerUsernameInput.value.trim();
  const password = registerPasswordInput.value.trim();
  const password2 = registerPassword2Input.value.trim();

  if (!username || !password) {
    alert('Please fill all fields!');
    return;
  }
  if (password !== password2) {
    alert('Passwords do not match!');
    return;
  }

  const success = registerUser(username, password);
  if (success) {
    alert('Registration successful! You can now log in.');
    registerUsernameInput.value = '';
    registerPasswordInput.value = '';
    registerPassword2Input.value = '';
    showLoginForm();
  }
});

function loginUser(username, password) {
  const user = users.find(u => u.username === username && u.password === password);
  if (user) {
    loggedInUser = user.username;
    saveLoggedInUser();
    return true;
  }
  return false;
}

loginSubmitBtn.addEventListener('click', () => {
  const username = loginUsernameInput.value.trim();
  const password = loginPasswordInput.value.trim();

  if (!username || !password) {
    alert('Please fill all fields!');
    return;
  }

  const success = loginUser(username, password);
  if (success) {
    alert('Login successful!');
    loginUsernameInput.value = '';
    loginPasswordInput.value = '';
    showLoggedInInfo();
  } else {
    alert('Invalid credentials!');
  }
});

logoutBtn.addEventListener('click', () => {
  loggedInUser = null;
  saveLoggedInUser();
  alert('You have been logged out!');
  showLoginForm();
});