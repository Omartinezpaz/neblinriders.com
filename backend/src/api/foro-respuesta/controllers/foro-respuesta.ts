// @ts-nocheck
import { factories } from '@strapi/strapi';

export default factories.createCoreController('api::foro-respuesta.foro-respuesta', ({ strapi }) => ({
  async create(ctx) {
    const { id } = ctx.state.user;
    if (!id) return ctx.unauthorized('No estás autenticado');

    const { data } = ctx.request.body;
    
    const entity = await strapi.documents('api::foro-respuesta.foro-respuesta').create({
      data: {
        ...data,
        autor: id
      },
      status: 'published',
    });

    const sanitizedEntity = await this.sanitizeOutput(entity, ctx);
    return this.transformResponse(sanitizedEntity);
  }
}));
