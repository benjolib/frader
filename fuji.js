import { useEffect, useRef } from "react";
import { addPropertyControls, ControlType } from "framer";
import * as THREE from "three";

export default function SilkWaves(props) {
    const mount = useRef(null);
    const { speed } = props;

    useEffect(() => {
        let frameId;
        const scene = new THREE.Scene();
        const camera = new THREE.OrthographicCamera(0, 0, 0, 0, 1, 1000);
        camera.position.z = 1;
        const renderer = new THREE.WebGLRenderer();
        renderer.setPixelRatio(window.devicePixelRatio);
        mount.current.appendChild(renderer.domElement);

        const uniforms = {
            iTime: { value: 0 },
            iResolution: { value: new THREE.Vector3() }
        };

        const material = new THREE.ShaderMaterial({
            uniforms: uniforms,
            vertexShader: `
                void main() {
                    gl_Position = vec4(position, 1.0);
                }
            `,
            fragmentShader: `
                // Fragment shader code here
            `
        });

        const geometry = new THREE.PlaneGeometry(2, 2);
        const mesh = new THREE.Mesh(geometry, material);
        scene.add(mesh);

        const updateSize = () => {
            const width = mount.current.clientWidth;
            const height = mount.current.clientHeight;
            renderer.setSize(width, height);
            uniforms.iResolution.value.set(width, height, 1);
            camera.left = width / -2;
            camera.right = width / 2;
            camera.top = height / 2;
            camera.bottom = height / -2;
            camera.updateProjectionMatrix();
        };

        updateSize();

        const animate = () => {
            uniforms.iTime.value += 0.01 * speed;
            renderer.render(scene, camera);
            frameId = requestAnimationFrame(animate);
        };

        animate();

        const resizeObserver = new ResizeObserver(() => {
            updateSize();
        });

        resizeObserver.observe(mount.current);

        return () => {
            cancelAnimationFrame(frameId);
            resizeObserver.disconnect();
            if (mount.current) {
                mount.current.removeChild(renderer.domElement);
            }
            renderer.dispose();
        };
    }, [speed]);

    return <div ref={mount} style={{ width: "100%", height: "100%" }} />;
}

addPropertyControls(SilkWaves, {
    speed: {
        type: ControlType.Number,
        defaultValue: 1,
        min: 0,
        max: 10,
        step: 0.1
    }
});
