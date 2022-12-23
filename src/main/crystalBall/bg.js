const canvas = document.getElementById('bg')
const ctx = canvas.getContext('2d')

// 获取当前视图的宽度和高度
let aw = document.documentElement.clientWidth || document.body.clientWidth;
let ah = document.documentElement.clientHeight || document.body.clientHeight;
canvas.width = aw;
canvas.height = ah;

// 图片相关参数
var count = 0,images = {},imgNum = 0;
// 文字宽高
var textW = 210, textH = 70;
// 顶部星星、背景星星
var topStars = [], stars = [];

init();
loadImgs();
requestAnimationFrame(animate);

function init() {
    for (let i = 0; i < 5; i++) {
        topStars.push(new TopStar((aw / 5) * i + 25));
    }
    for (let i = 0; i < 60; i++) {
        stars.push(new Star());
    }
}

function loadImgs() {
    var img = new Image();
    img.src = './crstal/starshaow.png';
    var sources = {
        starshaow: "./crstal/starshaow.png",
        text: "./crstal/text.png",
        leaf: "./crstal/leaf.png",
    };
    //调用图片预加载
    loadImages(sources, function (images) { });
}


function animate() {
    ctx.clearRect(0, 0, aw, ah);

    // 画文字
    ctx.drawImage(images.text, aw / 2 - textW / 2, 150, textW, textH);
    // 叶子
    ctx.save();//保存状态
    ctx.drawImage(images.leaf, 40, 490, 150, 120);
    
    ctx.scale(-1, 1);
    ctx.translate(-aw, 0);
    ctx.drawImage(images.leaf, 30, 490, 150, 120);
    ctx.restore(); //恢复状态
   
    for (let i = 0; i < topStars.length; i++) {
        topStars[i].draw();
        topStars[i].update();
    }

    // 小星星
    for (let i = 0; i < stars.length; i++) {
        stars[i].draw();
        stars[i].update();
    }

    requestAnimationFrame(animate);
}

/** 
 * 创建顶部星星
 * */ 
function TopStar(x) {
    this.w = 30;
    this.x = x;
    this.y = 30;
    this.angle = getRandom(0, 45);
    this.rotateDir = 'L';
}

TopStar.prototype.draw = function () {
    ctx.save();//保存状态
    let centerX = this.x + this.w / 2; // 中心点X
    let centerY = 0;  // 中心点Y
    ctx.translate(centerX, centerY);//设置画布上的(0,0)位置，也就是旋转的中心点
    ctx.rotate((this.angle * Math.PI) / 180);
    ctx.translate(-centerX, centerY);//设置画布上的(0,0)位置，也就是旋转的中心点
    ctx.beginPath();
    ctx.setLineDash([2, 3]);
    ctx.moveTo(centerX, 0);
    ctx.lineTo(centerX, this.y + this.w / 2);
    ctx.lineWidth = 0.5;
    ctx.strokeStyle = '#dfa814';
    ctx.stroke();
    // dots
    ctx.drawImage(images.starshaow, this.x, this.y, this.w, this.w);
    ctx.restore(); //恢复状态
}

TopStar.prototype.update = function () {
    if (this.rotateDir === 'L') {
        this.angle += 0.5;
        if (this.angle > 45) {
            this.rotateDir = 'R'
        }
    }

    if (this.rotateDir === 'R') {
        this.angle -= 0.5;
        if (this.angle < -45) {
            this.rotateDir = 'L'
        }
    }

}

/**
 * 创建背景星星
 *  */ 

function Star() {
    this.x = getRandom(0, aw);
    this.y = getRandom(0, ah / 3)
    this.starSize = 1;
    this.maxSize = getRandom(1, 4); // 纵轴长度，横轴长度是0.25倍
    this.dir = 'up';
    this.starSpeed = 0.06;
}

Star.prototype.draw = function () {
    var color = '#FFCCBC'
    // 围绕中心生成四个小三角形
    ctx.beginPath();
    ctx.moveTo(this.x, this.y - this.starSize);
    ctx.lineTo(this.x - this.starSize * 0.25, this.y);
    ctx.lineTo(this.x + this.starSize * 0.25, this.y);
    ctx.fillStyle = color;
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(this.x + this.starSize, this.y);
    ctx.lineTo(this.x, this.y - this.starSize * 0.25);
    ctx.lineTo(this.x, this.y + this.starSize * 0.25);
    ctx.fillStyle = color;
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(this.x, this.y + this.starSize);
    ctx.lineTo(this.x - this.starSize * 0.25, this.y);
    ctx.lineTo(this.x + this.starSize * 0.25, this.y);
    ctx.fillStyle = color;
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(this.x - this.starSize, this.y);
    ctx.lineTo(this.x, this.y - this.starSize * 0.25);
    ctx.lineTo(this.x, this.y + this.starSize * 0.25);
    ctx.fillStyle = color;
    ctx.fill();
}

Star.prototype.update = function () {
    if (this.dir === 'up') {
        this.starSize = this.starSize + this.starSpeed;
        if (this.starSize >= this.maxSize) {
            this.dir = 'down';
        }
    } else {
        this.starSize = this.starSize - this.starSpeed;
        if (this.starSize < 2) {
            this.dir = 'up';
        }
    }
}

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

// 获取随机数
function getRandom(n, m) {
    return Math.floor(Math.random() * (m - n + 1)) + n;
}
