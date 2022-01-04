import './style.css'
import * as THREE from 'three'
const TWEEN = require('@tweenjs/tween.js')
const imgLoader = new THREE.ImageLoader();
const canvas = document.querySelector('canvas.webgl')

const scene = new THREE.Scene()

scene.touchedOn = false;
scene.position.set(0.4, 0.4, 0.7);

const protogonistGeometry = new THREE.CylinderGeometry( 28, 28, 18, 3 );

const protogonistMaterial = new THREE.MeshPhongMaterial();
  
var vectorsArr = [];
for (var i = -3; i < (protogonistGeometry.attributes.position.array).length; i += 3) {
    const el = (protogonistGeometry.attributes.position.array);
    vectorsArr.push(new THREE.Vector3(el[i], el[i+1], el[i+2]))
}

const protogonist = new THREE.Mesh(protogonistGeometry, protogonistMaterial);


protogonist.castShadow = true;
protogonist.receiveShadow = true;
protogonist.position.set(0, 13, 70);
scene.add(protogonist)

const trackGeometry = new THREE.BoxGeometry( 128, 0.1, 2000 );

const trackMaterial = new THREE.MeshPhongMaterial({
    color: 0x00cbd7,
});

const track = new THREE.Mesh(trackGeometry,trackMaterial)
track.receiveShadow = true;
track.position.set(0, -1.4, -800);
scene.add(track)


let sphereArray = [];

const sphereGeometry = new THREE.SphereBufferGeometry( 8, 16 );


let sphereMaterialRed = new THREE.MeshLambertMaterial({
    color: 0xdb0045,
});
let sphereMaterialGreen = new THREE.MeshLambertMaterial({
    color: 0x00d900,
});

const getRandomArbitrary = (min, max) => {
    return Math.random() * (max - min) + min;
  }

const newSphere = (row) =>{
        if(Math.round(getRandomArbitrary(0, 1))){
            sphereArray[sphereArray.length] = new THREE.Mesh(sphereGeometry,sphereMaterialRed);
            sphereArray[sphereArray.length-1].score = -1;
        } else{
            sphereArray[sphereArray.length] = new THREE.Mesh(sphereGeometry,sphereMaterialGreen);
            sphereArray[sphereArray.length-1].score = 1;
        }
        sphereArray[sphereArray.length-1].position.set(getRandomArbitrary(-52, 47), 9, 800-(row*35));
        sphereArray[sphereArray.length-1].arrIndex = sphereArray.length-1;

        sphereArray[sphereArray.length-1].castShadow = true;
        sphereArray[sphereArray.length-1].receiveShadow = true;
        
        track.add(sphereArray[sphereArray.length-1])
}
newSphere();

for (var i = 0; i < 30; i++) {
    newSphere(i)
}


let cloudArray = [];


const cloudGeometry = new THREE.SphereBufferGeometry( 15, 16 );


const cloudMaterial = new THREE.MeshPhongMaterial({
    color: 0x8aafde
});


const newCloud = (row) =>{
        cloudArray[cloudArray.length] = new THREE.Mesh(cloudGeometry,cloudMaterial);
        cloudArray[cloudArray.length-1].position.set(getRandomArbitrary(-150, 150), 175+getRandomArbitrary(0, 10), 800-(getRandomArbitrary(20, 50)*(i*4)));
        cloudArray[cloudArray.length-1].arrIndex = cloudArray.length-1;
        
        track.add(cloudArray[cloudArray.length-1])
        let bulkArr = () => {
            let bulk = new THREE.Mesh(cloudGeometry,cloudMaterial);
            let scaleSet = getRandomArbitrary(0.7, 1);
            bulk.position.set(getRandomArbitrary(12, 12), getRandomArbitrary(-1, 4), getRandomArbitrary(-12, 12));
            bulk.scale.set(scaleSet, scaleSet, scaleSet);
            return bulk
        }
        for (let i = 0; i < getRandomArbitrary(3, 6); i++) {
            cloudArray[cloudArray.length-1].add(
                bulkArr()
            )
        }
}
newCloud();
for (var i = 0; i < 14; i++) {
    newCloud(i)
}

