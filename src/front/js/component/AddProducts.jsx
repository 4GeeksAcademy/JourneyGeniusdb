import React, { useState, useEffect, useContext } from "react";
import { Context } from "../store/appContext";

const AddProduct = () => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [condition, setCondition] = useState("");
  const [estimatedValue, setEstimatedValue] = useState("");
  const [location, setLocation] = useState("");
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedSubcategory, setSelectedSubcategory] = useState("");
  const { store, actions } = useContext(Context);

  useEffect(() => {
    actions.getCategories(); // Fetch categories
  }, []);

  useEffect(() => {
    console.log("Store subcategories changed:", store.subcategories);
  }, [store.subcategories]);

  useEffect(() => {
    console.log("Subcategories in store:", store.subcategories);
  }, [store.subcategories]);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Requisição para enviar os dados do formulário para o backend.
  };

  const handleCategoryChange = async (event) => {
    const categoryId = event.target.value;
    setSelectedCategory(categoryId);

    if (categoryId) {
      actions.getSubcategories(categoryId);
    } else {
      setSubcategories([]);
    }

    setSelectedSubcategory(""); // Redefinir o valor selecionado para uma subcategoria vazia
  };
  console.log(selectedCategory);

  const filteredSubcategories = selectedCategory
    ? store.subcategories.filter((sub) => sub.category_id == selectedCategory)
    : [];

  console.log(store.subcategories);

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        {/* Outros campos de input aqui */}
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
