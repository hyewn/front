const host = "http://18.235.40.243:8000";
const todosContainer = document.querySelector('.todos-container');

window.addEventListener('DOMContentLoaded', function () {
    getTodos();
});

function getTodos() {
    const todos = JSON.parse(localStorage.getItem('todos')) || [];
    renderTodos(todos);
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
    event.preventDefault(); // 폼의 기본 제출 동작을 막음
    addTodo();
});

function addTodo() {
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

    let todos = JSON.parse(localStorage.getItem('todos')) || [];
    let todoData = {
        id: todos.length ? todos[todos.length - 1].id + 1 : 1,
        author: author,
        item: title,
        time: formattedDate
    };

    if (author === '' || title === '') {
        alert('Name and Message are required!');
        return;
    }

    todos.push(todoData);
    localStorage.setItem('todos', JSON.stringify(todos));
    authorInput.value = '';
    todoInput.value = '';
    getTodos();
}

function deleteTodo(todoId) {
    let todos = JSON.parse(localStorage.getItem('todos')) || [];
    todos = todos.filter(todo => todo.id !== todoId);
    localStorage.setItem('todos', JSON.stringify(todos));
    getTodos();
}

async function addTodo() {
    const authorInput = document.querySelector('.author-input');
    const todoInput = document.querySelector('.todo-input');
    const author = authorInput.value;
    const item = todoInput.value;

    const response = await fetch('http://18.235.40.243:8000/todo', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ author, item })
    });

    if (response.ok) {
        const result = await response.json();
        console.log('Todo added:', result);
        getTodos(); 
    } else {
        console.error('Failed to add todo:', response.statusText);
    }
}

async function getTodos() {
    const response = await fetch('http://18.235.40.243:8000/todo');
    const todos = await response.json();

    const todoContainer = document.querySelector('.todos-container');
    todoContainer.innerHTML = '';

    todos.forEach(todo => {
        const todoElement = document.createElement('div');
        todoElement.textContent = `${todo.author}: ${todo.item} (${todo.time})`;
        todoContainer.appendChild(todoElement);
    });
}

document.addEventListener('DOMContentLoaded', getTodos);

