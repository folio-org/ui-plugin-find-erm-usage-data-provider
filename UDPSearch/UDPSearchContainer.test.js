import { render, act } from '@testing-library/react';

import '../test/jest/__mock__';
import UDPSearchContainer from './UDPSearchContainer';

jest.mock('./UDPsView', () => {
  return () => <span>UDPsView</span>;
});

const onSelectRow = jest.fn();

const renderUDPSearchContainer = (mutator) => (render(
  <UDPSearchContainer
    mutator={mutator}
    onSelectRow={onSelectRow}
  />,
));

describe('UDPSearchContainer component', () => {
  let mutator;

  beforeEach(() => {
    mutator = { query: { update: jest.fn() } };
  });

  it('should not update query when plugin is open', async () => {
    await act(async () => {
      renderUDPSearchContainer(mutator);
    });

    expect(mutator.query.update).not.toHaveBeenCalled();
  });

  test('should handle onSelectRow', () => {
    expect(onSelectRow).not.toHaveBeenCalled();
  });
});
