document.addEventListener("DOMContentLoaded", () => {
    // PLAYER CONTROL ------------------------

    const numberedButtonsContainer = document.querySelector(".numbered-buttons-container");
    const addPlayerButton = document.querySelector(".add-player");
    const playerOneButton = document.querySelector('.player-button[data-number="1"]');
    const removePlayerButton = document.querySelector("#remove-player-button");

    function createPlayerState(status) {
        return {
            chamber: [false, false, false, false, false, false],
            currentChamber: 0,
            clicks: 0,
            status: status,
            isDead: false,
            buttons: { insert: false, spin: true, trigger: true, reset: true }
        };
    }

    let playerStates = {
        1: createPlayerState(`Click "Insert Bullet" to start the game!`)
    };

    function updateUI() {
        let currentPlayer = playerStates[playerNumber];

        statusElement.textContent = currentPlayer.status;
        muzzleFlashElement.classList.toggle("show", currentPlayer.isDead);

        insertButton.disabled = currentPlayer.buttons.insert;
        spinButton.disabled = currentPlayer.buttons.spin;
        triggerButton.disabled = currentPlayer.buttons.trigger;
        resetButton.disabled = currentPlayer.buttons.reset;

        updatePlayerButtonOutline();
    }

    function switchPlayer(newPlayerNumber) {
        playerNumber = newPlayerNumber;
        updateUI();
    }

    let playerNumber = 1;
    let playerCount = 1;

    playerOneButton.addEventListener("click", () => {
        switchPlayer(1);
    });

    updatePlayerButtonOutline();

    addPlayerButton.addEventListener("click", () => {
        if (playerCount < 6) {
            playerCount++;
            let newNum = playerCount;

            playerStates[newNum] = createPlayerState("Switched to player " + newNum);

            const newPlayerButton = document.createElement("button");
            newPlayerButton.classList.add("player-button");
            newPlayerButton.dataset.number = playerCount.toString();

            const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
            const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
            const text = document.createElementNS("http://www.w3.org/2000/svg", "text");

            svg.setAttribute("viewBox", "0 0 24 24");

            circle.setAttribute("cx", "12");
            circle.setAttribute("cy", "12");
            circle.setAttribute("r", "9");

            text.setAttribute("x", "12");
            text.setAttribute("y", "16");
            text.setAttribute("text-anchor", "middle");
            text.setAttribute("font-size", "12");
            text.textContent = playerCount.toString();

            svg.append(circle, text);
            newPlayerButton.append(svg);
            numberedButtonsContainer.append(newPlayerButton);
            playerButtons = document.querySelectorAll(".player-button");

            newPlayerButton.addEventListener("click", () => {
                switchPlayer(parseInt(newNum));
            });

            switchPlayer(newNum);
        };
    });

    removePlayerButton.addEventListener("click", () => {
        if (playerCount > 1) {
            const buttonToRemove = document.querySelector(`.player-button[data-number="${playerCount}"]`);

            buttonToRemove.remove();
            delete playerStates[playerCount];

            playerCount--;

            switchPlayer(playerCount);
        }
    });

    function updatePlayerButtonOutline() {
        const playerButtons = document.querySelectorAll(".player-button");

        playerButtons.forEach((button) => {
            if (parseInt(button.dataset.number) === playerNumber) {
                button.classList.add("active");
            } else {
                button.classList.remove("active");
            }
        });
    };

    // GAME CONTROL ------------------------

    const insertButton = document.querySelector("#insert-button");
    const spinButton = document.querySelector("#spin-button");
    const triggerButton = document.querySelector("#trigger-button");
    const resetButton = document.querySelector("#reset-button");

    spinButton.disabled = true
    triggerButton.disabled = true
    resetButton.disabled = true

    const muzzleFlashElement = document.querySelector(".muzzle-flash");
    const statusElement = document.querySelector("#status");

    const shootSound = new Audio("static/sounds/shoot.mp3");
    const spinSound = new Audio("static/sounds/spin.mp3");
    const reloadSound = new Audio("static/sounds/reload.mp3");
    const clickSound = new Audio("static/sounds/click.mp3");

    insertButton.addEventListener("click", () => {
        console.log("insert button triggered")

        reloadSound.play();

        let currentPlayer = playerStates[playerNumber];

        let randomPosition = Math.floor(Math.random() * currentPlayer.chamber.length);
        currentPlayer.chamber[randomPosition] = true;
        console.log(currentPlayer.chamber)

        currentPlayer.status = "Bullet Inserted"
        
        currentPlayer.buttons.spin = false;
        currentPlayer.buttons.trigger = false;
        currentPlayer.buttons.insert = false;
        currentPlayer.buttons.reset = false;

        updateUI();
    });

    triggerButton.addEventListener("click", () => {
        console.log("trigger button triggered")

        let currentPlayer = playerStates[playerNumber];
        let condition = currentPlayer.chamber[currentPlayer.currentChamber];

        if (condition) {
            shootSound.pause();
            shootSound.currentTime = 0;
            shootSound.play();

            currentPlayer.isDead = true;
            currentPlayer.status = "You Died"

            currentPlayer.buttons.spin = true;
            currentPlayer.buttons.trigger = true;
            currentPlayer.buttons.insert = true;
            currentPlayer.buttons.reset = false;
        } else {
            clickSound.pause();
            clickSound.currentTime = 0;
            clickSound.play();

            currentPlayer.clicks++;

            if (currentPlayer.clicks === 1) {
                currentPlayer.status = `Click`
            } else {
                currentPlayer.status = `Click (${currentPlayer.clicks - 1}x)`
            }

            currentPlayer.chamber[currentPlayer.currentChamber] = null;

            currentPlayer.currentChamber++;

            if (currentPlayer.currentChamber >= currentPlayer.chamber.length) {
                currentPlayer.currentChamber = 0;
            }   

            while (currentPlayer.chamber[currentPlayer.currentChamber] === null) {
                currentPlayer.currentChamber++;
            }
        }

        updateUI();
    });

    spinButton.addEventListener("click", () => {
        console.log("spin button triggered")

        spinSound.pause();
        spinSound.currentTime = 0;
        spinSound.play();

        let currentPlayer = playerStates[playerNumber];

        let randomPosition = Math.floor(Math.random() * currentPlayer.chamber.length);

        while (currentPlayer.chamber[randomPosition] === null) {
            randomPosition = Math.floor(Math.random() * currentPlayer.chamber.length);
        }

        currentPlayer.currentChamber = randomPosition;
        console.log("Current chamber:", currentPlayer.currentChamber);

        currentPlayer.status = "Chamber Spun"

        updateUI();
    });

    resetButton.addEventListener("click", () => {
        console.log("reset button triggered")

        playerStates[playerNumber] = createPlayerState("Game Reset");
        updateUI();
    });

    updateUI();
});