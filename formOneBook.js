///////////////////////////////////////////////////////////////////////////////  form


document.addEventListener('DOMContentLoaded', () => {
    // Отримуємо елементи
    const modalOverlay = document.getElementById('modalOverlay');
    const modalContent = document.getElementById('modalContent');
    const openFormButton = document.getElementById('openForm');
    const closeFormButton = document.getElementById('closeForm');
    const orderForm = document.getElementById('orderForm');
    const successMsg = document.getElementById('successMsg');


    // Відкриття модалки
    openFormButton.addEventListener('click', function(e) {

        e.preventDefault();
        modalOverlay.classList.remove('hidden');
        setTimeout(() => {
            modalContent.classList.remove('scale-95', 'opacity-0');
            modalContent.classList.add('scale-100', 'opacity-100');
        }, 100);
    });

    // Закриття модалки
    closeFormButton.addEventListener('click', function() {
        modalOverlay.classList.add('hidden');
        modalContent.classList.remove('scale-100', 'opacity-100');
        modalContent.classList.add('scale-95', 'opacity-0');
    });

    // Отримуємо параметри URL і заповнюємо модальне вікно
    const params = new URLSearchParams(window.location.search);
    const img = params.get('img');
    const title = params.get('title');
    const author = params.get('author');
    const price = parseFloat(params.get('price')) || 1;
    let quantity = parseInt(params.get('quantity')) || 1;

    // Обраховуємо суму
    function calculateTotal(price, quantity) {
        return (price * quantity).toFixed(2);
    }

    // Оновлення інформації про книгу в модальному вікні
    const modalBookPreview = document.getElementById('modalBookPreview');
    modalBookPreview.innerHTML = `

    <div class="border-gray pb-[20px] flex p-[10px] border-2 border-dashed rounded-[20px] w-[300px] h-[150px]">
        <div class="book border-2 rounded-[20px] max-w-[93px] h-[114px] bg-gray-300">
            <img src="${img}" alt="Book cover" class="rounded-[18px] h-[110px] max-w-[90px]" />
        </div>
        <div class="flex flex-col">
            <div class="flex gap-[15px] text-start">
                <div class="flex flex-col gap-[6px]">
                    <p class="scrollName flex pl-[31px] text-gray text-[18px] font-[400] leading-[1.2] font-syne">${title}</p>
                    <p class="scrollAuthor flex pl-[31px] text-gray text-[16px] max-w-[30px] font-[400] leading-[1.2] font-syne">${author}</p>
                </div>
               <div class="text-orange text-[24px] pr-[20px] font-[400] font-syne leading-[1.2]">
                    $${(price * quantity).toFixed(2)}
                </div>
            </div>
            <div class="flex justify-end flex-col h-full pt-[15px]">
                <div class="flex justify-between gap-[10px]">
                    <div class="flex relative items-center w-full pl-[10px] h-[15px] gap-[5px]">
                        <button class="decreaseQuantity max-w-[15px]">
                            <img src="./icon/MINUS_CIRCLE.png" class="w-[40px] h-[16px]">
                        </button>
                        <div id="quantityDisplay" class="flex max-w-[30px] leading-[1.2] justify-center items-center w-[52px] h-[25px] border-2 rounded-[10px] border-gray text-[13px] font-syne font-[400] text-gray">
                            ${quantity}
                        </div>
                        <button class="increaseQuantity max-w-[15px]">
                            <img src="./icon/PLUS_CIRCLE.png" class="w-[40px] h-[16px]">
                        </button>


                    </div>
                </div>

            </div>
        </div>
    </div>
   <p class="font-syne ">Total Price: <span id="totalPrice" class="font-bold font-syne text-orange-500 text-[30px]">$${price}</span></p>
`;

    // Додаємо слухачів на кнопки збільшення/зменшення всередині модального вікна
    const incBtn = modalBookPreview.querySelector('.increaseQuantity');
    const decBtn = modalBookPreview.querySelector('.decreaseQuantity');

    incBtn.addEventListener('click', () => {
        quantity++;
        updateModalQuantity();
    });

    decBtn.addEventListener('click', () => {
        if (quantity > 1) {
            quantity--;
            updateModalQuantity();
        }
    });

//це щоб кількість передалась у форму
    document.querySelector('.increaseQuantity').addEventListener('click', function() {
        quantity++;
        updateTotalPrice(price, quantity);  // Оновлюємо ціну
        updateQuantityDisplay(quantity);    // Оновлюємо кількість
    });

    document.querySelector('.decreaseQuantity').addEventListener('click', function() {
        if (quantity > 1) {  // Кількість не може бути меншою за 1
            quantity--;
            updateTotalPrice(price, quantity);  // Оновлюємо ціну
            updateQuantityDisplay(quantity);    // Оновлюємо кількість
        }
    });

    document.getElementById('quantityDisplay').textContent = quantity;

    // Функція для оновлення кількості та ціни
    function updateModalQuantity() {
        document.getElementById('quantityDisplay').textContent = quantity;
        document.getElementById('totalPrice').textContent = `$${calculateTotal(price, quantity)}`;
    }


    // Обробка форми замовлення
    orderForm.addEventListener('submit', function(e) {
        e.preventDefault();

        // Приховуємо всю форму
        orderForm.classList.add('hidden');

        // Показати повідомлення про успішне замовлення
        successMsg.classList.remove('hidden'); // Показує повідомлення "Замовлення прийнято"

        // Закрити форму через кілька секунд (опціонально)
        setTimeout(() => {
            modalOverlay.classList.add('hidden');
            modalContent.classList.remove('scale-100', 'opacity-100');
            modalContent.classList.add('scale-95', 'opacity-0');
            // Відновлюємо видимість форми та приховуємо повідомлення (якщо потрібно для наступних замовлень)
            orderForm.classList.remove('hidden');
            successMsg.classList.add('hidden');
            orderForm.reset();
        }, 3000);  // Закрити через 3 секунди
    });
});
function updateTotalPrice(price, quantity) {
    const totalPriceElement = document.getElementById('totalPrice');
    totalPriceElement.textContent = `$${(price * quantity).toFixed(2)}`;
}

// Оновлення кількості
function updateQuantityDisplay(quantity) {
    const quantityDisplay = document.getElementById('quantityDisplay');
    quantityDisplay.textContent = quantity;
}

// Ініціалізація при завантаженні сторінки
window.onload = function() {
    updateTotalPrice(price, quantity);   // Оновлюємо ціну одразу на початку
    updateQuantityDisplay(quantity);     // Оновлюємо кількість
};
updateTotalPrice(price, quantity);
