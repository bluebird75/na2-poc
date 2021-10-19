import * as PIXI from './pixi.mjs';
import * as na3 from './na3_shared_utils.js';
const PLAY_WIDTH = 300;
const PLAY_HEIGHT = 356;
const SPT_WIDTH = 30;
const SPT_HEIGHT = 30;
const TOP_ROW_Y = 120 - 2.5 * SPT_HEIGHT;
const BOARD_Y = 118;
const NEXT_ELT_Y = BOARD_Y + SPT_HEIGHT * 1.2;
const NEXT_ELT_X1 = SPT_WIDTH * 7;
const NEXT_ELT_X2 = SPT_WIDTH * 8;
const NB_ROWS = 7;
const TOP_ROW = NB_ROWS - 1;
const NB_COLS = 6;
const DELTA_MOVE_X = 3;
const DELTA_MOVE_Y = 5;
const DEFAULT_COL = 2;
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
var GameStates;
(function (GameStates) {
    GameStates["STATE_LANDING"] = "STATE_LANDING";
    GameStates["STATE_NEW_ELEM"] = "STATE_NEW_ELEM";
    GameStates["STATE_IDLE"] = "STATE_IDLE";
    GameStates["STATE_MOVING_LR"] = "STATE_MOVING_LR";
    GameStates["STATE_ROTATING"] = "STATE_ROTATING";
    GameStates["STATE_MOVING_DOWN"] = "STATE_MOVING_DOWN";
    GameStates["STATE_ALCHEMY"] = "STATE_ALCHEMY";
    GameStates["STATE_TRANSMUTATION"] = "STATE_TRANSMUTATION";
    GameStates["STATE_ALCHEMY_FALL"] = "STATE_ALCHEMY_FALL";
    GameStates["STATE_UNITIALIZED"] = "STATE_UNITIALIZED";
})(GameStates || (GameStates = {}));
var Direction;
(function (Direction) {
    Direction["LEFT"] = "LEFT";
    Direction["RIGHT"] = "RIGHT";
    Direction["DOWN"] = "DOWN";
    Direction["UP"] = "UP";
})(Direction || (Direction = {}));
/***********************************
 *                                 *
 *              Game concept       *

state:
- new element
    * put the next element into the current element
    * generate random element + new sprite for the next element and display it
    * place it on screen
        -> landing
     
- landing:
    * move element until it reaches the top row
        -> idle

- idle
    * catch keyboard events
    * if move element right, left
        -> moving_lr
    * if move element down
        -> moving_down
    * if rotating
        -> rotating

- moving left/right
    * move element left/right
        -> idle

- moving down
    * move element to the bottom of the screen
        -> alchemy

- rotating
    * rotate the element to a new position
        -> idle

- alchemy
    * calculate elements to remove and to add
    * if new elements
        -> transmutation
    * no changes
        -> check if player lost
        -> new element

- transmutation
    * fade out and fade in elements
        -> alchemy fall

- alchemy fall
    * move elements falling
        -> alchemy

************************************/
class GameClass {
    constructor() {
        this.state = GameStates.STATE_UNITIALIZED;
        this.cur_max_elt = 2;
        this.keypressed = [];
        this.accept_key_press = false;
        this.move_in_progress = [];
        this.transmutation_in_progress = [];
        this.base_col = 2;
        // where the sprites are actually located vs the base position    
        this.row_delta1 = 0;
        this.col_delta1 = 0;
        this.row_delta2 = 0;
        this.col_delta2 = 0;
        // our current element index pair
        this.elt1 = -1;
        this.elt2 = -1;
        // our next element index pair
        this.next_elt1 = -1;
        this.next_elt2 = -1;
        this.board = [];
        for (let i = 0; i < NB_ROWS + 2; i++) {
            this.board.push([-1, -1, -1, -1, -1, -1]);
        }
        this.sprites = new Map();
        this.app = null;
        this.textures = [];
    }
}
let game;
/*********************************************************
 *
 *                Utilities
 *
 *********************************************************/
/** return a random number r: 0 <= r < top_limit */
function random_nb(top_limit) {
    return Math.floor(Math.random() * top_limit);
}
function na3_max(v1, v2) {
    if (v1 >= v2)
        return v1;
    return v2;
}
function na3_min(v1, v2) {
    if (v1 <= v2)
        return v1;
    return v2;
}
/** Return the y value for a sprite in a given row.
 *  0 - TOP_ROW+2: row in the board
 */
