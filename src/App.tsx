import React, { useState, useEffect } from 'react'
import { app } from './service/Firebase'
import { getDatabase, ref, onValue, query, set } from 'firebase/database'
import addNotification from 'react-push-notification'
import './App.scss'
import Image from './image/image.png'
import Image2 from './image/image2.png'
import Switch from 'react-switch'

const database = getDatabase(app)
const dbStatus = ref(database, 'status')
const dbSkip = ref(database, 'isSkip')

function App() {
  const [status, setStatus] = useState<string>('Stand by') // Status state
  const [check, setCheck] = useState<boolean>(false)

  const handleWorking = () => {
    set(dbStatus, 'Working')
  } // Set status to Working

  const handleNextStage = () => {
    set(dbStatus, 'Stand by')
  } // Set Status to Stand by

  useEffect(() => {
    onValue(query(dbStatus), (snapshot) => {
      setStatus(snapshot.val())
    })

    onValue(query(dbSkip), (snapshot) => {
      setCheck(Boolean(snapshot.val()))
    })
  }, []) // Get Data from Google Firebase

  const handleCheck = () => {
    set(dbSkip, !check)
  }

  useEffect(() => {
    if (status === 'Waiting') {
      addNotification({
        title: 'Arduino Notification',
        message: 'ระบบเสร็จสิ้นการทำงานและรอการรดน้ำเพื่อเพิ่มความชื้น',
        native: true,
      })
    }
  }, [status]) // Read change on state if change = Waiting status then show notification

  return (
    <div className="App">
      {status === 'Working' ? <div className="gradient" /> : null}
      {status === 'Waiting' ? <div className="gradient-waiting" /> : null}
      <h1 className="header">Arduino Project</h1>
      <div className="container">
        <h3>สถานะอุปกรณ์</h3>
        <div className="row">
          {status === 'Stand by' ? (
            <div className="switcher-standby" onClick={handleWorking}>
              <img src={Image2} alt="imageStandby" className="image" />
            </div>
          ) : (
            <div className="switcher">
              <img src={Image} alt="imageSpin" className="spin-image" />
            </div>
          )}
          <div className="statusPanel">
            <p className={status}>
              <b>สถานะ: </b> {status}
            </p>
            <p className={status === 'Waiting' ? 'waitingStatus' : 'notWaitingStatus'}>รอการรดน้ำ</p>
          </div>
          {status === 'Waiting' ? (
            <div className="buttonGroup">
              <button className="done-water" onClick={handleNextStage}>
                รดน้ำ
              </button>
              <button className="skip-water" onClick={handleNextStage}>
                ข้ามการรดน้ำ
              </button>
            </div>
          ) : null}
        </div>
        {status === 'Waiting' ? (
          <div className="buttonGroup-responsive">
            <button className="done-water" onClick={() => handleNextStage()}>
              รดน้ำแล้ว
            </button>
            <button className="skip-water" onClick={() => handleNextStage()}>
              ข้ามการรดน้ำ
            </button>
          </div>
        ) : null}
        <h3>ตั้งค่า</h3>
        <div className="setting">
          <Switch onChange={handleCheck} checked={check} uncheckedIcon={false} checkedIcon={false} activeBoxShadow="0 1px 0 6px rgba(119,206,255,0.37)" onColor='#53B7FF'/>
          <p>เปิด/ปิด การข้ามสถานะ <span className="workingToggler">Working</span></p>
        </div>
        <h3>ข้อมูล</h3>
        <div className="informationPanel">
          <h3>สถานะทั้งหมด</h3>
          <ul>
            <li>
              <span className="standby">Stand by: </span>ระบบกำลังรอการดำเนินการ
            </li>
            <li>
              <span className="working">Working: </span>มอเตอร์กำลังทำงานอยู่
            </li>
            <li>
              <span className="waiting">Waiting: </span>ระบบกำลังรอการรดน้ำ
            </li>
          </ul>
        </div>
      </div>
      <p className="credit">2022 © Phubordin Poolnai and his friends</p>
    </div>
  )
}

export default App
