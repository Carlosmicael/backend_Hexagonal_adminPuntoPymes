import React from 'react';
import './DashboardPage.css'; // Asegúrate de tener este archivo CSS
import useAuth from '../../hooks/useAuth';
const DashboardPage = () => {
  // Puedes usar datos de tu estado o llamadas API aquí para mostrar métricas reales
  const stats = [
    { title: "Ventas Hoy", value: "€ 1.250", icon: "💰" },
    { title: "Nuevos Usuarios", value: "45", icon: "👤" },
    { title: "Pedidos Pendientes", value: "12", icon: "📦" },
    { title: "Tasa de Conversión", value: "3.5%", icon: "📈" },
  ];

  const { logout } = useAuth();

  return (
    <div className="dashboard-content-wrapper">
      <h1 className="dashboard-title">✨ Resumen del Panel de Control</h1>
      <p className="dashboard-subtitle">Bienvenido, Carlos. Aquí tienes un resumen de la actividad de tu negocio.</p>

      {/* Tarjetas de Métricas */}
      <div className="stats-grid">
        {stats.map((stat, index) => (
          <div key={index} className="stat-card">
            <span className="stat-icon">{stat.icon}</span>
            <div className="stat-info">
              <p className="stat-value">{stat.value}</p>
              <p className="stat-title">{stat.title}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Sección de Gráficos (Simulación) */}
      <div className="charts-section">
        <div className="chart-placeholder">
          <h2>Gráfico de Ventas Mensuales</h2>
          <p>Aquí se renderizaría un componente de gráfico (ej. Chart.js o Recharts).</p>
        </div>
        <div className="chart-placeholder">
          <h2>Actividad Reciente</h2>
          <p>Aquí se mostraría una tabla de logs o acciones recientes.</p>
        </div>
      </div>
      <button onClick={logout}>Cerrar Sesión</button>
    </div>
    
  );
};

export default DashboardPage;