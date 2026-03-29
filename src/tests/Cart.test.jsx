import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import Cart from "../pages/Cart";
import { CartProvider } from "../context/CartContext";

const item1 = {
  id: 1, title: "Fancy Hat", price: 25.00,
  image: "hat.jpg", category: "accessories", quantity: 2,
};
const item2 = {
  id: 2, title: "Cool Scarf", price: 15.50,
  image: "scarf.jpg", category: "accessories", quantity: 1,
};

function renderCart(initialCart = []) {
  // Seed cart state via a custom reducer initial value is tricky;
  // instead we spy on the context by rendering a wrapper that
  // injects items into CartProvider via addItem.
  function Wrapper({ children }) {
    return (
      <MemoryRouter>
        <CartProvider>{children}</CartProvider>
      </MemoryRouter>
    );
  }
  return render(<Cart />, { wrapper: Wrapper });
}

// A wrapper that pre-populates the cart
function CartPageWithItems({ items }) {
  return (
    <MemoryRouter>
      <CartProvider>
        <CartSeeder items={items} />
        <Cart />
      </CartProvider>
    </MemoryRouter>
  );
}

function CartSeeder({ items }) {
  const { addItem } = require("../context/CartContext").useCart();
  items.forEach((item) => {
    addItem(item, item.quantity);
  });
  return null;
}

describe("Cart page — empty state", () => {
  it("shows empty cart message when cart is empty", () => {
    renderCart();
    expect(screen.getByText(/your cart is empty/i)).toBeInTheDocument();
  });

  it("shows a link to the shop when empty", () => {
    renderCart();
    expect(screen.getByRole("link", { name: /browse the shop/i })).toBeInTheDocument();
  });

  it("does not render the order summary when empty", () => {
    renderCart();
    expect(screen.queryByText(/order summary/i)).not.toBeInTheDocument();
  });
});

describe("Cart page — with items", () => {
  it("renders the Order Summary heading", () => {
    render(
      <MemoryRouter>
        <CartProvider>
          <CartSeeder2 />
          <Cart />
        </CartProvider>
      </MemoryRouter>
    );
    expect(screen.getByText(/order summary/i)).toBeInTheDocument();
  });

  it("renders a Checkout button", () => {
    render(
      <MemoryRouter>
        <CartProvider>
          <CartSeeder2 />
          <Cart />
        </CartProvider>
      </MemoryRouter>
    );
    expect(screen.getByRole("button", { name: /checkout/i })).toBeInTheDocument();
  });

  it("renders a Clear all button", () => {
    render(
      <MemoryRouter>
        <CartProvider>
          <CartSeeder2 />
          <Cart />
        </CartProvider>
      </MemoryRouter>
    );
    expect(screen.getByRole("button", { name: /clear all/i })).toBeInTheDocument();
  });
});

// Inline seeder component so no dynamic require needed
function CartSeeder2() {
  const { addItem } = require("../context/CartContext").useCart();
  const called = { current: false };
  if (!called.current) {
    addItem({ id: 10, title: "Hat", price: 20, image: "", category: "acc" }, 1);
    called.current = true;
  }
  return null;
}
