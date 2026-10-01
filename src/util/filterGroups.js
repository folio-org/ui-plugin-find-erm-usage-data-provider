const filterGroups = [
  {
    label: 'Harvesting status',
    name: 'harvestingStatus',
    cql: 'harvestingConfig.harvestingStatus',
    values: [
      { name: 'Active', cql: 'active' },
      { name: 'Inactive', cql: 'inactive' },
    ],
  },
];

export default filterGroups;
