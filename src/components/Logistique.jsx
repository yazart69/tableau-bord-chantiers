import { useState } from "react";

export const Logistique = ({ chantier, user, onUpdate }) => {
  const [matItem, setMatItem] = useState({ nom: "", type: "Fourniture", qte: 0 });
  const [besoin, setBesoin] = useState("");

  const addItem = async () => {
    if(!matItem.nom) return;
    const newInv = [...(chantier.inventaire || []), { ...matItem, id: Date.now(), stock_actuel: matItem.qte, seuil: 1 }];
    await onUpdate({ ...chantier, inventaire: newInv });
    setMatItem({ nom: "", type: "Fourniture", qte: 0 });
  };

  return (
    <div style={{ background: "#fdfdfd", padding: 15, borderRadius: 15, border: "1px solid #eee" }}>
      <h3>📦 Stocks & Logistique</h3>
      {user.est_admin && (
        <div style={{ background: "#eee", padding: 10, borderRadius: 10, marginBottom: 15 }}>
          <input style={{ width: "100%", marginBottom: 5 }} placeholder="Article" value={matItem.nom} onChange={e => setMatItem({...matItem, nom: e.target.value})} />
          <div style={{ display: "flex", gap: 5 }}>
            <select style={{ flex: 1 }} onChange={e => setMatItem({...matItem, type: e.target.value})}><option>Fourniture</option><option>Matériel</option><option>Location</option></select>
            <input type="number" style={{ width: 50 }} placeholder="Qté" onChange={e => setMatItem({...matItem, qte: parseInt(e.target.value)})} />
            <button onClick={addItem}>Add</button>
          </div>
        </div>
      )}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
        {chantier.inventaire?.map(item => (
          <div key={item.id} style={{ padding: 10, border: "1px solid #eee", borderRadius: 10, background: item.stock_actuel <= item.seuil ? "#FEF2F2" : "#fff" }}>
            <div style={{ fontWeight: "bold", fontSize: 12 }}>{item.nom}</div>
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: 5 }}>
              <span>{item.stock_actuel}</span>
              <button onClick={async () => {
                const newInv = chantier.inventaire.map(i => i.id === item.id ? {...i, stock_actuel: Math.max(0, i.stock_actuel - 1)} : i);
                onUpdate({...chantier, inventaire: newInv});
              }}>-1</button>
            </div>
          </div>
        ))}
      </div>
      <h4 style={{ color: "red", marginTop: 20 }}>🛒 Besoins Urgents</h4>
      <div style={{ display: "flex", gap: 5 }}>
        <input style={{ flex: 1 }} placeholder="Manque quoi ?" value={besoin} onChange={e => setBesoin(e.target.value)} />
        <button onClick={async () => { if(besoin) { const newB = [{id:Date.now(), texte:besoin, par:user.nom}, ...(chantier.besoins_achats || [])]; onUpdate({...chantier, besoins_achats: newB}); setBesoin(""); } }}>OK</button>
      </div>
    </div>
  );
};
