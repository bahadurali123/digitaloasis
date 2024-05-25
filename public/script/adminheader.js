let tline = document.getElementById("list");
let crose = document.getElementById("x");
let hitems = document.getElementById("hitems");
crose.addEventListener("click", () => {
    console.log("Click on X");
    // hitems.style.transform = "translateY(-165px)";
    // hitems.style.transform = "translateX(0vh)";
    hitems.style.transform = "translateX(-105vh) translateY(-165px)";
    tline.style.display = "flex";
    crose.style.display = "none";
});
tline.addEventListener("click", () => {
    console.log("Click");
    // hitems.style.transform = "translateY(165px)";
    // hitems.style.transform = "translateX(-105vh)";
    hitems.style.transform = "translateX(0vh) translateY(165px)";
    tline.style.display = "none";
    crose.style.display = "flex";
    // setTimeout(() => {
    //     window.location.reload();
    // }, 2000);
});