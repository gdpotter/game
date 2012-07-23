define(function() {
    var game, app;

    var initApp = function() {
        // On page ready(function() {
          //  console.log('Your mom');
            // app = new App();

            // Do any code to make the page all nice

            initGame();
        //});
    };

    var initGame = function() {
        require(['game'], function(Game) {
            var canvas = document.getElementById('game-canvas');

            game = new Game(canvas);

            document.addEventListener('keydown', function(event) {
                game.keyDown(event);
            });

            document.addEventListener('keyup', function(event) {
                game.keyUp(event);
            });

            setTimeout(function() {
                game.start(); // Give it a sec to load the map :)
            }, 100);
            window.game = game;
        });
    };

    initApp();
});
