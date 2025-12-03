import React, { useContext, useEffect, useRef, useState } from "react";
import { AuthContext } from "../../context/AuthContext";

import { Toast } from "primereact/toast";
import { Button } from "primereact/button";
import { Tag } from "primereact/tag";
import { Card } from "primereact/card";
import { Fieldset } from "primereact/fieldset";
import { Chart } from "primereact/chart";
import { ProgressBar } from "primereact/progressbar";
import { MeterGroup } from "primereact/metergroup";
import { Galleria } from "primereact/galleria";
import { Avatar } from "primereact/avatar";
import { ScrollTop } from "primereact/scrolltop";
// Asegúrate de que useMap esté importado aquí
import { MapContainer, TileLayer, Marker, Tooltip, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

import homeBanner from "../../img/background2.png";
import santiagoImg from "../../img/team/santiago.jpg";
import milenaImg from "../../img/team/milena.jpg";
import alejoImg from "../../img/team/alejo.jpg";

import "./HomeView.css";

// Fix icono por defecto de Leaflet en bundlers (Vite/CRA)
const defaultIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});
L.Marker.prototype.options.icon = defaultIcon;

// --- MAPA ZOOM ---
function MapZoomHandler({ coords }) {
  const map = useMap();
  useEffect(() => {
    if (coords) {
      map.flyTo(coords, 6, { 
        duration: 1.5,
      });
    }
  }, [coords, map]);
  return null;
}

