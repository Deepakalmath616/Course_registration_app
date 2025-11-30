// LOGIN PAGE
const loginForm = document.getElementById('loginForm');
if (loginForm) {
  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value.trim();

    if (!username || !password) {
      alert('Please enter both username and password');
      return;
    }

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem('userId', data.userId);
        window.location.href = 'home.html';
      } else {
        alert(data.error);
      }
    } catch (err) {
      alert('Login failed: ' + err.message);
    }
  });
}

// HOME PAGE
const courseList = document.getElementById('courseList');
if (courseList) {
  const userId = localStorage.getItem('userId');

  if (!userId) {
    alert('Please login first');
    window.location.href = 'login.html';
  }

  async function loadCourses() {
    try {
      const res = await fetch('/api/courses');
      const courses = await res.json();

      courseList.innerHTML = '';

      courses.forEach(course => {
        const li = document.createElement('li');
        li.textContent = course.name + ' ';

        const btn = document.createElement('button');

        // Disable button if user already registered
        if (course.students && course.students.some(s => s._id === userId)) {
          btn.textContent = 'Registered';
          btn.disabled = true;
        } else {
          btn.textContent = 'Register';
          btn.onclick = async () => {
            try {
              const res = await fetch('/api/courses/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId, courseId: course._id })
              });

              const data = await res.json();

              if (res.ok) {
                alert(data.message);
                btn.textContent = 'Registered';
                btn.disabled = true;
              } else {
                alert(data.error);
              }
            } catch (err) {
              alert('Error registering course: ' + err.message);
            }
          };
        }

        li.appendChild(btn);
        courseList.appendChild(li);
      });
    } catch (err) {
      console.error('Error loading courses:', err);
    }
  }

  loadCourses();
}
