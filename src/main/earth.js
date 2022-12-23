import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

var scene = new THREE.Scene(); // 创建场景
var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000); // 创建相机
var renderer = new THREE.WebGLRenderer(); // 渲染器
renderer.setClearAlpha(0); // 设置渲染器的透明度

renderer.setSize(window.innerWidth, window.innerHeight); // 设置渲染器 大小
document.body.appendChild(renderer.domElement);

/** 轨道添加 */
const controls = new OrbitControls(camera, renderer.domElement);
controls.update();

scene.add(camera);

/* 满足右手准则 */
camera.position.z = 50;

// 创建圆弧对象 ArcCurve，参数：0, 0圆弧坐标原点x，y 30：圆弧半径 0, 2 * Math.PI：圆弧起始角度；
// var geometry = new THREE.BufferGeometry();
// var arcCurve = new THREE.ArcCurve(0, 0, 30, 0, 2 * Math.PI);
// geometry.setFromPoints(arcCurve.getPoints(50));
// var material = new THREE.LineBasicMaterial({ color: 0xee00ff });
// var line = new THREE.Line(geometry, material);
// scene.add(line);


const pointLight = new THREE.PointLight( 0xffffff, 1, 0 );
// 设置光线：环境光无阴影
// const pointLight = new THREE.AmbientLight(0xffffff);
pointLight.position.x = 0;
pointLight.position.y = 0;
pointLight.position.z = 1000;
scene.add(pointLight);

var group = new THREE.Group();

/* 加坐标轴 */
// const axesHelper = new THREE.AxesHelper(50);
// scene.add(axesHelper);

/* 加地球贴图 */
var textureLoader = new THREE.TextureLoader();
textureLoader.load('./earth.png', function (texture) {
    const geometry = new THREE.SphereGeometry(12, 32, 16);
    var material = new THREE.MeshLambertMaterial({
        map: texture,//设置颜色贴图属性值
    });
    /* 将材质赋到物体上 */
    var mesh = new THREE.Mesh(geometry, material); // 网格模型对象Mesh
    group.add(mesh);
    scene.add(mesh); //网格模型添加到场景中

    textureLoader.load('./moon.jpg', function (textureMoon) {
        const geometryMoon = new THREE.SphereGeometry(4, 32, 32);
        var material = new THREE.MeshLambertMaterial({
            map: textureMoon,
        });
        var meshMoon = new THREE.Mesh(geometryMoon, material);
        meshMoon.position.set(16, 0, 16);
        group.add(meshMoon);
        scene.add(group);

        animate();

        function animate() {
            requestAnimationFrame(animate);
            meshMoon.rotation.y += Math.PI * 0.001;
            mesh.rotation.y += Math.PI * 0.001;
            group.rotation.y += Math.PI * 0.004;
            controls.update();
            render();
        }

    })



})

/* 加月球贴图 */
// textureLoader.load('./moon.jpg', function (texture) {
//     const geometryMoon = new THREE.SphereGeometry(4, 32, 32);
//     var material = new THREE.MeshLambertMaterial({
//         map: texture,
//     });
//     var mesh = new THREE.Mesh(geometryMoon, material);
//     mesh.position.set(20, 20, 0);
//     scene.add(mesh);
//     group.add(mesh);

//     animate();

//     function animate() {
//         requestAnimationFrame(animate);
//         mesh.rotation.y += Math.PI * 0.001;
//         controls.update();
//         render();
//     }
// })

/* 生成一个带有贴图的球体 */
// const generateSphere = async (r, url) => {
//     var mesh = nul;
//     await textureLoader.load(url, function (texture) {
//         var geometry = new THREE.SphereGeometry(r, 32, 32);
//         var material = new THREE.MeshLambertMaterial({
//             map: texture,
//         });
//         mesh = new THREE.Mesh(geometry, material);
//     })

//     if(mesh) return mesh;

// }


// var Moon = generateSphere(4, './moon.jpg');
// console.log(Moon)
// scene.add(Moon);

//渲染界面  
function render() {
    renderer.render(scene, camera);
}


// 获取随机数
function getRandom(n, m) {
    return Math.floor(Math.random() * (m - n + 1)) + n;
}
