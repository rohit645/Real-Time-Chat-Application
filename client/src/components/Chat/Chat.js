import React, { useState, useEffect } from 'react';
import queryString from 'query-string';
import io from 'socket.io-client';

import Chatbox from '../Chatbox/Chatbox';
import Input from '../Input/Input';
import Messages from '../Messages/Messages';
import TextContainer from '../TextContainer/TextContainer'


import './Chat.css'

let socket;

const Chat = ({location}) => {
    const [name, setName] = useState('');
    const [room, setRoom] = useState('');
    const [users, setUsers] = useState([]);
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);
    const ENDPOINT = 'localhost:5000';

    useEffect(() => {
        const {name, room} = queryString.parse(location.search);
        setName(name);
        setRoom(room);  

        socket =  io(ENDPOINT);
        socket.emit('join', {name, room}, (error) => {
            // if(error) alert(error);
        });

    }, [ENDPOINT, location.search])

    useEffect(() => {
            socket.on('roomData', (message) => {
            console.log('room data', message);
            setUsers([message.users]);
        });
    }, [])
    
    useEffect(() => {
        socket.on('message', (message) => {
            setMessages([...messages, message]);
        });
    }, [messages])

    const sendMessage = (event) => {
        event.preventDefault();

        if(message) {
            socket.emit('sendMessage', message, ()=>setMessage(''));

        }
    }
    
    return(
        <div className="outerContainer">
            <div className="container">
                <Chatbox room={room}/>
                <Messages messages={messages} name={name}/>
                <Input message={message} setMessage={setMessage} sendMessage={sendMessage} />
            </div>
            <div>
                <TextContainer users={users} />
            </div>
        </div>
    )
};

export default Chat;
