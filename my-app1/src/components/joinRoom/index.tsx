import React, { useContext, useState } from "react";
import styled, { keyframes } from "styled-components";
import gameContext from "../../gameContext";
import gameService from "../../services/gameService/";
import socketService from "../../services/socketService";

interface IJoinRoomProps {}

const Body = styled.body`
  margin: 0;
  padding: 0;
  font-family: 'Orbitron', sans-serif; 
  background-color: #001f3f; 
  background-image: url('/image123.jpg');
  background-size: cover;
  background-position: center;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 80vh;
`; 

const JoinRoomContainer = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-top: 2em;
  background: url('/image123.jpg') center center no-repeat;
  background-size: cover;
  position: relative;
  overflow: hidden;
  border: 2px solid #8e44ad;
  box-shadow: 0px 0px 20px rgba(0, 0, 0, 0.5);
  &:before,
  &:after {
    content: "";
    position: absolute;
    width: 5px;
    height: 100%;
    background: rgba(255, 255, 255, 0.1);
    animation: flicker 3s infinite alternate;
  }
  &:before {
    left: 0;
  }
  &:after {
    right: 0;
  }
  @keyframes flicker {
    to {
      opacity: 0.5;
    }
  }

  h4 {
    color: #fff; /* Bright color */
  }
`;
const RoomIdInput = styled.input`
  height: 30px;
  width: 20em;
  font-size: 17px;
  outline: none;
  border: 1px solid #8e44ad;
  border-radius: 3px;
  padding: 0 10px;
`;

const JoinButton = styled.button`
  outline: none;
  background-color: #8e44ad;
  color: #fff;
  font-size: 17px;
  border: 2px solid transparent;
  border-radius: 5px;
  padding: 4px 18px;
  transition: all 1000ms ease-in-out;
  margin-top: 1em;
  cursor: pointer;
  position: relative;

  transition: all 100ms ease-in-out;

  &:hover {
    background-color: #8e44ad;
    border: 2px solid #8e44ad;
    color: #fff;
  }
`;

const Box = styled.div<{ canInteract: boolean }>`
  width: 50px;
  height: 50px;
  background-color: #ccc;
  margin: 5px;
  cursor: ${({ canInteract }) => (canInteract ? "pointer" : "not-allowed")};
`;

export function JoinRoom(props: IJoinRoomProps) {
  const [roomName, setRoomName] = useState("");
  const [isLoading, setLoading] = useState(false);
  const [canInteract, setCanInteract] = useState(false);
  const { setInRoom, isInRoom } = useContext(gameContext);

  const handleRoomNameChange = (e: React.ChangeEvent<any>) => {
    const value = e.target.value;
    setRoomName(value);
  };

  const joinRoom = async (e: React.FormEvent) => {
    e.preventDefault();

    const socket = socketService.socket;
    if (!roomName || roomName.trim() === "" || !socket) return;

    setLoading(true);

    const joined = await gameService
      .joinGameRoom(socket, roomName)
      .catch((err) => {
        alert(err);
      });

    if (joined) {
      setInRoom(true);
      setCanInteract(true);
    }

    setLoading(false);
  };

  return (
    <Body>
    <form onSubmit={joinRoom}>
      <JoinRoomContainer>
        <h4>Enter Room ID to Join the Game</h4>
        <RoomIdInput
          placeholder="Room ID"
          value={roomName}
          onChange={handleRoomNameChange}
        />
        <JoinButton type="submit" className={isLoading ? "loading" : ""} disabled={isLoading}>
          {isLoading ? "Joining..." : "Join"}
        </JoinButton>
      </JoinRoomContainer>
    </form>
    </Body>
  );
}
