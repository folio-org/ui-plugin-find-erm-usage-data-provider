const filterGroups = [
  {
    label: 'Harvesting status',
    name: 'harvestingStatus',
    cql: 'harvestingConfig.harvestingStatus',
    values: [
      { name: 'Active', cql: 'active' },
      { name: 'Inactive', cql: 'inactive' }
    ]
  },
  {
    label: 'Harvest via',
    name: 'harvestVia',
    cql: 'harvestingConfig.harvestVia',
    values: [
      { name: 'Sushi', cql: 'sushi' },
      { name: 'Aggregator', cql: 'aggregator' }
    ]
  },
  {
    label: 'Aggregators',
    name: 'aggregators',
    cql: 'harvestingConfig.aggregator.name',
    values: [],
    restrictWhenAllSelected: true
  }
];

export default filterGroups;
