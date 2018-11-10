import React, { Component } from 'react';
import "./App.css";

//CREATING A PURE REACT COMPONENT
class App extends Component {
 constructor(props) {
   super(props);
   this.state = {
     quotes: [],
     page: 1,
     maxPerPage: 5,
     search: "",
     searching: false
   }
   this.handleClick = this.handleClick.bind(this);
 }

//CLICK EVENT TO CHANGE CURRENT PAGE NUMBER IN STATE
handleClick(event) {
  this.setState({
    page: Number(event.target.id)
  });
}

//EVENT HANDLER FOR SEARCH FILTERING WHILE HAPPENING AND TURNING PAGINATION OFF
updateSearch(event) {
  this.setState({search: event.target.value, searching: true})
}

//EVENT HANDLER TO TOGGLE SEARCHING VALUE TO FALSE WHEN NOT SEARCHING SO PAGINATION CAN HAPPEN AGAIN
checkSearch () {
  if (this.state.search === "" || this.state.search === undefined) {
    this.setState({searching: false})
  }
}

 //LIFECYCLE EVENT FOR FETCHING QUOTES DATA AND SETTING STATE
 componentDidMount() {
   fetch("https://gist.githubusercontent.com/anonymous/8f61a8733ed7fa41c4ea/raw/1e90fd2741bb6310582e3822f59927eb535f6c73/quotes.json")
    .then(response => response.json() )
    .then(response => this.setState( {quotes: response} ) )
    .catch(error => console.log(error) );
 }

 //RENDERING QUOTES TO THE DOM VIA THE MAP METHOD
  render() {

    //ESTABLISHING VARIABLES NECESSARY FOR PAGINATION
    const lastQuote = this.state.page * this.state.maxPerPage;
    const firstQuote = lastQuote - this.state.maxPerPage;
    const currentQuote = this.state.quotes.slice(firstQuote, lastQuote);

   
    //LOGIC FOR FILTERED SEARCH
    const filteredQuotes = this.state.quotes.filter( (quotes) => {
        return quotes.quote.toLowerCase().includes(this.state.search.toLowerCase()) ||
        quotes.source.toLowerCase().includes(this.state.search.toLowerCase()) ||
        quotes.context.toLowerCase().includes(this.state.search.toLowerCase()) ||
        quotes.theme.toLowerCase().includes(this.state.search.toLowerCase())
      } 
    );

    //ESTABLISHING NUMBER OF PAGES IN AN ARRAY
    const pageNumbers = [];
    for (let i = 1; i <= Math.ceil(this.state.quotes.length / this.state.maxPerPage); i++) {
      pageNumbers.push(i);
    }

    //LOGIC TO TURN OFF PAGINATION WHEN FILTERING
    const determineSearch = this.state.searching === false ? currentQuote : filteredQuotes;

    return (
      <div id="body">
        
        <h1 id="title">Favorite Quotes</h1>

        <input id="search" placeholder="Type to search! You can also type to filter by 'movies' or 'games'" type="text" value={this.state.search} onChange={this.updateSearch.bind(this)} onFocus={this.checkSearch.bind(this)} onBlur={this.checkSearch.bind(this)} />

        
        {/* MAPPING OVER FILTERED AND PAGINATED QUOTES AND APPENDING TO DOM */}
        <ul id="list">
          {
            
            determineSearch.map( (item, index) =>  (
              <li key={item.quote} id="items">
              
              "{item.quote}"<br/>
              ~{item.source} from <em>{item.context}</em><br/>
              <span id="category">Category: {item.theme}</span><br/>
              
              </li>))
          }
        </ul>

        {/* MAPPING OVER ARRAY OF PAGE NUMBERS AND APPENDING TO DOM */}
        <ul id="pagination">
          {
            pageNumbers.map(number => {
              return (
                <li className="pagenumbers" style={this.state.searching === false ? {} : { display: 'none' }} id={number} key={number} onClick={this.handleClick}>
                  {number}
                </li>
              )
            })
          }
        </ul>

      </div>
    );
  }
}

export default App;
