var model;

async function load_model() {

  const MODEL_URL = '/tfjs_model/model.json';
  model = await tf.loadLayersModel(MODEL_URL);
}

// const imageData = context.getImageData(0, 0, canvas.height, client.width);
// let cv = window.cv;

function predictImage() {
  // console.log("Predicting Image");

  let image = cv.imread(canvas);
  cv.cvtColor(image, image, cv.COLOR_RGBA2GRAY, 0);
  cv.threshold(image, image, 175, 255, cv.THRESH_BINARY);

  let contours = new cv.MatVector();
  let heirarchy = new cv.Mat();
  cv.findContours(image, contours, heirarchy, cv.RETR_CCOMP, cv.CHAIN_APPROX_SIMPLE);

  let cnt = contours.get(0);
  let rect = cv.boundingRect(cnt);
  image = image.roi(rect);

  var height = image.rows;
  var width = image.cols;

  if (height > width) {
    height = 20;
    const scaleFactor = image.rows / height;
    width = Math.round(image.cols / scaleFactor);

  } else {
    width = 20;
    const scaleFactor = image.cols / width;
    height = Math.round(image.rows / scaleFactor);
  }

  let dsize = new cv.Size(width, height)
  cv.resize(image, image, dsize, 0, 0, cv.INTER_AREA);

  const LEFT = Math.ceil((4 + (20 - width) / 2));
  const TOP = Math.ceil((4 + (20 - height) / 2));
  const RIGHT = Math.floor((4 + (20 - width) / 2));
  const BOTTOM = Math.floor((4 + (20 - height) / 2));

  // console.log(`top ${TOP}, bottom ${BOTTOM}, left ${LEFT}, right ${RIGHT}`);

  let color = new cv.Scalar(0, 0, 0, 0);
  cv.copyMakeBorder(
    image, image, TOP,
    BOTTOM, LEFT, RIGHT,
    cv.BORDER_CONSTANT, color);

  // Center of mass
  cv.findContours(image, contours, heirarchy, cv.RETR_CCOMP, cv.CHAIN_APPROX_SIMPLE);
  cnt = contours.get(0);

  const Moments = cv.moments(cnt, false);

  const cx = Moments.m10 / Moments.m00;
  const cy = Moments.m01 / Moments.m00;

  // console.log(`cx - ${cx}, cy - ${cy}, m00 - ${Moments.m00}`);

  const X_SHIFT = Math.round(image.cols / 2.0 - cx);
  const Y_SHIFT = Math.round(image.rows / 2.0 - cy);

  const newSize = new cv.Size(image.cols, image.rows);
  const M = cv.matFromArray(2, 3, cv.CV_64FC1, [1, 0, X_SHIFT, 0, 1, Y_SHIFT]);
  cv.warpAffine(image, image, M, newSize, cv.INTER_LINEAR, cv.BORDER_CONSTANT, color);

  let pixelValues = image.data;
  // console.log(pixelValues);

  pixelValues = Float32Array.from(pixelValues);

  function scaling(num){
    return num / 255.0;
  }
  
  pixelValues = pixelValues.map(scaling);

  // console.log(`Scaled Array: ${pixelValues}`);

  pixelTensor = tf.tensor([pixelValues]);
  // console.log(`Shape of tensor: ${pixelTensor.shape}`);
  // console.log(`Data Type of tensor: ${pixelTensor.dtype}`);

  const result = model.predict(pixelTensor);

  const output = result.argMax(1).dataSync()[0];

  //Testing Only
  // const outputCanvas = document.createElement('CANVAS');
  // cv.imshow(outputCanvas, image);

  // document.body.appendChild(outputCanvas);
  
  

  // cleanup
  image.delete();
  contours.delete();
  cnt.delete();
  heirarchy.delete();
  M.delete();
  pixelTensor.dispose();
  result.dispose();

  return output;

}