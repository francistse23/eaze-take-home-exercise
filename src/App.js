import React, { Component } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import { ModalProvider } from 'styled-react-modal';
import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';

import { maxAppWidth, smallScreen, mediumScreen, largeScreen, gutter, EazeBlue, EazeGold } from './lib/constants';
import { SearchBar } from './components/SearchBar';
import { DraggableGIF } from './components/DraggableGIF';
import GIF from './components/GIF';
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

const Button = styled.button`
  cursor: pointer;
  padding: ${gutter/2}px ${gutter}px;
  font-weight: 650;
  font-size: 1rem;
  border-radius: 10px;
  border: 2px solid ${EazeGold};
  background-color: ${EazeBlue};
  color: ${EazeGold};
  &:hover{
      border: 2px solid ${EazeBlue};
      background-color: ${EazeGold};
      color: ${EazeBlue};
  }
`;

const GIFs = styled.div`
  display: flex;
  flex-wrap: wrap;
  margin-left: 15%;
  max-width: ${maxAppWidth*1.5}px;
  @media(max-width: ${largeScreen}px){
    margin-left: 10%;
    margin-right: 20%;
  }
  @media(max-width: ${mediumScreen}px ){
    margin-left: 1%;
    width: 60%;
  }
  @media(max-width: ${smallScreen}px ){
    margin-left: 0;
  }
`;

const Page = styled.div`
  display: flex;
  flex-direction: column;
  padding: ${gutter*15}px ${gutter}px;
  background-color: #333;
  color: ${EazeBlue};
  @media (max-width: ${mediumScreen}px) {
    padding: ${gutter}px;
    margin: 0;
  }
  @media (max-width: ${smallScreen}px) {
    padding: ${gutter}px;
  }
`;

const PageContent = styled.div`
  display: flex;
`;

const PageHeader = styled.div`
  display: flex;
  justify-content: space-around;
  margin: ${gutter}px;
  padding: ${gutter*2}px;
  @media(max-width: ${smallScreen}px){
    flex-direction: column;
  }
`;

// sets key to env var if there's one. if not, set the key to GIPHY's public beta key
const key = process.env.REACT_APP_API_KEY || 'dc6zaTOxFJmzC';

// Controls the offset amount in GIPHY's API
const offset = 25;

// namespace for local storage key
const namespace = 'Eaze_GIF_';

class App extends Component {
  constructor(props){
    super(props);
    this.state = {
      collection: [],
      collectionId: [],
      isOpen: false,
      nsfw: false,
      offset: 0,
      paused: false,
      query: '',
      random: [],
      results: [],
      total: 0,
      type: 'gifs',
    }
  }  
  // add the selected GIF to collection
  // addToCollection = (id, gif) => {
  //   localStorage.setItem(id, JSON.stringify(gif));
  // }
  addToCollection = (id, gif) => {
    localStorage.setItem(`${namespace}${id}`, JSON.stringify(gif));
  }
  // renders collection saved in localStorage
  collection = () => {
    let { collection, collectionId } = this.state;
    for ( let i = 0, len = localStorage.length; i < len; i++ ){
      let key = String(localStorage.key(i));
      if ( !key.includes(namespace) ){
        break;
      }
      let value = JSON.parse(localStorage[key]);
      // it'll only add the GIF/sticker into the collection if it isn't in the collection
      if ( !collectionId.includes(value.id) ){
        collectionId.push(key.replace('Eaze_GIF_', ''))
        collection.push(value);
      }
    }
    this.setState({ collection, collectionId })
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
    localStorage.removeItem(`${namespace}${id}`);
    let { collectionId } = this.state;
    // splice the ID out of the collectionId state
    // once it's spliced, it won't be rendered out by this.collection()
    collectionId.splice(collectionId.indexOf(id), 1);
    this.setState({ collectionId })
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
  // componentDidUpdate(prevState){
  // 
  // };
  render() {
    // will only return Rated G GIFs if NSFW is false
    let results =  this.state.nsfw === true ? 
                this.state.results : 
                this.state.results.filter( gif => gif.rating === 'g' ); 
    // shows how many GIFs were not shown because they are not rated G
    let omitted = this.state.results.filter( gif => gif.rating !== 'g' ).length;
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

            {/* Page's header */}
            <PageHeader>
              <h2 style={{ fontFamily: 'Megrim' }}>
                {`${this.state.query === "" ? "Trending" : `"${this.state.query}"` } 
                ${this.state.total.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")} 
                ${this.state.type === 'gifs' ? 'GIFs' : 'Stickers'}
                ${!this.state.nsfw && omitted > 0 ? `, ${omitted.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")} ${this.state.type === 'gifs' ? 'GIFs' : 'Stickers' } omitted on this page` : '' }`}
              </h2>

              {/* Randomizer */}
              <Button onClick={this.randomize}>Surprise Me :)</Button>

              {/* Clear Collection */}
              {this.state.collection.length > 0 ? 
                <Button name='confirmModal' style={{ background: 'red', color: 'white' }} onClick={this.toggle}>
                  Clear Collection!
                </Button> : ''
              }

            </PageHeader>
            
            <PageContent>

              <GIFs>
                {/*  render random GIF if there's one */}
                {this.state.random.length === 0 ? '' :
                    <GIF 
                      key={this.state.random[0]['id']}
                      id={this.state.random[0]['id']}
                      url={this.state.random[0]['images'][`${this.state.paused ? 'fixed_width_still' : 'fixed_width_downsampled'}`]['url']}
                      HDurl={this.state.random[0]['images']['original']['url']}
                      title={this.state.random[0]['title']}
                      alt={this.state.random[0]['title']}
                      username={this.state.random[0]['username']}
                      isOpen={true}
                      collectionId={this.state.collectionId}
                      addToCollection={() => this.addToCollection(this.state.random[0]['id'], this.state.random[0])}
                      removeFromCollection={() => this.removeFromCollection(this.state.random[0]['id'])}
                      randomize={this.randomize}
                      toggleModal={this.toggleModal}
                    />
                }

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

                {/* Area to drop GIFs */}
                <GIFCollection 
                  paused={this.state.paused}
                  collection={this.state.collection}
                  addToCollection={this.addToCollection}
                  removeFromCollection={this.removeFromCollection}
                />
              </GIFs>
            </PageContent>

          </Page>

        </ModalProvider>
      </AppPageContainer>
    );
  }
}

export default DragDropContext(HTML5Backend)(App);
