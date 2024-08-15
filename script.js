const APIURL = "https://www.googleapis.com/books/v1/volumes?q=";

const main = document.getElementById("main");
const search = document.getElementById("search");
const form = document.getElementById("form");
const pagination = document.getElementById("pagination");

let currentSearchTerm = "fiction";
let currentPage = 1;
const maxResults = 15;
const pageRange = 4;

form.addEventListener("submit", (e) => {
  e.preventDefault();

  currentSearchTerm = search.value;

  if (currentSearchTerm) {
    currentPage = 1;
    getBooksAPI(
      APIURL +
        currentSearchTerm +
        `&startIndex=${(currentPage - 1) * maxResults}&maxResults=${maxResults}`
    );
    search.value = "";
  }
});

async function getBooksAPI(url) {
  const resp = await fetch(url);
  const respData = await resp.json();

  showBooks(respData.items);
  setupPagination(respData.totalItems);
}

function showBooks(books) {
  main.innerHTML = "";

  if (!books || books.length === 0) {
    main.innerHTML = "<p>Kitap bulunamadı</p>";
    return;
  }

  for (let i = 0; i < maxResults; i++) {
    const book = books[i];
    if (!book) break;
    // const volumeInfo = book.volumeInfo;
    // const title = volumeInfo.title;
    // const authors = volumeInfo.authors;
    // const description = volumeInfo.description;
    // const imageLinks = volumeInfo.imageLinks;

    // const thumbnail =
    //   (imageLinks &&
    //     (imageLinks.medium || imageLinks.large || imageLinks.thumbnail)) ||
    //   "https://via.placeholder.com/150";

    const { title, authors, description, imageLinks } = book.volumeInfo;
    const thumbnail =
      imageLinks?.medium ||
      imageLinks?.large ||
      imageLinks?.thumbnail ||
      "https://via.placeholder.com/150";

    const bookEl = document.createElement("div");
    bookEl.classList.add("book");

    bookEl.innerHTML = `
      <img src="${thumbnail}" alt="${title}">
      <div class="book-info">
        <h3>${title}</h3>
        <span>${(authors || ["Yazar Bilinmiyor"]).join(", ")}</span>
      </div>
      <div class="overview">
        <h3>Özet:</h3>
        ${description || "Açıklama mevcut değil"}
      </div>
    `;

    main.appendChild(bookEl);
  }
}

function setupPagination(totalItems) {
  pagination.innerHTML = "";
  const totalPages = Math.ceil(totalItems / maxResults);
  const pageGroup = Math.ceil(currentPage / pageRange);

  const startPage = (pageGroup - 1) * pageRange + 1;
  const endPage = Math.min(startPage + pageRange - 1, totalPages);

  if (startPage > 1) {
    const prevButton = createPageButton("...", startPage - 1);
    pagination.appendChild(prevButton);
  }

  for (let i = startPage; i <= endPage; i++) {
    const button = createPageButton(i, i);
    if (i === currentPage) {
      button.classList.add("active");
    }
    pagination.appendChild(button);
  }

  if (endPage < totalPages) {
    const nextButton = createPageButton("...", endPage + 1);
    pagination.appendChild(nextButton);
  }
}

function createPageButton(text, page) {
  const button = document.createElement("button");
  button.innerText = text;
  button.classList.add("page-btn");
  button.addEventListener("click", () => {
    currentPage = page;
    getBooksAPI(
      APIURL +
        currentSearchTerm +
        `&startIndex=${(currentPage - 1) * maxResults}&maxResults=${maxResults}`
    );
    window.scrollTo({ top: 0, behavior: "instant" });
  });
  return button;
}

getBooksAPI(
  APIURL +
    currentSearchTerm +
    `&startIndex=${(currentPage - 1) * maxResults}&maxResults=${maxResults}`
);
