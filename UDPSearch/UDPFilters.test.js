import { render, screen } from '@testing-library/react';

import UDPFilters from './UDPFilters';

const renderSourceFilter = () => (
  render(
    <UDPFilters
      activeFilters={{}}
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
