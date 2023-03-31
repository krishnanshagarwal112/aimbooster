const canvas = document.getElementById('canvas')
const right_sound = document.getElementById('right')
const error_sound = document.getElementById('error')
const scoreTag = document.getElementById('score')
const resetBtn = document.getElementById('reset')
canvas.width = 600
canvas.height = 500




let lives = 3
let score = 0
let totalObstacles = 0
let accuracy = 0

const ctx = canvas.getContext('2d')
ctx.strokeRect(0,0, canvas.width, canvas.height);

let obstacles = []
class Obstacle{
    constructor(x,y,rad) {
        this.x = x
        this.y = y
        this.rad = rad
        this.grow = true
    }

    draw(){
        ctx.beginPath();
        ctx.arc(this.x, this.y,this.rad, 0, 2 * Math.PI);
        ctx.stroke()
    }
}
let grow = true

let gameLoop = setInterval(game,40)     // Our game loop
let obstacleLoop = setInterval(generateObstacle,550);     // adds obstacles after every 2s
function game(){
    if(lives <= 0){
        ctx.clearRect(1,1,canvas.width-2,canvas.height-2)
        clearInterval(gameLoop)
        clearInterval(obstacleLoop)
        accuracy  = (score/totalObstacles) * 100
        scoreTag.innerHTML = `Score : ${score}
                            <br>`        

    }   
    else{
        ctx.clearRect(1,1,canvas.width-2,canvas.height-2) // clear everything once and then redraw all the obstacles again !
        for(let i = 0; i < obstacles.length; i++){
            obstacles[i].draw()
            if(obstacles[i].rad == 45){
                obstacles[i].grow = false
            }
            if(obstacles[i].grow){
                obstacles[i].rad += 1
            }
            else{
                obstacles[i].rad -= 1
            }

            // to prevent error
            if(obstacles[i].rad <= 0){
                error_sound.currentTime = 0
                error_sound.playbackRate = 1.5
                error_sound.play()
                lives--
                obstacles.splice(i, 1)
                obstacles.forEach(element => {
                    element.draw()
                });
            }
        }
    }
    

}

canvas.addEventListener('click',(e)=>{
    let mouseX = e.clientX
    let mouseY = e.clientY
    const distanceFromTop = canvas.offsetTop;
    const distanceFromLeft = canvas.offsetLeft;
 
    obstacles.forEach(ob =>{

        let dis = Math.sqrt(Math.pow(mouseX - (ob.x + distanceFromLeft), 2) + Math.pow(mouseY - (ob.y + distanceFromTop), 2));
        console.log(dis)
        if(dis <= ob.rad){
            right_sound.currentTime = 0
            right_sound.play()
            score++;
            scoreTag.innerHTML = `Score : ${score}`
            let index = obstacles.indexOf(ob)
            console.log('collision')
            obstacles.splice(index, 1)
            obstacles.forEach(element => {
                element.draw()
            });
        }
    })
})

function generateObstacle(){
    let randomX  = Math.floor(Math.random() * (canvas.width - 100)) + 50;
    let randomY  = Math.floor(Math.random() * (canvas.height - 100)) + 50;
    let radius = Math.floor(Math.random() * 15) + 1;
    let ob = new Obstacle(randomX,randomY,radius)
    obstacles.push(ob)
    totalObstacles++
}


resetBtn.addEventListener('click',()=>{
    clearInterval(gameLoop)
    clearInterval(obstacleLoop)

    score = 0
    scoreTag.innerHTML = `Score : ${score}`
    ctx.clearRect(1,1,canvas.width-2,canvas.height-2)
    lives = 3
    totalObstacles = 0
    accuracy = 0
    obstacles = []

    gameLoop = setInterval(game,35)
    obstacleLoop = setInterval(generateObstacle,600)
})