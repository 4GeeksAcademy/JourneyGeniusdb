import React, { useState, useEffect, useContext } from "react";
import { Context } from "../store/appContext";

const Search = () => {
  const [searchType, setSearchType] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedSubcategory, setSelectedSubcategory] = useState("");
  const [specificSearch, setSpecificSearch] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const { store, actions } = useContext(Context);

  useEffect(() => {
    if (searchType === "products") {
      actions.getCategories(); // Fetch categories for products
    } else if (searchType === "services") {
      actions.getServiceCategories(); // Fetch categories for services
    }
  }, [searchType]);

  const handleCategoryChange = (event) => {
    const categoryId = event.target.value;
    setSelectedCategory(categoryId);
    if (categoryId) {
      if (searchType === "products") {
        actions.getSubcategories(categoryId); // Fetch subcategories for products
      } else if (searchType === "services") {
        actions.getServiceSubcategories(categoryId); // Fetch subcategories for services
      }
    }
    setSelectedSubcategory("");
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (specificSearch) {
      actions.fetchItemsByName(searchTerm); // Fetch specific item by name
    } else if (searchType === "products") {
      actions.fetchProducts(selectedCategory, selectedSubcategory);
    } else if (searchType === "services") {
      actions.fetchServices(selectedCategory, selectedSubcategory);
    }
  };

  const handleSearchTypeChange = (newSearchType) => {
    setSearchType(newSearchType);
    setSelectedCategory("");
    setSelectedSubcategory("");
    setSpecificSearch(false);
  };

  const handleSpecificSearchToggle = () => {
    setSpecificSearch(true);
    setSearchType(null);
    setSelectedCategory("");
    setSelectedSubcategory("");
  };

  const filteredSubcategories = selectedCategory
    ? (searchType === "products"
        ? store.subcategories
        : store.serviceSubcategories
      ).filter((sub) => sub.category_id == selectedCategory)
    : [];

  const categories =
    searchType === "products" ? store.categories : store.serviceCategories;

  return (
    <div>
      {/* Buttons to select between product, service or specific item search */}
      <div>
        <button onClick={() => handleSearchTypeChange("products")}>
          Search Products
        </button>
        <button onClick={() => handleSearchTypeChange("services")}>
          Search Services
        </button>
        <button onClick={handleSpecificSearchToggle}>
          Specific Item Search
        </button>
      </div>

      {specificSearch ? (
        // Specific Item Search Input
        <div>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Enter item name..."
          />
          <button onClick={handleSearch}>Search</button>
          {/* Renderizando os produtos pesquisados */}
          {store.searchedProducts && (
            <ul>
              {store.searchedProducts.map((product) => (
                <li key={product.id}>
                  {product.name} - Product - {product.description}
                </li>
              ))}
            </ul>
          )}

          {/* Renderizando os serviços pesquisados */}
          {store.searchedServices && (
            <ul>
              {store.searchedServices.map((service) => (
                <li key={service.id}>
                  {service.name} - Service - {service.description}
                </li>
              ))}
            </ul>
          )}
        </div>
      ) : searchType ? (
        // Category and Subcategory Dropdowns
        <form onSubmit={handleSearch}>
          {/* Dropdown Menu for Categories */}
          <select name="category_id" onChange={handleCategoryChange}>
            <option value="">Select Category</option>
            {categories.map((category) => (
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
      ) : null}

      {/* Rendering the list of products or services */}
      {!specificSearch && (
        <ul>
          {searchType === "products" &&
            store.products.map((product) => (
              <li key={product.id}>
                {product.name} - {product.description}
              </li>
            ))}
          {searchType === "services" &&
            store.services.map((service) => (
              <li key={service.id}>
                {service.name} - {service.description}
              </li>
            ))}
        </ul>
      )}
    </div>
  );
};

export default Search;
