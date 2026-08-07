// @ts-nocheck
import { factories } from '@strapi/strapi';
export default factories.createCoreController('api::foro-tema.foro-tema', ({ strapi }) => ({
  async create(ctx) {
    const { id } = ctx.state.user;
    if (!id) return ctx.unauthorized('No estás autenticado');

    const { data } = ctx.request.body;
    
    const entity = await strapi.documents('api::foro-tema.foro-tema').create({
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
