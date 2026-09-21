document.addEventListener("DOMContentLoaded", () => {
  loadPlanData();

  document.getElementById("btn-upload").addEventListener("click", handleExcelUpload);
});

async function loadPlanData() {
  const { data, error } = await _supabase.from("plan_data").select("*").order("id", { ascending: false });
  if (error) {
    alert("Gagal memuat data: " + error.message);
    return;
  }
  renderAdminTable(data);
}

function renderAdminTable(data) {
  const tbody = document.querySelector("#admin-plan-table tbody");
  tbody.innerHTML = "";

  data.forEach(item => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${item.work_order}</td>
      <td>${item.nama_operator}</td>
      <td>${item.bagian || '-'}</td>
      <td>${item.nomor_mesin || '-'}</td>
      <td>${item.tipe_lensa || '-'}</td>
      <td><input type="number" value="${item.plan_qty}" id="qty-${item.id}" style="width: 80px;" /></td>
      <td><button onclick="updateQty(${item.id})" class="btn btn-sm btn-primary">Simpan</button></td>
    `;
    tbody.appendChild(tr);
  });
}

async function updateQty(id) {
  const newQty = document.getElementById(`qty-${id}`).value;
  const { error } = await _supabase.from("plan_data").update({ plan_qty: newQty }).eq("id", id);
  if (error) {
    alert("Gagal mengupdate: " + error.message);
  } else {
    alert("Data berhasil diubah!");
  }
}

function handleExcelUpload() {
  const fileInput = document.getElementById("excel-file-input");
  const file = fileInput.files[0];
  if (!file) {
    alert("Pilih file Excel terlebih dahulu!");
    return;
  }

  const reader = new FileReader();
  reader.onload = async (e) => {
    const data = new Uint8Array(e.target.result);
    const workbook = XLSX.read(data, { type: "array" });
    const firstSheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[firstSheetName];
    const jsonData = XLSX.utils.sheet_to_json(worksheet);

    // Format data sesuai kolom Supabase
    const formattedData = jsonData.map(row => ({
      work_order: String(row["Work Order"] || ""),
      nama_operator: String(row["Nama Operator"] || ""),
      bagian: String(row["Bagian"] || ""),
      nomor_mesin: String(row["Nomor Mesin"] || ""),
      tipe_lensa: String(row["Tipe Lensa"] || ""),
      plan_qty: Number(row["Plan Qty"] || 0),
      catatan_target: String(row["catatan target"] || ""),
      tanggal_produksi: row["Tanggal Produksi"] || null
    }));

    const { error } = await _supabase.from("plan_data").insert(formattedData);
    if (error) {
      alert("Gagal mengunggah data: " + error.message);
    } else {
      alert("Berhasil mengunggah data Excel!");
      loadPlanData();
    }
  };
  reader.readAsArrayBuffer(file);
}