
function hello() {
    console.log("Let's rock baby!") 

    // our main drawing area
    let app = new PIXI.Application({ width: 300, height: 356 });
    placeholder = document.getElementById("na3-implem-host")
    placeholder.appendChild(app.view);


    // our background
    let bg = PIXI.Sprite.from('na3-assets/bg_clipped.png');
    bg.width = 300
    bg.height = 356
    app.stage.addChild(bg)
}