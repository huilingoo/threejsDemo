import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';

var scene, camera, renderer, controls;
var treeObj, geometry, points, pointsMaterial;

init();

function init() {
    // 初始化场景、相机、渲染器
    InitRenderer();
    // 水晶球体
    addBall();
    // 光线
    InitLights();
    // // 添加轨道
    addControl();
    // // 圣诞树
    addTree();
    // // 下雪
    addSnow();
}

function InitRenderer() {
    scene = new THREE.Scene(); // 创建场景
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000); // 创建相机
    renderer = new THREE.WebGLRenderer(); // 渲染器
    renderer.setClearAlpha(0); // 设置渲染器的透明度
    renderer.setSize(window.innerWidth, window.innerHeight); // 设置渲染器 大小
    document.body.appendChild(renderer.domElement);
    camera.position.z = 50;
    scene.add(camera);
}

function addBall() {
    geometry = new THREE.SphereGeometry(10, 32, 16);
    const params = {
        // 材质颜色，默认为白色
        color: 0xffffff,
        // 透光率
        transmission: 0.99,
        // 当透光率不为0的时候, opacity透明度应设置为1
        opacity: 1,
        // 金属度
        metalness: 0,
        // 粗糙
        roughness: 0,
        // 折射率，范围由1.0到2.333。默认为1.5
        ior: 1.6,
        // 厚度 透过看物体的模糊程度
        thickness: 0.5,
        //光强度
        lightIntensity: 1,
        // 不太懂这两个参数，加上后貌似逼真了点
        clearcoat: 1,
        clearCoatRoughness: 1,
        // 也没太弄懂，但不加上看不见雪花
        side: THREE.BackSide,
    };
    var cubeMaterial1 = new THREE.MeshPhysicalMaterial(params);
    const sphere = new THREE.Mesh(geometry, cubeMaterial1);
    scene.add(sphere);
}

function InitLights() {
    // const Elight = new THREE.AmbientLight(0xffffff); // soft white light
    // scene.add(Elight);


    const light = new THREE.HemisphereLight(0x080820, 0xffffe8, 26);
    light.position.set(0, 500, 0)
    scene.add(light);
}

function addControl() {
    /** 轨道添加 */
    controls = new OrbitControls(camera, renderer.domElement);
    controls.update();
}

function addTree() {
    var loader = new OBJLoader();
    var mTLLoader = new MTLLoader();
    mTLLoader.load('./crstal/12151_Christmas_Tree_l1.mtl', function (materials) {
        loader.setMaterials(materials); // 添加材质
        loader.load('./crstal/12151_Christmas_Tree_l1.obj', function (obj) {
            obj.children.forEach(item => {
                item.castShadow = true
                item.receiveShadow = true
            })
            treeObj = obj;
            treeObj.position.set(0, -6, 0);
            treeObj.rotateX(-1.5);
            treeObj.scale.set(0.08, 0.08, 0.07);
            scene.add(treeObj);
            // render();
            animate();
        })

    })
}

function animate() {
    requestAnimationFrame(animate);
    treeObj.rotation.z += Math.PI * 0.004;
    points.rotation.y -= Math.PI * 0.004;
    controls.update();
    render();
}

function addSnow() {
    // 创造粒子缓冲区几何体
    const particlesGeometry = new THREE.BufferGeometry();

    // 创建缓冲区存储雪花的粒子
    const vertices = [];

    // 随机生成顶点的位置
    for (let i = 0; i < 150; i++) {
        let posX = 10;
        let posY = 10;
        let posZ = 10;
        const x = THREE.MathUtils.randFloatSpread(posX);
        const y = THREE.MathUtils.randFloatSpread(posY);
        const z = THREE.MathUtils.randFloatSpread(posZ);
        vertices.push(x, y, z);
    }
    // 3代表存储的三元组：x y z
    particlesGeometry.setAttribute("position",new THREE.Float32BufferAttribute(vertices, 3));

    // 设置点的纹理材质（雪花贴图）
    const texture = new THREE.TextureLoader().load('./chrismas/icon-snow.png');
    pointsMaterial = new THREE.PointsMaterial({
        size: 0.6, // 雪花大小
        transparent: true, // 是否设置透明度
        opacity: 1, // 透明
        map: texture, // 粒子材质
        sizeAttenuation: true, // 是否相同尺寸
        color: 0xffffff,
        depthWrite: false, // 不遮挡后面的模型
    });
    points = new THREE.Points(particlesGeometry, pointsMaterial);
    scene.add(points);
}

//渲染界面  
function render() {
    renderer.render(scene, camera);
}