export default {
  async getActivos(ctx: any) {
    try {
      // Query users directly from DB, selecting non-sensitive fields and populating avatar relation
      const miembros = await strapi.db.query('plugin::users-permissions.user').findMany({
        select: ['id', 'username', 'apodo'],
        populate: { avatar: true },
        where: { blocked: false }, // Only active users
        limit: 100 // Prevent huge payloads
      });
      ctx.body = miembros;
    } catch (err) {
      ctx.body = { error: 'Error fetching members' };
      ctx.status = 500;
    }
  }
};
