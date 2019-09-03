const GRID_ITEM_CLASS_NAME = "grid__item";
const GRID_HEADER_CLASS_NAME = "grid__header";
const GRID_ITEM_DONE_CLASS_NAME = "done";

function GridItem(title){
    this.title = title;
    this.container;
}

GridItem.prototype.createItemElement = function(type, className){
    var element = document.createElement(type);
    element.className = className;
    return element;
}

GridItem.prototype.constructItem = function(){
    this.container = this.createItemElement("div", GRID_ITEM_CLASS_NAME);
    var header = this.createItemElement("div", GRID_HEADER_CLASS_NAME);
    header.innerHTML = this.title;
    this.container.appendChild(header);
}

GridItem.prototype.makeDone = function(){
    if(this.classList){
        this.classList.toggle(GRID_ITEM_DONE_CLASS_NAME);
    }else{
        var classes = this.className.split(" ");
        var indexOfDone = classes.indexOf(classes);
        if(indexOfDone < 0){
            this.className += " " + GRID_ITEM_DONE_CLASS_NAME;
        }else{
            this.className = classes[0];
        }
    }
}

///////////////////////////////////////

function Grid(container){
    this.container = container;
    this.length = 0;
}

function formatDate(date){
    var days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    var dayName = days[date.getDay()];
    var monthName = months[date.getMonth()];

    return date.getDate() + " " + monthName + "." + "<br>" + dayName;
}

Grid.prototype.fill = function(count, doneDates){
    var startDate = this.getDateHeader();

    for(var i=0;i<count;i++){
        var item = new GridItem(formatDate(startDate));
        item.constructItem();

        item.container.id = JSON.stringify(startDate);
        item.container.addEventListener("click", item.makeDone, false);

        this.container.appendChild(item.container);
        startDate.setDate(startDate.getDate() + 1);

        if(doneDates.includes(item.title)){
            item.makeDone.call(item.container);
        }
    }
    this.length = this.container.children.length;
}

Grid.prototype.delete = function(count, doneDates){
    var confirmDelete = confirm("Are you sure that you want to delete?");
    if(confirmDelete){
        var child = this.container.lastElementChild;
        for(var i=0;i<count;i++){
            var indexOfSelectedVal = doneDates.indexOf(child.children[0].innerHTML);
            if(doneDates.includes(child.children[0].innerHTML)){
                doneDates.splice(indexOfSelectedVal, 1);
            }
            this.container.removeChild(child);
            child = this.container.lastElementChild;
        }
        this.length = this.container.children.length;
    }
}

Grid.prototype.getDateHeader = function(){
    var lastDate;
    if(this.container.children.length){
        lastDate = new Date(JSON.parse(this.container.children[this.container.children.length-1].id));
        lastDate.setDate(lastDate.getDate() + 1);
    }else{
        var dateFromLS = localStorage.getItem("startDate");
        if(dateFromLS){
            lastDate = new Date(JSON.parse(dateFromLS));
        }else{
            lastDate = new Date();
            localStorage.setItem("startDate", JSON.stringify(lastDate));
        }
    }
    return lastDate;
}


function Task(target, container, counterContainer){
    this.id = (new Date()).getDate();
    this.target = target;
    this.counterValue = localStorage.getItem("count") || 0;

    this.dateItems = new Grid(container);
    this.doneDates = JSON.parse(localStorage.getItem("doneDates")) || [];
    this.doneCounterValue = this.doneDates.length || 0;
    this.counterField = counterContainer;
}

Task.prototype.updateCounterField = function(){
    if(this.counterValue>=1){
        this.counterField.value = this.doneCounterValue + "/" + this.counterValue;
    }else{
        this.counterField.value = "";
    }
    localStorage.setItem("count", this.counterValue);
}

Task.prototype.updateDoneDates = function(newData){
    var indexOfSelectedVal = this.doneDates.indexOf(newData);

    if(this.doneDates.indexOf(newData)<0){
        this.doneDates.push(newData);
    }else{
        this.doneDates.splice(indexOfSelectedVal, 1);

    }
    localStorage.setItem("doneDates", JSON.stringify(this.doneDates));
}


Task.prototype.changeDoneCounterValue = function(className, headerValue){
    if(className.includes("done")){
        this.doneCounterValue++;
    }else{
        this.doneCounterValue = ((this.doneCounterValue-1) > 0) ? --this.doneCounterValue : 0;
    }
    this.updateDoneDates(headerValue);
    this.updateCounterField();
}

Task.prototype.initialConfig = function(){
    this.dateItems.fill(this.counterValue, this.doneDates);

    var clickHandler = this.changeDoneCounterValue;
    var currentContext = this;
    this.dateItems.container.addEventListener("click", function(e){
        clickHandler.call(currentContext, e.target.parentElement.className, e.target.innerHTML);
    }, false);
}

Task.prototype.createDateItems = function(count){
    this.dateItems.fill(count, this.doneDates);

    this.counterValue = this.dateItems.length;
    this.updateCounterField();
}

Task.prototype.deleteDateItems = function(count){
    if(count == this.dateItems.length){
        this.doneDates = [];
        localStorage.removeItem("startDate");
    }
    this.dateItems.delete(count, this.doneDates);

    this.counterValue = this.dateItems.length;
    this.doneCounterValue = this.doneDates.length;
    this.updateCounterField();

    localStorage.setItem("doneDates", JSON.stringify(this.doneDates));
}