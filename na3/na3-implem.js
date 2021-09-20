'use strict';

const PLAY_WIDTH = 300;
const PLAY_HEIGHT = 356;
const SPT_WIDTH = 30;
const SPT_HEIGHT = 30;
const TOP_ROW_Y = 120 - 2.5*SPT_HEIGHT;
const BOARD_Y   = 118;
const NB_ROWS = 7;
const NB_COLS = 6;
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

const STATE_IDLE        = 'STATE_IDLE';
const STATE_MOVING_LR   = 'STATE_MOVING_LR';
const STATE_MOVING_DOWN = 'STATE_MOVING_DOWN';
const STATE_NEW_ELEM    = 'STATE_NEW_ELEM';

/***********************************
 *                                 *
 *              Game concept       *

state:
- new element
    * generate random element
    * generate new sprite
    * place it on screen
    * allow movement

- idle
    * catch keyboard events
    * move element right, left or down

- moving left/right
    * move element left/right
    * return to idle

- moving down
    * move element to the bottom of the screen

Game structures:
----------------
- board describing the current gems placed on the game
- board pointing to equivalent list of sprites
- top sprite to generate
- general movement in progress
- position of our sprite: 
    . -1 is top row
    . other values are in the board

- movement in progress:
    - list of [
        - [sprite, dest_x, dest_y, direction, callback when destination is reached]
    ]
 


************************************/

let game = { 
    // current state of the game: STATE_xxx
    state: '',

    // current position of our sprite in the top row
    col: 0, 

    // our current element as sprite
    sp: null, 
    // our current element index
    elt: -1,

    // set to: down, up, left, right when a key is pressed, nothing else
    keypressed: '',

    // set to true when accepting key presses
    accept_key_press: false,

    // list of all movements in progress
    move_in_progress: [],

    // board[row][col] for the elements
    board: [],
};


let assets = {
    // our PIXI application
    app: null,

    // store all the textures to use for our sprites
    textures: [],
};


/** return a random number r: 0 <= r < top_limit */
function random_nb(top_limit)
{
    return Math.floor(Math.random()*top_limit);
}

/*********************************************************
 * 
 *                Game initialisation
 * 
 *********************************************************/

/** Global initialisation of the game */
export function na3_start() {
    console.log("Attention, on alchimise ici!!");

    // our main drawing area
    assets.app = new PIXI.Application({ width: PLAY_WIDTH, height: PLAY_HEIGHT });
    let placeholder = document.getElementById("na3-implem-host");
    placeholder.appendChild(assets.app.view);
    placeholder.setAttribute('tabindex', '0');
    placeholder.onkeydown = (e) => na3_onkeydown(e);
    placeholder.focus();

    // our background
    let bg = PIXI.Sprite.from('na3-assets/bg_clipped.png');
    bg.width = PLAY_WIDTH;
    bg.height = PLAY_HEIGHT;
    assets.app.stage.addChild(bg);


    // the textures for all our sprites
    ALL_ELT_NAMES.forEach((e) => {
        assets.textures.push( PIXI.Texture.from(e) );
    });

    for (let i=0; i<NB_ROWS; i++) {
        game.board.push( [-1, -1, -1, -1, -1, -1] );
    }

    enter_state(STATE_NEW_ELEM);

    assets.app.ticker.add(game_loop);
}

/** Close the loop, unload all textures */
export function na3_end() {
    console.log('The end already ?');
    assets.textures.foreach((t) => { t.destroy(); });
    assets.app.destroy();
    game = null;

}


/*******************************************************
 * 
 *                Game logic
 * 
 *******************************************************/

/* Switch the state of the game */
function enter_state(state)
{
    console.log('Entering state ', state);
    game.state = state;

    switch (state) {
        case STATE_IDLE: 
            game.accept_key_press = true;
            break;
        default:
            game.accept_key_press = false;
            break;
    }
}


function game_loop()
{

    switch (game.state)
    {
        case STATE_NEW_ELEM:
            gen_new_element();
            return;

        case STATE_IDLE:
            handle_game_key();
            return;

        case STATE_MOVING_LR:
        case STATE_MOVING_DOWN:
            handle_moving();
            return;

        default:
            console.error('default clause reached, unexpected!');
    }
}


// Generate a new element on the top row
function gen_new_element()
{
    game.elt = random_nb(assets.textures.length);
    game.sp = new PIXI.Sprite(assets.textures[game.elt]);
    assets.app.stage.addChild(game.sp);

    game.col = random_nb(NB_COLS);

    // init sprite position
    game.sp.x = game.col*SPT_WIDTH;
    game.sp.y = TOP_ROW_Y;

    enter_state(STATE_IDLE);
}

/*********************************************************************
 * 
 *                  Board logic
 * 
 *********************************************************************/

