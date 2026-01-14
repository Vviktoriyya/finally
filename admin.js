
(() => {
    'use strict';

    const STORAGE_KEY = 'orders';

    const els = {
        list: document.getElementById('list'),
        refresh: document.getElementById('refresh'),
        clearAll: document.getElementById('clearAll'),
        status: document.getElementById('status'),
    };

    // --- Утиліти ---
    const formatPrice = (p) => (parseFloat(p) || 0).toFixed(2);

    const formatDate = (iso) => {
        const d = new Date(iso);
        return isNaN(d.getTime()) ? 'Дата невідома' : d.toLocaleString('uk-UA');
    };

    // --- Логіка даних ---
    const loadOrders = () => {
        try {
            const data = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
            // Сортування: нові зверху
            return data.sort((a, b) => new Date(b.submittedAt || 0) - new Date(a.submittedAt || 0));
        } catch (e) {
            console.error("Помилка читання localStorage", e);
            return [];
        }
    };

    const saveOrders = (orders) => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(orders));
    };

    // --- Рендер картки (Ваш дизайн) ---
    const createOrderCard = (order, index, totalCount) => {
        const isSingle = order.orderType === 'single';
        const orderId = totalCount - index;
        const statusBadge = order.status === 'done'
            ? '<span class="px-3 mb-2 py-1 bg-green-100 text-green-800 rounded-[10px] text-sm border-2 border-green-800">Завершено</span>'
            : '<span class="px-3 py-1 mb-2 bg-blue-100 text-blue-800 rounded-[10px] text-sm border-2 border-blue-800">Нове</span>';

        // Формування списку книг
        let booksHTML = '';
        if (isSingle) {
            booksHTML = `
                <div class="flex  gap-4 p-4 bg-gray-50 rounded-[10px] border-2 border-dashed border-gray-300">
                    <img src="${order.book.img}" class="w-20 h-28 object-cover rounded-[8px] border-2 border-gray-300">
                    <div class="flex-1">
                        <p class="font-bold text-gray-800 text-lg">${order.book.title}</p>
                        <p class="text-gray-600">Автор: ${order.book.author}</p>
                        <p class="text-orange-500 font-bold text-xl mt-2">Сума: $${formatPrice(order.book.totalPrice)}</p>
                    </div>
                </div>`;
        } else {
            booksHTML = `
                <div class="space-y-3">
                    ${order.books.items.map(book => `
                        <div class="flex gap-4 p-4 bg-gray-50 rounded-[10px] border-2 border-dashed border-gray-300">
                            <img src="${book.img}" class="w-16 h-24 object-cover rounded-[8px] border-2 border-gray-300">
                            <div class="flex-1">
                                <p class="font-bold text-gray-800">${book.title}</p>
                                <p class="text-sm text-gray-600">Кількість: ${book.quantity} шт.</p>
                                <p class="text-orange-500 font-semibold">$${formatPrice(book.itemTotal)}</p>
                            </div>
                        </div>
                    `).join('')}
                    <div class="p-4 bg-orange-50 rounded-[10px] border-2 border-orange-300">
                        <p class="text-orange-500 font-bold text-2xl">Разом: $${formatPrice(order.books.totalPrice)}</p>
                    </div>
                </div>`;
        }

        return `
            <div class="order-card p-6 bg-white rounded-[20px] shadow-lg border-2 border-gray-800 mb-6 ${order.status === 'done' ? 'opacity-75' : ''}">
                <div class="flex justify-between items-start mb-4 pb-4 border-b-2 border-dashed border-gray-300">
                    <div>
                        <h3 class="text-xl font-bold text-gray-800">Замовлення #${orderId}</h3>
                        <p class="text-sm text-gray-500">${formatDate(order.submittedAt)}</p>
                        <div class="mt-2 flex gap-2">${statusBadge}</div>
                    </div>
                    <div class="flex gap-2">
                        <button data-action="toggle" data-index="${index}" class="px-3 py-1 bg-yellow-400 border-2 border-gray-800 rounded-[10px] hover:bg-yellow-500 font-syne text-sm">
                            ${order.status === 'done' ? 'Відновити' : '✔ Готово'}
                        </button>
                        <button data-action="delete" data-index="${index}" class="px-3 py-1 bg-red-500 text-white border-2 border-gray-800 rounded-[10px] hover:bg-red-600 font-syne text-sm">
                            Видалити
                        </button>
                    </div>
                </div>
                
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 p-4 bg-gray-50 rounded-[15px] border-2 border-gray-200">
                    <div><p class="text-xs text-gray-400 uppercase">Клієнт</p><p class="font-bold">${order.firstName} ${order.lastName}</p></div>
                    <div><p class="text-xs text-gray-400 uppercase">Телефон</p><p class="font-bold">${order.phone}</p></div>
                    <div><p class="text-xs text-gray-400 uppercase">Email</p><p class="font-bold text-blue-600">${order.email || '—'}</p></div>
                    <div class="md:col-span-2"><p class="text-xs text-gray-400 uppercase">Адреса</p><p class="font-medium">${order.address}</p></div>
                </div>

                <h4 class="font-bold text-gray-700 mb-3 font-syne uppercase text-xs tracking-widest">Склад замовлення:</h4>
                ${booksHTML}
            </div>`;
    };

    const render = () => {
        const orders = loadOrders();
        els.status.textContent = `Замовлень: ${orders.length}`;

        if (orders.length === 0) {
            els.list.innerHTML = `
                <div class="p-10 bg-white rounded-[20px] border-2 border-dashed border-gray-300 text-center">
                    <p class="text-gray-400 font-syne">Список замовлень порожній</p>
                </div>`;
            return;
        }

        els.list.innerHTML = orders.map((o, i) => createOrderCard(o, i, orders.length)).join('');
    };

    // --- Події ---
    els.list.addEventListener('click', (e) => {
        const btn = e.target.closest('[data-action]');
        if (!btn) return;

        const action = btn.dataset.action;
        const index = parseInt(btn.dataset.index);
        let orders = loadOrders();

        if (action === 'delete') {
            if (confirm('Видалити замовлення?')) {
                orders.splice(index, 1);
            }
        } else if (action === 'toggle') {
            orders[index].status = orders[index].status === 'done' ? 'new' : 'done';
        }

        saveOrders(orders);
        render();
    });

    els.clearAll.addEventListener('click', () => {
        if (confirm('Очистити всю базу замовлень?')) {
            localStorage.removeItem(STORAGE_KEY);
            render();
        }
    });

    els.refresh.addEventListener('click', render);

    // Ініціалізація
    render();
    setInterval(render, 10000); // Автооновлення кожні 10 сек
})();