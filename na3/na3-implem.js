'use strict';

const PLAY_WIDTH = 300;
const PLAY_HEIGHT = 356;
const SPT_WIDTH = 30;
const SPT_HEIGHT = 30;
const TOP_ROW_Y = 120 - 2.5*SPT_HEIGHT;
const BOARD_Y   = 118;
const NB_ROWS = 7;
const NB_COLS = 6;
const DELTA_MOVE_X = 3;
const DELTA_MOVE_Y = 5;
const DEFAULT_COL = 2;
const DIR_LEFT = 'DIR_LEFT';
const DIR_RIGHT = 'DIR_RIGHT';
const DIR_DOWN = 'DIR_DOWN';
const DELTA_ALPHA = 0.02;

const ELT_GEN_WEIGHT = [18, 18, 18, 18, 12, 8, 7, 5, 4, 1, 1];
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

const NB_ELT = ALL_ELT_NAMES.length; // 11 elements

const STATE_LANDING     = 'STATE_LANDING';
const STATE_NEW_ELEM    = 'STATE_NEW_ELEM';
const STATE_IDLE        = 'STATE_IDLE';
const STATE_MOVING_LR   = 'STATE_MOVING_LR';
const STATE_MOVING_DOWN = 'STATE_MOVING_DOWN';
const STATE_ALCHEMY     = 'STATE_ALCHEMY';
const STATE_TRANSMUTATION = 'STATE_TRANSMUTATION';
const STATE_ALCHEMY_FALL  = 'STATE_ALCHEMY_FALL';

/***********************************
 *                                 *
 *              Game concept       *

state:
- new element
    * generate random element
    * generate new sprite
    * place it on screen
        -> landing
     
- landing:
    * move element until it reaches the top row
        -> idle

- idle
    * catch keyboard events
    * move element right, left 
        -> moving_lr
    * move element down
        -> moving_down

- moving left/right
    * move element left/right
        -> idle

- moving down
    * move element to the bottom of the screen
        -> alchemy

- alchemy
    * calculate elements to remove and to add
    * if new elements
        -> alchemy magic
    * no changes
        -> new element

- transmutation
    * fade out and fade in elements
        -> alchemy fall

- alchemy fall
    * move elements falling
        -> alchemy

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

    // current max element (inclusive), defaults to 2, meaning: green + yellow + red potions
    cur_max_elt: 2,

    // set to: down, up, left, right when a key is pressed, nothing else
    keypressed: '',

    // set to true when accepting key presses
    accept_key_press: false,

    // list of all movements in progress
    move_in_progress: [],

    // list of all alchemic operations in progress
    transmutation_in_progress: [],

    // board[row][col] for the elements
    board: [],

    // map of every sprite of the game
    sprites: {},
};


let assets = {
    // our PIXI application
    app: null,

    // store all the textures to use for our sprites
    textures: [],
};

/*********************************************************
 * 
 *                Utilities
 * 
 *********************************************************/


/** return a random number r: 0 <= r < top_limit */
function random_nb(top_limit)
{
    return Math.floor(Math.random()*top_limit);
}

function na3_max(v1, v2)
{
    if (v1 >= v2) return v1;
    return v2;
}

function na3_min(v1, v2)
{
    if (v1 <= v2) return v1;
    return v2;
}

/** Return the y value for a sprite in a given row.
 *  -1 means top row
 *  0 - NB_ROWS: row in the board
 */
function sprite_y_from_row(row)
{
    if (row === -1) {
        return TOP_ROW_Y;
    }

    return BOARD_Y + row * SPT_HEIGHT;
}

function sprite_x_from_col(col)
{
    return col * SPT_WIDTH;

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
    if (game.sp !== null) {
        game.sp.destroy();
    }
    for (let sp in game.sprites) {
        if (sp !== undefined) {
            sp.destroy();
        }
    }
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
        case STATE_LANDING:
        case STATE_ALCHEMY_FALL:
            handle_moving();
            return;

        case STATE_ALCHEMY:
            perform_alchemy();
            break;

        case STATE_TRANSMUTATION:
            perform_transmutation();
            break;

        default:
            console.error('default clause reached, unexpected!');
    }
}

/*******************************************************
 * 
 *                New element generation
 * 
 *******************************************************/

/** Generate a new element according to the weight */
function generate_random_elt(cur_max_elt, elt_gen_weight)
{
    let max_weigth = 0;
    // note that cur_max_elt is inclusive
    for (let i=0; i<=cur_max_elt; i++) {
        max_weigth += elt_gen_weight[i];
    }
    let random_idx = random_nb(max_weigth);
    let elt = 0;
    while (random_idx > elt_gen_weight[elt] && elt < elt_gen_weight.length) {
        random_idx -= elt_gen_weight[elt];
        elt += 1;
    }

    if (elt == elt_gen_weight.length) {
        // we went through all the array of elements and the index is still above
        // problem !!!
        throw new Error('Invalid random element: ' + random_idx.toString());
    }
    return elt;
}

