module.exports = {
  Query: {
    user(_: any, { id }, ctx) {
      return ctx.connector.user.fetchById(id);
    },
  },
  Mutation: {
    addUser(_: any, { name }, ctx) {
      return ctx.connector.user.save(name);
    },
  },
};
