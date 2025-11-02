
import React, { useState } from 'react';
import Button from './Button';

function todayISO(){ return new Date().toISOString().slice(0,10); }

export default function BookingForm({ onBooked }){
  const [nama, setNama] = useState('');
  const [jumlah, setJumlah] = useState(1);
  const [harga, setHarga] = useState(20000);
  const [catatan, setCatatan] = useState('');

  const submit = async (e) => {
    e.preventDefault();
    if (!nama) return alert('Nama pelanggan wajib diisi');
    await onBooked({ tanggal_pesan: todayISO(), nama_pelanggan: nama, jumlah, harga_satuan: harga, catatan });
    setNama(''); setJumlah(1); setHarga(20000); setCatatan('');
  }

  return (
    <div className="card section">
      <h3 style={{marginTop:0}}>Booking Baru</h3>
      <form onSubmit={submit} className="form">
        <div className="field">
          <label>Nama Pelanggan</label>
          <input className="input" value={nama} onChange={e=>setNama(e.target.value)} placeholder="Misal: Bu Sari" />
        </div>
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10}}>
          <div className="field">
            <label>Jumlah</label>
            <input className="input" type="number" min="1" value={jumlah} onChange={e=>setJumlah(+e.target.value)} />
          </div>
          <div className="field">
            <label>Harga Satuan (Rp)</label>
            <input className="input" type="number" min="0" value={harga} onChange={e=>setHarga(+e.target.value)} />
          </div>
        </div>
        <div className="field">
          <label>Catatan (opsional)</label>
          <input className="input" value={catatan} onChange={e=>setCatatan(e.target.value)} placeholder="Contoh: antar sore" />
        </div>
        <div className="stickybar">
          <Button type="submit" kind="primary">Simpan Booking</Button>
          <span className="tag">Tip: tekan <span className="kbd">Enter</span> untuk cepat simpan</span>
        </div>
      </form>
    </div>
  )
}
