
import React from 'react';
import StatCard from './StatCard';
import Button from './Button';

export default function Dashboard({ stokAwal, sisa, dibooking, terjual, totalBelumLunas, countBelumLunas, onRefresh }){
  return (
    <div className="card shadow-pop">
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:10}}>
        <div style={{display:'flex',alignItems:'center',gap:10}}>
          <div className="badge">Hari Ini</div>
          <div className="tag">Pantau stok & status cepat</div>
        </div>
        <Button onClick={onRefresh}>Refresh</Button>
      </div>
      <div className="grid">
        <StatCard title="Stok Awal" value={stokAwal} />
        <StatCard title="Sisa" value={sisa} />
        <StatCard title="Booking Aktif" value={dibooking} />
        <StatCard title="Sudah Diambil (Terjual)" value={terjual} />
        <StatCard title="Belum Lunas (Rp)" value={Number(totalBelumLunas).toLocaleString('id-ID')} note={`${countBelumLunas} transaksi`} />
      </div>
    </div>
  )
}
