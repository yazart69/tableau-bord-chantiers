import { useState } from "react";
import { supabase } from "../supabaseClient";

export const Login = ({ onLogin }) => {
  const [nom, setNom] = useState("");
  const [matricule, setMatricule] = useState("");

  const handleConnect = async () => {
    const { data } = await supabase.from('personnel').select('*').ilike('nom', nom.trim()).eq('matricule', matricule.trim()).single();
    if (data) onLogin(data);
    else alert("NOM ou MATRICULE incorrect.");
  };

  return (
    <div style={{ height: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#111827" }}>
      <div style={{ background: "#fff", padding: 40, borderRadius: 20, width: "90%", maxWidth: 400, textAlign: "center" }}>
        <h1 style={{ fontSize: 24, fontWeight: "900", marginBottom: 30 }}>🏗️ CONNECT BTP</h1>
        <input style={{ width: "100%", padding: 14, marginBottom: 15, borderRadius: 10, border: "1px solid #ddd", boxSizing: "border-box" }} placeholder="NOM" onChange={e => setNom(e.target.value)} />
        <input type="password" style={{ width: "100%", padding: 14, marginBottom: 25, borderRadius: 10, border: "1px solid #ddd", boxSizing: "border-box" }} placeholder="MATRICULE" onChange={e => setMatricule(e.target.value)} />
        <button onClick={handleConnect} style={{ width: "100%", padding: 16, background: "#F59E0B", color: "#fff", border: "none", borderRadius: 10, fontWeight: "bold" }}>SE CONNECTER</button>
      </div>
    </div>
  );
};
