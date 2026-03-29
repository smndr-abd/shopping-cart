import { describe, it, expect } from "vitest";
import { render, screen, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { CartProvider, useCart } from "../context/CartContext";
import { mockProduct, mockProduct2 } from "./helpers";

// Helper component that exposes cart actions via rendered text / buttons
function CartConsumer() {
  const { cart, addItem, updateQuantity, removeItem, clearCart, totalItems, totalPrice } =
    useCart();

  return (
    <div>
      <span data-testid="total-items">{totalItems}</span>
      <span data-testid="total-price">{totalPrice.toFixed(2)}</span>
      <span data-testid="cart-length">{cart.length}</span>
      <button onClick={() => addItem(mockProduct, 1)}>add product1</button>
      <button onClick={() => addItem(mockProduct, 3)}>add product1 x3</button>
      <button onClick={() => addItem(mockProduct2, 2)}>add product2 x2</button>
      <button onClick={() => updateQuantity(mockProduct.id, 5)}>set qty 5</button>
      <button onClick={() => updateQuantity(mockProduct.id, 0)}>set qty 0</button>
      <button onClick={() => removeItem(mockProduct.id)}>remove product1</button>
      <button onClick={() => clearCart()}>clear</button>
    </div>
  );
}

function renderConsumer() {
  return render(
    <CartProvider>
      <CartConsumer />
    </CartProvider>
  );
}

describe("CartContext", () => {
  it("starts with an empty cart", () => {
    renderConsumer();
    expect(screen.getByTestId("total-items")).toHaveTextContent("0");
    expect(screen.getByTestId("cart-length")).toHaveTextContent("0");
  });

  it("adds an item and updates totals", async () => {
    const user = userEvent.setup();
    renderConsumer();

    await user.click(screen.getByText("add product1"));

    expect(screen.getByTestId("total-items")).toHaveTextContent("1");
    expect(screen.getByTestId("cart-length")).toHaveTextContent("1");
    expect(screen.getByTestId("total-price")).toHaveTextContent("49.99");
  });

  it("accumulates quantity when the same item is added twice", async () => {
    const user = userEvent.setup();
    renderConsumer();

    await user.click(screen.getByText("add product1"));
    await user.click(screen.getByText("add product1"));

    expect(screen.getByTestId("total-items")).toHaveTextContent("2");
    expect(screen.getByTestId("cart-length")).toHaveTextContent("1"); // still 1 unique line
    expect(screen.getByTestId("total-price")).toHaveTextContent("99.98");
  });

  it("adds items with a custom quantity", async () => {
    const user = userEvent.setup();
    renderConsumer();

    await user.click(screen.getByText("add product1 x3"));

    expect(screen.getByTestId("total-items")).toHaveTextContent("3");
    expect(screen.getByTestId("total-price")).toHaveTextContent("149.97");
  });

  it("handles multiple distinct products", async () => {
    const user = userEvent.setup();
    renderConsumer();

    await user.click(screen.getByText("add product1"));
    await user.click(screen.getByText("add product2 x2"));

    expect(screen.getByTestId("cart-length")).toHaveTextContent("2");
    expect(screen.getByTestId("total-items")).toHaveTextContent("3");
  });

  it("updates quantity of an existing item", async () => {
    const user = userEvent.setup();
    renderConsumer();

    await user.click(screen.getByText("add product1"));
    await user.click(screen.getByText("set qty 5"));

    expect(screen.getByTestId("total-items")).toHaveTextContent("5");
  });

  it("removes item when quantity is set to 0", async () => {
    const user = userEvent.setup();
    renderConsumer();

    await user.click(screen.getByText("add product1"));
    await user.click(screen.getByText("set qty 0"));

    expect(screen.getByTestId("cart-length")).toHaveTextContent("0");
    expect(screen.getByTestId("total-items")).toHaveTextContent("0");
  });

  it("removes a specific item", async () => {
    const user = userEvent.setup();
    renderConsumer();

    await user.click(screen.getByText("add product1"));
    await user.click(screen.getByText("add product2 x2"));
    await user.click(screen.getByText("remove product1"));

    expect(screen.getByTestId("cart-length")).toHaveTextContent("1");
    expect(screen.getByTestId("total-items")).toHaveTextContent("2"); // product2 qty = 2
  });

  it("clears the entire cart", async () => {
    const user = userEvent.setup();
    renderConsumer();

    await user.click(screen.getByText("add product1"));
    await user.click(screen.getByText("add product2 x2"));
    await user.click(screen.getByText("clear"));

    expect(screen.getByTestId("cart-length")).toHaveTextContent("0");
    expect(screen.getByTestId("total-items")).toHaveTextContent("0");
    expect(screen.getByTestId("total-price")).toHaveTextContent("0.00");
  });

  it("throws when useCart is used outside CartProvider", () => {
    // Suppress React's error boundary noise in the test output
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    expect(() => render(<CartConsumer />)).toThrow(
      "useCart must be used within a CartProvider"
    );
    consoleSpy.mockRestore();
  });
});
