import { useRef } from 'react';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';
import { Modal } from '@folio/stripes/components';

import UDPSearchContainer from './UDPSearchContainer';
import css from './UDPSearch.css';

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
      contentClass={css.modalContent}
      enforceFocus={false}
      onClose={onClose}
      size="large"
      open={open}
      ref={internalModalRef}
      label={
        <FormattedMessage id="ui-plugin-find-erm-usage-data-provider.modal.label" />
      }
      dismissible
    >
      <UDPSearchContainer
        {...props}
        onSelectRow={selectUDP}
      />
    </Modal>
  );
};

UDPSearchModal.propTypes = {
  stripes: PropTypes.shape({
    connect: PropTypes.func.isRequired
  }).isRequired,
  modalRef: PropTypes.shape({ current: PropTypes.instanceOf(Element) }),
  onUDPSelected: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
  open: PropTypes.bool,
  dataKey: PropTypes.string
};

export default UDPSearchModal;
