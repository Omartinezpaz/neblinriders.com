'use strict';

module.exports = (plugin) => {
  // Añadir la ruta PUT /api/users/me
  plugin.routes['content-api'].routes.push({
    method: 'PUT',
    path: '/users/me',
    handler: 'user.updateMe',
    config: {
      prefix: '',
      policies: []
    }
  });

  // Añadir el controlador para updateMe
  plugin.controllers.user.updateMe = async (ctx) => {
    if (!ctx.state.user || !ctx.state.user.id) {
      return ctx.unauthorized();
    }
    
    // Obtenemos los datos a actualizar del cuerpo de la petición
    const updates = ctx.request.body;
    
    // Por seguridad, evitamos que cambien su role, password, email, etc por esta vía directa
    // O si prefieres, simplemente confiamos en que el frontend solo manda nombre/apellido
    const safeUpdates = {
      nombre: updates.nombre,
      apellido: updates.apellido,
      apodo: updates.apodo,
      modeloMoto: updates.modeloMoto,
      placaMoto: updates.placaMoto,
      direccion: updates.direccion,
      tipoSangre: updates.tipoSangre,
      alergias: updates.alergias,
      contactoEmergenciaNombre: updates.contactoEmergenciaNombre,
      contactoEmergenciaTelefono: updates.contactoEmergenciaTelefono
    };

    // Limpiar campos undefined
    Object.keys(safeUpdates).forEach(key => safeUpdates[key] === undefined && delete safeUpdates[key]);

    try {
      const updatedUser = await strapi.entityService.update(
        'plugin::users-permissions.user',
        ctx.state.user.id,
        { data: safeUpdates }
      );
      
      // No devolvemos información privada
      const sanitizedUser = await strapi.plugin('users-permissions').service('user').sanitizeOutput(updatedUser, ctx);
      ctx.send(sanitizedUser);
    } catch (err) {
      ctx.badRequest('No se pudo actualizar el perfil', { errors: err });
    }
  };

  return plugin;
};
