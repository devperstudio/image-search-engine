const accessKey = "81dn7kri_EOhmZCgJgZRToDGsH3wsnJSrPoqUQBfZHc";

const searchForm = document.getElementById("search-form");
const searchBox = document.getElementById("search-box");
const searchResult = document.getElementById("search-result");
const showMoreBtn = document.getElementById("show-more-btn");

const imageModal = document.getElementById("image-modal");
const modalImage = document.getElementById("modal-image");
const downloadBtn = document.getElementById("download-btn");
const closeModal = document.getElementById("close-modal");

let keyword = "";
let page = 1;

async function searchImages() {
  keyword = searchBox.value;

  const url = `https://api.unsplash.com/search/photos?page=${page}&query=${keyword}&client_id=${accessKey}&per_page=12`;

  const response = await fetch(url);
  const data = await response.json();

  if (page === 1) {
    searchResult.innerHTML = "";
  }

  const results = data.results;

  results.forEach((result) => {
    const image = document.createElement("img");
    image.src = result.urls.small;
    image.alt = result.alt_description;

    // On click, open modal
    image.addEventListener("click", () => {
      modalImage.src = result.urls.full;

      // Use Blob to ensure the image is downloaded
      downloadBtn.addEventListener("click", async (e) => {
        e.preventDefault(); // Prevent default link behavior
        const imageResponse = await fetch(result.urls.full);
        const imageBlob = await imageResponse.blob();
        const imageUrl = URL.createObjectURL(imageBlob);

        

        // Create a temporary link element
        const tempLink = document.createElement("a");
        tempLink.href = imageUrl;
        tempLink.download = "downloaded-image.jpg"; // File name
        document.body.appendChild(tempLink);
        tempLink.click(); // Simulate click
        document.body.removeChild(tempLink); // Remove temp link
        URL.revokeObjectURL(imageUrl); // Revoke the object URL
      });

      imageModal.style.display = "flex";
    });

    searchResult.appendChild(image);
  });

  showMoreBtn.style.display = "block";
}


// Close modal
closeModal.addEventListener("click", () => {
  imageModal.style.display = "none";
});

// Submit form
searchForm.addEventListener("submit", (e) => {
  e.preventDefault();
  page = 1;
  searchImages();
});

// Load more images
showMoreBtn.addEventListener("click", () => {
  page++;
  searchImages();
});
