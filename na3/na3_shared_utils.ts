/** The implementation in this file is shared between backend and frontend
 * - backend: node, to run the unit-tests, to prevent cheating
 * - browser: to play
 */

export type RowCol = [number, number];
export type Board = number[][];

/** In a list of [row, col], find the lowest, left-est position.
 * 
 * Used to find the new element position in a transmutation
 */
export function find_new_elt_position(cluster: RowCol[]): RowCol
{
    let copy_cluster = cluster.slice();
    copy_cluster.sort((a, b) => {
        if (a[0] > b[0]) return 1;     // visually lowest board row first
        if (a[0] < b[0]) return -1;      
        // both rows are equals
        if (a[1] < b[1]) return -1;     // left-est col
        if (a[1] > b[1]) return 1;
        return 0;
    });
    return copy_cluster[0];
}

/** Analyse the board and returns the list of transmutation on this board
 *
 * A transmutation is: [ old_elements, new_element ]
 * - old_elements is a list of [row, col]
 * - new_element  is [row, col, element_value]
 */
export type TransmutationDesc = [RowCol[], [number, number, number]];

export function calc_transmutations(input: Board, nb_elt: number): TransmutationDesc[]
{
    let transmutations: TransmutationDesc[] = [];

    // flood algorithm
    let clusters: RowCol[][] = [];
    let in_cluster: string[]  = [];

    for (let row = 0; row < input.length; row++) {
        for (let col = 0; col < input[row].length; col++) {
            // find next cluster start, not visited
            if (in_cluster.indexOf([row, col].toString()) !== -1) { continue; }

            // we have found an element not already in a cluster
            let elt = input[row][col];

            // we build clusters only for non empty cells
            if (elt === -1) { continue; }

            // start our new cluster
            let cluster_idx = clusters.length;
            clusters.push([]);

            // our exporation stack
            let to_process: RowCol[] = [[row, col]];
            let visited: string[] = [];

            // explore
            while (to_process.length) {
                let pos: RowCol | undefined = to_process.pop();
                if (pos === undefined) {
                    // should not happen because length would be 0
                    throw new Error('Should not happen!');
                }

                if (visited.indexOf(pos.toString()) !== -1) { continue; }
                visited.push(pos.toString());

                let [r, c] = pos;

                // check if this is the same element
                if (input[r][c] !== elt) { continue; }

                // add to our cluster
                clusters[cluster_idx].push(pos);
                in_cluster.push(pos.toString());

                // add all neighbour to visit
                if (r > 0)
                    to_process.push([r - 1, c]);
                if (r + 1 < input.length)
                    to_process.push([r + 1, c]);
                if (c > 0)
                    to_process.push([r, c - 1]);
                if (c + 1 < input[row].length)
                    to_process.push([r, c + 1]);
            }
        }
    }

    // find all clusters with more than 3 elements
    clusters.forEach(cluster => {
        if (cluster.length < 3)
            return;

        let pos = cluster[0];
        let elt = input[pos[0]][pos[1]];

        if (elt < 0 || elt + 1 >= nb_elt)
            return;

        let pos_new_elt = find_new_elt_position(cluster);

        transmutations.push([
            cluster, [pos_new_elt[0], pos_new_elt[1], elt + 1]
        ]);
    });

    // console.log('generated transmutations:', transmutations);
    return transmutations;
}


/** Apply a given a list of transmutation to a board and return the updated board */
export function apply_transmutations(input: Board, transmutations: TransmutationDesc[]): Board
{
    // console.log(input, transmutations);
    let output = Array.from(input, (line) => line.slice());
    transmutations.forEach((trans) => {
        let [old_elt, new_elt] = trans;
        old_elt.forEach((pos) => { output[pos[0]][pos[1]] = -1; });
        output[new_elt[0]][new_elt[1]] = new_elt[2];
    });
    return output;    
}


/** Analyse a board, detect holes and return which piece shall fall.
 * 
 * Return: list of [src_row, src_col, dest_row] 
 */
export function detect_falls(board: Board): [number, number, number][]
{
    let falls: [number, number, number][] = [];
    for (let col=0; col<board[0].length; col++) {
        let col_holes = 0;
        for (let row=0; row<board.length; row++) {
            if (board[row][col] === -1) {
                col_holes += 1;
            } else {
                if (col_holes > 0) {
                    falls.push([row, col, row-col_holes]);
                }
            }
        }
    }
    return falls;
}