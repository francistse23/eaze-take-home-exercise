import React, { Component } from 'react';
// import logo from './logo.svg';
// import './App.css';
import axios from 'axios';
import styled from 'styled-components';
import { maxAppWidth } from './lib/constants';

const AppPageContainer = styled.section`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  min-height: 100vh;
  max-width: ${maxAppWidth}px;
`

const key = process.env.REACT_APP_API_KEY || 'dc6zaTOxFJmzC';



class App extends Component {
  constructor(props){
    super(props);
    this.state = {
      offset: 0,
      results: [],
      total: 0,
      type: 'gifs',
    }
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
  componentDidMount(){
    // by default, the page will load trending content on start
    this.initialize();

  };
  render() {
    return (
      <AppPageContainer>
        <code>Hello</code>
      </AppPageContainer>
    );
  }
}

export default App;
