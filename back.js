document.addEventListener('DOMContentLoaded', () => {
    const addGuestbookButton = document.getElementById('add_guestbook');

    addGuestbookButton.addEventListener('click', async () => {
        const authorInput = document.querySelector('.author-input');
        const todoInput = document.querySelector('.todo-input');
        const author = authorInput.value;
        const item = todoInput.value;

        if (author.trim() === "" || item.trim() === "") {
            alert("Name and message cannot be empty.");
            return;
        }

        const time = new Date().toLocaleString();
        const todo = { author, item, time };

        console.log('Sending todo:', todo); // 디버깅을 위해 추가

        const response = await fetch('http://18.235.40.243:8000/todo', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(todo)
        });

        if (response.ok) {
            const result = await response.json();
            console.log('Todo added:', result);
            getTodos(); // 갱신된 TODO 리스트를 가져옵니다
            authorInput.value = "";
            todoInput.value = "";
        } else {
            console.error('Failed to add todo:', response.statusText);
        }
    });

    async function getTodos() {
        const response = await fetch('http://18.235.40.243:8000/todo');
        const todos = await response.json();
        
        console.log('Fetched data:', todos); // 추가된 디버깅 코드

        const todoContainer = document.getElementById('todos-container');
        if (!todoContainer) {
            console.error('Cannot find the container element');
            return;
        }
        
        todoContainer.innerHTML = '';

        todos.forEach(todo => {
            const todoElement = document.createElement('div');
            todoElement.classList.add('todo-item');
            todoElement.innerHTML = `
                <div class="todo-header">
                    <div class="todo-author">${todo.author}</div>
                    <div class="todo-time">${todo.time}</div>
                    <button class="delete-btn" data-id="${todo.id}">&times;</button>
                </div>
                <div class="todo-content">${todo.item}</div>
            `;
            todoContainer.appendChild(todoElement);
        });

        document.querySelectorAll('.delete-btn').forEach(button => {
            button.addEventListener('click', async () => {
                const todoId = button.getAttribute('data-id');
                const response = await fetch(`http://18.235.40.243:8000/todo/${todoId}`, {
                    method: 'DELETE'
                });

                if (response.ok) {
                    console.log('Todo deleted');
                    getTodos(); // 갱신된 TODO 리스트를 가져옵니다
                } else {
                    console.error('Failed to delete todo:', response.statusText);
                }
            });
        });
    }

    getTodos();
});
