// State management
let todos = loadTodos();
let currentFilter = 'all';

// DOM Elements
const todoForm = document.getElementById('todoForm');
const todoInput = document.getElementById('todoInput');
const todoList = document.getElementById('todoList');
const filterButtons = document.querySelector('.todo-filters');

// Load todos from localStorage
function loadTodos() {
    const savedTodos = localStorage.getItem('todos');
    return savedTodos ? JSON.parse(savedTodos) : [];
}

// Save todos to localStorage
function saveTodos() {
    localStorage.setItem('todos', JSON.stringify(todos));
}

// Add new todo
function addTodo(text) {
    const todo = {
        id: Date.now().toString(),
        text: text,
        completed: false
    };
    todos.push(todo);
    saveTodos();
    renderTodos();
}

// Toggle todo completion status
function toggleTodo(id) {
    todos = todos.map(todo => {
        if (todo.id === id) {
            return { ...todo, completed: !todo.completed };
        }
        return todo;
    });
    saveTodos();
    renderTodos();
}

// Delete todo
function deleteTodo(id) {
    todos = todos.filter(todo => todo.id !== id);
    saveTodos();
    renderTodos();
}

// Get filtered todos based on current filter
function getFilteredTodos() {
    switch (currentFilter) {
        case 'active':
            return todos.filter(todo => !todo.completed);
        case 'completed':
            return todos.filter(todo => todo.completed);
        default:
            return todos;
    }
}

// Create todo item element
function createTodoElement(todo) {
    const li = document.createElement('li');
    li.className = `todo-item ${todo.completed ? 'completed' : ''}`;

    li.innerHTML = `
        <input 
            type="checkbox" 
            class="todo-checkbox" 
            ${todo.completed ? 'checked' : ''}
        >
        <span>${todo.text}</span>
        <button class="delete-btn">Delete</button>
    `;

    // Add event listeners
    li.querySelector('.todo-checkbox').addEventListener('change', () => {
        toggleTodo(todo.id);
    });

    li.querySelector('.delete-btn').addEventListener('click', () => {
        deleteTodo(todo.id);
    });

    return li;
}

// Render todos to DOM
function renderTodos() {
    todoList.innerHTML = '';
    const filteredTodos = getFilteredTodos();
    filteredTodos.forEach(todo => {
        todoList.appendChild(createTodoElement(todo));
    });
}

// Event Listeners
todoForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const text = todoInput.value.trim();
    if (text) {
        addTodo(text);
        todoInput.value = '';
    }
});

filterButtons.addEventListener('click', (e) => {
    if (e.target.tagName === 'BUTTON') {
        document.querySelectorAll('.todo-filters button').forEach(btn => {
            btn.classList.remove('active');
        });
        e.target.classList.add('active');
        currentFilter = e.target.dataset.filter;
        renderTodos();
    }
});

// Initial render
renderTodos();