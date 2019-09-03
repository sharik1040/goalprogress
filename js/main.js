var Schedule = {}

Schedule.gridContainer = document.getElementById("gridContainer");
Schedule.counterField = document.getElementById("counterValue");
Schedule.targetField = document.getElementById("targetValue");

// main class
Schedule.task = new Task("", Schedule.gridContainer, Schedule.counterField);
Schedule.task.initialConfig();

Schedule.gridBoxes = [];


Schedule.targetField.addEventListener("keydown", saveTargetHandler, false);
Schedule.counterField.addEventListener("keypress", сounterkeyPressHandler, false);
Schedule.counterField.addEventListener("keydown", updateGridStructureHandler, false);
Schedule.counterField.addEventListener("focus", counterFieldFocusHandler, false);
Schedule.counterField.addEventListener("blur", counterFieldBlurHandler, false);

function saveTargetHandler(e){
    if(e.keyCode === 13){
        Schedule.task.title = e.target.value;
        localStorage.setItem("target", e.target.value);
    }
}
function counterFieldBlurHandler(){
    Schedule.task.updateCounterField();
}
function counterFieldFocusHandler(e){
    e.target.value = Schedule.task.counterValue || 0;
}
function сounterkeyPressHandler(e){
    if(e.keyCode < 48 || e.keyCode > 58) e.preventDefault();
}
function updateGridStructureHandler(e){
    if(e.keyCode==13){
        var prevCount = Schedule.task.counterValue;
        var userInput = parseFloat(e.target.value);
        var newCount;

        if(userInput>prevCount){
            newCount = userInput-prevCount;
            Schedule.task.createDateItems(newCount);
        }
        else if(userInput<prevCount){
            newCount = prevCount-userInput;
            Schedule.task.deleteDateItems(newCount);
        }
        e.target.blur();
    }
}

Schedule.task.updateCounterField();
Schedule.targetField.value = localStorage.getItem("target") || "";