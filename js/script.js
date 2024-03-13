document.addEventListener("DOMContentLoaded", function () {
  // Function to fetch data and populate the table
  function fetchDataAndPopulateTable(pageNumber) {
      const req = new XMLHttpRequest();
      req.open("GET", "https://raw.githubusercontent.com/Rajavasanthan/jsondata/master/pagenation.json");
      req.send();

      req.onload = function () {
          if (req.status >= 200 && req.status < 400) {
              const data = JSON.parse(this.responseText);
              populateTable(data, pageNumber);
          } else {
              console.error("Failed to fetch data");
          }
      };
  }

  // Function to populate the table with data
  function populateTable(data, pageNumber) {
      const app = document.getElementById("app");
      app.innerHTML = ""; // Clear previous content

      // Create a container for the table with appropriate classes
      const tableContainer = document.createElement("div");
      tableContainer.className = "table-responsive bg-light";

      // Create the table element with appropriate class
      const table = document.createElement("table");
      table.className = "table table-bordered"; // Ensure correct class

      // Create the table header
      const thead = document.createElement("thead");
      const headerRow = document.createElement("tr");
      // Populate header cells with desired text content
      ["ID", "Name", "Email"].forEach(headerText => {
          const th = document.createElement("th");
          th.textContent = headerText;
          headerRow.appendChild(th);
      });
      // Append header row to the thead element
      thead.appendChild(headerRow);
      // Append thead to the table element
      table.appendChild(thead);

      // Create the table body
      const tbody = document.createElement("tbody");
      const startIndex = (pageNumber - 1) * 10;
      const endIndex = Math.min(pageNumber * 10, data.length);
      const pageData = data.slice(startIndex, endIndex);
      // Populate table body with data rows
      pageData.forEach(item => {
          const tr = document.createElement("tr");
          // Populate cells with data properties
          ["id", "name", "email"].forEach(prop => {
              const td = document.createElement("td");
              td.textContent = item[prop];
              tr.appendChild(td);
          });
          // Append row to tbody
          tbody.appendChild(tr);
      });
      // Append tbody to the table element
      table.appendChild(tbody);

      // Append the table to the table container
      tableContainer.appendChild(table);
      // Append the table container to the app container
      app.appendChild(tableContainer);

      // Create pagination buttons
      createPagination(data, pageNumber);

      // Assertion: Ensure correct table structure
      assert.strictEqual(table.tagName, 'TABLE', 'There should be a table element');
      assert.strictEqual(table.className.split(' ')[0], 'table', 'Table element with class="table" is required');
      assert.strictEqual(table.childElementCount, 2, 'Table element should contain <thead> and <tbody> elements.');
      assert.strictEqual(table.firstElementChild.tagName, 'THEAD', 'Table element should contain <thead>');
      assert.isTrue(table.firstElementChild.hasChildNodes('tr', 'th'), 'Table <thead> should contain <tr> and <th> elements');
      assert.strictEqual(table.lastElementChild.tagName, 'TBODY', 'Table should contain <tbody> element.');
  }

  // Function to create pagination
  function createPagination(data, pageNumber) {
      const totalPages = Math.ceil(data.length / 10);
      const buttonsContainer = document.getElementById("buttons");
      buttonsContainer.innerHTML = ""; // Clear previous buttons

      const ul = document.createElement("ul");
      ul.className = "pagination";

      const prevButton = createPageButton("Previous", pageNumber - 1);
      ul.appendChild(prevButton);

      for (let i = 1; i <= totalPages; i++) {
          const pageButton = createPageButton(i, i);
          if (i === pageNumber) {
              pageButton.classList.add("active");
          }
          ul.appendChild(pageButton);
      }

      const nextButton = createPageButton("Next", pageNumber + 1);
      ul.appendChild(nextButton);

      buttonsContainer.appendChild(ul);
  }

  // Function to create page button
  function createPageButton(label, targetPage) {
      const li = document.createElement("li");
      li.className = "page-item";
      const button = document.createElement("button");
      button.className = "page-link";
      button.textContent = label;
      button.addEventListener("click", function () {
          fetchDataAndPopulateTable(targetPage);
      });
      li.appendChild(button);
      return li;
  }

  // Custom assertion function
  function assert(condition, message) {
      if (!condition) {
          throw new Error(message);
      }
  }

  // Call the function to fetch data and populate the table with page 1
  fetchDataAndPopulateTable(1);
});
