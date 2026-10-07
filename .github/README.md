# Minecraft Ring

Minecraft movement, building and combat in the Lands Between: real Minecraft drawn into Elden Ring's frame (offline).

**Minecraft Ring is made by [siddoff](https://github.com/siddoff).** All credit for the mod goes to them. It is built on [justbustin/minecraft-crossover-bridge](https://github.com/justbustin/minecraft-crossover-bridge) by justbustin (minecraft-crossover-bridge).

- Original project: https://github.com/siddoff/Minecraft-Ring
- Report bugs and ask questions there: https://github.com/siddoff/Minecraft-Ring/issues
- Upstream version packaged here: 0.3.0 (commit [`711015a`](https://github.com/siddoff/Minecraft-Ring/tree/711015afa67ab25c7b9597c68038718d1cef322e))
- **Built by SIGF from commit [`711015afa67ab25c7b9597c68038718d1cef322e`](https://github.com/siddoff/Minecraft-Ring/tree/711015afa67ab25c7b9597c68038718d1cef322e)**, on a disposable build machine (AWS EC2 i-0ce16aee59cfee816 (c6i.2xlarge, Windows Server 2022, eu-west-1 default VPC, no inbound, SSM only; terminated after the build); llvm-mingw 20260922 ucrt x86_64 (sha256 e3ad77d1...7666) via upstream tools/build_native.py, JDK Temurin 25 + upstream Gradle wrapper (Loom 1.18.2), Go 1.27.1 for the SIGF shim). The app installs these SIGF builds, not binaries from the author.

> **Beta.** Nobody at SIGF has played this build yet. Back up your saves.
> Bugs in the mod itself go to the author's issue tracker above; problems with the one-click install go to this repository's issues.

## What you need

- **Elden Ring** ([Steam](https://store.steampowered.com/app/1245620/)): App Ver. 1.17.1, eldenring.exe 2.7.1.0 (checked by the author).
- **Minecraft**: Java Edition 1.21.1.
- Windows and the [SIGF app](https://sigf.ai). The app installs fabric-loader 0.19.5, fabric-api 0.116.17+1.21.1 for you.

## Install

In the SIGF app, open **Minecraft Ring** in the catalog, press **Install**, then **Play**. **Restore** puts your game folders back exactly as they were.
The app follows `mashup.json` in this repository: every download is pinned by sha256. The files come from the release [`v0.3.0`](../../releases/tag/v0.3.0).

### How to play

- Explore the Lands Between with Minecraft's controls: build with your blocks and inventory, and fight Elden Ring's enemies with Minecraft weapons.
- Press Play: Minecraft starts first, then Elden Ring offline. Choose Continue in Elden Ring; Minecraft opens its bridge world by itself.
- WASD, mouse, Space, Shift move; mouse buttons break/attack and place/use; E inventory; F5 camera; R uses doors, levers, items and graces.
- F8 hands control to Elden Ring for its menus and back. The first world is creative: type /gamemode survival to take enemy hits.

### Good to know

- You need Elden Ring on Steam at App Ver. 1.17.1 (exe 2.7.1.0; other builds unverified) and Minecraft: Java Edition. Two games run at once.
- Offline only: Elden Ring is started without Easy Anti-Cheat and the bridge refuses to load next to it. Never take this game folder online.
- Experimental: terrain, transitions, moving platforms and rendering have rough edges; GPU sharing and window transparency depend on your driver. Single player.
- Install only one Elden Ring mashup at a time (EldenCraft, Minecraft-Ring, ER Mario...): they use the same dinput8.dll and data folders. Restore the other first.
- No upstream release: SIGF built it from the author's source; nobody has played this exact build yet. Beta: report bugs to the author on the upstream issue tracker.

## Built by SIGF, offline only

Minecraft-Ring has no upstream release. SIGF built this commit unchanged on a disposable Windows builder (llvm-mingw 20260922 through upstream's `tools/build_native.py`; JDK 25 + upstream's Gradle wrapper). Two builds from fresh trees gave the same jar and DLLs that differ only in their PE timestamp. Upstream's bridge loads only when `ERBRIDGE=1` is set, so the app starts Elden Ring through `mr-launch.exe`, which sets it and starts `eldenring.exe` directly: Easy Anti-Cheat stays off and the game is offline. Never take this game folder online. Do not install it together with another Elden Ring mashup.

## What this repository holds

1. The upstream source tree at commit [`711015afa67ab25c7b9597c68038718d1cef322e`](https://github.com/siddoff/Minecraft-Ring/tree/711015afa67ab25c7b9597c68038718d1cef322e), every file unchanged (same git blobs). Upstream's own `README.md` is there, unchanged; GitHub shows this file (`.github/README.md`) first.
2. Added by SIGF in the same commit: this file, `sigf/shim/` (the source of `mr-launch.exe` (ours, MIT)), and `sigf/` (the scripts that built the release assets, for reference: they run inside the SIGF repository).
3. `mashup.json`, the SIGF app recipe (the next commit).
4. The release `v0.3.0` (its tag is the first commit):

| Asset | Size | sha256 | What it is |
|---|---|---|---|
| `minecraft-ring-eldenring.zip` | 1145856 B | `6a9f843c48532b9821e79be12090389058b5a2b73c2c2d018b426605548a79b7` | the SIGF builds of `Game/dinput8.dll` and `Game/erbridge/erbridge_core.dll` from the pinned commit (llvm-mingw 20260922, upstream's `tools/build_native.py`; MinHook linked in, BSD-2-Clause), `Game/steam_appid.txt` (`1245620`, as upstream's Install.ps1 writes it), our launch shim `Game/mr-launch.exe` (source in `sigf/shim`: it starts `eldenring.exe` with `ERBRIDGE=1`, offline, without Easy Anti-Cheat), and upstream's LICENSE, THIRD_PARTY_NOTICES and the MinHook license under `Game/MinecraftRing/`; into the Elden Ring folder. |
| `minecraft-ring.mrpack` | 231350 B | `987e26f2f14c8c1ffc2f06aac3e7d358d3f7886fea4aedfec656606f67d79788` | the Minecraft side: the SIGF build of `er-bridge-0.3.0.jar` from the pinned commit, with upstream's LICENSE, for Minecraft 1.21.1 with Fabric Loader 0.19.5; Fabric API 0.116.17+1.21.1 is a Modrinth download link, not stored here. |

The sha256 of every file inside the zips is in `mashup.json` (`contents`).

## Licenses

| Part | License | Where |
|---|---|---|
| Minecraft-Ring (all of the upstream tree, and the SIGF builds) | MIT, Copyright siddoff; derived from justbustin/minecraft-crossover-bridge (MIT) | `LICENSE`, `THIRD_PARTY_NOTICES.md` |
| MinHook (linked into `erbridge_core.dll`) | BSD-2-Clause | `bridge-base/elden-ring/er-bridge/third_party/minhook/LICENSE.txt` |
| `mr-launch.exe` and `sigf/shim` (ours) | MIT | this README |
| Fabric API (downloaded from Modrinth by the app, not stored here) | Apache-2.0 | https://github.com/FabricMC/fabric |

## Why this repository exists

The SIGF app (https://sigf.ai) installs mods from recipes (`mashup.json`) whose downloads are pinned release files. This repository makes Minecraft Ring installable in one click, credited to siddoff. If you are the author and want anything changed or taken down, open an issue here.
