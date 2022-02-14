# Gitline

a simple (possibly cross platform) electron application that shows a timeline of all git commits in a project in a cool UI that shows you a timelapse the progress you made.

# Installation

Download a binary from releases, or install it from the AUR (when i figure out how to do that)

in your terminal emulator of choice, cd into the directory of whatever git repository you want to use and then run the binary.
GIT MUST BE INSTALLED

# Flags

to be implemented

# Build Instructions

```
git clone https://github.com/CoolElectronics/gitline
cd gitline
npm install --save-dev electron-packager
npm install
npx electron-packager . gitline --platform=<platform> --arch=x86_64
```
