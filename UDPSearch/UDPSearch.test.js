import user from '@testing-library/user-event';

import translationsProperties from '../test/jest/helpers/translationsProperties';
import renderWithIntl from '../test/jest/helpers/renderWithIntl';
import UDPSearch from './UDPSearch';

jest.mock('./UDPSearchModal', () => {
  return () => <span>UDPSearchModal</span>;
});

const renderUDPSearch = (
  renderTrigger,
) => (
  renderWithIntl(
    <UDPSearch
      renderTrigger={renderTrigger}
    />,
    translationsProperties
  )
);

describe('UDPSearch component', () => {
  it('should display search UDP button', () => {
    renderUDPSearch();
    expect(document.querySelector('#clickable-plugin-find-erm-usage-data-provider')).toBeInTheDocument();
  });

  it('should render trigger button', () => {
    const renderTrigger = jest.fn();
    renderUDPSearch(renderTrigger);

    expect(renderTrigger).toHaveBeenCalled();
  });

  it('should open UDP search modal', () => {
    const { getByText } = renderUDPSearch();
    user.click(document.querySelector('#clickable-plugin-find-erm-usage-data-provider'));

    expect(getByText('UDPSearchModal')).toBeDefined();
  });
});
