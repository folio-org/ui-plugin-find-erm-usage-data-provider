import {
  interactor,
  isPresent
} from '@bigtest/interactor';

// https://bigtestjs.io/guides/interactors/introduction/
export default @interactor class ApplicationInteractor {
  static defaultScope = '#ModuleContainer';
  pluginNotFound = isPresent('[data-test-no-plugin-available]');
}
