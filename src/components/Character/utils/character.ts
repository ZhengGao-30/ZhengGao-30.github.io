import * as THREE from "three";
import { DRACOLoader, GLTF, GLTFLoader } from "three-stdlib";
import { setCharTimeline, setAllTimeline } from "../../utils/GsapScroll";
import { decryptFile } from "./decrypt";

type ModelSource =
  | {
      type: "gltf";
      url: string;
    }
  | {
      type: "encrypted";
      url: string;
      password: string;
    };

const DEFAULT_MODEL_URL = "/models/character.glb";
const LEGACY_ENCRYPTED_MODEL_URL = "/models/character.enc?v=2";
const LEGACY_MODEL_PASSWORD = "MyCharacter12";
const REPLACEMENT_MODEL_HEIGHT = 5.8;
const REPLACEMENT_MODEL_CENTER_Y = 10.2;

const getModelSources = (): ModelSource[] => {
  const customModelUrl = import.meta.env.VITE_CHARACTER_MODEL_URL as
    | string
    | undefined;
  const sources: ModelSource[] = [];

  if (customModelUrl) {
    sources.push({ type: "gltf", url: customModelUrl });
  }

  if (customModelUrl !== DEFAULT_MODEL_URL) {
    sources.push({ type: "gltf", url: DEFAULT_MODEL_URL });
  }

  sources.push({
    type: "encrypted",
    url: LEGACY_ENCRYPTED_MODEL_URL,
    password: LEGACY_MODEL_PASSWORD,
  });

  return sources;
};

const setCharacter = (
  renderer: THREE.WebGLRenderer,
  scene: THREE.Scene,
  camera: THREE.PerspectiveCamera
) => {
  const loader = new GLTFLoader();
  const dracoLoader = new DRACOLoader();
  dracoLoader.setDecoderPath("/draco/");
  loader.setDRACOLoader(dracoLoader);

  const loadGltfFromUrl = (url: string) => {
    return new Promise<GLTF>((resolve, reject) => {
      loader.load(url, resolve, undefined, reject);
    });
  };

  const loadEncryptedGltf = async (
    source: Extract<ModelSource, { type: "encrypted" }>
  ) => {
    const encryptedBlob = await decryptFile(source.url, source.password);
    const blobUrl = URL.createObjectURL(
      new Blob([encryptedBlob], { type: "model/gltf-binary" })
    );

    try {
      return await loadGltfFromUrl(blobUrl);
    } finally {
      URL.revokeObjectURL(blobUrl);
    }
  };

  const normalizeReplacementModel = (character: THREE.Object3D) => {
    const box = new THREE.Box3().setFromObject(character);
    const size = new THREE.Vector3();
    const center = new THREE.Vector3();
    box.getSize(size);
    box.getCenter(center);

    if (size.y === 0) return;

    const scale = REPLACEMENT_MODEL_HEIGHT / size.y;
    character.scale.multiplyScalar(scale);
    character.position.x -= center.x * scale;
    character.position.z -= center.z * scale;
    character.position.y += REPLACEMENT_MODEL_CENTER_Y - center.y * scale;
  };

  const applyModelDefaults = async (gltf: GLTF, normalizeModel: boolean) => {
    const character = gltf.scene;
    if (normalizeModel) {
      normalizeReplacementModel(character);
    }

    await renderer.compileAsync(character, camera, scene);

    character.traverse((child: THREE.Object3D) => {
      if (!(child instanceof THREE.Mesh)) return;

      if (child.material && !Array.isArray(child.material)) {
        if (child.name === "BODY.SHIRT") {
          const newMat = child.material.clone() as THREE.MeshStandardMaterial;
          newMat.color = new THREE.Color("#8B4513");
          child.material = newMat;
        } else if (child.name === "Pant") {
          const newMat = child.material.clone() as THREE.MeshStandardMaterial;
          newMat.color = new THREE.Color("#000000");
          child.material = newMat;
        }
      }

      child.castShadow = true;
      child.receiveShadow = true;
      child.frustumCulled = true;
    });

    character.getObjectByName("footR")?.position.setY(3.36);
    character.getObjectByName("footL")?.position.setY(3.36);
  };

  const loadCharacter = async () => {
    for (const source of getModelSources()) {
      try {
        const gltf =
          source.type === "encrypted"
            ? await loadEncryptedGltf(source)
            : await loadGltfFromUrl(source.url);

        await applyModelDefaults(gltf, source.type === "gltf");

        const character = gltf.scene;
        setCharTimeline(character, camera);
        setAllTimeline();

        dracoLoader.dispose();

        return gltf;
      } catch (error) {
        console.warn(`Failed to load character model: ${source.url}`, error);
      }
    }

    throw new Error("No character model could be loaded.");
  };

  return { loadCharacter };
};

export default setCharacter;
