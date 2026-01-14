// Функція для ініціалізації модальної форми
function initModalForm() {
    const modalOverlay1 = document.getElementById('modalOverlay1');
    const modalContent1 = document.getElementById('modalContent1');
    const closeFormButton1 = document.getElementById('closeForm1');
    const orderForm1 = document.getElementById('orderForm1');
    const modalBookPreview1 = document.getElementById('modalBookPreview1');

    // Делегування подій для кнопки "Buy All"
    document.addEventListener('click', function(e) {
        // Перевіряємо, чи клік був по кнопці або її дочірньому елементу
        if (e.target.closest('#openFormTwo')) {
            e.preventDefault();
            const cartBooks = JSON.parse(localStorage.getItem('cartBooks')) || [];

            if (cartBooks.length === 0) {
                alert("Your cart is empty!");
                return;
            }

            // Показуємо модальне вікно
            modalOverlay1.classList.remove('hidden');
            setTimeout(() => {
                modalContent1.classList.remove('scale-95', 'opacity-0');
                modalContent1.classList.add('scale-100', 'opacity-100');
            }, 10);

            // Заповнюємо форму товарами
            displayCartItemsInForm();
        }
    });

    // Закриття форми
    closeFormButton1.addEventListener('click', function() {
        modalOverlay1.classList.add('hidden');
        modalContent1.classList.remove('scale-100', 'opacity-100');
        modalContent1.classList.add('scale-95', 'opacity-0');
    });

    // Функція для відображення товарів у формі
    function displayCartItemsInForm() {
        const cartBooks = JSON.parse(localStorage.getItem('cartBooks')) || [];
        let html = '';
        let totalPrice = 0;

        if (cartBooks.length === 0) {
            html = '<div class="flex pt-[30px]"><p class="font-syne pt-[20px] text-orange-500 text-[30px] font-500">Your cart is empty 🛒</p></div>';
        } else {
            cartBooks.forEach((book, index) => {
                const price = parseFloat(book.price.replace('$', '')) || 0;
                const quantity = parseInt(book.quantity) || 1;
                const itemTotal = price * quantity;
                totalPrice += itemTotal;

                html += `
                    <div class="border-gray pb-[20px] flex p-[10px] border-2 border-dashed rounded-[20px] h-[150px] mb-4">
                        <div class="book border-2 rounded-[20px] max-w-[93px] h-[114px] bg-gray-300">
                            <img src="${book.img}" alt="Book cover" class="rounded-[18px] h-[100px] max-w-[90px]" />
                        </div>
                        <div class="flex flex-col">
                            <div class="flex gap-[15px]  ">
                                <div class="flex flex-col gap-[6px]">
                                    <p class="scrollName flex pl-[10px] text-gray lg:text-[18px] xs:text-[12px] font-[400] leading-[1.2] font-syne">${book.title}</p>
                                    <p class="scrollAuthor flex pl-[10px] text-gray lg:text-[16px] xs:text-[10px]  font-[400] leading-[1.2] font-syne">${book.author}</p>
                                </div>
                                <div class="text-orange text-[24px]  pr-[20px] font-[400] font-syne  leading-[1.2]">
                                    $${price.toFixed(2)}
                                </div>
                            </div>
                            <div class="flex justify-end flex-col h-full pt-[15px]">
                                <div class="flex justify-between gap-[10px]">
                                    <div class="flex relative items-center w-full pl-[10px] h-[15px] gap-[10px]">
                                        <button class="decreaseQuantity1" data-index="${index}">
                                            <img src="./icon/MINUS_CIRCLE.png" class="w-[16px] h-[16px]">
                                        </button>
                                        <div class="flex max-w-[30px] leading-[1.2] justify-center items-center w-[52px] h-[25px] border-2 rounded-[10px] border-gray text-[13px] font-syne font-[400] text-gray">
                                            ${quantity}
                                        </div>
                                        <button class="increaseQuantity1" data-index="${index}">
                                            <img src="./icon/PLUS_CIRCLE.png" class="w-[16px] h-[16px]">
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                `;
            });

            html += `<p class="font-syne mt-4">Total Price: <span id="totalPrice1" class="font-bold font-syne text-orange-500 text-[30px]">$${totalPrice.toFixed(2)}</span></p>
            <div class="hidden lg:block ">
                <img src="./img/book.gif" class=" sm:w-[50px]  lg:w-[300px]" alt="">
            </div>`;
        }

        modalBookPreview1.innerHTML = html;

        // Додаємо обробники для кнопок зміни кількості
        document.querySelectorAll('.increaseQuantity1').forEach(button => {
            button.addEventListener('click', function() {
                const cartBooks = JSON.parse(localStorage.getItem('cartBooks')) || [];
                const index = this.getAttribute('data-index');
                if (cartBooks[index]) {
                    cartBooks[index].quantity = Math.max(1, parseInt(cartBooks[index].quantity) + 1);
                    localStorage.setItem('cartBooks', JSON.stringify(cartBooks));
                    displayCartItemsInForm();
                }
            });
        });

        document.querySelectorAll('.decreaseQuantity1').forEach(button => {
            button.addEventListener('click', function() {
                const cartBooks = JSON.parse(localStorage.getItem('cartBooks')) || [];
                const index = this.getAttribute('data-index');
                if (cartBooks[index]) {
                    cartBooks[index].quantity = Math.max(1, parseInt(cartBooks[index].quantity) - 1);
                    localStorage.setItem('cartBooks', JSON.stringify(cartBooks));
                    displayCartItemsInForm();
                }
            });
        });
    }

    // Обробник форми замовлення
    orderForm1?.addEventListener('submit', function(e) {
        e.preventDefault();
        orderForm1.classList.add('hidden');
        document.getElementById('successMsg1').classList.remove('hidden');

        setTimeout(() => {
            modalOverlay1.classList.add('hidden');
            modalContent1.classList.remove('scale-100', 'opacity-100');
            modalContent1.classList.add('scale-95', 'opacity-0');
            orderForm1.classList.remove('hidden');
            document.getElementById('successMsg1').classList.add('hidden');
        }, 2000);
    });
}

// Ініціалізація при завантаженні сторінки
document.addEventListener('DOMContentLoaded', function() {
    initModalForm();

    // Додаткові перевірки
    console.log('Modal form initialized');
    console.log('Buy All button exists:', !!document.getElementById('openFormTwo'));
    console.log('Modal overlay exists:', !!document.getElementById('modalOverlay1'));
});