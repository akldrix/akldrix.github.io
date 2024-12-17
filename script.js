let cart = [];
let totalPrice = 0;

// Функция для добавления 1 товара в корзину
function addToCart(item, price) {
  const existingItem = cart.find((cartItem) => cartItem.name === item);

  if (existingItem) {
    existingItem.quantity++;
  } else {
    cart.push({ name: item, quantity: 1, price });
  }

  totalPrice += price;
  updateCart();
  showNotification(`${item} добавлен в корзину!`);
}
// Функция для удаления товара из корзины
function deleteFromCart(item, price) {
  const existingItem = cart.find((cartItem) => cartItem.name === item);

  if (existingItem && existingItem.quantity > 1) {
    existingItem.quantity--;
    totalPrice -= price;
  } else if (existingItem && existingItem.quantity === 1) {
    cart = cart.filter((cartItem) => cartItem.name !== item);
    totalPrice -= price;
  }

  updateCart();
  if (existingItem.quantity == 0) {
    showNotification();
  } else showNotification(`${item} удален из корзины!`);
}

// Добавление всех товаров в корзину
function addAllToCart() {
  const menuItems = document.querySelectorAll(".menu-item");
  menuItems.forEach((menuItem) => {
    const itemName = menuItem.querySelector("span:first-child").textContent;
    const itemPrice = parseInt(menuItem.dataset.price, 10);
    addToCart(itemName, itemPrice);
  });

  showNotification("Все товары добавлены в корзину!");
}

// Обновление корзины
function updateCart() {
  const cartItems = document.getElementById("cart-items");
  cartItems.innerHTML = "";

  cart.forEach((item) => {
    const listItem = document.createElement("li");
    listItem.textContent = `${item.name} - ${item.quantity} шт.`;

    const quantityControl = document.createElement("input");
    quantityControl.type = "number";
    quantityControl.value = item.quantity;
    quantityControl.min = "1";
    quantityControl.addEventListener("change", (event) => {
      updateQuantity(item.name, event.target.value);
    });

    listItem.appendChild(quantityControl);
    cartItems.appendChild(listItem);
  });

  document.getElementById("total-price").textContent = `Итого: ${totalPrice} ₽`;
  document.getElementById("cart-count").textContent = cart.reduce(
    (sum, item) => sum + item.quantity,
    0
  );
}

// Обновление количества товаров
function updateQuantity(name, quantity) {
  const item = cart.find((cartItem) => cartItem.name === name);
  if (item) {
    totalPrice += (quantity - item.quantity) * item.price;
    item.quantity = Number(quantity);
    updateCart();
  }
}
function showNotification(message) {
  const notification = document.getElementById("notification");
  notification.textContent = message;
  notification.classList.remove("hidden");
  notification.classList.add("show");

  setTimeout(() => {
    notification.classList.add("hidden");
    notification.classList.remove("show");
  }, 1000);
}

// Переключение между страницами
function showPage(page) {
  const menuPage = document.getElementById("menu-page");
  const cartPage = document.getElementById("cart-page");
  const filters = document.getElementById("filters"); // Контейнер с кнопками фильтра

  if (page === "cart") {
    cartPage.classList.remove("hidden"); // Показываем корзину
    menuPage.classList.add("hidden");
    filters.classList.add("hidden");
  } else if (page === "menu") {
    cartPage.classList.add("hidden");
    menuPage.classList.remove("hidden");
    filters.classList.remove("hidden");

    filterCategory("all");
  }
}

// Оформление заказа
function placeOrder() {
  // Проверяем, пустая ли корзина
  if (cart.length === 0) {
    showNotification(
      "Ваша корзина пуста. Пожалуйста, добавьте товары в корзину!"
    );
    return; // Выход из функции, если корзина пуста
  } else if (totalPrice < 1) {
    showNotification(
      "Ваша корзина пуста. Пожалуйста, добавьте товары в корзину!"
    );
    return;
  }
  const address = document.getElementById("address").value;
  if (address.trim() === "") {
    showNotification("Пожалуйста, введите адрес доставки.");
    return;
  }

  const comment = document.getElementById("comment").value;

  // Уведомление о создании заказа
  showNotification("Заказ оформлен! Спасибо!");

  // Очистить корзину без уведомления
  clearOldCart(); // Корзина очищается

  // Вернуться на страницу меню
  showPage("menu");

  deleteAdress();
  deleteComment();
}

function deleteAdress() {
  address.value = "";
}
function deleteComment() {
  comment.value = "";
}

// Очистить корзину

function deleteCart() {
  cart = [];
  totalPrice = 0;
}
deleteCart();
updateCart();
// Вернуться на страницу меню
showPage("menu");
function clearCart() {
  cart = []; // Очищаем массив корзины

  totalPrice = 0; // Сбрасываем общую цену
  updateCart(); // Обновляем корзину на странице
  showNotification("Корзина пуста!");
}
function clearOldCart() {
  cart = [];

  totalPrice = 0;
  updateCart();
}
function emptyCart() {
  if (totalPrice < 1) {
    clearOldCart();
  }
}
emptyCart();

function filterCategory(category) {
  const menuItems = document.querySelectorAll(".menu-item");

  menuItems.forEach((item) => {
    if (category === "all") {
      item.classList.remove("hidden");
    } else {
      const itemCategory = item.getAttribute("data-category");
      if (itemCategory === category) {
        item.classList.remove("hidden");
      } else {
        item.classList.add("hidden");
      }
    }
  });
}
window.onload = function(){
let loader = document.getElementById('loader');
let image = document.getElementById('img');

loader.style.display = 'block';
image.onload = function(){
  loader.style.display = 'none';
  image.style.display = 'block';
}
}