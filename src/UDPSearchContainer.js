import React, { useEffect, useState, useRef } from 'react';
import PropTypes from 'prop-types';
import { get } from 'lodash';
import { stripesConnect } from '@folio/stripes/core';
import {
  makeQueryFunction,
  StripesConnectedSource
} from '@folio/stripes/smart-components';

import UDPsView from './UDPsView';
import filterGroups from './util/filterGroups';

const INITIAL_RESULT_COUNT = 100;
const RESULT_COUNT_INCREMENT = 100;

const UDPSearchContainer = ({
  mutator,
  onSelectRow,
  resources,
  stripes,
}) => {
  const searchField = useRef(null);

  let [source] = useState();
  if (!source) {
    source = new StripesConnectedSource({ resources, mutator }, stripes.logger, 'usageDataProviders');
  } else {
    source.update({ resources, mutator }, 'usageDataProviders');
  }

  useEffect(() => {
    if (searchField.current) {
      searchField.current.focus();
    }
  }, []);

  const handleNeedMoreData = () => {
    if (source) {
      source.fetchMore(RESULT_COUNT_INCREMENT);
    }
  };

  const querySetter = ({ nsValues }) => {
    mutator.query.update(nsValues);
  };

  const queryGetter = () => {
    return get(resources, 'query', {});
  };

  const udps = get(resources, 'usageDataProviders.records', []);

  return (
    <UDPsView
      data={{
        udps,
        aggregators: get(resources, 'aggregatorSettings.records', [])
      }}
      onNeedMoreData={handleNeedMoreData}
      onSelectRow={onSelectRow}
      queryGetter={queryGetter}
      querySetter={querySetter}
      source={source}
    />
  );
};

UDPSearchContainer.manifest = Object.freeze({
  usageDataProviders: {
    type: 'okapi',
    path: 'usage-data-providers',
    records: 'usageDataProviders',
    recordsRequired: '%{resultCount}',
    perRequest: 100,
    GET: {
      params: {
        query: makeQueryFunction(
          'cql.allRecords=1',
          '(label="%{query.query}*" or vendor="%{query.query}*" or platform="%{query.query}*" or harvestingConfig.aggregator.name="%{query.query}*")',
          {
            label: 'label',
            harvestingStatus: 'harvestingConfig.harvestingStatus',
            latestStats: 'latestReport',
            aggregator: 'harvestingConfig.aggregator.name'
          },
          filterGroups,
          2
        )
      },
      staticFallback: { params: {} }
    }
  },
  aggregatorSettings: {
    type: 'okapi',
    path: 'aggregator-settings',
    records: 'aggregatorSettings',
    shouldRefresh: () => false
  },
  harvesterImpls: {
    type: 'okapi',
    path: 'erm-usage-harvester/impl?aggregator=false',
    throwErrors: false,
    shouldRefresh: () => false
  },
  query: {
    initialValue: {
      sort: 'label'
    }
  },
  resultCount: { initialValue: INITIAL_RESULT_COUNT }
});

UDPSearchContainer.propTypes = {
  mutator: PropTypes.object,
  onSelectRow: PropTypes.func.isRequired,
  resources: PropTypes.object,
  stripes: PropTypes.shape({
    logger: PropTypes.object
  })
};

export default stripesConnect(UDPSearchContainer, { dataKey: 'find_udp' });
