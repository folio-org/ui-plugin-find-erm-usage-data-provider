import {
  render,
  screen,
} from '@folio/jest-config-stripes/testing-library/react';

import UDPFilters from './UDPFilters';

const data = { udps: [] };

const renderSourceFilter = () => render(<UDPFilters activeFilters={{}} data={data} filterHandlers={{}} />);

describe('UDPFilters component', () => {
  beforeEach(() => {
    renderSourceFilter();
  });

  it('should display filters', () => {
    expect(
      screen.getByText('ui-plugin-find-erm-usage-data-provider.information.harvestingStatus')
    ).toBeInTheDocument();
  });
});
