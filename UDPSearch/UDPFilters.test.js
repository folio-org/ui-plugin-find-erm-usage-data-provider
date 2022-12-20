import { render, screen } from '@testing-library/react';

import '../test/jest/__mock__';
import UDPFilters from './UDPFilters';

const data = {
  udps: [],
  aggregators: [{ label: 'test', value: 'test' }],
};

const renderSourceFilter = () => (
  render(
    <UDPFilters
      activeFilters={{}}
      data={data}
      filterHandlers={{}}
    />,
  )
);

describe('UDPFilters component', () => {
  beforeEach(() => {
    renderSourceFilter();
  });

  it('should display filters', () => {
    expect(screen.getByText('ui-plugin-find-erm-usage-data-provider.information.harvestingStatus')).toBeDefined();
    expect(screen.getByText('ui-plugin-find-erm-usage-data-provider.information.harvestVia')).toBeDefined();
    expect(screen.getByText('ui-plugin-find-erm-usage-data-provider.information.aggregators')).toBeDefined();
  });
});
