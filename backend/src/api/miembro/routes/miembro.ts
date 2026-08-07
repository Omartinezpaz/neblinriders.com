export default {
  routes: [
    {
      method: 'GET',
      path: '/miembros/activos',
      handler: 'miembro.getActivos',
      config: {
        auth: false,
      },
    },
  ],
};
