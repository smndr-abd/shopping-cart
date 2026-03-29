import { describe, it, expect, vi } from "vitest";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ProductCard from "../components/ProductCard";
import { renderWithCart, mockProduct } from "./helpers";

describe("ProductCard", () => {
  it("renders product title", () => {
    renderWithCart(<ProductCard product={mockProduct} />);
    expect(screen.getByText(mockProduct.title)).toBeInTheDocument();
  });

  it("renders formatted price", () => {
    renderWithCart(<ProductCard product={mockProduct} />);
    expect(screen.getByText("$49.99")).toBeInTheDocument();
  });

  it("renders category label", () => {
    renderWithCart(<ProductCard product={mockProduct} />);
    expect(screen.getByText(mockProduct.category)).toBeInTheDocument();
  });

  it("renders product image with alt text", () => {
    renderWithCart(<ProductCard product={mockProduct} />);
    const img = screen.getByRole("img", { name: mockProduct.title });
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute("src", mockProduct.image);
  });

  it("renders quantity control starting at 1", () => {
    renderWithCart(<ProductCard product={mockProduct} />);
    expect(screen.getByRole("spinbutton", { name: /quantity/i })).toHaveValue(1);
  });

  it("shows 'Add to Cart' button", () => {
    renderWithCart(<ProductCard product={mockProduct} />);
    expect(
      screen.getByRole("button", { name: /add.*to cart/i })
    ).toBeInTheDocument();
  });

  it("shows '✓ Added' feedback after clicking add", async () => {
    const user = userEvent.setup();
    renderWithCart(<ProductCard product={mockProduct} />);
    await user.click(screen.getByRole("button", { name: /add.*to cart/i }));
    expect(screen.getByRole("button", { name: /added/i })).toBeInTheDocument();
  });

  it("resets quantity to 1 after adding to cart", async () => {
    const user = userEvent.setup();
    renderWithCart(<ProductCard product={mockProduct} />);

    // Increment to 3
    const incBtn = screen.getByRole("button", { name: /increase/i });
    await user.click(incBtn);
    await user.click(incBtn);
    expect(screen.getByRole("spinbutton", { name: /quantity/i })).toHaveValue(3);

    await user.click(screen.getByRole("button", { name: /add.*to cart/i }));
    expect(screen.getByRole("spinbutton", { name: /quantity/i })).toHaveValue(1);
  });

  it("renders star rating", () => {
    renderWithCart(<ProductCard product={mockProduct} />);
    // rating label is rendered as aria-label
    expect(
      screen.getByLabelText(/rating: 4.2 out of 5/i)
    ).toBeInTheDocument();
  });
});
