import { screen } from '@folio/jest-config-stripes/testing-library/react';
import user from '@folio/jest-config-stripes/testing-library/user-event';

import renderWithIntl from '../test/jest/helpers/renderWithIntl';
import UDPSearchModal from './UDPSearchModal';

jest.mock('./UDPSearchContainer', () => {
  // eslint-disable-next-line react/prop-types
  return ({ onSelectRow }) => (
    <>
      <button type="button" onClick={() => onSelectRow({}, {})}>
        SelectUDP
      </button>
    </>
  );
});

const stripes = {
  connect: () => {},
};

const onCloseModal = jest.fn();
const onSelectUDP = jest.fn();
const onUDPSelected = jest.fn();

const renderUDPSearchModal = (open = true, onClose = onCloseModal, selectUDP = onSelectUDP) => renderWithIntl(
  <UDPSearchModal
    selectUDP={selectUDP}
    onClose={onClose}
    open={open}
    onUDPSelected={onUDPSelected}
    stripes={stripes}
  />
);

describe('UDPSearchModal component', () => {
  it('should display UDP search modal', () => {
    renderUDPSearchModal();
    expect(
      screen.getByText('ui-plugin-find-erm-usage-data-provider.modal.label')
    ).toBeInTheDocument();
  });

  it('should not display UDP search modal', () => {
    renderUDPSearchModal(false);
    expect(
      screen.queryByText('ui-plugin-find-erm-usage-data-provider.modal.label')
    ).not.toBeInTheDocument();
  });

  describe('Close UDP search modal', () => {
    it('should close UDP search modal', async () => {
      renderUDPSearchModal(true, onCloseModal);
      await user.click(screen.getByRole('button', { name: 'stripes-components.dismissModal' }));

      expect(onCloseModal).toHaveBeenCalled();
    });
  });
});
