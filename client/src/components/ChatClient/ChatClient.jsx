import React, { useState, useEffect } from "react";
import io from "socket.io-client";

const socket = io("http://localhost:4000");

export const ChatClient = () => {
  const [message, setMessage] = useState("");
  const [username, setUserName] = useState("Machine");
  const [listMessages, setListmessages] = useState([
    {
      body: "Bienvenido a la sala de chat",
      user: "Machine",
    },
  ]);

  const handleSubmit = (e) => {
    e.preventDefault();
    socket.emit("message", { body: message, user: username });

    const newMsg = {
      body: message,
      user: username,
    };

    setListmessages([...listMessages, newMsg]);
    setMessage("");
  };

  useEffect(() => {
    const receiveMessage = (msg) => {
      setListmessages([...listMessages, msg]);
    };
    socket.on("message", receiveMessage);

    return () => socket.off("message", receiveMessage);
  }, [listMessages]);

  return (
    <>
      <input
        onChange={(event) => setUserName(event.target.value)}
        className="txt-username"
        type="text"
        placeholder="username"
      />
      <div className="div-chat">
        {listMessages.map((message, idx) => (
          <p key={message + idx}>
            {message.user}: {message.body}
          </p>
        ))}
        <form onSubmit={handleSubmit} className="form">
          <span className="title">Chat-io</span>
          <p className="description">Escribe tu mensaje</p>
          <div className="div-type-chat">
            <input
              value={message}
              placeholder="Escribe tu mensaje"
              onChange={(e) => setMessage(e.target.value)}
              type="text"
              name="text"
              id="chat-message"
              className="input-style"
            />
            <button type="submit">Enviar</button>
          </div>
        </form>
      </div>
    </>
  );
};
