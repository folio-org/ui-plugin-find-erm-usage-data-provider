import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { find, isEmpty } from 'lodash';

import {
  Accordion,
  AccordionSet,
  FilterAccordionHeader
} from '@folio/stripes/components';
import { CheckboxFilter } from '@folio/stripes/smart-components';

import filterGroups from './util/filterGroups';

const FILTERS = ['harvestingStatus', 'harvestVia', 'aggregators'];

const UDPFilters = ({
  activeFilters = {},
  data,
  filterHandlers,
}) => {
  const [filtersState, setFiltersState] = useState({
    harvestingStatus: [],
    harvestVia: [],
    aggregators: []
  });

  useEffect(() => {
    const newState = {};
    const arr = [];

    FILTERS.forEach(filterName => {
      const current = find(filterGroups, { name: filterName });
      let newValues = {};
      if (!isEmpty(current.values)) {
        newValues = current.values.map(key => {
          return {
            value: key.cql,
            label: key.name
          };
        });
      } else {
        const inputVals = data[`${filterName}`] || [];
        newValues = inputVals.map(entry => ({
          label: entry.label,
          value: entry.label
        }));
      }

      arr[filterName] = newValues;

      if (
        filtersState[filterName] &&
        arr[filterName].length !== filtersState[filterName].length
      ) {
        newState[filterName] = arr[filterName];
      }
    });

    if (Object.keys(newState).length) {
      setFiltersState(prevState => ({
        ...prevState,
        ...newState
      }));
    }
  }, [data, filtersState]);

  const renderCheckboxFilter = (key, name, props) => {
    const groupFilters = activeFilters[key] || [];

    return (
      <Accordion
        displayClearButton={groupFilters.length > 0}
        header={FilterAccordionHeader}
        id={`filter-accordion-${key}`}
        label={<FormattedMessage id={`ui-plugin-find-erm-usage-data-provider.information.${key}`} />}
        onClearFilter={() => {
          filterHandlers.clearGroup(key);
        }}
        separator={false}
        {...props}
      >
        <CheckboxFilter
          dataOptions={filtersState[key]}
          name={key}
          onChange={group => {
            filterHandlers.state({
              ...activeFilters,
              [group.name]: group.values
            });
          }}
          selectedValues={groupFilters}
        />
      </Accordion>
    );
  };

  return (
    <AccordionSet>
      {renderCheckboxFilter('harvestingStatus', 'Harvesting status')}
      {renderCheckboxFilter('harvestVia', 'Harvest via')}
      {renderCheckboxFilter('aggregators', 'Aggregators')}
    </AccordionSet>
  );
};

UDPFilters.propTypes = {
  activeFilters: PropTypes.object,
  data: PropTypes.object.isRequired,
  filterHandlers: PropTypes.object
};

export default UDPFilters;
