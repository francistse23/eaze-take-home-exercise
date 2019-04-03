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
    margin: ${gutter/2}px;
    padding: ${gutter/2}px;
    border: ${props => props.rating !== 'g' && props.rating !== undefined ? '2px solid red' : '' };
    background: white;
    max-height: 90%;
    text-align: center;
    &:hover{
        transform: scale(1.1);
        box-shadow: 1px -1px 20px ${EazeBlue};
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
        }
    }
    // Modal toggle
    toggleModal = () => {
        this.setState({ isOpen: !this.state.isOpen })
    };
    render() {
        return (
            <Div key={this.props.id} rating={this.props.rating}>
                <div onClick={this.props.toggleModal || this.toggleModal}>
                    <img
                        src={this.props.url}
                        alt={this.props.alt}
                        title={this.props.title}
                    />
                    <h4 style={{ padding: `${gutter/2}px` }}>{this.props.title}</h4>
                </div>
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
                    <h5>GIF Rating: {this.props.rating !== '' && this.props.rating !== undefined ? this.props.rating.toUpperCase() : 'Not Rated'}</h5>
                    <h5>Uploaded by: {this.props.username !== '' ? this.props.username : 'Unknown User'}</h5>
                    <h5>Uploaded on: {this.props.uploadDate !== '' && this.props.uploadDate !== undefined ? this.props.uploadDate.slice(0,10) : 'Unknown'}</h5>
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