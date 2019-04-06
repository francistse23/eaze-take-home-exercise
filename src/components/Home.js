import React, { Component } from 'react';
import styled from 'styled-components';
import { maxAppWidth, smallScreen, mediumScreen, largeScreen, gutter, EazeBlue, EazeGold } from '../lib/constants';
import { DraggableGIF } from './DraggableGIF';
import GIF, { StyledModal } from './GIF';
import GIFCollection from './GIFCollection';
import { SearchBar } from './SearchBar';

const Button = styled.button`
  cursor: pointer;
  font-family: Roboto Slab;
  font-weight: 650;
  font-size: 1rem;
  border-radius: 10px;
  border: 2px solid ${EazeGold};
  background-color: ${EazeBlue};
  color: ${EazeGold};
  margin: 0;
  &:hover{
      border: 2px solid ${EazeBlue};
      background-color: ${EazeGold};
      color: ${EazeBlue};
  }
`;

const Footer = styled.footer`
  position: fixed;
  bottom: 0;
  left: 0;
  display: flex; 
  justify-content: space-evenly;
  min-width: 100%;
  border-top: 2px solid ${EazeBlue};
  color: ${EazeBlue};
  background: ${EazeGold};
  padding: ${gutter/2}px;
`;

const GIFs = styled.div`
  display: flex;
  flex-wrap: wrap;
  margin-left: 15%;
  max-width: ${maxAppWidth*1.5}px;

  @media(max-width: ${largeScreen}px){
    margin-left: 2.5%;
    margin-right: 20%;
  }
  @media(max-width: ${mediumScreen}px ){
    margin-left: 1%;
    width: 60%;
  }
  @media(max-width: ${smallScreen}px ){
    margin: 0 auto;
  }
`;

const Page = styled.div`
  display: flex;
  flex-direction: column;
  justfiy-content: space-between;
  margin: 0 auto;
  padding: ${gutter*10}px ${gutter}px;
  background-color: #333;
  color: ${EazeBlue};

  @media (max-width: ${largeScreen}px) {
    paddin-top: ${gutter*2}px;
    margin: 0;
  }
  @media (max-width: ${mediumScreen}px) {
    margin: ${gutter*10}px auto 0 auto;
    padding: ${gutter}px;
  }
  @media (max-width: ${smallScreen}px) {
    margin: ${gutter*15}px auto 0 auto;
    padding: ${gutter*2}px;
  }
`;

const PageContent = styled.div`
  display: flex;
`;

const PageHeader = styled.div`
  max-width: ${maxAppWidth/2};
  display: flex;
  justify-content: space-evenly;
  margin: ${gutter}px;
  padding: ${gutter}px;

  @media(max-width: ${smallScreen}px){
    flex-direction: column;
  }
`;

const Search = styled.div`
  display: flex;
  justify-content: space-between;

  @media(max-width: ${smallScreen}px){
    flex-direction: column;
    align-items: space-around;
  }
`;

class Home extends Component {
    render(){
        return (
            <div>

              {/* Content */}
              <Page>
          
                  {/* Page's header */} 
                  <Search>
                    <SearchBar 
                      query={this.props.query}
                      handleChange={this.props.handleChange}
                      search={this.props.debouncedSearch}
                      nsfw={this.props.nsfw}
                      type={this.props.type}
                      toggle={this.props.toggle}
                      paused={this.props.paused}
                    />

                    {/* Randomizer */}
                    <Button onClick={this.props.randomize}>Surprise Me :)</Button>

                    {/* Clear Collection */}
                    {this.props.collection.length > 0 ? 
                      <Button 
                        name='confirmModal'
                        style={{ background: 'red', color: 'white' }}
                        onClick={this.props.toggle}
                      >
                          Clear Collection!
                      </Button> : ''
                    }
                  </Search>

                  <PageHeader>
                      <h2 style={{ fontFamily: 'Megrim' }}>
                          {`${this.props.query === "" ? "Trending" : `"${this.props.query}"` } 
                          ${this.props.total.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")} 
                          ${this.props.type === 'gifs' ? 'GIFs' : 'Stickers'}
                          ${!this.props.nsfw && this.props.omitted > 0 ? `, ${this.props.omitted.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")} ${this.props.type === 'gifs' ? 'GIFs' : 'Stickers' } omitted on this page` : '' }`}
                      </h2>
              
                      {/* Sort Date */}
                      <Button onClick={this.props.toggle} name='sort'>
                          {`Sort by Upload Date: ${this.props.sort}`}
                      </Button>

                      {this.props.confirmModal ?
                          <StyledModal isOpen={this.props.confirmModal}>
                              <h1 style={{ padding: `${gutter*2}px` }}>
                              Are you sure you want to delete your collection? There's no turning back!
                              </h1>
                              <div style={{ display: 'flex', flexDirection: 'row' }}>
                              <Button 
                                  onClick={this.props.clearCollection}
                                  style={{ background: 'red', color: 'white', padding: `${gutter}px` }}
                              >
                                  Yup!
                              </Button>
                              <Button name='confirmModal' onClick={this.props.toggle}>I Changed My Mind!</Button>
                              </div>
                          </StyledModal> : ''
                      }
                  </PageHeader>
                      
                  <PageContent>
                      <GIFs>
                          {/*  render random GIF if there's one */}
                          {this.props.random.length === 0 ? '' :
                              <GIF 
                                  key={this.props.random[0]['id']}
                                  id={this.props.random[0]['id']}
                                  url={this.props.random[0]['images'][`${this.props.paused ? 'fixed_width_still' : 'fixed_width_downsampled'}`]['url']}
                                  HDurl={this.props.random[0]['images']['original']['url']}
                                  title={this.props.random[0]['title']}
                                  alt={this.props.random[0]['title']}
                                  username={this.props.random[0]['user'] ? this.props.random[0]['user']['display_name'] : this.props.random[0]['username']}
                                  rating={this.props.random[0]['rating']}
                                  uploadDate={this.props.random[0]['import_datetime']}
                                  isOpen={true}
                                  collectionId={this.props.collectionId}
                                  addToCollection={() => this.props.addToCollection(this.props.random[0]['id'], this.props.random[0])}
                                  removeFromCollection={() => this.props.removeFromCollection(this.props.random[0]['id'])}
                                  randomize={this.props.randomize}
                                  toggleModal={this.props.toggleModal}
                              />
                          }
                  
                          {/* renders the trending/searched GIFs/Stickers */}
                          {this.props.results.map( result => (
                            <DraggableGIF 
                                key={result.id}
                                {...result}
                                paused={this.props.paused}
                                collectionId={this.props.collectionId}
                                addToCollection={() => this.props.addToCollection(result.id, {...result})}
                                removeFromCollection={() => this.props.removeFromCollection(result.id)}
                                randomize={this.props.randomize}
                            />
                          ))}
                              
                          {/* Area to drop GIFs */}
                          <GIFCollection 
                              paused={this.props.paused}
                              collection={this.props.collection}
                              collectionId={this.props.collectionId}
                              randomize={this.props.randomize}
                              addToCollection={this.props.addToCollection}
                              removeFromCollection={this.props.removeFromCollection}
                          />
                      </GIFs>
                  </PageContent>
              </Page>
              
              <Footer>
                  <Button name='previous' onClick={this.props.offset}>{`<<`}</Button>
                  <h2>{this.props.page}</h2>
                  <Button name='next' onClick={this.props.offset}>{`>>`}</Button>
              </Footer>
        
            </div>
        )
    }

}

export default Home;