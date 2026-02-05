import { useState } from "react";
import { supabase } from "../supabaseClient";
import { Logistique } from "./Logistique";
import { SignaturePad } from "./Pointage";

export const ChantierDetail = ({ chantier, personnel, user, pointages, onBack, onUpdate, onDelete, onPointage }) => {
  const [task, setTask] = useState("");
  const [uploading, setUploading] = useState(false);

  // Récupération des pointages du jour pour l'utilisateur
  const pAuj = pointages.filter(p => p.date === new Date().toLocaleDateString('fr-FR') && p.user_id === user.id && p.chantier_id === chantier.id);
  const arrivee = pAuj.find(p => p.type === "ARRIVEE");
  const depart = pAuj.find(p => p.type === "DEPART");

  const updateArray = async (key, newItem) => {
    const newArray = [...(chantier[key] || []), newItem];
    await onUpdate({ ...chantier, [key]: newArray });
  };

  const handleUpload = async (e) => {
    setUploading(true);
    const file = e.target.files[0];
    const fileName = `${Date.now()}-${file.name}`;
    await supabase.storage.from('photos-chantiers').upload(`${chantier.id}/${fileName}`, file);
    const { data } = supabase.storage.from('photos-chantiers').getPublicUrl(`${chantier.id}/${fileName}`);
    await updateArray('photos', { id: Date.now(), url: data.publicUrl, par: user.nom });
    setUploading(false);
  };

  return (
    <div style={{ background: "#fff", padding: 25, borderRadius: 20, border: "1px solid #ddd" }}>
      <button onClick={onBack} style={{ marginBottom: 20 }}>← Retour</button>
      
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", marginBottom: 20 }}>
        <div>
          <h2 style={{ margin: 0 }}>{chantier.nom}</h2>
          {arrivee && <span style={{ fontSize: 12, color: "#10B981" }}>🟢 Arrivée : {arrivee.heure}</span>}
        </div>
        {user.est_admin && <button onClick={() => onDelete(chantier.id)} style={{ color: "red", border: "none", background: "none" }}>🗑️</button>}
      </div>

      {/* --- SECTION ÉQUIPE & RESPONSABLE (Deja fait precedemment) --- */}
      <div style={{ background: "#f8fafc", padding: 15, borderRadius: 15, marginBottom: 25 }}>
         <p style={{ margin: 0, fontSize: 13 }}><strong>Chef :</strong> {chantier.chef_equipe || "Non désigné"}</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 30 }}>
        {/* TACHES & LOGISTIQUE */}
        <div>
          <h3>📋 Travaux</h3>
          {chantier.taches?.map(t => (
            <div key={t.id} style={{ display: "flex", gap: 10, padding: 8, background: "#f9f9f9", borderRadius: 8, marginBottom: 5 }}>
              <input type="checkbox" checked={t.done} onChange={async () => {
                const updated = chantier.taches.map(x => x.id === t.id ? {...x, done: !x.done, par: user.nom} : x);
                await onUpdate({...chantier, taches: updated});
              }} />
              <span style={{ textDecoration: t.done ? "line-through" : "none" }}>{t.text}</span>
            </div>
          ))}
          <Logistique chantier={chantier} user={user} onUpdate={onUpdate} />
        </div>

        {/* PHOTOS & POINTAGE DÉPART */}
        <div>
          <h3>📸 Photos</h3>
          <label style={{ display: "block", background: "#111827", color: "#fff", padding: 10, textAlign: "center", borderRadius: 10, cursor: "pointer", marginBottom: 15 }}>
            📷 Prendre Photo <input type="file" accept="image/*" capture="environment" onChange={handleUpload} style={{ display: "none" }} />
          </label>
          
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 5, marginBottom: 30 }}>
            {chantier.photos?.map(p => <img key={p.id} src={p.url} style={{ width: "100%", height: 60, objectFit: "cover", borderRadius: 5 }} />)}
          </div>

          {/* SECTION DÉPART (Pointage final) */}
          <div style={{ borderTop: "2px solid #eee", paddingTop: 20 }}>
            {!depart ? (
              <SignaturePad label="de Départ" onSave={(data) => onPointage("DEPART", data)} />
            ) : (
              <div style={{ background: "#EFF6FF", padding: 15, borderRadius: 12, textAlign: "center", border: "1px solid #BFDBFE" }}>
                <p style={{ margin: 0, fontWeight: "bold", color: "#1E40AF" }}>🏁 Journée terminée à {depart.heure}</p>
                <p style={{ fontSize: 11, color: "#60A5FA" }}>Rapport envoyé automatiquement.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
