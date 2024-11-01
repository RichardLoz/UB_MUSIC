import React, { useState } from 'react';
import styled from 'styled-components';
import { FaSearch } from 'react-icons/fa';

const SearchContainer = styled.div`
    display: flex;
    align-items: center;
    background-color: #333;
    padding: 10px;
    border-radius: 25px;
    width: 100%;
    max-width: 400px;
    margin: 20px 0;
`;

const SearchIcon = styled(FaSearch)`
    color: #aaa;
    margin-right: 10px;
`;

const SearchInput = styled.input`
    background: none;
    border: none;
    outline: none;
    color: #fff;
    font-size: 16px;
    width: 100%;

    &::placeholder {
        color: #aaa;
    }
`;

export default function SearchBar({ onSearch }) {
    const [query, setQuery] = useState('');

    const handleSearch = (event) => {
        setQuery(event.target.value);
        if (onSearch) {
            onSearch(event.target.value);
        }
    };

    return (
        <SearchContainer>
            <SearchIcon />
            <SearchInput 
                type="text" 
                placeholder="Buscar canciones, álbumes, artistas o podcasts" 
                value={query}
                onChange={handleSearch}
            />
        </SearchContainer>
    );
}
