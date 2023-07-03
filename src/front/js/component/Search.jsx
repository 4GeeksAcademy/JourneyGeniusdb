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
      actions.getCategories();
    } else if (searchType === "services") {
      actions.getServiceCategories();
    }
  }, [searchType]);

  const handleCategoryChange = (event) => {
    const categoryId = event.target.value;
    setSelectedCategory(categoryId);

    if (categoryId) {
      if (searchType === "products") {
        actions.getSubcategories(categoryId);
      } else if (searchType === "services") {
        actions.getServiceSubcategories(categoryId);
      }
    }
    setSelectedSubcategory("");
  };

  const handleSearch = (e) => {
    e.preventDefault();

    if (specificSearch) {
      actions.fetchItemsByName(searchTerm);
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

  const renderItems = (items, isProduct) => (
    <ul>
      {items.map((item) => (
        <li key={item.id}>
          <strong>{item.name}</strong>
          {isProduct && item.condition ? ` - Condition: ${item.condition}` : ""}
          {item.estimated_value ? ` - Estimated Value: ${item.estimated_value}` : ""}
        </li>
      ))}
    </ul>
  );

  return (
    <div>
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
        <div>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Enter item name..."
          />
          <button onClick={handleSearch}>Search</button>
          {renderItems(store.searchedProducts, true)}
          {renderItems(store.searchedServices, false)}
        </div>
      ) : searchType ? (
        <form onSubmit={handleSearch}>
          <select name="category_id" onChange={handleCategoryChange}>
            <option value="">Select Category</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>

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

      {!specificSearch && (
        <div>
          {searchType === "products" && renderItems(store.products, true)}
          {searchType === "services" && renderItems(store.services, false)}
        </div>
      )}
    </div>
  );
};

export default Search;
