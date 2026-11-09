import { render, screen } from '@testing-library/react';
import Calendar from './Calendar';

describe('Calendar', () => {
  test('renders label and input with provided value', () => {
    const mockSetDate = jest.fn();
    render(<Calendar date="2026-11-15T10:00" setDate={mockSetDate} />);

    expect(screen.getByLabelText(/schedule date & time/i)).toBeInTheDocument();
    const input = screen.getByLabelText(/schedule date & time/i);
    expect(input).toHaveValue('2026-11-15T10:00');
  });
});
