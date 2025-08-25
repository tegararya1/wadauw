// Ganti dengan Web App URL kamu
const WEBAPP_URL = "https://script.google.com/macros/s/AKfycbzp4ouci2v0rnPTDd0vSAzgAGd3tnXctfJsCrs_TQQob8bdtPePYUOV0aPV8NysOfWy/exec";

// Global state
let currentUser = null;
let currentStudent = null;
let currentCage = null;
let editingStudent = null;
let isEditMode = false;

// Fetch data siswa dari Google Sheets
async function loadStudents() {
    try {
        const res = await fetch(`${WEBAPP_URL}?action=getStudents`);
        const data = await res.json();
        const grid = document.getElementById("studentGrid");
        grid.innerHTML = "";

        data.forEach(student => {
            const card = document.createElement("div");
            card.className =
                "bg-white rounded-xl shadow-lg p-6 text-center card-hover cursor-pointer relative";
            card.onclick = () => {
                if (isEditMode) {
                    editStudent(student.id);
                } else {
                    selectStudent(student.id);
                }
            };
            card.innerHTML = `
                <div class="text-6xl mb-4">${student.photo}</div>
                <h3 class="text-lg font-semibold text-gray-800">${student.name}</h3>
            `;
            grid.appendChild(card);
        });
    } catch (err) {
        console.error("Gagal memuat data siswa:", err);
    }
}

// Toggle mode edit
function toggleEditMode() {
    isEditMode = !isEditMode;
    const btn = document.getElementById("editModeBtn");
    if (isEditMode) {
        btn.classList.remove("bg-blue-600");
        btn.classList.add("bg-orange-600");
    } else {
        btn.classList.remove("bg-orange-600");
        btn.classList.add("bg-blue-600");
    }
}

// Logout
function logout() {
    currentUser = null;
    showPage("loginPage");
}

// Navigasi halaman
function showPage(pageId) {
    const pages = ["loginPage", "mainPage", "editPage", "dashboardPage", "cageDetailPage"];
    pages.forEach(id => document.getElementById(id).classList.add("hidden"));
    document.getElementById(pageId).classList.remove("hidden");
}

// Login event
document.getElementById("loginForm").addEventListener("submit", e => {
    e.preventDefault();
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    if (username && password) {
        currentUser = username;
        showPage("mainPage");
        loadStudents();
    }
});

// Inisialisasi halaman
showPage("loginPage");
