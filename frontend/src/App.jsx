import React, { useEffect, useMemo, useState } from 'react';
import { api } from './api';
import Dashboard from './components/Dashboard';
import BookingForm from './components/BookingForm';
import RekapMingguan from './components/RekapMingguan';

function todayISO(){ return new Date().toISOString().slice(0,10); }

export default function App(){
  const [date, setDate] = useState(todayISO());
  const [stok, setStok] = useState(null);
  const [tx, setTx] = useState([]);

  const refresh = async () => {
    const s = await api.getStok(date);
    setStok(s);
    const list = await api.listTransaksi(date);
    setTx(list);
  }

  useEffect(() => { refresh(); }, [date]);

  const dibooking = useMemo(() => tx.filter(t => t.status_pesanan==='BOOKING').length, [tx]);
  const belumLunas = useMemo(() => tx.filter(t => t.status_bayar==='BELUM_LUNAS'), [tx]);

  return (
    <div style={{ maxWidth: 960, margin: '0 auto', padding: 16, fontFamily: 'system-ui, Arial' }}>
      <h2 style={{ marginBottom: 8 }}>Gas Elpiji — Dashboard</h2>
      <label style={{ display:'block', marginBottom: 8 }}>
        Tanggal: <input type="date" value={date} onChange={e=>setDate(e.target.value)} />
      </label>

      <Dashboard
        stokAwal={stok?.stok_awal||0}
        sisa={stok?.sisa||0}
        dibooking={dibooking}
        terjual={stok?.terjual||0}
        totalBelumLunas={belumLunas.reduce((a,b)=>a+(b.total - b.nominal_bayar),0)}
        countBelumLunas={belumLunas.length}
        onRefresh={refresh}
      />

      <hr style={{ margin:'24px 0' }} />

      <BookingForm onBooked={async (payload)=>{
        await api.booking(payload);
        await refresh();
        alert('Booking tersimpan!');
      }} />

      <hr style={{ margin:'24px 0' }} />

      <RekapMingguan />

      <div style={{ opacity: .6, fontSize: 12, marginTop: 24 }}>
        Tip: Simpan ke layar utama HP biar cepat dibuka.
      </div>
    </div>
  )
}
