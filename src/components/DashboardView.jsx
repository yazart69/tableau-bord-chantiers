import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Target, TrendingUp, CheckCircle2, Users, Calendar } from 'lucide-react';

export const DashboardView = ({ chantiers, pointages, personnel }) => {
  const totalBudget = chantiers.reduce((acc, c) => acc + (c.budget_total || 0), 0);
  const totalConsomme = chantiers.reduce((acc, c) => acc + (c.budget_consomme || 0), 0);
  
  const tachesTotales = chantiers.reduce((acc, c) => acc + (c.taches?.length || 0), 0);
  const tachesFaites = chantiers.reduce((acc, c) => acc + (c.taches?.filter(t => t.done).length || 0), 0);
  const progressionGlobale = tachesTotales > 0 ? Math.round((tachesFaites / tachesTotales) * 100) : 0;

  const dataBudget = [
    { name: 'Consommé', value: totalConsomme },
    { name: 'Restant', value: Math.max(0, totalBudget - totalConsomme) }
  ];
  const COLORS = ['#10B981', '#E5E7EB'];

  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "20px" }}>
      {/* Widget Travaux */}
      <div style={{ background: "#FF8A65", padding: "25px", borderRadius: "24px", color: "white" }}>
        <div style={{ display: "flex", justifyContent: "space-between" }}><h3 style={{ margin: 0 }}>TRAVAUX</h3><CheckCircle2 /></div>
        <div style={{ fontSize: "40px", fontWeight: "bold", margin: "15px 0" }}>{progressionGlobale}%</div>
        <div style={{ height: "8px", background: "rgba(255,255,255,0.3)", borderRadius: "4px" }}>
          <div style={{ width: `${progressionGlobale}%`, height: "100%", background: "white", borderRadius: "4px" }} />
        </div>
      </div>

      {/* Widget Activité */}
      <div style={{ gridColumn: "span 2", background: "white", padding: "25px", borderRadius: "24px", border: "1px solid #eee", minHeight: "200px" }}>
        <h3 style={{ margin: "0 0 15px 0" }}>ACTIVITÉ</h3>
        <ResponsiveContainer width="100%" height={150}>
          <LineChart data={pointages.slice(0, 10).reverse()}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="date" hide />
            <YAxis hide />
            <Tooltip />
            <Line type="monotone" dataKey="id" stroke="#6366F1" strokeWidth={3} dot={{ r: 6 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Widget Budget */}
      <div style={{ background: "#4DB6AC", padding: "25px", borderRadius: "24px", color: "white", textAlign: "center" }}>
        <h3 style={{ margin: 0, textAlign: "left" }}>BUDGET</h3>
        <ResponsiveContainer width="100%" height={120}>
          <PieChart>
            <Pie data={dataBudget} innerRadius={35} outerRadius={50} paddingAngle={5} dataKey="value">
              {dataBudget.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index]} />)}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        <div style={{ fontWeight: "bold" }}>{totalConsomme.toLocaleString()} € / {totalBudget.toLocaleString()} €</div>
      </div>
    </div>
  );
};