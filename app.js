'use strict';

var imgArray = ['bag.jpg','banana.jpg','bathroom.jpg','boots.jpg','breakfast.jpg','bubblegum.jpg','chair.jpg','cthulhu.jpg','dog-duck.jpg','dragon.jpg','pen.jpg','pet-sweep.jpg','scissors.jpg','shark.jpg','sweep.png','tauntaun.jpg','unicorn.jpg','usb.gif','water-can.jpg','wine-glass.jpg'];
var nameArray = ['bag', 'banana', 'bathroom', 'boots', 'breakfast', 'bubblegum', 'chair', 'cthulhu', 'dog-duck', 'dragon', 'pen', 'pet-sweep', 'scissors', 'shark', 'sweep', 'tauntaun', 'unicorn', 'usb', 'water-can', 'wine-glass'];
var productArray = [];
var totalClicks = 0;
var img1 = document.getElementById ('left');
var img2 = document.getElementById ('center');
var img3 = document.getElementById ('right');
var pictureList = [];

function Products(itemName, itemPath) {
  this.itemName = itemName;
  this.itemPath = itemPath;
  this.itemClick = 0;
  this.imageShown = 0;
  productArray.push(this);
};
for (var i = 0; i < imgArray.length; i++) {
  var filePath = 'assets/' + imgArray[i];
  console.log('assets/' + imgArray[i] );
  new Products(nameArray[i], filePath);
}
// creating a localstorage  =======================================================
if (localStorage.pictureList) {
  var storageArray = JSON.parse(localStorage.pictureList);
  for (var i = 0; i < storageArray.length; i++) {
    productArray[i].itemClick = productArray[i].itemClick+storageArray[i].itemClick;
    productArray[i].imageShown = productArray[i].imageShown+storageArray[i].imageShown;
  }
}


function randomImgIndex() {
  return Math.floor(Math.random() * imgArray.length);
  console.log();
}
var prevImgIndexes = [];
function randomImage() {
  var currentImgIndexes = [];
  while (currentImgIndexes.length < 3) {
    var imgSelector = randomImgIndex();
    //below this means if current AND previous ImgIndex are not the same or true (which they are) then run the randomImgIndex
    if (!currentImgIndexes.includes(imgSelector) && !prevImgIndexes.includes(imgSelector)) {
      currentImgIndexes.push(imgSelector);
    }
  }
  var prod1 = productArray[currentImgIndexes[0]];
  var prod2 = productArray[currentImgIndexes[1]];
  var prod3 = productArray[currentImgIndexes[2]];
  console.log(currentImgIndexes);
  img1.src = prod1.itemPath;
  img2.src = prod2.itemPath;
  img3.src = prod3.itemPath;

  //i used index to collet the img indexes in order to count the number  of clicks
  img1.index = currentImgIndexes[0];
  img2.index = currentImgIndexes[1];
  img3.index = currentImgIndexes[2];

//turns current images to previous in order to get new images (and not repeat previous images).
  prevImgIndexes = currentImgIndexes;
  //increases image shows in incraments of 1
  prod1.imageShown++;
  prod2.imageShown++;
  prod3.imageShown++;
};

randomImage();
var clickLimit = 25;


function handleTheClick() { //self-exlpainatory
  randomImage(); //run this function
  totalClicks++; //incrament clicks up to 25, set below with event listener
  var productIdx = this.index; //use index to pont to index in array in order to collect the instances the item was clicked
  productArray[productIdx].itemClick++;

  if (totalClicks === clickLimit) {
    img1.removeEventListener('click', handleTheClick);
    img2.removeEventListener('click', handleTheClick);
    img3.removeEventListener('click', handleTheClick);
    //stops the event listener once we reach 25 clicks
    productClicks(); //this is defined below
  }
  // i put the json here so it will run wiht  handleTheClick so its track and store in pictureList array ==========================
  localStorage.pictureList = JSON.stringify(productArray);
};

img1.addEventListener('click', handleTheClick);
img2.addEventListener('click', handleTheClick);
img3.addEventListener('click', handleTheClick);
//this calls the event listener and names the event 'click' and runs handleTheClick.

var voteTotals = [];


function productClicks() {
  for (var i = 0; i < productArray.length; i++) {
    voteTotals.push(productArray[i].itemClick);
  }

  var canvas = document.getElementById('chart');
  var ctx = canvas.getContext('2d');
  var data = {
    labels: nameArray,
    datasets: [{
      label: 'Product Name',
      data: voteTotals,
      backgroundColor: 'red'
    }]
  };

  var myChart = new Chart(ctx, {
    type: 'bar',
    data: data,
    options: {
      scales: {
        yAxes: [{
          ticks: {
            beginAtZero:true
          }
        }]
      }
    }
  });
}