function sprite_y_from_row(row) {
    return BOARD_Y + (TOP_ROW - row) * SPT_HEIGHT;
}
function sprite_x_from_col(col) {
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
    game = new GameClass();
    game.app = new PIXI.Application({ width: PLAY_WIDTH, height: PLAY_HEIGHT });
    let placeholder = document.getElementById("na3-implem-host");
    if (placeholder === null) {
        throw new Error('Could not locate PIXI placeholder');
    }
    placeholder.appendChild(game.app.view);
    placeholder.setAttribute('tabindex', '0');
    placeholder.onkeydown = (e) => na3_onkeydown(e);
    placeholder.focus();
    // our background
    let bg = PIXI.Sprite.from('na3-assets/bg_clipped.png');
    bg.width = PLAY_WIDTH;
    bg.height = PLAY_HEIGHT;
    game.app.stage.addChild(bg);
    // the textures for all our sprites
    ALL_ELT_NAMES.forEach((e) => {
        game.textures.push(PIXI.Texture.from(e));
    });
    generate_next_element_pair();
    enter_state(GameStates.STATE_NEW_ELEM);
    game.app.ticker.add(game_loop);
}
/** Close the loop, unload all textures */
export function na3_end() {
    console.log('The end already ?');
    for (let item of game.sprites) {
        let sp = item[1];
        if (sp !== undefined && sp !== null) {
            sp.destroy();
        }
    }
    game.textures.forEach((t) => { t.destroy(); });
    if (game.app) {
        game.app.destroy();
    }
    game.state = GameStates.STATE_UNITIALIZED;
}
/*******************************************************
 *
 *                Game logic
 *
 *******************************************************/
/* Switch the state of the game */
function enter_state(state) {
    console.log('Entering state ', state);
    game.state = state;
    switch (state) {
        case GameStates.STATE_IDLE:
        case GameStates.STATE_LANDING:
        case GameStates.STATE_MOVING_LR:
        case GameStates.STATE_ROTATING:
            game.accept_key_press = true;
            break;
        default:
            game.keypressed = [];
            game.accept_key_press = false;
            break;
    }
}
function game_loop() {
    switch (game.state) {
        case GameStates.STATE_NEW_ELEM:
            land_new_element_pair();
            return;
        case GameStates.STATE_IDLE:
            handle_game_key();
            return;
        case GameStates.STATE_MOVING_LR:
        case GameStates.STATE_ROTATING:
        case GameStates.STATE_MOVING_DOWN:
        case GameStates.STATE_LANDING:
        case GameStates.STATE_ALCHEMY_FALL:
            handle_moving();
            return;
        case GameStates.STATE_ALCHEMY:
            perform_alchemy();
            break;
        case GameStates.STATE_TRANSMUTATION:
            perform_transmutation();
            break;
        default:
            throw new Error('default clause reached, unexpected!');
    }
}
/*******************************************************
 *
 *                New element generation
 *
 *******************************************************/
