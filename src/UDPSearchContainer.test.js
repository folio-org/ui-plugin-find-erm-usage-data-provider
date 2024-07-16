import { render } from '@folio/jest-config-stripes/testing-library/react';

import { StripesConnectedSource } from '@folio/stripes/smart-components';

import UDPSearchContainer from './UDPSearchContainer';
import UDPsView from './UDPsView';

jest.mock('./UDPsView', () => jest.fn(() => null));

jest.mock('@folio/stripes/smart-components', () => ({
  ...jest.requireActual('@folio/stripes/smart-components'),
  StripesConnectedSource: jest.fn()
}));

const mutator = {
  query: {
    update: jest.fn(),
  }
};

const resources = {
  usageDataProviders: {
    records: []
  },
  aggregatorSettings: {
    records: []
  },
  query: {}
};

const stripes = {
  logger: {
    log: jest.fn()
  }
};

const renderUDPSearchContainer = (props = {}) => render(
  <UDPSearchContainer
    mutator={mutator}
    onSelectRow={jest.fn()}
    resources={resources}
    stripes={stripes}
    {...props}
  />
);

describe('UDPSearchContainer', () => {
  let mockSource;

  beforeEach(() => {
    jest.clearAllMocks();

    mockSource = {
      update: jest.fn(),
      fetchMore: jest.fn()
    };

    StripesConnectedSource.mockImplementation(() => mockSource);
  });

  it('should call the update method of source when resources or mutator changes', () => {
    renderUDPSearchContainer();

    // The source update is called during component render
    expect(mockSource.update).toHaveBeenCalledWith(
      expect.objectContaining({ resources, mutator }),
      'usageDataProviders'
    );
  });

  it('should fetch more data when handleNeedMoreData is called', () => {
    renderUDPSearchContainer();

    const [udpViewProps] = UDPsView.mock.calls[0];
    const RESULT_COUNT_INCREMENT = 100;
    udpViewProps.onNeedMoreData();

    expect(mockSource.fetchMore).toHaveBeenCalledWith(RESULT_COUNT_INCREMENT);
  });

  it('should update the query when querySetter is called', () => {
    renderUDPSearchContainer();

    const [udpViewProps] = UDPsView.mock.calls[0];
    const nsValues = { query: 'test' };
    udpViewProps.querySetter({ nsValues });

    expect(mutator.query.update).toHaveBeenCalledWith(nsValues);
  });

  it('should return the query from resources when queryGetter is called', () => {
    const customResources = {
      ...resources,
      query: { query: 'test' }
    };

    renderUDPSearchContainer({ resources: customResources });

    const [udpViewProps] = UDPsView.mock.calls[0];
    const query = udpViewProps.queryGetter();

    expect(query).toEqual({ query: 'test' });
  });

  it('should pass the correct data to UDPsView', () => {
    const customResources = {
      ...resources,
      usageDataProviders: { records: [{ id: '1' }] },
      aggregatorSettings: { records: [{ id: '2' }] }
    };

    renderUDPSearchContainer({ resources: customResources });

    const [udpViewProps] = UDPsView.mock.calls[0];

    expect(udpViewProps.data).toEqual({
      udps: [{ id: '1' }],
      aggregators: [{ id: '2' }]
    });
  });
});
