import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

// import queryString from 'query-string';
import io from 'socket.io-client';

import InfoBar from '../InfoBar/InfoBar';
import Input from '../Input/Input.js';
import Messages from '../Messages/Messages'
// import TextContainer from '../TextContainer/TextContainer'

import './Chat.css';


let socket;

const Chat = () => {
  // const ENDPOINT = "http://localhost:5000";
  const ENDPOINT = "https://chat-secret-app.herokuapp.com";
  const [name, setName] = useState('');
  const [room, setRoom] = useState('');
  
  const [searchParams] = useSearchParams();

  // const [users, setUsers] = useState('');
  
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  
  useEffect(() => {
    const { name, room } = Object.fromEntries([...searchParams]);
    socket = io(ENDPOINT);

    setRoom(room);
    setName(name);

    socket.emit('join', { name, room }, (error) => {
      if(error) {
        alert(error);
      }
    });

    return () => {
      // socket.off();
      socket.on('disconnect');

      socket.off();
    }
    
  }, [ ENDPOINT, searchParams ]);

  useEffect(() => {
    socket.on('message', (message) => {
      setMessages(messages => [...messages, message ]);
    });

    // socket.on("roomData", ({ users }) => {
    //   setUsers(users);
    // });
  }, []);

  const sendMessage = (event) => {
    event.preventDefault();

    if(message) {
      socket.emit('sendMessage', message, () => setMessage(''));
      
    }
    return () => {
      event.target.message.value = '';
      event.target.message.focus();
    }
  }

  console.log(message, messages);

  return (
    <div className='outerContainer'>
      <div className='container'>
        <InfoBar room={room} />
        <Messages messages={messages} name={name} />
        <Input message={message} setMessage={setMessage} sendMessage={sendMessage} />
      </div>
      {/* <TextContainer users={users} /> */}
    </div>
  )
};

export default Chat