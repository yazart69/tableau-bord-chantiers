import { useRef, useState, useEffect } from "react";

export const SignaturePad = ({ label, onSave }) => {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);

  useEffect(() => {
    const ctx = canvasRef.current?.getContext("2d");
    if (ctx) { ctx.lineWidth = 3; ctx.lineCap = "round"; ctx.strokeStyle = "#111827"; }
  }, []);

  const save = () => {
    const dataURL = canvasRef.current.toDataURL();
    const now = new Date();
    const heure = now.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });

    // Capture GPS
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition((pos) => {
        onSave({ 
          img: dataURL, heure, 
          lat: pos.coords.latitude, lng: pos.coords.longitude,
          date: now.toLocaleDateString('fr-FR')
        });
      }, () => {
        alert("Position GPS non détectée, signature enregistrée sans coordonnées.");
        onSave({ img: dataURL, heure, lat: null, lng: null, date: now.toLocaleDateString('fr-FR') });
      });
    } else {
      onSave({ img: dataURL, heure, date: now.toLocaleDateString('fr-FR') });
    }
  };

  const draw = (e) => {
    if (!isDrawing) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const x = (e.clientX || (e.touches && e.touches[0].clientX)) - rect.left;
    const y = (e.clientY || (e.touches && e.touches[0].clientY)) - rect.top;
    const ctx = canvasRef.current.getContext("2d");
    ctx.lineTo(x, y); ctx.stroke(); ctx.beginPath(); ctx.moveTo(x, y);
  };

  return (
    <div style={{ background: "#fff", padding: 20, borderRadius: 20, border: "2px solid #111827", textAlign: "center", boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)" }}>
      <h3 style={{ marginBottom: 15 }}>✍️ Pointage {label}</h3>
      <canvas 
        ref={canvasRef} width={300} height={160} 
        onMouseDown={() => setIsDrawing(true)} onMouseUp={() => setIsDrawing(false)}
        onTouchStart={() => setIsDrawing(true)} onTouchEnd={() => setIsDrawing(false)}
        onMouseMove={draw} onTouchMove={draw}
        style={{ background: "#f9f9f9", touchAction: "none", border: "1px solid #ddd", borderRadius: 10, width: "100%", maxWidth: "300px" }} 
      />
      <div style={{ marginTop: 20, display: "flex", gap: 10, justifyContent: "center" }}>
        <button onClick={() => canvasRef.current.getContext("2d").clearRect(0,0,400,200)} style={{ padding: "10px 20px", borderRadius: 10, border: "1px solid #ddd", cursor: "pointer" }}>Effacer</button>
        <button onClick={save} style={{ background: "#111827", color: "#fff", padding: "10px 25px", borderRadius: 10, fontWeight: "bold", cursor: "pointer" }}>Valider {label} 📍</button>
      </div>
    </div>
  );
};
