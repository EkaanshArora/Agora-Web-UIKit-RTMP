import { useState } from 'react';

const serverUrl = "" // enter the backend url 
// you can find a demo project here: (https://github.com/EkaanshArora/Agora-Cloud-Player-Backend)

const body = {
  channel: "test",
  uid: 1,
  token: null,
  url: "" // enter video url
}


const CloudPlayer = () => {
  const [isBtnDisabled, setBtnDisabled] = useState(false)
  
  const playVideo = async () => {
    setBtnDisabled(true)
    let res = await fetch(serverUrl, {
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'POST',
      body: JSON.stringify(body)
    })
    let json = await res.json()
    console.log(json)
    setBtnDisabled(false)
  }

  return (<>
      <div style={isBtnDisabled ? disabledBtn : btn} onClick={() => {
        if (!isBtnDisabled) {
          playVideo()
        }
      }}>
        {isBtnDisabled ? 'Requesting...' : 'Stream Video from Cloud'}
      </div>
    </>
  )
}

const btn = { backgroundColor: '#007bff', cursor: 'pointer', borderRadius: 5, padding: 5, color: '#ffffff', fontSize: 20, margin: 'auto',  paddingLeft: 10, paddingRight: 10}
const disabledBtn = { backgroundColor: '#007bff55', borderRadius: 5, padding: 5, color: '#ffffff', fontSize: 20, margin: 'auto', paddingLeft: 20, paddingRight: 20}

export default CloudPlayer;