// Generate a new element on the top row
function gen_new_element()
{
    game.elt = generate_random_elt(game.cur_max_elt, ELT_GEN_WEIGHT);
    game.sp = new PIXI.Sprite(assets.textures[game.elt]);
    assets.app.stage.addChild(game.sp);

    game.col = DEFAULT_COL;

    // init sprite position
    game.sp.x = sprite_x_from_col(game.col);
    game.sp.y = -SPT_HEIGHT;

    // Move(sprite, dir, dest_x, dest_y, done = null) {
    game.move_in_progress.push( new Move(
        game.sp,
        DIR_DOWN,
        game.sp.x, TOP_ROW_Y
        )
    );

    enter_state(STATE_LANDING);
}

/*********************************************************************
 * 
 *                  Board logic
 * 
 *********************************************************************/

/** return the next row available to put an element in a given column.
 * 
 * When there are 0 elements in the board, this is row 6.
 * The last position of the column to put an element is row 0
 * 
 * -1 means no more rows in this column.
 */
function column_next_row(board, col)
{
    let next_row = -1;
    for (let row=NB_ROWS-1; row>=0; row--) {
        if (board[row][col] === -1) {
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

/** Create a new move:
 * sprite: the sprite object to move
 * dir: 'down', 'left', 'right'
 * dest_x, dest_y: coordinates of the destination
 * done: function to call when the move is finished
 */
function Move(sprite, dir, dest_x, dest_y, done = null) {
    this.sp = sprite;
    this.dir = dir;
    this.dest_x = dest_x;
    this.dest_y = dest_y;
    this.done = done;
}


function handle_moving()
{
    let move_to_remove = [];

    for (let i=0; i<game.move_in_progress.length; i++) {
        let move = game.move_in_progress[i];

        let goal_reached = false;

        switch (move.dir) {
            case DIR_DOWN:
                if ((move.dest_y - move.sp.y) > 0) {
                    move.sp.y = na3_min(move.sp.y + DELTA_MOVE_Y, move.dest_y);
                    if ((move.dest_y - move.sp.y) === 0) {
                        // we have reach our goal on the x axis
                        goal_reached = true;
                    }
                }
                break;

            case DIR_LEFT:
                if ((move.dest_x - move.sp.x) < 0) {
                    move.sp.x = na3_max(move.sp.x - DELTA_MOVE_X, move.dest_x);
                    if ((move.dest_x - move.sp.x) === 0) {
                        // we have reach our goal on the x axis
                        goal_reached = true;
                    }
                }
                break;

            case DIR_RIGHT:
                if ((move.dest_x - move.sp.x) > 0) {
                    move.sp.x = na3_min(move.sp.x + DELTA_MOVE_X, move.dest_x);
                    if ((move.dest_x - move.sp.x) === 0) {
                        // we have reach our goal on the x axis
                        goal_reached = true;
                    }
                }
                break;

            default:
                console.error('Unexpected state: ', move.dir);
        }

        if (goal_reached === false) {
            // continue moving other objects
            continue;
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
        switch (game.state) {
            case STATE_MOVING_DOWN:
            case STATE_ALCHEMY_FALL:
                enter_state(STATE_ALCHEMY);
                break;

            case STATE_MOVING_LR:
            case STATE_LANDING:
                enter_state(STATE_IDLE);
                break;

            default:
                console.error('Should not be reached...');
        }
    }

}

/*********************************************************************
 * 
 *                  Alchemy
 * 
 *********************************************************************/

/** A transmutation
 * - new_elem_row: row of the new element generated
 * - new_elem_col: column of the new element generated
 * - new_elem_val: value of the new element generated
 * - new_elem_sprite: sprite representing the new element
 * - old_elem_pos: list of (row,col) of old elements
 * - old_elem_sprites: list of sprites representing the old elements
 */
function Transmutation(new_elem_row, new_elem_col, new_elem_val, old_elem_pos)
{
    this.new_elem_row = new_elem_row;
    this.new_elem_col = new_elem_col;
    this.new_elem_val = new_elem_val;
    this.new_elem_sprite = null;
    this.new_elem_alpha = 0;

    this.old_elem_pos = old_elem_pos;
    this.old_elem_sprites = [];
}


function perform_alchemy()
{
    // analyse board for alchemic operations
    let transmutations_desc = na3_shared_utils.calc_transmutations(game.board, NB_ELT);

    game.transmutation_in_progress = [];

    // if no operations, generate new element
    if (transmutations_desc.length === 0) {
        enter_state(STATE_NEW_ELEM);
        return;
    }

    transmutations_desc.forEach((trans_desc) => {
        let trans = new Transmutation(
            trans_desc[1][0],
            trans_desc[1][1],
            trans_desc[1][2],
            trans_desc[0]
        );

        // remove the old sprites from the sprite map
        trans.old_elem_pos.forEach((pos) => {
            trans.old_elem_sprites.push(game.sprites[ pos ]);
            delete game.sprites[ pos ];
        });

        // create the new sprite
        trans.new_elem_sprite = new PIXI.Sprite(assets.textures[trans.new_elem_val]);
        trans.new_elem_sprite.alpha = 0;
        assets.app.stage.addChild(trans.new_elem_sprite);
        trans.new_elem_sprite.y = sprite_y_from_row(trans.new_elem_row);
        trans.new_elem_sprite.x = sprite_x_from_col(trans.new_elem_col);
        game.sprites[ [trans.new_elem_row, trans.new_elem_col] ] = trans.new_elem_sprite;

        game.transmutation_in_progress.push(trans);

        game.cur_max_elt = na3_max(game.cur_max_elt, trans.new_elem_val);
    });

    game.board = na3_shared_utils.apply_transmutations(game.board, transmutations_desc);
    enter_state(STATE_TRANSMUTATION);
}

function perform_transmutation()
{
    let trans_to_remove = [];
    game.transmutation_in_progress.forEach((trans, i) => {

        // transmutation is done ?
        if (trans.new_elem_alpha === 1) {
            for (let old_sp of trans.old_elem_sprites) {
                old_sp.destroy();
            }

            trans.old_elem_sprites = [];
            trans_to_remove.push(i);
        } 
        else {
            // transmutation in progress
            trans.new_elem_alpha = na3_min(trans.new_elem_alpha + DELTA_ALPHA, 1);
            for (let old_sp of trans.old_elem_sprites) {
                old_sp.alpha = 1 - trans.new_elem_alpha;
            }
            trans.new_elem_sprite.alpha = trans.new_elem_alpha;
        }
    });

    if (trans_to_remove.length === game.transmutation_in_progress.length) {
        // we are really done with transmutation
        game.transmutation_in_progress = [];
        start_alchemy_fall();
    }
}

function start_alchemy_fall()
{
    enter_state(STATE_ALCHEMY_FALL);
    // identify holes in the map
    let falls = na3_shared_utils.detect_falls(game.board);
    falls.forEach((fall) => {
        let [row, col, target_row] = fall;
        let sp = game.sprites[ [row, col] ];

        // register move
        game.move_in_progress.push( new Move(
            sp, 
            DIR_DOWN,
            sp.x, sprite_y_from_row(target_row)
            )
        );

        // update our map of sprite positions
        delete game.sprites[ [row,col] ];
        game.sprites[ [target_row, col] ] = sp;

        // update the board
        // note: because falls are recorded from bottom to top
        //       the overlapping of new positiosn is correctly handled
        game.board[target_row][col] = game.board[row][col];
        game.board[row][col] = -1;
    });
}


/*********************************************************************
 * 
 *                  Keyboard Events
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
            k = DIR_DOWN;
            break;
        /*  Arrow up not handled right now
        case 'ArrowUp':
        case 'Up':
            k = 'up';
            break;
        */
        case 'ArrowLeft':
        case 'Left':
            k = DIR_LEFT;
            break;
        case 'ArrowRight':
        case 'Right':
            k = DIR_RIGHT;
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

    if (game.keypressed === DIR_DOWN) {
        handle_arrow_down();
        return;
    }

    handle_arrow_left_right();
}


function handle_arrow_left_right()
{
    let dir_dict = {    // row, col
        DIR_LEFT:    -1,
        DIR_RIGHT:    1,
    };

    let dir = game.keypressed;
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
        dir,
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
    let target_row = column_next_row(game.board, game.col);
    if (target_row == -1) {
        // we have lost !
        done = () => {
            alert('you lose!');
            na3_end();
        };
    } else {
        game.board[target_row][game.col] = game.elt;
        game.sprites[ [target_row, game.col] ] = game.sp;
    }


    game.move_in_progress.push( new Move(
        game.sp, 
        DIR_DOWN,
        game.sp.x, sprite_y_from_row(target_row),
        done
        )
    );

    // we n o longer need our main sprite
    game.sp = null;
    
    enter_state(STATE_MOVING_DOWN);
}
