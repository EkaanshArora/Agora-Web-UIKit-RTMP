import React, { useContext, useState } from 'react'
import { PropsContext, GridVideo, layout, LocalControls, PinnedVideo, RtcConfigure, TracksConfigure } from 'agora-react-uikit'
import 'agora-react-uikit/dist/index.css'
import RTMP from './RTMP'

const App = () => {
  const [videocall, setVideocall] = useState(true)
  const [isHost, setHost] = useState(true)
  const [isPinned, setPinned] = useState(false)

  return (
    <div style={styles.container}>
      <div style={styles.videoContainer}>
        <h1 style={styles.heading}>Agora React Web UI Kit</h1>
        {videocall ? (<>
          <div style={styles.nav}>
            <p style={{ fontSize: 20, width: 200 }}>You're {isHost ? 'a host' : 'an audience'}</p>
            <p style={styles.btn} onClick={() => setHost(!isHost)}>Change Role</p>
            <p style={styles.btn} onClick={() => setPinned(!isPinned)}>Change Layout</p>
          </div>
          <PropsContext.Provider value={{
            rtcProps: {
              appId: '<Your Agora App ID>',
              channel: 'test',
              token: null,
              role: isHost ? 'host' : 'audience',
              layout: isPinned ? layout.pin : layout.grid
            },
            styleProps: {
              gridVideoContainer: { 'height': '90%' },
              pinnedVideoContainer: { 'height': '90%' }
            },
            callbacks: {
              EndCall: () => setVideocall(false),
            }
          }} >

            <div style={{ flex: 1 }} >
              {isHost === false ? (
                <VideocallUI />
              ) : (
                <TracksConfigure>
                  <VideocallUI />
                </TracksConfigure>
              )}
            </div>
          </PropsContext.Provider>
        </>
        ) : (
          <div style={styles.nav}>
            <h3 style={styles.btn} onClick={() => setVideocall(true)}>Start Call</h3>
          </div>
        )}
      </div>
    </div>
  )
}

const VideocallUI = () => {
  const { rtcProps } = useContext(PropsContext)
  return (
    <RtcConfigure callActive={rtcProps.callActive}>
      <div style={styles.containerInner}>
        <RTMP />
      </div>
      {rtcProps?.layout === layout.grid ? <GridVideo /> : <PinnedVideo />}
      <LocalControls />
    </RtcConfigure>
  )
}

const styles = {
  container: { width: '100vw', height: '100vh', display: 'flex', flex: 1, backgroundColor: '#007bff22' },
  heading: { textAlign: 'center', marginBottom: 0 },
  videoContainer: { display: 'flex', flexDirection: 'column', flex: 1 },
  nav: { display: 'flex', justifyContent: 'space-around' },
  btn: { backgroundColor: '#007bff', cursor: 'pointer', borderRadius: 5, padding: 5, color: '#ffffff', fontSize: 20 },
  containerInner: {display: 'flex', flex: 1, alignContent: 'center', alignItems: 'center', marginBottom: 10}
}

export default App