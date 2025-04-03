# finally


апі про книги
https://openlibrary.org/developers/api
# 📚 BookStore Project

## 🔗 API
Проєкт використовує [Open Library API](https://openlibrary.org/developers/api) для отримання даних про книги, авторів та обкладинки.

### 📌 Основні можливості API:
- **Books API** – отримання інформації про книги за ISBN, OCLC, LCCN або OLID.  
  `https://openlibrary.org/api/books?bibkeys=ISBN:0451526538&format=json&jscmd=data`
  
- **Search API** – пошук книг за текстовим запитом.  
  `https://openlibrary.org/search.json?q=harry+potter`
  
- **Authors API** – інформація про авторів.  
  `https://openlibrary.org/authors/OL23919A.json`
  
- **Covers API** – отримання обкладинок книг.  
  `https://covers.openlibrary.org/b/id/240727-S.jpg`
  
- **Subjects API** – книги за категоріями.  
  `https://openlibrary.org/subjects/science_fiction.json`
  
- **Lists API** – користувацькі списки книг.  
  `https://openlibrary.org/people/george08/lists/OL97L.json`
  
📌 **Обмеження:** API доступне без реєстрації, проте для великої кількості запитів рекомендується кешування.

## 📦 Додаткові бібліотеки та плагіни
- **Axios** – для зручної роботи з HTTP-запитами.
- **React Router** – для маршрутизації.
- **Tailwind CSS** – для стилізації інтерфейсу.
- **Redux Toolkit** – для управління станом додатка.

## 🎨 Дизайн
Дизайн доступний у [Figma](https://www.figma.com/design/8GbCwAfp9NLq1zWIAgZPpo/BookStore--Short-Project---Community-?node-id=63-2407&p=f&t=KYnPaKQ8ZJHXLu4e-0).

## ⚙️ Функціонал
- Пошук книг за назвою та автором.
- Відображення детальної інформації про книгу.
- Перегляд обкладинок книг.
- Сортування книг за категоріями.
- Додавання книг у список вибраного.

## 📌 Очікуваний результат
🔗 Посилання на репозиторій буде відправлене в особисті чати `<id:gui>`.



макет у фігма
https://www.figma.com/design/8GbCwAfp9NLq1zWIAgZPpo/BookStore--Short-Project---Community-?node-id=63-2407&p=f&t=KYnPaKQ8ZJHXLu4e-0

