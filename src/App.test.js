import { render, screen } from "@testing-library/react";
import App from "./App";

/* 1️⃣ App loads without crashing */
test("renders estate agent property search heading", () => {
  render(<App />);
  const heading = screen.getByText(/estate agent property search/i);
  expect(heading).toBeInTheDocument();
});

/* 2️⃣ Search form inputs are rendered */
test("renders postcode input", () => {
  render(<App />);
  const postcodeInput = screen.getByPlaceholderText(/postcode/i);
  expect(postcodeInput).toBeInTheDocument();
});

/* 3️⃣ Property images are displayed */
test("renders property images", () => {
  render(<App />);
  const images = screen.getAllByRole("img");
  expect(images.length).toBeGreaterThan(0);
});

/* 4️⃣ Property type filter exists (react-select) */
test("renders property type filter", () => {
  render(<App />);
  const typeSelect = screen.getByText(/property type/i);
  expect(typeSelect).toBeInTheDocument();
});

/* 5️⃣ App renders without crashing */
test("app renders without crashing", () => {
  render(<App />);
});