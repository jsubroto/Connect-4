class Connect4 {
    constructor(selector) {
        this.ROWS = 6;
        this.COLS = 7;
        this.player = "red";
        this.selector = selector;
        this.isGameOver = false;
        this.onPlayerMove = function() {};
        this.createGrid();
        this.setupEventListener();
    }

    createGrid() {
        $("#output").html(`It's <span id="player">red</span>'s turn!`);
        const $board = $(this.selector);
        $board.empty();
        this.isGameOver = false;
        this.player = "red";
        // console.log($board);
        for (let row = 0; row < this.ROWS; row++) {
            const $row = $("<div>")
                .addClass("row");
            for (let col = 0; col < this.COLS; col++) {
                const $col = $("<div>")
                    .addClass("col empty")
                    .attr("data-row", row)
                    .attr("data-col", col); // attr = add attributes
                $row.append($col);
            }
            $board.append($row);
            // console.log($board.html());
        }
    }

    setupEventListener() {
        const $board = $(this.selector);

        const that = this;

        function findLastEmptyCell(col) {
            const cells = $(`.col[data-col="${col}"]`);
            for (let counter = cells.length - 1; counter >= 0; counter--) {
                const $cell = $(cells[counter]);
                if ($cell.hasClass("empty")) {
                    return $cell;
                }
            }
            return null;
            // console.log(cells);
        }

        $board.on("mouseenter", ".col.empty", function () {
            if (that.isGameOver) return;
            // console.log(this);
            const col = $(this).data("col");
            const $lastEmptyCell = findLastEmptyCell(col);
            $lastEmptyCell.addClass(`next-${that.player}`);
            // console.log(col);
        })

        $board.on("mouseleave", ".col", function () {
            $(".col").removeClass(`next-${that.player}`);
        })

        $board.on("click", ".col.empty", function () {
            if (that.isGameOver) return;
            const col = $(this).data("col");
            const row = $(this).data("row");
            const $lastEmptyCell = findLastEmptyCell(col);
            $lastEmptyCell.removeClass(`empty next-${that.player}`);
            $lastEmptyCell.addClass(that.player);
            $lastEmptyCell.data("player", that.player);
            

            const winner = that.checkForWinner($lastEmptyCell.data("row"), $lastEmptyCell.data("col"))
            if (winner) {
                that.isGameOver = true;
                $(".col.empty").removeClass("empty");
                $("#restart").addClass("show");
                $("#output").text(`Game Over! Player ${that.player} has won!`);
                return;
            }

            that.player = (that.player === "red") ? "black" : "red";
            that.onPlayerMove();
            $(this).trigger("mouseenter");

        })
    }

    checkForWinner(row, col) {
        // console.log(this.player, ", ", row, ", ", col);
        const that = this;

        function $getCell(row, col) {
            return $(`.col[data-row="${row}"][data-col="${col}"]`);
        }

        function checkDirection(direction) {
            let total = 0;
            let i = row + direction.i;
            let j = col + direction.j;
            let $next = $getCell(i, j);
            while (i >= 0 && i < that.ROWS && j < that.COLS && $next.data("player") === that.player) {
                total++;
                i += direction.i;
                j += direction.j;
                $next = $getCell(i, j);
            }
            return total;
        }

        function checkWin(directionA, directionB) {
            const total = 1 + checkDirection(directionA) + checkDirection(directionB);
            if (total >= 4) {
                return that.player;
            } else {
                return null;
            }
        }

        function checkDiagonalBLtoTR() {
            return checkWin({i: 1, j: 1}, {i: -1, j: -1}); // Down to left then Up right
        }

        function checkDiagonaTLtoBR() {
            return checkWin({i: 1, j: -1}, {i: -1, j: 1}); // Down to right then Up left
        }

        function checkVerticals() {
            return checkWin({i: -1, j: 0}, {i: 1, j: 0}); // Up then down
        }

        function checkHorizontals() {
            return checkWin({i: 0, j: -1}, {i: 0, j: 1}); // Right then left
        }

        return checkVerticals() || checkHorizontals() || checkDiagonalBLtoTR() || checkDiagonaTLtoBR();
    }

    restart() {
        this.createGrid();
        this.onPlayerMove();
        $("#restart").removeClass("show");
    }
}