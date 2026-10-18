import { render, screen, fireEvent } from "@testing-library/react";
import PostPreview from "./PostPreview";

describe("PostPreview component", () => {
  test("renders preview text and platform", () => {
    render(<PostPreview content="Hello world post" platform="Twitter" />);
    expect(screen.getByText("Twitter Preview")).toBeInTheDocument();
    expect(screen.getByText("Hello world post")).toBeInTheDocument();
  });

  test("renders image if image prop is provided", () => {
    render(<PostPreview content="Test" image="test-image.png" />);
    const img = screen.getByAltText("preview");
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute("src", "test-image.png");
  });

  test("triggers onApply callback when Apply button is clicked", () => {
    const handleApply = jest.fn();
    render(<PostPreview content="Sample content" onApply={handleApply} />);

    const applyButton = screen.getByText("Apply");
    fireEvent.click(applyButton);
    expect(handleApply).toHaveBeenCalledWith("Sample content");
  });
});
