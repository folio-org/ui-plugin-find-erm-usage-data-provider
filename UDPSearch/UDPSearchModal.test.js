import user from '@testing-library/user-event';

import '../test/jest/__mock__';
import translationsProperties from '../test/jest/helpers/translationsProperties';
import renderWithIntl from '../test/jest/helpers/renderWithIntl';
import UDPSearchModal from './UDPSearchModal';

jest.mock('./UDPSearchContainer', () => {
  // eslint-disable-next-line react/prop-types
  return ({ onSelectRow }) => (
    <>
      <button
        type="button"
        onClick={() => onSelectRow({}, {})}
      >
        SelectUDP
      </button>
    </>
  );
});

const onCloseModal = jest.fn();
const onSelectUDP = jest.fn();

const renderUDPSearchModal = (
  open = true,
  onClose = onCloseModal,
  selectUDP = onSelectUDP,
) => (
  renderWithIntl(
    <UDPSearchModal
      selectUDP={selectUDP}
      onClose={onClose}
      open={open}
    />,
    translationsProperties
  )
);

describe('UDPSearchModal component', () => {
  it('should display UDP search modal', () => {
    const { getByText } = renderUDPSearchModal();

    expect(getByText('ui-plugin-find-erm-usage-data-provider.modal.label')).toBeDefined();
  });

  it('should not display UDP search modal', () => {
    const { queryByText } = renderUDPSearchModal(false);

    expect(queryByText('ui-plugin-find-erm-usage-data-provider.modal.label')).toBeNull();
  });

  describe('Close UDP search modal', () => {
    it('should close UDP search modal', () => {
      const { getByRole } = renderUDPSearchModal(true, onCloseModal);
      user.click(getByRole('button', { name: 'stripes-components.dismissModal' }));

      expect(onCloseModal).toHaveBeenCalled();
    });
  });
});
