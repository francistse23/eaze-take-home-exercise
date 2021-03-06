import React, { Component } from 'react';
import styled from 'styled-components';
import { withRouter } from 'react-router-dom';
import { DropTarget } from 'react-dnd';
import { EazeBlue, EazeGold, maxAppWidth, gutter, smallScreen, mediumScreen, largeScreen, xLargeScreen } from '../lib/constants';
import { DraggableGIF } from './DraggableGIF';
import GIF from './GIF';
import { namespace } from '../lib/constants';

const Container = styled.div`
    display: flex;
    position: fixed;
    right: 5%;
    top: 25%;
    padding: ${gutter/2}px;
    max-width: ${maxAppWidth/4}px;
    max-height: ${maxAppWidth/3}px;
    background: ${props => (props.isOver ? EazeGold : EazeBlue)};
    border: 2px solid ${props => props.isOver ? 'white' : EazeGold};
    border-radius: 10px;
    color: ${props => (props.isOver ? EazeBlue : 'white')};
    opacity: ${props => (props.isOver ? 1.00 : 0.75)};
    text-align: center;
    overflow-y: scroll;
    overflow-x: hidden;
    z-index: 0;
    &:hover{
        opacity: 1;
    }
    @media(max-width: ${xLargeScreen}px){
    
        top: 30%;
        max-width: ${maxAppWidth/5}px;
        max-height: 50%;
    }
    @media(max-width: ${largeScreen}px){
        right: 2.5%;
        max-height: 40%;
    }
    @media(max-width: ${mediumScreen}px){
        right: 1%;
        top: 50%;
        max-width: ${maxAppWidth/6}px;
        max-height: 30%;
    }
    @media(max-width: ${smallScreen}px){
        display: none;
    }
`;

const Collection = styled.div`
    display: flex;
    flex-direction: column;
    min-width: ${maxAppWidth/8};
    color: ${EazeGold};
    overflow-x: hidden;
`;

const ViewCollection = styled.div`
    border: 5px solid ${EazeGold};
    display: flex;
    flex-direction: column;
    align-items: center;
    align-content: center;
    text-align: center;
    color: ${EazeBlue};
    width: 100%;
    max-width: ${maxAppWidth};
    margin: 10rem auto;
    padding: ${gutter}px;

    @media(max-width: ${mediumScreen}){
        margin: 15rem auto;
    }
    @media(max-width: ${smallScreen}){
        padding: 0;
    }
 
`;

const View = styled.div`
    display: flex;
    flex-wrap: wrap;
`;

const TargetDropzone = DropTarget (
    'result',
    {
        drop: (props, monitor) => {
            const item = monitor.getItem();
            if (props.collection.some( gif => gif.id === item.id )){
                alert('You have already added this gif. Try adding another one!')
                return;
            } else {
                // stores item in localStorage, key = namespace + GIF's id, value = GIF object from API
                localStorage.setItem(`${namespace}${item.id}`, JSON.stringify(item));
                props.addToCollection(item.id, item);
            }
        }
    },
    (connect, monitor) => ({
        connectDropTarget: connect.dropTarget(),
        canDrop: monitor.canDrop(),
        isOver: monitor.isOver()
    })
)

