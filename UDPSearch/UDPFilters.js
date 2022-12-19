import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { find } from 'lodash';

import {
  Accordion,
  AccordionSet,
  FilterAccordionHeader
} from '@folio/stripes/components';
import { CheckboxFilter } from '@folio/stripes/smart-components';

import filterGroups from './util/filterGroups';

const FILTERS = ['harvestingStatus', 'harvestVia', 'aggregators'];

export default class UDPFilters extends React.Component {
  static propTypes = Object.freeze({
    activeFilters: PropTypes.object,
    aggregators: PropTypes.arrayOf(PropTypes.object),
    filterHandlers: PropTypes.object
  });

  static defaultProps = {
    activeFilters: {}
  };

  state = {
    harvestingStatus: [],
    harvestVia: [],
    aggregators: []
  };

  static getDerivedStateFromProps(props, state) {
    const newState = {};
    const arr = [];

    FILTERS.forEach(filterName => {
      const current = find(filterGroups, { name: filterName });
      let newValues = {};
      if (current.name === 'aggregators') {
        // get filter values from okapi
        const inputVals = props.aggregators || [];
        newValues = inputVals.map(entry => ({
          label: entry.label,
          value: entry.label
        }));
      } else {
        // get filte values from filterConfig
        newValues = current.values.map(key => {
          return {
            value: key.cql,
            label: key.name
          };
        });
      }

      arr[filterName] = newValues;

      if (
        state[filterName] &&
        arr[filterName].length !== state[filterName].length
      ) {
        newState[filterName] = arr[filterName];
      }
    });

    if (Object.keys(newState).length) return newState;

    return null;
  }

  renderCheckboxFilter = (key, props) => {
    const { activeFilters } = this.props;
    const groupFilters = activeFilters[key] || [];

    return (
      <Accordion
        displayClearButton={groupFilters.length > 0}
        header={FilterAccordionHeader}
        id={`filter-accordion-${key}`}
        label={<FormattedMessage id={`ui-plugin-find-erm-usage-data-provider.information.${key}`} />}
        onClearFilter={() => {
          this.props.filterHandlers.clearGroup(key);
        }}
        separator={false}
        {...props}
      >
        <CheckboxFilter
          dataOptions={this.state[key]}
          name={key}
          onChange={group => {
            this.props.filterHandlers.state({
              ...activeFilters,
              [group.name]: group.values
            });
          }}
          selectedValues={groupFilters}
        />
      </Accordion>
    );
  };

  render() {
    return (
      <AccordionSet>
        {this.renderCheckboxFilter('harvestingStatus')}
        {this.renderCheckboxFilter('harvestVia')}
        {this.renderCheckboxFilter('aggregators')}
      </AccordionSet>
    );
  }
}
