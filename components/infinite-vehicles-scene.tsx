'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface Vehicle {
  mesh: THREE.Group;
  position: number; // 0 to 1, representing position on road
  speed: number;
  startTime: number;
  lane: 'left' | 'right'; // Left or right lane at fork point
  laneSwitchPoint: number; // When vehicle decides which lane (0.5 = at fork)
}

export function InfiniteVehiclesScene({ opacity = 0.15 }: { opacity?: number }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const vehiclesRef = useRef<Vehicle[]>([]);
  const timeRef = useRef(0);
  const rendererRef = useRef<THREE.WebGLRenderer>();
  const sceneRef = useRef<THREE.Scene>();

  useEffect(() => {
    if (!containerRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.background = new THREE.Color(0x000000);
    scene.fog = new THREE.Fog(0x000000, 500, 1000);

    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.set(0, 100, 200);
    camera.lookAt(0, 50, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.shadowMap.enabled = true;
    rendererRef.current = renderer;
    containerRef.current.appendChild(renderer.domElement);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.6);
    directionalLight.position.set(100, 150, 100);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 2048;
    directionalLight.shadow.mapSize.height = 2048;
    scene.add(directionalLight);

    // Create main road (wider now)
    const roadGeometry = new THREE.PlaneGeometry(140, 1000);
    const roadMaterial = new THREE.MeshStandardMaterial({
      color: 0x2a2a2a,
      metalness: 0.15,
      roughness: 0.85,
    });
    const road = new THREE.Mesh(roadGeometry, roadMaterial);
    road.rotation.x = -Math.PI / 2;
    road.position.y = 0;
    road.receiveShadow = true;
    scene.add(road);

    // Left branch road
    const leftRoadGeometry = new THREE.PlaneGeometry(60, 300);
    const leftRoad = new THREE.Mesh(leftRoadGeometry, roadMaterial);
    leftRoad.rotation.x = -Math.PI / 2;
    leftRoad.position.set(-40, 0.01, 300);
    leftRoad.receiveShadow = true;
    scene.add(leftRoad);

    // Right branch road  
    const rightRoad = new THREE.Mesh(leftRoadGeometry, roadMaterial);
    rightRoad.rotation.x = -Math.PI / 2;
    rightRoad.position.set(40, 0.01, 300);
    rightRoad.receiveShadow = true;
    scene.add(rightRoad);

    // Center line markings
    const markingsGeometry = new THREE.PlaneGeometry(2, 1000);
    const markingsMaterial = new THREE.MeshStandardMaterial({
      color: 0xffff00,
      metalness: 0.05,
      roughness: 0.95,
    });
    const markings = new THREE.Mesh(markingsGeometry, markingsMaterial);
    markings.rotation.x = -Math.PI / 2;
    markings.position.y = 0.01;
    markings.position.z = 0;
    scene.add(markings);

    // Create simple truck
    function createTruck() {
      const truck = new THREE.Group();

      // Cabin
      const cabinGeometry = new THREE.BoxGeometry(8, 10, 8);
      const cabinMaterial = new THREE.MeshStandardMaterial({
        color: 0xFF6B35,
        metalness: 0.3,
        roughness: 0.7,
      });
      const cabin = new THREE.Mesh(cabinGeometry, cabinMaterial);
      cabin.position.y = 5;
      cabin.position.z = -8;
      cabin.castShadow = true;
      cabin.receiveShadow = true;
      truck.add(cabin);

      // Cargo box
      const cargoGeometry = new THREE.BoxGeometry(10, 12, 20);
      const cargoMaterial = new THREE.MeshStandardMaterial({
        color: 0xFF8C42,
        metalness: 0.2,
        roughness: 0.8,
      });
      const cargo = new THREE.Mesh(cargoGeometry, cargoMaterial);
      cargo.position.y = 6;
      cargo.position.z = 8;
      cargo.castShadow = true;
      cargo.receiveShadow = true;
      truck.add(cargo);

      // Wheels (2 front, 4 rear axles)
      const wheelRadius = 4;
      const wheelMaterial = new THREE.MeshStandardMaterial({
        color: 0x1a1a1a,
        metalness: 0.6,
        roughness: 0.4,
      });

      for (let i = 0; i < 6; i++) {
        const wheelGeometry = new THREE.CylinderGeometry(wheelRadius, wheelRadius, 2, 16);
        const wheel = new THREE.Mesh(wheelGeometry, wheelMaterial);
        wheel.rotation.z = Math.PI / 2;
        wheel.castShadow = true;
        
        if (i < 2) {
          // Front wheels
          wheel.position.set(i === 0 ? -6 : 6, wheelRadius, -10);
        } else {
          // Rear wheels
          const axleIndex = Math.floor((i - 2) / 2);
          wheel.position.set(i % 2 === 0 ? -6 : 6, wheelRadius, 5 + axleIndex * 6);
        }
        truck.add(wheel);
      }

      // Windows
      const windowGeometry = new THREE.BoxGeometry(3, 4, 0.5);
      const windowMaterial = new THREE.MeshStandardMaterial({
        color: 0x87CEEB,
        metalness: 0.9,
        roughness: 0.1,
      });
      const window = new THREE.Mesh(windowGeometry, windowMaterial);
      window.position.set(0, 7, -8.5);
      truck.add(window);

      truck.scale.set(2, 2, 2);
      return truck;
    }

    // Spawn initial vehicles with lane assignment
    const spawnVehicle = () => {
      const vehicleGroup = createTruck();
      scene.add(vehicleGroup);
      
      const lane = Math.random() > 0.5 ? 'left' : 'right';
      vehiclesRef.current.push({
        mesh: vehicleGroup,
        position: -0.2, // Start off-screen
        speed: 0.35 + Math.random() * 0.15, // Faster speed for eye-catching movement
        startTime: timeRef.current,
        lane,
        laneSwitchPoint: Math.random() < 0.5 ? 0.4 : 0.6, // Random fork decision point
      });
    };

    // Spawn first few vehicles
    for (let i = 0; i < 3; i++) {
      setTimeout(() => spawnVehicle(), i * 3000);
    }

    // Handle window resize
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener('resize', handleResize);

    // Animation loop
    let animationId: number;
    const animate = () => {
      animationId = requestAnimationFrame(animate);
      timeRef.current += 0.016; // ~60fps

      // Spawn new vehicles periodically
      if (Math.floor(timeRef.current) % 3 === 0 && vehiclesRef.current.length < 5) {
        // Check if we should spawn
        const lastSpawn = vehiclesRef.current[vehiclesRef.current.length - 1]?.startTime || 0;
        if (timeRef.current - lastSpawn > 3) {
          spawnVehicle();
        }
      }

      // Update vehicle positions and remove old ones
      vehiclesRef.current = vehiclesRef.current.filter((vehicle) => {
        vehicle.position += vehicle.speed * 0.016;
        
        // Position vehicle on road with lane switching logic
        const roadLength = 500;
        vehicle.mesh.position.z = -roadLength / 2 + vehicle.position * roadLength * 0.6; // Main road section
        
        // At fork point (position 0.4-0.6), smoothly transition to left or right lane
        if (vehicle.position > 0.4 && vehicle.position < 1.0) {
          const laneTransitionProgress = (vehicle.position - 0.4) / 0.2; // 0 to 1 over fork section
          const targetX = vehicle.lane === 'left' ? -35 : 35;
          const currentX = vehicle.mesh.position.x;
          vehicle.mesh.position.x = currentX + (targetX - currentX) * Math.min(laneTransitionProgress, 1);
          
          // Continue on branch roads
          if (vehicle.position > 0.6) {
            vehicle.mesh.position.z = 200 + (vehicle.position - 0.6) * roadLength * 0.4;
          }
        }

        // Remove when off screen
        if (vehicle.position > 1.5) {
          scene.remove(vehicle.mesh);
          return false;
        }
        return true;
      });

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationId);
      
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
      
      if (containerRef.current && renderer.domElement.parentNode === containerRef.current) {
        containerRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{ opacity }}
    />
  );
}
