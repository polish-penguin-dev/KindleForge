document.getElementById("status").innerHTML = "JS Working!";

const apps = [
    {
      name: "KOReader",
      author: "Hans-Werner",
      description: "An E-book Reader Application",
      downloads: 12420
    },
    {
      name: "kTerm",
      author: "Bartek Fabiszewski",
      description: "GTK+ Terminal Emulator For Kindle",
      downloads: 8930
    },
    {
      name: "KindleFetch",
      author: "Justrals",
      description: "Download Books From Anna's Archive",
      downloads: 15640
    }
];
  
const icons = {
    book: `<svg class="icon" viewBox="0 0 24 24">
      <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
      <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
    </svg>`,
    download: `<svg class="icon" viewBox="0 0 24 24">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
      <polyline points="7 10 12 15 17 10"></polyline>
      <line x1="12" y1="15" x2="12" y2="3"></line>
    </svg>`
};
  
function formatNumber(num) {
    return new Intl.NumberFormat().format(num);
}
  
function createAppCard(app) {
    return `
      <article class="app-card">
        <div class="app-header">
          <div>
            <h2 class="app-title">${app.name}</h2>
            <p class="app-author">by ${app.author}</p>
          </div>
          <div class="app-downloads">
            ${icons.book}
            <span>${formatNumber(app.downloads)}</span>
          </div>
        </div>
        
        <p class="app-description">${app.description}</p>
        
        <button class="install-button">
          ${icons.download}
          Install Application
        </button>
      </article>
    `;
}
  
function renderApps() {
    const appList = document.getElementById("app-list");
    appList.innerHTML = apps.map(createAppCard).join("");
    
    document.querySelectorAll(".install-button").forEach((button, index) => {
      button.addEventListener("click", () => {
        alert(`Installing ${apps[index].name}...`);
      });
    });
}
  

document.addEventListener("DOMContentLoaded", renderApps);