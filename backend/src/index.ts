import type { Core } from '@strapi/strapi';

export default {
  register(/* { strapi }: { strapi: Core.Strapi } */) {},

  async bootstrap({ strapi }: { strapi: Core.Strapi }) {
    try {
      // 1. Seed Recursos Útiles (Venezuela / Altos Mirandinos)
      const existingRecursos = await strapi.documents('api::recurso.recurso').findMany({});
      if (!existingRecursos || existingRecursos.length === 0) {
        console.log('🌱 Seeding Recursos Útiles iniciales...');

        const recursosData = [
          {
            nombre: 'INTT - Consulta de Multas y Tránsito',
            url: 'https://www.intt.gob.ve',
            icono: 'AlertTriangle'
          },
          {
            nombre: 'Ley de Transporte Terrestre (Gaceta 38.985)',
            url: 'https://www.asambleanacional.gob.ve/storage/documentos/leyes/ley-de-tra-20220131163021.pdf',
            icono: 'BookOpen'
          },
          {
            nombre: 'SUDEASEG - Registro de Aseguradoras RCV',
            url: 'https://www.sudeaseg.gob.ve/',
            icono: 'ShieldCheck'
          },
          {
            nombre: 'Alcaldía de Guaicaipuro (Los Teques) - Impuestos',
            url: 'https://alcaldiadeguaicaipuro.gob.ve/',
            icono: 'Map'
          },
          {
            nombre: 'Alcaldía de Los Salias - Impuesto Vehicular',
            url: 'https://alcaldialossalias.gob.ve/',
            icono: 'Map'
          }
        ];

        for (const rec of recursosData) {
          await strapi.documents('api::recurso.recurso').create({
            data: {
              nombre: rec.nombre,
              url: rec.url,
              icono: rec.icono
            },
            status: 'published'
          });
        }
        console.log('✅ Recursos Útiles iniciales sembrados exitosamente.');
      }

      // 2. Seed Artículos / Noticias iniciales
      const existingArticulos = await strapi.documents('api::articulo.articulo').findMany({});
      if (!existingArticulos || existingArticulos.length === 0) {
        console.log('🌱 Seeding Artículos y Noticias iniciales...');

        const articulosData = [
          {
            titulo: 'Guía de Rutas Seguras por Los Altos Mirandinos',
            slug: 'guia-de-rutas-seguras-los-altos-mirandinos',
            resumen: 'Descubre los mejores caminos, paradas recomendadas y consejos de prevención para rodar sin contratiempos por San Antonio, Los Teques y Carrizal.',
            categoria: 'tips_para_viajero'
          },
          {
            titulo: 'Mantenimiento Preventivo: Prepara tu Moto para la Niebla',
            slug: 'mantenimiento-preventivo-prepara-tu-moto-para-la-niebla',
            resumen: 'La neblina y la humedad constante de los cerros exigen frenos e iluminación impecables. Revisa esta lista esencial antes de salir a la carretera.',
            categoria: 'tecnologia'
          },
          {
            titulo: 'Equipo de Protección Indispensable para el Enjambre',
            slug: 'equipo-de-proteccion-indispensable-para-el-enjambre',
            resumen: 'Cascos certificados, chaquetas con protección contra impactos y guantes térmicos. La seguridad de nuestra comunidad siempre es lo primero.',
            categoria: 'equipo_de_proteccion'
          }
        ] as const;

        for (const art of articulosData) {
          await strapi.documents('api::articulo.articulo').create({
            data: {
              titulo: art.titulo,
              slug: art.slug,
              resumen: art.resumen,
              categoria: art.categoria
            },
            status: 'published'
          });
        }
        console.log('✅ Artículos iniciales sembrados exitosamente.');
      }

      // 3. Activar permisos públicos automáticos para la API de Publicidad
      const publicRole = await strapi.db.query('plugin::users-permissions.role').findOne({
        where: { type: 'public' },
      });

      if (publicRole) {
        const existingPermission = await strapi.db.query('plugin::users-permissions.permission').findOne({
          where: {
            role: publicRole.id,
            action: 'api::publicidad.publicidad.find',
          },
        });

        if (!existingPermission) {
          await strapi.db.query('plugin::users-permissions.permission').create({
            data: {
              action: 'api::publicidad.publicidad.find',
              role: publicRole.id,
            },
          });
          await strapi.db.query('plugin::users-permissions.permission').create({
            data: {
              action: 'api::publicidad.publicidad.findOne',
              role: publicRole.id,
            },
          });
          console.log('🔓 Permisos públicos para Publicidad activados automáticamente.');
        }

        // 4. Permisos públicos de LECTURA para ForoBiker (temas y respuestas)
        const existingForoPermission = await strapi.db.query('plugin::users-permissions.permission').findOne({
          where: {
            role: publicRole.id,
            action: 'api::foro-tema.foro-tema.find',
          },
        });

        if (!existingForoPermission) {
          const foroPublicActions = [
            'api::foro-tema.foro-tema.find',
            'api::foro-tema.foro-tema.findOne',
            'api::foro-respuesta.foro-respuesta.find',
            'api::foro-respuesta.foro-respuesta.findOne',
          ];
          for (const action of foroPublicActions) {
            await strapi.db.query('plugin::users-permissions.permission').create({
              data: { action, role: publicRole.id },
            });
          }
          console.log('🔓 Permisos públicos de lectura para ForoBiker activados automáticamente.');
        }

        // 5. Permisos públicos de LECTURA para Videos Biker
        const existingVideoPermission = await strapi.db.query('plugin::users-permissions.permission').findOne({
          where: {
            role: publicRole.id,
            action: 'api::video.video.find',
          },
        });

        if (!existingVideoPermission) {
          const videoPublicActions = [
            'api::video.video.find',
            'api::video.video.findOne',
          ];
          for (const action of videoPublicActions) {
            await strapi.db.query('plugin::users-permissions.permission').create({
              data: { action, role: publicRole.id },
            });
          }
          console.log('🔓 Permisos públicos de lectura para Videos Biker activados automáticamente.');
        }
      }

      // 6. Seed Videos Iniciales
      const existingVideos = await strapi.documents('api::video.video').findMany({});
      if (!existingVideos || existingVideos.length === 0) {
        console.log('🌱 Seeding Videos iniciales...');
        const videosData = [
          {
            titulo: 'Dominar 400 Test Drive en Los Teques',
            descripcion: 'Probando la fuerza de la Dominar 400 subiendo la Panamericana con niebla.',
            youtube_url: 'https://youtu.be/jNQXAC9IVRw',
            categoria: 'Review'
          },
          {
            titulo: 'Ruta nocturna: Caracas - San Antonio',
            descripcion: 'Un recorrido nocturno espectacular por la Panamericana con el Enjambre.',
            youtube_url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
            categoria: 'Aventura'
          },
          {
            titulo: 'Track Day Turagua - Grupo de Novatos',
            descripcion: 'Primer acercamiento al circuito de Turagua para pulir habilidades.',
            youtube_url: 'https://youtu.be/9bZkp7q19f0',
            categoria: 'Circuito'
          }
        ] as const;

        for (const vid of videosData) {
          await strapi.documents('api::video.video').create({
            data: {
              titulo: vid.titulo,
              descripcion: vid.descripcion,
              youtube_url: vid.youtube_url,
              categoria: vid.categoria
            },
            status: 'published'
          });
        }
        console.log('✅ Videos iniciales sembrados exitosamente.');
      }

      // 7. Permisos para usuarios autenticados
      const authRole = await strapi.db.query('plugin::users-permissions.role').findOne({
        where: { type: 'authenticated' },
      });

      if (authRole) {
        const authActions = [
          'api::foro-tema.foro-tema.create',
          'api::foro-tema.foro-tema.update',
          'api::foro-tema.foro-tema.delete',
          'api::foro-respuesta.foro-respuesta.create',
          'api::foro-respuesta.foro-respuesta.update',
          'api::foro-respuesta.foro-respuesta.delete',
          'api::ganga.ganga.create',
          'api::ganga.ganga.update',
          'api::ganga.ganga.delete'
        ];

        let authPermissionsAdded = false;
        for (const action of authActions) {
          const exists = await strapi.db.query('plugin::users-permissions.permission').findOne({
            where: { role: authRole.id, action },
          });
          if (!exists) {
            await strapi.db.query('plugin::users-permissions.permission').create({
              data: { action, role: authRole.id },
            });
            authPermissionsAdded = true;
          }
        }
        if (authPermissionsAdded) {
          console.log('🔐 Permisos de creación/edición para usuarios autenticados activados automáticamente.');
        }
      }
    } catch (err) {
      console.error('⚠️ Error en bootstrap:', err);
    }
  },
};
