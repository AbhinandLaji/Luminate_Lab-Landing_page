import { Renderer, Program, Mesh, Color, Triangle } from 'ogl';
import { useEffect, useRef, useState, memo } from 'react';
import AuroraWave from './AuroraWave'; // Fallback for no-WebGL / reduced-motion
import './Strands.css';

const MAX_STRANDS = 12;
const MAX_COLORS = 8;

const VERT = `#version 300 es
in vec2 position;
void main() {
  gl_Position = vec4(position, 0.0, 1.0);
}
`;

const FRAG = `#version 300 es
precision highp float;

uniform float uTime;
uniform vec2 uResolution;
uniform vec2 uMouse;
uniform vec3 uColors[${MAX_COLORS}];
uniform int uColorCount;
uniform int uStrandCount;
uniform float uSpeed;
uniform float uAmplitude;
uniform float uWaviness;
uniform float uThickness;
uniform float uGlow;
uniform float uTaper;
uniform float uSpread;
uniform float uHueShift;
uniform float uIntensity;
uniform float uOpacity;
uniform float uScale;
uniform float uSaturation;

out vec4 fragColor;

const float PI = 3.14159265;

vec3 spectrum(float t) {
  return 0.5 + 0.5 * cos(2.0 * PI * (t + vec3(0.00, 0.33, 0.67)));
}

vec3 samplePalette(float t) {
  t = fract(t);
  float scaled = t * float(uColorCount);
  int idx = int(floor(scaled));
  float blend = fract(scaled);
  int nextIdx = idx + 1;
  if (nextIdx >= uColorCount) nextIdx = 0;
  return mix(uColors[idx], uColors[nextIdx], blend);
}

vec3 strandColor(float t) {
  if (uColorCount > 0) return samplePalette(t);
  return spectrum(t);
}

void main() {
  vec2 uv = (gl_FragCoord.xy - 0.5 * uResolution) / uResolution.y;
  uv /= max(uScale, 0.0001);

  // Map mouse from [0, 1] to UV space
  vec2 m = (uMouse - 0.5) * (uResolution / uResolution.y);
  m /= max(uScale, 0.0001);

  float e = 0.06 + uIntensity * 0.94;

  vec3 col = vec3(0.0);

  for (int i = 0; i < ${MAX_STRANDS}; i++) {
    if (i >= uStrandCount) break;

    float fi = float(i);
    float ph = fi * 1.7 * uSpread;
    float freq = (2.0 + fi * 0.35) * uWaviness;
    float spd = 1.4 + fi * 1.2;

    float tt = uTime * uSpeed;
    
    // Mouse reactivity: blend mouse X into phase offset (horizontal pull)
    ph += (m.x * 3.5);
    
    // [FIX 2: HORIZONTAL TRAVEL & STAGGERED LOOPING]
    // 1. Staggered speed and phase per strand so they feel organic
    float travelSpeed = 0.15 + (fract(fi * 0.731) * 0.2); 
    // fract() ensures a normalized loop [0, 1)
    float loopProgress = fract(uTime * travelSpeed + (fi * 0.418));
    
    // 2. Map loopProgress to horizontal screen space (uv.x)
    // Wrap bounds of +/- 2.0 safely exceed the screen edges to ensure 
    // strands fully fade out before wrapping to the other side.
    float wrapBound = 2.0; 
    float strandX = mix(-wrapBound, wrapBound, loopProgress);
    
    // 3. Localize the envelope/taper around this moving strandX
    float distX = uv.x - strandX;
    // max radius = 1.2 before fading to 0. (cos(PI/2) = 0). 0.5 * PI / 1.2 = 1.3089
    float localEnv = pow(max(cos(distX * 1.3089), 0.0), uTaper);
    
    float w = sin(uv.x * freq + tt * spd + ph) * 0.60
            + sin(uv.x * freq * 1.1 - tt * spd * 0.7 + ph * 1.7) * 0.40;

    // Mouse reactivity: blend mouse Y into amplitude
    float baseAmp = (0.1 + 0.02 * e) * localEnv * uAmplitude;
    float amp = baseAmp * (1.0 + (m.y * 1.8));

    float y = w * amp;

    float d = abs(uv.y - y);
    float thick = (0.001 + 0.05 * e) * (0.35 + localEnv) * uThickness;
    float g = thick / (d + thick * 0.45);
    g = g * g;

    float h = fi / float(uStrandCount) + uv.x * 0.30 + uTime * 0.04 + uHueShift;
    col += strandColor(h) * g * localEnv;
  }

  col *= 0.45 + 0.7 * e;
  col = 1.0 - exp(-col * uGlow);

  float gray = dot(col, vec3(0.2126, 0.7152, 0.0722));
  col = max(mix(vec3(gray), col, uSaturation), 0.0);

  float lum = max(max(col.r, col.g), col.b);
  float alpha = clamp(lum, 0.0, 1.0) * uOpacity;

  fragColor = vec4(col * uOpacity, alpha);
}
`;

