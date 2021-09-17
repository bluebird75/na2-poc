
const PLAY_WIDTH = 300
const PLAY_HEIGHT = 356
const SPT_WIDTH = 30
const SPT_HEIGHT = 30
const TOP_ROW_Y = 120 - 2.5*SPT_HEIGHT
const STACK_Y   = 118

function na3_run() {
    console.log("Let's rock baby!") 

    // our main drawing area
    let app = new PIXI.Application({ width: PLAY_WIDTH, height: PLAY_HEIGHT });
    placeholder = document.getElementById("na3-implem-host")
    placeholder.appendChild(app.view);


    // our background
    let bg = PIXI.Sprite.from('na3-assets/bg_clipped.png');
    bg.width = PLAY_WIDTH
    bg.height = PLAY_HEIGHT
    app.stage.addChild(bg)


    const texture = PIXI.Texture.from('na3-assets/elt6.png')

    // top row
    for (let x = 0; x < 6; x++) {
        let sp = new PIXI.Sprite(texture);
        sp.x = x*SPT_WIDTH
        sp.y = TOP_ROW_Y
        app.stage.addChild(sp)
    }

    // content
    for (let x = 0; x < 6; x++) {
        for (let y = 0; y < 7; y++) {
            let sp = new PIXI.Sprite(texture);
            sp.x = x*SPT_WIDTH
            sp.y = STACK_Y + y*SPT_HEIGHT
            app.stage.addChild(sp)
        }
    }
}