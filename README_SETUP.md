## Getting Started


### Install Node.js

You will need to install Node on your computer to run this project locally.

You can [download it directly](https://nodejs.org/en/download) from the node website, version 18 recommended.

   ------------

Alternatively, you can use NVM to manage node instead. Unix terminal:

`
brew install nvm
`

For Windows use [this guide to set up nvm-windows.](https://learn.microsoft.com/en-us/windows/dev-environment/javascript/nodejs-on-windows)


Then run `nvm use 18` in the terminal in this project's root directory.


### Download this project

I recommend [installing Git](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git) to manage your source files. 

I also suggest making a GitHub account and hitting "Fork" in the top-right to have your own space to save your scripts online.

Run these commands in your terminal or command window in the directory you want this project to be placed into:
```
git clone https://github.com/ficocelliguy/viteburner-template.git;
cd viteburner-template;
npm i;
```

  ----------

Alternatively, you can [download this project as a Zip file](https://github.com/ficocelliguy/viteburner-template/archive/refs/heads/main.zip) and unpack it where you want it to live, and not use Git.


### Set up this project

In your terminal or command line, navigate to the directory this file is in, and run this command to install and set up the project:

`
npm i
`

### Start the server to copy your scripts to Bitburner

In your terminal or command line, run 

`
npm start
`

Viteburner will start, and log the port number it is listening for (default: `31337`)

In Bitburner, select `⚙ Options` on the bottom-left, go to "Remote API", enter the port that viteburner displays, and click "Connect".


### Troubleshooting

If you run into issues, make sure that the "API server" is enabled in the menu at the top. Also try picking a different port number and using that in both Bitburner and the `port` property in `vite.config.ts`

If the terminal shows `error TS2307: Cannot find module '@ns' or its corresponding type declarations.` (or see the same error at your editor), it is fine. The missing type declaration "NetscriptDefinitions.d.ts" will be downloaded from the game once connected. If there is some issue with that, you can manually [download it from the game's github source](https://github.com/bitburner-official/bitburner-src/blob/cef452d35ebce7ca17d7ef124996daa31fd55e3e/src/ScriptEditor/NetscriptDefinitions.d.ts#L1) and add it to the root directory of this project.

If all else fails, you can try the [typescript template made by the game's devs](https://github.com/bitburner-official/typescript-template/). The documentation there can be helpful with debugging issues, or you can use that as a template instead, if this one gets out-of-date.


### Tools used in this stack:
- [TypeScript](https://www.typescriptlang.org/)
- [Node](https://nodejs.org/en/)
- [Vite](https://vitejs.dev/)
- [ESLint](https://eslint.org/)