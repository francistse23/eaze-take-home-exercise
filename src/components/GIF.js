import React, { Component } from 'react';
import styled from 'styled-components';
import Modal from 'styled-react-modal';
import { EazeBlue, EazeGold, gutter, smallScreen, mediumScreen } from '../lib/constants';

const Button = styled.button`
    padding: ${gutter}px;
    margin-left: ${gutter}px;
    font-weight: 650;
    font-size: 1rem;
    border-radius: 10px;
    border: 2px solid ${EazeBlue};
    background: ${EazeGold};
    color: ${EazeBlue};
    &:hover{
        border: 2px solid ${EazeGold};
        background-color: ${EazeBlue};
        color: ${EazeGold};
    }
`

const Div = styled.div`
    padding: ${gutter/2}px;
    border: ${props => props.rating !== 'g' && props.rating !== undefined ? '2px solid red' : '' };
    &:hover{
        transform: scale(1.2);
    }
    @media(max-width: ${mediumScreen}px){
        width: 50%;
    }
    @media(max-width: ${smallScreen}px){
        width: 100%;
    }
`;

export const StyledModal = Modal.styled`
    width: 75rem;
    height: 75rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    border-radius: 10px;
    background-color: ${EazeBlue};
    color: ${EazeGold};
    border: 2px solid ${EazeGold};
`

class GIF extends Component {
    constructor(props){
        super(props);
        this.state = {
            isOpen: false,
            collection: [],
        }
    }
    // renders the collection and store it in state as an array of IDs
    // used to check if user can add/remove the GIF
    collection = () => {
        let collect = this.state.collection;
        for ( let i = 0, len = localStorage.length; i < len; i++ ){
            let key = String(localStorage.key(i))
            collect.push(key);
        }
        this.setState(() => ({ collection: collect }));
    }
    // adds ID to this.state.collection
    addCollectionId = id => {
        let collection = this.state.collection;
        collection.push(id);
        this.setState({ collection }, () => {
            this.props.addToCollection();
        });
    }
    // removes ID to this.state.collection
    removeCollectionId = id => {
        let collection = this.state.collection;
        collection.splice(collection.indexOf(id), 1);
        this.setState({ collection }, () => { 
            this.props.removeFromCollection(); 
        });
    }
    // Modal toggle
    toggleModal = () => {
        this.setState({ isOpen: !this.state.isOpen })
    };
    componentDidMount(){
        this.collection();
    }
    render() {
        return (
            <Div key={this.props.id} rating={this.props.rating}>
                <img
                    src={this.props.url}
                    alt={this.props.alt}
                    title={this.props.title}
                    onClick={this.props.toggleModal || this.toggleModal}
                />
                {/* Modal */}
                <StyledModal
                    isOpen={this.state.isOpen || this.props.isOpen}
                    onBackgroundClick={this.props.toggleModal || this.toggleModal}
                    onEscapeKeydown={this.props.toggleModal || this.toggleModal}
                >
                    {/* Modal Header */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: `${gutter}px` }}>
                        <h3>{this.props.title !== '' ? this.props.title : 'No Title'}</h3>
                        <Button 
                            onClick={this.props.toggleModal || this.toggleModal}
                        >
                            X
                        </Button>
                    </div>
                    <img
                        src={this.props.HDurl}
                        alt={this.props.alt}
                        title={this.props.title}
                    />
                    <h5>Uploaded by: {this.props.username !== '' ? this.props.username : 'Unknown User'}</h5>
                    <div>
                        {this.state.collection.includes(this.props.id) ? 
                            <Button
                                onClick={() => this.removeCollectionId(this.props.id) }
                            >
                                Remove from Collection
                            </Button> :
                            <Button 
                                onClick={() => this.addCollectionId(this.props.id) }
                            >
                                Add to Collection
                            </Button>
                        }
                        <Button onClick={this.props.randomize}>Surprise Me :)</Button>
                    </div>
                </StyledModal>
            </Div>
        )
    }
}

export default GIF;