const BASE = import.meta.env.VITE_API || 'http://localhost:4000/api';

export const api = {
  async getHealth() {
    const r = await fetch(`${BASE}/health`);
    return r.json();
  },

  async getStok(date) {
    const r = await fetch(`${BASE}/stok/${date}`);
    return r.json();
  },

  async booking({ tanggal_pesan, pelanggan_id, nama_pelanggan, jumlah, harga_satuan, catatan }) {
    const r = await fetch(`${BASE}/transaksi/booking`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ tanggal_pesan, pelanggan_id, nama_pelanggan, jumlah, harga_satuan, catatan })
    });
    return r.json();
  },

  async listTransaksi(date) {
    const r = await fetch(`${BASE}/transaksi?date=${date}`);
    return r.json();
  },

  async tandaiDiambil(id) {
    const r = await fetch(`${BASE}/transaksi/${id}/diambil`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({})
    });
    return r.json();
  },

  async tandaiLunas(id, nominal_bayar) {
    const r = await fetch(`${BASE}/transaksi/${id}/lunas`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nominal_bayar })
    });
    return r.json();
  },

  async rekap(start, end) {
    const r = await fetch(`${BASE}/rekap?start=${start}&end=${end}`);
    return r.json();
  },

  // NEW: tandai semua piutang atas nama X jadi LUNAS
  async rekapMarkLunasNama(nama) {
    const r = await fetch(`${BASE}/rekap/mark-lunas`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nama })
    });
    return r.json();
  }
};
