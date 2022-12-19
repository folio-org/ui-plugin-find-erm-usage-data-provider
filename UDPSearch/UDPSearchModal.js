import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';
import { Modal } from '@folio/stripes/components';

import UDPSearchContainer from './UDPSearchContainer';
import css from './UDPSearch.css';

export default class UDPSearchModal extends Component {
  static propTypes = {
    stripes: PropTypes.shape({
      connect: PropTypes.func.isRequired
    }).isRequired,
    modalRef: PropTypes.shape({ current: PropTypes.instanceOf(Element) }),
    onUDPSelected: PropTypes.func.isRequired,
    onClose: PropTypes.func.isRequired,
    open: PropTypes.bool,
    dataKey: PropTypes.string
  };

  constructor(props) {
    super(props);

    this.modalRef = props.modalRef || React.createRef();
  }

  selectUDP = (e, udp) => {
    this.props.onUDPSelected(udp);
    this.props.onClose();
  };

  render() {
    return (
      <Modal
        contentClass={css.modalContent}
        enforceFocus={false}
        onClose={this.props.onClose}
        size="large"
        open={this.props.open}
        ref={this.modalRef}
        label={
          <FormattedMessage id="ui-plugin-find-erm-usage-data-provider.modal.label" />
        }
        dismissible
      >
        <UDPSearchContainer
          {...this.props}
          onSelectRow={this.selectUDP}

        />
      </Modal>
    );
  }
}
