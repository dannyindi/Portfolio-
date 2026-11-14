// ===== Shared: mobile menu, footer year, greeting =====
const toggle = document.getElementById('menu-toggle');
const navLinks = document.getElementById('nav-links');
toggle.addEventListener('click', () => {
  const open = navLinks.classList.toggle('open');
  toggle.setAttribute('aria-expanded', open);
});
document.getElementById('year').textContent = new Date().getFullYear();

const greeting = document.getElementById('greeting');
if (greeting) {
  const hour = new Date().getHours();
  greeting.textContent = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';
}

// ===== Academic planner: array of task objects =====
const taskForm = document.getElementById('task-form');
if (taskForm) {
  const input = document.getElementById('task-input');
  const list = document.getElementById('task-list');
  const count = document.getElementById('task-count');
  const error = document.getElementById('task-error');
  let tasks = [];
  try { tasks = JSON.parse(localStorage.getItem('tasks')) || []; } catch (e) { tasks = []; }

  function save() { try { localStorage.setItem('tasks', JSON.stringify(tasks)); } catch (e) {} }

  function render() {
    list.innerHTML = '';
    tasks.forEach(task => {
      const li = document.createElement('li');
      if (task.done) li.classList.add('done');
      const box = document.createElement('input');
      box.type = 'checkbox'; box.checked = task.done;
      box.setAttribute('aria-label', 'Mark "' + task.text + '" as completed');
      box.addEventListener('change', () => toggleTask(task.id));
      const text = document.createElement('span');
      text.textContent = task.text;
      const del = document.createElement('button');
      del.textContent = 'Delete'; del.className = 'btn-del';
      del.addEventListener('click', () => deleteTask(task.id));
      li.append(box, text, del);
      list.appendChild(li);
    });
    const left = tasks.filter(t => !t.done).length;
    count.textContent = tasks.length ? left + ' of ' + tasks.length + ' task(s) remaining' : 'No tasks yet. Add your first one above.';
  }
  function addTask(text) { tasks.push({ id: Date.now(), text: text, done: false }); save(); render(); }
  function toggleTask(id) { tasks = tasks.map(t => t.id === id ? { ...t, done: !t.done } : t); save(); render(); }
  function deleteTask(id) { tasks = tasks.filter(t => t.id !== id); save(); render(); }

  taskForm.addEventListener('submit', e => {
    e.preventDefault();
    const text = input.value.trim();
    if (!text) { error.textContent = 'Enter a task before adding it.'; return; }
    error.textContent = '';
    addTask(text);
    input.value = '';
    input.focus();
  });
  document.getElementById('clear-done').addEventListener('click', () => { tasks = tasks.filter(t => !t.done); save(); render(); });
  render();
}

// ===== Contact form validation =====
const contactForm = document.getElementById('contact-form');
if (contactForm) {
  const rules = {
    name: v => v ? '' : 'Enter your name.',
    email: v => !v ? 'Enter your email address.' : /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) ? '' : 'Enter a valid email, like name@example.com.',
    phone: v => !v ? 'Enter your phone number.' : /^\d{10,14}$/.test(v.replace(/[\s-]/g, '')) ? '' : 'Use digits only, 10 to 14 numbers.',
    message: v => v ? '' : 'Enter your message.'
  };
  contactForm.addEventListener('submit', e => {
    e.preventDefault();
    let valid = true;
    Object.keys(rules).forEach(id => {
      const field = document.getElementById(id);
      const msg = rules[id](field.value.trim());
      document.getElementById(id + '-error').textContent = msg;
      field.classList.toggle('invalid', msg !== '');
      if (msg) valid = false;
    });
    const success = document.getElementById('form-success');
    if (valid) { success.textContent = 'Thank you, ' + document.getElementById('name').value.trim() + '. Your message is ready to send.'; contactForm.reset(); }
    else success.textContent = '';
  });
}
