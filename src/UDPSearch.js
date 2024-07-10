import React, { useState, useRef } from 'react';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';
import { Button, Icon } from '@folio/stripes/components';
import contains from 'dom-helpers/query/contains';

import UDPSearchModal from './UDPSearchModal';

const UDPSearch = ({
  afterClose,
  buttonId = 'clickable-plugin-find-erm-usage-data-provider',
  marginBottom0,
  renderTrigger,
  searchButtonStyle = 'primary noRightRadius',
  searchLabel,
  ...props
}) => {
  const [isOpenModal, setIsOpenModal] = useState(false);

  const modalTrigger = useRef(null);
  const modalRef = useRef(null);

  const openModal = () => {
    setIsOpenModal(true);
  };

  const closeModal = () => {
    setIsOpenModal(false);

    if (afterClose) {
      afterClose();
    }
    if (modalRef.current && modalTrigger.current) {
      if (contains(modalRef.current, document.activeElement)) {
        modalTrigger.current.focus();
      }
    }
  };

  const renderTriggerButton = () => {
    return renderTrigger({
      buttonRef: modalTrigger,
      onClick: openModal,
    });
  };

  return (
    <>
      {renderTrigger ? (
        renderTriggerButton()
      ) : (
        <FormattedMessage id="ui-plugin-find-erm-usage-data-provider.searchButton.title">
          {(ariaLabel) => (
            <Button
              id={buttonId}
              key="searchButton"
              buttonStyle={searchButtonStyle}
              buttonRef={modalTrigger}
              onClick={openModal}
              aria-label={ariaLabel}
              marginBottom0={marginBottom0}
              data-test-plugin-find-udp-button
            >
              {searchLabel || <Icon icon="search" color="#fff" />}
            </Button>
          )}
        </FormattedMessage>
      )}
      <UDPSearchModal
        modalRef={modalRef}
        open={isOpenModal}
        onClose={closeModal}
        {...props}
      />
    </>
  );
};

UDPSearch.propTypes = {
  afterClose: PropTypes.func,
  buttonId: PropTypes.string,
  renderTrigger: PropTypes.func,
  searchLabel: PropTypes.node,
  searchButtonStyle: PropTypes.string,
  marginBottom0: PropTypes.bool,
};

export default UDPSearch;
