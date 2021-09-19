'use strict';
// import * as PIXI from './pixi.js';

const PLAY_WIDTH = 300;
const PLAY_HEIGHT = 356;
const SPT_WIDTH = 30;
const SPT_HEIGHT = 30;
const TOP_ROW_Y = 120 - 2.5*SPT_HEIGHT;
const STACK_Y   = 118;
const NB_ROWS = 7;
const NB_COLS = 6;
const PAUSE_DURATION = 0.2;
const DELTA_MOVE = 1;


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
];

const STATE_MOVING = 'STATE_MOVING';
const STATE_IDLE = 'STATE_IDLE';

function random_nb(top_limit)
{
    // return a random number r: 0 <= r < max
    return Math.floor(Math.random()*top_limit);
}

function na3_onkeydown(e)
{
    let k = '';
    switch (e.key)
    {
        case 'ArrowDown':
        case 'Down':
            k = 'down';
            break;
        case 'ArrowUp':
        case 'Up':
            k = 'up';
            break;
        case 'ArrowLeft':
        case 'Left':
            k = 'left';
            break;
        case 'ArrowRight':
        case 'Right':
            k = 'right';
            break;
        default:
            // do nothing, let the keyboard event propagate
            return;
    }
    e.stopPropagation();
    e.preventDefault();
    
    if (e.repeat) {
        // we are not interested in repeated events
        return;
    }

    console.log('key down: ' + k);
}

export function na3_run() {
    console.log("Attention, on alchimise ici!!");

    // our main drawing area
    let app = new PIXI.Application({ width: PLAY_WIDTH, height: PLAY_HEIGHT });
    let placeholder = document.getElementById("na3-implem-host");
    placeholder.appendChild(app.view);
    placeholder.setAttribute('tabindex', '0');
    placeholder.onkeydown = na3_onkeydown;
    placeholder.focus();


    // our background
    let bg = PIXI.Sprite.from('na3-assets/bg_clipped.png');
    bg.width = PLAY_WIDTH;
    bg.height = PLAY_HEIGHT;
    app.stage.addChild(bg);


    let textures = [];
    ALL_ELT_NAMES.forEach((e) => {
        textures.push( PIXI.Texture.from(e) );
    });

    game.sp = new PIXI.Sprite(textures[Math.floor(Math.random()*textures.length)]);
    app.stage.addChild(game.sp);
    game.row = random_nb(NB_ROWS);
    game.col = random_nb(NB_COLS);
    game.state = STATE_IDLE;
    game.elapsed = 0;

    // init sprite position
    game.sp.x = game.col*SPT_WIDTH;
    game.sp.y = STACK_Y + game.row*SPT_HEIGHT;

    app.ticker.add(game_loop);
}


let game = { 
    // current position of our sprite
    row: 0, 
    col: 0, 

    // our sprite
    sp: null, 

    // duration elapsed since the pause start
    elapsed: 0, 

    // current state of the game: MOVING, PAUSING
    state: '',

    sp_dest_x: 0,
    sp_dest_y: 0,

    dir_row: 0,
    dir_col: 0,
};

function game_loop(delta)
{

    switch (game.state)
    {
        case STATE_IDLE:
            game.elapsed += 1/60 * delta;
            if (game.elapsed < PAUSE_DURATION) {
                // nothing to do, pause is still running
                return;
            }

            // pause expired
            // choose a new direction, horizontal or vertical
            game.dir_col = random_nb(3) - 1; // generates -1, 0 or 1
            if (game.dir_col === 0) {
                // no column move, choose a row move
                game.dir_row = 1 - random_nb(2)*2; // generates -1 or 1
            }

            // normalize
            if (game.row + game.dir_row < 0) {
                game.dir_row = 1;
            }
            if (game.row + game.dir_row >= NB_ROWS) {
                game.dir_row = -1;
            }
            if (game.col + game.dir_col < 0) {
                game.dir_col = 1;
            }
            if (game.col + game.dir_col >= NB_COLS) {
                game.dir_col = -1;
            }

            game.row += game.dir_row;
            game.col += game.dir_col;
            game.sp_dest_x = game.sp.x + game.dir_col*SPT_WIDTH;
            game.sp_dest_y = game.sp.y + game.dir_row*SPT_HEIGHT;
            game.state = STATE_MOVING;
            break;

        case STATE_MOVING:
            game.sp.x += game.dir_col * DELTA_MOVE;
            game.sp.y += game.dir_row * DELTA_MOVE;
            let goal_reached = false;
            if (game.dir_col && (((game.sp_dest_x - game.sp.x) * game.dir_col) <= 0)) {
                // we have reach our goal on the x axis
                game.sp.x = game.sp_dest_x;
                goal_reached = true;
            }
            else if (game.dir_row && (((game.sp_dest_y - game.sp.y) * game.dir_row) <= 0)) {
                // we have reach our goal on the x axis
                game.sp.y = game.sp_dest_y;
                goal_reached = true;
            }

            if (goal_reached === false) {
                // continue moving
                return;
            }

            // we have reached our destination, pause a little bit
            game.elapsed = 0;
            game.state = STATE_IDLE;

            // cancel our direction
            game.dir_row = 0;
            game.dir_col = 0;
            break;
 
        default:
            console.error('default clause reached, unexpected!');
    }
}
