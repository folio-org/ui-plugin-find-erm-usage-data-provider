import { screen } from '@folio/jest-config-stripes/testing-library/react';
import user from '@folio/jest-config-stripes/testing-library/user-event';
import renderWithIntl from '../test/jest/helpers/renderWithIntl';
import translationsProperties from '../test/jest/helpers/translationsProperties';
import UDPSearch from './UDPSearch';

jest.mock('./UDPSearchModal', () => jest.fn(({ open, onClose }) => (
  <div>
    {open && (
      <div>
        <p>UDPSearchModal</p>
        <button onClick={onClose} aria-label="Dismiss modal" type="button" />
      </div>
    )}
  </div>
)));

const closeModal = jest.fn();
const isOpen = true;

const renderUDPSearch = (renderTrigger) =>
  renderWithIntl(
    <UDPSearch
      renderTrigger={renderTrigger}
      onClose={closeModal}
      open={isOpen}
    />,
    translationsProperties
  );

describe('UDPSearch component', () => {
  it('should display search UDP button', () => {
    renderUDPSearch();
    expect(
      document.querySelector('#clickable-plugin-find-erm-usage-data-provider')
    ).toBeInTheDocument();
  });

  it('should render trigger button', () => {
    const renderTrigger = jest.fn();
    renderUDPSearch(renderTrigger);

    expect(renderTrigger).toHaveBeenCalled();
  });

  it('should open UDP search modal', async () => {
    renderUDPSearch();
    await user.click(document.querySelector('#clickable-plugin-find-erm-usage-data-provider'));

    expect(screen.getByText('UDPSearchModal')).toBeInTheDocument();
  });

  it('should call close modal', async () => {
    renderUDPSearch();
    const closeButton = screen.getByRole('button', { name: /Dismiss modal/i });
    await user.click(closeButton);

    expect(closeModal).toHaveBeenCalled();
  });
});
