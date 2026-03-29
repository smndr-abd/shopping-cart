import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import Navbar from "../components/Navbar";
import { CartProvider, useCart } from "../context/CartContext";

// Helper: render Navbar with router + cart context
function renderNavbar() {
  return render(
    <MemoryRouter>
      <CartProvider>
        <Navbar />
      </CartProvider>
    </MemoryRouter>
  );
}

// Component that seeds the cart then renders Navbar
function NavbarWithItems({ count }) {
  return (
    <MemoryRouter>
      <CartProvider>
        <CartSeeder count={count} />
        <Navbar />
      </CartProvider>
    </MemoryRouter>
  );
}

function CartSeeder({ count }) {
  const { addItem } = useCart();
  // Call addItem immediately during render (fine in tests)
  // Using a ref to call only once
  const called = { current: false };
  if (!called.current) {
    for (let i = 0; i < count; i++) {
      addItem({ id: i + 1, title: `Item ${i}`, price: 10, image: "", category: "test" }, 1);
    }
    called.current = true;
  }
  return null;
}

describe("Navbar", () => {
  it("renders the brand name", () => {
    renderNavbar();
    expect(screen.getByText("VAULT")).toBeInTheDocument();
  });

  it("renders Home, Shop, and Cart navigation links", () => {
    renderNavbar();
    expect(screen.getByText("Home")).toBeInTheDocument();
    expect(screen.getByText("Shop")).toBeInTheDocument();
    // Cart is rendered as an icon with aria-label
    expect(screen.getByRole("link", { name: /cart/i })).toBeInTheDocument();
  });

  it("does NOT show a badge when cart is empty", () => {
    renderNavbar();
    expect(screen.queryByText(/^\d+$/)).not.toBeInTheDocument();
  });

  it("shows a badge with the correct count when items are in the cart", () => {
    render(<NavbarWithItems count={3} />);
    expect(screen.getByText("3")).toBeInTheDocument();
  });

  it("updates badge when more items are added", () => {
    render(<NavbarWithItems count={7} />);
    expect(screen.getByText("7")).toBeInTheDocument();
  });

  it("cart link has an accessible aria-label with item count", () => {
    render(<NavbarWithItems count={2} />);
    expect(
      screen.getByRole("link", { name: /cart, 2 items/i })
    ).toBeInTheDocument();
  });
});
