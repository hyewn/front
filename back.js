document.getElementById('add_guestbook').addEventListener('click', async () => {
    const authorInput = document.querySelector('.author-input').value;
    const itemInput = document.querySelector('.todo-input').value;
    const time = new Date().toLocaleString();

    const todo = {
        author: authorInput,
        item: itemInput,
        time: time,
    };

    console.log("Sending todo:", todo);

    try {
        const response = await fetch('http://18.235.40.243:8000/todo', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(todo),
        });

        if (response.ok) {
            const data = await response.json();
            console.log("Todo added:", data);
            await getTodos();
            document.querySelector('.author-input').value = ''; // 입력 후 필드 비우기
            document.querySelector('.todo-input').value = ''; // 입력 후 필드 비우기
        } else {
            console.error('Failed to add todo:', response.statusText);
        }
    } catch (error) {
        console.error('Failed to add todo:', error);
    }
});

async function getTodos() {
    try {
        const response = await fetch('http://18.235.40.243:8000/todo');
        if (response.ok) {
            const todos = await response.json();
            console.log("Fetched data:", todos);

            const todosContainer = document.querySelector('.todos-container');
            todosContainer.innerHTML = '';
            todos.forEach(todo => {
                const todoItem = document.createElement('div');
                todoItem.classList.add('todo-item');
                todoItem.innerHTML = `
                    <div class="todo-header">
                        <span class="todo-author">${todo.author}</span>
                        <span class="todo-time">${todo.time}</span>
                        <button class="delete-btn" onclick="deleteTodo(${todo.id})">&times;</button>
                    </div>
                    <div class="todo-item-content">${todo.item}</div>
                `;
                todosContainer.appendChild(todoItem);
            });
        } else {
            console.error('Failed to fetch todos:', response.statusText);
        }
    } catch (error) {
        console.error('Failed to fetch todos:', error);
    }
}

async function deleteTodo(todoId) {
    try {
        const response = await fetch(`http://18.235.40.243:8000/todo/${todoId}`, {
            method: 'DELETE',
        });

        if (response.ok) {
            const data = await response.json();
            console.log("Todo deleted:", data);
            await getTodos();
        } else {
            console.error('Failed to delete todo:', response.statusText);
        }
    } catch (error) {
        console.error('Failed to delete todo:', error);
    }
}

getTodos();
