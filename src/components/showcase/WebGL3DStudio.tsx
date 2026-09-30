import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { useVault } from '../../context/VaultContext';
import { soundFx } from '../../utils/audio';
import { 
  RotateCw, 
  Layers, 
  Eye, 
  Sun, 
  Sparkles, 
  Compass, 
  Volume2, 
  VolumeX, 
  Maximize2,
  Info
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
    name: 'Dual-Chamber Zoom Air™',
    desc: 'Pressurized gas capsules deliver 89% kinetic energy return on heel strike.',
    pos: [-0.6, -0.4, 0.4]
  },
  {
    id: 'carbon_shank',
    name: 'Torsional Carbon Plate',
    desc: 'Aerospace-grade 3K carbon fiber plate preventing torsional foot twist.',
    pos: [0, -0.2, 0.35]
  },
  {
    id: 'aeroweave_upper',
    name: 'VaporWeave™ Mono-Mesh',
    desc: 'Seamless hydrophobic upper engineered with dynamic tensile lock cables.',
    pos: [0.6, 0.4, 0.3]
  }
];

export const WebGL3DStudio: React.FC = () => {
  const { activeProduct, activeColorway } = useVault();
  
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // States
  const [isExploded, setIsExploded] = useState(false);
  const [isWireframe, setIsWireframe] = useState(false);
  const [isAutoSpin, setIsAutoSpin] = useState(true);
  const [lightingPreset, setLightingPreset] = useState<LightingPreset>('cyber');
  const [activeHotspot, setActiveHotspot] = useState<Hotspot | null>(null);
  const [fps, setFps] = useState(60);
  const [isMuted, setIsMuted] = useState(soundFx.getMuted());

  // Scene references
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  
  // Group containing model parts for exploded view
  const shoeGroupRef = useRef<THREE.Group | null>(null);
  const upperMeshRef = useRef<THREE.Mesh | null>(null);
  const soleMeshRef = useRef<THREE.Mesh | null>(null);
  const airPodMeshRef = useRef<THREE.Mesh | null>(null);
  const shankMeshRef = useRef<THREE.Mesh | null>(null);
  const swooshMeshRef = useRef<THREE.Mesh | null>(null);
  const lacesMeshRef = useRef<THREE.Mesh | null>(null);

  // Lights
  const keyLightRef = useRef<THREE.DirectionalLight | null>(null);
  const fillLightRef = useRef<THREE.DirectionalLight | null>(null);
  const rimLightRef = useRef<THREE.PointLight | null>(null);
  const ambientLightRef = useRef<THREE.AmbientLight | null>(null);

  // Orbit controls state
  const isDraggingRef = useRef(false);
  const previousMousePositionRef = useRef({ x: 0, y: 0 });
  const rotationVelocityRef = useRef({ x: 0, y: 0.005 });
  const targetRotationRef = useRef({ x: 0.2, y: 0 });
  const currentRotationRef = useRef({ x: 0.2, y: 0 });

  // FPS Calculation
  const frameCountRef = useRef(0);
  const lastTimeRef = useRef(performance.now());

  // Handle Audio Mute Toggle
  const handleToggleMute = () => {
    const muted = soundFx.toggleMute();
    setIsMuted(muted);
  };

  // Setup Three.js Scene
  useEffect(() => {
    if (!containerRef.current || !canvasRef.current) return;

    const width = containerRef.current.clientWidth;
    const height = containerRef.current.clientHeight || 450;

    // 1. Scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // 2. Camera
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 0.5, 4.2);
    cameraRef.current = camera;

    // 3. Renderer with antialiasing & tone mapping
    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance'
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    rendererRef.current = renderer;

    // 4. Lighting System
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);
    ambientLightRef.current = ambientLight;

    const keyLight = new THREE.DirectionalLight(0x00f0ff, 2.5);
    keyLight.position.set(4, 5, 4);
    scene.add(keyLight);
    keyLightRef.current = keyLight;

    const fillLight = new THREE.DirectionalLight(0xff007f, 1.8);
    fillLight.position.set(-4, -2, -3);
    scene.add(fillLight);
    fillLightRef.current = fillLight;

    const rimLight = new THREE.PointLight(0xffffff, 3, 10);
    rimLight.position.set(0, 3, -3);
    scene.add(rimLight);
    rimLightRef.current = rimLight;

    // 5. Build Procedural 3D Luxury Sneaker Model
    const shoeGroup = new THREE.Group();
    shoeGroupRef.current = shoeGroup;
    scene.add(shoeGroup);

    // Dynamic color parsing
    const baseColor = new THREE.Color(activeColorway.hex || '#111111');
    const accentColor = new THREE.Color(activeColorway.accentHex || '#00f0ff');

    // Upper Shell Geometry
    const upperGeo = new THREE.CapsuleGeometry(0.7, 1.4, 16, 32);
    upperGeo.scale(1.2, 0.65, 0.7);
    upperGeo.rotateZ(Math.PI / 16);
    const upperMat = new THREE.MeshPhysicalMaterial({
      color: baseColor,
      roughness: 0.35,
      metalness: 0.15,
      clearcoat: 0.4,
      clearcoatRoughness: 0.1
    });
    const upperMesh = new THREE.Mesh(upperGeo, upperMat);
    upperMesh.position.set(0, 0.1, 0);
    upperMeshRef.current = upperMesh;
    shoeGroup.add(upperMesh);

    // Sole & Cushion Midsole Geometry
    const soleGeo = new THREE.BoxGeometry(2.4, 0.28, 0.9, 12, 4, 12);
    const soleMat = new THREE.MeshStandardMaterial({
      color: 0x0e0f14,
      roughness: 0.7,
      metalness: 0.05
    });
    const soleMesh = new THREE.Mesh(soleGeo, soleMat);
    soleMesh.position.set(0, -0.4, 0);
    soleMeshRef.current = soleMesh;
    shoeGroup.add(soleMesh);

    // Zoom Air Capsule Pods
    const airGeo = new THREE.CylinderGeometry(0.24, 0.24, 0.18, 24);
    airGeo.rotateX(Math.PI / 2);
    const airMat = new THREE.MeshPhysicalMaterial({
      color: accentColor,
      transmission: 0.85,
      opacity: 1,
      transparent: true,
      roughness: 0.1,
      ior: 1.5,
      emissive: accentColor,
      emissiveIntensity: 0.3
    });
    const airPodMesh = new THREE.Mesh(airGeo, airMat);
    airPodMesh.position.set(-0.6, -0.38, 0);
    airPodMeshRef.current = airPodMesh;
    shoeGroup.add(airPodMesh);

    // Carbon Fiber Arch Plate
    const shankGeo = new THREE.BoxGeometry(0.8, 0.06, 0.5);
    const shankMat = new THREE.MeshStandardMaterial({
      color: 0x1a1a1a,
      roughness: 0.2,
      metalness: 0.85
    });
    const shankMesh = new THREE.Mesh(shankGeo, shankMat);
    shankMesh.position.set(0, -0.3, 0);
    shankMeshRef.current = shankMesh;
    shoeGroup.add(shankMesh);

    // Glowing Holographic Accent Swoosh / Crest
    const swooshGeo = new THREE.TorusGeometry(0.55, 0.04, 12, 36, Math.PI * 0.75);
    swooshGeo.rotateZ(-Math.PI / 6);
    const swooshMat = new THREE.MeshStandardMaterial({
      color: accentColor,
      emissive: accentColor,
      emissiveIntensity: 1.2,
      roughness: 0.1,
      metalness: 0.9
    });
    const swooshMesh = new THREE.Mesh(swooshGeo, swooshMat);
    swooshMesh.position.set(0.1, 0.15, 0.42);
    swooshMeshRef.current = swooshMesh;
    shoeGroup.add(swooshMesh);

    // Laces & Lock Dial
    const laceGeo = new THREE.TorusGeometry(0.35, 0.03, 8, 24);
    laceGeo.rotateX(Math.PI / 2);
    const laceMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      roughness: 0.8
    });
    const lacesMesh = new THREE.Mesh(laceGeo, laceMat);
    lacesMesh.position.set(0.3, 0.45, 0);
    lacesMeshRef.current = lacesMesh;
    shoeGroup.add(lacesMesh);

    // 6. Ground Reflective Pedestal & Holographic Ring
    const groundRingGeo = new THREE.RingGeometry(1.4, 1.45, 48);
    groundRingGeo.rotateX(-Math.PI / 2);
    const groundRingMat = new THREE.MeshBasicMaterial({
      color: accentColor,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.45
    });
    const groundRing = new THREE.Mesh(groundRingGeo, groundRingMat);
    groundRing.position.set(0, -0.85, 0);
    scene.add(groundRing);

    // 7. Ambient Particle Dust Motes
    const particleCount = 75;
    const particleGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount * 3; i += 3) {
      positions[i] = (Math.random() - 0.5) * 6;
      positions[i + 1] = (Math.random() - 0.5) * 4;
      positions[i + 2] = (Math.random() - 0.5) * 6;
    }
    particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const particleMat = new THREE.PointsMaterial({
      color: accentColor,
      size: 0.04,
      transparent: true,
      opacity: 0.6
    });
    const particleSystem = new THREE.Points(particleGeo, particleMat);
    scene.add(particleSystem);

    // 8. Animation Loop with FPS Counter
    let animId: number;
    const animate = () => {
      animId = requestAnimationFrame(animate);

      // FPS tracking
      frameCountRef.current++;
      const now = performance.now();
      if (now - lastTimeRef.current >= 1000) {
        setFps(frameCountRef.current);
        frameCountRef.current = 0;
        lastTimeRef.current = now;
      }

      // Continuous slow particle drift
      particleSystem.rotation.y += 0.001;

      // Handle Smooth Orbit / Damping
      if (!isDraggingRef.current && isAutoSpin) {
        targetRotationRef.current.y += 0.008;
      }

      // Smooth interpolation (lerp)
      currentRotationRef.current.x += (targetRotationRef.current.x - currentRotationRef.current.x) * 0.1;
      currentRotationRef.current.y += (targetRotationRef.current.y - currentRotationRef.current.y) * 0.1;

      if (shoeGroupRef.current) {
        shoeGroupRef.current.rotation.x = currentRotationRef.current.x;
        shoeGroupRef.current.rotation.y = currentRotationRef.current.y;

        // Smooth exploded view translation
        const targetSoleY = isExploded ? -0.8 : -0.4;
        const targetUpperY = isExploded ? 0.45 : 0.1;
        const targetAirY = isExploded ? -0.65 : -0.38;
        const targetShankY = isExploded ? -0.55 : -0.3;

        if (soleMeshRef.current) {
          soleMeshRef.current.position.y += (targetSoleY - soleMeshRef.current.position.y) * 0.1;
        }
        if (upperMeshRef.current) {
          upperMeshRef.current.position.y += (targetUpperY - upperMeshRef.current.position.y) * 0.1;
        }
        if (airPodMeshRef.current) {
          airPodMeshRef.current.position.y += (targetAirY - airPodMeshRef.current.position.y) * 0.1;
        }
        if (shankMeshRef.current) {
          shankMeshRef.current.position.y += (targetShankY - shankMeshRef.current.position.y) * 0.1;
        }
      }

      renderer.render(scene, camera);
    };
    animate();

    // Resize Handler
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

  // Update Colors & Materials dynamically on colorway change
  useEffect(() => {
    if (!upperMeshRef.current || !swooshMeshRef.current || !airPodMeshRef.current) return;

    const baseColor = new THREE.Color(activeColorway.hex);
    const accentColor = new THREE.Color(activeColorway.accentHex);

    const upperMat = upperMeshRef.current.material as THREE.MeshPhysicalMaterial;
    upperMat.color.set(baseColor);

    const swooshMat = swooshMeshRef.current.material as THREE.MeshStandardMaterial;
    swooshMat.color.set(accentColor);
    swooshMat.emissive.set(accentColor);

    const airMat = airPodMeshRef.current.material as THREE.MeshPhysicalMaterial;
    airMat.color.set(accentColor);
    airMat.emissive.set(accentColor);

    if (keyLightRef.current) {
      keyLightRef.current.color.set(accentColor);
    }
  }, [activeColorway]);

  // Handle Wireframe Toggle
  useEffect(() => {
    const meshes = [
      upperMeshRef.current,
      soleMeshRef.current,
      airPodMeshRef.current,
      shankMeshRef.current,
      swooshMeshRef.current,
      lacesMeshRef.current
    ];

    meshes.forEach(m => {
      if (m && m.material) {
        const mat = m.material as THREE.Material & { wireframe?: boolean };
        mat.wireframe = isWireframe;
      }
    });
  }, [isWireframe]);

  // Handle Studio Lighting Presets
  useEffect(() => {
    if (!keyLightRef.current || !fillLightRef.current || !ambientLightRef.current || !rimLightRef.current) return;

    if (lightingPreset === 'cyber') {
      ambientLightRef.current.color.setHex(0x1a1a2e);
      ambientLightRef.current.intensity = 0.9;
      keyLightRef.current.color.setHex(0x00f0ff);
      keyLightRef.current.intensity = 2.8;
      fillLightRef.current.color.setHex(0xff007f);
      fillLightRef.current.intensity = 2.2;
      rimLightRef.current.color.setHex(0x00f0ff);
    } else if (lightingPreset === 'studio') {
      ambientLightRef.current.color.setHex(0xffffff);
      ambientLightRef.current.intensity = 1.4;
      keyLightRef.current.color.setHex(0xffffff);
      keyLightRef.current.intensity = 3.0;
      fillLightRef.current.color.setHex(0xe2e8f0);
      fillLightRef.current.intensity = 1.8;
      rimLightRef.current.color.setHex(0xffffff);
    } else if (lightingPreset === 'uv') {
      ambientLightRef.current.color.setHex(0x1e0826);
      ambientLightRef.current.intensity = 0.6;
      keyLightRef.current.color.setHex(0xa855f7);
      keyLightRef.current.intensity = 3.2;
      fillLightRef.current.color.setHex(0x3b82f6);
      fillLightRef.current.intensity = 2.0;
      rimLightRef.current.color.setHex(0xec4899);
    } else if (lightingPreset === 'golden') {
      ambientLightRef.current.color.setHex(0x2d1f0d);
      ambientLightRef.current.intensity = 0.8;
      keyLightRef.current.color.setHex(0xf59e0b);
      keyLightRef.current.intensity = 3.0;
      fillLightRef.current.color.setHex(0xef4444);
      fillLightRef.current.intensity = 1.6;
      rimLightRef.current.color.setHex(0xfcd34d);
    }
  }, [lightingPreset]);

  // Pointer Drag Handlers for 3D Orbiting
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

    if (Math.abs(deltaX) > 5) {
      soundFx.playOrbitTick();
    }
  };

  const handlePointerUp = () => {
    isDraggingRef.current = false;
  };

  // Reset 3D Camera Pose
  const handleResetCamera = () => {
    targetRotationRef.current = { x: 0.2, y: 0 };
    soundFx.playClick(900);
  };

  // Toggle Exploded View
  const handleToggleExploded = () => {
    setIsExploded(!isExploded);
    soundFx.playHoloEngage();
  };

  // Toggle Wireframe
  const handleToggleWireframe = () => {
    setIsWireframe(!isWireframe);
    soundFx.playLaserChirp();
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

      {/* Top Floating Studio HUD */}
      <div className="absolute top-4 left-4 right-4 flex items-center justify-between pointer-events-none z-10">
        <div className="flex items-center gap-2 pointer-events-auto">
          <div className="flex items-center gap-1.5 px-3 py-1 bg-black/60 backdrop-blur-xl border border-white/10 rounded-full text-[10px] font-mono font-bold text-zinc-300">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>WebGL 3D STUDIO</span>
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
          {/* Exploded View */}
          <button
            type="button"
            onClick={handleToggleExploded}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-mono font-bold backdrop-blur-xl border transition-all cursor-pointer ${
              isExploded
                ? 'bg-[#ff0055] text-white border-[#ff0055] shadow-lg shadow-pink-500/30'
                : 'bg-black/60 text-zinc-300 hover:text-white border-white/10 hover:bg-black/80'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>{isExploded ? 'Collapse' : 'Explode 3D'}</span>
          </button>

          {/* Wireframe / Hologram X-Ray */}
          <button
            type="button"
            onClick={handleToggleWireframe}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-mono font-bold backdrop-blur-xl border transition-all cursor-pointer ${
              isWireframe
                ? 'bg-cyan-400 text-black border-cyan-400 shadow-lg shadow-cyan-500/30 font-black'
                : 'bg-black/60 text-zinc-300 hover:text-white border-white/10 hover:bg-black/80'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>{isWireframe ? 'Shaded' : 'X-Ray'}</span>
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
            <span>{isAutoSpin ? 'Spin ON' : 'Spin OFF'}</span>
          </button>
        </div>

        {/* Right Camera Reset */}
        <div className="flex items-center gap-2 pointer-events-auto">
          <button
            type="button"
            onClick={handleResetCamera}
            className="p-2 bg-black/60 hover:bg-black/90 backdrop-blur-xl border border-white/10 rounded-xl text-zinc-400 hover:text-white transition-all cursor-pointer"
            title="Reset 3D Orbit Pose"
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
