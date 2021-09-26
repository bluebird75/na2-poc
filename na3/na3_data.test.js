'use strict';
let na3_data = require('./na3_test_data.js');


/** Transform the input of a multi-line string containing the two boards
 *  in ascii to two sets of board as double-arrays.
 * 
 * Returns: [ [title, [board_input, board_expected]], ...]
 */
function extract_input_output_boards(string_board)
{
    console.log(string_board);
    let boards_to_test = [];
    let idx = 0;
    while (idx < string_board.length) {
        let title = string_board[idx++];
        let two_boards_desc = string_board[idx++];
        let two_boards = extract_two_boards_from_string(two_boards_desc);
        boards_to_test.push([title, two_boards[0], two_boards[1]]);
    }

    return boards_to_test;
}

const ELT_TAB = 'abcdefghijk';

/** Returns two boards from a multi-line string board

Example:
`
......    ......
......    ......
......    ......
......    ......
......    ......
......    ......
..aaa.    ..b...

`

=> 
[
    [
        [-1, -1, -1, -1, -1, -1],
        ... (repeated 5 times)
        [-1, -1, 0, 0, -1, -1],
    ],
    [
        [-1, -1, -1, -1, -1, -1],
        ... (repeated 5 times)
        [-1, -1, 1, -1, -1, -1],
    ],
]
*/
function extract_two_boards_from_string(two_boards_desc)
{
    let board1 = [], board2 = [];
    console.log(two_boards_desc);
    let lines = two_boards_desc.split('\n');
    console.log(lines);
    for (let i=0; i<lines.length; i++) {
        let l = lines[i].replace(' ', '');

        // skip empty lines
        if (l.length === 0) {
            continue;
        }

        console.log('l="' + l + '": ' + l.length.toString());
        let parts = l.split(/\s+/);
        console.log('parts=', parts);
        let b1_line = parts[0];
        let b2_line = parts[1];

        let b1_board_line = Array.from(b1_line, (c) => ELT_TAB.indexOf(c));
        let b2_board_line = Array.from(b2_line, (c) => ELT_TAB.indexOf(c));

        board1.push(b1_board_line);
        board2.push(b2_board_line);
    }

    return [board1, board2];
}

    
test('Can read input board', () => {
  expect(extract_input_output_boards(na3_data.slice(0,2))).toStrictEqual([
        ['1 combination - 1 element - 1', 
                [
                    [-1, -1, -1, -1, -1, -1],
                    [-1, -1, -1, -1, -1, -1],
                    [-1, -1, -1, -1, -1, -1],
                    [-1, -1, -1, -1, -1, -1],
                    [-1, -1, -1, -1, -1, -1],
                    [-1, -1, -1, -1, -1, -1],
                    [-1, -1, -1, -1, -1, -1],
                ],[
                    [-1, -1, -1, -1, -1, -1],
                    [-1, -1, -1, -1, -1, -1],
                    [-1, -1, -1, -1, -1, -1],
                    [-1, -1, -1, -1, -1, -1],
                    [-1, -1, -1, -1, -1, -1],
                    [-1, -1, -1, -1, -1, -1],
                    [-1, -1, -1, -1, -1, -1],
                ]
        ]
    ]);
  expect(extract_input_output_boards(na3_data.slice(2,4))).toStrictEqual([
        ['1 combination - 1 element - 2',
                [
                    [-1, -1, -1, -1, -1, -1],
                    [-1, -1, -1, -1, -1, -1],
                    [-1, -1, -1, -1, -1, -1],
                    [-1, -1, -1, -1, -1, -1],
                    [-1, -1, -1, -1, -1, -1],
                    [-1, -1, -1, -1, -1, -1],
                    [-1, -1,  0, -1, -1, -1],
                ],[
                    [-1, -1, -1, -1, -1, -1],
                    [-1, -1, -1, -1, -1, -1],
                    [-1, -1, -1, -1, -1, -1],
                    [-1, -1, -1, -1, -1, -1],
                    [-1, -1, -1, -1, -1, -1],
                    [-1, -1, -1, -1, -1, -1],
                    [-1, -1,  0, -1, -1, -1],
                ]
        ]
    ]);
});