import { render, screen } from "@testing-library/react";
import App from "../App";

test("shows no favourites message initially", () => {
  render(<App />);
  expect(
    screen.getByText(/no favourite properties added yet/i)
  ).toBeInTheDocument();
});