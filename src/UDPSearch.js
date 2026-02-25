import contains from 'dom-helpers/query/contains';
import PropTypes from 'prop-types';
import {
  useRef,
  useState,
} from 'react';
import { FormattedMessage } from 'react-intl';

import {
  Button,
  Icon,
} from '@folio/stripes/components';

import UDPSearchModal from './UDPSearchModal';

const UDPSearch = ({
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
              key="searchButton"
              aria-label={ariaLabel}
              buttonRef={modalTrigger}
              buttonStyle={searchButtonStyle}
              data-test-plugin-find-udp-button
              id={buttonId}
              marginBottom0={marginBottom0}
              onClick={openModal}
            >
              {searchLabel || <Icon color="#fff" icon="search" />}
            </Button>
          )}
        </FormattedMessage>
      )}
      <UDPSearchModal
        modalRef={modalRef}
        onClose={closeModal}
        open={isOpenModal}
        {...props}
      />
    </>
  );
};

UDPSearch.propTypes = {
  buttonId: PropTypes.string,
  marginBottom0: PropTypes.bool,
  renderTrigger: PropTypes.func,
  searchButtonStyle: PropTypes.string,
  searchLabel: PropTypes.node,
};

export default UDPSearch;
