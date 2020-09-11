import {
  interactor,
  scoped,
  collection,
  clickable,
  focusable,
  fillable,
  blurrable,
  is,
  isPresent,
  text,
} from '@bigtest/interactor';
import css from '../../../UDPSearch/UDPSearch.css';


@interactor
class SearchField {
  static defaultScope = '#input-udp-search';
  isFocused = is(':focus');
  focus = focusable();
  fill = fillable();
  blur = blurrable();
  value = text();
}

@interactor class PluginModalInteractor {
  clickInactiveUDPCheckbox = clickable('#clickable-filter-harvestingStatus-inactive');
  clickHarvestSushiCheckbox = clickable('#clickable-filter-harvestVia-sushi');
  clickHarvestAggregatorCheckbox = clickable('#clickable-filter-harvestVia-aggregator');

  // clickStaffCheckbox = clickable('#clickable-filter-pg-staff');
  // clickUndergradCheckbox = clickable('#clickable-filter-pg-undergrad');

  instances = collection('[role="rowgroup"] [role="row"]', {
    click: clickable('[role=gridcell]'),
    hasCheckbox: isPresent('input[type=checkbox]'),
    check: clickable('input[type=checkbox]'),
  });

  // saveMultipleButton = scoped('[data-test-find-users-modal-save-multiple]', {
  //   click: clickable()
  // });

  resetButton = scoped('#clickable-reset-all', {
    isEnabled: is(':not([disabled])'),
    click: clickable()
  });

  filterCheckboxes = collection('#plugin-find-udp-filter-pane input[type="checkbox"]', {
    isChecked: is(':checked'),
  });

  searchField = scoped('#input-udp-search', SearchField);
  searchFocused = is('#input-udp-search', ':focus');
  searchButton = scoped('[data-test-udp-search-submit]', {
    click: clickable(),
    isEnabled: is(':not([disabled])'),
  });

  noResultsDisplayed = isPresent('#udps-no-results-messages');
}

@interactor class FindUDPInteractor {
  button = scoped('[data-test-plugin-find-udp-button]', {
    click: clickable(),
    isFocused: is(':focus'),
  });

  modal = new PluginModalInteractor(`.${css.modalContent}`);
}

export default FindUDPInteractor;
