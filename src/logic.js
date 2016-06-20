//Get a shuffled deck from deckofcardsapi and call renderSolitare
function initalize(){
  axios.get('http://deckofcardsapi.com/api/deck/new/draw/?count=52')
   .then(function(response){
     renderSolitare(response.data.cards);
   })
  //  .catch(function(response){
  //    console.log('Error when drawing the stock from card API.');
  //    ReactDOM.render(
  //      <h1>Error contacting cards API</h1>,
  //      document.getElementById('example')
  //    );
  //  });
}

function dealStartingCards(stock,tableau){
  for(var startingTableau = 0; startingTableau < 7; startingTableau++){
    for(var dealIndex = startingTableau; dealIndex <7; dealIndex++ ){
      tableau[dealIndex].push(stock.pop());
    }
  }
}

var Board = React.createClass({
  getInitialState: function() {
    var deck = this.props.initialDeck;
    var tableauContents = [[],[],[],[],[],[],[]];
    dealStartingCards(deck,tableauContents);

    return {
      stock: deck,
      tableau: tableauContents,
      waste: []
    };
  },

  onStockClick: function(evt) {
    var newStock = this.state.stock.slice();
    var newWaste = this.state.waste.slice();

    if(newStock.length > 0){
      newWaste.push(newStock.pop());
    }
    else {
      while(newWaste.length > 0){
        newStock.push(newWaste.pop());
      }
    }


    this.setState({
      waste: newWaste,
      stock: newStock
    })
  },

  render: function() {
    var style = {
      background: 'url(/src/images/wov.png)',
      width: '100%',
      height: '100vh',
      padding: '.5em',
      paddingTop: '1em'
    };

    var topBarStyle = {
      width: '100%',
      display: 'flex'
    }

    return (
      <div style={style}>
        <div style={topBarStyle}>
          <Stock stock={this.state.stock} onStockClick={this.onStockClick}/>
          <Waste waste={this.state.waste}/>
        </div>
        <Tableau tableau={this.state.tableau}/>
      </div>
    );
  }
});

var Stock = React.createClass({
  render: function() {
    var style = {
      position: 'relative',
      width: '8em',
      margin: '0 .5em'
    };

    var topCard = "";

    if(this.props.stock.length > 0){
      topCard = <Card card={this.props.stock[this.props.stock.length-1]} flipped={false} position={'relative'} offsetMultiplier={0}/>
    }

    return (
      <div onClick={this.props.onStockClick} style={style}>
        {topCard}
      </div>
    );
  }
});

var Waste = React.createClass({
  render: function() {
    var style = {
      position: 'relative',
      width: '8em',
      margin: '0 .5em'
    };

    var topCard = "";

    if(this.props.waste.length > 0){
      topCard = <Card card={this.props.waste[this.props.waste.length-1]} flipped={true} position={'relative'} offsetMultiplier={0}/>
    }

    return (
      <div style={style}>
        {topCard}
      </div>
    );
  }
});

var Card = React.createClass({
  render: function() {
    var style = {
      position: this.props.position,
      width: '100%',
      top: 3*this.props.offsetMultiplier +'em'
    };

    var image = 'src/images/cardBack.png';
    if(this.props.flipped){
      image = this.props.card.image;
    }

    return (
      <img style={style} className="card" src={image}/>
    );
  }
});

var Tableau = React.createClass({
  render: function() {
    var style = {
      display: 'flex'
    };

    var tableauPiles = [];
    for(var ii = 0;ii < this.props.tableau.length;ii++){
      tableauPiles.push(
        <TableauPile contents={this.props.tableau[ii]} key={ii}/>
      );
    }

    return (
      <div style={style} className="tableau">{tableauPiles}</div>
    );
  }
});

var TableauPile = React.createClass({
  render: function() {
    var style = {
      position: 'relative',
      width: '8em',
      margin: '0 .5em'
    };

    var cards = [];
    for(var ii =0; ii < this.props.contents.length; ii++){
      cards.push(
        <Card card={this.props.contents[ii]} flipped={ii == this.props.contents.length-1} position={'absolute'} offsetMultiplier={ii} key={ii}/>
      );
    }
    return (
      <div style={style} className="tableau-pile">{cards}</div>
    );
  }
});

function renderSolitare(deck){
  ReactDOM.render(
    <Board initialDeck={deck}/>,
    document.getElementById('example')
  );
}

initalize()
