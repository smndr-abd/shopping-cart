import { describe, it, expect } from "vitest";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import CartItem from "../components/CartItem";
import { CartProvider } from "../context/CartContext";
import { render } from "@testing-library/react";

const mockItem = {
  id: 1,
  title: "Test Jacket",
  price: 49.99,
  image: "https://example.com/jacket.jpg",
  category: "men's clothing",
  quantity: 2,
};

function renderWithProviderAndItem(item = mockItem) {
  // We need CartProvider with a pre-loaded cart.
  // Easiest way: render CartItem inside CartProvider. CartItem calls
  // updateQuantity / removeItem which live in context — they're no-ops
  // from the reducers perspective unless we also seed the cart, but
  // we're testing the UI rendering & interactions, not the reducer
  // (that's covered in CartContext.test.jsx).
  return render(
    <CartProvider>
      <CartItem item={item} />
    </CartProvider>
  );
}

describe("CartItem", () => {
  it("renders the item title", () => {
    renderWithProviderAndItem();
    expect(screen.getByText(mockItem.title)).toBeInTheDocument();
  });

  it("renders unit price", () => {
    renderWithProviderAndItem();
    expect(screen.getByText(/\$49\.99 each/)).toBeInTheDocument();
  });

  it("renders the subtotal (price × quantity)", () => {
    renderWithProviderAndItem();
    // 49.99 × 2 = 99.98
    expect(screen.getByText("$99.98")).toBeInTheDocument();
  });

  it("renders current quantity in the input", () => {
    renderWithProviderAndItem();
    expect(screen.getByRole("spinbutton", { name: /quantity/i })).toHaveValue(2);
  });

  it("renders the remove button", () => {
    renderWithProviderAndItem();
    expect(
      screen.getByRole("button", { name: /remove test jacket/i })
    ).toBeInTheDocument();
  });

  it("renders the product image", () => {
    renderWithProviderAndItem();
    expect(screen.getByRole("img", { name: mockItem.title })).toBeInTheDocument();
  });

  it("renders the category", () => {
    renderWithProviderAndItem();
    expect(screen.getByText(mockItem.category)).toBeInTheDocument();
  });

  it("increment button is present and not disabled for qty < 99", () => {
    renderWithProviderAndItem();
    expect(screen.getByRole("button", { name: /increase/i })).not.toBeDisabled();
  });

  it("decrement button is present and not disabled for qty > 0", () => {
    renderWithProviderAndItem();
    expect(screen.getByRole("button", { name: /decrease/i })).not.toBeDisabled();
  });
});
