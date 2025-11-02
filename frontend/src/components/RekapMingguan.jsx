import React, { useEffect, useState } from 'react';
import { api } from '../api';
import Button from './Button';

function getWeekRange(d = new Date()){
  const day = d.getDay(); // 0 Sun, 1 Mon
  const diffToMon = (day === 0 ? -6 : 1 - day);
  const monday = new Date(d);
  monday.setDate(d.getDate() + diffToMon);
  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);
  const toISO = (x)=>x.toISOString().slice(0,10);
  return { start: toISO(monday), end: toISO(sunday) };
}

export default function RekapMingguan(){
  const [range, setRange] = useState(getWeekRange());
  const [data, setData] = useState({ totalTerjual: 0, totalUangMasuk: 0, piutang: [] });
  const [loading, setLoading] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const r = await api.rekap(range.start, range.end);
      setData(r);
    } finally {
      setLoading(false);
    }
  }

  useEffect(()=>{ load(); }, [range.start, range.end]);

  const markLunas = async (nama) => {
    if (!window.confirm(`Tandai semua piutang atas nama "${nama}" sudah LUNAS?`)) return;
    await api.rekapMarkLunasNama(nama);
    await load();
  };

  return (
    <div className="card section">
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
        <h3 style={{margin:0}}>Rekap Mingguan</h3>
        <div style={{display:'flex',gap:8,alignItems:'center'}}>
          <label className="tag">Mulai</label>
          <input className="input" type="date" value={range.start} onChange={e=>setRange(r=>({ ...r, start: e.target.value }))} />
          <label className="tag">Selesai</label>
          <input className="input" type="date" value={range.end} onChange={e=>setRange(r=>({ ...r, end: e.target.value }))} />
          <Button onClick={load}>{loading ? 'Memuat...' : 'Terapkan'}</Button>
        </div>
      </div>

      <div className="grid">
        <div className="card"><div className="stat-title">Total Terjual</div><div className="stat-value">{data.totalTerjual}</div></div>
        <div className="card"><div className="stat-title">Uang Masuk (Lunas)</div><div className="stat-value">Rp {Number(data.totalUangMasuk).toLocaleString('id-ID')}</div></div>
      </div>

      <div className="section">
        <h4 style={{margin:'8px 0'}}>Daftar Piutang</h4>
        <div style={{ overflowX:'auto' }}>
          <table className="table">
            <thead>
              <tr>
                <th></th>
                <th>Nama</th>
                <th>Transaksi</th>
                <th>Tabung</th>
                <th>Estimasi Piutang (Rp)</th>
              </tr>
            </thead>
            <tbody>
              {(data.piutang||[]).map((p,i)=> (
                <tr key={i}>
                  <td>
                    <input type="checkbox" title="Tandai semua piutang pelanggan ini LUNAS" onChange={()=>markLunas(p.nama)} />
                  </td>
                  <td>{p.nama}</td>
                  <td>{p.jumlah_transaksi}</td>
                  <td>{p.total_tabung}</td>
                  <td>Rp {Number(p.estimasi_piutang).toLocaleString('id-ID')}</td>
                </tr>
              ))}
              {(!data.piutang || data.piutang.length===0) && (
                <tr><td colSpan={5}><div className="empty">(Tidak ada piutang)</div></td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
