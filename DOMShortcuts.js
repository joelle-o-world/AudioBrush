function numberInputWithLabel(name, min, max, steps) {
    var wrapper = document.createElement("div");
    wrapper.className = "inputWrapper";
    
    var input = document.createElement("input");
    input.wrapper = wrapper;
    input.name = name;
    
    input.type = "number";
    input.min = min;
    input.max = max;
    if(steps != undefined) {
        input.steps = (max-min)/steps;
    }
    
    var label = document.createElement("label");
    label.innerText = name + ":";
    label.setAttribute("for", name);
    
    wrapper.appendChild(label);
    wrapper.appendChild(input);
    
    return input;
}

function rangeWithLabel(name, min, max, steps) {
    if(steps == undefined) {
        steps = 100;
    }
    
    var wrapper = document.createElement("div");
    wrapper.className = "inputWrapper";
    
    var input = document.createElement("input");
    input.wrapper = wrapper;
    input.name = name;
    
    input.type = "range";
    input.min = min;
    input.max = max;
    input.step = (max-min)/steps;
    
    var label = document.createElement("label");
    label.innerText = name + ":";
    label.setAttribute("for", name);
    
    wrapper.appendChild(label);
    wrapper.appendChild(input);
    
    return input;
}

function labelWrapInput(inputElement, label, name) {
    if(name == undefined) {
        if(inputElement.name == undefined) {
            name = label;
        } else {
            name = inputElement.name;
        }
    }
    
    var wrapper = document.createElement("div");
    wrapper.className = "inputWrapper";
    
    var labelElement = document.createElement("label");
    labelElement.setAttribute("for", name);
    labelElement.innerText = label+":";
    
    wrapper.appendChild(labelElement);
    wrapper.appendChild(inputElement);
    
    wrapper.label = labelElement;
    wrapper.input = inputElement;
    inputElement.wrapper = wrapper;
    inputElement.label = labelElement;
    
    return wrapper;
}

function createFrequencyInput() {
    var input = document.createElement("input");
    input.class = "frequency";
    input.setAttribute("type", "number");
    input.min = 20;
    input.max = 22000;
    return input;
}

function createRangeInput(min, max, steps) {
    if(min == undefined) {
        min = 0;
    }
    if(max == undefined) {
        max = 1;
    }
    if(steps == undefined) {
        steps = 100;
    }
    
    var input = document.createElement("input");
    input.setAttribute("type", "range");
    input.min = min;
    input.max = max;
    input.step = (max-min)/steps;
    
    return input;
}