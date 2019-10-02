//Tworzymy obiekt gry
function TicTacToeGame() {
    this.gameContainer = document.querySelector('#game-container')
    this.xUser = 'x';
    this.oUser = 'o';
    this.currentUser = this.xUser;
    this.win = false;
    this.moveCounter = 0;
};

TicTacToeGame.prototype.result = [
    ['a1', 'b1', 'c1'],
    ['a2', 'b2', 'c2'],
    ['a3', 'b3', 'c3'],
    ['a1', 'a2', 'a3'],
    ['b1', 'b2', 'b3'],
    ['c1', 'c2', 'c3'],
    ['a1', 'b2', 'c3'],
    ['c1', 'b2', 'a3'],
];

//Funckja initializujaca tworzenie gry
TicTacToeGame.prototype.init = function () {
    /* if(this.modal != undefined) {
         this.modal.close();
     } */ //tutaj wchodzi w inifinite lookup, sprobooj znalezc rozwiazanie
    const table = this.createTable();
    this.gameContainer.innerHTML = '';
    const xUser = document.querySelector('#x-user').value;
    const oUser = document.querySelector('#o-user').value;
    if (xUser != oUser && !this.win) {
        this.xUser = xUser;
        this.oUser = oUser;
        this.gameContainer.appendChild(table);
        this.currentUser = xUser;
    } else if (this.win) {
        this.win = false;
        this.init();
    } else {
        this.modal = new Modal('Podaj różne imiona!');
    }
}
//Funkcja tworząca tabelę
TicTacToeGame.prototype.createTable = function () {
    const table = document.createElement('table');
    ['1', '2', '3'].forEach(function (rowId) {
        const row = this.createRow(rowId);
        table.appendChild(row)
    }.bind(this));
    return table;
};
//Funkcją tworząca wiersz
TicTacToeGame.prototype.createRow = function (rowId) {
    const row = document.createElement('tr');
    ['a', 'b', 'c'].forEach(function (col) {
        const cell = this.createCell(col + rowId);
        row.appendChild(cell);
    }.bind(this));
    return row;
};
//Funcja tworząca komórkę
TicTacToeGame.prototype.createCell = function (id) {
    const cell = document.createElement('td');
    cell.className = 'cell';
    cell.id = id;
    cell.dataset.value = ''; //do wartosci value przypisujemy pusty string
    cell.addEventListener('click', this.cellClickHandler.bind(this));
    return cell;
};

TicTacToeGame.prototype.cellClickHandler = function (event) {
    const cell = event.target;
    if (cell.innerHTML !== '' || this.win) {
        return;
    }
    if (this.currentUser === this.xUser) {
        cell.innerHTML = '&times;';
        cell.dataset.value = 'x';
    } else if (this.currentUser === this.oUser) {
        cell.innerHTML = '&cir;';
        cell.dataset.value = 'o';
    }
    this.win = this.checkResult();

    if (this.win) {
        this.modal = new Modal('Wygrał ' + this.currentUser, this.init.bind(this));
    } else {
        this.currentUser = this.currentUser === this.xUser ? this.oUser : this.xUser;
    }

};

TicTacToeGame.prototype.checkResult = function () {
    let win = false;
    for (let idx = 0; idx < this.result.length; idx++) {
        const resRow = this.result[idx]; //to tablica skladajac sie 3 wartosci tablicy np. a1,a2,a3.
        const result = resRow.map(function (id) {
            const cell = document.querySelector('#' + id);
            return cell.dataset.value;
        }).join('');


        if (result === 'xxx' || result === 'ooo') {
            win = true;
            break;
        }
      }
    return win;
};

function Modal(message, closeCallback) {
    this.closeCallback = closeCallback;
    this.modalEl = document.createElement('div');
    this.modalEl.className = 'modal';
    this.modalEl.innerHTML = '<p>' + message + '</p>';
    const closeButton = document.createElement('button');
    closeButton.innerText = 'Zamkinij';
    closeButton.addEventListener('click', this.close.bind(this)); //bind this mówi, że ta funckja powina działać w kontekście funkcji.
    this.modalEl.appendChild(closeButton);
    document.documentElement.appendChild(this.modalEl);

}
//Dodajemy metode pozwalającą nam ukryć utworzony element
Modal.prototype.close = function () {
    this.modalEl.remove();
    if (this.closeCallback != undefined) {
        this.closeCallback();
    }
};

//const modal = new Modal("loren ipsum");

const game = new TicTacToeGame();

const button = document.querySelector('#start-game');


function checkNames() {
    button.disabled = !(xUser.value != '' && oUser.value != '')
}

const xUser = document.querySelector('#x-user');
const oUser = document.querySelector('#o-user');

xUser.addEventListener('input', checkNames);
oUser.addEventListener('input', checkNames);

document.querySelector('#start-game').addEventListener('click', function () {
    game.init();
});
