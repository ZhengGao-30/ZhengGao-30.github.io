# Character Model

The site loads a single public GLB character model:

```text
/models/character.glb?v=ninja-r2
```

The current model is Kenney Blocky Characters `character-r.glb`, which is the masked ninja-style character shown in the source pack preview.

## Source

- Pack: Kenney Blocky Characters 2.0
- Source file: `Models/GLB format/character-r.glb`
- License: Creative Commons Zero, CC0
- Local license copy: `kenney-blocky-characters-license.txt`

## Replacement

To replace the character later, copy a new `.glb` file to:

```text
Portfolio/public/models/character.glb
```

Then update the cache-busting version in:

```text
src/components/Character/utils/character.ts
```

For example:

```ts
const DEFAULT_MODEL_URL = "/models/character.glb?v=ninja-r3";
```

The old encrypted model fallback was removed. If the GLB fails to load, the page should fail visibly instead of silently showing the wrong legacy character.
