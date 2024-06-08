const host = "http://18.235.40.243:8000";
const todosContainer = document.querySelector('.todos-container');

window.addEventListener('DOMContentLoaded', function () {
    getTodos();
});

async function getTodos() {
    try {
        const response = await fetch(`${host}/todo`);
        const todos = await response.json();
        renderTodos(todos);
    } catch (error) {
        console.error('Error fetching todos:', error);
    }
}

function renderTodos(todos) {
    todosContainer.innerHTML = '';
    todos.forEach(todo => {
        const todoDiv = document.createElement('div');
        todoDiv.classList.add('todo-item');

        const todoHeader = document.createElement('div');
        todoHeader.classList.add('todo-header');

        const todoAuthor = document.createElement('span');
        todoAuthor.classList.add('todo-author');
        todoAuthor.textContent = todo.author;

        const todoTime = document.createElement('span');
        todoTime.classList.add('todo-time');
        todoTime.textContent = todo.time;

        const deleteBtn = document.createElement('button');
        deleteBtn.classList.add('delete-btn');
        deleteBtn.textContent = 'x';

        deleteBtn.addEventListener('click', function () {
            deleteTodo(todo.id);
        });

        todoHeader.appendChild(todoAuthor);
        todoHeader.appendChild(todoTime);
        todoHeader.appendChild(deleteBtn);

        const todoText = document.createElement('span');
        todoText.textContent = todo.item;

        todoDiv.appendChild(todoHeader);
        todoDiv.appendChild(todoText);
        todosContainer.appendChild(todoDiv);
    });
}

const authorInput = document.querySelector('.author-input');
const todoInput = document.querySelector('.todo-input');
const add_guestbook_btn = document.querySelector("#add_guestbook");

add_guestbook_btn.addEventListener('click', function (event) {
    event.preventDefault();
    addTodo();
});

async function addTodo() {
    const author = authorInput.value.trim();
    const title = todoInput.value.trim();
    const currentDate = new Date();
    const formattedDate = currentDate.toLocaleString('ko-KR', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
    });

    const todoData = {
        id: null,
        author: author,
        item: title,
        time: formattedDate
    };

    if (author === '' || title === '') {
        alert('Name and Message are required!');
        return;
    }

    try {
        const response = await fetch(`${host}/todo`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(todoData)
        });
        if (response.ok) {
            const newTodo = await response.json();
            authorInput.value = '';
            todoInput.value = '';
            getTodos();
        } else {
            console.error('Failed to add todo:', response.statusText);
        }
    } catch (error) {
        console.error('Error adding todo:', error);
    }
}

async function deleteTodo(todoId) {
    try {
        const response = await fetch(`${host}/todo/${todoId}`, {
            method: 'DELETE'
        });
        if (response.ok) {
            getTodos();
        } else {
            console.error('Failed to delete todo:', response.statusText);
        }
    } catch (error) {
        console.error('Error deleting todo:', error);
    }
}
