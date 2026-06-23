import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { gsap } from 'gsap';

interface GeoMapProps {
  hoveredNode: 'shiyan' | 'wuhan' | null;
  onHoverNode: (node: 'shiyan' | 'wuhan' | null) => void;
}

export default function GeoMap({ hoveredNode, onHoverNode }: GeoMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const hoveredRef = useRef(hoveredNode);
  const screenCoordsRef = useRef({
    shiyan: { x: -999, y: -999 },
    wuhan: { x: -999, y: -999 },
    bj: { x: -999, y: -999 },
    sh: { x: -999, y: -999 },
    gz: { x: -999, y: -999 },
    cd: { x: -999, y: -999 }
  });
  const [screenCoords, setScreenCoords] = useState(screenCoordsRef.current);

  const shiyanCoords = { lat: 32.62, lng: 110.79 };
  const wuhanCoords = { lat: 30.59, lng: 114.30 };
  const referenceCities = [
    { id: 'bj', lng: 116.40, lat: 39.90 },
    { id: 'sh', lng: 121.47, lat: 31.23 },
    { id: 'gz', lng: 113.26, lat: 23.13 },
    { id: 'cd', lng: 104.06, lat: 30.57 }
  ];
  const centerLng = 104.0;
  const centerLat = 36.0;

  const isPointInPolygon = (point: [number, number], vs: [number, number][]) => {
    const x = point[0], y = point[1];
    let inside = false;
    for (let i = 0, j = vs.length - 1; i < vs.length; j = i++) {
      const xi = vs[i][0], yi = vs[i][1];
      const xj = vs[j][0], yj = vs[j][1];
      const intersect = ((yi > y) !== (yj > y))
          && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
      if (intersect) inside = !inside;
    }
    return inside;
  };

  // Scene init — runs once
  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    const scene = new THREE.Scene();
    scene.background = null;

    const width = container.clientWidth;
    const height = container.clientHeight;
    const camera = new THREE.PerspectiveCamera(35, width / height, 0.1, 100);
    camera.position.set(0, 0, 8.2);

    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true,
      preserveDrawingBuffer: true
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    scene.add(new THREE.AmbientLight(0xffffff, 1.3));

    const mapGroup = new THREE.Group();
    scene.add(mapGroup);
    mapGroup.rotation.x = 0.32;
    mapGroup.rotation.y = -0.12;

    const chinaMainBoundary: [number, number][] = [
      [73.56, 39.26], [75.0, 42.0], [79.0, 44.2], [82.0, 45.1], [87.0, 49.0],
      [90.0, 47.8], [94.0, 45.5], [97.0, 42.6], [101.0, 42.6], [105.0, 41.5],
      [110.0, 41.5], [113.8, 44.8], [116.5, 45.2], [119.8, 49.3], [123.5, 53.56],
      [127.2, 51.5], [131.0, 50.2], [135.0, 48.3], [133.5, 45.8], [131.0, 43.1],
      [125.0, 40.2], [121.5, 39.0], [122.5, 37.2], [119.5, 35.1], [121.2, 32.0],
      [121.9, 31.0], [120.8, 28.5], [118.0, 24.3], [114.5, 22.0], [110.2, 20.0],
      [109.5, 18.2], [108.2, 21.5], [104.8, 22.4], [100.2, 21.1], [98.5, 27.8],
      [94.2, 27.2], [88.5, 27.8], [81.5, 30.2], [78.2, 33.1], [74.1, 37.2], [73.56, 39.26]
    ];
    const taiwanBoundary: [number, number][] = [
      [120.0, 22.0], [121.9, 25.1], [121.0, 21.9], [120.0, 22.0]
    ];
    const hainanBoundary: [number, number][] = [
      [108.5, 19.5], [110.5, 19.9], [110.0, 18.3], [108.5, 19.5]
    ];

    const mapTo3D = (lng: number, lat: number) => {
      const x = (lng - centerLng) * 0.088;
      const y = (lat - centerLat) * 0.098;
      const z = -0.05 * (x * x + y * y);
      return new THREE.Vector3(x, y, z);
    };

    // Track all disposable resources
    const geometries: THREE.BufferGeometry[] = [];
    const materials: THREE.Material[] = [];
    const disposableObjects: { material?: THREE.Material }[] = [];

    const createGlowingBorder = (coords: [number, number][], color: number, opacity: number, linewidth: number = 1.5) => {
      const pts: THREE.Vector3[] = coords.map(c => mapTo3D(c[0], c[1]));
      const geom = new THREE.BufferGeometry().setFromPoints(pts);
      const mat = new THREE.LineBasicMaterial({ color, transparent: true, opacity, linewidth });
      geometries.push(geom);
      materials.push(mat);
      return new THREE.Line(geom, mat);
    };

    const mainBorder = createGlowingBorder(chinaMainBoundary, 0x171717, 0.78, 1.8);
    const innerShadowBorder = createGlowingBorder(chinaMainBoundary, 0xa3a3a3, 0.28, 1.0);
    innerShadowBorder.position.z -= 0.02;
    const taiwanBorder = createGlowingBorder(taiwanBoundary, 0x171717, 0.75, 1.5);
    const hainanBorder = createGlowingBorder(hainanBoundary, 0x171717, 0.75, 1.5);
    mapGroup.add(mainBorder, innerShadowBorder, taiwanBorder, hainanBorder);

    // Point cloud
    const pointPositions: number[] = [];
    for (let lng = 73.0; lng <= 135.0; lng += 0.95) {
      for (let lat = 18.0; lat <= 54.0; lat += 1.05) {
        if (isPointInPolygon([lng, lat], chinaMainBoundary) ||
            isPointInPolygon([lng, lat], taiwanBoundary) ||
            isPointInPolygon([lng, lat], hainanBoundary)) {
          const vec = mapTo3D(lng, lat);
          pointPositions.push(vec.x, vec.y, vec.z);
        }
      }
    }
    const dotGeometry = new THREE.BufferGeometry();
    dotGeometry.setAttribute('position', new THREE.Float32BufferAttribute(pointPositions, 3));
    const dotMaterial = new THREE.PointsMaterial({
      color: 0x6e6e6e, size: 0.035, transparent: true, opacity: 0.32, sizeAttenuation: true
    });
    geometries.push(dotGeometry);
    materials.push(dotMaterial);
    mapGroup.add(new THREE.Points(dotGeometry, dotMaterial));

    // Graticules
    const drawGraticule = (startLng: number, endLng: number, startLat: number, endLat: number, isLat: boolean) => {
      const pts: THREE.Vector3[] = [];
      if (isLat) {
        for (let l = startLng; l <= endLng; l += 1) pts.push(mapTo3D(l, startLat));
      } else {
        for (let t = startLat; t <= endLat; t += 1) pts.push(mapTo3D(startLng, t));
      }
      const geom = new THREE.BufferGeometry().setFromPoints(pts);
      const mat = new THREE.LineBasicMaterial({ color: 0xd4d4d4, transparent: true, opacity: 0.22 });
      geometries.push(geom);
      materials.push(mat);
      return new THREE.Line(geom, mat);
    };
    [20, 25, 30, 35, 40, 45, 50].forEach(lat => mapGroup.add(drawGraticule(70, 138, lat, lat, true)));
    [80, 90, 100, 110, 120, 130].forEach(lng => mapGroup.add(drawGraticule(lng, lng, 16, 54, false)));

    // HUD ring
    const ringGeom = new THREE.RingGeometry(3.35, 3.37, 64);
    const ringMat = new THREE.MeshBasicMaterial({ color: 0xbfbfbf, transparent: true, opacity: 0.2, side: THREE.DoubleSide });
    geometries.push(ringGeom);
    materials.push(ringMat);
    const hudRing = new THREE.Mesh(ringGeom, ringMat);
    hudRing.position.set(0, 0, -0.25);
    mapGroup.add(hudRing);

    // City nodes
    const pShiyan = mapTo3D(shiyanCoords.lng, shiyanCoords.lat);
    const pWuhan = mapTo3D(wuhanCoords.lng, wuhanCoords.lat);
    const nodeGeom = new THREE.SphereGeometry(0.08, 16, 16);
    geometries.push(nodeGeom);

    const shiyanNodeMat = new THREE.MeshBasicMaterial({ color: 0x171717 });
    const wuhanNodeMat = new THREE.MeshBasicMaterial({ color: 0x171717 });
    materials.push(shiyanNodeMat, wuhanNodeMat);
    const meshShiyan = new THREE.Mesh(nodeGeom, shiyanNodeMat);
    meshShiyan.position.copy(pShiyan);
    const meshWuhan = new THREE.Mesh(nodeGeom, wuhanNodeMat);
    meshWuhan.position.copy(pWuhan);
    mapGroup.add(meshShiyan, meshWuhan);

    // Halos
    const haloGeom = new THREE.RingGeometry(0.05, 0.2, 24);
    geometries.push(haloGeom);
    const haloMat1 = new THREE.MeshBasicMaterial({ color: 0x171717, side: THREE.DoubleSide, transparent: true, opacity: 0.7 });
    const haloMat2 = haloMat1.clone();
    materials.push(haloMat1, haloMat2);
    const haloShiyan = new THREE.Mesh(haloGeom, haloMat1);
    haloShiyan.position.copy(pShiyan).z += 0.01;
    const haloWuhan = new THREE.Mesh(haloGeom, haloMat2);
    haloWuhan.position.copy(pWuhan).z += 0.01;
    mapGroup.add(haloShiyan, haloWuhan);

    // Reference cities
    const refNodeGeom = new THREE.SphereGeometry(0.04, 12, 12);
    const refNodeMat = new THREE.MeshBasicMaterial({ color: 0xa3a3a3, transparent: true, opacity: 0.5 });
    geometries.push(refNodeGeom);
    materials.push(refNodeMat);
    const cityPositionsMap: Record<string, THREE.Vector3> = {};
    referenceCities.forEach(city => {
      const p = mapTo3D(city.lng, city.lat);
      cityPositionsMap[city.id] = p;
      const refMesh = new THREE.Mesh(refNodeGeom, refNodeMat);
      refMesh.position.copy(p);
      mapGroup.add(refMesh);
    });

    // Bezier arc
    const middlePoint = new THREE.Vector3().addVectors(pShiyan, pWuhan).multiplyScalar(0.5);
    middlePoint.z += 0.45;
    const bezierCurve = new THREE.QuadraticBezierCurve3(pShiyan, middlePoint, pWuhan);
    const curvePoints = bezierCurve.getPoints(60);
    const curveGeom = new THREE.BufferGeometry().setFromPoints(curvePoints);
    const curveMat = new THREE.LineBasicMaterial({ color: 0xd4d4d4, transparent: true, opacity: 0.65, linewidth: 1.2 });
    geometries.push(curveGeom);
    materials.push(curveMat);
    mapGroup.add(new THREE.Line(curveGeom, curveMat));

    // Packets
    const PACKET_COUNT = 5;
    const packetGroup = new THREE.Group();
    mapGroup.add(packetGroup);
    const packets: THREE.Mesh[] = [];
    const packetGeom = new THREE.SphereGeometry(0.045, 12, 12);
    geometries.push(packetGeom);
    for (let i = 0; i < PACKET_COUNT; i++) {
      const pMat = new THREE.MeshBasicMaterial({ color: 0x171717, transparent: true, opacity: 0.95 - (i * 0.18) });
      materials.push(pMat);
      const pMesh = new THREE.Mesh(packetGeom, pMat);
      disposableObjects.push(pMesh);
      packetGroup.add(pMesh);
      packets.push(pMesh);
    }

    // GSAP timeline
    const progressObj = { t: 0 };
    const gsapTimeline = gsap.timeline({ repeat: -1 });
    gsapTimeline.to(progressObj, {
      t: 1.0,
      duration: 2.1,
      ease: "power2.inOut",
      onUpdate: () => {
        for (let i = 0; i < PACKET_COUNT; i++) {
          const lagOffset = i * 0.055;
          const currentT = (progressObj.t - lagOffset + 1.0) % 1.0;
          const pos = bezierCurve.getPointAt(currentT);
          packets[i].position.copy(pos);
          packets[i].scale.setScalar(Math.max(0.25, 1.0 - (i * 0.16)));
        }
      }
    });

    // Drag state
    let isDragging = false;
    let prevMouseX = 0;
    let prevMouseY = 0;
    let targetRotationY = -0.12;
    let targetRotationX = 0.32;

    const onMouseDown = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      if (e.clientX >= rect.left && e.clientX <= rect.right && e.clientY >= rect.top && e.clientY <= rect.bottom) {
        isDragging = true;
        prevMouseX = e.clientX;
        prevMouseY = e.clientY;
      }
    };
    const onMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      targetRotationY = Math.max(-0.55, Math.min(0.25, targetRotationY + (e.clientX - prevMouseX) * 0.0035));
      targetRotationX = Math.max(0.08, Math.min(0.6, targetRotationX + (e.clientY - prevMouseY) * 0.004));
      prevMouseX = e.clientX;
      prevMouseY = e.clientY;
    };
    const onMouseUp = () => { isDragging = false; };

    const onTouchStart = (e: TouchEvent) => {
      const rect = canvas.getBoundingClientRect();
      const touch = e.touches[0];
      if (touch.clientX >= rect.left && touch.clientX <= rect.right && touch.clientY >= rect.top && touch.clientY <= rect.bottom) {
        isDragging = true;
        prevMouseX = touch.clientX;
        prevMouseY = touch.clientY;
      }
    };
    const onTouchMove = (e: TouchEvent) => {
      if (!isDragging || e.touches.length !== 1) return;
      const touch = e.touches[0];
      targetRotationY = Math.max(-0.55, Math.min(0.25, targetRotationY + (touch.clientX - prevMouseX) * 0.0045));
      targetRotationX = Math.max(0.08, Math.min(0.6, targetRotationX + (touch.clientY - prevMouseY) * 0.0045));
      prevMouseX = touch.clientX;
      prevMouseY = touch.clientY;
    };
    const onTouchEnd = () => { isDragging = false; };

    window.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    canvas.addEventListener('touchstart', onTouchStart, { passive: true });
    canvas.addEventListener('touchmove', onTouchMove, { passive: true });
    canvas.addEventListener('touchend', onTouchEnd, { passive: true });

    // Screen projection
    const tempProjV = new THREE.Vector3();
    const updateScreenCoords = () => {
      const halfW = container.clientWidth / 2;
      const halfH = container.clientHeight / 2;

      tempProjV.copy(pShiyan).applyMatrix4(mapGroup.matrixWorld).project(camera);
      const sx = tempProjV.x * halfW + halfW;
      const sy = -tempProjV.y * halfH + halfH;

      tempProjV.copy(pWuhan).applyMatrix4(mapGroup.matrixWorld).project(camera);
      const wx = tempProjV.x * halfW + halfW;
      const wy = -tempProjV.y * halfH + halfH;

      const projCities: Record<string, { x: number, y: number }> = {};
      referenceCities.forEach(city => {
        const pVec = cityPositionsMap[city.id];
        if (pVec) {
          tempProjV.copy(pVec).applyMatrix4(mapGroup.matrixWorld).project(camera);
          projCities[city.id] = { x: tempProjV.x * halfW + halfW, y: -tempProjV.y * halfH + halfH };
        }
      });

      screenCoordsRef.current = {
        shiyan: { x: sx, y: sy },
        wuhan: { x: wx, y: wy },
        bj: projCities['bj'] || { x: -999, y: -999 },
        sh: projCities['sh'] || { x: -999, y: -999 },
        gz: projCities['gz'] || { x: -999, y: -999 },
        cd: projCities['cd'] || { x: -999, y: -999 }
      };
    };

    // Resize
    const onResize = () => {
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    const resizeObserver = new ResizeObserver(() => onResize());
    resizeObserver.observe(container);

    // Animation loop — throttled setState for screen coords
    let animationId: number;
    let pulseCount = 0;
    let frameCount = 0;

    const animate = () => {
      animationId = requestAnimationFrame(animate);

      mapGroup.rotation.y += (targetRotationY - mapGroup.rotation.y) * 0.08;
      mapGroup.rotation.x += (targetRotationX - mapGroup.rotation.x) * 0.08;

      pulseCount += 0.055;
      const pulseScale = 1.0 + Math.sin(pulseCount * 2.5) * 0.28;
      const pulseOpacity = 0.65 - Math.sin(pulseCount * 2.5) * 0.32;

      const h = hoveredRef.current;
      haloShiyan.scale.setScalar(h === 'shiyan' ? pulseScale * 1.5 : pulseScale);
      haloMat1.opacity = h === 'shiyan' ? pulseOpacity : pulseOpacity * 0.4;
      haloWuhan.scale.setScalar(h === 'wuhan' ? pulseScale * 1.5 : pulseScale);
      haloMat2.opacity = h === 'wuhan' ? pulseOpacity : pulseOpacity * 0.4;

      updateScreenCoords();

      // Throttle React setState to ~15fps (every 4 frames at 60fps)
      frameCount++;
      if (frameCount % 4 === 0) {
        setScreenCoords({ ...screenCoordsRef.current });
      }

      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      canvas.removeEventListener('touchstart', onTouchStart);
      canvas.removeEventListener('touchmove', onTouchMove);
      canvas.removeEventListener('touchend', onTouchEnd);
      resizeObserver.disconnect();
      gsapTimeline.kill();
      geometries.forEach(g => g.dispose());
      materials.forEach(m => m.dispose());
      renderer.dispose();
    };
  }, []);

  // Hover update — lightweight, no scene rebuild
  useEffect(() => {
    hoveredRef.current = hoveredNode;
  }, [hoveredNode]);

  return (
    <div
      id="geomap-container-3d"
      ref={containerRef}
      className="relative w-full h-[190px] xs:h-[220px] sm:h-[270px] md:h-[330px] overflow-hidden no-select bg-transparent rounded-2xl"
      onTouchStart={(e) => e.stopPropagation()}
      onTouchMove={(e) => e.stopPropagation()}
      onTouchEnd={(e) => e.stopPropagation()}
    >
      <canvas
        id="geomap-canvas-three"
        ref={canvasRef}
        className="cursor-zinc active:cursor-grabbing block w-full h-full mx-auto"
        role="img"
        aria-label="3D 交互地图，展示十堰到武汉的地理位置轨迹"
      />

      {screenCoords.shiyan.x !== -999 && (
        <div
          id="tag-shiyan"
          style={{
            position: 'absolute',
            left: `${screenCoords.shiyan.x}px`,
            top: `${screenCoords.shiyan.y}px`,
            transform: 'translate(-50%, -132%)',
            pointerEvents: 'none'
          }}
          className="flex flex-col items-center select-none scale-85 xs:scale-95 md:scale-100"
        >
          <div className={`px-2 py-0.5 rounded-md border text-[8px] font-mono shadow-xs transition-all duration-300 ${
            hoveredNode === 'shiyan'
              ? 'bg-neutral-900 text-white border-neutral-900 scale-105 font-bold'
              : 'bg-white/95 text-neutral-600 border-neutral-200'
          }`}>
            十堰 [110.79°E, 32.62°N]
          </div>
          <div className="w-1 h-1.5 border-r border-b border-neutral-200 rotate-45 bg-transparent mt-0.5" />
        </div>
      )}

      {screenCoords.wuhan.x !== -999 && (
        <div
          id="tag-wuhan"
          style={{
            position: 'absolute',
            left: `${screenCoords.wuhan.x}px`,
            top: `${screenCoords.wuhan.y}px`,
            transform: 'translate(-50%, -132%)',
            pointerEvents: 'none'
          }}
          className="flex flex-col items-center select-none scale-85 xs:scale-95 md:scale-100"
        >
          <div className={`px-2 py-0.5 rounded-md border text-[8px] font-mono shadow-xs transition-all duration-300 ${
            hoveredNode === 'wuhan'
              ? 'bg-neutral-900 text-white border-neutral-900 scale-105 font-bold'
              : 'bg-white/95 text-neutral-600 border-neutral-200'
          }`}>
            武汉 [114.30°E, 30.59°N]
          </div>
          <div className="w-1 h-1.5 border-r border-b border-neutral-200 rotate-45 bg-transparent mt-0.5" />
        </div>
      )}

      {screenCoords.bj.x !== -999 && screenCoords.bj.x > 0 && screenCoords.bj.y > 0 && (
        <div style={{ position: 'absolute', left: `${screenCoords.bj.x}px`, top: `${screenCoords.bj.y}px`, transform: 'translate(-50%, -110%)', pointerEvents: 'none' }}
          className="font-mono text-[7px] text-neutral-400 select-none opacity-60">北京</div>
      )}
      {screenCoords.sh.x !== -999 && screenCoords.sh.x > 0 && screenCoords.sh.y > 0 && (
        <div style={{ position: 'absolute', left: `${screenCoords.sh.x}px`, top: `${screenCoords.sh.y}px`, transform: 'translate(-50%, -110%)', pointerEvents: 'none' }}
          className="font-mono text-[7px] text-neutral-400 select-none opacity-60">上海</div>
      )}
      {screenCoords.gz.x !== -999 && screenCoords.gz.x > 0 && screenCoords.gz.y > 0 && (
        <div style={{ position: 'absolute', left: `${screenCoords.gz.x}px`, top: `${screenCoords.gz.y}px`, transform: 'translate(-50%, -110%)', pointerEvents: 'none' }}
          className="font-mono text-[7px] text-neutral-400 select-none opacity-60">广州</div>
      )}
      {screenCoords.cd.x !== -999 && screenCoords.cd.x > 0 && screenCoords.cd.y > 0 && (
        <div style={{ position: 'absolute', left: `${screenCoords.cd.x}px`, top: `${screenCoords.cd.y}px`, transform: 'translate(-50%, -110%)', pointerEvents: 'none' }}
          className="font-mono text-[7px] text-neutral-400 select-none opacity-60">成都</div>
      )}

      <div className="absolute bottom-2 left-3 font-mono text-[7px] text-neutral-400 pointer-events-none uppercase tracking-wider">
        MAP_INT: MULTI_DRAG_ORBIT // GSAP_TIMELINE // TG_PROJ
      </div>
    </div>
  );
}
