na3_data = require('./na3_test_data.js');

/** Transform the input of a multi-line string containing the two boards
 *  in ascii to two sets of board as double-arrays.
 * 
 * Returns: [board_input, board_expected]
 */
function extract_input_output_boards(string_board)
{

}
	
test('Can read input board', () => {
  expect(extract_input_output_boards(na3_data)).toBe(33);
});