import { screen } from '@folio/jest-config-stripes/testing-library/react';
import user from '@folio/jest-config-stripes/testing-library/user-event';
import renderWithIntl from '../test/jest/helpers/renderWithIntl';
import translationsProperties from '../test/jest/helpers/translationsProperties';
import UDPSearch from './UDPSearch';

jest.mock('./UDPSearchModal', () => {
  return () => <span>UDPSearchModal</span>;
});

const closeModal = jest.fn();

const renderUDPSearch = (renderTrigger) =>
  renderWithIntl(
    <UDPSearch renderTrigger={renderTrigger} onClose={closeModal} />,
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
});