/** return the next row available to put an element
 * 
 * Uses game.board and game.col for the calculation.
 * 
 * -1 means no more rows in the board
 */
function column_next_row()
{
    let next_row = -1;
    for (let row=NB_ROWS-1; row>=0; row--) {
        if (game.board[row][game.col] === -1) {
            next_row = row;
            break;
        }
    }
    return next_row;
}


/*********************************************************************
 * 
 *                  Movement
 * 
 *********************************************************************/

function Move(sprite, dir_col, dir_row, dest_x, dest_y, done = null) {
    this.sp = sprite;
    this.dir_col = dir_col;
    this.dir_row = dir_row;
    this.dest_x = dest_x;
    this.dest_y = dest_y;
    this.done = done;
}


function handle_moving()
{
    let move_to_remove = [];

    for (let i=0; i<game.move_in_progress.length; i++) {
        let move = game.move_in_progress[i];

        move.sp.x += move.dir_col * DELTA_MOVE;
        move.sp.y += move.dir_row * DELTA_MOVE;

        let goal_reached = false;

        // hidden assumption: a sprite can only move on one of dir_row or dir_col
        // it is not possible here to move on both axis at the same time

        if (move.dir_col) {
            if ((move.dest_x - move.sp.x) * move.dir_col <= 0) {
                // we have reach our goal on the x axis
                move.sp.x = move.dest_x;
                goal_reached = true;
            }
        }

        else if (move.dir_row) { 
            if ((move.dest_y - move.sp.y) * move.dir_row <= 0) {
            // we have reach our goal on the y axis
            move.sp.y = move.dest_y;
                goal_reached = true;
            }
        }

        if (goal_reached === false) {
            // continue moving on next loop
            return;
        }

        if (move.done !== null) {
            move.done();
        }
        // we have reached our destination, register this move for deletion
        move_to_remove.push(i);
    }

    // we must remove the indices in backward order, to avoid them
    // changing in the middle
    for (let i=move_to_remove.length-1; i>=0 ;i--) {
        game.move_in_progress.splice(move_to_remove[i], 1);
    }

    // if all moves are completed, we can begin our next step
    if (game.move_in_progress.length === 0) {
        if (game.state == STATE_MOVING_DOWN) {
            enter_state(STATE_NEW_ELEM);
        } else {
            enter_state(STATE_IDLE);
        }
    }

}



/*********************************************************************
 * 
 *                  Key Management
 * 
 *********************************************************************/

/** event handler for key presses */
function na3_onkeydown(e)
{
    let k = '';
    switch (e.key)
    {
        case 'ArrowDown':
        case 'Down':
            k = 'down';
            break;
        /*  Arrow up not handled right now
        case 'ArrowUp':
        case 'Up':
            k = 'up';
            break;
        */
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
        // we are not interested in repeated events of arrow key
        // but we don't want them to propagate either, that's why it's after
        // the e.preventDefault() call
        return;
    }

    if (game.keypressed === '' && game.accept_key_press) {
        game.keypressed = k;
        console.log('Registering keypress: ' + k);
    }
}

/** Called during state idle to handle the key pressed by the user: left, right, down */
function handle_game_key()
{
    if (game.keypressed === '') {
        // nothing to do if nothing happens
        return;
    }

    if (game.keypressed === 'down') {
        handle_arrow_down();
        return;
    }

    handle_arrow_left_right();
}

function handle_arrow_left_right()
{
    let dir_dict = {    // row, col
        'left':    -1,
        'right':    1,
    };

    let dir_col = dir_dict[game.keypressed];
    if (dir_col === undefined) {
        console.error('Unknown key pressed: ', game.keypressed);

    }

    // erase the key pressed now, to avoid re-entering here
    game.keypressed = '';

    // check if move is possible
    if ( ((game.col + dir_col) >= NB_COLS) ||
         ((game.col + dir_col) < 0) 
         ) {
        // ignore the move
        return;
    }

    game.move_in_progress.push( new Move(
        game.sp, 
        dir_col, 0, // dir_col, dir_row
        game.sp.x + dir_col*SPT_WIDTH, game.sp.y // dest_x, dest_y
        )
    );
    
    game.col += dir_col;
    enter_state(STATE_MOVING_LR);
}

function handle_arrow_down()
{
    game.keypressed = '';
    let done = null;
    let target_row = column_next_row();
    if (target_row == -1) {
        // we have lost !
        done = () => {
            alert('you lose!');
            na3_end();
        };
    } else {
        game.board[target_row][game.col] = game.elt;
    }


    game.move_in_progress.push( new Move(
        game.sp, 
        0, NB_ROWS-1, // dir_col, dir_row
        game.sp.x, BOARD_Y + SPT_WIDTH * target_row,
        done
        )
    );
    
    enter_state(STATE_MOVING_DOWN);
}
