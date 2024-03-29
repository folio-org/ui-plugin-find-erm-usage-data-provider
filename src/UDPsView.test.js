import userEvent from '@folio/jest-config-stripes/testing-library/user-event';
import { noop } from 'lodash';
import { BrowserRouter as Router } from 'react-router-dom';
import udps from '../test/fixtures/udps';
import renderWithIntl from '../test/jest/helpers/renderWithIntl';
import translationsProperties from '../test/jest/helpers/translationsProperties';
import UDPsView from './UDPsView';

const DATA = {
  aggregators: [],
  udps,
};

const onSubmit = jest.fn();

const renderUDPsView = (
  data = DATA,
  queryGetter = noop,
  querySetter = noop,
  visibleColumns = ['label', 'harvestingStatus', 'latestStats', 'aggregator']
) =>
  renderWithIntl(
    <Router>
      <UDPsView
        data={data}
        queryGetter={queryGetter}
        querySetter={querySetter}
        onSubmit={onSubmit}
        visibleColumns={visibleColumns}
      />
    </Router>,
    translationsProperties
  );

describe('UDPsView', () => {
  beforeEach(() => {
    renderUDPsView();
  });

  it('filter pane and searchField should be visible', () => {
    expect(document.querySelector('#plugin-find-udp-filter-pane')).toBeInTheDocument();
    expect(document.querySelector('#input-udp-search')).toBeInTheDocument();
  });

  it('search field should be active element', () => {
    const focusedElem = document.activeElement;
    expect(focusedElem?.id).toBe('input-udp-search');
  });

  it('buttons for submit and reset should be visible', () => {
    expect(document.querySelector('#clickable-search-udps')).toBeInTheDocument();
    expect(document.querySelector('#clickable-reset-all')).toBeInTheDocument();
    expect(document.querySelector('#clickable-search-udps')).toHaveAttribute('disabled');
  });

  test('enter search string should enable submit button', async () => {
    const searchButton = document.querySelector('#clickable-search-udps');

    expect(searchButton).toHaveAttribute('disabled');

    await userEvent.type(document.querySelector('#input-udp-search'), 'Test udp');

    expect(searchButton).toBeEnabled();
  });
});
