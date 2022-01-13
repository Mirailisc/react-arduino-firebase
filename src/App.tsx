import React, { useState, useEffect } from 'react'
import { app } from './service/Firebase'
import { getDatabase, ref, onValue, query, set } from 'firebase/database'
import './App.scss'

const database = getDatabase(app)
const dbRef = ref(database, 'status')

function App() {
  const [status, setStatus] = useState<string>('Standby')

  const handleWorking = async () => {
    await set(dbRef, 'Working')
  }

  useEffect(() => {
    onValue(query(dbRef), (snapshot) => {
      setStatus(snapshot.val())
    })
  }, [])

  const handleNextStage = async () => {
    await set(dbRef, 'Standby')
  }

  return (
    <div className="App">
      <h1 className="header">Arduino Project</h1>
      <div className="container">
        <h3>สถานะอุปกรณ์</h3>
        <div className="row">
          {status === 'Standby' ? (
            <div className="switcher-standby" onClick={() => handleWorking()}></div>
          ) : (
            <div className="switcher"></div>
          )}
          <div className="statusPanel">
            <p className={status}>
              <b>สถานะ: </b> {status}
            </p>
            <p className={status === 'Waiting' ? 'waitingStatus' : 'notWaitingStatus'}>รอการรดน้ำ</p>
          </div>
          {status === 'Waiting' ? (
            <div className="buttonGroup">
              <button className="done-water" onClick={() => handleNextStage()}>
                รดน้ำ
              </button>
              <button className="skip-water" onClick={() => handleNextStage()}>
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
        <h3>ข้อมูล</h3>
        <div className="informationPanel">
          <h3>สถานะทั้งหมด</h3>
          <ul>
            <li>
              <span className="standby">Standby: </span>ระบบกำลังรอการดำเนินการ
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
    </div>
  )
}

export default App
