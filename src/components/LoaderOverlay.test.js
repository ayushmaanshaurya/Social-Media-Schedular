import { render } from '@testing-library/react';
import LoaderOverlay from './LoaderOverlay';

describe('LoaderOverlay', () => {
  test('renders loader overlay without crashing', () => {
    const { asFragment } = render(<LoaderOverlay />);
    expect(asFragment()).toMatchSnapshot();
  });
});
