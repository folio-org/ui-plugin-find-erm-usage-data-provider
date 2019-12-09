import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';
import UsageDataProviders from '@folio/erm-usage/src/Main';
import { Modal } from '@folio/stripes/components';

import css from './UDPSearch.css';

export default class UDPSearchModal extends Component {
  static propTypes = {
    stripes: PropTypes.shape({
      connect: PropTypes.func.isRequired,
    }).isRequired,
    modalRef: PropTypes.shape({ current: PropTypes.instanceOf(Element) }),
    onUDPSelected: PropTypes.func.isRequired,
    onClose: PropTypes.func.isRequired,
    open: PropTypes.bool,
    dataKey: PropTypes.string,
  }

  constructor(props) {
    super(props);

    const dataKey = props.dataKey;
    this.connectedApp = props.stripes.connect(UsageDataProviders, { dataKey });
    this.modalRef = props.modalRef || React.createRef();
  }

  selectUDP = (e, udp) => {
    this.props.onUDPSelected(udp);
    this.props.onClose();
  }

  render() {
    return (
      <Modal
        enforceFocus={false}
        onClose={this.props.onClose}
        size="large"
        open={this.props.open}
        ref={this.modalRef}
        label={<FormattedMessage id="ui-plugin-find-erm-usage-data-provider.modal.label" />}
        dismissible
      >
        <div className={css.udpSearchModal}>
          <this.connectedApp
            {...this.props}
            onSelectRow={this.selectUDP}
            onComponentWillUnmount={this.props.onClose}
            showSingleResult={false}
            browseOnly
          />
        </div>
      </Modal>
    );
  }
}
