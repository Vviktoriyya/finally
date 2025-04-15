const input = document.querySelector('input[type="search"]');
const searchBtn = document.querySelector('button img[alt="Search"]').parentElement;
const booksContainer = document.getElementById('books').querySelector('.flex');

searchBtn.addEventListener('click', async () => {
    const query = input.value.trim();
    if (!query) return;

    const response = await fetch(`https://openlibrary.org/search.json?q=${encodeURIComponent(query)}`);
    const data = await response.json();
    renderBooks(data.docs.slice(0, 50)); // тільки 10 книг
});




    document.addEventListener('DOMContentLoaded', async () => {
    const response = await fetch(`https://openlibrary.org/search.json?q=the+lord+of+the+rings`);
    const data = await response.json();
    renderBooks(data.docs.slice(0, 50)); // показати 5 книг
});

function renderBooks(books) {
    booksContainer.innerHTML = ''; // очистити попередній результат

    books.forEach(book => {
        const coverId = book.cover_i;
        const title = book.title;
        const author = book.author_name ? book.author_name.join(', ') : 'Unknown Author';
        const year = book.first_publish_year || 'N/A';
        const hasImage = !!coverId;

        const imgUrl = hasImage
            ? `https://covers.openlibrary.org/b/id/${coverId}-M.jpg`
            : './img/bookk.jpg'; //якшо бук не має фото 

        const card = document.createElement('div');
        card.className = `border-2 rounded-[10px] ${hasImage} w-[187px] h-[279px] flex-shrink-0 shadow-myshadow p-2 flex flex-col justify-between`;

        card.innerHTML = `
            <img src="${imgUrl}" alt="${title}" class="w-full h-[200px] object-cover rounded-[6px]">
            <div>
                <p class="text-[14px] font-bold text-gray-800 truncate">${title}</p>
                <p class="text-[12px] text-gray-500 truncate">${author}</p>
                <p class="text-[12px] text-gray-400">${year}</p>
            </div>
        `;
        booksContainer.appendChild(card);
    });
}


// пошук по жанрах


