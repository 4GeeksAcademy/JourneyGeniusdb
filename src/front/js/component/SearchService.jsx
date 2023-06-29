import React, { useState, useEffect, useContext } from "react";
import { Context } from "../store/appContext";

const SearchService = () => {
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedSubcategory, setSelectedSubcategory] = useState("");
  const { store, actions } = useContext(Context);

  useEffect(() => {
    actions.getServiceCategories(); // Fetch service categories
  }, []);

  const handleCategoryChange = (event) => {
    const categoryId = event.target.value;
    setSelectedCategory(categoryId);
    if (categoryId) {
      actions.getServiceSubcategories(categoryId);
    }
    setSelectedSubcategory("");
  };

  const handleSearch = (e) => {
    e.preventDefault();
    actions.fetchServices(selectedCategory, selectedSubcategory);
  };

  const filteredSubcategories = selectedCategory
    ? store.serviceSubcategories.filter((sub) => sub.category_id == selectedCategory)
    : [];

  return (
    <div>
      <form onSubmit={handleSearch}>
        {/* Dropdown Menu for Categories */}
        <select name="category_id" onChange={handleCategoryChange}>
          <option value="">Select Category</option>
          {store.serviceCategories.map((category) => (
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

      {/* Renderizando a lista de serviços */}
      <ul>
        {store.services.map((service) => (
          <li key={service.id}>
            {service.name} - {service.description}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SearchService;
