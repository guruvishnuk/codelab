"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

export default function Scene() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const isMobile = window.innerWidth < 768;

    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, isMobile ? 1.5 : 2));

    const scene = new THREE.Scene();
    const cam = new THREE.PerspectiveCamera(60, 1, 0.1, 200);
    cam.position.z = 13;

    // 1. Torus Knot
    const knotGeo = new THREE.TorusKnotGeometry(3.6, 0.95, 120, 24, 2, 3);
    const knotMat = new THREE.MeshStandardMaterial({
      color: 0x8f7bff,
      wireframe: true,
      transparent: true,
      opacity: 0.25,
      roughness: 0.2,
      metalness: 0.85,
    });
    const knot = new THREE.Mesh(knotGeo, knotMat);
    knot.position.set(4, 0.5, 0);
    scene.add(knot);

    // 2. Inner Core
    const coreGeo = new THREE.IcosahedronGeometry(2.1, 1);
    const coreMat = new THREE.MeshBasicMaterial({
      color: 0xff6b5b,
      wireframe: true,
      transparent: true,
      opacity: 0.35,
    });
    const core = new THREE.Mesh(coreGeo, coreMat);
    core.position.copy(knot.position);
    scene.add(core);

    // 3. Floating Particle Cloud
    const pCount = isMobile ? 500 : 1100;
    const pGeo = new THREE.BufferGeometry();
    const pos = new Float32Array(pCount * 3);
    const cols = new Float32Array(pCount * 3);
    const palette = [
      new THREE.Color("#8f7bff"),
      new THREE.Color("#ff7f70"),
      new THREE.Color("#4be3c3"),
      new THREE.Color("#ffc857"),
    ];

    for (let i = 0; i < pCount; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 44;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 44;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 36;

      const c = palette[i % palette.length];
      cols[i * 3] = c.r;
      cols[i * 3 + 1] = c.g;
      cols[i * 3 + 2] = c.b;
    }

    pGeo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    pGeo.setAttribute("color", new THREE.BufferAttribute(cols, 3));

    const pMat = new THREE.PointsMaterial({
      size: isMobile ? 0.12 : 0.16,
      vertexColors: true,
      transparent: true,
      opacity: 0.65,
    });
    const particles = new THREE.Points(pGeo, pMat);
    scene.add(particles);

    // 4. Lights
    const ambient = new THREE.AmbientLight(0xffffff, 0.9);
    scene.add(ambient);

    const light1 = new THREE.DirectionalLight(0x8f7bff, 3);
    light1.position.set(12, 16, 10);
    scene.add(light1);

    const light2 = new THREE.DirectionalLight(0xff6b5b, 2.5);
    light2.position.set(-12, -10, -10);
    scene.add(light2);

    let mx = 0;
    let my = 0;
    let sy = 0;
    let raf = 0;

    const onMove = (e: PointerEvent) => {
      mx = e.clientX / window.innerWidth - 0.5;
      my = e.clientY / window.innerHeight - 0.5;
    };

    const onScroll = () => {
      sy = window.scrollY / window.innerHeight;
    };

    const onResize = () => {
      renderer.setSize(window.innerWidth, window.innerHeight, false);
      cam.aspect = window.innerWidth / window.innerHeight;
      cam.updateProjectionMatrix();
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize, { passive: true });
    onResize();

    const clock = new THREE.Clock();

    const loop = () => {
      if (!document.hidden) {
        const t = clock.getElapsedTime();

        knot.rotation.x = t * 0.18 + my * 0.5 + sy * 1.2;
        knot.rotation.y = t * 0.24 + mx * 0.6;

        core.rotation.x = -t * 0.3;
        core.rotation.y = t * 0.38;

        particles.rotation.y = t * 0.03 + mx * 0.15;
        particles.rotation.x = -my * 0.1;

        cam.position.x += (mx * 2 - cam.position.x) * 0.05;
        cam.position.y += (-my * 2 - sy * 4 - cam.position.y) * 0.05;
        cam.lookAt(0, -sy * 2, 0);

        renderer.render(scene, cam);
      }
      raf = requestAnimationFrame(loop);
    };

    if (reduceMotion) {
      renderer.render(scene, cam);
    } else {
      loop();
    }

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);

      scene.traverse((o: any) => {
        o.geometry?.dispose();
        o.material?.map?.dispose();
        o.material?.dispose();
      });
      renderer.dispose();
    };
  }, []);

  return <canvas ref={ref} id="gl" aria-hidden="true" />;
}
