const input = document.querySelector('input[type="search"]');
const searchBtn = document.querySelector('button img[alt="Search"]').parentElement;
const findBtn = document.getElementById('find-btn');
const searchResultsWrapper = document.getElementById('search-results-wrapper');
const searchResultsContainer = document.querySelector('#search-results .flex');
const trendingBooksContainer = document.getElementById('books')?.querySelector('.flex');

document.addEventListener('DOMContentLoaded', () => {
    const openModalBtn = document.getElementById('openSavedModal');
    const closeModalBtn = document.getElementById('closeModal');
    const savedBooksList = document.getElementById('savedBooksList');
    const modal = document.getElementById('savedModal');

    // Масив збережених книг
    let savedBooks = ['A hipótese do Amor'];

    // Функція оновлення вмісту модалки
    function updateSavedModal() {
        if (savedBooks.length === 0) {
            savedBooksList.innerHTML = 'Список порожній';
        } else {
            savedBooksList.innerHTML = savedBooks.map(title => `<div>${title}</div>`).join('');
        }
    }

    openModalBtn.addEventListener('click', () => {
        updateSavedModal();
        modal.classList.remove('hidden');
    });

    closeModalBtn.addEventListener('click', () => {
        modal.classList.add('hidden');
    });
});





// При пошуку "popular" книг — оновлюється блок Trending
searchBtn.addEventListener('click', async () => {
    const query = input.value.trim();
    if (!query) return;

    const response = await fetch(`https://openlibrary.org/search.json?q=${encodeURIComponent(query)}`);
    const data = await response.json();
    await renderBooks(data.docs.slice(0, 50), trendingBooksContainer);
});

findBtn?.addEventListener('click', async (e) => {
    e.preventDefault();
    const query = input?.value.trim();
    if (!query) return;

    const response = await fetch(`https://openlibrary.org/search.json?q=${encodeURIComponent(query)}`);
    const data = await response.json();

    searchResultsWrapper.classList.remove('hidden');
    searchResultsWrapper.scrollIntoView({behavior: 'smooth'});

    // Перевіряємо, чи є результати
    if (data.docs && data.docs.length > 0) {
        // Виводимо знайдені книги
        await renderBooks(data.docs.slice(0, 50), searchResultsContainer);
    } else {
        // Якщо не знайдено книг, показуємо зображення
        searchResultsContainer.innerHTML = `<img src="./img/NothingWasFound.png" alt="Не знайдено книги" class="w-full h-[200px]">`;
    }
});

