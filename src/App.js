import React, { Component } from 'react';
import { Route, Link, withRouter } from 'react-router-dom';
import axios from 'axios';
import styled from 'styled-components';
import { ModalProvider } from 'styled-react-modal';
import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import debounce from 'lodash/debounce';

import { maxAppWidth, smallScreen, gutter, EazeBlue, EazeGold, namespace } from './lib/constants';
import { SearchBar } from './components/SearchBar';
import Home from './components/Home';
import GIFCollection from './components/GIFCollection';

const AppPageContainer = styled.section`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  min-height: 100vh;
  max-width: ${maxAppWidth}px;
`

// will add transition to hide/show on scroll
const AppHeader = styled.header`
  position: fixed;
  display: flex;
  justify-content: space-around;
  align-items: center;
  align-content: center;
  border-bottom: 2px solid ${EazeGold};
  background-color: ${EazeBlue};
  max-height: 40%;
  width: 100%;
  padding: ${gutter/2}px;

  @media(max-width: ${smallScreen}px){
    flex-direction: column; 
    transition: top 0.5s;
  }
`;

const Button = styled.button`
  cursor: pointer;
  padding: ${gutter/2}px ${gutter}px;
  font-family: Roboto Slab;
  font-weight: 650;
  font-size: 1rem;
  border-radius: 10px;
  border: 2px solid ${EazeGold};
  background-color: ${EazeBlue};
  color: ${EazeGold};
  margin: ${gutter}px;
  &:hover{
      border: 2px solid ${EazeBlue};
      background-color: ${EazeGold};
      color: ${EazeBlue};
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  margin: 2%;
  @media(max-width: ${smallScreen}){
    margin: 2% 0 10% 0;
  }
`

const Logo = styled.div`
  margin: 2%;
  @media(max-width: ${smallScreen}){
    margin: 0;
  }
`;

// sets key to env var if there's one. if not, set the key to GIPHY's public beta key
const key = process.env.REACT_APP_API_KEY || 'dc6zaTOxFJmzC';

// Controls the offset amount in GIPHY's API
const offset = 25;

var prevScrollpos = window.pageYOffset;
window.onscroll = function() {
  var currentScrollPos = window.pageYOffset;
  if (prevScrollpos > currentScrollPos) {
    document.getElementById("navbar").style.top = "0";
  } else {
    document.getElementById("navbar").style.top = "-350px";
  }
  prevScrollpos = currentScrollPos;
}

