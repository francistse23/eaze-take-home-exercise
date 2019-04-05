import React, { Component } from 'react';
import styled from 'styled-components';
import { maxAppWidth, smallScreen, mediumScreen, largeScreen, gutter, EazeBlue, EazeGold } from '../lib/constants';
import { DraggableGIF } from './DraggableGIF';
import GIF, { StyledModal } from './GIF';
import GIFCollection from './GIFCollection';

const Button = styled.button`
  cursor: pointer;
  margin: ${gutter/2}px;
  padding: ${gutter/2}px ${gutter}px;
  font-family: Roboto Slab;
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

const Footer = styled.footer`
  position: fixed;
  bottom: 0;
  display: flex; 
  justify-content: space-around;
  width: 100%;
  padding: ${gutter}px;
  margin-top: ${gutter*2}px;
  border-top: 2px solid ${EazeGold};
  color: ${EazeBlue};
  background: ${EazeGold};
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
    margin: 0 auto;
  }
`;

const Page = styled.div`
  display: flex;
  flex-direction: column;
  justfiy-content: space-between;
  padding: ${gutter*15}px ${gutter}px;
  background-color: #333;
  color: ${EazeBlue};
  @media (max-width: ${largeScreen}px) {
    paddin-top: ${gutter*2}px;
    margin: 0;
  }
  @media (max-width: ${mediumScreen}px) {
    padding: ${gutter}px;
    margin: 0;
  }
  @media (max-width: ${smallScreen}px) {
    margin: ${gutter*18}px auto 0 auto;
    padding: ${gutter*2}px;
  }
`;

const PageContent = styled.div`
  display: flex;
`;

const PageHeader = styled.div`
  display: flex;
  justify-content: space-between;
  margin: ${gutter}px;
  padding: ${gutter}px;
  @media(max-width: ${smallScreen}px){
    flex-direction: column;
  }
`;

class Home extends Component {
    render(){
        return (
            <div>

                {/* Content */}
                <Page>
            
                    {/* Page's header */}
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
                    <Button name='previous' onClick={this.props.offset}>Previous</Button>
                    <h2>{this.props.page}</h2>
                    <Button name='next' onClick={this.props.offset}>Next</Button>
                </Footer>
        
            </div>
        )
    }

}

export default Home;