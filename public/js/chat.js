"use strict";

import io from "socket.io-client";

const socket = io();

let page = $("#page");
let statusBar = $("#status-bar");

let nicknameForm = $("#nickname-form");
let nicknameField = $("#nickname");

let chatForm = $("#chat-form");
let msgField = $("#message");

let chatContent = $("#chat-content");

export default class Chat{

    constructor(){
        this._events();
    }
    _events(){
        nicknameForm.on("submit", (e) => this.handleNicknameForm(e));
        chatForm.on("submit", (e) => this.handleChatForm(e));

        msgField
            .on("keypress", (e) =>  socket.emit("type-start", nickname))
            .on("keyup", (e) => socket.emit("type-end"));

        socket
            .on("login", (data) => this.handleLogin(data))
            .on("user-joined", (data) => this.handleUserJoined(data))
            .on("broadcast", (data) => this.handleBroadCast(data))
            .on("type-start", (nickname) => this.handleTypeStart(nickname))
            .on("type-end", () => this.handleTypeEnd())
            .on("user-left", (data) => this.handleUserLeft(data))
            .on("exit", (data) => this.handleExit(data));
    }
    handleNicknameForm(e){
        e.preventDefault();

        socket.emit("new-user", nicknameField.val());

        page.addClass("active");
        nicknameForm[0].reset();
    }
    handleChatForm(e){
        e.preventDefault();

        socket.emit("message", msgField.val());

        this.appendContent(msgField.val());

        chatForm[0].reset();
    }

    handleLogin(data){
        statusBar.html(`
            <p>online: ${data.numUsers}</p>
        `);
    }
    handleUserJoined(data){
        statusBar.html(`
            <p>online: ${ data.numUsers }</p>
        `);
    }
    handleBroadCast(data){
        this.appendContent(data.message, data.nickname);
    }
    handleTypeStart(nickname){
        msgField.val(`${nickname} is typing`);
    }
    handleTypeEnd(){
        msgField.val("");
    }
    handleUserLeft(data){
        statusBar.html(`
            <p>online: ${ data.numUsers }</p>
        `);
    }
    handleExit(data){
        statusBar.html(`
            <p>online: ${ data.numUsers }</p>
        `);
    }

    appendContent(message, nickname = "me"){
        chatContent.append(`
            <li>
                <p>${ nickname }: ${ message }</p>
            </li>
        `);
    }
}




