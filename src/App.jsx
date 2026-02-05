import { useState, useEffect } from "react";
import { supabase } from "./supabaseClient";
import { Login } from "./components/Auth";
import { SignaturePad } from "./components/Pointage";
import { ChantierDetail } from "./components/ChantierDetail";
import { Equipe } from "./components/Equipe";

export default function App() {
  const [user, setUser] = useState(null);
  const [view, setView] = useState("chantiers");
  const [chantiers, setChantiers] = useState([]);
  const [personnel, setPersonnel] = useState([]);
  const [pointages, setPointages] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
    const chan = supabase.channel('db').on('postgres_changes', { event: '*', schema: 'public', table: '*' }, fetchData).subscribe();
    return () => supabase.removeChannel(chan);
  }, []);

  async function fetchData() {
    const resC = await supabase.from('chantiers').select('*').order('created_at', { ascending: false });
    const resP = await supabase.from('personnel').select('*').order('nom');
    const resPoint = await supabase.from('pointages').select('*').order('created_at', { ascending: false });
    if (resC.data) setChantiers(resC.data);
    if (resP.data) setPersonnel(resP.data);
    if (resPoint.data) setPointages(resPoint.data);
    setLoading(false);
  }

  const handlePointage = async (type, data) => {
    await supabase.from('pointages').insert([{
      type, heure: data.heure, signature: data.img, 
      coords: { lat: data.lat, lng: data.lng },
      chantier_id: selectedId, user_id: user.id, user_nom: user.nom,
      date: data.date
    }]);
    fetchData();
  };

  const handleUpdate = async (updated) => {
    const { id, created_at, ...fields } = updated;
    await supabase.from('chantiers').update(fields).eq('id', id);
    fetchData();
  };

  if (!user) return <Login onLogin={setUser} />;
  if (loading) return <div style={{ padding: 100, textAlign: "center" }}>Chargement...</div>;

  const selected = chantiers.find(c => c.id === selectedId);
  const aPointeArrivee = pointages.some(p => p.date === new Date().toLocaleDateString('fr-FR') && p.user_id === user.id && p.chantier_id === selectedId && p.type === "ARRIVEE");

  return (
    <div style={{ fontFamily: "sans-serif", background: "#F3F4F6", minHeight: "100vh" }}>
      <nav style={{ background: "#111827", color: "#fff", padding: "12px 20px", display: "flex", justifyContent: "space-between", alignItems: "center", position: "sticky", top: 0, zIndex: 100 }}>
        <div><h1 style={{ margin: 0, fontSize: 18 }}>CONNECT BTP</h1><span style={{ fontSize: 10, color: "#F59E0B" }}>👤 {user.nom}</span></div>
        <div style={{ display: "flex", gap: 10 }}>
          <button onClick={() => {setView("chantiers"); setSelectedId(null);}} style={{ background: view === "chantiers" ? "#F59E0B" : "transparent", color:"#fff", border:"none", padding:"8px 15px", borderRadius:8 }}>Projets</button>
          {user.est_admin && <button onClick={() => setView("equipe")} style={{ background: view === "equipe" ? "#F59E0B" : "transparent", color:"#fff", border:"none", padding:"8px 15px", borderRadius:8 }}>Équipe</button>}
          <button onClick={() => setUser(null)} style={{ background: "#EF4444", color:"#fff", border:"none", padding:"8px 15px", borderRadius:8 }}>Sortir</button>
        </div>
      </nav>

      <div style={{ padding: 20, maxWidth: 1100, margin: "0 auto" }}>
        {view === "chantiers" ? (
          selected ? (
            <div>
              {/* LOGIQUE : SI PAS POINTÉ ET PAS ADMIN -> SIGNATURE OBLIGATOIRE */}
              {!aPointeArrivee && !user.est_admin ? (
                <div style={{ maxWidth: 400, margin: "0 auto" }}>
                   <SignaturePad label="d'Arrivée" onSave={(d) => handlePointage("ARRIVEE", d)} />
                </div>
              ) : (
                <ChantierDetail 
                  chantier={selected} 
                  personnel={personnel} 
                  user={user} 
                  pointages={pointages}
                  onBack={() => setSelectedId(null)} 
                  onUpdate={handleUpdate} 
                  onPointage={handlePointage}
                  onDelete={async (id) => { if(confirm("Supprimer ?")) { await supabase.from('chantiers').delete().eq('id', id); setSelectedId(null); fetchData(); } }} 
                />
              )}
            </div>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 20 }}>
              {chantiers.map(c => (
                <div key={c.id} onClick={() => setSelectedId(c.id)} style={{ background: "#fff", padding: 25, borderRadius: 15, border: "1px solid #ddd", cursor: "pointer" }}>
                  <h3>{c.nom}</h3>
                  <p style={{ fontSize: 13, color: "#6B7280" }}>📍 {c.adresse}</p>
                </div>
              ))}
            </div>
          )
        ) : (
          <Equipe personnel={personnel} onAdd={async (p) => { await supabase.from('personnel').insert([p]); fetchData(); }} onDelete={async (id) => { if(confirm("Supprimer ?")) { await supabase.from('personnel').delete().eq('id', id); fetchData(); } }} />
        )}
      </div>
    </div>
  );
}
