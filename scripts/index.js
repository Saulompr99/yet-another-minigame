const previews = document.getElementsByClassName("preview");

for (const preview of previews) {
    if (preview.tagName == "VIDEO") {
        preview.addEventListener("mouseover", ()=>{
            preview.play();
        });
        
        preview.addEventListener("mouseleave", ()=>{
            preview.pause();
            preview.currentTime = 0;
        });
    }
}
