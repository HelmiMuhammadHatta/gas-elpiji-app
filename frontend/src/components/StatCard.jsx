
import React from 'react';
export default function StatCard({ title, value, note }){
  return (
    <div className="card">
      <div className="stat-title">{title}</div>
      <div className="stat-value">{value}</div>
      {note && <div className="stat-note">{note}</div>}
    </div>
  )
}
