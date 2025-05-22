/*
 * Copyright (c) 2022 Kiyozz~WK~WushuLate.
 *
 * All rights reserved.
 */

import { format } from "url";
import isType from "@sindresorhus/is";
import { BrowserWindow, app } from "electron";
import type { BrowserWindowConstructorOptions } from "electron";
import { is } from "electron-util";
import { debugInfo, isDev } from "electron-util/main";
import { version } from "../common/version";
import { initialize } from "./initialize";
import { Logger } from "./logger";
import { join } from "./path/path";
import { createWindowStore } from "./store/window/store";
import { unhandled } from "./unhandled";

const logger = new Logger("Main");
let win: BrowserWindow | null = null;

unhandled(() => {
  logger.debug("win has been closed because of an error");
  win?.close();
  win = null;
});

async function createWindow() {
  logger.info(debugInfo());
  logger.info("public release: ", version);

  const windowStore = createWindowStore();
  const { x, y } = windowStore.store;

  const windowOptions: BrowserWindowConstructorOptions = {
    width: 800,
    height: isDev ? 1020 : 820,
    minHeight: 600,
    minWidth: 700,
    webPreferences: {
      nodeIntegration: true,
      preload: join(__dirname, "preload.mjs")
    },
    x: isType.null(x) ? undefined : x,
    y: isType.null(y) ? undefined : y,
    show: false
  };

  if (is.macos) {
    windowOptions.titleBarStyle = "hiddenInset";
  } else {
    windowOptions.autoHideMenuBar = true;
    windowOptions.frame = false;
  }

  win = new BrowserWindow(windowOptions);

  if (isDev) {
    // noinspection ES6MissingAwait
    void win.loadURL("http://localhost:9080");
  } else {
    // noinspection ES6MissingAwait
    void win.loadURL(
      format({
        pathname: join(__dirname, "index.html"),
        protocol: "file",
        slashes: true
      })
    );
  }

  await initialize(win, windowStore);

  win.on("closed", () => {
    win = null;
  });

  win.on("ready-to-show", () => {
    win?.show();

    if (isDev) {
      win?.webContents.openDevTools({ mode: "bottom" });
    }
  });
}

app.on("ready", createWindow);

app.on("window-all-closed", () => {
  if (!is.macos) {
    app.quit();
  }
});

app.on("activate", () => {
  if (win === null && app.isReady()) {
    // noinspection JSIgnoredPromiseFromCall
    void createWindow();
  }
});
