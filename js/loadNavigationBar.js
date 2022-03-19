function loadNavigationBar() {
    //
    const displayContentForNavBar = `<nav class="navbar navbar-expand-lg navbar-light bg-light">
    <div class="container-fluid">
    <a class="navbar-brand" href="#">Navbar</a>
    <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
      <span class="navbar-toggler-icon"></span>
    </button>
    <div class="collapse navbar-collapse" id="navbarSupportedContent">
      <ul class="navbar-nav me-auto mb-2 mb-lg-0">
        <li class="nav-item">
          <a class="nav-link" href="https://www.abhishekpali.us">Homepage</a>
        </li>
      </ul>
    </div>
  </div>
</nav>

<div class="m-3">
<img class="logo"
    src="http://downloads.concepro.com/dropbox-public-files/logos/1-logos-pali/Signature-Stamp-Pali-Name-Logo-Wide-New-Dark.png">
</div>
<hr>` ;
//
document.getElementById("displayContentForNavBar").innerHTML = displayContentForNavBar ;  
}