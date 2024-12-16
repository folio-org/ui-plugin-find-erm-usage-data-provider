import PropTypes from 'prop-types';
import { useState } from 'react';
import { FormattedMessage } from 'react-intl';

import {
  MultiColumnList,
  SearchField,
  Pane,
  Icon,
  Button,
  NoValue,
  PaneMenu,
  Paneset,
} from '@folio/stripes/components';
import { AppIcon } from '@folio/stripes/core';
import {
  CollapseFilterPaneButton,
  ExpandFilterPaneButton,
  SearchAndSortQuery,
  SearchAndSortNoResultsMessage as NoResultsMessage,
} from '@folio/stripes/smart-components';

import UDPFilters from './UDPFilters';
import css from './UDPSearch.css';

const UDPsView = ({
  children,
  data = {},
  onNeedMoreData,
  onSelectRow,
  queryGetter,
  querySetter,
  searchField,
  source,
  visibleColumns = ['label', 'harvestingStatus', 'latestStats', 'aggregator'],
}) => {
  const [filterPaneIsVisible, setFilterPaneIsVisible] = useState(true);
  const query = queryGetter() || {};
  const count = source ? source.totalCount() : 0;
  const sortOrder = query.sort || '';

  const columnMapping = {
    label: <FormattedMessage id="ui-plugin-find-erm-usage-data-provider.information.providerName" />,
    harvestingStatus: (
      <FormattedMessage id="ui-plugin-find-erm-usage-data-provider.information.harvestingStatus" />
    ),
    latestStats: (
      <FormattedMessage id="ui-plugin-find-erm-usage-data-provider.information.latestStatistics" />
    ),
    aggregator: <FormattedMessage id="ui-plugin-find-erm-usage-data-provider.information.aggregator" />,
  };

  const columnWidths = {
    label: 300,
    harvestingStatus: 150,
    latestStats: 150,
    aggregator: 200,
  };

  const getAggregatorName = (udp) => {
    return udp.harvestingConfig.harvestVia === 'aggregator' ? udp.harvestingConfig.aggregator.name : <NoValue />;
  };

  const formatter = {
    label: (udp) => udp.label,
    harvestingStatus: (udp) => udp.harvestingConfig.harvestingStatus,
    latestStats: (udp) => udp.latestReport,
    aggregator: (udp) => getAggregatorName(udp),
  };

  const toggleFilterPane = () => {
    setFilterPaneIsVisible(!filterPaneIsVisible);
  };

  const renderIsEmptyMessage = () => {
    if (!source) {
      return (<div>no source yet</div>);
    }

    return (
      <div id="udps-no-results-message">
        <NoResultsMessage
          source={source}
          searchTerm={query.query || ''}
          filterPaneIsVisible
          toggleFilterPane={toggleFilterPane}
        />
      </div>
    );
  };

  const renderResultsFirstMenu = (filters) => {
    if (filterPaneIsVisible) {
      return null;
    }

    const filterCount = filters.string !== '' ? filters.string.split(',').length : 0;

    return (
      <PaneMenu>
        <ExpandFilterPaneButton
          filterCount={filterCount}
          onClick={toggleFilterPane}
        />
      </PaneMenu>
    );
  };

  const renderResultsPaneSubtitle = () => {
    if (source?.loaded()) {
      return (
        <FormattedMessage
          id="stripes-smart-components.searchResultsCountHeader"
          values={{ count }}
        />
      );
    }

    return <FormattedMessage id="stripes-smart-components.searchCriteria" />;
  };

  return (
    <div>
      <SearchAndSortQuery
        initialFilterState={{}}
        initialSearchState={{ query: '' }}
        initialSortState={{ sort: 'label' }}
        queryGetter={queryGetter}
        querySetter={querySetter}
        setQueryOnMount
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
          resetAll,
        }) => {
          const disableReset = () => !filterChanged && !searchChanged;

          return (
            <Paneset id="udps-paneset">
              {filterPaneIsVisible &&
                <Pane
                  defaultWidth="20%"
                  id="plugin-find-udp-filter-pane"
                  lastMenu={
                    <PaneMenu>
                      <CollapseFilterPaneButton
                        onClick={toggleFilterPane}
                      />
                    </PaneMenu>
                  }
                  paneTitle={
                    <FormattedMessage id="stripes-smart-components.searchAndFilter" />
                  }
                >
                  <form onSubmit={onSubmitSearch}>
                    <div className={css.searchGroupWrap}>
                      <FormattedMessage id="ui-plugin-find-erm-usage-data-provider.udp.searchInputLabel">
                        {(ariaLabel) => (
                          <SearchField
                            aria-label={ariaLabel}
                            autoFocus
                            className={css.searchField}
                            id="input-udp-search"
                            inputRef={searchField}
                            name="query"
                            onChange={(e) => {
                              if (e.target.value) {
                                getSearchHandlers().query(e);
                              } else {
                                getSearchHandlers().reset();
                              }
                            }}
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
                        id="clickable-search-udps"
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
              }
              <Pane
                appIcon={<AppIcon app="erm-usage" />}
                defaultWidth="fill"
                firstMenu={renderResultsFirstMenu(activeFilters)}
                padContent={false}
                paneTitle="Usage Data Providers"
                paneSub={renderResultsPaneSubtitle()}
              >
                <MultiColumnList
                  autosize
                  columnMapping={columnMapping}
                  columnWidths={columnWidths}
                  contentData={data.udps}
                  formatter={formatter}
                  id="list-udps"
                  isEmptyMessage={renderIsEmptyMessage()}
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
};

UDPsView.propTypes = {
  children: PropTypes.object,
  data: PropTypes.object,
  onNeedMoreData: PropTypes.func,
  onSelectRow: PropTypes.func,
  queryGetter: PropTypes.func.isRequired,
  querySetter: PropTypes.func.isRequired,
  searchField: PropTypes.object,
  source: PropTypes.shape({
    loaded: PropTypes.func,
    totalCount: PropTypes.func,
  }),
  visibleColumns: PropTypes.arrayOf(PropTypes.string),
};

export default UDPsView;
