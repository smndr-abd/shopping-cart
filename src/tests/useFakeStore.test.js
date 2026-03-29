import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { useFakeStore, useCategories } from "../hooks/useFakeStore";

const mockProducts = [
  { id: 1, title: "Product A", price: 10, image: "", category: "electronics", rating: { rate: 4, count: 10 } },
  { id: 2, title: "Product B", price: 20, image: "", category: "electronics", rating: { rate: 3, count: 5 } },
];

const mockCategories = ["electronics", "jewelery", "men's clothing", "women's clothing"];

beforeEach(() => {
  vi.spyOn(global, "fetch");
});

afterEach(() => {
  vi.restoreAllMocks();
});

function mockFetchSuccess(data) {
  global.fetch.mockResolvedValueOnce({
    ok: true,
    json: async () => data,
  });
}

function mockFetchError() {
  global.fetch.mockResolvedValueOnce({ ok: false, status: 500 });
}

describe("useFakeStore", () => {
  it("starts in loading state", () => {
    mockFetchSuccess(mockProducts);
    const { result } = renderHook(() => useFakeStore());
    expect(result.current.loading).toBe(true);
    expect(result.current.products).toEqual([]);
  });

  it("fetches all products when no category is given", async () => {
    mockFetchSuccess(mockProducts);
    const { result } = renderHook(() => useFakeStore());

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.products).toEqual(mockProducts);
    expect(result.current.error).toBeNull();
    expect(global.fetch).toHaveBeenCalledWith(
      "https://fakestoreapi.com/products"
    );
  });

  it("fetches by category when one is provided", async () => {
    mockFetchSuccess(mockProducts);
    const { result } = renderHook(() => useFakeStore("electronics"));

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(global.fetch).toHaveBeenCalledWith(
      "https://fakestoreapi.com/products/category/electronics"
    );
  });

  it("sets error state on failed fetch", async () => {
    mockFetchError();
    const { result } = renderHook(() => useFakeStore());

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.error).toMatch(/http 500/i);
    expect(result.current.products).toEqual([]);
  });

  it("sets error state on network failure", async () => {
    global.fetch.mockRejectedValueOnce(new Error("Network error"));
    const { result } = renderHook(() => useFakeStore());

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.error).toBe("Network error");
  });
});

describe("useCategories", () => {
  it("returns 'all' prepended to the fetched categories", async () => {
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockCategories,
    });

    const { result } = renderHook(() => useCategories());
    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.categories[0]).toBe("all");
    expect(result.current.categories).toHaveLength(mockCategories.length + 1);
  });

  it("falls back to ['all'] on fetch failure", async () => {
    global.fetch.mockRejectedValueOnce(new Error("fail"));
    const { result } = renderHook(() => useCategories());

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.categories).toEqual(["all"]);
  });
});
