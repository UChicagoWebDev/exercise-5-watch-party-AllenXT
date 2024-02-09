/* For index.html */

// If a user clicks to create a chat, create an auth key for them
// and save it. Redirect the user to /chat/<chat_id>
function createChat() {
  fetch('/rooms/new', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization' : WATCH_PARTY_API_KEY
    }
  })
  .then(response => response.json())
  .then(data => {
    console.log(data);
    console.log(data.room_id);
    if (data.room_id) {
      window.location.href = `/rooms/${data.room_id}`;
    } else {
      console.error('Error: Failed to create a room');
    }
  })
  .catch(error => console.error('Error:', error));
}


/* For room.html */
// get the current chat room ID
function getRoomID() {
  const inviteLinkElement = document.querySelector('.invite a');
  const hrefValue = inviteLinkElement.getAttribute('href');
  const roomID = hrefValue.split('/')[2];
  return roomID;
}

// Fetch the list of existing chat messages.
// POST to the API when the user posts a new message.
// Automatically poll for new messages on a regular interval.
function postMessage() {
  const message = document.querySelector('.comment_box textarea').value;
  // get the room ID
  const roomId = getRoomID();

  let url = "/api/rooms/" + roomId + "/messages";
  fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': WATCH_PARTY_API_KEY
    },
    body: JSON.stringify({ body: message, user_id: WATCH_PARTY_USER_ID })
  })
  .then(response => {
    if (response.ok) {
      // clear the input textarea
      document.querySelector('.comment_box textarea').value = '';
      getMessages();
    } else {
      console.error('Error: Failed to post message');
    }
  })
  .catch(error => console.error('Error:', error));
}

// get all the current messages in this chat room
function getMessages() {
  // get the room ID
  const roomId = getRoomID();
  // console.log(roomId);
  let url = "/api/rooms/" + roomId + "/messages";
  // console.log(url);

  fetch(url, {
    method : "GET",
    headers: {
      'Authorization': WATCH_PARTY_API_KEY
    }
  })
  .then(response => response.json())
  .then(messages => {
    const messagesContainer = document.querySelector('.messages');
    // clear current messages
    messagesContainer.innerHTML = '';
    messages.forEach(message => {
      // <message>
      //   <author>AUTHOR</author>
      //   <content>CONTENT</content>
      // </message>
      const messageElement = document.createElement('message');
      const authorElement = document.createElement('author');
      const contentElement = document.createElement('content');

      authorElement.textContent = message.name;
      contentElement.textContent = message.body;

      messageElement.appendChild(authorElement);
      messageElement.appendChild(contentElement);

      messagesContainer.appendChild(messageElement);
    });
  })
  .catch(error => console.error('Error:', error));
}

// edit the room name
// when 'edit' clicked, hide 'edit' icon, show 'save' icon
function editRoomName() {
  document.querySelector('.roomData .edit').classList.remove('hide');
  document.querySelector('.roomData .display').classList.add('hide'); 
}

// when 'save' clicked, hide 'save' icon, show 'edit' icon
// POST to update the room name
// update `roomName` with the new name
function updateRoomName() {
  // get the room ID
  const roomId = getRoomID();

  const newRoomName = document.querySelector('.roomData .edit input').value;
  // console.log('newRoomName', newRoomName);
  let url = "/api/rooms/"+roomId;
  fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': WATCH_PARTY_API_KEY
    },
    body: JSON.stringify({ roomName: newRoomName })
  })
  .then(response => {
    if (response.ok) {
      document.querySelector('.roomData .roomName').textContent = newRoomName;
      document.querySelector('.roomData .display').classList.remove('hide');
      document.querySelector('.roomData .edit').classList.add('hide');
    } else {
      console.error('Error: Failed to update room name');
    }
  })
  .catch(error => console.error('Error:', error));
}

// Messages freshness
function startMessagePolling() {
  setInterval(getMessages, 100);
}

// update the user name
function updateUsername() {
  const newUserName = document.querySelector('input[name="username"]').value;
  // console.log('newUserName: ', newUserName);
  fetch("/api/user/name", {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': WATCH_PARTY_API_KEY
    },
    body: JSON.stringify({ username: newUserName })
  })
  .then(response => {
    if (response.ok) {
      alert('Username Updated!');
    } else {
      alert('Error: Failed to update the username');
    }
  })
  .catch(error => console.error('Error:', error));
}

// update the password
function updatePassword() {
  const newPassword = document.querySelector('input[name="password"]').value;
  // console.log('newPassword: ', newPassword);
  fetch("/api/user/password", {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': WATCH_PARTY_API_KEY
    },
    body: JSON.stringify({ password: newPassword })
  })
  .then(response => {
    if (response.ok) {
      alert('Password Updated!');
    } else {
      alert('Error: Failed to update the password');
    }
  })
  .catch(error => console.error('Error:', error));
}