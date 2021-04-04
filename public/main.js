// worked with my house hayden

var bettingValue = document.querySelector("#bettingValue");
var choice = document.querySelector("#choice");
document.querySelector("#submitBet").addEventListener('click', bet);
bettingValue.addEventListener('keydown', enterKey);

function enterKey(e) {
  console.log('hello')
  if (e.code === 'Enter' || e.code === 'NumpadEnter')
    bet();
}

function bet() {
  if (bettingValue.value < 1) {
      document.querySelector('.betTooLittle').innerText = 'Bet must be greater than or equal to 1';
    return;
  }
  else if(bettingValue.value % 1 != 0) {
    document.querySelector('.betTooLittle').innerText = 'Go big or go home!';
    return;
  }
  const red = [1, 3, 5, 7, 9, 12, 14, 16, 18, 21, 23, 25, 27, 28, 30, 32, 34, 36],
        black = [2, 4, 6, 8, 10, 11, 13, 15, 17, 19, 20, 22, 24, 26, 29, 31, 33, 35],
        row1 = [1, 4, 7, 10, 13, 16, 19, 22, 25, 28, 31, 34],
        row2 = [2, 5, 8, 11, 14, 17, 20, 23, 26, 29, 32, 35],
        row3 = [3, 6, 9, 12 ,15, 18, 21, 24, 27, 30, 33, 36];
  let houseWins = true,
      bettingOn = choice.value,
      //Goes from 0 to 37: 0 = 0, 1-36 = red/black/even/odd/high/low/row1/row2/row3/1-12/13-24/25-36, 37 = 00
      randomNumber = Math.floor(Math.random() * 38);
    switch(bettingOn) {
      case 'red': houseWins = red.includes(randomNumber) ? false : true; break;
      case 'black': houseWins = black.includes(randomNumber) ? false : true; break;
      case 'even': houseWins = (randomNumber % 2 === 0) ? false : true; break;
      case 'odd': houseWins = (randomNumber % 2 !== 0) ? false : true;break;
      case 'row1': houseWins = row1.includes(randomNumber) ? false : true; break;
      case 'row2': houseWins = row2.includes(randomNumber) ? false : true; break;
      case 'row3': houseWins = row3.includes(randomNumber) ? false : true; break;
      case '1-18': houseWins = (randomNumber >= 1 && randomNumber <= 18) ? false : true; break;
      case '19-36': houseWins = (randomNumber >= 19 && randomNumber <= 36) ? false : true; break;
      case '1-12': houseWins = (randomNumber >= 1 && randomNumber <= 12) ? false : true; break;
      case '13-24': houseWins = (randomNumber >= 13 && randomNumber <= 24) ? false : true; break;
      case '25-36': houseWins = (randomNumber >= 25 && randomNumber <= 36) ? false : true; break;
      case '0': houseWins = (randomNumber === 0) ? false : true; break;
      case '00': houseWins = (randomNumber === 37) ? false : true; break;
    }

  // if ((red.includes(randomNumber) && bettingOn === 'red') ||
  //     (black.includes(randomNumber) && bettingOn === 'black')){
  //       value *= -1;
  //     }
  // else if(randomNumber % 2 === 0 && bettingOn === 'even' ||
  //         randomNumber % 2 !== 0 && bettingOn === 'odd' ) {
  //         value *= -1;
  //       }
  // else if(randomNumber == bettingOn) {
  //     value *= -1;
  //   }
  // else if((bettingOn === 'row1' && row1.includes(randomNumber)) || 
  //         (bettingOn === 'row2' && row2.includes(randomNumber)) || 
  //         (bettingOn === 'row3' && row3.includes(randomNumber)))
  //       value *= -1;
  // else if(bettingOn === 'lows' && (randomNumber >= 1 && randomNumber <= 18))
  //   value *= -1;
  // else if(bettingOn === 'highs' && (randomNumber >= 19 && randomNumber <= 36))
  //   value *= -1;
  // else if (bettingOn === '1-12' && randomNumber >= 1 && randomNumber <= 12)
  //   value *= -1;
  // else if (bettingOn === '13-24' && randomNumber >= 13 && randomNumber <= 24)
  //   value *= -1;
  // else if (bettingOn === '25-36' && randomNumber >= 25 && randomNumber <= 36)
  //   value *= -1;

      fetch('/game', {
        method: 'post',
        headers: {'Content-Type' : 'application/json'},
        body:JSON.stringify({
          bettingAmount: parseInt(bettingValue.value),
          betOn: bettingOn,
          landed: randomNumber,
          houseWins: houseWins
        })
      })
      .then(function() {window.location.reload()});
}