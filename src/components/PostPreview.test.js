import { render, screen } from '@testing-library/react';
import PostPreview from './PostPreview';

describe('PostPreview', () => {
  test('renders default placeholder when content is empty', () => {
    render(<PostPreview />);
    expect(screen.getByText('Post Preview')).toBeInTheDocument();
    expect(screen.getByText('Your post preview will appear here...')).toBeInTheDocument();
  });

  test('renders content, image, and platform header', () => {
    render(
      <PostPreview
        content="Awesome social media post!"
        image="https://example.com/test.jpg"
        platform="Twitter"
      />
    );

    expect(screen.getByText('Twitter Preview')).toBeInTheDocument();
    expect(screen.getByText('Awesome social media post!')).toBeInTheDocument();
    const img = screen.getByAltText('preview');
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute('src', 'https://example.com/test.jpg');
  });

  test('renders caption fallback if content is not provided', () => {
    render(<PostPreview caption="Caption text fallback" platform="Instagram" />);
    expect(screen.getByText('Instagram Preview')).toBeInTheDocument();
    expect(screen.getByText('Caption text fallback')).toBeInTheDocument();
  });

  test('handles onApply callback when clicked', () => {
    const handleApply = jest.fn();
    render(
      <PostPreview
        content="Apply this caption"
        onApply={handleApply}
      />
    );

    const button = screen.getByRole('button', { name: /apply/i });
    expect(button).toBeInTheDocument();
    button.click();
    expect(handleApply).toHaveBeenCalledWith('Apply this caption');
  });
});
