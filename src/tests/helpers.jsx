import { render } from "@testing-library/react";
import { CartProvider } from "../context/CartContext";

/**
 * Renders a component wrapped in CartProvider.
 * Use this for any component that calls useCart().
 */
export function renderWithCart(ui, options = {}) {
  return render(<CartProvider>{ui}</CartProvider>, options);
}

/** A minimal fake product matching FakeStore shape */
export const mockProduct = {
  id: 1,
  title: "Test Jacket",
  price: 49.99,
  image: "https://example.com/jacket.jpg",
  category: "men's clothing",
  rating: { rate: 4.2, count: 120 },
};

/** A second distinct fake product */
export const mockProduct2 = {
  id: 2,
  title: "Test Sneakers",
  price: 89.95,
  image: "https://example.com/sneakers.jpg",
  category: "footwear",
  rating: { rate: 3.8, count: 45 },
};
