import{jsx as _jsx}from"react/jsx-runtime";import{useEffect,useRef}from"react";import{addPropertyControls,ControlType}from"framer";import*as THREE from"three";/**
 * Silk Waves Shader
 * Converted By Maharram Hasanli
 * Made By Peace
 * Source Link: https://www.shadertoy.com/view/X3yXRd
 *
 * @framerIntrinsicWidth 200
 * @framerIntrinsicHeight 200
 * @framerDisableUnlink
 *
 * @framerSupportedLayoutWidth fixed
 * @framerSupportedLayoutHeight any
 */export default function SilkWaves(props){const mount=useRef(null);const{speed}=props;useEffect(()=>{let frameId;const scene=new THREE.Scene;const camera=new THREE.OrthographicCamera(0,0,0,0,1,1e3);camera.position.z=1;const renderer=new THREE.WebGLRenderer;renderer.setPixelRatio(window.devicePixelRatio);mount.current.appendChild(renderer.domElement);const uniforms={iTime:{value:0},iResolution:{value:new THREE.Vector3}};const material=new THREE.ShaderMaterial({uniforms:uniforms,vertexShader:`
                void main() {
                    gl_Position = vec4(position, 1.0);
                }
            `,fragmentShader:`
                #define INVERT 1

                uniform float iTime;
                uniform vec3 iResolution;

                vec2 hash22(vec2 p) {
                    vec3 p3 = fract(p.xyx * vec3(0.1031, 0.1030, 0.0973));
                    p3 += dot(p3, p3.yzx + 33.33);
                    return fract((p3.xx + p3.yz) * p3.zy);
                }

                float noise(vec2 p) {
                    const float kF = 1024.0;
                    vec2 i = floor(p);
                    vec2 f = fract(p);
                    f *= f * (3.0 - 2.0 * f);
                    return mix(mix(sin(kF * dot(p, hash22(i + vec2(0, 0)))),
                                  sin(kF * dot(p, hash22(i + vec2(1, 0)))), f.x),
                               mix(sin(kF * dot(p, hash22(i + vec2(0, 1)))),
                                  sin(kF * dot(p, hash22(i + vec2(1, 1)))), f.x), f.y);
                }

                float fabric(vec2 p) {
                    const mat2 m = mat2(1.6, 1.2, -1.2, 1.6);
                    float f = 0.0;
                    f += 0.4 * noise(p); p = m * p;
                    f += 0.3 * noise(p); p = m * p;
                    f += 0.2 * noise(p); p = m * p;
                    f += 0.1 * noise(p);
                    return f;
                }

                const float A = 12.0;
                const float B = 2.0;
                const float C = 5.0;
                const float D = 5.0;

                float silk(vec2 uv, float t) {
                    float s = sin(D * (uv.x + uv.y + cos(B * uv.x + C * uv.y)) + sin(A * (uv.x + uv.y)) - t);
                    s = 0.7 + 0.3 * (s * s * 0.5 + s);
                    s *= 0.9 + 0.6 * fabric(uv * min(iResolution.x, iResolution.y) * 0.0006);
                    return s * 0.9 + 0.1;
                }

                float silkd(vec2 uv, float t) {
                    float xy = uv.x + uv.y;
                    float d = (D * (1.0 - B * sin(B * uv.x + C * uv.y)) + A * cos(A * xy)) * cos(D * (cos(B * uv.x + C * uv.y) + xy) + sin(A * xy) - t);
                    return 0.005 * d * (sign(d) + 3.0);
                }

                void mainImage(out vec4 fragColor, vec2 fragCoord) {
                    vec2 uv = fragCoord.xy / min(iResolution.x, iResolution.y);
                    float t = iTime;
                    uv.y += 0.03 * sin(8.0 * uv.x - t);
                    
                    float s = sqrt(silk(uv, t));
                    float d = silkd(uv, t);
                    
                    vec3 c = vec3(s);
                    c += 0.7 * vec3(1, 0.83, 0.6) * d;
                    c *= 1.0 - max(0.0, 0.8 * d);
                #if INVERT
                    c = pow(c, 0.3 / vec3(0.52, 0.5, 0.4));
                    c = 1.0 - c;
                #else
                    c = pow(c, vec3(0.52, 0.5, 0.4));
                #endif

                    fragColor = vec4(c, 1);
                }

                void main() {
                    mainImage(gl_FragColor, gl_FragCoord.xy);
                }
            `});const geometry=new THREE.PlaneGeometry(2,2);const mesh=new THREE.Mesh(geometry,material);scene.add(mesh);const updateSize=()=>{const width=mount.current.clientWidth;const height=mount.current.clientHeight;renderer.setSize(width,height);uniforms.iResolution.value.set(width,height,1);camera.left=width/-2;camera.right=width/2;camera.top=height/2;camera.bottom=height/-2;camera.updateProjectionMatrix();};updateSize();const animate=()=>{uniforms.iTime.value+=.01*speed;renderer.render(scene,camera);frameId=requestAnimationFrame(animate);};animate();const resizeObserver=new ResizeObserver(()=>{updateSize();});resizeObserver.observe(mount.current);return()=>{cancelAnimationFrame(frameId);resizeObserver.disconnect();if(mount.current){mount.current.removeChild(renderer.domElement);}renderer.dispose();};},[speed]);return /*#__PURE__*/_jsx("div",{ref:mount,style:{width:"100%",height:"100%"}});}addPropertyControls(SilkWaves,{speed:{type:ControlType.Number,defaultValue:1,min:0,max:10,step:.1}});
export const __FramerMetadata__ = {"exports":{"default":{"type":"reactComponent","name":"SilkWaves","slots":[],"annotations":{"framerDisableUnlink":"*","framerSupportedLayoutWidth":"fixed","framerContractVersion":"1","framerIntrinsicHeight":"200","framerSupportedLayoutHeight":"any","framerIntrinsicWidth":"200"}},"__FramerMetadata__":{"type":"variable"}}}
//# sourceMappingURL=./Silkwaves.map
