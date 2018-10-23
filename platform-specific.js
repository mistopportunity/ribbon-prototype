var debug_values = {
    highscore: 0,
    playing_music: true,
    playing_sounds: true,
    coins: 0,
    owned_scramblers: 0,
    owned_scissors: 0,
    owns_colors: true,
    owns_grocery_king: false,
    blue_theme: false
};
var storage = {
    exists: function(key) {
        if(debug_values[key] !== undefined) {
            return true;
        } else {
            return false;
        }
    },
    set: function(key,value) {
        debug_values[key] = value;
        //todo
    },
    get: function (key) {
        return debug_values[key];
        //todo
    }
}
var InputSchematic = {
    Up: null,
    Down: null,
    Left: null,
    Right: null,
    Enter: null,
    Back: null,
}
document.addEventListener("keypress",function(e){
    switch(e.keyCode) {
        case 119://w
            if(InputSchematic.Up) {
                InputSchematic.Up();
            }
            break;
        case 115://s
        if(InputSchematic.Down) {
            InputSchematic.Down();
        }
            break;
        case 97://a
            if(InputSchematic.Left) {
                InputSchematic.Left();
            }
            break;
        case 100://d
            if(InputSchematic.Right) {
                InputSchematic.Right();
            }
            break;
        case 32://space
        case 13://enter
            if(InputSchematic.Enter) {
                InputSchematic.Enter();
            }
            break; 
        case 8://backspace
        case 98://b
            if(InputSchematic.Back) {
                InputSchematic.Back();
            }
            break;
    }
});
