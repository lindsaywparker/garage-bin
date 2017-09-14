const items = [
  {
    id: 1,
    name: 'Hockey sticks',
    reason: 'Because someone should always have hockey sticks available',
    cleanliness: 'Rancid',
  },
  {
    id: 2,
    name: 'Tools, so many tools',
    reason: 'Requirement for a happy life',
    cleanliness: 'Dusty',
  },
  {
    id: 3,
    name: 'Cars',
    reason: 'Also a requirement',
    cleanliness: 'Sparkling',
  },
];

exports.seed = (knex, Promise) => {
  return knex('item').del()
    .then(() => {
      return Promise.all(items.map((item) => {
        return knex('item').insert(item);
      }));
    })
};
