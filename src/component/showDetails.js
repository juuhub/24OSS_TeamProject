import React from 'react';
import { Avatar } from 'antd';

const AlbumDetails = ({ album }) => {
    if (!album) return null;

    return (
        <div>
            <Avatar src={album.image} size={128} className="album-image" />
            <h2>{album.name}</h2>
            <p><strong>Artist:</strong> {album.artist}</p>
            <p><strong>More details can go here...</strong></p>
        </div>
    );
};

export default AlbumDetails;