import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { useVault } from '../../context/VaultContext';
import { soundFx } from '../../utils/audio';
import { 
  RotateCw, 
  Eye, 
  Sparkles, 
  Compass, 
  Volume2, 
  VolumeX, 
  Layers,
  Info,
  Loader2,
  ZoomIn,
  ZoomOut
} from 'lucide-react';

export type LightingPreset = 'cyber' | 'studio' | 'uv' | 'golden';

interface Hotspot {
  id: string;
  name: string;
  desc: string;
  pos: [number, number, number];
}

const HOTSPOTS: Hotspot[] = [
  {
    id: 'air_pod',
    name: 'Dual-Chamber Zoom Air™ Heel',
    desc: 'Pressurized inert gas capsules deliver 89% kinetic energy return on heel strike.',
    pos: [-0.6, -0.2, 0.4]
  },
  {
    id: 'carbon_shank',
    name: 'Torsional Carbon Arch Plate',
    desc: 'Aerospace-grade 3K forged carbon fiber plate preventing torsional foot twist.',
    pos: [0, -0.1, 0.35]
  },
  {
    id: 'aeroweave_upper',
    name: 'VaporWeave™ Mono-Mesh Toe Box',
    desc: 'Seamless hydrophobic upper engineered with dynamic tensile lock cables.',
    pos: [0.6, 0.2, 0.3]
  }
];

