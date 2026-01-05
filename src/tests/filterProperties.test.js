import { render, screen } from "@testing-library/react";
import App from "../App";

test("renders min price input", () => {
  render(<App />);
  const minPriceInput = screen.getByPlaceholderText(/min price/i);
  expect(minPriceInput).toBeInTheDocument();
});