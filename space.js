//cuadro
let tileSize = 50;//el tamaño del mosaico
let rows = 17;//numero filas
let columns = 17;//numero columnas

let board;//se asocia a las variables en este caso a board
let boardWidth = tileSize * columns; // el ancho del cuadro se saca por medio de el numero de cuadros por el numero de columnas 34 * 17
let boardHeight = tileSize * rows; //el alto del cuadro se saca por medio de el numero de cuadros por el numero de filas 34 * 17
let context;//nos indica en favor de quien se ejecuta dicha función

//esqueleto
let skeletonWidth = tileSize*2;//se establece el ancho de el esqueleto por medio de el tamaño del mosaico por dos
let skeletonHeight = tileSize;//se establece por medio de el numero de cuadros
let skeletonX = tileSize * columns/2 - tileSize;//es donde se va acomodar el tamaño del mosaico por las columnas divididas entre dos menos el tamaño del mosaico, es para que se alinie en el lugar asignado del esqueleto
let skeletonY = tileSize * rows - tileSize*2;//es el tamaño del mosaico por el numero de fila por dos

let skeleton = {//se asocia a las variable skeleton
    x : skeletonX,//se asocia el valor conseguido por medio de la operacion 
    y : skeletonY,//se asocia el valor conseguido por medio de la operacion anterior
    width : skeletonWidth,//se asocia el valor conseguido por medio de la operacion anterior
    height : skeletonHeight//se asocia el valor conseguido por medio de la operacion anterior
}

let skeletonImg;//es la imagen del esqueleto
let skeletonVelocityX = tileSize; //es la velocidad del esqueleto

//Steve
let SteveArray = [];//es un tipo de dato estructurado que permite almacenar un conjunto de datos homogeneo
let SteveWidth = tileSize*2;//es el valor del ancho tamaño de la imagen que se dapor medio
let SteveHeight = tileSize;//se asocia el valor conseguido por medio de la operacion anterior
let SteveX = tileSize;//se asocia el valor conseguido por medio de la operacion anterior
let SteveY = tileSize;//se asocia el valor conseguido por medio de la operacion anterior
let SteveImg;//es la imagen del steve

let SteveRows = 2;// indica la fila de los steve
let SteveColumns = 3;//indica la columna de los steve
let SteveCount = 0; //numero de Steve's a derrotar
let SteveVelocityX = 3; // Steve's velocidad del movimiento

//bullet
let bulletArray = [];//es un tipo de dato estructurado que permite almacenar un conjunto de datos homogeneo
let bulletVelocityY = -13; //velocidad de la bala 

let score = 0;//se asocia aq el valor de el puntaje
let gameOver = false;

window.onload = function() {//nos indica la funcion windows
    board = document.getElementById("board");//es un metodo que permite seleccionar un el elemento por medio del atributo indicado
    board.width = boardWidth;//nos indica el ancho del borde
    board.height = boardHeight;//nos indica la altura del borde
    context = board.getContext("2d"); //se usa para dibujar en el tablero 

    //carga las imagenes
    skeletonImg = new Image();//se carga la imagen del esqueleto
    skeletonImg.src = "./skeleton.png";//se ingresa la imagen
    skeletonImg.onload = function() {//el evento onload permite ejecutar la accion que se le indica justo cuando se cargan los elementos de la pagina
    context.drawImage(skeletonImg, skeleton.x, skeleton.y, skeleton.width, skeleton.height);// indica donde se ingresara la imagen por medio de los valores anteriormente indicados
    }

    SteveImg = new Image();//se carga la imagen del steve
    SteveImg.src = "./Steve.png";//se ingresa la imagen
    createSteve();//se crea el steve

    requestAnimationFrame(update);//informa al navegador que quieres realizar una animación y solicita que el navegador programe el repintado de la ventana para el próximo ciclo de animación.
    document.addEventListener("keydown", moveSkeleton);// registra un evento a un objeto en específico, toma el evento para escuchar, el segundo argumento que se llamará cada vez que se active el evento
    document.addEventListener("keyup", shoot);// registra un evento a un objeto en específico, toma el evento para escuchar, el segundo argumento que se llamará cada vez que se active el evento
}

