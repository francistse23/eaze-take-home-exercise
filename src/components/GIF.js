import React, { Component } from 'react';
import styled from 'styled-components';
import Modal from 'styled-react-modal';
import { EazeBlue, EazeGold, gutter, smallScreen } from '../lib/constants';

const Button = styled.button`
    padding: ${gutter}px;
    margin-left: ${gutter}px;
    font-weight: 650;
    font-size: 1rem;
    border-radius: 10px;
    border: 2px solid ${EazeBlue};
    background: ${EazeGold};
    color: ${EazeBlue};
    cursor: pointer;
    &:hover{
        border: 2px solid ${EazeGold};
        background-color: ${EazeBlue};
        color: ${EazeGold};
    }

    @media(max-width: ${smallScreen}px){
        font-size: 0.75rem;
    }
`

const Div = styled.div`
    margin: ${gutter/2}px;
    padding: ${gutter/2}px;
    border: ${props => props.rating !== 'g' && props.rating !== undefined ? '2px solid red' : '' };
    border-radius: 5px;
    background: white;
    max-width: 300px;
    min-height: 90%;
    text-align: center;
    
    &:hover{
        cursor: pointer;
        transform: scale(1.1);
        box-shadow: 1px -1px 20px ${EazeGold};
    }

    @media(max-width: ${smallScreen}px){
        width: 100%;
        margin: 1% auto;
    }
`;

const Img = styled.img`
    
    @media(max-width: ${smallScreen}px){
        max-height: 80%;
        max-width: 80%;
    }
`;

const ModalHeader = styled.div`
    display: flex;
    justify-content: space-between; 
    padding-bottom: ${gutter}px; 
    @media(max-width: ${smallScreen}px){
        max-width: 300px;
    }
`;

const ModalBody = styled.div`
    text-align: center;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
`

export const StyledModal = Modal.styled`
    width: 95vw;
    height: 95vh;
    font-size: 1.2rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    border-radius: 10px;
    background-color: ${EazeBlue};
    color: ${EazeGold};
    border: 2px solid ${EazeGold};

    @media(max-width: ${smallScreen}px){
        font-size: 0.75rem;
        width: 100vw;
        height: 100vh;
    }
`

class GIF extends Component {
    constructor(props){
        super(props);
        this.state = {
            isOpen: false,
        }
    }
    // Modal toggle
    toggleModal = () => {
        this.setState({ isOpen: !this.state.isOpen })
    };
    render() {
        return (
            <Div 
                key={this.props.id}
                rating={this.props.rating}
                onClick={this.props.toggleModal || this.toggleModal}
            >
                <div>
                    <img
                        src={this.props.url}
                        alt={this.props.alt}
                        title={this.props.title}
                    />
                    <h4 style={{ padding: `${gutter/2}px` }}>{this.props.title !== '' ? this.props.title : 'No Title'}</h4>
                </div>
                {/* Modal */}
                <StyledModal
                    isOpen={this.state.isOpen || this.props.isOpen}
                    onBackgroundClick={this.props.toggleModal || this.toggleModal}
                    onEscapeKeydown={this.props.toggleModal || this.toggleModal}
                >
                    {/* Modal Header */}
                    <ModalHeader>
                        <h3>{this.props.title !== '' ? this.props.title : 'No Title'}</h3>
                        <Button 
                            onClick={this.props.toggleModal || this.toggleModal}
                        >
                            X
                        </Button>
                    </ModalHeader>
                    {/* Modal Body */}
                    <div style={{ textAlign: 'center' }}>
                        <Img
                            src={this.props.HDurl}
                            alt={this.props.alt}
                            title={this.props.title}
                        />
                        <ModalBody>
                            <h4>    
                                Rating: {this.props.rating !== '' && this.props.rating !== undefined ? this.props.rating.toUpperCase() : 'Not Rated'}
                            </h4>
                            <h4>
                                Uploaded by: {this.props.username !== '' ? this.props.username : 'Unknown User'}
                            </h4>
                            <h4>
                                Uploaded on: {this.props.uploadDate !== '' && this.props.uploadDate !== undefined ? this.props.uploadDate.slice(0,10) : 'Unknown'}
                            </h4>
                        </ModalBody>
                    </div>

                    {/* Modal Footer */}
                 
                    <div>
                        {this.props.collectionId.includes(this.props.id) ? 
                            <Button
                                onClick={() => this.props.removeFromCollection(this.props.id) }
                            >
                                Remove from Collection
                            </Button> :
                            <Button 
                                onClick={() => this.props.addToCollection(this.props.id) }
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