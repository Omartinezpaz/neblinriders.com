import React from 'react';
import './Nosotros.css';

export default function Nosotros() {
  return (
    <div className="nosotros-page">
      <div className="nosotros-hero nr-glow-line">
        <div className="nosotros-hero-content">
          <h1>EL ENJAMBRE</h1>
          <p>Más que un club, una hermandad en los Altos Mirandinos.</p>
        </div>
      </div>

      <section className="nosotros-historia">
        <div className="nosotros-container">
          <h2>Nuestra Historia</h2>
          <p>
            Neblina Riders nació en las frías y nubladas rutas de los Altos Mirandinos, Venezuela. Lo que comenzó como un pequeño grupo de entusiastas de las motos que se reunían para rodar hacia la Colonia Tovar y la Panamericana, pronto evolucionó hasta convertirse en una de las comunidades más unidas y respetadas de la región.
          </p>
          <p>
            Tomamos nuestro nombre de la densa niebla que caracteriza nuestras montañas, un elemento que nos enseñó a rodar con precaución, a confiar en el compañero que va delante y a mantener siempre las luces encendidas. Hoy en día, nuestro "Enjambre" acoge a motociclistas de todas las cilindradas y estilos, unidos por un mismo código de asfalto.
          </p>
        </div>
      </section>

      <section className="nosotros-mision-vision">
        <div className="nosotros-container grid-2">
          <div className="mv-card">
            <div className="mv-icon">🎯</div>
            <h3>Nuestra Misión</h3>
            <p>
              Fomentar el motociclismo responsable, crear lazos de hermandad inquebrantables entre los riders y promover la seguridad vial en cada kilómetro recorrido.
            </p>
          </div>
          <div className="mv-card">
            <div className="mv-icon">👁️</div>
            <h3>Nuestra Visión</h3>
            <p>
              Ser la comunidad motera de referencia en Venezuela, reconocida no solo por nuestra pasión por las dos ruedas, sino por nuestro impacto positivo en la sociedad y el turismo local.
            </p>
          </div>
        </div>
      </section>

      <section className="nosotros-valores nr-glow-line">
        <div className="nosotros-container">
          <h2>El Código Biker (Valores)</h2>
          <div className="valores-grid">
            <div className="valor-item">
              <h4>🤝 Hermandad</h4>
              <p>Ningún Rider se queda atrás. Nos cuidamos dentro y fuera de la ruta.</p>
            </div>
            <div className="valor-item">
              <h4>🛡️ Respeto</h4>
              <p>Hacia todos los usuarios de la vía, sin importar el vehículo o cilindrada.</p>
            </div>
            <div className="valor-item">
              <h4>🚦 Responsabilidad</h4>
              <p>Equipamiento adecuado y cumplimiento de las normas de tránsito siempre.</p>
            </div>
            <div className="valor-item">
              <h4>✌️ Cortesía</h4>
              <p>El saludo biker no se niega, y la ayuda en carretera es obligatoria.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
