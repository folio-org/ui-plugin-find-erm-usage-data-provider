import userEvent from '@folio/jest-config-stripes/testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';

import { ModuleHierarchyProvider, StripesContext, useStripes } from '@folio/stripes/core';

import udps from '../test/fixtures/udps';
import renderWithIntl from '../test/jest/helpers/renderWithIntl';
import UDPsView from './UDPsView';

jest.mock('react-virtualized-auto-sizer', () => ({ children }) => children({ width: 1920, height: 1080 }));

const onSearchComplete = jest.fn();
const isEmptyMessage = jest.fn();
const history = {};

let renderWithIntlResult = {};
const sourcePending = { source: { pending: jest.fn(() => true), totalCount: jest.fn(() => 0), loaded: jest.fn(() => false) } };
const sourceLoaded = { source: { pending: jest.fn(() => false), totalCount: jest.fn(() => 1), loaded: jest.fn(() => true) } };

const renderUDPsView = (
  stripes,
  props,
  udpsData,
  rerender
) =>
  renderWithIntl(
    <MemoryRouter>
      <StripesContext.Provider value={stripes}>
        <ModuleHierarchyProvider module="@folio/plugin-find-erm-usage-data-provider">
          <UDPsView
            data={{
              udps: udpsData,
            }}
            selectedRecordId=""
            onNeedMoreData={jest.fn()}
            isEmptyMessage={isEmptyMessage}
            queryGetter={jest.fn()}
            querySetter={jest.fn()}
            searchString=""
            visibleColumns={['label', 'harvestingStatus', 'latestStats', 'aggregator']}
            history={history}
            onSearchComplete={onSearchComplete}
            location={{ pathname: '', search: '' }}
            {...props}
          />
        </ModuleHierarchyProvider>
      </StripesContext.Provider>
    </MemoryRouter>,
    rerender
  );

describe('UDPsView', () => {
  let stripes;

  afterEach(() => {
    jest.clearAllMocks();
  });

  beforeEach(() => {
    jest.clearAllMocks();
    stripes = useStripes();
  });

  describe('check if elements are available', () => {
    beforeEach(() => {
      renderUDPsView(stripes, sourcePending, udps);
    });

    it('should be visible filter pane and searchField ', () => {
      expect(document.querySelector('#plugin-find-udp-filter-pane')).toBeInTheDocument();
      expect(document.querySelector('#input-udp-search')).toBeInTheDocument();
    });

    it('should be search field active element', () => {
      expect(document.querySelector('#input-udp-search')).toHaveFocus();
    });

    it('shoulb be visible buttons for submit and reset', () => {
      expect(document.querySelector('#clickable-search-udps')).toBeInTheDocument();
      expect(document.querySelector('#clickable-reset-all')).toBeInTheDocument();
      expect(document.querySelector('#clickable-search-udps')).toHaveAttribute('disabled');
    });

    test('if collapse filter pane is working', async () => {
      expect(document.querySelector('#paneHeaderplugin-find-udp-filter-pane-pane-title')).toBeInTheDocument();
      expect(document.querySelector('[data-test-collapse-filter-pane-button]')).toBeInTheDocument();
      await userEvent.click(document.querySelector('#clickable-filter-harvestingStatus-active'));
      await userEvent.click(document.querySelector('#clickable-filter-harvestVia-sushi'));

      await userEvent.click(document.querySelector('[data-test-collapse-filter-pane-button]'));

      expect(document.querySelector('#paneHeaderplugin-find-udp-filter-pane-pane-title')).not.toBeInTheDocument();
      expect(document.querySelector('[data-test-expand-filter-pane-button]')).toBeInTheDocument();

      await userEvent.hover(document.querySelector('[data-test-expand-filter-pane-button]'));

      const filterCountDisplay = document.querySelector('#expand-filter-pane-button-tooltip-sub');
      expect(filterCountDisplay).toBeInTheDocument();

      const expandFilterButton = document.querySelector('[data-test-expand-filter-pane-button]');

      const badge = expandFilterButton.querySelector('.badge .label');
      expect(badge).toHaveTextContent('2');

      await userEvent.click(expandFilterButton);

      expect(document.querySelector('#paneHeaderplugin-find-udp-filter-pane-pane-title')).toBeInTheDocument();
    });
  });

  describe('click "active" filter and load new results', () => {
    it('should show a certain amount of results and all columns', async () => {
      renderUDPsView(stripes, {}, udps);
      expect(document.querySelector('#clickable-filter-harvestingStatus-active')).toBeInTheDocument();

      await userEvent.click(document.querySelector('#clickable-filter-harvestingStatus-active'));

      expect(document.querySelectorAll('#list-udps .mclRowContainer > [role=row]').length).toEqual(2);

      expect(document.querySelector('#list-column-label')).toBeInTheDocument();
      expect(document.querySelector('#list-column-harvestingstatus')).toBeInTheDocument();
      expect(document.querySelector('#list-column-lateststats')).toBeInTheDocument();
      expect(document.querySelector('#list-column-aggregator')).toBeInTheDocument();
    });
  });

  describe('enter search string and load new results', () => {
    it('should enable search button and show a certain amount of results', async () => {
      renderWithIntlResult = renderUDPsView(stripes, sourcePending, udps);

      expect(document.querySelector('#plugin-find-udp-filter-pane')).toBeInTheDocument();

      const searchFieldInput = document.querySelector('#input-udp-search');
      const searchButton = document.querySelector('#clickable-search-udps');
      expect(searchButton).toBeDisabled();
      await userEvent.type(searchFieldInput, 'Test');

      expect(searchButton).toBeInTheDocument();
      expect(searchButton).toBeEnabled();
      await userEvent.click(searchButton);

      renderUDPsView(
        stripes,
        sourceLoaded,
        udps,
        renderWithIntlResult.rerender
      );

      expect(document.querySelectorAll('#list-udps .mclRowContainer > [role=row]').length).toEqual(1);
    });
  });
});

describe('UDPsView - without results', () => {
  let stripes;
  beforeEach(() => {
    stripes = useStripes();

    renderUDPsView(stripes, {}, []);
  });

  it('should show no results', async () => {
    const searchFieldInput = document.querySelector('#input-udp-search');
    expect(searchFieldInput).toBeInTheDocument();
    await userEvent.type(searchFieldInput, 'American');

    expect(document.querySelector('#clickable-search-udps')).toBeEnabled();
    const searchButton = document.querySelector('#clickable-search-udps');
    expect(searchButton).toBeInTheDocument();
    await userEvent.click(searchButton);

    expect(document.querySelectorAll('#list-udps .mclRowContainer > [role=row]').length).toEqual(0);
    // expect(document.querySelector('#udps-no-results-message')).toBeInTheDocument();
    // expect(document.querySelector('[noResultsMessageLabel]')).toBeInTheDocument();
    // expect(isEmptyMessage).toHaveBeenCalled();
  });
});