const pointLight2 = new THREE.DirectionalLight(0xfffffff, 0.3)
pointLight2.distance = 0.1;
pointLight2.position.set(122.3, 122.33, -111);
scene.add(pointLight2);

const pointLight3 = new THREE.AmbientLight(0xfffffff, 0.8)
pointLight3.position.set(141, 281, 260);
scene.add(pointLight3);

var spotLight2 = new THREE.SpotLight(0xffffff, 0.4);
spotLight2.position.set(61, 331, 100);
spotLight2.castShadow = true;
spotLight2.shadowMapWidth = 2048; // Shadow Quality
spotLight2.shadowMapHeight = 2048; // Shadow Quality
scene.add(spotLight2);
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () => {
    sizes.width = window.innerWidth;
    sizes.height = window.innerHeight;
    camera.aspect = sizes.width / sizes.height;
    camera.updateProjectionMatrix();
    renderer.setSize(sizes.width, sizes.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1))
})

const camera = new THREE.PerspectiveCamera(75, sizes.width / (sizes.height), 0.1, 9000)
// camera.position.x = 0
// camera.position.y = 512
// camera.position.z = 0
// camera.rotation.x = -3.14/2 
camera.position.x = 0;
camera.position.y = 108;
camera.position.z = 206;
camera.rotation.x = -0.2;
scene.add(camera);



const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true,
    alpha: true
})
renderer.setSize(sizes.width, sizes.height);
renderer.shadowMapEnabled = true;
renderer.shadowMapSoft = true;
renderer.shadowMapType = THREE.PCFShadowMap;
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))




scene.fog = new THREE.FogExp2( 0xffffff, 0.001 );

var poiterTouch = false;
renderer.domElement.addEventListener("pointerdown", () => poiterTouch = true);
renderer.domElement.addEventListener("pointerup", () => poiterTouch = false);
renderer.domElement.addEventListener("pointermove", function(e) {
    if (poiterTouch) {
        dragProtogonist(e)
    }
});


var previousTouch;
renderer.domElement.addEventListener("touchmove", function(e) {
    const touch = e.touches[0];
    if (previousTouch) {
        e.movementX = touch.pageX - previousTouch.pageX;
        dragProtogonist(e);
    }
    previousTouch = touch;
});
renderer.domElement.addEventListener("touchend", (e) => {
    previousTouch = null;
});
const dragProtogonist = (e) => {
    
            
    if(clock.elapsedTime<=(scene.touchedOn+10)){
        protogonist.position.x += ((e.movementX*88)/(window.innerWidth));
        if(protogonist.position.x >= 31) protogonist.position.x = 31;
        if(protogonist.position.x <= -31) protogonist.position.x = -31;
        
    }

}


const clock = new THREE.Clock();

const tick = () =>
{
    if(scene.touchedOn)
        if(clock.elapsedTime<=(scene.touchedOn+10)){
            
        const originPoint = protogonist.position;
        vectorsArr.forEach((el, vertexIndex) =>
            {		
                var globalVertex = el.applyMatrix4( protogonist.matrix );
                var directionVector = globalVertex.sub( protogonist.position );
                
                var ray = new THREE.Raycaster( originPoint, directionVector.normalize() );
                var collisionResults = ray.intersectObjects( sphereArray );
                if ( collisionResults.length > 0 && collisionResults[0].distance < 32 ) {
                    if(!collisionResults[0].object.isTweening){
                        collisionResults[0].object.isTweening = true;
                        let tweenKill = (i) => {setTimeout(() => {
                                collisionResults[0].object.scale.set(i,i,i)
                            }, i*100);
                        }
                        for (let i = 1; i>0; i-=0.01) {
                            tweenKill(i)
                        }
                        
                        sphereArray.splice(collisionResults[0].object.arrIndex, 1)
                        sphereArray.forEach((el, i) => {
                            el.arrIndex = i;
                        });
                        chengeScore(collisionResults[0].object.score, collisionResults[0].object)
                        setTimeout(() => {
                            collisionResults[0].object.isTweening = false;
                            track.remove(collisionResults[0].object)
                        }, 100);
                    }
                    return false
                }
            })
        
        track.position.z += 0.8;

        } else{
            document.querySelector('body').className = 'game_final';
        }
    const elapsedTime = clock.getElapsedTime()

    protogonist.rotation.y = 0.5 * elapsedTime;

    window.requestAnimationFrame(tick)
	TWEEN.update(tick)
    renderer.render(scene, camera)
}
let redColor = new THREE.Color(0xdb0045);
let greenColor = new THREE.Color(0x00d900);
tick()
let score = 0;

