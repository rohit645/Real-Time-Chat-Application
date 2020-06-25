import React from 'react'

const TextContainer = ({ users }) => {
    console.log('users are', users);
    let disp_users = []
    users.map(user => user.map(us => disp_users.push(us)));

    disp_users.map(user => console.log(user.id));
    return(
        <div className="textContainer">
            {
                disp_users
                    ? (
                    <div>
                        <h1>People currently chatting:</h1>
                        <div className="activeContainer">
                            <h2>
                                {disp_users.map(ele => (
                                    <div key={ele.id} className="activeItem">
                                        {ele.name}
                                    </div>
                                ))}
                            </h2>
                        </div>
                    </div>
                    )
                    : null
                }
            {/* {disp_users.map((user, i) => <div key = {i}>{user.name} <br /></div>)} */}

        </div>
    )
}

export default TextContainer;