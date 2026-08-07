import React from 'react';
import './PoliticaPrivacidad.css';

export default function PoliticaPrivacidad() {
  return (
    <section className="legal-page nr-glow-line">
      <div className="legal-container">
        <h1>Política de Privacidad</h1>
        <p className="last-updated">Última actualización: Agosto 2026</p>

        <div className="legal-content">
          <h2>1. Información que recopilamos</h2>
          <p>
            Al registrarte en Neblina Riders (ya sea para el ForoBiker o GangaBiker), recopilamos la siguiente información personal:
          </p>
          <ul>
            <li>Nombre y Apellido</li>
            <li>Nombre de usuario (Alias/Apodo Biker)</li>
            <li>Correo electrónico</li>
            <li>Modelo y Placa de tu moto</li>
            <li>Tipo de sangre (para emergencias en ruta)</li>
            <li>Fotografía de perfil (Avatar) y Fotos de gangas que subas a la plataforma</li>
          </ul>

          <h2>2. Uso de la información</h2>
          <p>
            Tus datos son utilizados exclusivamente para:
          </p>
          <ul>
            <li>Identificarte dentro del ecosistema de Neblina Riders (Foro y Compra/Venta).</li>
            <li>Facilitar el contacto entre miembros en caso de que publiques una Ganga.</li>
            <li>Proveer información vital (como el Tipo de Sangre) a los líderes de ruta o paramédicos en caso de presentarse una emergencia durante nuestras rodadas oficiales.</li>
            <li>Mantener un entorno seguro y moderado en el ForoBiker.</li>
          </ul>

          <h2>3. Protección de tus datos</h2>
          <p>
            Tomamos la seguridad de tu información muy en serio. Tu contraseña es almacenada mediante cifrado criptográfico seguro (hashing) por nuestro proveedor backend (Strapi). Las imágenes que subes son alojadas a través de Cloudinary. No vendemos, alquilamos ni compartimos tu información personal con terceros para fines comerciales o de marketing ajenos al club.
          </p>

          <h2>4. GangaBiker y Responsabilidad</h2>
          <p>
            Al utilizar GangaBiker, entiendes que <strong>Neblina Riders actúa únicamente como un tablón de anuncios</strong>. No nos hacemos responsables por fraudes, el estado de los artículos, estafas ni transferencias de dinero entre usuarios. Cualquier dato de contacto (teléfono o correo) que compartas de manera pública o privada para concretar una venta corre bajo tu propio riesgo.
          </p>

          <h2>5. Retención y Eliminación</h2>
          <p>
            Puedes solicitar la eliminación de tu cuenta y todos tus datos asociados en cualquier momento enviando un correo a <strong>contacto@neblinariders.com</strong> o contactando directamente a un administrador (The Eagle) a través del foro. Tus datos serán borrados de nuestros servidores en un plazo máximo de 72 horas hábiles.
          </p>

          <h2>6. Cambios a esta Política</h2>
          <p>
            Nos reservamos el derecho de actualizar esta Política de Privacidad en cualquier momento. Cualquier cambio significativo será notificado a través del foro o mediante correo electrónico.
          </p>
        </div>
      </div>
    </section>
  );
}
