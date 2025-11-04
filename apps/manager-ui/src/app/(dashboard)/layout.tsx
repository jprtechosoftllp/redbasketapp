"use client"
import React, { useEffect, useState } from 'react'
import Sidebar from '../layout/Sidebar'
import { Provider } from 'react-redux'
import { store } from '../../utils/redux/store/store'

export default function layout({ children }: { children: React.ReactNode }) {
  const [client, setClinet] = useState(false);
  useEffect(() => {
    setClinet(true)
  }, [])
  return (
    client &&
    <div>
      <Provider store={store}>
        <Sidebar>
          {children}
        </Sidebar>
      </Provider>
    </div>
  )
}