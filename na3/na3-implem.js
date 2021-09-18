
const PLAY_WIDTH = 300
const PLAY_HEIGHT = 356
const SPT_WIDTH = 30
const SPT_HEIGHT = 30
const TOP_ROW_Y = 120 - 2.5*SPT_HEIGHT
const STACK_Y   = 118
const NB_ROWS = 7
const NB_COLS = 6

const ALL_ELT_NAMES = [
    'na3-assets/elt0.png',
    'na3-assets/elt1.png',
    'na3-assets/elt2.png',
    'na3-assets/elt3.png',
    'na3-assets/elt4.png',
    'na3-assets/elt5.png',
    'na3-assets/elt6.png',
    'na3-assets/elt7.png',
    'na3-assets/elt12.png',
    'na3-assets/elt17.png',
    'na3-assets/elt18.png',
]

function na3_run() {
    console.log("Attention, on alchimise ici!!") 

    // our main drawing area
    let app = new PIXI.Application({ width: PLAY_WIDTH, height: PLAY_HEIGHT });
    placeholder = document.getElementById("na3-implem-host")
    placeholder.appendChild(app.view);


    // our background
    let bg = PIXI.Sprite.from('na3-assets/bg_clipped.png');
    bg.width = PLAY_WIDTH
    bg.height = PLAY_HEIGHT
    app.stage.addChild(bg)


    let textures = [];
    ALL_ELT_NAMES.forEach((e) => {
        textures.push( PIXI.Texture.from(e) );
    })

    // top row
    for (let x = 0; x < NB_COLS; x++) {
        let sp = new PIXI.Sprite(textures[Math.floor(Math.random()*textures.length)]);
        sp.x = x*SPT_WIDTH
        sp.y = TOP_ROW_Y
        app.stage.addChild(sp)
    }

    // content
    for (let x = 0; x < NB_COLS; x++) {
        for (let y = 0; y < NB_ROWS; y++) {
            let sp = new PIXI.Sprite(textures[Math.floor(Math.random()*textures.length)]);
            sp.x = x*SPT_WIDTH
            sp.y = STACK_Y + y*SPT_HEIGHT
            app.stage.addChild(sp)
        }
    }
}