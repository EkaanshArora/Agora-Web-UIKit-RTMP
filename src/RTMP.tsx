import { MaxUidContext, MinUidContext, RtcContext } from 'agora-react-uikit';
import { useContext, useEffect, useState } from 'react';

const RTMPUrl = ''
const W = 1280
const H = 720

const RTMP = () => {
  const [isStreaming, setStreaming] = useState(false);
  const [isBtnDisabled, setBtnDisabled] = useState(false)
  const { client, localUid } = useContext(RtcContext)
  const max = useContext(MaxUidContext);
  const min = useContext(MinUidContext);

  useEffect(() => {
    client.on('live-streaming-error', (e) =>
      console.log('live-streaming-error', e),
    );
    client.on('live-streaming-warning', (e) =>
      console.log('live-streaming-warning', e),
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (isStreaming) {
      transcode();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isStreaming, max, min]);

  const transcode = async () => {
    let users = [...max, ...min];
    let N = users.length;
    let rows = Math.round(Math.sqrt(N));
    let cols = Math.ceil(N / rows);
    let uids = users.map((u) => {
      if (u.uid === 0 && localUid) {
        return localUid as number;
      } else {
        return u.uid as number;
      }
    });
    let userData = uids.map((u, i) => {
      return {
        uid: u,
        x: (i % cols) * Math.round(W / cols),
        y: Math.round(Math.floor(i / cols) * (H / rows)),
        width: Math.round(W / cols),
        height: Math.round(H / rows),
        zOrder: 0,
        alpha: 1,
      };
    });
    const config = {
      // Width of the video (px). The default value is 640.
      width: W,
      // Height of the video (px). The default value is 360.
      height: H,
      // Frame rate of the video (fps). The default value is 15.
      videoFramerate: 30,
      backgroundColor: 0x000000,
      watermark: {
        url: '',
        x: 10,
        y: 10,
        width: 200,
        height: 70,
      },
      // Set the layout for each user.
      transcodingUsers: userData,
    };
    await client.setLiveTranscoding(config)
  };

  const rtmpOn = async () => {
    setBtnDisabled(true)
    await transcode()
    await client.startLiveStreaming(RTMPUrl, true)
    setStreaming(true)
    setBtnDisabled(false)
  }

  const rtmpOff = async () => {
    setBtnDisabled(true)
    await client.stopLiveStreaming(RTMPUrl)
    setStreaming(false)
    setBtnDisabled(false)
  }

  return (
      <div style={isBtnDisabled ? disabledBtn : btn} onClick={() => {
        if (!isBtnDisabled) {
          console.log(isStreaming)
          isStreaming ? rtmpOff() : rtmpOn()
        }
      }}>
        {isBtnDisabled ? 'Working...' : isStreaming ? 'Stop Streaming to CDN' : 'Start Streaming to CDN'}
      </div>
  )
}

const btn = { backgroundColor: '#007bff', cursor: 'pointer', borderRadius: 5, padding: 5, color: '#ffffff', fontSize: 20, margin: 'auto',  paddingLeft: 10, paddingRight: 10}
const disabledBtn = { backgroundColor: '#007bff55', borderRadius: 5, padding: 5, color: '#ffffff', fontSize: 20, margin: 'auto', paddingLeft: 20, paddingRight: 20}

export default RTMP;
