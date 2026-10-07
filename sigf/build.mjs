// Minecraft-Ring (siddoff, MIT): real Minecraft 1.21.1 composited into Elden Ring's D3D12 frame (a dinput8.dll proxy +
// erbridge_core.dll with MinHook, linked to the Fabric mod `erbridge` through file mappings in %TEMP%\ermc). Windows
// adaptation of justbustin/minecraft-crossover-bridge. No upstream release: SIGF built the pinned commit on a
// disposable AWS builder (library/QC.md section 4; source.json "built"), source unchanged.
// The proxy loads the bridge only when ERBRIDGE=1 is in Elden Ring's environment (er-bridge/src/proxy.cpp:91-110) and
// the recipe format has no env field, so Play starts our shim Game/mr-launch.exe (library/minecraft-ring/shim, MIT),
// which adds ERBRIDGE=1 and starts Game/eldenring.exe directly: no start_protected_game.exe, so Easy Anti-Cheat stays
// off and the game runs offline (with steam_appid.txt, as upstream's Install.ps1 writes it). Upstream's dev-client
// Minecraft launch (offline username) is not used: Minecraft runs in the app's signed-in Prism instance.
//   SIGF_LIBRARY_BUILDS=<dir> node library/minecraft-ring/build.mjs      (outputs: library/lib.mjs)
import { mrpack, resolveFabricApi } from '../../orchestrator/src/recipe.js';
import { asset, card, dl, emit, player, zipAsset } from '../lib.mjs';
import { builtArtifacts, builtField, sourceOf } from '../um-gta5-passthrough/sigf-build.mjs';

const ID = 'minecraft-ring', VERSION = '0.3.0', NAME = 'Minecraft Ring';
const SRC = sourceOf(ID);
const UP = { repo: SRC.repo, commit: SRC.commit, authors: ['siddoff'] };
const MC = { mc: '1.21.1', loader: '0.19.5', fabricApi: '0.116.17+1.21.1', java: '21' }; // mc-bridge/gradle.properties at the commit
const JAR = 'er-bridge-0.3.0.jar';
const TAGLINE = 'Minecraft movement, building and combat in the Lands Between: real Minecraft drawn into Elden Ring\'s frame (offline).';

const files = builtArtifacts(ID);
const er = zipAsset(`${ID}-eldenring.zip`, [
  { name: 'Game/dinput8.dll', data: files.get('dinput8.dll') },
  { name: 'Game/erbridge/erbridge_core.dll', data: files.get('erbridge_core.dll') },
  { name: 'Game/steam_appid.txt', data: Buffer.from('1245620') },
  { name: 'Game/mr-launch.exe', data: files.get('mr-launch.exe') },
  { name: 'Game/MinecraftRing/LICENSE.txt', data: files.get('LICENSE') },
  { name: 'Game/MinecraftRing/THIRD_PARTY_NOTICES.md', data: files.get('THIRD_PARTY_NOTICES.md') },
  { name: 'Game/MinecraftRing/MinHook-LICENSE.txt', data: files.get('MinHook-LICENSE.txt') },
]);
const fabricApi = await resolveFabricApi(MC.fabricApi, MC.mc);
if (!fabricApi?.download) throw new Error(`Fabric API ${MC.fabricApi} not resolved on Modrinth`);
const pack = asset(`${ID}.mrpack`, mrpack({ name: NAME, summary: TAGLINE, versions: MC, versionId: VERSION, fabricApi,
  jars: [{ name: JAR, data: files.get(JAR) }], extra: [{ name: 'overrides/licenses/minecraft-ring-LICENSE.txt', data: files.get('LICENSE') }] }));
const assets = [er, pack];

const make = (urls, set) => {
  const mp = set.find(a => a.name.endsWith('.mrpack'));
  return {
    id: `sigf/${ID}`,
    version: VERSION,
    name: NAME,
    tagline: player(ID).tagline ?? TAGLINE,
    how_to_play: player(ID).howToPlay,
    kind: 'passthrough',
    games: [
      { game: 'eldenring', role: 'host', label: 'Elden Ring', engine: 'Elden Ring (FromSoftware, D3D12) + dinput8.dll proxy and erbridge_core.dll (C++, MinHook)', apps: { steam: '1245620' }, runtime: 'App Ver. 1.17.1, eldenring.exe 2.7.1.0 (checked by the author)' },
      { game: 'minecraft', role: 'guest', label: 'Minecraft', engine: 'Minecraft Java 1.21.1 + Fabric mod erbridge (Java)', mc: MC.mc, loader: `fabric@${MC.loader}`, java: MC.java },
    ],
    requires: [
      { id: 'fabric-loader', version: MC.loader },
      { id: 'fabric-api', version: MC.fabricApi, note: 'in the Minecraft pack (downloaded from Modrinth)' },
    ],
    install: [
      // game-dir-snapshot: Restore puts back any dinput8.dll / steam_appid.txt that was there before.
      { game: 'eldenring', strategy: 'game-dir-snapshot', files: [
        { src: er.name, dst: '{game}', unpack: true, contents: er.contents, ...dl(er, urls) },
      ] },
      { game: 'minecraft', strategy: 'mrpack', jvm_args: ['-Xmx3G'], pack: { src: mp.name, ...dl(mp, urls) } },
    ],
    // Minecraft first (no port: the mod waits for the bridge file mapping), then the shim starts Elden Ring offline.
    launch: [
      { game: 'minecraft' },
      { game: 'eldenring', exe: 'Game/mr-launch.exe', args: [] },
    ],
    files: set.map(a => ({ name: a.name, ...dl(a, urls) })),
    source: {
      repo: UP.repo, license: 'MIT AND BSD-2-Clause', upstream_license: SRC.license, commit: UP.commit,
      hosted: `https://github.com/SIGFAI/${ID}`,
      based_on: 'https://github.com/justbustin/minecraft-crossover-bridge',
      built: builtField(ID),
    },
    media: {},
    built_by: { author: UP.authors[0], authors: [...UP.authors, 'justbustin (minecraft-crossover-bridge)'], packaged_by: 'SIGF' },
    idea_by: UP.authors[0],
    built_at: '2026-10-07T00:00:00.000Z',
    // Never installed together (the app refuses either order): its dinput8.dll proxy loads into every Elden Ring start, the me3 launches of these too.
    conflicts: ['sigf/eldencraft', 'sigf/er-mario', 'sigf/eldenkill'],
    ...card(UP.repo),
    notes: player(ID).notes,
  };
};

emit({ slug: ID, version: VERSION, assets, make });
