import React, { Component } from 'react';
import styled from 'styled-components';
import { DropTarget } from 'react-dnd';
import { EazeBlue, EazeGold, maxAppWidth, gutter, smallScreen, mediumScreen, largeScreen, xLargeScreen } from '../lib/constants';
import { DraggableGIF } from './DraggableGIF';
import { namespace } from '../lib/constants';

const Container = styled.div`
    display: flex;
    position: fixed;
    right: 20%;
    top: 25%;
    padding: ${gutter/2}px;
    max-width: ${maxAppWidth/4}px;
    max-height: ${maxAppWidth/4}px;
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
        right: 10%;
        top: 30%;
        max-width: ${maxAppWidth/5}px;
        max-height: ${maxAppWidth/5}px;
    }
    @media(max-width: ${largeScreen}px){
        right: 2.5%;
    }
    @media(max-width: ${mediumScreen}px){
        top: 30%;
        right: 1%;
        max-width: ${maxAppWidth/6}px;
        max-height: ${maxAppWidth/6}px;
    }
    @media(max-width: ${smallScreen}px){
        right: 0;
        top: 40%;
        max-width: ${maxAppWidth/8}px;
        max-height: ${maxAppWidth/6}px;
    }
`;

const Collection = styled.div`
    display: flex;
    flex-direction: column;
    min-width: ${maxAppWidth/8};
    color: ${EazeGold};
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
                                        username={gif.username}
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
            </Container>
        )
    }
}

export default TargetDropzone(GIFCollection);