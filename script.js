window.onload = function () {
  loadTasks();
  loadTheme();
};

function addTask() {
  const input = document.getElementById('taskInput');
  const taskText = input.value.trim();
  if (taskText === '') return;

  createTaskElement(taskText, false);
  input.value = '';
  saveTasks();
  updateClearAllButtonVisibility();
}

function clearAllTasks() {
  document.getElementById('taskList').innerHTML = '';
  localStorage.removeItem('tasks');
  updateClearAllButtonVisibility();
}

function loadTasks() {
  const savedTasks = JSON.parse(localStorage.getItem('tasks')) || [];
  savedTasks.forEach(task => createTaskElement(task.text, task.completed));
  updateClearAllButtonVisibility();
}


function createTaskElement(text, isCompleted) {
  const li = document.createElement('li');

  const span = document.createElement('span');
  span.textContent = text;
  if (isCompleted) span.classList.add('completed');

  // Dropdown container
  const menuContainer = document.createElement('div');
  menuContainer.style.position = 'relative';

  // 3 dots button
  const dotsBtn = document.createElement('button');
  dotsBtn.textContent = '⋮';
  dotsBtn.className = 'delete-btn';
  dotsBtn.style.padding = '5px 10px';
  dotsBtn.onclick = () => {
    dropdownMenu.style.display = dropdownMenu.style.display === 'block' ? 'none' : 'block';
  };

  // Dropdown menu
  const dropdownMenu = document.createElement('div');
  dropdownMenu.style.position = 'absolute';
  dropdownMenu.style.top = '30px';
  dropdownMenu.style.right = '0';
  dropdownMenu.style.backgroundColor = '#fff';
  dropdownMenu.style.border = '1px solid #ccc';
  dropdownMenu.style.borderRadius = '4px';
  dropdownMenu.style.display = 'none';
  dropdownMenu.style.boxShadow = '0 2px 5px rgba(0,0,0,0.2)';
  dropdownMenu.style.zIndex = '1';

  const createMenuItem = (text, callback) => {
    const item = document.createElement('div');
    item.textContent = text;
    item.style.padding = '8px 12px';
    item.style.cursor = 'pointer';
    item.onmouseenter = () => item.style.backgroundColor = '#f0f0f0';
    item.onmouseleave = () => item.style.backgroundColor = '#fff';
    item.onclick = () => {
      callback();
      dropdownMenu.style.display = 'none';
    };
    return item;
  };
  
  //Complete Task
  dropdownMenu.appendChild(createMenuItem('Complete', () => {
    span.classList.toggle('completed');
    saveTasks();
  }));
  
  //Edit task
  dropdownMenu.appendChild(createMenuItem('Edit', () => {
    const newText = prompt('Edit task:', span.textContent);
    if (newText !== null && newText.trim() !== '') {
      span.textContent = newText.trim();
      saveTasks();
    }
  }));
  
  //Delete Task
  dropdownMenu.appendChild(createMenuItem('Delete', () => {
    li.remove();
    saveTasks();
  }));

  menuContainer.appendChild(dotsBtn);
  menuContainer.appendChild(dropdownMenu);

  li.appendChild(span);
  li.appendChild(menuContainer);

  document.getElementById('taskList').appendChild(li);
  
  // Close dropdown if clicked outside
  document.addEventListener('click', function (e) {
    if (!menuContainer.contains(e.target)) {
      dropdownMenu.style.display = 'none';
    }
  });
}


function saveTasks() {
  const tasks = [];
  document.querySelectorAll('#taskList li').forEach(li => {
    const span = li.querySelector('span');
    const text = span.textContent.trim();
    const completed = span.classList.contains('completed');
    tasks.push({ text, completed });
  });
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

function loadTasks() {
  const savedTasks = JSON.parse(localStorage.getItem('tasks')) || [];
  savedTasks.forEach(task => createTaskElement(task.text, task.completed));
}

function clearAllTasks() {
  document.getElementById('taskList').innerHTML = '';
  localStorage.removeItem('tasks');
}

function updateClearAllButtonVisibility() {
  const hasTasks = document.querySelectorAll('#taskList li').length > 0;
  const clearBtn = document.getElementById('clearAllBtn');
  clearBtn.style.display = hasTasks ? 'inline-block' : 'none';
}