// Kostili




const particlesParent = new THREE.Object3D();
const particlesArr = [];
const particlesGeom = new THREE.SphereBufferGeometry( 1, 5 );
let particlesMaterial = new THREE.MeshLambertMaterial({
    opacity: 0xdb0045
});
const particlesArrInit = () =>{
        particlesArr[particlesArr.length] = new THREE.Mesh(particlesGeom,particlesMaterial);
        particlesArr[particlesArr.length-1].position.set(0, 0, 0);
        particlesParent.add(particlesArr[particlesArr.length-1])
}

for (var i = 0; i < 44; i++) {
    particlesArrInit(i)
}
track.add(particlesParent);


let particlesAnim = (obj, color) =>{
    let particlesParentTemp = particlesParent.clone();
    track.add(particlesParentTemp);
    particlesParentTemp.position.set(obj.position.x, obj.position.y-8, obj.position.z);
    particlesParentTemp.children.forEach((el,i) => {
        el.material = new THREE.MeshLambertMaterial({
            color: color
        });
        el.position.set(getRandomArbitrary(-8,8), getRandomArbitrary(8,17), getRandomArbitrary(-8,8)) 
    });
    let intevalIter = 1
    let inteval = setInterval(() => {
        particlesParentTemp.children.forEach((el,i) => {
            el.position.y = el.position.y/intevalIter*0.9
            if(el.position.y>0.001){

                el.position.x = el.position.x *(1+intevalIter/40);
                el.position.z = el.position.z *(1+intevalIter/40);
            }
        });
        intevalIter +=0.05;
    }, 20);
    setTimeout(() => {
        clearInterval(inteval)
        intevalIter = 1;
        let hideInterval = setInterval(() => {
            particlesParentTemp.children.forEach((el,i) => {
                    
                    el.position.y += 0.5*intevalIter
                    el.material.opacity -= 0.01
            });
            intevalIter +=0.3;
        }, 10);
        setTimeout(() => {
            clearInterval(hideInterval);
            track.remove(particlesParentTemp)
        }, 200);
    }, 300);
}

let tweenColor = (newColor, obj) => {
    particlesAnim(obj, newColor);
    let interval = setInterval(() => {
        protogonist.material.color.r = (protogonist.material.color.r + newColor.r)/2
        protogonist.material.color.g = (protogonist.material.color.g + newColor.g)/2
        protogonist.material.color.b = (protogonist.material.color.b + newColor.b)/2
    }, 500/10);
    setTimeout(() => {
        clearInterval(interval)
    }, 300);
}


let chengeScore = (mod, obj) => {
    if (mod == -1) {
        tweenColor(redColor, obj)
    }
     else if (mod == 1){
        tweenColor(greenColor, obj)
    }
    document.getElementById('score').textContent = score += mod;
}

document.addEventListener('pointerdown', ()=> {
    if(!scene.touchedOn) scene.touchedOn = clock.elapsedTime;
});

document.getElementById('play_now_btn').addEventListener('pointerdown', ()=> {
        // google
        //   ExitApi.exit();
        // google
        // FB
        //   FbPlayableAd.onCTAClick()
        // FB
        // iron
        //   dapi.openStoreUrl();
        // iron
        // unity
            var userAgent = navigator.userAgent || navigator.vendor;
            var url = "https://play.google.com/store/apps/details?id=com.unity3d.auicreativetestapp&hl=ru&gl=US";
            var android = "https://play.google.chttps://play.google.com/store/apps/details?id=com.unity3d.auicreativetestapp&hl=ru&gl=USom/store/apps/details?id=com.plarium.solitaire";
            if (/android/i.test(userAgent)) {
              url = android;
            }
            mraid.open(url);
        // unity

});
chengeScore(0);