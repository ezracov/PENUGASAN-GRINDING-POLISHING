let currentUser = null;

document.addEventListener("DOMContentLoaded", async () => {
  const urlParams = new URLSearchParams(window.location.search);
  const tokenParam = urlParams.get("token");

  if (tokenParam) {
    await authenticateByToken(tokenParam);
  } else {
    document.getElementById("login-screen").classList.remove("hidden");
  }

  document.getElementById("login-form").addEventListener("submit", async (e) => {
    e.preventDefault();
    const token = document.getElementById("token-input").value.trim();
    await authenticateByToken(token);
  });
});

async function authenticateByToken(token) {
  // Verifikasi token dari tabel users Supabase
  const { data: user, error } = await _supabase
    .from("users")
    .select("*")
    .eq("token", token)
    .single();

  if (error || !user) {
    alert("Token tidak valid!");
    return;
  }

  currentUser = user;
  document.getElementById("user-name-display").textContent = user.name;
  document.getElementById("user-role-badge").textContent = user.role;

  document.getElementById("login-screen").classList.add("hidden");
  document.getElementById("app-screen").classList.remove("hidden");

  loadEmployeeWO();
}

async function loadEmployeeWO() {
  const container = document.getElementById("wo-list-container");
  container.innerHTML = "";

  // Ambil plan penugasan spesifik untuk operator ini
  const { data: planData, error } = await _supabase
    .from("plan_data")
    .select("*")
    .ilike("nama_operator", currentUser.name);

  if (error || !planData || planData.length === 0) {
    container.innerHTML = "<p>Tidak ada Work Order untuk Anda.</p>";
    return;
  }

  planData.forEach(item => {
    const card = document.createElement("div");
    card.className = "wo-card";
    card.innerHTML = `
      <div class="wo-card-header">
        <span>${item.work_order}</span>
        <span class="badge">${item.plan_qty} pcs</span>
      </div>
      <div class="wo-card-body">
        <p><strong>Tipe Lensa:</strong> ${item.tipe_lensa}</p>
        <p><strong>Mesin:</strong> ${item.nomor_mesin} | <strong>Bagian:</strong> ${item.bagian}</p>
      </div>
    `;
    container.appendChild(card);
  });
}