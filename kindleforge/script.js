//This JS Is Uglified Substantially For It To Work On Kindle.C

var apps = [
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
  
var icons = {
    book: '<svg class="icon" viewBox="0 0 24 24">' +
            '<path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>' +
            '<path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>' +
          '</svg>',
    download: '<svg class="icon" viewBox="0 0 24 24">' +
                '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>' +
                '<polyline points="7 10 12 15 17 10"></polyline>' +
                '<line x1="12" y1="15" x2="12" y2="3"></line>' +
              '</svg>'
};
  
function formatNumber(num) {
    return num.toLocaleString();
}
  
function createAppCard(app) {
  var html = '';
  html += '<article class="app-card">';
  html += '  <div class="app-header">';
  html += '    <div class="app-title-box">';
  html += '      <h2 class="app-title">' + app.name + '</h2>';
  html += '      <p class="app-author">by ' + app.author + '</p>';
  html += '    </div>';
  html += '  </div>';
  html += '  <p class="app-description">' + app.description + '</p>';
  html += '  <button class="install-button">';
  html +=      icons.download;
  html += '    Install Application';
  html += '  </button>';
  html += '</article>';
  return html;
}


  
function renderApps() {
    var appList = document.getElementById("app-list");
    var html = '';
    for (var i = 0; i < apps.length; i++) {
      html += createAppCard(apps[i]);
    }
    appList.innerHTML = html;
    
    // Add click event listeners for each install button
    var installButtons = document.querySelectorAll(".install-button");
    for (var i = 0; i < installButtons.length; i++) {
      // Create a closure to capture the current index
      (function(index) {
        installButtons[index].addEventListener("click", function() {
          alert("Installing " + apps[index].name + "...");
        });
      })(i);
    }
}
  
document.addEventListener("DOMContentLoaded", function() {
    renderApps();
    document.getElementById("status").innerHTML = "JS Working!";
});