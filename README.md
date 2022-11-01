# Math Garden

Math garden is a fun project with uses machine learning to recognize handwritten digits and builds a game around that.

The application displays:

  1. Two digits to be summed
  2. A drawing box to write the digits into.

## About the Project

The project contains files important to its functioning:

### Model

The model used for classifying the digits is stored in the `tfjs_model` folder. This model classifies a digit drawn into the canvas to digits between 0 and 9.

### Web Processing

The logic for processing the digit drawn into the canvas into a format understood by the model lies in the `processing.js` file.

### Drawing logic

`drawing.js` contains the logic behind drawing on the canvas.

### Game logic

Everytime a correct number is drawn on the canvas, the game plants a flower in the garden(webpage) and if an incorrect answer is inputted the flowers in the garden begin to wilt.
The code implementing this logic can be found in `math.js`.
