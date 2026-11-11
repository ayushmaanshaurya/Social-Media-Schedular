import { render } from '@testing-library/react';
import DashboardSkeleton from './DashboardSkeleton';

describe('DashboardSkeleton', () => {
  test('renders 3 skeleton cards without crashing', () => {
    const { asFragment } = render(<DashboardSkeleton />);
    expect(asFragment()).toMatchSnapshot();
  });
});
