
const canvas = document.getElementById('Christmas')
const ctx = canvas.getContext('2d')

// 获取当前视图的宽度和高度
let aw = document.documentElement.clientWidth || document.body.clientWidth
let ah = document.documentElement.clientHeight || document.body.clientHeight

canvas.width = aw - 5
canvas.height = ah - 5

var count = 0,
    images = {},
    imgNum = 0;
function loadImages(sources, callback) {
    for (src in sources) {
        imgNum++;
    }
    for (src in sources) {
        images[src] = new Image();
        images[src].onload = function () {
            if (++count >= imgNum) {
                callback(images);
            }
        }
        images[src].src = sources[src];
    }
}

var sources = {
    snow: "./chrismas/icon-snow.png",
    tree: "./chrismas/tree.png",
    snowMan: "./chrismas/snowman.png",
    snowfiled: "./chrismas/snowfiled.png",
    snowfiled2: "./chrismas/snowfiled2.png",
};

//调用图片预加载函数，实现回调函数  
loadImages(sources, function (images) {
    
});



var snows = []; // 星星
for (let i = 0; i < 250; i++) {
    snows.push(new Snow());
}

function Snow() {
    this.x = getRandom(0, aw);
    this.y = getRandom(0, ah);
    this.w = getRandom(10, 20);
    this.speed = getRandom(25, 55);
    this.angle = 0;
}

Snow.prototype.draw = function () {
    ctx.save();//保存状态
    // 中心点
    let centerX = this.x + (this.w / 2);
    let centerY = this.y + (this.w / 2);
    ctx.translate(centerX, centerY);//设置画布上的(0,0)位置，也就是旋转的中心点
    ctx.rotate((this.angle * Math.PI) / 180);
    ctx.translate(-centerX, -centerY);//设置画布上的(0,0)位置，也就是旋转的中心点
    ctx.drawImage(images.snow, this.x, this.y, this.w, this.w);

    ctx.restore();//恢复状态

}

Snow.prototype.update = function () {
    this.y += (this.speed / 50);
    this.angle += 0.5;

    if (this.y > ah + 5) {
        this.y = 50;
    }
}


function animate() {
    ctx.clearRect(0, 0, aw, ah);
    ctx.drawImage(images.snowfiled, 0, ah - 60, aw, 70);
    ctx.drawImage(images.snowfiled2, 0, ah - 60, aw, 70);
    ctx.drawImage(images.tree, aw / 2, ah - 150, 150, 150);
    ctx.drawImage(images.snowMan, aw / 2 + 150, ah - 100, 100, 100);

    // 小星星
    for (let i = 0; i < snows.length; i++) {
        snows[i].draw();
        snows[i].update();
    }

    requestAnimationFrame(animate);
}
requestAnimationFrame(animate);
// 获取随机数
function getRandom(n, m) {
    return Math.floor(Math.random() * (m - n + 1)) + n;
}