class App extends Component {
  constructor(props){
    super(props);
    this.state = {
      collection: [],
      collectionId: [],
      confirmModal: false,
      isOpen: false,
      nsfw: false,
      offset: 0,
      page: 1,
      paused: false,
      query: '',
      random: [],
      results: [],
      sort: 'Descending',
      total: 0,
      type: 'gifs',
    }
  }  
  // add the selected GIF to collection
  addToCollection = (id, gif) => {
    localStorage.setItem(`${namespace}${id}`, JSON.stringify(gif));
    let { collection, collectionId } = this.state;
    collection.push(gif);
    collectionId.push(id);
    this.setState({ collection, collectionId}, () => this.collection());
  }
  // clears collection
  clearCollection = () => {
    localStorage.clear();
    this.setState({ 
      collection: [],
      collectionId: [],
      confirmModal: false
    });
  }
  // renders collection saved in localStorage
  collection = () => {
    let collection = [], collectionId = [];
    for ( let i = 0, len = localStorage.length; i < len; i++ ){
      let key = String(localStorage.key(i));
      if ( !key.includes(namespace) ){
        break;
      } else {
        let value = JSON.parse(localStorage[key]);
        // it'll only add the GIF/sticker into the collection if it isn't in the collection
        if ( !collectionId.includes(value.id) ){
          collectionId.push(key.replace('Eaze_GIF_', ''))
          collection.push(value);
        }
      }
    }
    this.setState({ collection, collectionId });
  }
  // handles change in search input
  handleChange = e => {
    this.setState({ 
      [e.target.name]: e.target.value,
      offset: 0,
      page: 1
    }, () => {
      // debounce to limit API calls
      if (this.state.query.length > 1) {
        this.debouncedSearch();
      } else {
        // resets results to trending if search query is empty
        this.setState({ 
          results: [],
          offset: 0,
          page: 1
        }, () => this.initialize());
      }
    });
  };
  // retrieves all trending GIFs/Stickers from GIPHY
  initialize = () => {
    axios.get(`http://api.giphy.com/v1/${this.state.type}/trending?api_key=${key}&offset=${this.state.offset}`)
        .then( res => {
            this.setState({ 
                results: res.data.data,
                total: res.data.pagination.total_count
            })
        });
  }
  // "Turns the page"
  offset = e => {
    e.preventDefault();
    if ( e.target.name === 'next' ) {
        // increases offset by 25 to view the next 25 results
        // increments page by 1
        this.setState({ offset: this.state.offset + offset, page: this.state.page + 1 }, () => {
            if ( this.state.query.length > 1) {
                this.search();
            } else {
                this.initialize()
            }
        });
    } else if ( e.target.name === 'previous' && this.state.offset >= 25 ) {
        // decreases offset by 25 to view the previous 25 results
        // decrements page by 1
        this.setState({ offset: this.state.offset - offset, page: this.state.page - 1 }, () => {
            if ( this.state.query.length > 1) {
                this.search();
            } else {
                this.initialize()
            }
        });
    }
  }
  // Return random GIF/Sticker, this.state.query acts as tags
  randomize = () => {
    let { type, query } = this.state;
    query = query.split(' ').join('+');
    let random = [];
    axios.get(`http://api.giphy.com/v1/${type}/random?api_key=dc6zaTOxFJmzC&tag=${query}&rating=${this.state.nsfw ? 'r' : 'g'}`)
      .then( res => {
        random.push(res.data.data);
        this.setState({ random, isOpen: !this.state.isOpen });
      });
  };
  // remove the selected GIF from collection
  removeFromCollection = id => {
    let { collection, collectionId } = this.state;
    let index = collection.filter( gif => gif.id === id);
    collection.splice(index, 1);
    collectionId.splice(collectionId.indexOf(id), 1);
    localStorage.removeItem(`${namespace}${id}`);
    this.setState({ collectionId }, () => this.collection())
  }
  // search function to parse query and send API call the the search endpoint
  search = () => {
    let q = this.state.query.split(' ').join('+');
    if ( q.length > 1 ){
      axios.get(`http://api.giphy.com/v1/${this.state.type}/search?api_key=${key}&q=${q}&offset=${this.state.offset}`)
          .then(res => { 
              this.setState({ 
                  results: res.data.data,
                  total: res.data.pagination.total_count 
              })
          });
    } else {
      this.initialize();
    }
  }
  // debounce search function
  debouncedSearch = debounce(this.search, 500);
  sortResults = results => {
    if (this.state.sort === 'Descending'){
      results.sort((a,b) => {
        return new Date(b.import_datetime) - new Date(a.import_datetime);
      })
    } else {
      results.sort((a,b) => {
        return new Date(a.import_datetime) - new Date(b.import_datetime);
      })
    }
  }
  // enable/disable NSFW content && toggle to show either GIFs or stickers
  toggle = e => {
    if (e.target.name === 'nsfw'){
      this.setState(() => ({ nsfw: !this.state.nsfw }));
    } else if ( e.target.name === 'type' ){
      if (this.state.type === 'gifs'){
        this.setState({ type: 'stickers' }, () => this.search());
      } else {
        this.setState({ type: 'gifs' }, () => this.search());
      }
    } else if ( e.target.name === 'paused' ){
      this.setState({ paused: !this.state.paused });
    } else if ( e.target.name === 'confirmModal' ){
      this.setState({ confirmModal: !this.state.confirmModal });
    } else if ( e.target.name === 'sort' ){
      if ( this.state.sort === 'Descending' ){
        this.setState({ sort: 'Ascending' });
      } else {
        this.setState({ sort: 'Descending' });
      }
    }
  }
  // Modal toggle
  toggleModal = () => {
    this.setState({ 
      isOpen: false,
      random: []
    })
  }
  componentDidMount(){
    // by default, the page will load trending content on start
    this.initialize();
    // this will show collection
    this.collection();
  };
  render() {
    // will only return Rated G GIFs if NSFW is false
    let results = this.state.nsfw === true ? 
                  this.state.results : 
                  this.state.results.filter( gif => gif.rating === 'g' ); 
    // sorts results, sorted by descending upload date by default
    this.sortResults(results);
    // shows how many GIFs were not shown because they are not rated G
    let omitted = this.state.results.filter( gif => gif.rating !== 'g' ).length;
    return (
      <AppPageContainer>
        <ModalProvider>

          {/* Navbar */}
          <AppHeader id='navbar'>
            <Logo>
              <Link to="/" 
                    style={{ 
                      textDecoration: 'none',
                      fontFamily: 'Vibur',
                      fontSize: '5rem',
                      color: 'white',
                    }}
              >
                  eaze
              </Link>
            </Logo>
            <SearchBar 
              query={this.state.query}
              handleChange={this.handleChange}
              search={this.debouncedSearch}
              nsfw={this.state.nsfw}
              type={this.state.type}
              toggle={this.toggle}
              paused={this.state.paused}
            />
            <ButtonContainer>
              <Link to='/collection'><Button>View Collection</Button></Link>
              <Button name='upload' onClick={this.toggle}>Upload a GIF!</Button>
            </ButtonContainer>
          </AppHeader>

          <Route exact path='/' render={(props) => <Home {...props}
              collection={this.state.collection}
              collectionId={this.state.collectionId}
              confirmModal={this.state.confirmModal}
              nsfw={this.state.nsfw}
              offset={this.offset}
              omitted={omitted}
              paused={this.state.paused}
              page={this.state.page}
              query={this.state.query}
              random={this.state.random}
              results={results}
              sort={this.state.sort}
              total={this.state.total}
              type={this.state.type}
              // functions
              addToCollection={this.addToCollection}
              clearCollection={this.clearCollection}
              randomize={this.randomize}
              removeFromCollection={this.removeFromCollection}
              toggle={this.toggle}
              toggleModal={this.toggleModal}
            /> } 
          />

          <Route exact path='/collection' render={(props) => <GIFCollection {...props}
              paused={this.state.paused}
              random={this.state.random}
              collection={this.state.collection}
              collectionId={this.state.collectionId}
              addToCollection={this.addToCollection}
              removeFromCollection={this.removeFromCollection}
              randomize={this.randomize}
              toggleModal={this.toggleModal}
            /> } 
          />

        </ModalProvider>
      </AppPageContainer>
    );
  }
}

export default DragDropContext(HTML5Backend)(withRouter(App));
