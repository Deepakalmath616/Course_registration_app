console.log("home.js loaded");

// Check login
const userId = localStorage.getItem("userId");
if (!userId) {
    alert("Please login first");
    window.location.href = "login.html";
}

// Elements
const courseList = document.getElementById("course-list");
const registeredCount = document.getElementById("registeredCount");
const registeredCoursesList = document.getElementById("registeredCoursesList");

// Load courses
async function loadCourses() {
    try {
        const res = await fetch("/api/courses");
        const courses = await res.json();

        let count = 0;
        let registeredNames = [];

        courseList.innerHTML = "";
        registeredCoursesList.innerHTML = "";

        courses.forEach(course => {
            const isRegistered = course.students.some(s => s._id === userId);
            if (isRegistered) {
                count++;
                registeredNames.push(course.name);
            }

            const div = document.createElement("div");
            div.className = "course-card";

            div.innerHTML = `<span>${course.name}</span>`;

            const btn = document.createElement("button");
            btn.textContent = isRegistered ? "Registered" : "Register";
            btn.disabled = isRegistered;

            btn.onclick = async () => {
                const registerRes = await fetch("/api/courses/register", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ userId, courseId: course._id })
                });

                const data = await registerRes.json();

                if (registerRes.ok) {
                    alert("Registered successfully!");

                    btn.textContent = "Registered";
                    btn.disabled = true;

                    // Update UI live:
                    count++;
                    registeredNames.push(course.name);

                    registeredCount.textContent = count;

                    const li = document.createElement("li");
                    li.textContent = course.name;
                    registeredCoursesList.appendChild(li);

                } else {
                    alert(data.error);
                }
            };

            div.appendChild(btn);
            courseList.appendChild(div);
        });

        // Show count
        registeredCount.textContent = count;

        // Show names
        registeredNames.forEach(name => {
            const li = document.createElement("li");
            li.textContent = name;
            registeredCoursesList.appendChild(li);
        });

    } catch (err) {
        console.error("Error loading courses:", err);
    }
}

loadCourses();
