import { useState, useEffect } from "react";

const BASE_URL = "https://fakestoreapi.com";

export function useFakeStore(category = null) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const url = category
      ? `${BASE_URL}/products/category/${encodeURIComponent(category)}`
      : `${BASE_URL}/products`;

    setLoading(true);
    setError(null);

    fetch(url)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((data) => setProducts(data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [category]);

  return { products, loading, error };
}

export function useCategories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${BASE_URL}/products/categories`)
      .then((res) => res.json())
      .then((data) => setCategories(["all", ...data]))
      .catch(() => setCategories(["all"]))
      .finally(() => setLoading(false));
  }, []);

  return { categories, loading };
}
