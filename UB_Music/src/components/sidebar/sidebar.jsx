import React from 'react';
import styled from 'styled-components';
import { FaSignOutAlt, FaHeart,FaHome } from 'react-icons/fa';
import SidebarButton from './SidebarButton';

const SidebarContainer = styled.div`
    width: 100px;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
    background: linear-gradient(180deg, #1e1e1e, #282828);
    box-shadow: 2px 0px 10px rgba(0, 0, 0, 0.3);
    border-right: 1px solid #333;
`;

const ProfileImage = styled.img`
    width: 60px;
    height: 60px;
    border-radius: 50%;
    margin-top: 20px;
    border: 2px solid #F8D9C0;
    transition: transform 0.3s ease;
    &:hover {
        transform: scale(1.1);
    }
`;

const FavoritesButton = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    color: #F8D9C0;
    margin-top: 20px;
    cursor: pointer;
    transition: color 0.3s ease, transform 0.3s ease;
    &:hover {
        color: #fff;
        transform: scale(1.05);
    }
`;

const SignOutButton = styled.div`
    color: #F8D9C0;
    margin-bottom: 20px;
    cursor: pointer;
    transition: color 0.3s ease, transform 0.3s ease;
    &:hover {
        color: #fff;
        transform: scale(1.1);
    }
`;

export default function Sidebar({onFavoritesClick, onSignOut }) {
    return (
        <SidebarContainer>
            <ProfileImage src="src/assets/images/profile/profile.jpg" alt="User Avatar" />
            <SidebarButton to="/home" icon={<FaHome />} title="Inicio" />
            <SidebarButton to="/home/favorites" icon={<FaHeart />} title="Favoritos" />
            <SidebarButton to="/signout" icon={<FaSignOutAlt />} title="Sign Out" />
        </SidebarContainer>
    );
}
