import React from 'react';
import noop from 'lodash/noop';
import { Pluggable } from '@folio/stripes/core';

class PluginHarness extends React.Component {
  render() {
    return (
      <Pluggable
        aria-haspopup="true"
        type="find-erm-usage-data-provider"
        id="clickable-find-udp"
        searchLabel="Look up usage data providers"
        marginTop0
        searchButtonStyle="link"
        dataKey="udps"
        onUDPSelected={noop}
        {...this.props}
      >
        <span data-test-no-plugin-available>No plugin available!</span>
      </Pluggable>
    );
  }
}

export default PluginHarness;
