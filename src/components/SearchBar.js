import React from 'react';
import styled from 'styled-components';
import './SearchBar.css';
import { EazeGold, gutter, smallScreen, mediumScreen } from '../lib/constants';
import { play, pause } from '../images'

const Button = styled.button`
    background: ${EazeGold};
    background-position: center;
    background-repeat: no-repeat;
    margin-right: 1%;
    cursor: pointer;
    height: 45px;
    width: 6%;
    border-radius: 50%;
    border: none;

    @media(max-width: ${mediumScreen}px){
        width: 9%;
    }
    @media(max-width: ${smallScreen}px){
        width: 15%;
    }
`;

const Switch = styled.input`
    opacity: 0;
    width: 0;
    height: 0;
`;
    
const Search = styled.div`
    display: flex;
    padding: ${gutter}px;
    width: 60%;

    @media(max-width: ${smallScreen}px){
        flex-direction: column;
        width: 100%;
        margin-bottom: ${gutter*2}px;
        padding: 0;
    }
`;

const SearchDiv = styled.div`
    display: flex;
    align-items: center;
    width: 80%;

    @media(max-width: ${mediumScreen}px){
     
    }
    @media(max-width: ${smallScreen}px){
        margin: 0;
        padding: 0;
        width: 100%;
    }
`;

const SearchIcon = styled.img`
    cursor: pointer;
    width: 3.5%;
    height: 30px;
    padding: ${gutter/4}px;
    border: 2px solid ${EazeGold};
    border-radius: 0 10px 10px 0;
    background: ${EazeGold};

    @media(max-width: ${mediumScreen}px){
        width: 6%;
    }
    @media(max-width: ${smallScreen}px){
        width: 8%;
    }
`;

const SearchInput = styled.input`
    padding: ${gutter/1.5}px;
    margin: ${gutter}px 0;
    border-radius: 10px 0 0 10px;
    font-size: 1rem;
    width: 92%;

    @media(max-width: ${mediumScreen}px){
        width: 60%;
    }
    @media(max-width: ${smallScreen}px){
        margin: 0;
        width: 80%;
    }
`;

const Toggle = styled.label`
    position: relative;
    display: inline-block;
    cursor: pointer;
    width: 50px;
    height: 34px;
    margin: 2.5% 2.5% 0 0;
    text-align: center;
`;

const ToggleDiv = styled.div`
    display: flex;
    justify-content: space-around;
    width: 20%;

    @media(max-width: ${smallScreen}px){
        width: 100%;
    }
`;

export const SearchBar = props => {
    return (
        <Search>
            <SearchDiv>
                <Button 
                    name='paused'
                    title={`${props.paused ? 'play' : 'pause' } animation`}
                    onClick={props.toggle}
                    style={{ backgroundImage: `${props.paused ? `url(${play})`: `url(${pause})`}`  }}
                />
                {/* Receives input */}
                <SearchInput 
                    name='query'
                    value={props.query}
                    placeholder='Seach here/Add Tags (separate by space)'
                    onChange={props.handleChange}
                    onKeyUp={props.search}
                />
                <SearchIcon 
                    src={require('../images/search.svg')}
                    alt='search'
                    onClick={props.search}
                />
            </SearchDiv>
            {/* Switches to toggle NSFW and GIF/Sticker */}
            <ToggleDiv>
                <Toggle>
                    <Switch 
                        type='checkbox'
                        name='nsfw'
                        value={props.nsfw}
                        onChange={props.toggle}
                    />
                    <span className="slider round" />
                    <h3 style={{ color: `${props.nsfw ? 'red' : 'white'}` }}>
                        NSFW
                    </h3>
                </Toggle>
                <Toggle>
                    <Switch 
                        type='checkbox'
                        name='type'
                        value={props.type}
                        onChange={props.toggle}
                    />
                    <span className="slider round" />
                    <h3 style={{ color: 'white' }}>
                        {props.type === 'gifs' ? 'GIFs' : 'Stickers'}
                    </h3>
                </Toggle>
            </ToggleDiv>
        </Search>
    )
};