function update() {//reemplaza todo un registro en un origen de datos.
    requestAnimationFrame(update);// registra un evento a un objeto en específico, toma el evento para escuchar, el segundo argumento que se llamará cada vez que se active el evento

    if (gameOver) {
        return;
    }

    context.clearRect(0, 0, board.width, board.height); //para que el esqueleto no se repita

    //skeleton
    context.drawImage(skeletonImg, skeleton.x, skeleton.y, skeleton.width, skeleton.height);// indica donde se colocara la imagen por medio de los valores anteriormente indicados

    //Steve
    for (let i = 0; i < SteveArray.length; i++) {//si se eliminan los steve se va aumentando la cantidad de estos
        let Steve = SteveArray[i];//se le dan mas datos en conjunto a dtrve por medio de array 
        if (Steve.alive) {// si hay steve's se aumenta la velocidad e estos
            Steve.x += SteveVelocityX;

            //si toca los bordes
            if (Steve.x + Steve.width >= board.width || Steve.x <= 0) {//se realizan las operaciones y si alguno es veradero se ejecuta la funcion gracias a || que sirve como or
                SteveVelocityX *= -1;
                Steve.x += SteveVelocityX*2;// si toca los bordes su velocidad va cambiando

                //mover a todos los Steve hacia arriba en una fila
                for (let j = 0; j < SteveArray.length; j++) {//por medio de esta operacion el valor del largo va a ir aunmentando
                    SteveArray[j].y += SteveHeight;//aqui aumenta la altura de este
                }
            }
            context.drawImage(SteveImg, Steve.x, Steve.y, Steve.width, Steve.height);//indica donde se colocara la imagen por medio de los valores anteriormente indicados

            if (Steve.y >= skeleton.y) {// si el steve llega a la posicion del esqueleto termina el juego
                gameOver = true;
            }
            }
        }

        //disparo
        for (let i = 0; i < bulletArray.length; i++) { //por medio de esta operacion el valor de largo va a ir aunmentando

            let bullet = bulletArray[i];//se le dan mas datos en conjunto a la bala por medio de array 
            bullet.y += bulletVelocityY; //cambia la velocidad
            context.fillStyle="white";//el color de la bala
            context.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);// indica donde se colocara la bala por medio de los valores anteriormente indicados


            //bullet collision with Steve 
            for (let j = 0; j < SteveArray.length; j++) {
                let Steve = SteveArray[j];//se le dan mas datos en conjunto a steve por medio de array 

                if (!bullet.used && Steve.alive && detectCollision(bullet, Steve)) {//se detecta si hay una colicion entre el steve y la bala

                    bullet.used = true;//si la bala fue usada se usa la condicion de verdadero o falso
                    Steve.alive = false;//si el steve sigue vivo se usa la condicion de verdadero o falso
                    SteveCount--;//se cuenta el numero de steve
                    score += 100;//si el steve murio se aumenta la puntuacion
                }
            }

        }

       //quitar las balas

        while (bulletArray.length > 0 && (bulletArray[0].used || bulletArray[0].y < 0)) {
            bulletArray.shift(); //Quita el primer elemento de array
        }

         //next level
         if (SteveCount == 0) {//si la cantidad de steve's es igual a 0, aumentan al siguiente nivel en columnas y filas

        SteveColumns = Math.min(SteveColumns + 1, columns/2 -2);// se hacen operaciones por medio de math.min, este es un objeto intrínseco que proporciona funcionalidad matemática básica y constantes

        SteveRows = Math.min(SteveRows + 1, rows-4);  //cap at 16-4 = 12
        SteveVelocityX += 0.2; //Aumentar la velocidad del movimiento de steve hacia la derecha
        SteveArray = [];//se le dan mas datos en conjunto a steve por medio de array
        bulletArray = [];//se le dan mas datos en conjunto a la bala por medio de array
        createSteve();//se crean los steve

    }

    //score
    context.fillStyle="white";//es el estilo y color de la puntuacion
    context.font="16px courier";//el tamaño y tipo de letra

    context.fillText(score, 5, 20);//dibuja una cadena de texto en las coordenadas especificadas

    }

function moveSkeleton(e) {//evento del movimiento del esqueleto
    if (gameOver) {
        return;
    }
      if (e.code == "ArrowLeft" && skeleton.x - skeletonVelocityX >= 0) { //hace que la flecha y el esqueleto se muevan en conjunto segun la velocidad y posicion de este

        skeleton.x -= skeletonVelocityX; //Mover a la izquierda en un mosaico 
    }
    else if (e.code == "ArrowRight" && skeleton.x + skeletonVelocityX + skeleton.width <= board.width) {//hace que la flecha y el esqueleto se muevan en conjunto segun la velocidad y posicion de este

        skeleton.x += skeletonVelocityX; //Mover a la derecha en un mosaico 
    }
}

function createSteve() { //se crean mas steve's

    for (let c = 0; c < SteveColumns; c++) {//aumenta el numero de columnas
        for (let r = 0; r < SteveRows; r++) { //aumenta el numero de filas

            let Steve = {
                img : SteveImg, //se colocan mas steve's

                x : SteveX + c*SteveWidth, //se colocan segun el ancho
                y : SteveY + r*SteveHeight, //se colocan segun el alto
                width : SteveWidth,
                height : SteveHeight,
                alive : true //se realiza la funcion si es falso o verdadero
            }
            SteveArray.push(Steve);//Anexa nuevos elementos al final del array y devuelve la nueva longitud del array.

        }
    }
    SteveCount = SteveArray.length; //Obtiene o establece la longitud del array y se hace para el conteo el numero de steve.

}

function shoot(e) { // evento de la funcion de disparos
    if (gameOver) {
        return;
    }

    if (e.code == "Space") { //si el evnto que ocurre es realizado con la barra de espacio
        //dispara
        let bullet = {
            x : skeleton.x + skeletonWidth*15/44, //se colocan segun el ancho
            y : skeletonY, //se colocan segun el alto
            width : tileSize/8,
            height : tileSize/2,
            used : false //se realiza la funcion si es falso o verdadero
        }
        bulletArray.push(bullet); //Anexa nuevos elementos al final del array y devuelve la nueva longitud del array.
    }
}


function detectCollision(a, b) {//se activa la funcion que detecta las coliciones
    return a.x < b.x + b.width &&   //La esquina superior izquierda de A no llega a la esquina superior derecha de B
           a.x + a.width > b.x &&   //La esquina superior derecha de A pasa por la esquina superior izquierda de B
           a.y < b.y + b.height &&  //La esquina superior izquierda de A no llega a la esquina inferior izquierda de B
           a.y + a.height > b.y;    //La esquina inferior izquierda de A pasa la esquina superior izquierda de B
}