import { useState } from "react";

export const Equipe = ({ personnel, onAdd, onDelete }) => {
  const [showAdd, setShowAdd] = useState(false);
  const [newP, setNewP] = useState({ nom: "", matricule: "", role: "Opérateur", est_admin: false });

  const submit = () => {
    if (!newP.nom || !newP.matricule) return alert("Nom et Matricule obligatoires !");
    onAdd(newP);
    setNewP({ nom: "", matricule: "", role: "Opérateur", est_admin: false });
    setShowAdd(false);
  };

  return (
    <div style={{ padding: "10px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 25 }}>
        <h2 style={{ margin: 0 }}>👥 Gestion de l'Équipe</h2>
        <button 
          onClick={() => setShowAdd(true)} 
          style={{ background: "#F59E0B", color: "#fff", border: "none", padding: "12px 20px", borderRadius: 10, fontWeight: "bold", cursor: "pointer" }}
        >
          + Ajouter un membre
        </button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 20 }}>
        {personnel.map(p => (
          <div key={p.id} style={{ background: "#fff", padding: 20, borderRadius: 15, border: "1px solid #E5E7EB", boxShadow: "0 2px 4px rgba(0,0,0,0.05)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start" }}>
              <div>
                <h3 style={{ margin: "0 0 5px 0" }}>{p.nom} {p.est_admin ? "⭐" : ""}</h3>
                <p style={{ fontSize: 14, color: "#4B5563", margin: 0 }}>Rôle : <strong>{p.role}</strong></p>
                <p style={{ fontSize: 14, color: "#4B5563", margin: "5px 0 0 0" }}>
                  Matricule : <span style={{ background: "#F3F4F6", padding: "2px 6px", borderRadius: 4, fontWeight: "bold", color: "#111827" }}>{p.matricule}</span>
                </p>
              </div>
              <button 
                onClick={() => onDelete(p.id)} 
                style={{ color: "#EF4444", border: "none", background: "none", fontSize: 20, cursor: "pointer" }}
                title="Supprimer"
              >
                🗑️
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* MODAL D'AJOUT */}
      {showAdd && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", zIndex: 2000, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
          <div style={{ background: "#fff", padding: 30, borderRadius: 20, width: "100%", maxWidth: 400 }}>
            <h3 style={{ marginTop: 0 }}>Nouveau collaborateur</h3>
            <input 
              style={{ width: "100%", padding: 12, marginBottom: 12, boxSizing: "border-box", borderRadius: 8, border: "1px solid #ddd" }} 
              placeholder="NOM PRÉNOM (ex: FARID)" 
              value={newP.nom} 
              onChange={e => setNewP({...newP, nom: e.target.value.toUpperCase()})} 
            />
            <input 
              style={{ width: "100%", padding: 12, marginBottom: 12, boxSizing: "border-box", borderRadius: 8, border: "1px solid #ddd" }} 
              placeholder="MATRICULE (ex: 2026)" 
              value={newP.matricule} 
              onChange={e => setNewP({...newP, matricule: e.target.value})} 
            />
            <select 
              style={{ width: "100%", padding: 12, marginBottom: 15, borderRadius: 8, border: "1px solid #ddd" }} 
              value={newP.role} 
              onChange={e => setNewP({...newP, role: e.target.value})}
            >
              <option>Opérateur</option>
              <option>Chef d'équipe</option>
              <option>Chef de chantier</option>
            </select>
            <label style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 25, fontSize: 14 }}>
              <input type="checkbox" checked={newP.est_admin} onChange={e => setNewP({...newP, est_admin: e.target.checked})} /> 
              Accès Administrateur
            </label>
            <div style={{ display: "flex", justifyContent: "flex-end", gap: 12 }}>
              <button onClick={() => setShowAdd(false)} style={{ padding: "10px 20px", borderRadius: 8, border: "1px solid #ddd", cursor: "pointer", background: "none" }}>Annuler</button>
              <button onClick={submit} style={{ background: "#10B981", color: "#fff", border: "none", padding: "10px 25px", borderRadius: 8, fontWeight: "bold", cursor: "pointer" }}>Enregistrer</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
