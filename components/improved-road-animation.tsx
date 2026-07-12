'use client';

import { useEffect, useRef } from 'react';

interface Vehicle {
  id: number;
  x: number;
  color: string;
  speed: number;
  size: number;
}

export function ImprovedRoadAnimation() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    // Road dimensions
    const roadY = canvas.height / 2 - 20;
    const roadHeight = 60;

    // Vehicles
    const vehicles: Vehicle[] = [
      { id: 1, x: 0, color: '#EF4444', speed: 0.8, size: 35 },      // Red truck
      { id: 2, x: 200, color: '#06B6D4', speed: 1.2, size: 32 },    // Cyan truck
      { id: 3, x: 400, color: '#FBBF24', speed: 0.6, size: 30 },    // Yellow truck
    ];

    const animate = () => {
      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw sky
      ctx.fillStyle = '#87CEEB';
      ctx.fillRect(0, 0, canvas.width, roadY - 30);

      // Draw hills
      ctx.fillStyle = '#A0D8F7';
      ctx.beginPath();
      ctx.moveTo(0, roadY - 30);
      ctx.quadraticCurveTo(canvas.width / 4, roadY - 80, canvas.width / 2, roadY - 30);
      ctx.quadraticCurveTo((canvas.width * 3) / 4, roadY + 20, canvas.width, roadY - 30);
      ctx.lineTo(canvas.width, 0);
      ctx.lineTo(0, 0);
      ctx.fill();

      // Draw road
      ctx.fillStyle = '#1F2937';
      ctx.fillRect(0, roadY, canvas.width, roadHeight);

      // Draw lane markings (dashed)
      ctx.strokeStyle = '#FBBF24';
      ctx.setLineDash([30, 20]);
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(0, roadY + roadHeight / 2);
      ctx.lineTo(canvas.width, roadY + roadHeight / 2);
      ctx.stroke();
      ctx.setLineDash([]);

      // Draw and animate vehicles
      vehicles.forEach((vehicle) => {
        // Update position
        vehicle.x += vehicle.speed;

        // Loop back when reaching the end
        if (vehicle.x > canvas.width + vehicle.size) {
          vehicle.x = -vehicle.size;
        }

        // Draw vehicle as rectangle (truck)
        const vehicleHeight = vehicle.size;
        const vehicleWidth = vehicle.size * 1.5;

        // Vehicle body
        ctx.fillStyle = vehicle.color;
        ctx.fillRect(vehicle.x, roadY + (roadHeight - vehicleHeight) / 2, vehicleWidth, vehicleHeight);

        // Vehicle cabin (front part)
        ctx.fillStyle = vehicle.color;
        ctx.fillRect(vehicle.x + vehicleWidth * 0.7, roadY + (roadHeight - vehicleHeight) / 2 - 5, vehicleWidth * 0.3, vehicleHeight / 2);

        // Windows
        ctx.fillStyle = '#87CEEB';
        ctx.fillRect(vehicle.x + vehicleWidth * 0.75, roadY + (roadHeight - vehicleHeight) / 2, vehicleWidth * 0.2, vehicleHeight / 3);

        // Wheels
        ctx.fillStyle = '#000';
        ctx.beginPath();
        ctx.arc(vehicle.x + vehicleWidth * 0.25, roadY + roadHeight - 3, 4, 0, Math.PI * 2);
        ctx.fill();

        ctx.beginPath();
        ctx.arc(vehicle.x + vehicleWidth * 0.75, roadY + roadHeight - 3, 4, 0, Math.PI * 2);
        ctx.fill();
      });

      requestAnimationFrame(animate);
    };

    animate();
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-full"
      style={{ background: 'linear-gradient(to bottom, #E0F2FE, #87CEEB)' }}
    />
  );
}
