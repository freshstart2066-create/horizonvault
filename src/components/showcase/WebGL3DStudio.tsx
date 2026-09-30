import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { useVault } from '../../context/VaultContext';
import { soundFx } from '../../utils/audio';
import { 
  RotateCw, 
  Compass, 
  Volume2, 
  VolumeX, 
  ZoomIn, 
  ZoomOut, 
  Loader2,
  SunMedium
} from 'lucide-react';

export type StudioLighting = 'softbox' | 'editorial' | 'noir' | 'daylight';

export const WebGL3DStudio: React.FC = () => {
  const { activeColorway } = useVault();
  
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // States
  const [isLoadingModel, setIsLoadingModel] = useState(true);
  const [isAutoSpin, setIsAutoSpin] = useState(true);
  const [lightingMode, setLightingMode] = useState<StudioLighting>('softbox');
  const [isMuted, setIsMuted] = useState(soundFx.getMuted());

  // Scene references
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const shoeModelRef = useRef<THREE.Group | null>(null);

  // Studio Lights
  const keyLightRef = useRef<THREE.DirectionalLight | null>(null);
  const fillLightRef = useRef<THREE.DirectionalLight | null>(null);
  const rimLightRef = useRef<THREE.DirectionalLight | null>(null);
  const ambientLightRef = useRef<THREE.AmbientLight | null>(null);

  // Orbit controls state
  const isDraggingRef = useRef(false);
  const previousMousePositionRef = useRef({ x: 0, y: 0 });
  const targetRotationRef = useRef({ x: 0.12, y: -0.75 });
  const currentRotationRef = useRef({ x: 0.12, y: -0.75 });

  const handleToggleMute = () => {
    const muted = soundFx.toggleMute();
    setIsMuted(muted);
  };

  useEffect(() => {
    if (!containerRef.current || !canvasRef.current) return;

    const width = containerRef.current.clientWidth;
    const height = containerRef.current.clientHeight || 480;

    // 1. Scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // 2. Camera with natural 50mm portrait lens FOV
    const camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 100);
    camera.position.set(0, 0.35, 3.7);
    cameraRef.current = camera;

    // 3. WebGL Renderer with High-End Color Management
    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance'
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    rendererRef.current = renderer;

    // 4. Professional Studio Lighting Setup
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.4);
    scene.add(ambientLight);
    ambientLightRef.current = ambientLight;

    const keyLight = new THREE.DirectionalLight(0xffffff, 2.8);
    keyLight.position.set(3, 4, 3);
    scene.add(keyLight);
    keyLightRef.current = keyLight;

    const fillLight = new THREE.DirectionalLight(0xf1f5f9, 1.6);
    fillLight.position.set(-3, 1, -2);
    scene.add(fillLight);
    fillLightRef.current = fillLight;

    const rimLight = new THREE.DirectionalLight(0xffffff, 2.0);
    rimLight.position.set(0, 3, -3);
    scene.add(rimLight);
    rimLightRef.current = rimLight;

    // 5. Realistic Studio Floor with Soft Ambient Occlusion Disc
    const shadowGeo = new THREE.PlaneGeometry(3.2, 3.2);
    shadowGeo.rotateX(-Math.PI / 2);
    
    // Create radial shadow gradient texture procedurally
    const shadowCanvas = document.createElement('canvas');
    shadowCanvas.width = 256;
    shadowCanvas.height = 256;
    const ctx = shadowCanvas.getContext('2d');
    if (ctx) {
      const grad = ctx.createRadialGradient(128, 128, 10, 128, 128, 120);
      grad.addColorStop(0, 'rgba(0, 0, 0, 0.65)');
      grad.addColorStop(0.5, 'rgba(0, 0, 0, 0.2)');
      grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 256, 256);
    }
    const shadowTexture = new THREE.CanvasTexture(shadowCanvas);
    const shadowMat = new THREE.MeshBasicMaterial({
      map: shadowTexture,
      transparent: true,
      depthWrite: false
    });
    const shadowMesh = new THREE.Mesh(shadowGeo, shadowMat);
    shadowMesh.position.set(0, -0.68, 0);
    scene.add(shadowMesh);

    // 6. Load Photorealistic 3D Sneaker Asset
    const loader = new GLTFLoader();
    loader.load(
      '/models/shoe.glb',
      (gltf) => {
        const root = gltf.scene;
        
        // Exact Bounding Box Normalization
        const box = new THREE.Box3().setFromObject(root);
        const center = box.getCenter(new THREE.Vector3());
        const size = box.getSize(new THREE.Vector3());
        
        const maxDim = Math.max(size.x, size.y, size.z);
        const scaleFactor = 2.3 / maxDim;
        root.scale.set(scaleFactor, scaleFactor, scaleFactor);
        
        root.position.x = -center.x * scaleFactor;
        root.position.y = -center.y * scaleFactor;
        root.position.z = -center.z * scaleFactor;

        const group = new THREE.Group();
        group.add(root);
        scene.add(group);
        shoeModelRef.current = group;

        setIsLoadingModel(false);
      },
      undefined,
      (err) => {
        console.warn('Model loading fallback:', err);
        setIsLoadingModel(false);
      }
    );

    // 7. Render Loop with Smooth Damping
    let animId: number;
    const animate = () => {
      animId = requestAnimationFrame(animate);

      if (!isDraggingRef.current && isAutoSpin) {
        targetRotationRef.current.y += 0.006;
      }

      currentRotationRef.current.x += (targetRotationRef.current.x - currentRotationRef.current.x) * 0.08;
      currentRotationRef.current.y += (targetRotationRef.current.y - currentRotationRef.current.y) * 0.08;

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
      const h = containerRef.current.clientHeight || 480;
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

  // Update Studio Lighting Presets
  useEffect(() => {
    if (!keyLightRef.current || !fillLightRef.current || !ambientLightRef.current || !rimLightRef.current) return;

    if (lightingMode === 'softbox') {
      ambientLightRef.current.color.setHex(0xffffff);
      ambientLightRef.current.intensity = 1.4;
      keyLightRef.current.color.setHex(0xffffff);
      keyLightRef.current.intensity = 2.8;
      fillLightRef.current.color.setHex(0xf8fafc);
      fillLightRef.current.intensity = 1.6;
      rimLightRef.current.color.setHex(0xffffff);
    } else if (lightingMode === 'editorial') {
      ambientLightRef.current.color.setHex(0xfff7ed);
      ambientLightRef.current.intensity = 1.2;
      keyLightRef.current.color.setHex(0xfde68a);
      keyLightRef.current.intensity = 3.0;
      fillLightRef.current.color.setHex(0xfbbf24);
      fillLightRef.current.intensity = 1.4;
      rimLightRef.current.color.setHex(0xffedd5);
    } else if (lightingMode === 'noir') {
      ambientLightRef.current.color.setHex(0x1e293b);
      ambientLightRef.current.intensity = 0.6;
      keyLightRef.current.color.setHex(0xffffff);
      keyLightRef.current.intensity = 3.8;
      fillLightRef.current.color.setHex(0x475569);
      fillLightRef.current.intensity = 0.8;
      rimLightRef.current.color.setHex(0x94a3b8);
    } else if (lightingMode === 'daylight') {
      ambientLightRef.current.color.setHex(0xf0fdf4);
      ambientLightRef.current.intensity = 1.5;
      keyLightRef.current.color.setHex(0xffffff);
      keyLightRef.current.intensity = 3.2;
      fillLightRef.current.color.setHex(0xdbeafe);
      fillLightRef.current.intensity = 1.8;
      rimLightRef.current.color.setHex(0xffffff);
    }
  }, [lightingMode]);

  // Pointer Drag Handlers
  const handlePointerDown = (e: React.PointerEvent) => {
    isDraggingRef.current = true;
    previousMousePositionRef.current = { x: e.clientX, y: e.clientY };
    soundFx.playClick(600);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDraggingRef.current) return;

    const deltaX = e.clientX - previousMousePositionRef.current.x;
    const deltaY = e.clientY - previousMousePositionRef.current.y;

    targetRotationRef.current.y += deltaX * 0.007;
    targetRotationRef.current.x = Math.max(-0.5, Math.min(0.7, targetRotationRef.current.x + deltaY * 0.007));

    previousMousePositionRef.current = { x: e.clientX, y: e.clientY };

    if (Math.abs(deltaX) > 6) {
      soundFx.playOrbitTick();
    }
  };

  const handlePointerUp = () => {
    isDraggingRef.current = false;
  };

  const handleResetCamera = () => {
    targetRotationRef.current = { x: 0.12, y: -0.75 };
    if (cameraRef.current) {
      cameraRef.current.position.set(0, 0.35, 3.7);
    }
    soundFx.playClick(850);
  };

  const handleZoom = (delta: number) => {
    if (!cameraRef.current) return;
    cameraRef.current.position.z = Math.max(2.2, Math.min(5.0, cameraRef.current.position.z + delta));
    soundFx.playClick(700);
  };

  return (
    <div 
      ref={containerRef} 
      className="relative w-full h-[460px] sm:h-[500px] bg-[#111216] rounded-3xl overflow-hidden cursor-grab active:cursor-grabbing select-none border border-[#232530]"
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerUp}
    >
      {/* Three.js Canvas */}
      <canvas ref={canvasRef} className="w-full h-full block" />

      {/* Loading Overlay */}
      {isLoadingModel && (
        <div className="absolute inset-0 bg-[#111216]/90 backdrop-blur-sm flex flex-col items-center justify-center gap-3 z-20 text-zinc-300 font-mono text-xs">
          <Loader2 className="w-6 h-6 text-zinc-400 animate-spin" />
          <span>Loading 3D Studio Assets...</span>
        </div>
      )}

      {/* Top Controls Bar */}
      <div className="absolute top-4 left-4 right-4 flex items-center justify-between pointer-events-none z-10">
        <div className="flex items-center gap-2 pointer-events-auto">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-[#171820]/90 backdrop-blur-md border border-[#232530] rounded-full text-[11px] font-mono text-zinc-300">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span>STUDIO 360° VIEW</span>
          </div>

          <button
            type="button"
            onClick={handleToggleMute}
            className="p-2 bg-[#171820]/90 hover:bg-[#20222c] backdrop-blur-md border border-[#232530] rounded-full text-zinc-400 hover:text-white transition-all cursor-pointer"
            title={isMuted ? 'Unmute Audio' : 'Mute Audio'}
          >
            {isMuted ? <VolumeX className="w-3.5 h-3.5 text-zinc-500" /> : <Volume2 className="w-3.5 h-3.5 text-zinc-200" />}
          </button>
        </div>

        {/* Studio Lighting Preset Pills */}
        <div className="flex items-center gap-1 bg-[#171820]/90 backdrop-blur-md border border-[#232530] p-1 rounded-full pointer-events-auto">
          {(['softbox', 'editorial', 'noir', 'daylight'] as StudioLighting[]).map(mode => (
            <button
              key={mode}
              type="button"
              onClick={() => {
                setLightingMode(mode);
                soundFx.playLaserChirp();
              }}
              className={`px-2.5 py-1 rounded-full text-[10px] font-mono uppercase tracking-wider transition-all cursor-pointer ${
                lightingMode === mode
                  ? 'bg-white text-black font-bold shadow-sm'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              {mode}
            </button>
          ))}
        </div>
      </div>

      {/* Bottom Floating Interactive Toolbar */}
      <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between pointer-events-none z-10">
        {/* Auto Rotation Button */}
        <div className="flex items-center gap-2 pointer-events-auto">
          <button
            type="button"
            onClick={() => {
              setIsAutoSpin(!isAutoSpin);
              soundFx.playClick(750);
            }}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-mono backdrop-blur-md border transition-all cursor-pointer ${
              isAutoSpin
                ? 'bg-white text-black border-white font-bold'
                : 'bg-[#171820]/90 text-zinc-300 hover:text-white border-[#232530]'
            }`}
          >
            <RotateCw className={`w-3.5 h-3.5 ${isAutoSpin ? 'animate-spin' : ''}`} />
            <span>{isAutoSpin ? 'Auto-Rotate: On' : 'Auto-Rotate: Off'}</span>
          </button>
        </div>

        {/* Zoom & Reset Controls */}
        <div className="flex items-center gap-1.5 pointer-events-auto bg-[#171820]/90 backdrop-blur-md border border-[#232530] p-1 rounded-xl">
          <button
            type="button"
            onClick={() => handleZoom(-0.35)}
            className="p-1.5 hover:bg-white/10 rounded-lg text-zinc-400 hover:text-white transition-colors cursor-pointer"
            title="Zoom In"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => handleZoom(0.35)}
            className="p-1.5 hover:bg-white/10 rounded-lg text-zinc-400 hover:text-white transition-colors cursor-pointer"
            title="Zoom Out"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={handleResetCamera}
            className="p-1.5 hover:bg-white/10 rounded-lg text-zinc-400 hover:text-white transition-colors cursor-pointer"
            title="Reset Perspective"
          >
            <Compass className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
