import React from 'react'

import './Input.css'

const Input = ({message, setMessage, sendMessage}) => {
    return(
        <form className="form">
            <input 
                className="input"
                type="text"
                value={message} 
                onChange={({target: { value }}) => setMessage(value)}
                onKeyPress={event => event.key === 'Enter'?sendMessage(event):null}
                placeholder="type a message..."
            />
            <button className="sendbutton" onClick={event => sendMessage(event)}>Send</button>
        </form>
    )
}

export default Input