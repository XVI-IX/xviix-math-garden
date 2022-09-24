var answer;
var score = 0;
var images = [];

function nextQuestion() {
  const n1 =  Math.round(Math.random() * 4);
  document.getElementById('n1').innerHTML = n1;

  const n2 = Math.round(Math.random() * 5);
  document.getElementById('n2').innerHTML = n2;

  answer = n1 + n2;

}

function checkAnswer() {
  const prediction = predictImage();

  console.log(`Answer - ${answer}, Prediction ${prediction}`)

  if (answer === prediction){

    score++;
    console.log(`Correct!!! Score - ${score}`);

    if (score <= 6){

      images.push(`url('images/background${score}.svg')`);
      document.body.style.backgroundImage = images;

    } else {
      alert("well done, your garden is in full bloom");
      score = 0;
      images = [];
      document.body.style.backgroundImage = images;
    }
    

  } else {
    if (score > 0){
      score--;
      alert("Oops! Try Again");
      setTimeout(function() {
        images.pop();
        document.body.style.backgroundImage = images;
      }, 1000)
    }
    console.log(`wrong!!!! Score: ${score}`);
  }
}