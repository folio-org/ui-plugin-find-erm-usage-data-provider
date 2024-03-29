import { render } from '@folio/jest-config-stripes/testing-library/react';
import UDPSearchContainer from './UDPSearchContainer';

jest.mock('./UDPsView', () => {
  return () => <span>UDPsView</span>;
});

const onSelectRow = jest.fn();

const renderUDPSearchContainer = (mutator) =>
  render(<UDPSearchContainer mutator={mutator} onSelectRow={onSelectRow} />);

describe('UDPSearchContainer component', () => {
  let mutator;

  beforeEach(() => {
    mutator = { query: { update: jest.fn() } };
  });

  it('should not update query when plugin is open', async () => {
    renderUDPSearchContainer(mutator);

    expect(mutator.query.update).not.toHaveBeenCalled();
  });

  test('should handle onSelectRow', () => {
    expect(onSelectRow).not.toHaveBeenCalled();
  });
});
