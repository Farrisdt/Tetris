document.addEventListener('DOMContentLoaded', () =>{
    const grid = document.querySelector('.grid') //main play area
    let squares = Array.from(document.querySelectorAll('.grid div')) //individual squares on grid
    const scoreDisplay = document.querySelector('#score')
    const startBtn = document.querySelector('#start-button')
    const width=10 //size of a row, allows movement on grid (1 width = 1 row down)
    let nextRandom = 0 //next block up
    let timerId //allows movement and pausing
    let score = 0
    let gmover = false //marks if game is complete
    const colors =['gold','tomato','teal','limegreen','slateblue'] //colors for tetros. Must be in same order as theTetros array

    //Tetrominoes
    const lTetro = [
        [1, width+1, width*2+1, 2],
        [width, width+1, width+2, width*2+2],
        [width*2, width+1, width*2+1, 1],
        [width, width*2, width*2+1, width*2+2]
    ]
    
    const zTetro = [
        [0,1,width+1, width+2],
        [1, width, width+1, width*2],
        [0,1,width+1, width+2],
        [1, width, width+1, width*2],
    ]
    const tTetro = [
        [width, width+1, width+2, 1],
        [1, width+1, width+2, width*2+1],
        [width, width+1, width+2, width*2+1],
        [width, width+1, 1, width*2+1],
    ]
    const oTetro = [
        [0, 1, width, width+1],
        [0, 1, width, width+1],
        [0, 1, width, width+1],
        [0, 1, width, width+1],
    ]
    const iTetro = [
        [0,1,2,3],
        [0, width, width*2, width*3],
        [0,1,2,3],
        [0, width, width*2, width*3],
    ]
    
    const theTetros = [lTetro, zTetro, tTetro, oTetro, iTetro]

    let currentPosition = 4 //where tetros apear on grid
    let currentRotation = 0 //which rotation of a tetro is displayed
    let random = Math.floor(Math.random()*theTetros.length) //chooses tetro from theTertos array
    let current = theTetros[random][currentRotation]

    
    const displaySquares = document.querySelectorAll('.minigrid div') //the preview grid
    const displaywidth = 4
    let displayIndex = 0
    const upNext = [ //array of first rotation of all the peices. Probably should be combined with theTetros for editing's sake.
        [1, displaywidth+1, displaywidth*2+1, 2],
        [0,1,displaywidth+1, displaywidth+2],
        [displaywidth, displaywidth+1, displaywidth+2, 1],
        [0, 1, displaywidth, displaywidth+1],
        [0,1,2,3]
    ]


    function draw(){
        current.forEach(index => {
            squares[currentPosition + index].classList.add('tetro')
            squares[currentPosition + index].style.backgroundColor = colors[random]
        })
    }

    function undraw(){
        current.forEach(index => {
            squares[currentPosition + index].classList.remove('tetro')
            squares[currentPosition + index].style.backgroundColor = ''
        })
    }

    function moveDown() {
        undraw()
        currentPosition += width
        draw()
        freeze()
    }

    function freeze() { //stops tetros when the hit the bottom, each other, at pause
        if(current.some(index => squares[currentPosition + index + width].classList.contains('taken'))){
            current.forEach(index => squares[currentPosition + index].classList.add('taken'))
            random = nextRandom
            nextRandom = Math.floor(Math.random()*theTetros.length)
            current = theTetros[random][currentRotation]
            currentPosition = 4
            draw()
            displayShape()
            addScore()
            gameOver()
        }
    }

    function moveLeft() { //keeps tetro from moving through left wall
        undraw()
        const isAtLeftEdge = current.some(index => (currentPosition + index) % width === 0)

        if(!isAtLeftEdge) currentPosition -= 1
        if(current.some(index => squares[currentPosition + index].classList.contains('taken'))) {
            currentPosition += 1
        }
        draw()
    }
    function moveRight() { //keeps tetro from moving throught right wall
        undraw()
        const isAtRightEdge = current.some(index => (currentPosition + index) % width === width-1)

        if(!isAtRightEdge) currentPosition += 1
        if(current.some(index => squares[currentPosition + index].classList.contains('taken'))) {
            currentPosition -= 1
        }
        draw()
    }
    function rotate() { //spins tetro
        undraw()
        currentRotation ++
        if(currentRotation===current.length){
            currentRotation=0
        }
        current = theTetros[random][currentRotation]
        draw()
    }
    document.addEventListener('keydown', control) //uses wasd to move tetros. Can hold down key for faster movement.
    function control(e){
        if(!gmover){
            if(e.keyCode === 65){moveLeft()}
            if(e.keyCode === 68){moveRight()}
            if(e.keyCode === 83){moveDown()}
            if(e.keyCode === 87){rotate()}
        }
    }
    function displayShape(){ //displays tetro in preview grid
        displaySquares.forEach(square =>{
            square.classList.remove('tetro')
            square.style.backgroundColor = ''
        })
        upNext[nextRandom].forEach(index =>{
            displaySquares[displayIndex + index].classList.add('tetro')
            displaySquares[displayIndex + index].style.backgroundColor = colors[nextRandom]
        })
    }

    startBtn.addEventListener('click', () => { //start/pause functionality
        if (timerId) {
          clearInterval(timerId)
          timerId = null
        } else {
          draw()
          timerId = setInterval(moveDown, 650)
          displayShape()
        }
      })
    function addScore(){ //adds 10 per row removed (10 being the width of the row)
        for(let i = 0; i<199; i +=width){
            const row = [i, i+1, i+2, i+3, i+4, i+5, i+6, i+7, i+8, i+9]

            if(row.every(index => squares[index].classList.contains('taken'))){
                score+=10
                scoreDisplay.innerHTML = score
                row.forEach(index => {
                    squares[index].classList.remove('taken')
                    squares[index].classList.remove('tetro')
                    squares[index].style.backgroundColor = ''
                })
                const squaresRemoved = squares.splice(i, width)
                squares = squaresRemoved.concat(squares)
                squares.forEach(cell => grid.appendChild(cell))
            }
        }
    }
    function gameOver(){ //stops game
        if(current.some(index => squares[currentPosition+index].classList.contains('taken'))){
            gmover = true //used to disallow wasd movement after game over
            scoreDisplay.innerHTML = score + ' GAME OVER'
            clearInterval(timerId)
        }
    }
})