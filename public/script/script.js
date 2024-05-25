let tline = document.getElementById("list");
let crose = document.getElementById("x");
let hitems = document.getElementById("hitems");
crose.addEventListener("click", () => {
    // console.log("Click on X");
    hitems.style.transform = "translateY(0px)";
    tline.style.display = "flex";
    crose.style.display = "none";
});
tline.addEventListener("click", () => {
    // console.log("Click");
    hitems.style.transform = "translateY(270px)";
    tline.style.display = "none";
    crose.style.display = "flex";
    // setTimeout(() => {
    //     window.location.reload();
    // }, 2000);
});

// for active page
var url = window.location.href;
var path = window.location.pathname;
var filename = url.substring(url.lastIndexOf('/') + 1);
var files = url.substring(url.lastIndexOf('/') + 1, url.lastIndexOf('?'));
var links = document.querySelectorAll('nav a');
// console.log("Url",url)
// console.log("Path",path)
// console.log("File", files)

links.forEach(key => {
    // console.log("links", key.href.includes(`${path}`))
    if (key.href.includes(`${path}`)) {
        // console.log("Value", key.pathname===`/${filename}`)
        if (key.pathname === `/${filename}`) {
            // console.log("links", key.pathname)
            key.classList.add('active');
        }
        if (key.pathname === `/${files}`) {
            // console.log("links 2", key.pathname)
            key.classList.add('active');
        }
    }
});