const input = document.querySelector('input[type="search"]');
const searchBtn = document.querySelector('button img[alt="Search"]').parentElement;
const findBtn = document.getElementById('find-btn');
const searchResultsWrapper = document.getElementById('search-results-wrapper');
const searchResultsContainer = document.querySelector('#search-results .flex');
const trendingBooksContainer = document.getElementById('books')?.querySelector('.flex');

// При пошуку "звичних" книг — оновлюється блок Trending
searchBtn.addEventListener('click', async () => {
    const query = input.value.trim();
    if (!query) return;

    const response = await fetch(`https://openlibrary.org/search.json?q=${encodeURIComponent(query)}`);
    const data = await response.json();
    renderBooks(data.docs.slice(0, 50), trendingBooksContainer);
});

// При натисканні на Find — показується окремий блок над Trending
findBtn?.addEventListener('click', async (e) => {
    e.preventDefault();
    const query = input?.value.trim();
    if (!query) return;

    const response = await fetch(`https://openlibrary.org/search.json?q=${encodeURIComponent(query)}`);
    const data = await response.json();

    // Показуємо блок пошуку (він прихований за замовчуванням)
    searchResultsWrapper.classList.remove('hidden');

    // Прокрутка до результатів
    searchResultsWrapper.scrollIntoView({ behavior: 'smooth' });

    renderBooks(data.docs.slice(0, 50), searchResultsContainer);
});

// Завантаження популярних книг при старті
document.addEventListener('DOMContentLoaded', async () => {
    const response = await fetch(`https://openlibrary.org/search.json?q=the+lord+of+the+rings`);
    const data = await response.json();
    renderBooks(data.docs.slice(0, 100), trendingBooksContainer);
});

// Функція рендеру книг
function renderBooks(books, container) {
    if (!container) return;
    container.innerHTML = '';

    books.forEach(book => {
        const coverId = book.cover_i;
        const title = book.title;
        const author = book.author_name ? book.author_name.join(', ') : 'Unknown Author';
        const year = book.first_publish_year || 'N/A';
        const hasImage = !!coverId;

        const imgUrl = hasImage
            ? `https://covers.openlibrary.org/b/id/${coverId}-M.jpg`
            : './img/bookk.jpg';

        const card = document.createElement('div');
        card.className = `border-2 rounded-[10px] w-[187px] h-[279px] flex-shrink-0 shadow-myshadow p-2 flex flex-col justify-between transform transition-transform duration-300 hover:scale-105`;


        card.innerHTML = `
            <img src="${imgUrl}" alt="${title}" class="w-full  h-[200px] object-cover rounded-[6px]">
            <div>
                <p class="text-[14px] font-bold text-gray-800 truncate">${title}</p>
                <p class="text-[12px] text-gray-500 truncate">${author}</p>
                <p class="text-[12px] text-gray-400">${year}</p>
            </div>
        `;
        container.appendChild(card);
    });
}

const genreButtons = document.querySelectorAll('.genre-button');

genreButtons.forEach(button => {
    button.addEventListener('click', async (e) => {
        e.preventDefault();
        const genre = button.dataset.genre;
        const targetId = button.getAttribute('href').substring(1);
        const targetSection = document.getElementById(targetId);
        const booksContainer = targetSection.querySelector('.flex');

        // Покажи секцію (зніми hidden та встанови opacity)
        targetSection.classList.remove('hidden');
        setTimeout(() => targetSection.classList.add('opacity-100'), 50);

        // Отримуємо дані з API
        const response = await fetch(`https://openlibrary.org/search.json?subject=${encodeURIComponent(genre)}&limit=20`);
        const data = await response.json();

        // Рендеримо книги
        renderBooks(data.docs.slice(0, 20), booksContainer);
    });
});

//
const categories = [
    { name: 'Adventure', genre: 'adventure' },
    { name: 'Fantasy', genre: 'fantasy' },
    { name: 'Sci-Fi', genre: 'science_fiction' },
    { name: 'Mystery', genre: 'mystery' },
    { name: 'Romance', genre: 'romance' },
    { name: 'Historical Fiction', genre: 'historical_fiction' },
    { name: 'Horror', genre: 'horror' },
    { name: 'Non-fiction', genre: 'nonfiction' },
    { name: 'Biography', genre: 'biography' },
    { name: 'Self-help', genre: 'self_help' },
    { name: 'Poetry', genre: 'poetry' },
    { name: 'Classics', genre: 'classics' },
    { name: 'Children', genre: 'children' },
    { name: 'Cooking', genre: 'cooking' },
    { name: 'Art', genre: 'art' },
    { name: 'Philosophy', genre: 'philosophy' },
    { name: 'Science', genre: 'science' },
    { name: 'Music', genre: 'music' },
    { name: 'Travel', genre: 'travel' },
    { name: 'Sports', genre: 'sports' },
];

const categoryList = document.getElementById('category-list');
let itemsPerPage = calculateItemsPerPage();
let currentPage = 0;
let totalPages = Math.ceil(categories.length / itemsPerPage);

// Оновлена функція для визначення кількості елементів на сторінці
function calculateItemsPerPage() {
    let itemsPerRow, rows;

    if (window.innerWidth < 640) {
        itemsPerRow = 1;  // 1 колонка
        rows = 2;         // 2 рядки
    } else if (window.innerWidth < 1024) {
        itemsPerRow = 2;  // 2 колонки
        rows = 2;         // 2 рядки
    } else {
        itemsPerRow = 3;  // 3 колонки
        rows = 2;         // 2 рядки
    }

    // Оновлення стилів сітки
    categoryList.style.gridTemplateColumns = `repeat(${itemsPerRow}, 1fr)`;
    categoryList.style.gridTemplateRows = `repeat(${rows}, auto)`;
    categoryList.style.gap = '16px';

    return itemsPerRow * rows; // Загальна кількість елементів (колонки × рядки)
}

