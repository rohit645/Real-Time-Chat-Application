import React, { useState, useEffect } from 'react';
import queryString from 'query-string';
import io from 'socket.io-client';
import { Link } from 'react-router-dom';

import Chatbox from '../Chatbox/Chatbox';
import Input from '../Input/Input';
import Messages from '../Messages/Messages';
import TextContainer from '../TextContainer/TextContainer'
import Join from '../Join/Join';
import  { Redirect } from 'react-router-dom'


import './Chat.css'

let socket;
let valid = true;

const Chat = ({ location }) => {
    const [name, setName] = useState('');
    const [room, setRoom] = useState('');
    const [users, setUsers] = useState([]);
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);
    const ENDPOINT = 'https://rohit645-chat-application.herokuapp.com/';

    useEffect(() => {
        const {name, room} = queryString.parse(location.search);
        setName(name);
        setRoom(room);  

        socket =  io(ENDPOINT);
        socket.emit('join', {name, room}, ({error}) => {
            if(error) {
                alert(error);
            }
        });

    }, [ENDPOINT, location.search])

    useEffect(() => {
        socket.on('message', (message) => {
            setMessages([...messages, message]);
        });
    }, [messages])

    useEffect(() => {
        socket.on('roomData', ({ users }) => {
            setUsers(users);
        });
    }, [users])

    const sendMessage = (event) => {
        event.preventDefault();

        if(message) {
            socket.emit('sendMessage', message, ()=>setMessage(''));
        }
    }
    return (
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
