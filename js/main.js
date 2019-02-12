var canvas,
    canvasContext,
    xyScaling,
    letterWidth,
    letterSpacing,
    leftOffset,
    topOffset,
    speed,
    imageData,
    animationId,
    sparkSettings = {
      colors: ["#f96018","#ff3328","#efb813"],
      distance: [-10,-8,-7,-5,-2,2,5,7,8,10]
    };

// Each letter contains lines, which are arrays with the x-start, y-start, x-end and y-end
var a_path = [[0,100,0,0],[0,0,40,0],[40,0,40,100],[0,50,40,50]],
    b_path = [[0,100,0,0],[0,0,40,0],[40,0,40,100],[0,50,40,50],[0,100,40,100]],
    c_path = [[40,0,0,0],[0,0,0,100],[0,100,40,100]],
    d_path = [[0,100,0,0],[0,0,40,0],[40,0,40,100],[40,100,0,100]],
    e_path = [[40,0,0,0],[0,0,0,100],[0,100,40,100],[0,50,40,50]],
    f_path = [[0,100,0,0],[0,0,40,0],[0,50,40,50]],
    g_path = [[40,0,0,0],[0,0,0,100],[0,100,40,100],[40,100,40,50],[40,50,24,50]],
    h_path = [[0,100,0,0],[0,50,40,50],[40,100,40,0]],
    i_path = [[40,0,0,0],[20,0,20,100],[0,100,40,100]],
    j_path = [[40,0,40,100],[40,100,0,100],[0,100,0,50]],
    k_path = [[0,100,0,0],[0,50,40,0],[0,50,40,100]],
    l_path = [[0,0,0,100],[0,100,40,100]],
    m_path = [[0,100,0,0],[0,0,20,50],[20,50,40,0],[40,0,40,100]],
    n_path = [[0,100,0,0],[0,0,40,100],[40,100,40,0]],
    o_path = d_path,
    p_path = [[0,100,0,0],[0,0,40,0],[40,0,40,50],[40,50,0,50]],
    q_path = [[0,100,0,0],[0,0,40,0],[40,0,40,100],[40,100,0,100],[40,100,25,70]],
    r_path = [[0,100,0,0],[0,0,40,0],[40,0,40,50],[40,50,0,50],[0,50,40,100]],
    s_path = [[40,0,0,0],[0,0,0,50],[0,50,40,50],[40,50,40,100],[40,100,0,100]],
    t_path = [[0,0,40,0],[20,0,20,100]],
    u_path=[[0,0,0,100],[0,100,40,100],[40,100,40,0]],
    v_path = [[0,0,20,100],[20,100,40,0]],
    w_path = [[0,0,0,100],[0,100,40,100],[40,100,40,0],[20,100,20,50]],
    x_path = [[0,0,40,100],[0,100,40,0]],
    y_path = [[0,0,20,50],[20,50,40,0],[20,50,20,100]],
    z_path = [[0,0,40,0],[40,0,0,100],[0,100,40,100]];

function setCanvas() {
    // Get size of window, and set the wrapper and canvas sizes for a centered canvas
    // windowSize captures the window's size before any other element sizes are changed
    
    var windowSize = {
        width: window.innerWidth,
        height: window.innerHeight
      };
    canvas = document.getElementById("the_canvas");
    canvas.style.width = (windowSize.width) + "px";
    canvas.width = (windowSize.width);
    canvas.style.height = (canvas.width / 3) + "px";
    canvas.height = (canvas.width / 3);
    canvasContext = canvas.getContext('2d');
}

function randomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min ;
} 

function saveImage() {
    imageData = canvasContext.getImageData(0,0,canvas.width,canvas.height);
}

function clearCanvas() {
    canvasContext.clearRect(0, 0, canvas.width, canvas.height);
    saveImage();
}

function getScaling(letters) {
    // Setting all variables related to the canvas size and how many letters are being drawn. All letters are based on canvas width of 600, canvas height of 100, letter width of 40, letter height of 100, and 15 pixels between each letter

    xyScaling = canvas.width / 600;
    letterWidth = 40 * xyScaling;
    letterSpacing = 15 * xyScaling;
    leftOffset = (canvas.width/2) - ((letterWidth*letters.length)/2) -  ((letterSpacing*(letters.length-1))/2);
    topOffset = ((canvas.height - (100*xyScaling))/2);
    speed = roundSpeed(.1 * (xyScaling/2));
}

function roundSpeed(number) {
    // This is used to keep weird stuff from happening with decimal points and requestAnimationFrame
    
    number = Math.round( number * 100 ) / 100;
    if(number > 1) {
        return 1;
    } else {
        return number;
    }
}

