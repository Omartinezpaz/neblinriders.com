// @ts-nocheck
import { factories } from '@strapi/strapi';

export default factories.createCoreController('api::ganga.ganga', ({ strapi }) => ({
  async create(ctx) {
    const { id } = ctx.state.user;
    if (!id) {
      return ctx.unauthorized('No estás autenticado');
    }
    
    // Inject user ID into data and use Document API to bypass strict REST validation on relations
    const { data } = ctx.request.body;
    
    const entity = await strapi.documents('api::ganga.ganga').create({
      data: {
        ...data,
        vendedor: id
      },
      status: 'published',
    });

    const sanitizedEntity = await this.sanitizeOutput(entity, ctx);
    return this.transformResponse(sanitizedEntity);
  }
}));