const buildPalette = colors => {
  const filled = colors && colors.length ? colors : ['#ffffff'];
  const padded = [];
  for (let i = 0; i < MAX_COLORS; i++) {
    const hex = filled[i] ?? filled[filled.length - 1];
    const c = new Color(hex);
    padded.push([c.r, c.g, c.b]);
  }
  return padded;
};

export default function Strands({
  colors = ['#FF4242', '#7C3AED', '#06B6D4', '#EAB308'],
  count = 3,
  speed = 0.5,
  amplitude = 1,
  waviness = 1,
  thickness = 0.7,
  glow = 2.6,
  taper = 3,
  spread = 1,
  hueShift = 0,
  intensity = 0.6,
  saturation = 1.5,
  opacity = 1,
  scale = 1.5,
  maskRect = null, // Used for dimming behind text
  className = '',
  style
}) {
  const [webglFailed, setWebglFailed] = useState(false);
  const isReducedMotion = useRef(window.matchMedia('(prefers-reduced-motion: reduce)').matches);

  const propsRef = useRef({});
  propsRef.current = {
    colors, count, speed, amplitude, waviness, thickness, glow, taper,
    spread, hueShift, intensity, saturation, opacity, scale
  };

  const ctnDom = useRef(null);

  useEffect(() => {
    if (webglFailed || isReducedMotion.current) return;

    const ctn = ctnDom.current;
    if (!ctn) return;

    let renderer, gl;
    try {
      renderer = new Renderer({ alpha: true, premultipliedAlpha: true, antialias: true });
      gl = renderer.gl;
      if (!gl) throw new Error("WebGL context creation failed");
    } catch (e) {
      console.warn("Strands WebGL init failed, falling back to SVG:", e);
      setWebglFailed(true);
      return;
    }

    gl.clearColor(0, 0, 0, 0);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
    gl.canvas.style.backgroundColor = 'transparent';

    const geometry = new Triangle(gl);
    if (geometry.attributes.uv) delete geometry.attributes.uv;

    const program = new Program(gl, {
      vertex: VERT,
      fragment: FRAG,
      uniforms: {
        uTime: { value: 0 },
        uResolution: { value: [ctn.offsetWidth, ctn.offsetHeight] },
        uMouse: { value: [0.5, 0.5] },
        uColors: { value: buildPalette(propsRef.current.colors) },
        uColorCount: { value: Math.min(propsRef.current.colors.length, MAX_COLORS) },
        uStrandCount: { value: Math.min(propsRef.current.count, MAX_STRANDS) },
        uSpeed: { value: speed },
        uAmplitude: { value: amplitude },
        uWaviness: { value: waviness },
        uThickness: { value: thickness },
        uGlow: { value: glow },
        uTaper: { value: taper },
        uSpread: { value: spread },
        uHueShift: { value: hueShift },
        uIntensity: { value: intensity },
        uOpacity: { value: opacity },
        uScale: { value: scale },
        uSaturation: { value: saturation }
      }
    });

    const mesh = new Mesh(gl, { geometry, program });

    ctn.appendChild(gl.canvas);

    // Mouse tracking & Idle animation
    const targetMouse = { x: 0.5, y: 0.5 };
    const smoothMouse = { x: 0.5, y: 0.5 };
    let lastMouseActive = Date.now();

    const onMouseMove = (e) => {
      const rect = ctn.getBoundingClientRect();
      targetMouse.x = (e.clientX - rect.left) / rect.width;
      targetMouse.y = (e.clientY - rect.top) / rect.height;
      lastMouseActive = Date.now();
    };
    window.addEventListener('mousemove', onMouseMove, { passive: true });

    function resize() {
      if (!ctn) return;
      const width = ctn.offsetWidth;
      const height = ctn.offsetHeight;
      renderer.setSize(width, height);
      program.uniforms.uResolution.value = [width, height];
    }
    window.addEventListener('resize', resize);
    resize();

    // Visibility gating
    const isVisible = { current: true };
    const isTabVisible = { current: document.visibilityState === 'visible' };

    const io = new IntersectionObserver(([entry]) => {
      isVisible.current = entry.isIntersecting;
    }, { threshold: 0 });
    io.observe(ctn);

    const onVis = () => { isTabVisible.current = document.visibilityState === 'visible'; };
    document.addEventListener('visibilitychange', onVis);

    let animateId = 0;
    const update = t => {
      animateId = requestAnimationFrame(update);
      if (!isVisible.current || !isTabVisible.current) return;

      const current = propsRef.current;
      program.uniforms.uTime.value = t * 0.001;
      
      // Idle auto-animate if no mouse movement for 2s
      if (Date.now() - lastMouseActive > 2000) {
        const it = t * 0.001 * 0.8;
        targetMouse.x = 0.5 + Math.cos(it) * 0.25;
        targetMouse.y = 0.5 + Math.sin(it * 1.8) * 0.2;
      }
      
      smoothMouse.x += (targetMouse.x - smoothMouse.x) * 0.015;
      smoothMouse.y += (targetMouse.y - smoothMouse.y) * 0.015;
      
      program.uniforms.uMouse.value = [smoothMouse.x, 1.0 - smoothMouse.y]; // flip Y for WebGL coordinates

      program.uniforms.uColors.value = buildPalette(current.colors);
      program.uniforms.uColorCount.value = Math.min(current.colors.length, MAX_COLORS);
      program.uniforms.uStrandCount.value = Math.min(Math.max(Math.round(current.count), 1), MAX_STRANDS);
      program.uniforms.uSpeed.value = current.speed;
      program.uniforms.uAmplitude.value = current.amplitude;
      program.uniforms.uWaviness.value = current.waviness;
      program.uniforms.uThickness.value = current.thickness;
      program.uniforms.uGlow.value = current.glow;
      program.uniforms.uTaper.value = current.taper;
      program.uniforms.uSpread.value = current.spread;
      program.uniforms.uHueShift.value = current.hueShift;
      program.uniforms.uIntensity.value = current.intensity;
      program.uniforms.uOpacity.value = current.opacity;
      program.uniforms.uScale.value = current.scale;
      program.uniforms.uSaturation.value = current.saturation;

      renderer.render({ scene: mesh });
    };
    animateId = requestAnimationFrame(update);

    return () => {
      cancelAnimationFrame(animateId);
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('visibilitychange', onVis);
      io.disconnect();
      if (ctn && gl.canvas.parentNode === ctn) ctn.removeChild(gl.canvas);
      gl.getExtension('WEBGL_lose_context')?.loseContext();
    };
  }, [webglFailed]);

  // Fallback rendering
  if (webglFailed || isReducedMotion.current) {
    return <AuroraWave position="full" maskRect={maskRect} opacity={opacity} />;
  }

  const maskStyle = maskRect ? {
    WebkitMaskImage: `radial-gradient(ellipse ${maskRect.rx * 115 * 100}% ${maskRect.ry * 140 * 100}% at ${maskRect.cx * 100}% ${maskRect.cy * 100}%, rgba(0,0,0,0.12) 0%, rgba(0,0,0,1) 85%)`,
    maskImage: `radial-gradient(ellipse ${maskRect.rx * 115 * 100}% ${maskRect.ry * 140 * 100}% at ${maskRect.cx * 100}% ${maskRect.cy * 100}%, rgba(0,0,0,0.12) 0%, rgba(0,0,0,1) 85%)`,
  } : {};

  return <div ref={ctnDom} className={`strands-container ${className}`} style={{ ...style, ...maskStyle }} />;
}
