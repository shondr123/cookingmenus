let currentIngredients = [];

document.addEventListener("DOMContentLoaded", () => {
  displayAllRecipes();
});

function addIngredient() {
  const name = document.getElementById("ingredient").value.trim();
  const amount = Number(document.getElementById("amount").value);
  const unit = document.getElementById("unit").value;

  if (name === "" || isNaN(amount) || amount <= 0) {
    alert("אנא הזן שם מצרך וכמות תקינה");
    return;
  }

  currentIngredients.push({ name, amount, unit });
  refreshIngredientList();
  document.getElementById("ingredient").value = "";
  document.getElementById("amount").value = "";
}

function removeIngredient(index) {
  currentIngredients.splice(index, 1);
  refreshIngredientList();
}

function refreshIngredientList() {
  const list = document.getElementById("ingredientsList");
  list.innerHTML = "";
  currentIngredients.forEach((ing, idx) => {
    const li = document.createElement("li");
    li.className = "list-group-item d-flex justify-content-between align-items-center";
    li.innerHTML = `${ing.name} - ${ing.amount} ${ing.unit}
      <button class="btn btn-sm btn-danger" onclick="removeIngredient(${idx})">מחק</button>`;
    list.appendChild(li);
  });
}

function saveRecipe() {
  const name = document.getElementById("recipeName").value.trim();
  const instructions = document.getElementById("instructions").value.trim();

  if (name === "" || currentIngredients.length === 0 || instructions === "") {
    alert("אנא מלא את כל השדות");
    return;
  }

  const recipes = JSON.parse(localStorage.getItem("recipes")) || [];
  recipes.push({ name, ingredients: currentIngredients, instructions });
  localStorage.setItem("recipes", JSON.stringify(recipes));

  document.getElementById("recipeName").value = "";
  document.getElementById("instructions").value = "";
  currentIngredients = [];
  refreshIngredientList();
  displayAllRecipes();
}

function displayAllRecipes() {
  const container = document.getElementById("recipesContainer");
  container.innerHTML = "";

  const recipes = JSON.parse(localStorage.getItem("recipes")) || [];

  recipes.forEach((recipe, index) => {
    const card = document.createElement("div");
    card.className = "card mb-3";
    card.innerHTML = `
      <div class="card-body">
        <h5 class="card-title">${recipe.name}</h5>
        <h6 class="card-subtitle mb-2 text-muted">מצרכים:</h6>
        <ul class="list-group mb-2">
          ${recipe.ingredients.map(ing => `<li class="list-group-item">${ing.name} - ${ing.amount} ${ing.unit}</li>`).join("")}
        </ul>
        <p class="card-text"><strong>הוראות:</strong> ${recipe.instructions}</p>
        <button class="btn btn-outline-danger" onclick="deleteRecipe(${index})">🗑️ מחק מתכון</button>
      </div>`;
    container.appendChild(card);
  });

  // סינון מחדש אם חיפשו משהו
  filterRecipes();
}

function deleteRecipe(index) {
  const recipes = JSON.parse(localStorage.getItem("recipes")) || [];
  recipes.splice(index, 1);
  localStorage.setItem("recipes", JSON.stringify(recipes));
  displayAllRecipes();
}

function filterRecipes() {
  const searchTerm = document.getElementById("searchBox").value.trim().toLowerCase();
  const allCards = document.querySelectorAll("#recipesContainer .card");

  allCards.forEach(card => {
    const title = card.querySelector(".card-title").textContent.toLowerCase();
    card.style.display = title.includes(searchTerm) ? "block" : "none";
  });
}