function animate(letters, lineCompletion, lineCounter, letterCounter) {
    // letters - Array of letters containing arrays of x and y values for lines
    // lineCompletion - Since the animate function calls itself, this tracks line progress for a smooth animation
    // lineCounter - Used to emulate a for loop. Can't use a for loop without having the lines draw asynchronously
    // letterCounter - Used to emulate a for loop. Can't use a for loop without having the letters draw asynchronously. Also passed to drawLine to space the letters out
  
    // Set to 0 each time we start drawing a new letter
    letterCounter = letterCounter || 0;
  
    // Set to 0 each time we start drawing a new line
    lineCounter = lineCounter || 0;
  
    // Set to 0 each time we start drawing to a new point
    lineCompletion = lineCompletion || 0;
  
    // If the "letter" is a space, don't draw and set variables to check for another letter
    if(letters[letterCounter] == "space") {
        lineCompletion = 1;
        lineCounter = letters[letterCounter].length;
    } else {
        // Draw line passing x-start, y-start, x-end, y-end, linecompletion, and the letterCounter (for line spacing). This is where the actual drawing is taking place
      
        drawLine(letters[letterCounter][lineCounter][0],letters[letterCounter][lineCounter][1],letters[letterCounter][lineCounter][2],letters[letterCounter][lineCounter][3],lineCompletion,letterCounter);
    }
  
    if (lineCompletion < 1) {
        // If the end point hasn't been reached yet, add to the lineCompletion and keep going
        // Calling requestAnimationFrame this way allows for storing the Id, used to cancel the animation in clearCanvas
      
        animationId = requestAnimationFrame(function() {
            animate(letters, roundSpeed(lineCompletion + speed), lineCounter, letterCounter);
        });
    } else {
        // If the end point has been reached, increment and see if there is another line for this letter
      
        lineCounter++;
        if(lineCounter < letters[letterCounter].length) {
      // If there is another line for this letter, reset lineCompletion to 0 and start drawing the line
        
            lineCompletion = 0;
            animate(letters, lineCompletion, lineCounter, letterCounter);
        } else {
            // If there isn't another line for the letter, remove that pesky last set of sparks, increment and check for another letter to start
        
            eraseSparks();
            letterCounter++;
            if(letterCounter < letters.length) {
                // If there is another letter in the array, reset lineCompletion and lineCounter to 0 and start drawing the letter
          
                lineCompletion = 0;
                lineCounter = 0;
                animate(letters, lineCompletion, lineCounter, letterCounter);
            }
        }
    }
}

function drawLine(x1,y1,x2,y2,ratio,lettersDrawn) {
    if(imageData != undefined) {
        eraseSparks();
    }
    var xSpacing = leftOffset + (lettersDrawn * (letterSpacing + letterWidth));
    x1 = xSpacing + (x1 * xyScaling);
    x2 = xSpacing + (x2 * xyScaling);
    y1 = topOffset + (y1 * xyScaling);
    y2 = topOffset + (y2 * xyScaling);
    canvasContext.beginPath();
    canvasContext.moveTo(x1,y1);
    canvasContext.strokeStyle = "white";
    x2 = x1 + ratio * (x2-x1);
    y2 = y1 + ratio * (y2-y1);
    canvasContext.lineTo(x2,y2);
    canvasContext.closePath();
    canvasContext.stroke();
    
    // Storing the canvas image, minus sparks, so that sparks can be erased later on
    saveImage();
    spark(x2,y2);
}

function spark(x1,y1) {
    // drawLine sends the spark function x2 and y2
    // Since this will draw lines from the endpoint outward, they are x1 and y1 for this function
  
    for(i = 0; i < randomNumber(1,10); i++)
    {
        canvasContext.beginPath();
        canvasContext.moveTo(x1,y1);
        canvasContext.strokeStyle = sparkSettings.colors[randomNumber(0,2)];
        var x2 = x1 + (sparkSettings.distance[randomNumber(0,10)] * xyScaling);
        var y2 = y1 + (sparkSettings.distance[randomNumber(0,10)] * xyScaling);
        canvasContext.lineTo(x2,y2);
        canvasContext.closePath();canvasContext.stroke();
    }
}

function eraseSparks() {
    canvasContext.putImageData(imageData, 0, 0);
}

function convertInputAnimate() {
    var letters = [];
    var textInputSplit = textInput.value.split("");
    for(i = 0; i < textInputSplit.length; i++) {
        // Checking for spaces, which are handled differently than letters
        if(textInputSplit[i].toLowerCase() != " ") {
            letters.push(eval(textInputSplit[i].toLowerCase() + "_path"));
        } else {
            letters.push("space");
        }
    }
  
    if(letters.length > 0) {
        getScaling(letters);
        animate(letters);
    }
}

//Start with a clean slate when window is resized
window.addEventListener("resize", function() {
    cancelAnimationFrame(animationId);
    clearCanvas();
    setCanvas();
});

// Filter what's typed in the input field
var textInput = document.getElementById("text_input");
textInput.addEventListener("keypress", function (event) {
    var inputValue = String.fromCharCode(!event.charCode ? event.which : event.charCode);
    // Preventing non-alpha besides spaces and Enter press
    if (!/^[A-Za-z\s]+$/.test(inputValue) && event.keyCode != 13) {
        event.preventDefault();
    }
});

// Call functions to animate the message when the submit button is pressed
var submitButton = document.getElementById("submit_button");
submitButton.addEventListener("click", function (event) {
  // preventDefault is needed to keep Codepen from reloading on a change to the DOM
  event.preventDefault();
  cancelAnimationFrame(animationId);
  clearCanvas();
  convertInputAnimate();
});

// Set the canvas initially. Happens again on window resize
setCanvas();