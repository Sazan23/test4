const SQUARES = {//массив индексов полей доски
  a8:   0, b8:   1, c8:   2, d8:   3, e8:   4, f8:   5, g8:   6, h8:   7,
  a7:  16, b7:  17, c7:  18, d7:  19, e7:  20, f7:  21, g7:  22, h7:  23,
  a6:  32, b6:  33, c6:  34, d6:  35, e6:  36, f6:  37, g6:  38, h6:  39,
  a5:  48, b5:  49, c5:  50, d5:  51, e5:  52, f5:  53, g5:  54, h5:  55,
  a4:  64, b4:  65, c4:  66, d4:  67, e4:  68, f4:  69, g4:  70, h4:  71,
  a3:  80, b3:  81, c3:  82, d3:  83, e3:  84, f3:  85, g3:  86, h3:  87,
  a2:  96, b2:  97, c2:  98, d2:  99, e2: 100, f2: 101, g2: 102, h2: 103,
  a1: 112, b1: 113, c1: 114, d1: 115, e1: 116, f1: 117, g1: 118, h1: 119
};
  
const OFFSETS = [-18, -33, -31, -14,  18, 33, 31,  14];//массив всех перемещений коня

// CSS стили
let CSS = {
  alpha: 'alpha',
  black: 'black',
  board: 'board',
  chessboard: 'chessboard',
  clearfix: 'clearfix',
  notation: 'notation',
  numeric: 'numeric',
  row: 'row',
  square: 'square',
  white: 'white'
};

const COLUMNS = 'abcdefgh'.split('');//массив знаков буквенной нотации
const SQUARE_SIZE = 80;// размер поля
const BOARD_SIZE = SQUARE_SIZE*8;// размер доски

// элементы DOM 
let  containerEl = $('#board');
let  boardEl; 

/**
 * генерирует возможные ходы
 * @param from - индекс поля 
 * @return moves - массив объектов, содержащих возможные ходы
 */ 
function generate_moves(from) {

  let moves = [];
  let index;

  if (from in SQUARES) {//проверяем существует ли такой индекс
    index = SQUARES[from];
  } else {
    //недействительный индекс
    return [];
  }
      
  for (let i = 0, len = OFFSETS.length; i < len; i++) {// перебираем массив всех перемещений
    let offset = OFFSETS[i];
    
    let square = index+offset;//индекс поля назначения
    
    if (!(square & 0x88)){//проверка на выход за пределы доски
       
      let to;
      
      for (let key in SQUARES) {
        if (square === SQUARES[key]) to = key;
      }
      
      let move = {
        from: from,
        to: to,
      };
      
      moves.push(move);
    }
  }
        
  return moves;
};

/**
 * создаёт html разметку для доски
 * @return html - доска ввиде html
 */ 
function buildBoard() {
  let html = '';

  let alpha = COLUMNS;
  let row = 8;

  let squareColor = 'white';
  
  for (let i = 0; i < 8; i++) {
    html += '<div class="' + CSS.row + '">';
    for (let j = 0; j < 8; j++) {
      let square = alpha[j] + row;

      html += '<div class="' + CSS.square + ' ' + CSS[squareColor] + ' ' +
        'square-' + square + '" ' +
        'style="width: ' + SQUARE_SIZE + 'px; height: ' + SQUARE_SIZE + 'px" ' +
        'id="' + square + '" ' +
        'data-square="' + square + '">';
        
      
      // буквенная нотация
      if (row === 1) {
        html += '<div class="' + CSS.notation + ' ' + CSS.alpha + '">' +
          alpha[j] + '</div>';
      }    
      // цифровая нотация
      if (j === 0) {
        html += '<div class="' + CSS.notation + ' ' + CSS.numeric + '">' +
          row + '</div>';
      }

      html += '</div>'; 

      squareColor = (squareColor === 'white' ? 'black' : 'white');
    }
    
    html += '<div class="' + CSS.clearfix + '"></div></div>';

    squareColor = (squareColor === 'white' ? 'black' : 'white');

    row--;
  }

  return html;
}

/**
 * создаёт div-контейнер для доски
 * @return html - div-контейнер
 */ 
function buildBoardContainer() {
  let html = '<div class="' + CSS.chessboard + '" >';
  html += '<div class="' + CSS.board + '" style="width: ' + BOARD_SIZE + 'px"></div>';
  html += '</div>';
  return html;
}

/**
 * Обрабатывает событие клика мышки по полю
 */ 
function mouseclickSquare(e) {
  
  removeGreySquares();
  
  let square = $(e.currentTarget).attr('data-square');
  greySquare(square);
    
  let moves = generate_moves(square);
  
  for (let i = 0, len = moves.length; i < len; i++) {
    let to = moves[i].to;
    greySquare(to);
  }
  
}

/**
 * подсвечиваются цветом поля возможных ходов
 * @param square - индекс поля назначения
 */ 
greySquare = function(square) {
  let squareEl = $('#board .square-' + square);
  
  let background = '#a9a9a9';
  if (squareEl.hasClass('black') === true) {
    background = '#696969';
  }

  squareEl.css('background', background);
};

/**
 * удаляет подсветку полей цветом 
*/ 
removeGreySquares = function() {
  $('#board .square').css('background', '');
};

containerEl.html(buildBoardContainer());
boardEl = containerEl.find('.' + CSS.board);
boardEl.html(buildBoard());

// клик мышки	
boardEl.on('click', '.' + CSS.square, mouseclickSquare);
