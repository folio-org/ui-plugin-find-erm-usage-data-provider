import React from 'react';
import PropTypes from 'prop-types';
import { noop } from 'lodash';
import { FormattedMessage } from 'react-intl';
import {
  MultiColumnList,
  SearchField,
  Pane,
  Icon,
  Button,
  PaneMenu,
  Paneset
} from '@folio/stripes/components';
import { AppIcon } from '@folio/stripes/core';
import {
  SearchAndSortQuery,
  SearchAndSortNoResultsMessage as NoResultsMessage,
  SearchAndSortSearchButton as FilterPaneToggle
} from '@folio/stripes/smart-components';

import UDPFilters from './UDPFilters';
import css from './UDPSearch.css';

export default class UDPsView extends React.Component {
  static defaultProps = {
    data: {},
    visibleColumns: ['label', 'harvestingStatus', 'latestStats', 'aggregator']
  };

  constructor(props) {
    super(props);
    this.state = {
      filterPaneIsVisible: true
    };
  }

  columnMapping = {
    label: <FormattedMessage id="ui-erm-usage.information.providerName" />,
    harvestingStatus: (
      <FormattedMessage id="ui-erm-usage.information.harvestingStatus" />
    ),
    latestStats: (
      <FormattedMessage id="ui-erm-usage.information.latestStatistics" />
    ),
    aggregator: <FormattedMessage id="ui-erm-usage.information.aggregator" />
  };

  columnWidths = {
    label: 300,
    harvestingStatus: 150,
    latestStats: 150,
    aggregator: 200
  };

  formatter = {
    label: udp => udp.label,
    harvestingStatus: udp => udp.harvestingConfig.harvestingStatus,
    latestStats: udp => udp.latestReport,
    aggregator: udp => this.getAggregatorName(udp)
  };

  getAggregatorName = udp => {
    return udp.harvestingConfig.harvestVia === 'aggregator'
      ? udp.harvestingConfig.aggregator.name
      : '-';
  };

  toggleFilterPane = () => {
    this.setState(curState => ({
      filterPaneIsVisible: !curState.filterPaneIsVisible
    }));
  };

  renderIsEmptyMessage = (query, source) => {
    if (!source) {
      return 'no source yet';
    }

    return (
      <div data-test-udps-no-results-message>
        <NoResultsMessage
          source={source}
          searchTerm={query.query || ''}
          filterPaneIsVisible
          toggleFilterPane={noop}
        />
      </div>
    );
  };

  renderResultsFirstMenu = filters => {
    const { filterPaneIsVisible } = this.state;
    const filterCount =
      filters.string !== '' ? filters.string.split(',').length : 0;
    const hideOrShowMessageId = filterPaneIsVisible
      ? 'stripes-smart-components.hideSearchPane'
      : 'stripes-smart-components.showSearchPane';

    return (
      <PaneMenu>
        <FormattedMessage
          id="stripes-smart-components.numberOfFilters"
          values={{ count: filterCount }}
        >
          {appliedFiltersMessage => (
            <FormattedMessage id={hideOrShowMessageId}>
              {hideOrShowMessage => (
                <FilterPaneToggle
                  visible={filterPaneIsVisible}
                  aria-label={`${hideOrShowMessage}...${appliedFiltersMessage}`}
                  onClick={this.toggleFilterPane}
                  badge={
                    !filterPaneIsVisible && filterCount
                      ? filterCount
                      : undefined
                  }
                />
              )}
            </FormattedMessage>
          )}
        </FormattedMessage>
      </PaneMenu>
    );
  };

  renderResultsPaneSubtitle = source => {
    if (source && source.loaded()) {
      const count = source.totalCount();
      return (
        <FormattedMessage
          id="stripes-smart-components.searchResultsCountHeader"
          values={{ count }}
        />
      );
    }

    return <FormattedMessage id="stripes-smart-components.searchCriteria" />;
  };