document.addEventListener('DOMContentLoaded', async () => {
    const trendingKeywords = ["new arrivals", "best sellers", "top rated", "most popular", "trending now"];
    const randomIndex = Math.floor(Math.random() * trendingKeywords.length);
    const query = trendingKeywords[randomIndex];

    const response = await fetch(`https://openlibrary.org/search.json?q=${query}&sort=new&limit=100`);
    const data = await response.json();

    // Фільтруємо книги, які мають обкладинки
    const booksWithCover = data.docs.filter(book => book.cover_i);
    await renderBooks(booksWithCover.slice(0, 100), trendingBooksContainer);
});
// Функція рендеру книг
async function renderBooks(books, container) {
    if (!container) return;
    container.innerHTML = '';

    for (const book of books) {
        const coverId = book.cover_i;
        const title = book.title;
        const author = book.author_name ? book.author_name.join(', ') : 'Unknown Author';
        const year = book.first_publish_year || 'N/A';
        const bookKey = book.key || (book.work_id ? `/works/${book.work_id}` : null);

        const imgUrl = coverId
            ? `https://covers.openlibrary.org/b/id/${coverId}-M.jpg`
            : './img/bookk.jpg';

        // Отримуємо опис (якщо є в першій відповіді)
        let description = book.description ||
            book.first_sentence ||
            'No description available';

        // Якщо опис - об'єкт (іноді API повертає {type: "...", value: "..."})
        if (description && typeof description === 'object') {
            description = description.value || 'No description available';
        }

        const card = document.createElement('div');
        card.className = `border-2 rounded-[10px] w-[187px] h-[279px] flex-shrink-0 shadow-myshadow p-2 flex flex-col justify-between transform transition-transform duration-300 hover:scale-105 cursor-pointer`;

        card.innerHTML = `
            <img src="${imgUrl}" alt="${title}" class="w-full h-[200px] object-cover rounded-[6px]">
            <div>
                <p class="text-[14px] font-bold text-gray-800 truncate">${title}</p>
                <p class="text-[12px] text-gray-500 truncate">${author}</p>
                <p class="text-[12px] text-gray-400">${year}</p>
            </div>
        `;

        card.addEventListener('click', async () => {
            // Якщо немає опису, пробуємо отримати його з API
            if (description === 'No description available' && bookKey) {
                try {
                    const response = await fetch(`https://openlibrary.org${bookKey}.json`);
                    const data = await response.json();

                    if (data.description) {
                        description = typeof data.description === 'string'
                            ? data.description
                            : data.description.value || 'No description available';
                    }
                } catch (error) {
                    console.error('Error fetching book description:', error);
                }
            }

            const params = new URLSearchParams({
                img: imgUrl,
                title: title,
                author: author,
                description: description,
                year: year,
                price: generateRandomPrice() // Додаємо випадкову ціну
            });
            window.location.href = `book.html?${params.toString()}`;
        });

        container.appendChild(card);
    }
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
    {name: 'Adventure', genre: 'adventure'},
    {name: 'Fantasy', genre: 'fantasy'},
    {name: 'Sci-Fi', genre: 'science_fiction'},
    {name: 'Mystery', genre: 'mystery'},
    {name: 'Romance', genre: 'romance'},
    {name: 'Historical Fiction', genre: 'historical_fiction'},
    {name: 'Horror', genre: 'horror'},
    {name: 'Non-fiction', genre: 'nonfiction'},
    {name: 'Biography', genre: 'biography'},
    {name: 'Self-help', genre: 'self_help'},
    {name: 'Poetry', genre: 'poetry'},
    {name: 'Classics', genre: 'classics'},
    {name: 'Children', genre: 'children'},
    {name: 'Cooking', genre: 'cooking'},
    {name: 'Art', genre: 'art'},
    {name: 'Philosophy', genre: 'philosophy'},
    {name: 'Science', genre: 'science'},
    {name: 'Music', genre: 'music'},
    {name: 'Travel', genre: 'travel'},
    {name: 'Sports', genre: 'sports'},
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

async function loadBooksByGenre(genre) {
    const booksContainer = document.getElementById('books-display');
    booksContainer.innerHTML = '';

    // Додаємо блок з назвою жанру
    const viewMoreWrapper = document.createElement('div');
    viewMoreWrapper.className = 'flex gap-[12px] justify-start items-center mb-4 pt-[220px] pb-[52px]';
    viewMoreWrapper.innerHTML = `
        <img src="./icon/Path%20(2).png" class="w-[26px] h-[21px]"/>
        <p class="sm:text-[36px] font-[400] text-gray font-unica leading-[1.2] xs:text-[26px]">${genre.charAt(0).toUpperCase() + genre.slice(1)}</p>
    `;
    booksContainer.appendChild(viewMoreWrapper);

    //анімація завантаження
    const loadingContainer = document.createElement('div');
    loadingContainer.className = 'w-full h-[410px] flex items-center justify-center';
    loadingContainer.innerHTML = `
        <div class="flex flex-col items-center">
            <div class="w-12 h-12 border-4 border-orange-500 border-r-transparent rounded-full animate-spin"></div>
            <p class="mt-3 text-gray-600">Завантаження книг...</p>
        </div>
    `;
    booksContainer.appendChild(loadingContainer);

    // Створюємо контейнер для книг (спочатку прихований)
    const scrollWrapper = document.createElement('div');
    scrollWrapper.className = 'w-full h-[410px] border-2 flex items-start border-dashed overflow-y-auto overflow-x-hidden border-gray-400 rounded-[20px] px-3 py-[30px] hidden';
    booksContainer.appendChild(scrollWrapper);

    try {
        const res = await fetch(`https://openlibrary.org/subjects/${genre}.json?limit=200`);
        const data = await res.json();

        const innerFlex = document.createElement('div');
        innerFlex.className = 'flex flex-col gap-6 w-full';

        let row = document.createElement('div');
        row.className = 'flex justify-center gap-[70px] flex-wrap';

        let countInRow = 0;

        const booksWithDetails = await Promise.all(data.works.map(async work => {
            try {
                const res = await fetch(`https://openlibrary.org${work.key}.json`);
                const details = await res.json();
                return {
                    ...work,
                    description: details.description || work.description || null
                };
            } catch {
                return work;
            }
        }));

        booksWithDetails.forEach(work => {
            const title = work.title || 'No Title';
            const author = work.authors?.[0]?.name || 'Unknown';
            const year = work.first_publish_year || 'N/A';
            const description = work.description
                ? (typeof work.description === 'string' ? work.description : work.description.value || 'No description available')
                : 'No description available';

            if (year >= 1960) {
                const coverId = work.cover_id;
                const imgUrl = coverId
                    ? `https://covers.openlibrary.org/b/id/${coverId}-L.jpg`
                    : './img/bookk.jpg';

                const card = document.createElement('div');
                card.className = `border-2 cursor-pointer rounded-[10px] bg-gray-300 w-[187px] h-[279px] flex-shrink-0 shadow-myshadow p-2 flex flex-col justify-between transform transition-transform duration-300 hover:scale-105`;

                card.innerHTML = `
                <img src="${imgUrl}" alt="${title}" class="w-full h-[200px] object-cover rounded-[6px]">
                <div>
                    <p class="text-[14px] font-bold text-gray-800 truncate">${title}</p>
                    <p class="text-[12px] text-gray-500 truncate">${author}</p>
                    <p class="text-[12px] text-gray-400">${year}</p>
                </div>
            `;

                card.addEventListener('click', () => {
                    const bookDetails = {
                        img: imgUrl,
                        title: title,
                        author: author,
                        year: year,
                        description: description,
                        price: generateRandomPrice(),
                        booksGeners: genre
                    };
                    window.location.href = `book.html?${new URLSearchParams(bookDetails).toString()}`;
                });

                row.appendChild(card);
                countInRow++;

                if (countInRow === 5) {
                    innerFlex.appendChild(row);
                    row = document.createElement('div');
                    row.className = 'flex justify-center gap-[70px] flex-wrap';

                    countInRow = 0;
                }
            }
        });

        if (countInRow > 0) {
            innerFlex.appendChild(row);
        }

        scrollWrapper.appendChild(innerFlex);
        loadingContainer.classList.add('hidden');
        scrollWrapper.classList.remove('hidden');

    } catch (err) {
        console.error('Помилка:', err);
        loadingContainer.innerHTML = '<p class="text-red-500">Не вдалося завантажити книги. Спробуйте ще раз.</p>';
    }

}

// Прокручування до блоку з книгами
function scrollToBooksSection() {
    const booksSection = document.getElementById('books-container');
    booksSection.scrollIntoView({behavior: 'smooth', block: 'start'});
}

//це коли я натисну на книгу
window.addEventListener('DOMContentLoaded', () => {
    initSlider(); // ініціалізуємо слайдер

    // Отримуємо жанр з URL (наприклад, ?genre=fantasy)
    const params = new URLSearchParams(window.location.search);
    const genre = params.get('genre');

    if (genre) {
        loadBooksByGenre(genre);     // автоматично завантажуємо книги
        scrollToBooksSection();      // скролимо до секції
    }
});

function generateRandomPrice() {
    const minPrice = 5;
    const maxPrice = 50;
    const integerPart = Math.floor(Math.random() * (maxPrice - minPrice)) + minPrice;
    const price = integerPart + 0.99;
    return price.toFixed(2); // тільки число як рядок, без знака $
}




// Знаходимо елементи
const addToCartBtn = document.querySelector('a[href=""]'); // твоя кнопка "додати в кошик"
const savedBooksList = document.getElementById('savedBooksList');
const savedModal = document.getElementById('savedModal');

// Функція для створення HTML книги в модалці
function createSavedBook(title, author, price, imgSrc) {
    const bookItem = document.createElement('div');
    bookItem.className = 'flex items-center gap-4 p-4 border-b';

    bookItem.innerHTML = `
        <div class="w-[50px] h-[75px] bg-gray-300 rounded-[10px] overflow-hidden">
            <img src="${imgSrc}" alt="Book cover" class="w-full h-full object-cover" />
        </div>
        <div class="flex flex-col text-left">
            <p class="font-bold text-gray-800">${title}</p>
            <p class="text-gray-500 text-sm">${author}</p>
            <p class="text-orange-500 text-lg">${price}</p>
        </div>
    `;

    return bookItem;
}

// Обробник кліку на кнопку додати в кошик
addToCartBtn.addEventListener('click', (e) => {
    e.preventDefault(); // Щоб не перезавантажувалась сторінка через <a href="">

    const title = document.getElementById('book-title').innerText.trim();
    const author = document.getElementById('book-author').innerText.trim();
    const price = document.getElementById('book-price').innerText.trim();
    const img = document.getElementById('book-img').getAttribute('src') || '';

    if (title && author && price) {
        const savedBook = createSavedBook(title, author, price, img);

        // Якщо "Список порожній", видаляємо цей текст
        if (savedBooksList.classList.contains('hidden')) {
            savedBooksList.classList.remove('hidden');
            savedBooksList.innerHTML = '';
        }

        savedBooksList.appendChild(savedBook);

        // Відкриваємо модалку
        savedModal.classList.remove('hidden');
    }
});

// Закриття модалки
const closeModalBtn = document.getElementById('closeModal');
closeModalBtn.addEventListener('click', () => {
    savedModal.classList.add('hidden');
});



//ass