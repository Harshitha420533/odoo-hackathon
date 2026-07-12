'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';

export function SmoothRoadScene() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Scene setup
    const width = containerRef.current.clientWidth;
    const height = containerRef.current.clientHeight;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x87ceeb); // Light blue sky
    scene.fog = new THREE.Fog(0x87ceeb, 500, 1000);

    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    camera.position.set(0, 10, 25);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(window.devicePixelRatio);
    containerRef.current.appendChild(renderer.domElement);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.6);
    directionalLight.position.set(50, 50, 50);
    directionalLight.castShadow = true;
    scene.add(directionalLight);

    // Road - wider for 2 vehicles side by side
    const roadGeometry = new THREE.PlaneGeometry(16, 800);
    const roadMaterial = new THREE.MeshStandardMaterial({ color: 0x333333, roughness: 0.8 });
    const road = new THREE.Mesh(roadGeometry, roadMaterial);
    road.rotation.x = -Math.PI / 2;
    road.position.z = 0;
    scene.add(road);

    // Road markings - center lane divider
    const markingGeometry = new THREE.PlaneGeometry(0.3, 10);
    const markingMaterial = new THREE.MeshStandardMaterial({ color: 0xffff00, emissive: 0xffff00 });
    
    for (let i = 0; i < 80; i++) {
      const marking = new THREE.Mesh(markingGeometry, markingMaterial);
      marking.rotation.x = -Math.PI / 2;
      marking.position.z = i * 10 - 400;
      marking.position.y = 0.01;
      marking.position.x = 0; // Center line
      scene.add(marking);
    }

    // Vehicle types with different colors and dimensions
    const vehicleTypes = [
      { name: 'truck', color: 0xff3333, scale: 1.2 }, // Red truck
      { name: 'truck', color: 0x33ccff, scale: 1.1 }, // Cyan truck
      { name: 'truck', color: 0xffaa00, scale: 1.0 }, // Orange truck
      { name: 'truck', color: 0x00cc33, scale: 0.9 }, // Green truck
      { name: 'sedan', color: 0x333399, scale: 0.7 }, // Blue sedan
      { name: 'sedan', color: 0xcc3366, scale: 0.7 }, // Pink sedan
    ];

    // Create vehicle with realistic behavior
    const createVehicle = (startZ: number, laneOffset: number = 0) => {
      const vehicleType = vehicleTypes[Math.floor(Math.random() * vehicleTypes.length)];
      const vehicleGroup = new THREE.Group();
      
      // Cabin/body
      const cabinGeometry = new THREE.BoxGeometry(2, 2, 3);
      const cabinMaterial = new THREE.MeshStandardMaterial({ color: vehicleType.color, metalness: 0.6, roughness: 0.4 });
      const cabin = new THREE.Mesh(cabinGeometry, cabinMaterial);
      cabin.position.y = 1.2;
      cabin.position.z = 0.5;
      vehicleGroup.add(cabin);

      // Container/cargo area (only for trucks)
      if (vehicleType.name === 'truck') {
        const containerGeometry = new THREE.BoxGeometry(2.8, 2.5, 5);
        const containerMaterial = new THREE.MeshStandardMaterial({ color: vehicleType.color, metalness: 0.5, roughness: 0.5 });
        const container = new THREE.Mesh(containerGeometry, containerMaterial);
        container.position.y = 1.4;
        container.position.z = -1.8;
        vehicleGroup.add(container);
      }

      // Wheels (cylinders)
      const wheelGeometry = new THREE.CylinderGeometry(0.65, 0.65, 0.4, 32);
      const wheelMaterial = new THREE.MeshStandardMaterial({ color: 0x111111, roughness: 0.95 });
      
      const wheelPositions = vehicleType.name === 'truck' 
        ? [[-1.2, 0.65, 1.2], [1.2, 0.65, 1.2], [-1.2, 0.65, -1.2], [1.2, 0.65, -1.2], [-1.2, 0.65, -3.5], [1.2, 0.65, -3.5]]
        : [[-0.9, 0.65, 0.8], [0.9, 0.65, 0.8], [-0.9, 0.65, -0.8], [0.9, 0.65, -0.8]];

      wheelPositions.forEach(([x, y, z]) => {
        const wheel = new THREE.Mesh(wheelGeometry, wheelMaterial);
        wheel.rotation.z = Math.PI / 2;
        wheel.position.set(x, y, z);
        vehicleGroup.add(wheel);
      });

      // Vehicle data
      vehicleGroup.scale.multiplyScalar(vehicleType.scale);
      vehicleGroup.position.z = startZ;
      vehicleGroup.position.x = laneOffset;
      
      // Random speed variation (0.2 to 0.4 units per frame)
      const baseSpeed = 0.25 + Math.random() * 0.15;
      vehicleGroup.userData = {
        wheels: vehicleGroup.children.filter(child => child.geometry?.type === 'CylinderGeometry'),
        speed: baseSpeed,
        waveOffset: Math.random() * Math.PI * 2, // For realistic lane changes
        waveFrequency: 0.01 + Math.random() * 0.01, // Slow wave for natural movement
        baseX: laneOffset,
        vehicleType: vehicleType.name,
      };
      
      return vehicleGroup;
    };

    // Create initial vehicles - random distribution across lanes
    const vehicles: THREE.Group[] = [];
    for (let i = 0; i < 5; i++) {
      const laneOffset = (Math.random() > 0.5 ? -3.5 : 3.5); // Random lane assignment
      const vehicle = createVehicle(250 - i * 80, laneOffset);
      scene.add(vehicle);
      vehicles.push(vehicle);
    }

    let lastSpawnTime = 0;
    const spawnInterval = 3500; // Spawn every 3.5 seconds

    // Animation loop with realistic movement
    const animate = () => {
      requestAnimationFrame(animate);

      const currentTime = Date.now();

      // Move vehicles with realistic behavior
      vehicles.forEach((vehicle, index) => {
        const data = vehicle.userData;
        
        // Move forward at individual speed
        vehicle.position.z -= data.speed;

        // Add subtle lane changes (sine wave movement)
        data.waveOffset += data.waveFrequency;
        vehicle.position.x = data.baseX + Math.sin(data.waveOffset) * 0.5;

        // Rotate wheels based on speed
        data.wheels.forEach(wheel => {
          wheel.rotation.z += data.speed * 0.15;
        });

        // Remove vehicles that are too far back
        if (vehicle.position.z < -300) {
          scene.remove(vehicle);
          vehicles.splice(index, 1);
        }
      });

      // Spawn new vehicles randomly
      if (currentTime - lastSpawnTime > spawnInterval) {
        const randomLane = Math.random() > 0.5 ? -3.5 : 3.5;
        const newVehicle = createVehicle(300, randomLane);
        scene.add(newVehicle);
        vehicles.push(newVehicle);
        lastSpawnTime = currentTime;
      }

      renderer.render(scene, camera);
    };

    animate();

    // Handle window resize
    const handleResize = () => {
      if (!containerRef.current) return;
      const newWidth = containerRef.current.clientWidth;
      const newHeight = containerRef.current.clientHeight;
      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      containerRef.current?.removeChild(renderer.domElement);
      renderer.dispose();
    };
  }, []);

  return <div ref={containerRef} className="w-full h-full" />;
}
