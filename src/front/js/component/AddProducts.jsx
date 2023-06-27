import React, { useState, useEffect, useContext } from "react";
import { Context } from "../store/appContext";

const AddProduct = () => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [condition, setCondition] = useState("");
  const [estimatedValue, setEstimatedValue] = useState("");
  const [location, setLocation] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedSubcategory, setSelectedSubcategory] = useState("");
  const { store, actions } = useContext(Context);

  useEffect(() => {
    actions.getCategories(); // Fetch categories
  }, []);

  const createNewProduct = async () => {
    try {
      const backendUrl = process.env.BACKEND_URL;
      const authToken = localStorage.getItem("token");

      if (!authToken) {
        console.error("Token de autenticação não encontrado");
        return;
      }

      // Fazendo uma chamada de API para autenticar o usuário
      const response = await fetch(`${backendUrl}/api/products`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({
          name,
          description,
          category: selectedCategory,
          subcategory: selectedSubcategory,
          condition,
          estimated_value: estimatedValue,
          location,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        console.log("Produto criado com sucesso:", data);
      } else {
        console.error("Falha ao criar o produto:", data);
      }
    } catch (error) {
      console.error("Erro na requisição:", error);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    createNewProduct();
  };

  const handleCategoryChange = async (event) => {
    const categoryId = event.target.value;
    setSelectedCategory(categoryId);

    if (categoryId) {
      actions.getSubcategories(categoryId);
    }

    setSelectedSubcategory("");
  };

  const filteredSubcategories = selectedCategory
    ? store.subcategories.filter((sub) => sub.category_id == selectedCategory)
    : [];

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          type="text"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <input
          type="text"
          placeholder="Condition"
          value={condition}
          onChange={(e) => setCondition(e.target.value)}
        />

        <input
          type="text"
          placeholder="Estimated Value"
          value={estimatedValue}
          onChange={(e) => setEstimatedValue(e.target.value)}
        />

        <input
          type="text"
          placeholder="Location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />

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

        <button type="submit">Add Product</button>
      </form>
    </div>
  );
};

export default AddProduct;
