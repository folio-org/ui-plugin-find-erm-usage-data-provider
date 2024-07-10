import React from 'react';
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

class UDPSearchContainer extends React.Component {
  static manifest = Object.freeze({
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

  static propTypes = {
    mutator: PropTypes.object,
    onSelectRow: PropTypes.func.isRequired,
    resources: PropTypes.object,
    stripes: PropTypes.shape({
      logger: PropTypes.object
    })
  };

  constructor(props) {
    super(props);

    this.logger = props.stripes.logger;
    this.searchField = React.createRef();
  }

  componentDidMount() {
    this.source = new StripesConnectedSource(
      this.props,
      this.logger,
      'usageDataProviders'
    );

    if (this.searchField.current) {
      this.searchField.current.focus();
    }
  }

  handleNeedMoreData = () => {
    if (this.source) {
      this.source.fetchMore(RESULT_COUNT_INCREMENT);
    }
  };

  querySetter = ({ nsValues }) => {
    this.props.mutator.query.update(nsValues);
  };

  queryGetter = () => {
    return get(this.props.resources, 'query', {});
  };

  render() {
    const { onSelectRow, resources } = this.props;

    if (this.source) {
      this.source.update(this.props, 'usageDataProviders');
    }

    const udps = get(resources, 'usageDataProviders.records', []);

    return (
      <UDPsView
        data={{
          udps,
          aggregators: get(resources, 'aggregatorSettings.records', [])
        }}
        onNeedMoreData={this.handleNeedMoreData}
        onSelectRow={onSelectRow}
        queryGetter={this.queryGetter}
        querySetter={this.querySetter}
        searchField={this.searchField}
        source={this.source}
      />
    );
  }
}

export default stripesConnect(UDPSearchContainer, { dataKey: 'find_udp' });