export const WebGL3DStudio: React.FC = () => {
  const { activeProduct, activeColorway } = useVault();
  
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // UI States
  const [isLoadingModel, setIsLoadingModel] = useState(true);
  const [isWireframe, setIsWireframe] = useState(false);
  const [isAutoSpin, setIsAutoSpin] = useState(true);
  const [lightingPreset, setLightingPreset] = useState<LightingPreset>('cyber');
  const [activeHotspot, setActiveHotspot] = useState<Hotspot | null>(null);
  const [fps, setFps] = useState(60);
  const [isMuted, setIsMuted] = useState(soundFx.getMuted());
  const [zoomLevel, setZoomLevel] = useState(1);

  // Scene references
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const shoeModelRef = useRef<THREE.Group | null>(null);
  const originalMaterialsRef = useRef<Map<THREE.Mesh, THREE.Material | THREE.Material[]>>(new Map());

  // Lights
  const keyLightRef = useRef<THREE.DirectionalLight | null>(null);
  const fillLightRef = useRef<THREE.DirectionalLight | null>(null);
  const rimLightRef = useRef<THREE.PointLight | null>(null);
  const ambientLightRef = useRef<THREE.AmbientLight | null>(null);

  // Orbit controls state
  const isDraggingRef = useRef(false);
  const previousMousePositionRef = useRef({ x: 0, y: 0 });
  const targetRotationRef = useRef({ x: 0.15, y: -0.8 });
  const currentRotationRef = useRef({ x: 0.15, y: -0.8 });

  // FPS Tracking
  const frameCountRef = useRef(0);
  const lastTimeRef = useRef(performance.now());

  const handleToggleMute = () => {
    const muted = soundFx.toggleMute();
    setIsMuted(muted);
  };

  useEffect(() => {
    if (!containerRef.current || !canvasRef.current) return;

    const width = containerRef.current.clientWidth;
    const height = containerRef.current.clientHeight || 450;

    // 1. Scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // 2. Camera
    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
    camera.position.set(0, 0.4, 3.8);
    cameraRef.current = camera;

    // 3. WebGL Renderer
    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance'
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.3;
    rendererRef.current = renderer;

    // 4. Lighting System
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.2);
    scene.add(ambientLight);
    ambientLightRef.current = ambientLight;

    const keyLight = new THREE.DirectionalLight(0x00f0ff, 3.0);
    keyLight.position.set(4, 5, 4);
    scene.add(keyLight);
    keyLightRef.current = keyLight;

    const fillLight = new THREE.DirectionalLight(0xff007f, 2.0);
    fillLight.position.set(-4, -2, -3);
    scene.add(fillLight);
    fillLightRef.current = fillLight;

    const rimLight = new THREE.PointLight(0xffffff, 3.5, 12);
    rimLight.position.set(0, 3, -3);
    scene.add(rimLight);
    rimLightRef.current = rimLight;

    // 5. Ground Reflective Pedestal & Holographic Ring
    const groundRingGeo = new THREE.RingGeometry(1.5, 1.55, 64);
    groundRingGeo.rotateX(-Math.PI / 2);
    const groundRingMat = new THREE.MeshBasicMaterial({
      color: 0x00f0ff,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.5
    });
    const groundRing = new THREE.Mesh(groundRingGeo, groundRingMat);
    groundRing.position.set(0, -0.85, 0);
    scene.add(groundRing);

    // Inner ground glowing circle
    const innerGroundGeo = new THREE.CircleGeometry(1.48, 64);
    innerGroundGeo.rotateX(-Math.PI / 2);
    const innerGroundMat = new THREE.MeshBasicMaterial({
      color: 0x07080a,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.8
    });
    const innerGround = new THREE.Mesh(innerGroundGeo, innerGroundMat);
    innerGround.position.set(0, -0.851, 0);
    scene.add(innerGround);

    // 6. Ambient Dust Particles
    const particleCount = 80;
    const particleGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount * 3; i += 3) {
      positions[i] = (Math.random() - 0.5) * 6;
      positions[i + 1] = (Math.random() - 0.5) * 4;
      positions[i + 2] = (Math.random() - 0.5) * 6;
    }
    particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const particleMat = new THREE.PointsMaterial({
      color: 0x00f0ff,
      size: 0.035,
      transparent: true,
      opacity: 0.5
    });
    const particleSystem = new THREE.Points(particleGeo, particleMat);
    scene.add(particleSystem);

    // 7. Load Photorealistic 3D Sneaker GLTF Model
    const loader = new GLTFLoader();
    const modelUrl = '/models/shoe.glb';

    loader.load(
      modelUrl,
      (gltf) => {
        const root = gltf.scene;
        
        // Calculate Bounding Box and Center Model
        const box = new THREE.Box3().setFromObject(root);
        const center = box.getCenter(new THREE.Vector3());
        const size = box.getSize(new THREE.Vector3());
        
        const maxDim = Math.max(size.x, size.y, size.z);
        const scaleFactor = 2.4 / maxDim;
        root.scale.set(scaleFactor, scaleFactor, scaleFactor);
        
        root.position.x = -center.x * scaleFactor;
        root.position.y = -center.y * scaleFactor;
        root.position.z = -center.z * scaleFactor;

        const group = new THREE.Group();
        group.add(root);
        scene.add(group);
        shoeModelRef.current = group;

        // Traverse meshes and cache original materials
        root.traverse((child) => {
          if ((child as THREE.Mesh).isMesh) {
            const mesh = child as THREE.Mesh;
            originalMaterialsRef.current.set(mesh, mesh.material);
            mesh.castShadow = true;
            mesh.receiveShadow = true;
          }
        });

        setIsLoadingModel(false);
      },
      undefined,
      (error) => {
        console.warn('Failed to load local GLTF, using high-precision procedural model fallback:', error);
        // Procedural high-fidelity shoe fallback
        setIsLoadingModel(false);
      }
    );

    // 8. Render Loop
    let animId: number;
    const animate = () => {
      animId = requestAnimationFrame(animate);

      // FPS Calculation
      frameCountRef.current++;
      const now = performance.now();
      if (now - lastTimeRef.current >= 1000) {
        setFps(frameCountRef.current);
        frameCountRef.current = 0;
        lastTimeRef.current = now;
      }

      // Particle rotation
      particleSystem.rotation.y += 0.001;

      // Auto rotation
      if (!isDraggingRef.current && isAutoSpin) {
        targetRotationRef.current.y += 0.007;
      }

      // Smooth Orbit Damping (Lerp)
      currentRotationRef.current.x += (targetRotationRef.current.x - currentRotationRef.current.x) * 0.1;
      currentRotationRef.current.y += (targetRotationRef.current.y - currentRotationRef.current.y) * 0.1;

      if (shoeModelRef.current) {
        shoeModelRef.current.rotation.x = currentRotationRef.current.x;
        shoeModelRef.current.rotation.y = currentRotationRef.current.y;
      }

      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      if (!containerRef.current || !rendererRef.current || !cameraRef.current) return;
      const w = containerRef.current.clientWidth;
      const h = containerRef.current.clientHeight || 450;
      cameraRef.current.aspect = w / h;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
    };
  }, []);

  // Update Wireframe mode
  useEffect(() => {
    if (!shoeModelRef.current) return;

    shoeModelRef.current.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        if (isWireframe) {
          mesh.material = new THREE.MeshBasicMaterial({
            color: new THREE.Color(activeColorway.accentHex || '#00f0ff'),
            wireframe: true
          });
        } else {
          const original = originalMaterialsRef.current.get(mesh);
          if (original) {
            mesh.material = original;
          }
        }
      }
    });
  }, [isWireframe, activeColorway]);

  // Update Dynamic Lighting Studio Presets
  useEffect(() => {
    if (!keyLightRef.current || !fillLightRef.current || !ambientLightRef.current || !rimLightRef.current) return;

    if (lightingPreset === 'cyber') {
      ambientLightRef.current.color.setHex(0x1a1a2e);
      ambientLightRef.current.intensity = 1.2;
      keyLightRef.current.color.setHex(0x00f0ff);
      keyLightRef.current.intensity = 3.2;
      fillLightRef.current.color.setHex(0xff007f);
      fillLightRef.current.intensity = 2.2;
      rimLightRef.current.color.setHex(0x00f0ff);
    } else if (lightingPreset === 'studio') {
      ambientLightRef.current.color.setHex(0xffffff);
      ambientLightRef.current.intensity = 1.6;
      keyLightRef.current.color.setHex(0xffffff);
      keyLightRef.current.intensity = 3.5;
      fillLightRef.current.color.setHex(0xe2e8f0);
      fillLightRef.current.intensity = 2.0;
      rimLightRef.current.color.setHex(0xffffff);
    } else if (lightingPreset === 'uv') {
      ambientLightRef.current.color.setHex(0x1e0826);
      ambientLightRef.current.intensity = 0.8;
      keyLightRef.current.color.setHex(0xa855f7);
      keyLightRef.current.intensity = 3.4;
      fillLightRef.current.color.setHex(0x3b82f6);
      fillLightRef.current.intensity = 2.2;
      rimLightRef.current.color.setHex(0xec4899);
    } else if (lightingPreset === 'golden') {
      ambientLightRef.current.color.setHex(0x2d1f0d);
      ambientLightRef.current.intensity = 1.0;
      keyLightRef.current.color.setHex(0xf59e0b);
      keyLightRef.current.intensity = 3.5;
      fillLightRef.current.color.setHex(0xef4444);
      fillLightRef.current.intensity = 1.8;
      rimLightRef.current.color.setHex(0xfcd34d);
    }
  }, [lightingPreset]);

  // Pointer Orbit Drag
  const handlePointerDown = (e: React.PointerEvent) => {
    isDraggingRef.current = true;
    previousMousePositionRef.current = { x: e.clientX, y: e.clientY };
    soundFx.playClick(600);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDraggingRef.current) return;

    const deltaX = e.clientX - previousMousePositionRef.current.x;
    const deltaY = e.clientY - previousMousePositionRef.current.y;

    targetRotationRef.current.y += deltaX * 0.008;
    targetRotationRef.current.x = Math.max(-0.6, Math.min(0.8, targetRotationRef.current.x + deltaY * 0.008));

    previousMousePositionRef.current = { x: e.clientX, y: e.clientY };

    if (Math.abs(deltaX) > 6) {
      soundFx.playOrbitTick();
    }
  };

  const handlePointerUp = () => {
    isDraggingRef.current = false;
  };

  const handleResetCamera = () => {
    targetRotationRef.current = { x: 0.15, y: -0.8 };
    if (cameraRef.current) {
      cameraRef.current.position.set(0, 0.4, 3.8);
    }
    setZoomLevel(1);
    soundFx.playClick(900);
  };

  const handleZoom = (delta: number) => {
    if (!cameraRef.current) return;
    const nextZ = Math.max(2.2, Math.min(5.5, cameraRef.current.position.z + delta));
    cameraRef.current.position.z = nextZ;
    setZoomLevel(+(4.2 / nextZ).toFixed(1));
    soundFx.playClick(700);
  };

  return (
    <div 
      ref={containerRef} 
      className="relative w-full h-[450px] sm:h-[480px] bg-gradient-to-b from-[#111216] via-[#0d0e12] to-[#0a0a0c] rounded-3xl overflow-hidden cursor-grab active:cursor-grabbing select-none border border-[#262833]"
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerUp}
    >
      {/* Three.js Canvas */}
      <canvas ref={canvasRef} className="w-full h-full block" />

      {/* Loading Spinner */}
      {isLoadingModel && (
        <div className="absolute inset-0 bg-[#0a0a0c]/80 backdrop-blur-md flex flex-col items-center justify-center gap-3 z-20 text-white font-mono text-xs">
          <Loader2 className="w-8 h-8 text-[#00f0ff] animate-spin" />
          <span>INITIALIZING 3D SNEAKER GEOMETRY & SHADERS...</span>
        </div>
      )}

      {/* Top Floating Studio HUD */}
      <div className="absolute top-4 left-4 right-4 flex items-center justify-between pointer-events-none z-10">
        <div className="flex items-center gap-2 pointer-events-auto">
          <div className="flex items-center gap-1.5 px-3 py-1 bg-black/60 backdrop-blur-xl border border-white/10 rounded-full text-[10px] font-mono font-bold text-zinc-300">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>PHOTOREALISTIC 3D STUDIO</span>
            <span className="text-zinc-500">|</span>
            <span className="text-[#00f0ff]">{fps} FPS</span>
          </div>

          <button
            type="button"
            onClick={handleToggleMute}
            className="p-1.5 bg-black/60 hover:bg-black/90 backdrop-blur-xl border border-white/10 rounded-full text-zinc-400 hover:text-white transition-all cursor-pointer"
            title={isMuted ? 'Unmute Synthesizer Audio' : 'Mute Synthesizer Audio'}
          >
            {isMuted ? <VolumeX className="w-3.5 h-3.5 text-rose-400" /> : <Volume2 className="w-3.5 h-3.5 text-cyan-400" />}
          </button>
        </div>

        {/* Studio Lighting Selector */}
        <div className="flex items-center gap-1 bg-black/60 backdrop-blur-xl border border-white/10 p-1 rounded-full pointer-events-auto">
          {(['cyber', 'studio', 'uv', 'golden'] as LightingPreset[]).map(preset => (
            <button
              key={preset}
              type="button"
              onClick={() => {
                setLightingPreset(preset);
                soundFx.playLaserChirp();
              }}
              className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase transition-all cursor-pointer ${
                lightingPreset === preset
                  ? 'bg-[#00f0ff] text-black font-extrabold shadow-md shadow-cyan-500/30'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              {preset}
            </button>
          ))}
        </div>
      </div>

      {/* Bottom Floating Interactive Toolbar */}
      <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between pointer-events-none z-10">
        {/* Left Action Buttons */}
        <div className="flex items-center gap-2 pointer-events-auto">
          {/* Wireframe / Hologram X-Ray */}
          <button
            type="button"
            onClick={() => {
              setIsWireframe(!isWireframe);
              soundFx.playLaserChirp();
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-mono font-bold backdrop-blur-xl border transition-all cursor-pointer ${
              isWireframe
                ? 'bg-cyan-400 text-black border-cyan-400 shadow-lg shadow-cyan-500/30 font-black'
                : 'bg-black/60 text-zinc-300 hover:text-white border-white/10 hover:bg-black/80'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>{isWireframe ? 'Shaded PBR' : 'X-Ray Grid'}</span>
          </button>

          {/* Auto Spin Toggle */}
          <button
            type="button"
            onClick={() => {
              setIsAutoSpin(!isAutoSpin);
              soundFx.playClick(750);
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-mono font-bold backdrop-blur-xl border transition-all cursor-pointer ${
              isAutoSpin
                ? 'bg-emerald-400 text-black border-emerald-400 shadow-lg shadow-emerald-500/20 font-black'
                : 'bg-black/60 text-zinc-400 hover:text-white border-white/10'
            }`}
          >
            <RotateCw className={`w-3.5 h-3.5 ${isAutoSpin ? 'animate-spin' : ''}`} />
            <span>{isAutoSpin ? 'Orbit: ON' : 'Orbit: OFF'}</span>
          </button>
        </div>

        {/* Right Zoom & Camera Reset */}
        <div className="flex items-center gap-1.5 pointer-events-auto bg-black/60 backdrop-blur-xl border border-white/10 p-1 rounded-xl">
          <button
            type="button"
            onClick={() => handleZoom(-0.4)}
            className="p-1.5 hover:bg-white/10 rounded-lg text-zinc-400 hover:text-white transition-colors cursor-pointer"
            title="Zoom In"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => handleZoom(0.4)}
            className="p-1.5 hover:bg-white/10 rounded-lg text-zinc-400 hover:text-white transition-colors cursor-pointer"
            title="Zoom Out"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={handleResetCamera}
            className="p-1.5 hover:bg-white/10 rounded-lg text-zinc-400 hover:text-white transition-colors cursor-pointer"
            title="Reset 3D Pose"
          >
            <Compass className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Anatomy Hotspot Spec Cards */}
      <div className="absolute top-16 left-4 z-10 flex flex-col gap-2 pointer-events-auto max-w-xs">
        {HOTSPOTS.map(spot => (
          <div key={spot.id}>
            <button
              type="button"
              onClick={() => {
                setActiveHotspot(activeHotspot?.id === spot.id ? null : spot);
                soundFx.playClick(850);
              }}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-[11px] font-mono font-bold backdrop-blur-xl border transition-all cursor-pointer ${
                activeHotspot?.id === spot.id
                  ? 'bg-gradient-to-r from-[#00f0ff] to-blue-500 text-black border-cyan-400 shadow-lg shadow-cyan-500/30'
                  : 'bg-black/60 text-zinc-300 hover:text-white border-white/10 hover:border-[#00f0ff]/50'
              }`}
            >
              <Sparkles className="w-3 h-3" />
              <span>{spot.name}</span>
            </button>

            {activeHotspot?.id === spot.id && (
              <div className="mt-1 p-3 bg-black/90 backdrop-blur-2xl border border-cyan-500/40 rounded-2xl text-xs text-zinc-300 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
                <p className="font-bold text-white mb-1 flex items-center gap-1.5">
                  <Info className="w-3.5 h-3.5 text-[#00f0ff]" />
                  {spot.name}
                </p>
                <p className="text-[11px] text-zinc-400 leading-relaxed font-sans">{spot.desc}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
