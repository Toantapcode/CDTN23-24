import React from 'react';

const RoomInfo = ({ room, displayPrice }) => {
    return (
        <div className="bg-white p-6 rounded-lg shadow-lg">
            <img
                src={room.image}
                alt={room.name}
                className="rounded-lg w-full h-96 object-cover"
            />
            <h3 className="text-2xl font-bold text-gray-800 mt-4">{room.name}</h3>
            <p className="text-gray-600 mt-2">{room.description}</p>
            <p className="text-yellow-600 font-bold text-lg mt-2">{displayPrice}</p>
        </div>
    );
};

export default RoomInfo;