const HomeView = () => {
  const { justLoggedIn, setJustLoggedIn } = useContext(AuthContext);
  const toast = useRef(null);
  const shownRef = useRef(false);

  const [activePort, setActivePort] = useState("Buenos Aires");
  // --- NUEVO: ESTADO PARA EL PUERTO SELECCIONADO EN EL MAPA ---
  const [selectedPort, setSelectedPort] = useState(null);
  
  const [galleryIndex, setGalleryIndex] = useState(0);

  // Toast de login
  useEffect(() => {
    if (justLoggedIn && !shownRef.current && toast.current) {
      toast.current.show({
        severity: "success",
        summary: "Éxito",
        detail: "Sesión iniciada con éxito",
        life: 3000,
      });
      setJustLoggedIn(false);
      shownRef.current = true;
    }
  }, [justLoggedIn, setJustLoggedIn]);

  // -----------------------------
  // DATA: Estadísticas principales
  // -----------------------------

  // Curva TEUs más exagerada (crecimiento fuerte)
  const teuGrowthData = {
    labels: ["2019", "2020", "2021", "2022", "2023", "2024"],
    datasets: [
      {
        label: "TEUs transportados",
        data: [20000, 45000, 90000, 150000, 230000, 320000],
        borderColor: "#009fd4",
        backgroundColor: "rgba(0, 159, 212, 0.18)",
        fill: true,
        tension: 0.35,
        pointRadius: 4,
        pointBackgroundColor: "#009fd4",
      },
    ],
  };

  const teuGrowthOptions = {
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: { color: "#1f2933" },
      },
      tooltip: {
        callbacks: {
          label: (ctx) => `${ctx.parsed.y.toLocaleString()} TEUs`,
        },
      },
    },
    scales: {
      x: {
        ticks: { color: "#6b7280" },
        grid: { display: false },
      },
      y: {
        beginAtZero: true,
        ticks: {
          color: "#6b7280",
          callback: (value) => value.toLocaleString(),
        },
        grid: { color: "rgba(209, 213, 219, 0.5)" },
      },
    },
  };

  // Crecimiento digital (multi eje, línea más horizontal)
  const digitalOpsData = {
    labels: ["2019", "2020", "2021", "2022", "2023", "2024"],
    datasets: [
      {
        type: "bar",
        label: "Servicios digitalizados (%)",
        data: [10, 25, 42, 60, 77, 90],
        backgroundColor: "rgba(0, 159, 212, 0.35)",
        borderRadius: 6,
        yAxisID: "y",
      },
      {
        type: "line",
        label: "Automatización de procesos (%)",
        data: [5, 18, 32, 50, 68, 85],
        borderColor: "#00c48c",
        backgroundColor: "rgba(0, 196, 140, 0.15)",
        fill: true,
        tension: 0,
        pointRadius: 4,
        pointBackgroundColor: "#00c48c",
        yAxisID: "y1",
      },
    ],
  };

  const digitalOpsOptions = {
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: { color: "#1f2933" },
      },
    },
    scales: {
      x: {
        ticks: { color: "#6b7280" },
        grid: { display: false },
      },
      y: {
        position: "left",
        min: 0,
        max: 100,
        ticks: {
          stepSize: 20,
          color: "#6b7280",
          callback: (v) => `${v}%`,
        },
        grid: { color: "rgba(209, 213, 219, 0.5)" },
      },
      y1: {
        position: "right",
        min: 0,
        max: 100,
        ticks: {
          stepSize: 20,
          color: "#6b7280",
          callback: (v) => `${v}%`,
        },
        grid: { drawOnChartArea: false },
      },
    },
  };

  // Donut regiones (ajustada)
  const regionData = {
    labels: ["Américas", "Europa", "Asia", "África", "Oceanía"],
    datasets: [
      {
        data: [38, 24, 22, 8, 8],
        backgroundColor: [
          "#009fd4",
          "#22c55e",
          "#facc15",
          "#fb7185",
          "#a855f7",
        ],
        hoverBackgroundColor: [
          "#0284c7",
          "#16a34a",
          "#eab308",
          "#f97373",
          "#9333ea",
        ],
        borderWidth: 1,
      },
    ],
  };

  const regionOptions = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: "65%",
    layout: {
      padding: 10,
    },
    plugins: {
      legend: {
        position: "right",
        labels: { color: "#4b5563", usePointStyle: true, boxWidth: 10 },
      },
    },
  };

  // -----------------------------
  // DATA: Indicadores clave
  // -----------------------------

  const kpiMeters = [
    {
      label: "Capacidad utilizada",
      value: 78,
      color: "#009fd4",
      icon: "pi pi-box",
    },
    {
      label: "Huella de carbono optimizada",
      value: 64,
      color: "#22c55e",
      icon: "pi pi-globe",
    },
    {
      label: "Automatización de procesos",
      value: 82,
      color: "#f97316",
      icon: "pi pi-cog",
    },
  ];

  // -----------------------------
  // DATA: Mapa (Leaflet - 70 puertos)
  // -----------------------------
  const puertos = [
    // América
    { nombre: "Buenos Aires (AR)", lat: -34.6037, lng: -58.3816 },
    { nombre: "Santos (BR)", lat: -23.9525, lng: -46.3333 },
    { nombre: "Valparaíso (CL)", lat: -33.036, lng: -71.6296 },
    { nombre: "Callao (PE)", lat: -12.0561, lng: -77.1181 },
    { nombre: "Manzanillo (MX)", lat: 19.0501, lng: -104.318 },
    { nombre: "Los Ángeles (US)", lat: 33.7361, lng: -118.2626 },
    { nombre: "Nueva York / NJ (US)", lat: 40.6681, lng: -74.0451 },
    { nombre: "Houston (US)", lat: 29.7319, lng: -95.262 },
    { nombre: "Savannah (US)", lat: 32.0816, lng: -81.0895 },
    { nombre: "Charleston (US)", lat: 32.7904, lng: -79.9229 },
    { nombre: "Oakland (US)", lat: 37.7955, lng: -122.275 },
    { nombre: "Seattle (US)", lat: 47.6062, lng: -122.3321 },
    { nombre: "Cartagena (CO)", lat: 10.391, lng: -75.4794 },
    { nombre: "Buenaventura (CO)", lat: 3.8801, lng: -77.0311 },
    { nombre: "Balboa (PA)", lat: 8.95, lng: -79.5667 },
    { nombre: "Colón (PA)", lat: 9.35, lng: -79.9 },
    { nombre: "Guayaquil (EC)", lat: -2.2038, lng: -79.8975 },
    { nombre: "Rio de Janeiro (BR)", lat: -22.894, lng: -43.151 },
    { nombre: "Itajaí (BR)", lat: -26.9048, lng: -48.6546 },
    { nombre: "Bahía Blanca (AR)", lat: -38.7196, lng: -62.2724 },

    // Europa
    { nombre: "Rotterdam (NL)", lat: 51.9555, lng: 4.1297 },
    { nombre: "Hamburgo (DE)", lat: 53.54, lng: 9.99 },
    { nombre: "Antwerp (BE)", lat: 51.2746, lng: 4.409 },
    { nombre: "Valencia (ES)", lat: 39.4333, lng: -0.3167 },
    { nombre: "Algeciras (ES)", lat: 36.1267, lng: -5.441 },
    { nombre: "Barcelona (ES)", lat: 41.3523, lng: 2.1589 },
    { nombre: "Gioia Tauro (IT)", lat: 38.4309, lng: 15.8988 },
    { nombre: "Pireo (GR)", lat: 37.9474, lng: 23.6371 },
    { nombre: "Felixstowe (UK)", lat: 51.955, lng: 1.311 },
    { nombre: "Le Havre (FR)", lat: 49.4938, lng: 0.1077 },
    { nombre: "Marsella (FR)", lat: 43.2965, lng: 5.3698 },
    { nombre: "Dublín (IE)", lat: 53.3469, lng: -6.195 },
    { nombre: "Gdansk (PL)", lat: 54.352, lng: 18.6466 },
    { nombre: "Oslo (NO)", lat: 59.9139, lng: 10.7522 },
    { nombre: "Bergen (NO)", lat: 60.39299, lng: 5.32415 },

    // Asia
    { nombre: "Singapore (SG)", lat: 1.2644, lng: 103.8222 },
    { nombre: "Shanghai (CN)", lat: 31.24, lng: 121.491 },
    { nombre: "Hong Kong (CN)", lat: 22.3129, lng: 114.225 },
    { nombre: "Busan (KR)", lat: 35.1017, lng: 129.0403 },
    { nombre: "Dubai (AE)", lat: 25.2712, lng: 55.3075 },
    { nombre: "Mumbai (IN)", lat: 18.949, lng: 72.8358 },
    { nombre: "Ningbo-Zhoushan (CN)", lat: 29.8683, lng: 121.544 },
    { nombre: "Shenzhen (CN)", lat: 22.5431, lng: 114.0579 },
    { nombre: "Qingdao (CN)", lat: 36.0671, lng: 120.3826 },
    { nombre: "Tianjin (CN)", lat: 39.3434, lng: 117.3616 },
    { nombre: "Port Klang (MY)", lat: 3.0033, lng: 101.4 },
    { nombre: "Tanjung Pelepas (MY)", lat: 1.3569, lng: 103.5679 },
    { nombre: "Laem Chabang (TH)", lat: 13.095, lng: 100.901 },
    { nombre: "Yokohama (JP)", lat: 35.4437, lng: 139.638 },
    { nombre: "Tokyo (JP)", lat: 35.6762, lng: 139.6503 },
    { nombre: "Kobe (JP)", lat: 34.6901, lng: 135.1955 },
    { nombre: "Kaohsiung (TW)", lat: 22.6273, lng: 120.3014 },
    { nombre: "Colombo (LK)", lat: 6.9271, lng: 79.8612 },
    { nombre: "Karachi (PK)", lat: 24.8607, lng: 67.0011 },

    // África
    { nombre: "Durban (ZA)", lat: -29.8711, lng: 31.0206 },
    { nombre: "Lagos (NG)", lat: 6.4242, lng: 3.4064 },
    { nombre: "Tánger Med (MA)", lat: 35.89, lng: -5.502 },
    { nombre: "Mombasa (KE)", lat: -4.0435, lng: 39.6682 },
    { nombre: "Port Said (EG)", lat: 31.2653, lng: 32.3019 },
    { nombre: "Alejandría (EG)", lat: 31.2001, lng: 29.9187 },
    { nombre: "Abiyán (CI)", lat: 5.3453, lng: -4.0244 },
    { nombre: "Tema (GH)", lat: 5.6676, lng: -0.0165 },
    { nombre: "Cape Town (ZA)", lat: -33.9249, lng: 18.4241 },
    { nombre: "Walvis Bay (NA)", lat: -22.9576, lng: 14.5053 },

    // Oceanía
    { nombre: "Sydney (AU)", lat: -33.8688, lng: 151.2093 },
    { nombre: "Melbourne (AU)", lat: -37.814, lng: 144.9633 },
    { nombre: "Auckland (NZ)", lat: -36.84, lng: 174.76 },
    { nombre: "Brisbane (AU)", lat: -27.4698, lng: 153.0251 },
    { nombre: "Fremantle (AU)", lat: -32.0569, lng: 115.7439 },
    { nombre: "Tauranga (NZ)", lat: -37.6861, lng: 176.1667 },
  ];

  // -----------------------------
  // DATA: Galería (URLs nuevas)
  // -----------------------------

  const galleryImages = [
    {
      src: "https://images.pexels.com/photos/4484078/pexels-photo-4484078.jpeg?auto=compress&cs=tinysrgb&w=1200",
      alt: "Operarios en depósito",
      title: "Coordinación en depósitos",
      subtitle: "Equipos sincronizados 24/7",
    },
    {
      src: "https://img.freepik.com/fotos-premium/operador-sala-control-rastreando-todos-barcos-anclados-lo-largo-linea-costera_1235831-143800.jpg",
      alt: "Centro de control logístico",
      title: "Centro de control",
      subtitle: "Monitoreo en tiempo real",
    },
    {
      src: "https://images.pexels.com/photos/3057960/pexels-photo-3057960.jpeg?auto=compress&cs=tinysrgb&w=1200",
      alt: "Containers en terminal",
      title: "Operaciones en muelle",
      subtitle: "Ejecución milimétrica de maniobras",
    },
    {
      src: "https://images.pexels.com/photos/2226458/pexels-photo-2226458.jpeg?auto=compress&cs=tinysrgb&w=1200",
      alt: "Barco portacontenedores en ruta",
      title: "Red logística global",
      subtitle: "Puertos conectados en todos los continentes",
    },
    {
      src: "https://images.pexels.com/photos/2326876/pexels-photo-2326876.jpeg?auto=compress&cs=tinysrgb&w=1200",
      alt: "Carga coordinada",
      title: "Operación 24/7",
      subtitle: "Seguimiento puerta a puerta",
    },
  ];

  const galleriaItemTemplate = (item) => (
    <img src={item.src} alt={item.alt} className="home-galleria-image" />
  );

  const galleriaThumbnailTemplate = (item) => (
    <img src={item.src} alt={item.alt} className="home-galleria-thumb" />
  );

  // -----------------------------
  // DATA: Colaboradores
  // -----------------------------

  const teamMembers = [
    {
      name: "Santiago",
      role: "Tech Lead & Fullstack Dev",
      description:
        "Diseñando y construyendo el ecosistema digital de la operación.",
      avatar: santiagoImg,
    },
    {
      name: "Milena",
      role: "Head of Operations",
      description:
        "Coordinando rutas, tiempos y equipos en múltiples husos horarios.",
      avatar: milenaImg,
    },
    {
      name: "Alejo",
      role: "Infra & Cloud Engineer",
      description:
        "Manteniendo la plataforma disponible, segura y escalable.",
      avatar: alejoImg,
    },
  ];

  // =============================
  // RENDER
  // =============================

  return (
    <div className="home-container">
      <Toast ref={toast} />

      {/* HERO */}
      <section className="home-hero">
        <div className="home-hero-media">
          <img src={homeBanner} alt="Barco portacontenedores" />
          <div className="home-hero-overlay" />
        </div>

        <div className="home-hero-content">
          <Tag
            value="Líder global en contenedores"
            className="home-hero-tag"
            icon="pi pi-bolt"
          />
          <h1 className="home-hero-title">
            Movemos el mundo{" "}
            <span className="home-hero-title-highlight">
              contenedor por contenedor.
            </span>
          </h1>
          <p className="home-hero-subtitle">
            Rutas inteligentes, puertos estratégicos y tecnología de punta para
            que tu carga llegue siempre a destino.
          </p>
          <div className="home-hero-actions">
            <Button
              label="Ver viajes activos"
              icon="pi pi-compass"
              className="p-button-rounded p-button-outlined home-hero-btn-secondary"
            />
            <Button
              label="Contactar comercial"
              icon="pi pi-send"
              className="p-button-rounded p-button-outlined home-hero-btn-secondary"
            />
          </div>
        </div>

        <div className="home-hero-stats-card">
          <h4>En tiempo real</h4>
          <div className="home-hero-stat-row">
            <div>
              <span className="home-hero-stat-number">128</span>
              <span className="home-hero-stat-label">viajes en tránsito</span>
            </div>
            <div>
              <span className="home-hero-stat-number">97%</span>
              <span className="home-hero-stat-label">entregas on-time</span>
            </div>
          </div>
          <div className="home-hero-stat-row">
            <div>
              <span className="home-hero-stat-number">42</span>
              <span className="home-hero-stat-label">puertos hoy</span>
            </div>
            <div>
              <span className="home-hero-stat-number">+18k</span>
              <span className="home-hero-stat-label">TEUs en tránsito</span>
            </div>
          </div>
        </div>
      </section>

      {/* MISIÓN & VISIÓN (intocable) */}
      <section className="home-section">
        <div className="home-section-inner">
          <h2 className="home-section-title">Misión & Visión</h2>
          <p className="home-section-subtitle">
            Guiamos nuestra operación con foco en eficiencia, innovación y
            sustentabilidad.
          </p>

          <div className="home-mission-banner">
            <div className="home-mission-banner-icon">
              <i className="pi pi-sitemap" />
            </div>
            <div className="home-mission-banner-text">
              <h4>Un socio estratégico para tu cadena logística</h4>
              <p>
                Diseñamos soluciones de transporte pensadas para integrarse con
                tus sistemas, tus tiempos y tus clientes.
              </p>
            </div>
          </div>

          <div className="home-mission-grid">
            <Card className="home-mission-card">
              <div className="home-mission-chip mission">
                <i className="pi pi-flag" />
                <span>Misión</span>
              </div>
              <p>
                Brindar soluciones logísticas marítimas confiables, integradas y
                predictivas, conectando empresas de todo el mundo con total
                transparencia y trazabilidad.
              </p>
            </Card>

            <Card className="home-mission-card">
              <div className="home-mission-chip vision">
                <i className="pi pi-globe" />
                <span>Visión</span>
              </div>
              <p>
                Ser la referencia global en transporte de contenedores,
                impulsando cadenas de suministro más inteligentes, verdes y
                colaborativas.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* ESTADÍSTICAS PRINCIPALES */}
      <section className="home-section">
        <div className="home-section-inner">
          <h2 className="home-section-title">Nuestro impacto en números</h2>
          <p className="home-section-subtitle">
            Crecimiento constante y presencia global respaldan cada viaje.
          </p>

          <div className="home-stats-grid-top">
            {/* Crecimiento digital */}
            <Card className="home-chart-card">
              <h3 className="home-chart-title">
                Crecimiento digital de la operación
              </h3>
              <div className="home-chart-container">
                <Chart
                  type="bar"
                  data={digitalOpsData}
                  options={digitalOpsOptions}
                />
              </div>
            </Card>

            {/* Donut de regiones */}
            <Card className="home-chart-card">
              <h3 className="home-chart-title">Distribución por región</h3>
              <div className="home-chart-container">
                <Chart
                  type="doughnut"
                  data={regionData}
                  options={regionOptions}
                />
              </div>
            </Card>
          </div>
      
          {/* TEUs abajo, ancho */}
          <Card className="home-chart-card-wide">
            <h3 className="home-chart-title">Evolución de volumen (TEUs)</h3>
            <div className="home-chart-container-wide">
              <Chart
                type="line"
                data={teuGrowthData}
                options={teuGrowthOptions}
              />
            </div>
          </Card>
        </div>
      </section>

      {/* INDICADORES CLAVE */}
      <section className="home-section">
        <div className="home-section-inner">
          <h2 className="home-section-title">Indicadores de performance</h2>
          <p className="home-section-subtitle">
            Métricas operativas que seguimos día a día para asegurar resultados.
          </p>

          <div className="home-kpi-grid">
            {/* MeterGroup */}
            <Card className="home-kpi-card">
              <h3 className="home-chart-title">Indicadores clave</h3>
              <p className="home-kpi-description">
                Cómo se distribuye el rendimiento de tu operación en los
                principales frentes.
              </p>

              <MeterGroup
                values={kpiMeters.map((m) => ({
                  label: m.label,
                  value: m.value,
                  color: m.color,
                  icon: m.icon,
                }))}
              />
            </Card>

            {/* Barra de puntualidad */}
            <Card className="home-kpi-card">
              <h3 className="home-chart-title">Puntualidad y visibilidad</h3>
              <p className="home-kpi-description">
                Niveles de cumplimiento y tracking activos en toda la red.
              </p>

              <div className="home-kpi-progress-block">
                <div className="home-kpi-progress-label">
                  <span>Puntualidad histórica</span>
                  <span>96%</span>
                </div>
                <ProgressBar value={96} showValue={false} />
              </div>

              <div className="home-kpi-progress-block">
                <div className="home-kpi-progress-label">
                  <span>Viajes con tracking activo</span>
                  <span>92%</span>
                </div>
                <ProgressBar
                  value={92}
                  showValue={false}
                  className="home-kpi-progress-secondary"
                />
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* MAPA - Leaflet + lista scrollable */}
      <section className="home-section">
        <div className="home-section-inner">
          <h2 className="home-section-title">Red global de puertos</h2>
          <p className="home-section-subtitle">
            Conectamos hubs estratégicos en todos los continentes para asegurar
            rutas eficientes.
          </p>

          <div className="home-map-grid">
            <div className="home-map-card">
              <MapContainer
                center={[10, 5]}
                zoom={2}
                scrollWheelZoom={true}
                className="home-map-leaflet"
              >
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution="&copy; OpenStreetMap contributors"
                />
                
                {/* AQUI SE AGREGA EL COMPONENTE PARA HACER ZOOM */}
                <MapZoomHandler coords={selectedPort} />

                {puertos.map((p, idx) => (
                  <Marker 
                    key={idx} 
                    position={[p.lat, p.lng]}
                    eventHandlers={{
                      click: () => setSelectedPort([p.lat, p.lng]),
                    }}
                  >
                    <Tooltip direction="top" offset={[0, -10]} opacity={0.9}>
                      {p.nombre}
                    </Tooltip>
                  </Marker>
                ))}
              </MapContainer>
            </div>

            {/* LISTA A LA DERECHA */}
            <div className="home-map-list-card">
                <div className="home-map-list-header">
                    <h3>Ubicaciones Activas ({puertos.length})</h3>
                </div>
                <ul className="home-map-list">
                    {puertos.map((p, idx) => (
                    <li 
                        key={idx} 
                        className="home-map-list-item"
                        onClick={() => setSelectedPort([p.lat, p.lng])}
                    >
                        <div className="home-map-list-icon">
                        <i className="pi pi-map-marker" />
                        </div>
                        <div className="home-map-list-info">
                        <h4>{p.nombre}</h4>
                        <span>Lat: {p.lat.toFixed(2)}, Lng: {p.lng.toFixed(2)}</span>
                        </div>
                    </li>
                    ))}
                </ul>
            </div>
          </div>
        </div>
      </section>

