'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface Vehicle {
  mesh: THREE.Group;
  position: number;
  speed: number;
  spawnTime: number;
}

export function DynamicVehiclesScene({ opacity = 0.15 }: { opacity?: number }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene>();
  const vehiclesRef = useRef<Vehicle[]>([]);
  const lastSpawnRef = useRef(0);
  const spawnIntervalRef = useRef(2500); // 2.5 seconds between vehicles for better performance
  const rendererRef = useRef<THREE.WebGLRenderer>();

  useEffect(() => {
    if (!containerRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.background = new THREE.Color(0x0f1729);
    scene.fog = new THREE.Fog(0x0f1729, 50, 100);

    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 8, 20);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // Cap DPR for performance
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    rendererRef.current = renderer;
    containerRef.current.appendChild(renderer.domElement);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.6);
    directionalLight.position.set(10, 15, 10);
    directionalLight.castShadow = true;
    scene.add(directionalLight);

    // Road
    const roadGeometry = new THREE.PlaneGeometry(8, 200);
    const roadMaterial = new THREE.MeshPhongMaterial({ color: 0x1a1a1a });
    const road = new THREE.Mesh(roadGeometry, roadMaterial);
    road.rotation.x = -Math.PI / 2;
    scene.add(road);

    // Road markings
    const markingGeometry = new THREE.PlaneGeometry(0.3, 3);
    const markingMaterial = new THREE.MeshPhongMaterial({ color: 0xffff00 });
    for (let i = -50; i < 50; i += 5) {
      const marking = new THREE.Mesh(markingGeometry, markingMaterial);
      marking.rotation.x = -Math.PI / 2;
      marking.position.set(0, 0.01, i);
      road.add(marking);
    }

    // Function to create a vehicle
    const createVehicle = (): THREE.Group => {
      const vehicleGroup = new THREE.Group();

      // Body
      const bodyGeometry = new THREE.BoxGeometry(1.5, 1, 3);
      const bodyMaterial = new THREE.MeshPhongMaterial({ color: 0xff6b35 });
      const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
      body.position.y = 0.5;
      body.castShadow = true;
      body.receiveShadow = true;
      vehicleGroup.add(body);

      // Cab/Front section
      const cabGeometry = new THREE.BoxGeometry(1.3, 0.8, 1);
      const cabMaterial = new THREE.MeshPhongMaterial({ color: 0xff8c42 });
      const cab = new THREE.Mesh(cabGeometry, cabMaterial);
      cab.position.set(0, 0.9, 0.7);
      cab.castShadow = true;
      cab.receiveShadow = true;
      vehicleGroup.add(cab);

      // Windows
      const windowGeometry = new THREE.BoxGeometry(0.3, 0.4, 0.5);
      const windowMaterial = new THREE.MeshPhongMaterial({ color: 0x4da6ff, transparent: true, opacity: 0.7 });
      
      const leftWindow = new THREE.Mesh(windowGeometry, windowMaterial);
      leftWindow.position.set(-0.4, 1.1, 0.5);
      vehicleGroup.add(leftWindow);

      const rightWindow = new THREE.Mesh(windowGeometry, windowMaterial);
      rightWindow.position.set(0.4, 1.1, 0.5);
      vehicleGroup.add(rightWindow);

      // Wheels
      const wheelGeometry = new THREE.CylinderGeometry(0.4, 0.4, 0.2, 16);
      const wheelMaterial = new THREE.MeshPhongMaterial({ color: 0x333333 });

      [-0.6, 0.6].forEach((xPos) => {
        [-0.8, 0.8].forEach((zPos) => {
          const wheel = new THREE.Mesh(wheelGeometry, wheelMaterial);
          wheel.rotation.z = Math.PI / 2;
          wheel.position.set(xPos, 0.4, zPos);
          wheel.castShadow = true;
          wheel.receiveShadow = true;
          vehicleGroup.add(wheel);
        });
      });

      return vehicleGroup;
    };

    // Animation loop
    let animationId: number;
    const animate = () => {
      renderer.render(scene, camera);

      // Spawn vehicles
      const now = Date.now();
      if (now - lastSpawnRef.current > spawnIntervalRef.current) {
        const vehicle = createVehicle();
        vehicle.position.z = -100;
        scene.add(vehicle);

        vehiclesRef.current.push({
          mesh: vehicle,
          position: -100,
          speed: 0.3 + Math.random() * 0.15, // Vary speed slightly
          spawnTime: now,
        });

        lastSpawnRef.current = now;
      }

      // Update vehicles
      vehiclesRef.current = vehiclesRef.current.filter((vehicle) => {
        vehicle.position += vehicle.speed;
        vehicle.mesh.position.z = vehicle.position;

        // Remove if off-screen
        if (vehicle.position > 100) {
          scene.remove(vehicle.mesh);
          return false;
        }

        return true;
      });

      // Update camera - subtle movement
      const time = Date.now() * 0.0001;
      camera.position.x = Math.sin(time) * 2;
      camera.lookAt(0, 0, 0);

      animationId = requestAnimationFrame(animate);
    };

    animate();

    // Handle resize
    const handleResize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };

    window.addEventListener('resize', handleResize);

    // Set opacity
    renderer.domElement.style.opacity = opacity.toString();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationId);
      if (containerRef.current && renderer.domElement.parentNode === containerRef.current) {
        containerRef.current.removeChild(renderer.domElement);
      }
      // Clean up geometries and materials
      vehiclesRef.current.forEach((vehicle) => {
        vehicle.mesh.traverse((node) => {
          if (node instanceof THREE.Mesh) {
            node.geometry.dispose();
            if (Array.isArray(node.material)) {
              node.material.forEach((mat) => mat.dispose());
            } else {
              node.material.dispose();
            }
          }
        });
      });
      renderer.dispose();
    };
  }, [opacity]);

  return <div ref={containerRef} className="fixed inset-0 pointer-events-none" />;
}
