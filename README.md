(for details on how to set up this project locally if you want to run it yourself, see [README_SETUP.md](./README_SETUP.md) A template to make your own Vite typescript dev environment [can be found here](https://github.com/ficocelliguy/viteburner-template/tree/main), or you can use the [typescript template made by the game's devs](https://github.com/bitburner-official/typescript-template/))

## Bitburner, the game, the myth, the legend

So, I have absolutely fallen in love with a free game called Bitburner, playable [on your browser](https://bitburner-official.github.io/) or as a [steam desktop app](https://store.steampowered.com/app/1812820/Bitburner/). Its a semi-idle game that revolves around writing Javascript scripts in-game to gradually increase your resources and control. It's set in a cyberpunk dystopia with some "Snow Crash" vibes, and you are uncovering what happened such that the world ended up that way. You are a "hacker" that is slowly getting control of more and more public servers to be able to run more and more of your scripts, and navigating the shadowy powers of the world. You start out cracking servers to have more places to deploy your scripts, and eventually are directing your corporations' R&D strategies and your gang's crime coordination (all with automation)

The game has a pretty good tutorial and EXCELLENT documentation. Its gameplay has a very cool way of going from "it would be nice if it was easier to do X" to suddenly making a simple webcrawler from first principles (and the game's very basic API); or building a basic thread manager to launch coordinated "attacks" against a server you are trying to lift money from.

The game has a very nice code editor ([CodeMirror, I think?](https://codemirror.net/)) with typing support and context prompting etc, and also has an api that allows you to use a Visual Studio or Intellij Idea plugin to sync files from your IDE of choice to the game. There is even a [Vite flavor the community made](https://github.com/ficocelliguy/viteburner-template/tree/main) just for this game (used in this project), or alternatively [an official typescript template](https://github.com/bitburner-official/typescript-template/) made by the game's devs.
The game is [also open-source](https://github.com/bitburner-official/bitburner-src/tree/dev), so you can look inside and see how all of the magic happens under the hood if you have very specific questions.(Note that since it is an idle game, it encourages you to set up some tasks and let them run, and check on it the next day. The game registers your progress even when it is closed).

I would encourage anyone who wants to get some coding practice to check it out, it is absolutely the best zero dollars you will spend today.

The scripts I have made for this game are in the src/ directory of this project. Please feel free to look through them to understand how I have tackled some of these problems. Note that these are my own homebrew solutions, and are very likely far from optimal. In the same way, I encourage you to not simply copy these scripts to your game, but rather use them as inspiration for your own work.  


## Some tips that I wish I had starting out:

What to work on first?
* Follow the tutorial, it is very helpful.
* There are some files on your home computer, run `ls` and you should be able to click on them to open them. They will give you tips and hints.
* After that, look at the [getting started guide in the docs](https://bitburner.readthedocs.io/en/latest/guidesandtips/gettingstartedguideforbeginnerprogrammers.html). This will help a TON with progression.


* In the terminal in-game, `run fl1ght.exe` to get some guidance on what you are working towards (you should be given that file by a mysterious benefacter very early on.) This file changes between runs and as you complete tasks, keep an eye on it.
* Find a tech store and download some more RAM for your personal computer. This persists across "runs" and is the biggest boost you can get early.
* Find a tech store in a different city (once you have money for airfare) and see if they sell a TOR router. (try Aevum?) This will allow you to use the `buy` command in the terminal which may save you a lot of time; take a look at `buy -l`


* Your first major goal is to get your hacking level to several thousand, wich will take several "runs" to do. Explore and play a bit to find ways to improve your stat multipliers to make this happen.
* There are groups that will reach out to you once your hacking stats are high enough and have enough money, if you are in their city, or if you connect to their server and run `backdoor` on it. Their resources are the key to progress. They will send you hints as your stats get close enough.
* When (not if) you make an infinite loop accidentally, you may need to kill the game (or, if you are using the browser, re-start it with `?noScripts` after the url). In general, add a `await ns.sleep(10)` to every loop you make until you are very sure it won't hang.


## What to do while waiting for tasks to run / Coding ideas:
* There are a number of "programs" (aka features) you can eventually unlock in-game, that you can probably make yourself rather quicker...
* (Any files you make are permanent, so they will make future runs much easier)

* The starting scripts provided by the tutorials for hacking servers leave a lot to be disired.
    - <details><summary>Hint 1: (click to expand)</summary> You can estimate how many weak() and grow() calls/threads will be needed for a number of hack() threads, and preemtively fire those. You can calculate them more exactly once you buy or unlock the Formulas API  </details>
    - <details><summary>Hint 2: </summary> weaken() grow() and hack() do not have any effect until the moment they complete, and the time they take to run can be calculated with the script tools. This means you can immediately re-weaken and grow servers you attack, if you time your scripts correctly. </details>
    - <details><summary>Detailed docs: </summary> There is some great algorithm design [in the official docs](https://bitburner.readthedocs.io/en/latest/advancedgameplay/hackingalgorithms.html) for more ideas and details.  </details>

* Purchasing very large servers to have extra RAM space can only be done via script. Maybe you can make a script that is smart about how large, and when, to purchase one? Tip: You can delete small servers if you max out on server count.
* You will find it very useful to have a script that finds all of the servers on the network, and writes to a file how they are connected.
    - You will also want to extend that tool to be able to find the path to a given server, and output that.

* Protip: The game runs on Chromium, and you have access to browser automation. For example, you can put text into your clipboard ready to be pasted into the terminal via `navigator.clipboard.writeText("<some string>");`
* There are occasionally files that appear on other people's servers that end in .cct; finding them can lead to some lucrative opportunities. Can you automate searching for them? Can you automate completing them?

* You can automate buying and upgrading Hacknet nodes. Note that a well-optimized hacking setup will eventually net a lot more money, but in the very early game hacknet is handy.
* It is very useful to be able to run a script on a metric ton of threads; make a tool to get available ram across all cracked servers and distribute threads of your script across them.
* The infiltration minigames are very profitable, but are super difficult unless your physical stats are v high; I wonder if you could send keyboard events via javascript...


## What to do as you progress the story:

I've recieved some invitations, What groups should I join?
<details><summary>Hint for first run: </summary>  * Aevum and Tian Di Hui both have reputation gain boosters, which are extremely helpful to speed up befriending the other factions.
* Sector-12 and the various factions unlocked through running `backdoor` on their server have hacking skill and speed boosts, which greatly speed up progression, and don't conflict with Aevum.</details>
<details><summary>Hint for next run: </summary> * On the next run, aim for Chonqing's hacking boosts, and whatever hacking boosts you didn't get on prior runs.
* AFAIK, only city-based factions have conflicts with other factions, the others can be joined freely.
* NeuroFlux Governors can be repeatedly purchased, and quickly makes a big difference in the time it takes to do stuff. 
* Any reputation you get for a faction turns into favor on the next run, which is a multiplier of the rep you gain with that faction. </details>
<details><summary>Hint for later game: </summary> * The key faction to progressing the story will reach out to you at 2500 hacking level. </details>


I've installed the spoiler augmentation, what do I do now?
* <details><summary>Hint: </summary> You need a lot of hacking level, even more than the Daedalus requirement. </details>
* <details><summary>Hint: </summary> A new server has appeared on the network that wasn't there before, hinted at in the files that Daedalus gave you. Have you made a crawler yet to find all of the nodes on the web? </details>
* <details><summary>Hint: </summary> You need to leave The-Cave </details>
* <details><summary>Hint: </summary> If you are still stuck, ask me (or google it, lots of people get stuck here) </details>


I've completed the big storyline spoiler thing, what node should I choose next?
<details><summary>My thoughts: </summary> In no particular order:
You have completed BitNode 1.1 and gotten its file; completing 1.2 will give you a much better version of that file (permanent multipliers to a bunch of stats).
BitNode 5.1 unlocks Formulas API for free permanently, which lets you access powerful calculations for things like exactly how big an effect N weaken() threads will have on a server, and unlocks a permanent metaprogression stat Int which slowly builds up as a small multiplier for a stats.
Bitnode 2 and 3 are alternate money-making nodes, dealing with crime and corporations respectively, that also unlock those powerful options in later bitnodes. You'll want to do at least one of them fairly early on.
Bitnode 10 allows you to make "sleeves" which are clones/duplicates of the player, and an API to have them work on things for you, so you can get progress on more things at once.
Bitnode 4 allows for an API that can automate almost everything in the game, but it is VERY difficult to complete; you want good bonuses from other bitnodes before atempting it.

For more details on bitnode choice see https://bitburner.readthedocs.io/en/latest/guidesandtips/recommendedbitnodeorder.html#recommended-bitnodes </details>
