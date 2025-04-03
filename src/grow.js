/** @param {NS} ns */
export async function main(ns) {
  const targetNode = ns.args[0] || '';
  const delay = ns.args[1] || 0;
  const repeat = ns.args[2] || 1;
  for (let i = 0; i < repeat; i++) {
    if (delay) {
      await ns.sleep(delay);
    }
    await ns.grow(targetNode);
    await ns.sleep(100);
  }
}

/*
 This code will goes in main()
 #Future: Move all this code (including the function definitions) to a separate getServerList(ns) function
 #Future: move getServerList() to a separate file and export it to be used in multiple scripts
 */

const serversAlreadySeen = [];

function recursivelyFindAllServers(currentServer) {
  // You are starting at "currentServer" and need tofind out which servers are connected to it
  // #TODO: find all nearby servers to the currentServer using ns.scan()
  let nearbyServers;

  // You then want to filter out any servers you have seen before to avoid infinite loops
  // #TODO: remove any servers that have already been seen from nearbyServers by calling removeDuplicateServers() from below
  let newServers;

  // then you want to record that you have found these servers
  // #TODO: add the newly discovered servers in newServers to serversAlreadySeen

  // You then want to repeat this process starting at each of the new servers you found
  // Loop over newServers with a for...of loop or a .forEach()
  // Use the tool recursivelyFindAllServers() to scan from each of the newServers,
  //    which adds any newly found servers to serversAlreadySeen, scans from the new servers,
  //    and repeats the process until all servers are found
  // # TODO: call this function (recursivelyFindAllServers) for each of the new servers you found
}

debugger;

function removeDuplicateServers(serverArray) {
  let results = [];
  // #TODO: put all of the servers in the array that are not in serversAlreadySeen into results
  // Use the .includes() function to test if an item is in an array
  // Loop over the passed serverArray with a for...of loop
  // alternatively, generate results with a .filter() call and pass a function that checks if the server is in serversAlreadySeen
  return results;
}

recursivelyFindAllServers('home');
// Now serversAlreadySeen contains all servers connected to 'home' and all servers connected to those servers, etc.
// and you have your full server list!

/**
 get all server names in an array; this will be useful for a lot of other scripts

 Show the connection path from home to a specified server (bonus: put it on the clipboard)

 purchase servers to get more ram, and upgrade them once you have the cap

 find where all available ram is across all purchased/nuked servers

 you weaken a server after you grow or hack it to fix its security. Try and launch the right amount of weaken before the grow or hack actually completes, so you don't get the debuff in weaken time from their increased security. Same with growing after a hack, try and get your attacks timed carefully in parallel

 go to CIA in Sector-12 and make a script to play the minigame there

 find all coding contract .cct files on servers across the network, and print out or otherwise record how to find them. Bonus: make a solver to automatically complete the easy ones
 */
