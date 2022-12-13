import { render, screen } from '@testing-library/react';

import '../test/jest/__mock__';
import UDPFilters from './UDPFilters';
import aggregator from '../test/fixtures/aggregator';

const data = {
  udps: [],
  aggregators: [{ aggregator }],
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
