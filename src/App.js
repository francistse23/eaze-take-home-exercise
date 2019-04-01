import React, { Component } from 'react';
// import logo from './logo.svg';
// import './App.css';
import axios from 'axios';
import styled from 'styled-components';
import { ModalProvider } from 'styled-react-modal';
import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';

import { maxAppWidth, smallScreen, mediumScreen, gutter, EazeBlue, EazeGold } from './lib/constants';
import { SearchBar } from './components/SearchBar';
import { DraggableGIF } from './components/DraggableGIF';

const AppPageContainer = styled.section`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  min-height: 100vh;
  max-width: ${maxAppWidth}px;
`

const AppHeader = styled.header`
  display: flex;
  justify-content: space-around;
  align-items: center;
  border-bottom: 2px solid ${EazeGold};
  background-color: ${EazeBlue};
  max-height: 20%;
  width: 100%;
  position: fixed;
  padding: ${gutter/2}px;

  @media(max-width: ${smallScreen}px){
    flex-direction: column;
  }
`;

const Page = styled.div`
  display: flex;
  flex-direction: column;
  padding: ${gutter}px;
  background-color: #ccc;
  color: ${EazeBlue};
  @media (max-width: ${mediumScreen}px) {
    padding: ${gutter}px;
    margin: 0;
  }
  @media (max-width: ${smallScreen}px) {
    padding: ${gutter}px;
  }
`;

// sets key to env var if there's one. if not, set the key to GIPHY's public beta key
const key = process.env.REACT_APP_API_KEY || 'dc6zaTOxFJmzC';

// Controls the offset amount in GIPHY's API
const offset = 25;

class App extends Component {
  constructor(props){
    super(props);
    this.state = {
      collection: [],
      collectionId: [],
      nsfw: false,
      offset: 0,
      paused: false,
      query: '',
      results: [],
      total: 0,
      type: 'gifs',
    }
  }  
  // add the selected GIF to collection
  addToCollection = (id, gif) => {
    localStorage.setItem(id, JSON.stringify(gif));
  }
  // retrieves all trending GIFs/Stickers from GIPHY
  initialize = () => {
    // GIPHY's public beta key, didn't use env since it's public. could set up as env var if needed
    // the public beta key does not return more than 25 result despite setting limit in query string
    // tested with my own API key
    axios.get(`http://api.giphy.com/v1/${this.state.type}/trending?api_key=${key}&offset=${this.state.offset}`)
        .then( res => {
            this.setState({ 
                results: res.data.data,
                total: res.data.pagination.total_count
            })
        });
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
    localStorage.removeItem(id);
    let collectId = this.state.collectionId;
    // splice the ID out of the collectionId state
    // once it's spliced, it won't be rendered out by this.collection()
    collectId.splice(collectId.indexOf(id), 1);
    this.setState({ collectionId: collectId })
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
      this.setState(() => ({ paused: !this.state.paused }));
    } else if ( e.target.name === 'confirmModal' ){
      this.setState({ confirmModal: !this.state.confirmModal });
    }
  }
  componentDidMount(){
    // by default, the page will load trending content on start
    this.initialize();

  };
  render() {
    // will only return Rated G GIFs if NSFW is false
    let results =  this.state.nsfw === true ? 
                this.state.results : 
                this.state.results.filter( gif => gif.rating === 'g' ); 
    // shows how many GIFs were not shown because they are not rated G
    // let omitted = this.state.results.filter( gif => gif.rating !== 'g' ).length;
    return (
      <AppPageContainer>
        <ModalProvider>
          {/* Navbar */}
          <AppHeader>
            <h1 style={{ fontSize: '5rem', color: 'white' }} >eaze</h1>
            <SearchBar 
              query={this.state.query}
              handleChange={this.handleChange}
              search={this.debouncedSearch}
              nsfw={this.state.nsfw}
              type={this.state.type}
              toggle={this.toggle}
              paused={this.state.paused}
            />
          </AppHeader>

          {/* Content */}
          <Page>
            
            {/* renders the trending/searched GIFs/Stickers */}
              {results.map( result => (
                <DraggableGIF 
                  key={result.id}
                  {...result}
                  paused={this.state.paused}
                  addToCollection={() => this.addToCollection(result.id, {...result})}
                  removeFromCollection={() => this.removeFromCollection(result.id)}
                  randomize={this.randomize}
                />
              ))}
          </Page>

        </ModalProvider>
      </AppPageContainer>
    );
  }
}

export default DragDropContext(HTML5Backend)(App);
