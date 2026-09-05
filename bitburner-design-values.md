# Bitburner Design Values

A reference for new contributors, compiled from PR and issue comments by the
current maintainers of [bitburner-official/bitburner-src](https://github.com/bitburner-official/bitburner-src).
The primary sources are **catloversg** and **d0sboots**, with **ficocelliguy**
included only where corroborated by one of the other two. Wording is kept as
close to the authors' own phrasing as possible.

---

## Summary

### Shared values

1. **Give players tools, not solutions.**
   - APIs and features let players build answers, not provide them.
   - Prefer simple building blocks that combine to make complex solutions, over rigid, opinionated APIs that presume a specific use case.
2. **The terminal is intentionally limited to nudge players toward scripting.**
   - No return codes, no shell scripting, no multi-line commands, etc. is a conscious design choice.
   - Commands like `scan-analyze` have hard limits, so players write their own better versions.
3. **Built-in tools are "just good enough". Leave itches for players to scratch.**
   - Some things are a little bad on purpose, to give players an obvious hook to improve on.
4. **Good mechanics have simple naïve solutions but a lot of depth.**
   - A beginner at coding should be able to get something working in a fairly short, simple script.
   - There should not be an "optimal" solution or script.
   - Puzzles should lend themselves to iterative improvements.
5. **Reading the source and docs is part of the game.**
   - Reading API documentation is crucial, and long-form docs are key references.
   - Digging into source is explicitly encouraged in some mechanics.
6. **Design for players who want a puzzle.**
   - Avoid shortcuts that "skip the fun" where possible.
   - JS exploits cannot be locked down and will not be. Players define their own limits.
7. **Docs should have hints, not hand-holding.**
   - Docs are a reference, and do not provide optimal solutions or step-by-step guides.
8. **Manual play and experimentation are important.**
   - Automation must always be available. Progress cannot be gated on manual clicking.
   - Players must be able to explore and fail-forward. Traps should slow you down, not lose progress.
9. **Push things to userland if players can already build them.**
   - If players can already solve a problem or build a feature using player scripts, adding it as a game feature needs to be considered carefully.
10. **API breaks are discouraged, and are grouped into major releases (v3, v4, ...).**
    - Even inside a major release, the bar is high: real benefit, automated migration when possible.

### What Bitburner is

- A programming incremental/idle game where the tasks are fun.
- A game about abstract automation. It rewards scripting over idling and manual clicking.
- A puzzle game, where friction/slowness is the problem and scripts are the solutions.
- A sandbox where the player defines their own limits.
- Open-world, explore-on-your-own, with limited hints.
- Single-player. Balance targets fun, not competitive fairness.
- A volunteer-driven project.

### What Bitburner is not

- A game hub for other games.
- A real Unix shell.
- A multiplayer or competitive game.
- An explicit programming or Javascript tutorial.

---

## Part I. Bitburner values

### 1. Give players tools, not solutions

Bitburner is a puzzle game at heart. APIs should let players build the
answer, not hand it over. Prefer simple building blocks that combine to
make complex solutions over rigid, opinionated APIs that presume a
specific use case.

- **catloversg:** "we provide the tools to build solutions, not the solutions themselves."
  <https://github.com/bitburner-official/bitburner-src/pull/2948#issuecomment-4931704602>
- **catloversg:** "My guideline for this kind of API is to check what the equivalent CLI command can do, then make the API do that or less, not more."
  <https://github.com/bitburner-official/bitburner-src/pull/2948#issuecomment-4877182534>
- **ficocelliguy:** "we are a puzzle game at heart. We give players interesting problems and a cool sandbox to explore them in. We don't want to remove puzzles via quality-of-life changes. We want to give players tools, not solutions wholesale."
  <https://github.com/bitburner-official/bitburner-src/pull/2948#issuecomment-4886991188>
- **d0sboots (building blocks over rigid APIs):** "UI is a very diverse space, so it's best to provide simple building blocks rather than rigid ones. The trade-off is more complexity on the use side, but it's always going to be complex, and we have a pretty good stepping stone with printRaw and tail windows for people to get their feet wet."
  <https://github.com/bitburner-official/bitburner-src/pull/2873#issuecomment-4695956405>
- **ficocelliguy (hooks over one-shot solutions):** "it might be better to give good hooks to the player so they can make their own 'optimal' aug purchase order script?"
  <https://github.com/bitburner-official/bitburner-src/pull/783#issuecomment-1709121357>
- **d0sboots (in reply, on the right shape for a QoL feature):** "I like that idea of a calculator as something in Darkweb that you could buy … it's useless to experienced players but can provide QoL to players who are just getting their feet wet."
  <https://github.com/bitburner-official/bitburner-src/pull/783#issuecomment-1709248966>

### 2. The terminal is intentionally limited to nudge players toward scripting

The shell is deliberately basic and a little annoying. That primitiveness is
the point. It steers players toward writing automation in scripts.

- **d0sboots:** "the terminal is intentionally basic and a little annoying to use. That's partly to give a gentle nudge towards building automation in scripts, instead of the terminal."
  <https://github.com/bitburner-official/bitburner-src/issues/3041#issuecomment-5246741277>
- **d0sboots:** "it is (at this point) a conscious design decision that the Bitburner shell does not have 'advanced' features like return codes, test operators, etc. If you want that sort of thing, you are encouraged to write scripts, similar to how the limitations of the built-in `analyze` etc. are there to guide you towards writing better versions."
  <https://github.com/bitburner-official/bitburner-src/issues/2442#issuecomment-3721362908>
- **d0sboots:** "Ultimately, I just don't think bitburner scripts (as opposed to built-in commands) belong in the foreground."
  <https://github.com/bitburner-official/bitburner-src/issues/2441#issuecomment-4401714880>

### 3. Built-in tools are "just good enough". Leave itches for players to scratch

Many built-ins are kept deliberately weaker than what a player could build.
Some things are "a little bad on purpose".

- **d0sboots:** "Many things in BitBurner are 'just good enough' to get by with, but basic enough that they leave you wanting a better solution. Unlike in the real world, we don't always improve those things so that they're great, but rather leave them as itches for players to scratch."
  <https://github.com/bitburner-official/bitburner-src/issues/477#issuecomment-2134052878>
- **d0sboots:** "we usually leave stuff like this up to the players, when it is easy for players to create for themselves. It provides an obvious 'hook' for people to get started with. Some stuff in the game is even a little bad on purpose, for just this reason."
  <https://github.com/bitburner-official/bitburner-src/issues/1688#issuecomment-2398924068>
- **ficocelliguy:** "the terminal commands are intentionally limited in order to encourage players to write their own better tools."
  <https://github.com/bitburner-official/bitburner-src/pull/2948#issuecomment-4930220591>

### 4. Good mechanics have simple naïve solutions but nearly infinite depth

The best Bitburner mechanics let a beginner get something working, then
open a clear series of next steps that keep getting harder without ever
converging on a "perfect" answer. Hacking is the canonical example: the
simple tutorial script works, but it is orders of magnitude away from the
best batchers, which are still not perfect.

- **d0sboots (on the hacking-algorithm ladder):** "'Loop algorithms' are not an interesting concept on their own, in large part because they cannot be automated well. The true breakthrough in understanding is the batch concept, and everything else (worker scripts, use of servers as distributed RAM) comes as natural improvements from that."
  <https://github.com/bitburner-official/bitburner-src/pull/2288#issuecomment-3215451311>
- **catloversg (framing the same progression):** "You have EHT, then you write a generic controller, then you modify that controller and make it spawn batches (i.e., a set of HWG with careful timing). These are 3 types of hacking algorithms; you can also see them as 3 consecutive steps."
  <https://github.com/bitburner-official/bitburner-src/pull/2288#issuecomment-3214833287>
- **catloversg:** "When the player uses this, they need to tune it and find the optimal speed instead of blasting away as fast as possible. This is a very nice characteristic."
  <https://github.com/bitburner-official/bitburner-src/pull/2210#issuecomment-3079966918>
- **d0sboots (on IPvGO's audience spanning skill levels):** "The real question is who is the audience for this feature. Is it someone who is a 8k in Go, who can deduce how the AI is playing and make it make dumb moves, the coder who can look at the current code and improve it a little bit and iterate on losses/wins, or the person who is playing it live … I think the answer is 'all of the above.'"
  <https://github.com/bitburner-official/bitburner-src/issues/1169#issuecomment-2016119320>
- **ficocelliguy:** "My goal was to make a programming problem that had some very simple naïve solutions, but also had nearly infinite depth to iteratively improve."
  <https://github.com/bitburner-official/bitburner-src/issues/1169#issuecomment-2015994531>

### 5. Reading the source and docs is part of the game, not a defect

The code is open on purpose. Reading docs is mandatory; digging into source
is explicitly encouraged and builds real-world skill.

- **catloversg:** "In Bitburner, reading the documentation is mandatory. … The confusion for *some* new players can be resolved by improving the documentation."
  <https://github.com/bitburner-official/bitburner-src/issues/2942#issuecomment-4861736867>
- **d0sboots:** "We *can* say that the source is the ultimate answer, but it's a response that should be used sparingly."
  <https://github.com/bitburner-official/bitburner-src/issues/1742#issuecomment-2453945684>
- **ficocelliguy:** "Looking through the source code is encouraged in this game! That's an explicit part of the game design in a number of mechanics."
  <https://github.com/bitburner-official/bitburner-src/issues/1742#issuecomment-2539303547>

### 6. Design for players who want the puzzle. Let them define their own limits

Bitburner is a sandbox. It is a defining feature that the player, not the
game, draws the line for what counts as cheating. Locking down JS exploits
is impossible and undesirable. So maintainers design for the player who
wants the puzzle: reduce tempting skip-the-fun shortcuts where cheap, and
let everyone else define their own "acceptable playstyle limits".

- **d0sboots:** "one of the truly unique things about BitBurner that I really like: *you* have to decide for yourself what the acceptable limits are. It won't ever tell you, 'Don't do this, it's cheating.'"
  <https://github.com/bitburner-official/bitburner-src/issues/1899#issuecomment-2578735769>
- **d0sboots:** "some of the contracts (deliberately) do not produce an answer, but are only capable of checking if an answer is correct, to avoid copying the algorithm from the source."
  <https://github.com/bitburner-official/bitburner-src/issues/2411#issuecomment-3621047745>
- **d0sboots:** "it is just not possible to lock everything down. We have chosen to embrace this as a 'feature'."
  <https://github.com/bitburner-official/bitburner-src/issues/1302#issuecomment-2126548397>
- **ficocelliguy:** "The path of least resistance is to edit your save or similar and not even solve puzzles. So, we tend to design for people who will do the cool thing if given an interesting puzzle, and making slightly fewer tempting shortcuts to skip the fun part is a benefit to those players."
  <https://github.com/bitburner-official/bitburner-src/issues/2762#issuecomment-5059269938>

### 7. Hints, not hand-holding. Tutorials and examples never ship as optimal code

The line between giving hints and hand-holding is very thin. Documentation
should explain the mechanics or API, not provide optimal strategies.
Examples in docs are intentionally imperfect so players still have to
discover the good solutions themselves.

- **catloversg:** "Do not provide code that is actually optimal [in tutorials]. All scripts should always be unusable as-is. Broken scripts are actually 'good'. The line between giving hints and hand-holding is very thin."
  <https://github.com/bitburner-official/bitburner-src/pull/2954#issuecomment-4883502888>
- **catloversg:** "the basic guide does not need to be optimized for RAM usage."
  <https://github.com/bitburner-official/bitburner-src/issues/2148#issuecomment-4778262996>
- **d0sboots:** "the docs are mentioned prominently so that if/when you get stuck, you know where to go looking. They're primarily a reference, not a guide, so there is no expectation that you read all of them."
  <https://github.com/bitburner-official/bitburner-src/issues/1504#issuecomment-2241303546>

### 8. Manual play and experimentation are valid. Trap mechanics are anti-pattern

Bitburner is fundamentally a scripting game, but not exclusively. UI-driven
paths, manual play, and passive mechanics all remain first-class. And the
first time a player encounters any mechanic, whether they end up scripting
it or clicking through it, they are expected to poke at it, try things,
and figure it out from the results. That has two consequences for design:

1. **Automation must always be available.** Progress cannot be gated on
   manual clicking. Features that force manual actions, or that only yield
   a good result when you're paying attention, are treated as a failure
   mode.
2. **Trap mechanics are anti-pattern.** Hidden states that punish
   exploration, unrecoverable losses from a wrong click, spirals where a
   small mistake compounds into "you probably want to reset this BitNode":
   all antithetical to how the game is meant to be learned. A Corp going
   bankrupt from a mechanic the player didn't know existed, a Gang losing
   all its territory in a clash they were nudged into, a research tree
   that locks in a wrong answer. Where a mechanic is complex enough to
   have real wrong moves, the design leans on safety nets, hard caps,
   one-way progress, and "minor inconvenience" defaults so exploration
   stays inviting.

- **catloversg (manual play is valid):** "These UI-focused features are usually useless because most players write scripts, but manual play is still a valid gameplay."
  <https://github.com/bitburner-official/bitburner-src/issues/2193#issuecomment-3079368227>
- **d0sboots (automation must always be available, so progress never depends on manual clicking):** "You should be able to program to do stuff (i.e., don't rely on manual actions to gate progress)."
  <https://github.com/bitburner-official/bitburner-src/pull/333#issuecomment-1401298690>
- **d0sboots (Hacknet's role: valid because it is strictly optional and passive):** "hacknet nodes are weak compared to pretty much everything, but the compensation is that they are entirely passive and require no scripting."
  <https://github.com/bitburner-official/bitburner-src/issues/829#issuecomment-1734438552>
- **d0sboots (the exploration principle, verbatim):** "You shouldn't *have* to program everything; especially on the first time interacting with a mechanic, manual experimentation is encouraged."
  <https://github.com/bitburner-official/bitburner-src/pull/333#issuecomment-1401298690>
- **d0sboots (what it looks like when a mechanic does trap the exploring player):** "Right now coffeeparty is failing 3 and (I'd argue) 4. It is much too painful to do corps manually right now because of it, and automating it is also not an interesting task, but rather something you are doing because you are forced to. … **Corp has too many mechanics**, it is waaay too complicated. … Every one of these mechanics is a mental tax."
  <https://github.com/bitburner-official/bitburner-src/pull/333#issuecomment-1401298690>
- **d0sboots (the rule for a mechanic to not be a trap, strictly optional):** "I'd want it to be something that is *strictly optional*, in the sense that you can gain some advantage (speedrun faster, etc.) by managing morale, but ignoring it totally won't stop you from winning corp in a reasonable timeframe."
  <https://github.com/bitburner-official/bitburner-src/pull/333#issuecomment-1401298690>
- **d0sboots (a mechanic that only forces engagement isn't a good mechanic):** "not every mechanic is a good mechanic. If you feel that morale was useless before, that doesn't justify changing it so it becomes required. That's an argument that it should probably be cut entirely."
  <https://github.com/bitburner-official/bitburner-src/pull/333#issuecomment-1399403199>
- **d0sboots (the specific harm of a trap: losing the time you already invested):** "losing all your research means you lose most of your progress that actually takes time."
  <https://github.com/bitburner-official/bitburner-src/pull/503#issuecomment-1542890584>
- **d0sboots (achievements are one-way by design, so exploration never costs you a win):** "Currently, our in-game achievements are one-way: once achieved, they can't be lost."
  <https://github.com/bitburner-official/bitburner-src/issues/1652#issuecomment-2350454227>
- **catloversg (safety-net cooldown to bound the worst case if a formula turns out wrong):** "This cooldown is the safety net that ensures the effective spawn rate is always capped at the value we want … even if the spawn rate formula is flawed or the implementation is bugged."
  <https://github.com/bitburner-official/bitburner-src/pull/2545#issuecomment-4065315959>
- **catloversg (default to "minor inconvenience now" over "oops, ruined"; advanced options reset per BitNode):** "IMO, a minor inconvenience is better than 'Oops! I forgot resetting those options!'."
  <https://github.com/bitburner-official/bitburner-src/pull/1411#issuecomment-2200271049>

### 9. Push things to userland when players can already build them

It is better if players solve problems using lower-level tools. Things
that users can already create via scripts are often not good options for
new features.

- **d0sboots:** "This won't happen … you can already do this (with some effort) on your own. It's best to give players the full power of JS to customize that, which they already have."
  <https://github.com/bitburner-official/bitburner-src/issues/3041#issuecomment-5246741277>
- **catloversg:** "I agree with d0sboots. This feature is something that should be implemented in the userland."
  <https://github.com/bitburner-official/bitburner-src/pull/2428#issuecomment-3675309706>
- **d0sboots:** "It seems like this is something that can be handled well enough from within your own code?"
  <https://github.com/bitburner-official/bitburner-src/pull/2428#issuecomment-3674696891>

### 10. API breaks are discouraged, and are grouped into major releases

The public NS surface is treated as effectively locked in. Breaking
changes are not shipped in minor or patch releases. They are collected
into new major versions (v3, v4, ...) so that players who write scripts
update once per major, not constantly. Even between majors, the bar is
high: a proposed break needs a clear benefit that outweighs the cost of
breaking scripts across the community, and where possible it ships with
an automated migration so players do not have to hand-edit their code.
Internals (functions, types, representations not exposed on `ns`) can be
renamed and refactored freely. The constraint only applies to the public
surface.

- **catloversg (the policy, verbatim):** "We recently released v3 with many breaking changes. Technically, we can make some more breaking changes before v4 lands. However, we will try not to do that. In general, breaking changes are introduced in a major version."
  <https://github.com/bitburner-official/bitburner-src/issues/2927>
- **d0sboots (internals vs. public):** "Internal functions we have free reign to rename. However, anything that is actually part of the API we're likely stuck with."
  <https://github.com/bitburner-official/bitburner-src/issues/3071#issuecomment-5484824215>
- **d0sboots (the bar for a break, even inside a major release):** "Out of all the breaking changes we've made, I'd say this is the one I'm most on the fence about (and I've been *really* on the fence about some of them). … I'm a bit hesitant to change these values in a way that both: 1) Has potential to cause *very* widescale breakage, and 2) Can't be mitigated in *any* automated fashion, without a really clear benefit."
  <https://github.com/bitburner-official/bitburner-src/pull/2180#issuecomment-3006056611>
- **catloversg (rejecting an unnecessary break):** "If running `run BruteSSH.exe` on home fails, we would need to introduce a breaking change to the `brutessh` API, and I don't think that breaking change is necessary."
  <https://github.com/bitburner-official/bitburner-src/issues/2943#issuecomment-4861979179>
- **d0sboots (even tiny representation changes are treated as breaks):** "This is (minorly) api-breaking and just not worth it. … I'm sure would break someone somewhere."
  <https://github.com/bitburner-official/bitburner-src/pull/2877#discussion_r3406683307>
- **d0sboots (why RAM costs of existing NS functions can't drift):** "The ram cost of `self` can't be increased, not without breaking lots of people's scripts."
  <https://github.com/bitburner-official/bitburner-src/pull/3072#issuecomment-5484744837>
- **d0sboots (auto-migration is the preferred softener when a break has to ship):** "the most user-friendly thing to do is to auto-migrate now, and then also again when we deprecate."
  <https://github.com/bitburner-official/bitburner-src/pull/2986#issuecomment-5029787617>
- **catloversg (formalizing auto-migration for future deprecations):** "Should we perform auto-migration for future deprecations? I have some on my list. If we decide to make this a standard procedure, I'll do that in future PRs."
  <https://github.com/bitburner-official/bitburner-src/pull/2986#issuecomment-5038171303>
- **catloversg (on why forward-compatible APIs are worth defending):** "You are assuming that there is an 'interface contract' under which anything not mentioned in the documentation is inherently prohibited. … Allowing unknown parameters is a design choice, not an inherently bad practice. … This is especially useful for forward compatibility."
  <https://github.com/bitburner-official/bitburner-src/issues/3061#issuecomment-5441651169>


---

## Part II. What Bitburner *is* (and isn't)

The maintainers often name what the game is and isn't, so proposals in
either direction can be evaluated quickly.

### Bitburner *is* …

- **A puzzle game at heart.**
  - **ficocelliguy:** "we are a puzzle game at heart. We give players interesting problems and a cool sandbox to explore them in."
    <https://github.com/bitburner-official/bitburner-src/pull/2948#issuecomment-4886991188>
- **A programming incremental/idle game, where the programming tasks should be *fun*.**
  - **d0sboots:** "BB is a programming incremental/idle game."
    <https://github.com/bitburner-official/bitburner-src/pull/333#issuecomment-1401298690>
  - **d0sboots (the "big number goes up" side of an idle game):** "Monkey sees beeg number → neuron activation."
    <https://github.com/bitburner-official/bitburner-src/pull/333#issuecomment-1401298690>
  - **d0sboots (the mandate for every mechanic):** "The programming tasks should be *fun*."
    <https://github.com/bitburner-official/bitburner-src/pull/333#issuecomment-1401298690>
- **A game about abstract automation: one that rewards scripting over idling and manual clicking.**
  - **d0sboots:** "this game is *not* about 'real programming', if you take that to mean 'client/server architecture programming.' It absolutely *is* about abstract automation."
    <https://github.com/bitburner-official/bitburner-src/issues/1447#issuecomment-2200933134>
  - **d0sboots:** "the terminal is intentionally basic and a little annoying to use. … partly to give a gentle nudge towards building automation in scripts, instead of the terminal."
    <https://github.com/bitburner-official/bitburner-src/issues/3041#issuecomment-5246741277>
  - **d0sboots (on Hacknet):** "hacknet nodes are weak compared to pretty much everything, but the compensation is that they are entirely passive and require no scripting."
    <https://github.com/bitburner-official/bitburner-src/issues/829#issuecomment-1734438552>
- **A sandbox. The player is inside the sandbox and defines their own limits.**
  - **d0sboots:** "BitBurner is unique in that it confronts you with the need to define your own 'acceptable playstyle limits.' … The game is a sandbox game, and it's inside the sandbox."
    <https://github.com/bitburner-official/bitburner-src/issues/1899#issuecomment-2579071533>
- **An open-world, explore-on-your-own game, with no breadcrumbs to the good stuff.**
  - **d0sboots:** "after you are dropped in, it is *very much* an open-world/explore-on-your-own type of game. You can go a long time without discovering a particular powerful technique. This is both one of the biggest strengths *and* weaknesses of BB."
    <https://github.com/bitburner-official/bitburner-src/issues/1504#issuecomment-2240799297>
- **A single-player game. Balance targets fun, not competitive fairness.**
  - **d0sboots:** "Since this is a single player game, we don't need auto-infil to be 'balanced', and indeed as an exploit it's somewhat better if it's not. What we're looking for is to avoid it being completely game-breaking."
    <https://github.com/bitburner-official/bitburner-src/pull/2210#issuecomment-3081949736>
- **A game where reading the source is part of the design.** See Part I §5.
  - **ficocelliguy:** "Looking through the source code is encouraged in this game! That's an explicit part of the game design in a number of mechanics, including casino rng and all of the SF -1 achievements."
    <https://github.com/bitburner-official/bitburner-src/issues/1742#issuecomment-2539303547>
- **A volunteer-driven project. Priorities follow contributor interest, not roadmaps.**
  - **d0sboots:** "As a volunteer-driven project, we don't do things in order of how important they are, but rather in the order that people are interested in tackling them."
    <https://github.com/bitburner-official/bitburner-src/issues/3040#issuecomment-5234979720>

### Bitburner is *not* …

- **Not a game hub for other games.**
  - **catloversg:** "Bitburner is not a game hub for playing other games."
    <https://github.com/bitburner-official/bitburner-src/pull/2965#issuecomment-4911796506>
- **Not going to lock down exploits.** See Part I §6. The sandbox stance
  is a deliberate refusal to prevent cheating, because it is impossible
  in JS and because the player defining their own limits is a *feature*.
- **Not a game with a canonical BitNode order or difficulty ranking.**
  - **catloversg:** "The phrase 'BitNode order' always feels 'off' to me. … 1000 players have 1000 different opinions about the 'order'."
    <https://github.com/bitburner-official/bitburner-src/issues/2033#issuecomment-2730298306>
  - **catloversg:** "It's almost impossible to define the difficulty of contracts. Easy contracts for this player may be hard contracts for other players, and vice versa."
    <https://github.com/bitburner-official/bitburner-src/issues/2018#issuecomment-2712564467>

---

## Part III. Individual perspectives

Positions expressed by only one of the three, without clear corroboration.
Still useful context, but with less weight when there is a dispute.

### catloversg

- **Doubling farming time should give less than double reward.** "If farming for 30 minutes gives 25k rep, farming for 60 minutes should give less than 50k rep."
  <https://github.com/bitburner-official/bitburner-src/pull/2210#issuecomment-3047311147>
- **Sometimes the right answer is to say no to player suggestions.** "I respect how much you value player feedback and suggestions, but sometimes I think it's important to say no."
  <https://github.com/bitburner-official/bitburner-src/pull/2545#issuecomment-4012364097>
- **Prefer explicit conditions over cleverness (`x > 0`, not `!!x`).**
  <https://github.com/bitburner-official/bitburner-src/pull/2545#issuecomment-4067684968>
- **No SF4, no endgame automation.** Automation gates should hold even for exotic routes (Bladeburner BN-ending).
  <https://github.com/bitburner-official/bitburner-src/pull/2857#issuecomment-4677568748>
- **Vague lore is a feature.** Under-specifying preserves imagination; compares jump3r to Tom Bombadil.
  <https://github.com/bitburner-official/bitburner-src/pull/2954#issuecomment-4900449786>
- **Respect historical or flavor decisions.** "Daniel (the original developer) chose this port number years ago. … I don't want to change that … unless we have a very good reason."
  <https://github.com/bitburner-official/bitburner-src/pull/2861#issuecomment-4643022851>
- **YAGNI on infrastructure like i18n.** "We have not built a system for switching the docs language because there is currently no need for one. We will build it when we need it."
  <https://github.com/bitburner-official/bitburner-src/issues/3040#issuecomment-5257537904>
- **Don't balance around exotic corner cases** (late BN12, deep-corp millionaires).
  <https://github.com/bitburner-official/bitburner-src/issues/617#issuecomment-2122730952>
- **If the player ignores warnings, that's on them.** Prefer clear warnings and player agency over restrictive formula gymnastics.
  <https://github.com/bitburner-official/bitburner-src/pull/2210#issuecomment-3047311147>
- **Balance changes need maintainer buy-in. Don't ship them unilaterally.** "It's fine to fix the wrong console log, but if you want to make a balance change, you should wait until the maintainers agree."
  <https://github.com/bitburner-official/bitburner-src/issues/1607#issuecomment-2298574135>
- **Dig for the real question (XY problem).** Reports are often based on incorrect assumptions.
  <https://github.com/bitburner-official/bitburner-src/issues/2943#issuecomment-4861979179>
- **Gray-area APIs create precedent problems.** "accepting this idea means we will also need to carefully evaluate similar proposals in the future."
  <https://github.com/bitburner-official/bitburner-src/pull/2948#issuecomment-4931704602>

### d0sboots

- **Getting better at BB means understanding the environment, and the endpoint of that is reading the source.** "the endpoint of which is reading the source code and becoming a contributor XD"
  <https://github.com/bitburner-official/bitburner-src/issues/1899#issuecomment-2576863422>
- **Localization is a first-day-of-project decision.** "Adding support incrementally is a minor cost; fixing everything after-the-fact is a huge one." Prefers the wiki-fork model for docs.
  <https://github.com/bitburner-official/bitburner-src/issues/1447#issuecomment-2209546886>
  <https://github.com/bitburner-official/bitburner-src/issues/3040#issuecomment-5233808525>
- **Warnings are essentially errors. Don't tolerate warning blindness.**
  <https://github.com/bitburner-official/bitburner-src/pull/1216#issuecomment-2218562004>
- **Avoid huge, "touch-the-whole-world" PRs.** Small pieces land, big ones die.
  <https://github.com/bitburner-official/bitburner-src/issues/1447#issuecomment-2211403810>
- **Pure-information APIs shouldn't require Singularity gating.** "Especially in this case, when the information is constant."
  <https://github.com/bitburner-official/bitburner-src/issues/1018#issuecomment-1879318876>
- **Don't add complicated state tracking and error cases for zero benefit.** "if there's no gain to be had from it, there's no reason to use it."
  <https://github.com/bitburner-official/bitburner-src/issues/2068#issuecomment-2777366010>
- **Encapsulation isn't optional.** A `RunningScript` should hand out its title, not leak the internal-undefined-means-default detail to every call site.
  <https://github.com/bitburner-official/bitburner-src/pull/2877#discussion_r3425922391>
- **Undocumented behavior stays undocumented.** Reserve implementation flexibility.
  <https://github.com/bitburner-official/bitburner-src/issues/1494#issuecomment-2234435094>
- **Small vendetta: `forEach` isn't functional programming and has hidden gotchas.** `map` and `reduce` are fine.
  <https://github.com/bitburner-official/bitburner-src/pull/1990#discussion_r2038560674>

---

*Compiled from PR and issue comments 2023 to 2026. Where a link points to
`#discussion_r…`, it is a PR review comment; `#issuecomment-…` is a general
issue or PR comment.*
