
document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('orderForm');
    if (!form) return;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Збираємо всі поля форми в об’єкт
        const fd = new FormData(form);
        const payload = Object.fromEntries(fd.entries());

        // Додаємо службові поля
        payload.submittedAt = new Date().toISOString();

        try {
            const res = await fetch('http://localhost:3000/submissions', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (!res.ok) {
                const text = await res.text();
                throw new Error(`Помилка API: ${res.status} ${text}`);
            }

            // Успішно відправлено
            form.reset();
            alert('Заявку відправлено адміністратору!');
        } catch (err) {
            console.error(err);
            alert('Не вдалося відправити форму. Спробуйте ще раз.');
        }
    });
});