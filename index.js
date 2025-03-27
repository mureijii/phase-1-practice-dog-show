document.addEventListener("DOMContentLoaded", () => {
    const tableBody = document.getElementById("dog-table-body");
    const form = document.getElementById("dog-form");
    let editDogId = null;
  
    // Fetch and display dogs
    function fetchDogs() {
      fetch("http://localhost:3000/dogs")
        .then((res) => res.json())
        .then(renderDogs);
    }
  
    function renderDogs(dogs) {
      tableBody.innerHTML = "";
      dogs.forEach((dog) => {
        const row = document.createElement("tr");
        row.innerHTML = `
          <td>${dog.name}</td>
          <td>${dog.breed}</td>
          <td>${dog.sex}</td>
          <td><button class="edit-btn" data-id="${dog.id}">Edit</button></td>
        `;
        tableBody.appendChild(row);
      });
    }
  
    // Populate form for editing
    tableBody.addEventListener("click", (e) => {
      if (e.target.classList.contains("edit-btn")) {
        const dogId = e.target.dataset.id;
        fetch(`http://localhost:3000/dogs/${dogId}`)
          .then((res) => res.json())
          .then((dog) => {
            form.name.value = dog.name;
            form.breed.value = dog.breed;
            form.sex.value = dog.sex;
            editDogId = dog.id;
          });
      }
    });
  
    // Submit form and update dog
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      if (!editDogId) return;
  
      const updatedDog = {
        name: form.name.value,
        breed: form.breed.value,
        sex: form.sex.value,
      };
  
      fetch(`http://localhost:3000/dogs/${editDogId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedDog),
      }).then(() => {
        fetchDogs(); // Refresh table with updated data
        form.reset();
        editDogId = null;
      });
    });
  
    fetchDogs(); // Initial load
  });
  