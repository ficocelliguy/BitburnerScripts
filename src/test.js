/** @param {NS} ns */
export async function main(ns) {
  let array = ns.args[0];

  // In [index, list] order:
  let directionalVectors = { U: [0, -1], D: [0, 1], L: [-1, 0], R: [1, 0] };

  // If the end is an obstacle, then there is no way to reach the end
  if (array[array.length - 1][array[0].length - 1] === 1) {
    ns.tprint('');
    ns.exit();
  }

  let memoShortest = new Object();

  function mazeDFS(list, index) {
    // If we are out of bounds, continue to the next movement
    if (list === -1 || index === -1 || list === array.length || index === array[0].length) {
      return -1;
    }
    // If we encountered a block, continue to the next movement
    if (array[list][index] === 1) {
      return -1;
    }

    if (list === array.length - 1 && index === array[0].length - 1) {
      // The "shortest" path from the end goal to the end goal is to do nothing
      return '';
    }
    if (Object.hasOwn(memoShortest, String([list, index]))) {
      return memoShortest[String([list, index])];
    }

    /*
    If this exact node is visited in a later/child function call,
    then it is obviously deduced that the path taken by this child function
    is less optimized and more redundant because it is taking more moves
    (as it is a child function) than a parent function to get to this same node
    Hence, we stop immediately (which is done in the for loop,
    in the case of shortestPathFromThere = -1)
    to avoid unnecessary and redundant movement
    */
    memoShortest[String([list, index])] = -1;

    let shortestPathFromHere;
    for (let move of 'UDLR') {
      let [i, j] = directionalVectors[move];
      let shortestPathFromThere = mazeDFS(list + j, index + i);

      // So that shortestPathFromHere is not updated falsely
      if (shortestPathFromThere === -1) {
        continue;
      }

      /*
      If the current move + the shortest path from the node after that move
      is shorter than the current shortest path from the current node,
      update shortestPathFromHere
      */
      /*
      shortestPathFromHere will initially be undefined (on the first loop),
      and so we must give it any first value so we can do comparisons
      in the next loops
      */
      if (shortestPathFromHere === undefined || 1 + shortestPathFromThere.length < shortestPathFromHere.length) {
        shortestPathFromHere = move + shortestPathFromThere;
      }
    }
    memoShortest[String([list, index])] = shortestPathFromHere;
    return memoShortest[String([list, index])];
  }

  ns.tprint(mazeDFS(0, 0));
}

export function _shortestpath(array) {
  /*
  Similar to Unique Paths in a Grid II, the data given is the maze itself
  The only difference is that, here, we can move in any direction
  (Up, Down, Left, Right) and that we also have to track the path taken
  */

  // In [index, list] order:
  let directionalVectors = { U: [0, -1], D: [0, 1], L: [-1, 0], R: [1, 0] };

  // If the end is an obstacle, then there is no way to reach the end
  if (array[array.length - 1][array[0].length - 1] === 1) {
    return '';
  }

  let memoShortest = new Object();

  function mazeDFS(list, index) {
    // If we are out of bounds, continue to the next movement
    if (list === -1 || index === -1 || list === array.length || index === array[0].length) {
      return -1;
    }
    // If we encountered a block, continue to the next movement
    if (array[list][index] === 1) {
      return -1;
    }

    if (list === array.length - 1 && index === array[0].length - 1) {
      // The "shortest" path from the end goal to the end goal is to do nothing
      return '';
    }
    if (Object.hasOwn(memoShortest, String([list, index]))) {
      return memoShortest[String([list, index])];
    }

    /*
    If this exact node is visited in a later/child function call,
    then it is obviously deduced that the path taken by this child function
    is less optimized and more redundant because it is taking more moves
    (as it is a child function) than a parent function to get to this same node
    Hence, we stop immediately (which is done in the for loop,
    in the case of shortestPathFromThere = -1)
    to avoid unnecessary and redundant movement
    */
    memoShortest[String([list, index])] = -1;

    let shortestPathFromHere;
    for (let move of 'UDLR') {
      let [i, j] = directionalVectors[move];
      let shortestPathFromThere = mazeDFS(list + j, index + i);

      // So that shortestPathFromHere is not updated falsely
      if (shortestPathFromThere === -1) {
        continue;
      }

      /*
      If the current move + the shortest path from the node after that move
      is shorter than the current shortest path from the current node,
      update shortestPathFromHere
      */
      /*
      shortestPathFromHere will initially be undefined (on the first loop),
      and so we must give it any first value so we can do comparisons
      in the next loops
      */
      if (shortestPathFromHere === undefined || 1 + shortestPathFromThere.length < shortestPathFromHere.length) {
        shortestPathFromHere = move + shortestPathFromThere;
      }
    }
    memoShortest[String([list, index])] = shortestPathFromHere;
    return memoShortest[String([list, index])];
  }

  return mazeDFS(0, 0);
}
