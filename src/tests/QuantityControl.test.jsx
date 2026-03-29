import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import QuantityControl from "../components/QuantityControl";

function setup(props) {
  const onChange = props.onChange ?? vi.fn();
  render(<QuantityControl quantity={props.quantity ?? 1} onChange={onChange} {...props} />);
  return {
    decBtn: screen.getByRole("button", { name: /decrease/i }),
    incBtn: screen.getByRole("button", { name: /increase/i }),
    input:  screen.getByRole("spinbutton", { name: /quantity/i }),
    onChange,
  };
}

describe("QuantityControl", () => {
  it("renders the current quantity in the input", () => {
    const { input } = setup({ quantity: 3 });
    expect(input).toHaveValue(3);
  });

  it("calls onChange with quantity + 1 when increment is clicked", async () => {
    const user = userEvent.setup();
    const { incBtn, onChange } = setup({ quantity: 2 });
    await user.click(incBtn);
    expect(onChange).toHaveBeenCalledWith(3);
  });

  it("calls onChange with quantity − 1 when decrement is clicked", async () => {
    const user = userEvent.setup();
    const { decBtn, onChange } = setup({ quantity: 3 });
    await user.click(decBtn);
    expect(onChange).toHaveBeenCalledWith(2);
  });

  it("disables decrement button when quantity equals min", () => {
    const { decBtn } = setup({ quantity: 1, min: 1 });
    expect(decBtn).toBeDisabled();
  });

  it("disables increment button when quantity equals max", () => {
    const { incBtn } = setup({ quantity: 10, max: 10 });
    expect(incBtn).toBeDisabled();
  });

  it("calls onChange when a valid number is typed in the input", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<QuantityControl quantity={1} onChange={onChange} />);
    const input = screen.getByRole("spinbutton", { name: /quantity/i });
    await user.clear(input);
    await user.type(input, "7");
    expect(onChange).toHaveBeenCalledWith(7);
  });

  it("clamps typed value to min on blur when field is empty", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<QuantityControl quantity={3} onChange={onChange} min={1} />);
    const input = screen.getByRole("spinbutton", { name: /quantity/i });
    await user.clear(input);
    await user.tab(); // trigger blur
    expect(onChange).toHaveBeenCalledWith(1);
  });

  it("clamps typed value above max to max", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<QuantityControl quantity={5} onChange={onChange} max={10} />);
    const input = screen.getByRole("spinbutton", { name: /quantity/i });
    await user.clear(input);
    await user.type(input, "99");
    // The last call should have been clamped to max=10
    const calls = onChange.mock.calls.map(([v]) => v);
    expect(Math.max(...calls)).toBe(10);
  });
});
