import { render, screen } from "@testing-library/react";
import App from "./App";

/* 1️ App loads without crashing */
test("renders estate agent search heading", () => {
  render(<App />);
  const heading = screen.getByText(/estate agent property search/i);
  expect(heading).toBeInTheDocument();
});

/* 2️ Search form inputs are rendered */
test("renders postcode input", () => {
  render(<App />);
  const postcodeInput = screen.getByPlaceholderText(/postcode/i);
  expect(postcodeInput).toBeInTheDocument();
});

/* 3️ Property cards are displayed */
test("renders property cards", () => {
  render(<App />);
  const cards = screen.getAllByRole("img");
  expect(cards.length).toBeGreaterThan(1);
});

/* 4️ Property type filter exists */
test("renders property type filter", () => {
  render(<App />);
  const typeSelect = screen.getByDisplayValue(/any type/i);
  expect(typeSelect).toBeInTheDocument();
});

/* 5️ App does not crash when rendering */
test("app renders without crashing", () => {
  render(<App />);
});