{/* GALERÍA */}
<section className="home-section">
        <div className="home-section-inner">
          <h2 className="home-section-title">Momentos de operación</h2>
          <p className="home-section-subtitle">
            Un vistazo a la logística diaria detrás de cada contenedor.
          </p>

          <div className="home-gallery-grid">
            {/* LADO IZQUIERDO: FOTOS */}
            {/* Nota: Aquí cambié <Card> por <div> para quitar bordes extraños de PrimeReact */}
            <div className="home-gallery-card">
              <Galleria
                value={galleryImages}
                numVisible={4}
                circular
                showThumbnails
                showIndicators={false}
                item={galleriaItemTemplate}
                thumbnail={galleriaThumbnailTemplate}
                activeIndex={galleryIndex}
                onItemChange={(e) => setGalleryIndex(e.index)}
                className="home-galleria"
              />
            </div>

            {/* LADO DERECHO: INFO TÉCNICA (Actualizado) */}
            <div className="home-gallery-info-card">
              <h3 className="home-gallery-info-title">
                Infraestructura y Tecnología
              </h3>
              <p className="home-gallery-info-text">
                Nuestra flota y centros de operaciones están equipados con los
                últimos estándares de seguridad y monitoreo satelital en tiempo
                real, garantizando la integridad de tu carga.
              </p>

              <ul className="home-gallery-info-list">
                <li>
                  <i className="pi pi-box" />
                  <span>Contenedores Reefers & Dry High Cube</span>
                </li>
                <li>
                  <i className="pi pi-shield" />
                  <span>Monitoreo de carga 24/7 y precintos digitales</span>
                </li>
                <li>
                  <i className="pi pi-globe" />
                  <span>Cobertura en +120 puertos internacionales</span>
                </li>
                <li>
                  <i className="pi pi-check-circle" />
                  <span>Certificación ISO 9001 en gestión de calidad</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* COLABORADORES */}
      <section className="home-section home-team-section">
        <div className="home-section-inner">
          <h2 className="home-section-title">
            Personas detrás de la operación
          </h2>
          <p className="home-section-subtitle">
            Un equipo multidisciplinario sosteniendo cada viaje.
          </p>

          <div className="home-team-grid">
            {teamMembers.map((member) => (
              <Card key={member.name} className="home-team-card">
                <div className="home-team-card-header">
                  <div className="home-team-avatar-wrapper">
                    <Avatar
                      image={member.avatar}
                      shape="circle"
                      size="xlarge"
                      className="home-team-avatar"
                    />
                  </div>
                </div>
                <div className="home-team-card-body">
                  <h3 className="home-team-name">{member.name}</h3>
                  <p className="home-team-role">{member.role}</p>
                  <p className="home-team-description">{member.description}</p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ScrollTop */}
      <ScrollTop threshold={300} className="home-scrolltop" icon="pi pi-arrow-up" />
    </div>
  );
};

export default HomeView;