// Ініціалізація слайдера
function initSlider() {
    updateItemsPerPage();
    renderCategories();
    updateButtonStates();
    setupResizeListener();
}

// Оновлення кількості елементів при зміні розміру
function updateItemsPerPage() {
    itemsPerPage = calculateItemsPerPage();
    totalPages = Math.ceil(categories.length / itemsPerPage);
    if (currentPage >= totalPages) currentPage = Math.max(0, totalPages - 1);
}

// Відображення категорій для поточної сторінки
function renderCategories() {
    categoryList.innerHTML = '';

    const startIdx = currentPage * itemsPerPage;
    const endIdx = startIdx + itemsPerPage;
    const visibleCategories = categories.slice(startIdx, endIdx);

    while (visibleCategories.length < itemsPerPage) {
        visibleCategories.push(null);
    }

    visibleCategories.forEach((category) => {
        const wrapper = document.createElement('div');
        wrapper.className = 'h-[80px] w-full mx-auto flex items-stretch';

        if (category) {
            wrapper.innerHTML = `
                <button class="genre-button w-full h-full min-h-[80px] relative rounded-[10px] border-2 border-gray bg-white no-underline cursor-pointer flex items-center justify-center transition-transform " data-genre="${category.genre}">
                    <p class="text-lg sm:text-xl lg:text-2xl text-center text-gray font-syne leading-[1.2] px-2 sm:px-4 truncate">${category.name}</p>
                    <div class="absolute z-[-1] inset-0 rounded-[10px] bg-orange-500 translate-x-[12px] translate-y-[12px]"></div>
                </button>
            `;

            // Додаємо обробник події для кнопки
            wrapper.querySelector('button').addEventListener('click', async () => {
                // Завантажуємо книги
                await loadBooksByGenre(category.genre);

                // Прокручуємо до секції з книгами
                scrollToBooksSection();
            });
        } else {
            wrapper.innerHTML = '<div class="w-full h-full min-h-[80px]"></div>';
        }

        categoryList.appendChild(wrapper);
    });
}


// Обробник зміни розміру вікна
function setupResizeListener() {
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            const prevItemsPerPage = itemsPerPage;
            updateItemsPerPage();
            if (prevItemsPerPage !== itemsPerPage) {
                renderCategories();
                updateButtonStates();
            }
        }, 100);
    });
}


// Оновлення стану кнопок навігації
function updateButtonStates() {
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');

    prevBtn.disabled = currentPage === 0;
    nextBtn.disabled = currentPage >= totalPages - 1;
}

// Обробники подій для кнопок навігації
document.getElementById('prev-btn').addEventListener('click', () => {
    if (currentPage > 0) {
        currentPage--;
        renderCategories();
        updateButtonStates();
    }
});

document.getElementById('next-btn').addEventListener('click', () => {
    if (currentPage < totalPages - 1) {
        currentPage++;
        renderCategories();
        updateButtonStates();
    }
});

// Ініціалізація слайдера при завантаженні сторінки
window.addEventListener('DOMContentLoaded', initSlider);

// Завантаження книг за жанром
async function loadBooksByGenre(genre) {
    const booksContainer = document.getElementById('books-display');
    booksContainer.innerHTML = '';

    const scrollWrapper = document.createElement('div');
    scrollWrapper.className = 'w-full h-[410px] border-2 border-dashed overflow-x-auto border-gray-400 rounded-[20px] px-4 flex justify-around items-center';

    const innerFlex = document.createElement('div');
    innerFlex.className = 'flex min-w-max gap-[100px]';

    try {
        const res = await fetch(`https://openlibrary.org/subjects/${genre}.json?limit=50`);
        const data = await res.json();

        data.works.forEach(work => {
            const title = work.title || 'No Title';
            const author = work.authors?.[0]?.name || 'Unknown';
            const year = work.first_publish_year || 'N/A';
            const coverId = work.cover_id;
            const imgUrl = coverId
                ? `https://covers.openlibrary.org/b/id/${coverId}-L.jpg`
                : './img/bookk.jpg';

            const card = document.createElement('div');
            card.className = `border-2 rounded-[10px] bg-gray-300 w-[187px] h-[279px] flex-shrink-0 shadow-myshadow p-2 flex flex-col justify-between transform transition-transform duration-300 hover:scale-105 `;

            card.innerHTML = `
        <img src="${imgUrl}" alt="${title}" class="w-full h-[200px] object-cover rounded-[6px]">
        <div>
          <p class="text-[14px] font-bold text-gray-800 truncate">${title}</p>
          <p class="text-[12px] text-gray-500 truncate">${author}</p>
          <p class="text-[12px] text-gray-400">${year}</p>
        </div>
      `;

            innerFlex.appendChild(card);
        });

        scrollWrapper.appendChild(innerFlex);
        booksContainer.appendChild(scrollWrapper);
    } catch (err) {
        console.error('Помилка:', err);
        booksContainer.innerHTML = '<p class="text-red-500">Не вдалося завантажити книги.</p>';
    }
}

// Прокручування до блоку з книгами
function scrollToBooksSection() {
    const booksSection = document.getElementById('books-container');
    booksSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
}



//ass