class GIFCollection extends Component {
    constructor(props){
        super(props);
        this.state = {
            collectionId: [],
        }
    }
    // renders the collection and store it in state as an array of IDs
    // used to check if user can add/remove the GIF
    collection = () => {
        let { collectionId } = this.state;
        for ( let i = 0, len = localStorage.length; i < len; i++ ){
            let key = String(localStorage.key(i))
            if ( !collectionId.includes(namespace) || collectionId.includes(key.replace(`${namespace}`, '')) ) {
                break;
            } else {
                collectionId.push(key.replace(`${namespace}`, ''));
            }
        }
        this.setState(() => ({ collectionId }));
    }
    // adds ID to this.state.collectionId
    addCollectionId = id => {
        let { collectionId } = this.state;
        collectionId.push(id);
        this.setState({ collectionId }, () => {
            this.props.addToCollection();
        });
    }
    // removes ID to this.state.collectionId
    removeCollectionId = id => {
        let { collectionId } = this.state;
        collectionId.splice(collectionId.indexOf(id), 1);
        this.setState({ collectionId }, () => { 
            this.props.removeFromCollection(); 
        });
    }
    componentDidMount(){
        this.collection();
    }
    render() {
        const { collection, canDrop, isOver, connectDropTarget } = this.props;  
        return (
            this.props.match.path === '/' ? 
            <Container canDrop={canDrop} isOver={isOver} rating={this.props.rating}>
                {connectDropTarget (
                    <div>
                        <h3 style={{ fontFamily: 'Megrim' }}>Drag & Drop GIFs/Stickers here to store them in your collection :)</h3>
                        <Collection>
                            {collection.length > 0 ? 
                                collection.map( gif => (                          
                                    <DraggableGIF
                                        {...gif}
                                        key={gif.id}
                                        id={gif.id}
                                        url={this.props.paused ? gif.images.fixed_width_still.url : gif.images.fixed_width_downsampled.url}
                                        HDurl={gif.images.original.url}
                                        alt={gif.title}
                                        title={gif.title}
                                        username={gif.user ? gif.user.display_name : gif.username}
                                        uploadDate={gif.import_datetime}
                                        rating={gif.rating}
                                        collectionId={this.props.collectionId}
                                        randomize={this.props.randomize}
                                        addToCollection={() => this.props.addToCollection(gif.id, gif)}
                                        removeFromCollection={() => this.props.removeFromCollection(gif.id)}
                                    />                          
                                )) : 'Oh no, your collection is empty :/'
                            }
                        </Collection>
                    </div>
                )}
            </Container> : 
            <ViewCollection rating={this.props.rating}>
                {connectDropTarget (
                    <div>
                        <h3 style={{ fontFamily: 'Megrim', color: 'white' }}>Here's your awesome collection of GIFs/Stickers :)</h3>
                        <h3 style={{ fontFamily: 'Megrim', color: 'white' }}>You can drag GIFs/Stickers out of your collection if you dont want them anymore</h3>
                        <View>
                            {collection.length > 0 ? 
                                collection.map( gif => (  
                                    <DraggableGIF
                                        {...gif}
                                        key={gif.id}
                                        id={gif.id}
                                        url={this.props.paused ? gif.images.fixed_width_still.url : gif.images.fixed_width_downsampled.url}
                                        HDurl={gif.images.original.url}
                                        alt={gif.title}
                                        title={gif.title}
                                        username={gif.user ? gif.user.display_name : gif.username}
                                        uploadDate={gif.import_datetime}
                                        rating={gif.rating}
                                        collectionId={this.props.collectionId}
                                        randomize={this.props.randomize}
                                        addToCollection={() => this.props.addToCollection(gif.id, gif)}
                                        removeFromCollection={() => this.props.removeFromCollection(gif.id)}
                                    />                                                      
                                )) : 'Oh no, your collection is empty :/'
                            }

                            {/*  render random GIF if there's one */}
                            {this.props.random.length === 0 ? '' :
                                <GIF 
                                    key={this.props.random[0]['id']}
                                    id={this.props.random[0]['id']}
                                    url={this.props.random[0]['images'][`${this.props.paused ? 'fixed_width_still' : 'fixed_width_downsampled'}`]['url']}
                                    HDurl={this.props.random[0]['images']['original']['url']}
                                    title={this.props.random[0]['title']}
                                    alt={this.props.random[0]['title']}
                                    username={this.props.random[0]['username']}
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
                        </View>
                    </div>
                )}
            </ViewCollection> 
        )
    }
}

export default TargetDropzone(withRouter(GIFCollection));