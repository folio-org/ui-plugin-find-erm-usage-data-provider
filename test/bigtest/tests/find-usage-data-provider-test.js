import React from 'react';
import { describe, beforeEach, it } from '@bigtest/mocha';
import { expect } from 'chai';

import setupApplication, { mount } from '../helpers/setup-application';
import PluginHarness from '../helpers/PluginHarness';
import FindUDPInteractor from '../interactors/find-usage-data-provider';

let closeHandled = false;
let udpChosen = false;

describe('UI-plugin-find-usage-data-provider', function () {
  const findUDP = new FindUDPInteractor();
  setupApplication();

  beforeEach(async function () {
    await this.server.createList('usage-data-provider', 40);
  });

  describe('rendering', function () {
    beforeEach(async function () {
      udpChosen = false;
      closeHandled = false;
      await mount(
        <PluginHarness
          onUDPSelected={() => {
            udpChosen = true;
          }}
          afterClose={() => {
            closeHandled = true;
          }}
        />
      );
    });

    it('renders button', function () {
      expect(findUDP.button.isPresent).to.be.true;
    });

    describe('click the button', function () {
      beforeEach(async function () {
        await findUDP.button.click();
      });

      it('opens a modal', function () {
        expect(findUDP.modal.isPresent).to.be.true;
      });

      it('focuses the search field', function () {
        expect(findUDP.modal.searchField.isFocused).to.be.true;
      }).timeout(5000);

    //   describe('checking show inactive filter', function () {
    //     beforeEach(async function () {
    //       await findUDP.modal.clickInactiveUDPCheckbox();
    //       await findUDP.modal.searchField.fill('t');
    //     });

    //     it('pulls a result set', function () {
    //       expect(findUDP.modal.instances().length).to.be.greaterThan(0);
    //     });

    //     describe('resetting the filter and search', function () {
    //       beforeEach(async function () {
    //         await findUDP.modal.clickInactiveUDPCheckbox();
    //         await findUDP.modal.resetButton.click();
    //       });

    //       it('displays "No Results" message', function () {
    //         expect(findUDP.modal.noResultsDisplayed).to.be.true;
    //       });

    //       it('unchecks the filter checkboxes', function () {
    //         expect(
    //           findUDP.modal.filterCheckboxes().filter((cb) => cb.isChecked)
    //             .length
    //         ).to.equal(0);
    //       });

    //       it('clears the value in the search field', function () {
    //         expect(findUDP.modal.searchField.value).to.equal('');
    //       });
    //     });
    //   });

    //   describe('filling in the searchField', function () {
    //     beforeEach(async function () {
    //       await findUDP.modal.searchField.fill('t');
    //     });

    //     it('activates the reset button', function () {
    //       expect(findUDP.modal.resetButton.isEnabled).to.be.true;
    //     });

    //     it('activates the search button', function () {
    //       expect(findUDP.modal.searchButton.isEnabled).to.be.true;
    //     });

    //     describe('submitting the search', function () {
    //       beforeEach(async function () {
    //         await findUDP.modal.searchButton.click();
    //       });

    //       it('returns a set of results', function () {
    //         expect(findUDP.modal.instances().length).to.be.greaterThan(0);
    //       });

    //       describe('selecting a udp', function () {
    //         beforeEach(async function () {
    //           await findUDP.modal.instances(1).click();
    //         });

    //         it('hides the modal', function () {
    //           expect(closeHandled).to.be.true;
    //         });

    //         it('calls the selectUDP callback', function () {
    //           expect(udpChosen).to.be.true;
    //         });

    //         it('focuses the modal trigger button', function () {
    //           expect(findUDP.button.isFocused).to.be.true;
    //         });
    //       });
    //     });
    //   });
    });
  });
});
