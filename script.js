const WEBAPP_URL = "https://script.google.com/macros/s/AKfycbzp4ouci2v0rnPTDd0vSAzgAGd3tnXctfJsCrs_TQQob8bdtPePYUOV0aPV8NysOfWy/exec";

async function loadSiswa() {
  try {
    const res = await fetch(WEBAPP_URL);
    const data = await res.json();

    const container = document.getElementById("siswa-container");
    container.innerHTML = "";

    data.siswa.forEach((s) => {
      const foto = s.foto && s.foto.trim() !== ""
        ? s.foto
        : "https://via.placeholder.com/150?text=Foto";

      const card = `
        <div class="shadow-md rounded-xl p-4 bg-white hover:shadow-lg transition-all duration-300 cursor-pointer">
          <img src="${foto}" alt="Foto ${s.nama}" 
            class="w-full h-40 object-cover rounded-lg mb-3 border">
          <h3 class="text-lg font-semibold text-gray-800 text-center">${s.nama}</h3>
        </div>
      `;
      container.innerHTML += card;
    });
  } catch (err) {
    console.error("Gagal memuat data siswa:", err);
  }
}

document.addEventListener("DOMContentLoaded", loadSiswa);