/** Generate a new element according to the weight */
function generate_random_elt(cur_max_elt, elt_gen_weight) {
    let max_weigth = 0;
    // note that cur_max_elt is inclusive
    for (let i = 0; i <= cur_max_elt; i++) {
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
// Generate next element sprite
function generate_next_element_pair() {
    game.next_elt1 = generate_random_elt(game.cur_max_elt, ELT_GEN_WEIGHT);
    game.next_elt2 = generate_random_elt(game.cur_max_elt, ELT_GEN_WEIGHT);
    game.sprites.set('next1', new PIXI.Sprite(game.textures[game.next_elt1]));
    game.sprites.set('next2', new PIXI.Sprite(game.textures[game.next_elt2]));
    if (game.app === null
        || game.sprites.get('next1') === undefined
        || game.sprites.get('next2') === undefined) {
        throw new Error('Should not happen!');
    }
    game.app.stage.addChild(game.sprites.get('next1'));
    game.app.stage.addChild(game.sprites.get('next2'));
    game.sprites.get('next1').x = NEXT_ELT_X1;
    game.sprites.get('next2').x = NEXT_ELT_X2;
    game.sprites.get('next1').y = NEXT_ELT_Y;
    game.sprites.get('next2').y = NEXT_ELT_Y;
}
// Place a new element on the landing row and generate next element
function land_new_element_pair() {
    game.sprites.set('current1', game.sprites.get('next1'));
    game.sprites.set('current2', game.sprites.get('next2'));
    game.elt1 = game.next_elt1;
    game.elt2 = game.next_elt2;
    generate_next_element_pair();
    game.base_col = DEFAULT_COL;
    game.col_delta1 = 0;
    game.col_delta2 = 1;
    game.row_delta1 = 0;
    game.row_delta2 = 0;
    // init sprite position
    game.sprites.get('current1').x = sprite_x_from_col(game.base_col + game.col_delta1);
    game.sprites.get('current2').x = sprite_x_from_col(game.base_col + game.col_delta2);
    game.sprites.get('current1').y = -SPT_HEIGHT;
    game.sprites.get('current2').y = -SPT_HEIGHT;
    // Move(sprite, dir, dest_x, dest_y, done = null) {
    game.move_in_progress.push([
        new Move(game.sprites.get('current1'), game.sprites.get('current1').x, TOP_ROW_Y),
        new Move(game.sprites.get('current2'), game.sprites.get('current2').x, TOP_ROW_Y)
    ]);
    enter_state(GameStates.STATE_LANDING);
}
/*********************************************************************
 *
 *                  Board logic
 *
 *********************************************************************/
/** return the next row available to put an element in a given column.
 *
 * When there are 0 elements in the board, this is row 0.
 * The last position of the column to put an element is row TOP_ROW+2
 * Returning -1 means there is no room left in the column at all
 *
 */
function column_next_row(board, col) {
    for (let row = 0; row < TOP_ROW + 3; row++) {
        if (board[row][col] === -1) {
            return row;
        }
    }
    return -1;
}
/*********************************************************************
 *
 *                  Movement
 *
 *********************************************************************/
/** Create a new move:
 * sprite: the sprite object to move
 * dest_x, dest_y: coordinates of the destination
 */
class Move {
    constructor(sprite, dest_x, dest_y) {
        this.sp = sprite;
        this.pos_it = generate_translation_move(sprite.x, sprite.y, dest_x, dest_y);
    }
}
/** Generator for moving from (x,y) to (dest_x, dest_y).
 *
 * On each iteration, returns a (x,y) pair adjusted by a delta of (DELTA_X, DELTA_Y)
 */
function* generate_translation_move(x, y, dest_x, dest_y) {
    let dir_x = x < dest_x ? 1 : -1;
    let dir_y = y < dest_y ? 1 : -1;
    while (x !== dest_x || y !== dest_y) {
        // We use the dir value to handle in one block the case where dest_x > x and dest_x < x
        if (x * dir_x < dest_x * dir_x) {
            x += DELTA_MOVE_X * dir_x;
            x = dir_x * na3_min(dir_x * x, dir_x * dest_x);
        }
        if (y * dir_y < dest_y * dir_y) {
            y += DELTA_MOVE_Y * dir_y;
            y = dir_y * na3_min(dir_y * y, dir_y * dest_y);
        }
        yield [x, y];
    }
    return;
}
function handle_moving() {
    let move_group_to_remove = [];
    for (let i = 0; i < game.move_in_progress.length; i++) {
        let move_group = game.move_in_progress[i];
        let group_goal_reached = 0;
        for (let j = 0; j < move_group.length; j++) {
            let move = move_group[j];
            let next_pos_it = move.pos_it.next();
            if (next_pos_it.done) {
                group_goal_reached += 1;
            }
            else {
                // unpack x, y from the iterator
                [move.sp.x, move.sp.y] = next_pos_it.value;
            }
        }
        // check all the objects of the group have reached their destination
        if (group_goal_reached === move_group.length) {
            // we have reached our destination for the group, register this move group for deletion
            move_group_to_remove.push(i);
        }
    }
    // we must remove the indices in backward order, to avoid them
    // changing in the middle
    for (let i = move_group_to_remove.length - 1; i >= 0; i--) {
        game.move_in_progress.splice(move_group_to_remove[i], 1);
    }
    // if all moves are completed, we can begin our next step
    if (game.move_in_progress.length === 0) {
        switch (game.state) {
            case GameStates.STATE_MOVING_DOWN:
            case GameStates.STATE_ALCHEMY_FALL:
                enter_state(GameStates.STATE_ALCHEMY);
                break;
            case GameStates.STATE_MOVING_LR:
            case GameStates.STATE_LANDING:
            case GameStates.STATE_ROTATING:
                enter_state(GameStates.STATE_IDLE);
                break;
            default:
                throw new Error('should not be reached');
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
class Transmutation {
    constructor(new_elem_row, new_elem_col, new_elem_val, old_elem_pos_list) {
        this.new_elem_row = new_elem_row;
        this.new_elem_col = new_elem_col;
        this.new_elem_val = new_elem_val;
        this.new_elem_sprite = null;
        this.new_elem_alpha = 0;
        this.old_elem_pos_list = old_elem_pos_list;
        this.old_elem_sprites = [];
    }
}
// return true if the array contains any other value than value itself
function contains_other_than(array, value) {
    for (let v of array) {
        if (v !== value) {
            return true;
        }
    }
    return false;
}
function perform_alchemy() {
    // analyse board for alchemic operations
    let transmutations_desc_list = na3.calc_transmutations(game.board, NB_ELT);
    game.transmutation_in_progress = [];
    // if no operations, generate new element
    if (transmutations_desc_list.length === 0) {
        // all transumtations done, check if lost ?
        if (contains_other_than(game.board[TOP_ROW + 2], -1)
            || contains_other_than(game.board[TOP_ROW + 1], -1)) {
            alert('You lost!');
            na3_end();
            return;
        }
        enter_state(GameStates.STATE_NEW_ELEM);
        return;
    }
    transmutations_desc_list.forEach((trans_desc) => {
        let trans = new Transmutation(trans_desc[1][0], trans_desc[1][1], trans_desc[1][2], trans_desc[0]);
        // remove the old sprites from the sprite map
        trans.old_elem_pos_list.forEach((pos) => {
            trans.old_elem_sprites.push(game.sprites.get(pos.toString()));
            game.sprites.delete(pos.toString());
        });
        // create the new sprite
        trans.new_elem_sprite = new PIXI.Sprite(game.textures[trans.new_elem_val]);
        trans.new_elem_sprite.alpha = 0;
        if (game.app === null) {
            throw new Error('Should not happen');
        }
        game.app.stage.addChild(trans.new_elem_sprite);
        trans.new_elem_sprite.y = sprite_y_from_row(trans.new_elem_row);
        trans.new_elem_sprite.x = sprite_x_from_col(trans.new_elem_col);
        game.sprites.set([trans.new_elem_row, trans.new_elem_col].toString(), trans.new_elem_sprite);
        game.transmutation_in_progress.push(trans);
        let new_max_elt = na3_max(game.cur_max_elt, trans.new_elem_val);
        if (new_max_elt > game.cur_max_elt) {
            new_element_discovered(new_max_elt);
        }
        game.cur_max_elt = new_max_elt;
    });
    game.board = na3.apply_transmutations(game.board, transmutations_desc_list);
    enter_state(GameStates.STATE_TRANSMUTATION);
}
function perform_transmutation() {
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
// Update the HTML to display the new element in the transmutation chain
function new_element_discovered(new_max_elt) {
    let elt_id_target = `#ch_${new_max_elt}`;
    let html_elt = document.querySelector(elt_id_target);
    if (html_elt === null) {
        console.error('Could not find new element:' + elt_id_target);
        return;
    }
    html_elt.src = ALL_ELT_NAMES[new_max_elt];
}
function start_alchemy_fall() {
    enter_state(GameStates.STATE_ALCHEMY_FALL);
    // identify holes in the map
    let falls = na3.detect_falls(game.board);
    falls.forEach((fall) => {
        let [row, col, target_row] = fall;
        let sp = game.sprites.get([row, col].toString());
        // register move
        game.move_in_progress.push([
            new Move(sp, sp.x, sprite_y_from_row(target_row))
        ]);
        // update our map of sprite positions
        game.sprites.delete([row, col].toString());
        game.sprites.set([target_row, col].toString(), sp);
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
function na3_onkeydown(e) {
    let k;
    switch (e.key) {
        case 'ArrowDown':
        case 'Down':
            k = Direction.DOWN;
            break;
        case 'ArrowUp':
        case 'Up':
            k = Direction.UP;
            break;
        case 'ArrowLeft':
        case 'Left':
            k = Direction.LEFT;
            break;
        case 'ArrowRight':
        case 'Right':
            k = Direction.RIGHT;
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
    if (game.accept_key_press) {
        game.keypressed.push(k);
        console.log('Registering keypress: ' + k);
    }
}
/** Called during state idle to handle the key pressed by the user: left, right, down */
function handle_game_key() {
    if (game.keypressed.length === 0) {
        return;
    }
    let k = game.keypressed.pop();
    switch (k) {
        case Direction.DOWN:
            handle_arrow_down();
            return;
        case Direction.UP:
            handle_arrow_up();
            return;
        case Direction.LEFT:
        case Direction.RIGHT:
            handle_arrow_left_right(k);
            return;
        default:
            throw new Error(`Invalid key pressed: ${k}`);
    }
}
function handle_arrow_left_right(k) {
    let dir_dict = new Map([
        [Direction.LEFT, -1],
        [Direction.RIGHT, 1],
    ]);
    let dir_col = dir_dict.get(k);
    if (dir_col === undefined) {
        throw new Error('Unknown key pressed: ' + k);
    }
    // check if move is possible
    let new_col1 = game.base_col + game.col_delta1 + dir_col;
    let new_col2 = game.base_col + game.col_delta2 + dir_col;
    if ((new_col1 >= NB_COLS)
        || (new_col2 >= NB_COLS)
        || (new_col1 < 0)
        || (new_col2 < 0)) {
        // ignore the move
        return;
    }
    game.move_in_progress.push([
        new Move(game.sprites.get('current1'), game.sprites.get('current1').x + dir_col * SPT_WIDTH, game.sprites.get('current1').y),
        new Move(game.sprites.get('current2'), game.sprites.get('current2').x + dir_col * SPT_WIDTH, game.sprites.get('current2').y)
    ]);
    game.base_col += dir_col;
    enter_state(GameStates.STATE_MOVING_LR);
}
function handle_arrow_down() {
    let col1 = game.base_col + game.col_delta1, col2 = game.base_col + game.col_delta2;
    let target_row1 = column_next_row(game.board, col1);
    let target_row2 = column_next_row(game.board, col2);
    // one element above the other
    if (col1 === col2) {
        // both elemnts are on the same column, so target_row is identical
        // this needs to be adjusted
        if (game.row_delta2 > game.row_delta1) {
            target_row2 += 1;
        }
        else {
            target_row1 += 1;
        }
    }
    if (target_row1 == -1 || target_row2 == -1) {
        na3_end();
        throw new Error(`Invalid row destionation: ${target_row1} and ${target_row2}`);
    }
    else {
        game.board[target_row1][col1] = game.elt1;
        game.board[target_row2][col2] = game.elt2;
        game.sprites.set([target_row1, col1].toString(), game.sprites.get('current1'));
        game.sprites.set([target_row2, col2].toString(), game.sprites.get('current2'));
    }
    game.move_in_progress.push([
        new Move(game.sprites.get('current1'), game.sprites.get('current1').x, sprite_y_from_row(target_row1)),
        new Move(game.sprites.get('current2'), game.sprites.get('current2').x, sprite_y_from_row(target_row2))
    ]);
    enter_state(GameStates.STATE_MOVING_DOWN);
}
/** Rotate the top row element pair.
 *
 * Input:
 * - row_delta: 0 or 1
 * - col_delta: 0 or 1
 *
 * Returns a list of :
 * - new_row_delta: 0 or 1
 * - new_col_delta: 0 or 1
 */
function rotate_elt(row_delta, col_delta) {
    let new_row, new_col;
    switch ([row_delta, col_delta].toString()) {
        case [0, 0].toString():
            new_row = 1;
            new_col = 0;
            break;
        case [1, 0].toString():
            new_row = 1;
            new_col = 1;
            break;
        case [1, 1].toString():
            new_row = 0;
            new_col = 1;
            break;
        case [0, 1].toString():
            new_row = 0;
            new_col = 0;
            break;
        default:
            throw new Error('Invalid rotation input: ' + [row_delta, col_delta].toString());
    }
    return [new_row, new_col];
}
function handle_arrow_up() {
    let new_row_delta1, new_col_delta1, new_row_delta2, new_col_delta2;
    [new_row_delta1, new_col_delta1] = rotate_elt(game.row_delta1, game.col_delta1);
    [new_row_delta2, new_col_delta2] = rotate_elt(game.row_delta2, game.col_delta2);
    let delta_base_col = 0;
    if (game.base_col === -1) {
        // if we went too far on the left, we need to move the base to
        // display the sprites within the board
        delta_base_col = 1;
    }
    if (game.base_col === NB_COLS - 1) {
        // if we went too far on the right, we need to move the base to
        // dispaly the sprites within the board
        delta_base_col = -1;
    }
    game.move_in_progress.push([
        new Move(game.sprites.get('current1'), game.sprites.get('current1').x + (new_col_delta1 - game.col_delta1 + delta_base_col) * SPT_WIDTH, game.sprites.get('current1').y - (new_row_delta1 - game.row_delta1) * SPT_HEIGHT),
        new Move(game.sprites.get('current2'), game.sprites.get('current2').x + (new_col_delta2 - game.col_delta2 + delta_base_col) * SPT_WIDTH, game.sprites.get('current2').y - (new_row_delta2 - game.row_delta2) * SPT_HEIGHT)
    ]);
    // update Game information
    [game.row_delta1, game.col_delta1] = [new_row_delta1, new_col_delta1];
    [game.row_delta2, game.col_delta2] = [new_row_delta2, new_col_delta2];
    game.base_col += delta_base_col;
    enter_state(GameStates.STATE_ROTATING);
}
//# sourceMappingURL=na3-implem.js.map