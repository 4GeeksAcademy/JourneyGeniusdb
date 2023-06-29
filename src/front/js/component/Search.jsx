import React, { useState, useEffect, useContext } from "react";
import { Context } from "../store/appContext";

const Search = () => {
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedSubcategory, setSelectedSubcategory] = useState("");
  const [products, setProducts] = useState([]);
  const { store, actions } = useContext(Context);

  useEffect(() => {
    actions.getCategories(); // Fetch categories
  }, []);

  const fetchProducts = async (categoryId, subcategoryId) => {
    try {
      const backendUrl = process.env.BACKEND_URL; 
      let apiUrl = `${backendUrl}/api/products`;

      if (categoryId || subcategoryId) {
        apiUrl += '?';
        if (categoryId) {
          apiUrl += `category_id=${categoryId}`;
        }
        if (subcategoryId) {
          apiUrl += categoryId ? `&subcategory_id=${subcategoryId}` : `subcategory_id=${subcategoryId}`;
        }
      }

      const response = await fetch(apiUrl);
      const data = await response.json();

      if (response.ok) {
        setProducts(data);
      } else {
        console.error('Failed to fetch products:', data);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    }
};


  const handleCategoryChange = (event) => {
    const categoryId = event.target.value;
    setSelectedCategory(categoryId);
    if (categoryId) {
      actions.getSubcategories(categoryId);
    }
    setSelectedSubcategory("");
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchProducts(selectedCategory, selectedSubcategory);
  };

  const filteredSubcategories = selectedCategory
    ? store.subcategories.filter((sub) => sub.category_id == selectedCategory)
    : [];

  return (
    <div>
      <form onSubmit={handleSearch}>
        {/* Dropdown Menu for Categories */}
        <select name="category_id" onChange={handleCategoryChange}>
          <option value="">Select Category</option>
          {store.categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>

        {/* Dropdown Menu for Subcategories */}
        <select
          name="subcategory_id"
          value={selectedSubcategory}
          onChange={(e) => setSelectedSubcategory(e.target.value)}
        >
          <option value="">Select Subcategory</option>
          {filteredSubcategories.map((subcategory) => (
            <option key={subcategory.id} value={subcategory.id}>
              {subcategory.name}
            </option>
          ))}
        </select>

        <button type="submit">Search</button>
      </form>

      {/* Renderizando a lista de produtos */}
      <ul>
        {products.map((product) => (
          <li key={product.id}>
            {product.name} - {product.description}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Search;
