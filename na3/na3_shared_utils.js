/** The implementation in this file is shared between backend and frontend
 * - backend: node, to run the unit-tests, to prevent cheating
 * - browser: to play
 */

 // The number of elements which can transform into superior elements
 const MAX_ELT = 11;

/** In a list of [row, col], find the lowest, left-est position */
function find_new_elt_position(cluster)
{
    let copy_cluster = cluster.slice();
    copy_cluster.sort((a, b) => {
        if (a[0] > b[0]) return -1;     // visually lowest board row first
        if (a[0] < b[0]) return 1;      
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
 * - new_element  is [row, col, element]
 */
function calc_transmutations(input) {
    let transmutations = [];

    // flood algorithm
    let clusters = [];
    let in_cluster = [];

    for (let row = 0; row < input.length; row++) {
        for (let col = 0; col < input[row].length; col++) {
            // find next cluster start, not visited
            if (in_cluster.includes([row, col].toString())) { continue; }

            // we have found an element not already in a cluster
            let elt = input[row][col];

            // we build clusters only for non empty cells
            if (elt === -1) { continue; }

            // start our new cluster
            let cluster_idx = clusters.length;
            clusters.push([]);

            // our exporation stack
            let to_process = [[row, col]];
            let visited = [];

            // explore
            while (to_process.length) {
                let pos = to_process.pop();
                if (visited.includes(pos.toString())) { continue; }
                visited.push(pos.toString());

                let r = pos[0], c = pos[1];

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

        if (elt < 0 || elt + 1 >= MAX_ELT)
            return;

        let pos_new_elt = find_new_elt_position(cluster);

        transmutations.push([
            cluster, [pos_new_elt[0], pos_new_elt[1], elt + 1]
        ]);
    });

    // console.log('generated transmutations:', transmutations);
    return transmutations;
}

exports.calc_transmutations = calc_transmutations;
exports.find_new_elt_position = find_new_elt_position;