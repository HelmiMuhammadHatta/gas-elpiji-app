
import React from 'react';
import Button from './Button';

export default function TransactionList({ tx=[], onDiambil, onLunas }){
  if (!tx.length) return <div className="empty">Belum ada transaksi hari ini.</div>;

  return (
    <div className="card">
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:8}}>
        <h4 style={{margin:0}}>Transaksi Hari Ini</h4>
        <span className="tag">{tx.length} transaksi</span>
      </div>
      <div style={{overflowX:'auto'}}>
        <table className="table">
          <thead>
            <tr>
              <th>Nama</th>
              <th>Jumlah</th>
              <th>Total (Rp)</th>
              <th>Pesanan</th>
              <th>Bayar</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {tx.map((t)=>{
              const nama = t.Pelanggan?.nama ?? 'Tanpa Nama';
              const pesanan = t.status_pesanan;
              const bayar = t.status_bayar;
              return (
                <tr key={t.id}>
                  <td>{nama}</td>
                  <td>{t.jumlah}</td>
                  <td>{Number(t.total).toLocaleString('id-ID')}</td>
                  <td>
                    <span className={"pill " + (pesanan==='BOOKING'?'pill-warn':'pill-ok')}>{pesanan}</span>
                  </td>
                  <td>
                    <span className={"pill " + (bayar==='BELUM_LUNAS'?'pill-danger':'pill-ok')}>{bayar}</span>
                  </td>
                  <td style={{display:'flex',gap:6}}>
                    {t.status_pesanan==='BOOKING' && (
                      <Button onClick={()=>onDiambil(t.id)} kind="outline">Tandai Diambil</Button>
                    )}
                    {t.status_bayar==='BELUM_LUNAS' && (
                      <Button onClick={()=>onLunas(t.id)} kind="primary">Tandai Lunas</Button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
