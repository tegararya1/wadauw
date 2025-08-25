// ====================== CONFIG ======================
const WEBAPP_URL = "https://script.google.com/macros/s/AKfycbwg4Oh814uuGUfkh7SbN7eEvyQYAoW_gDjXrR-Xlracknk3iUc3oWWchBVqduhyIpYD/exec";

let isEditMode = false;
let students = [];
let editingStudent = null;
let selectedPhotoBase64 = null;

// ====================== LOGIN ======================
document.getElementById('loginForm').addEventListener('submit', e => {
    e.preventDefault();
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value.trim();
    if (username && password) {
        showMainPage();
    }
});

// ====================== SHOW PAGE ======================
function showMainPage() {
    document.getElementById('loginPage').classList.add('hidden');
    document.getElementById('mainPage').classList.remove('hidden');
    loadStudents();
}

function logout() {
    document.getElementById('mainPage').classList.add('hidden');
    document.getElementById('loginPage').classList.remove('hidden');
    document.getElementById('loginForm').reset();
}

// ====================== LOAD STUDENTS ======================
async function loadStudents() {
    const res = await fetch(WEBAPP_URL);
    const data = await res.json();
    students = data.students;

    const grid = document.getElementById('studentGrid');
    grid.innerHTML = '';

    students.forEach(student => {
        const card = document.createElement('div');
        card.className = 'bg-white rounded-xl shadow-lg p-6 text-center card-hover cursor-pointer relative';
        card.onclick = () => {
            if (isEditMode) openEditModal(student);
        };
        card.innerHTML = `
            <img src="${student.photo}" alt="Foto" class="w-20 h-20 rounded-full mx-auto mb-3 object-cover" />
            <h3 class="text-lg font-semibold text-gray-800">${student.name}</h3>
            <div class="absolute top-2 right-2 bg-blue-500 text-white rounded-full p-1 hidden"
                id="editIndicator-${student.id}">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                          d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414
                             a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                </svg>
            </div>
        `;
        grid.appendChild(card);
    });
}

// ====================== TOGGLE EDIT MODE ======================
function toggleEditMode() {
    isEditMode = !isEditMode;
    const editBtn = document.getElementById('editModeBtn');
    if (isEditMode) {
        editBtn.classList.remove('bg-blue-600', 'hover:bg-blue-700');
        editBtn.classList.add('bg-orange-600', 'hover:bg-orange-700');
        students.forEach(student => {
            document.getElementById(`editIndicator-${student.id}`).classList.remove('hidden');
        });
    } else {
        editBtn.classList.add('bg-blue-600', 'hover:bg-blue-700');
        editBtn.classList.remove('bg-orange-600', 'hover:bg-orange-700');
        students.forEach(student => {
            document.getElementById(`editIndicator-${student.id}`).classList.add('hidden');
        });
    }
}

// ====================== EDIT STUDENT ======================
function openEditModal(student) {
    editingStudent = student;
    document.getElementById('editStudentName').value = student.name;
    document.getElementById('previewPhoto').src = student.photo;
    document.getElementById('editModal').classList.remove('hidden');
}

function closeEditModal() {
    document.getElementById('editModal').classList.add('hidden');
    editingStudent = null;
    selectedPhotoBase64 = null;
}

// Handle photo input
document.getElementById("photoInput").addEventListener("change", function (e) {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
        selectedPhotoBase64 = reader.result;
        document.getElementById("previewPhoto").src = selectedPhotoBase64;
    };
    reader.readAsDataURL(file);
});

async function saveEditStudent() {
    const name = document.getElementById('editStudentName').value;

    const updatedData = {
        id: editingStudent.id,
        name: name,
        photo: selectedPhotoBase64 || editingStudent.photo
    };

    await fetch(WEBAPP_URL, {
        method: "POST",
        body: JSON.stringify(updatedData)
    });

    closeEditModal();
    loadStudents();
}


