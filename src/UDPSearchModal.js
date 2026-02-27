import PropTypes from 'prop-types';
import { useRef } from 'react';
import { FormattedMessage } from 'react-intl';

import { Modal } from '@folio/stripes/components';

import css from './UDPSearch.css';
import UDPSearchContainer from './UDPSearchContainer';

const UDPSearchModal = ({
  modalRef,
  onUDPSelected,
  onClose,
  open,
  ...props
}) => {
  const backupModalRef = useRef(null);
  const internalModalRef = modalRef || backupModalRef;

  const selectUDP = (e, udp) => {
    onUDPSelected(udp);
    onClose();
  };

  return (
    <Modal
      ref={internalModalRef}
      contentClass={css.modalContent}
      dismissible
      enforceFocus={false}
      label={
        <FormattedMessage id="ui-plugin-find-erm-usage-data-provider.modal.label" />
      }
      onClose={onClose}
      open={open}
      size="large"
    >
      <UDPSearchContainer
        {...props}
        onSelectRow={selectUDP}
      />
    </Modal>
  );
};

UDPSearchModal.propTypes = {
  dataKey: PropTypes.string,
  modalRef: PropTypes.shape({ current: PropTypes.instanceOf(Element) }),
  onClose: PropTypes.func.isRequired,
  onUDPSelected: PropTypes.func.isRequired,
  open: PropTypes.bool,
  stripes: PropTypes.shape({
    connect: PropTypes.func.isRequired,
  }).isRequired,
};

export default UDPSearchModal;
