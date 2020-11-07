## 4.3.0 (2020-11-07) (https://github.com/Kiyozz/papyrus-compiler-app/compare/v4.2.0...v4.3.0)

### Features

    * create/update group dialog now focus on name input (#48 (https://github.com/Kiyozz/papyrus-compiler-app/issues/48)) (7677270 (https://github.com/Kiyozz/papyrus-compiler-app/commit/76772704fee34f91658f5928646f6ff3427c626a)), closes #43 (https://github.com/Kiyozz/papyrus-compiler-app/issues/43)
    * papyrus compiler path no longer relative to game path (#45 (https://github.com/Kiyozz/papyrus-compiler-app/issues/45)) (8bbae32 (https://github.com/Kiyozz/papyrus-compiler-app/commit/8bbae32a9be02e3396a3d48323e7ad4f2f50081e)), closes #42 (https://github.com/Kiyozz/papyrus-compiler-app/issues/42) #40 (https://github.com/Kiyozz/papyrus-compiler-app/issues/40)
    * better bad installation error message (#45 (https://github.com/Kiyozz/papyrus-compiler-app/issues/45)) (8bbae32 (https://github.com/Kiyozz/papyrus-compiler-app/commit/8bbae32a9be02e3396a3d48323e7ad4f2f50081e)), closes #42 (https://github.com/Kiyozz/papyrus-compiler-app/issues/42) #40 (https://github.com/Kiyozz/papyrus-compiler-app/issues/40)
    * scripts list no longer displays "last modified at" (#41 (https://github.com/Kiyozz/papyrus-compiler-app/issues/41)) (537b9ae (https://github.com/Kiyozz/papyrus-compiler-app/commit/537b9ae80bce8618366873bfe2b6b7f3c11024b6)), closes #39 (https://github.com/Kiyozz/papyrus-compiler-app/issues/39)

### Bug Fixes

    * configuration reset (#47 (https://github.com/Kiyozz/papyrus-compiler-app/issues/47)) (e60dd3b (https://github.com/Kiyozz/papyrus-compiler-app/commit/e60dd3b689811f48e08f5a0d56d0b3b92dc46dac)), closes #44 (https://github.com/Kiyozz/papyrus-compiler-app/issues/44)
    * performance on typing game path or mo2 instance (#54 (https://github.com/Kiyozz/papyrus-compiler-app/issues/54)) (9dcc4b2 (https://github.com/Kiyozz/papyrus-compiler-app/commit/9dcc4b2e90748cc7081f2518000c92f672ac6674)), closes #50 (https://github.com/Kiyozz/papyrus-compiler-app/issues/50)

## 4.2.0 (2020-10-27) (https://github.com/Kiyozz/papyrus-compiler-app/compare/v4.1.1...v4.2.0)

### Features

    * Input folder now accept manually added text (#35)
    * Changelog alert silent (#37)
    * Swap colors of buttons in compilation page (#38)
    * Update dependencies (#36)

### Bug Fixes

    * Allow logs to be selectable (#34)

### 4.1.1 (2020-08-24) (https://github.com/Kiyozz/papyrus-compiler-app/compare/v4.1.0...v4.1.1)

    * Using the app through MO2 VFS re-works

## 4.1.0 (2020-08-23)

### Features

    * Changelog dialog improved
    * Global refactoring
    * Preferences is now handled in a json file
    * Preferences can be reset via the app menu
    * Preferences can be opened via the app menu
    * Theme of the app updated
    * Report a bug via the new button "Help > Report bug"
    * Open the log file of the previous session with "Help > Previous session logs"
    * The button to open log file has been removed from UI in favor of app menu button
    * List of scripts from MO2 in settings removed
    * Path of the MO2 "mods" folder can be set in preferences in the json file relative to the mo2 instance
    * Output default can be set in the json file relative to the gamePath
    * Output mo2 can be set in the json file relative to the mo2 instance