  render() {
    const {
      children,
      contentRef,
      data,
      onNeedMoreData,
      onSelectRow,
      queryGetter,
      querySetter,
      source,
      visibleColumns
    } = this.props;

    const query = queryGetter() || {};
    const count = source ? source.totalCount() : 0;
    const sortOrder = query.sort || '';

    return (
      <div data-test-udp-instances ref={contentRef}>
        <SearchAndSortQuery
          initialFilterState={{
            harvestingStatus: ['active']
          }}
          initialSearchState={{ query: '' }}
          initialSortState={{ sort: 'label' }}
          queryGetter={queryGetter}
          querySetter={querySetter}
          syncToLocationSearch={false}
        >
          {({
            searchValue,
            getSearchHandlers,
            onSubmitSearch,
            onSort,
            getFilterHandlers,
            activeFilters,
            filterChanged,
            searchChanged,
            resetAll
          }) => {
            const disableReset = () => !filterChanged && !searchChanged;

            return (
              <Paneset id="udps-paneset">
                {this.state.filterPaneIsVisible && (
                  <Pane
                    defaultWidth="20%"
                    onClose={this.toggleFilterPane}
                    paneTitle={
                      <FormattedMessage id="stripes-smart-components.searchAndFilter" />
                    }
                  >
                    <form onSubmit={onSubmitSearch}>
                      <div className={css.searchGroupWrap}>
                        <FormattedMessage id="ui-erm-usage.udp.searchInputLabel">
                          {ariaLabel => (
                            <SearchField
                              aria-label={ariaLabel}
                              autoFocus
                              className={css.searchField}
                              data-test-udp-search-input
                              id="input-udp-search"
                              inputRef={this.searchField}
                              name="query"
                              onChange={getSearchHandlers().query}
                              onClear={getSearchHandlers().reset}
                              value={searchValue.query}
                            />
                          )}
                        </FormattedMessage>
                        <Button
                          buttonStyle="primary"
                          disabled={
                            !searchValue.query || searchValue.query === ''
                          }
                          fullWidth
                          id="clickable-search-agreements"
                          type="submit"
                        >
                          <FormattedMessage id="stripes-smart-components.search" />
                        </Button>
                      </div>
                      <div className={css.resetButtonWrap}>
                        <Button
                          buttonStyle="none"
                          id="clickable-reset-all"
                          disabled={disableReset()}
                          onClick={resetAll}
                        >
                          <Icon icon="times-circle-solid">
                            <FormattedMessage id="stripes-smart-components.resetAll" />
                          </Icon>
                        </Button>
                      </div>
                    </form>
                    <UDPFilters
                      activeFilters={activeFilters.state}
                      data={data}
                      filterHandlers={getFilterHandlers()}
                    />
                  </Pane>
                )}
                <Pane
                  appIcon={<AppIcon app="erm-usage" />}
                  defaultWidth="fill"
                  firstMenu={this.renderResultsFirstMenu(activeFilters)}
                  padContent={false}
                  paneTitle="Usage Data Providers"
                  paneSub={this.renderResultsPaneSubtitle(source)}
                >
                  <MultiColumnList
                    autosize
                    columnMapping={this.columnMapping}
                    columnWidths={this.columnWidths}
                    contentData={data.udps}
                    formatter={this.formatter}
                    id="list-udps"
                    isEmptyMessage={this.renderIsEmptyMessage(query, source)}
                    onHeaderClick={onSort}
                    onNeedMoreData={onNeedMoreData}
                    onRowClick={onSelectRow}
                    sortDirection={
                      sortOrder.startsWith('-') ? 'descending' : 'ascending'
                    }
                    sortOrder={sortOrder.replace(/^-/, '').replace(/,.*/, '')}
                    totalCount={count}
                    virtualize
                    visibleColumns={visibleColumns}
                  />
                </Pane>
                {children}
              </Paneset>
            );
          }}
        </SearchAndSortQuery>
      </div>
    );
  }
}

UDPsView.propTypes = Object.freeze({
  children: PropTypes.object,
  contentRef: PropTypes.object,
  data: PropTypes.shape(),
  onNeedMoreData: PropTypes.func,
  onSelectRow: PropTypes.func,
  queryGetter: PropTypes.func.isRequired,
  querySetter: PropTypes.func.isRequired,
  source: PropTypes.shape({
    loaded: PropTypes.func,
    totalCount: PropTypes.func
  }),
  visibleColumns: PropTypes.arrayOf(PropTypes.string)
});
