import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';
import { Button, Icon } from '@folio/stripes/components';
import className from 'classnames';

import css from './UDPSearch.css';
import UDPSearchModal from './UDPSearchModal';

class UDPSearch extends Component {
  constructor(props) {
    super(props);

    this.state = {
      openModal: false,
    };

    this.openModal = this.openModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
  }

  getStyle() {
    const { marginBottom0, marginTop0 } = this.props;
    return className(
      css.searchControl,
      { [css.marginBottom0]: marginBottom0 },
      { [css.marginTop0]: marginTop0 },
    );
  }

  openModal() {
    this.setState({
      openModal: true,
    });
  }

  closeModal() {
    this.setState({
      openModal: false,
    });
  }

  render() {
    const {
      marginBottom0,
      marginTop0,
      searchButtonStyle,
      searchLabel,
    } = this.props;
    
    return (
      <div className={this.getStyle()}>
        <FormattedMessage id="ui-plugin-find-erm-usage-data-provider.searchButton.title">
          {ariaLabel => (
            <Button
              id="clickable-plugin-find-erm-usage-data-provider"
              key="searchButton"
              buttonStyle={searchButtonStyle}
              onClick={this.openModal}
              aria-label={ariaLabel}
              tabIndex="-1"
              marginBottom0={marginBottom0}
              marginTop0={marginTop0}
            >
              {searchLabel || <Icon icon="search" color="#fff" />}
            </Button>
          )}
        </FormattedMessage>
        <UDPSearchModal
          open={this.state.openModal}
          onClose={this.closeModal}
          {...this.props}
        />
      </div>
    );
  }
}

UDPSearch.defaultProps = {
  searchButtonStyle: 'primary noRightRadius',
};

UDPSearch.propTypes = {
  searchLabel: PropTypes.node,
  searchButtonStyle: PropTypes.string,
  marginBottom0: PropTypes.bool,
  marginTop0: PropTypes.bool,
};

export default UDPSearch;
