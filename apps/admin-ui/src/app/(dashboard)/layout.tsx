"use client"
import React from 'react'
import Sidebar from '../layout/Sidebar'
import { Provider } from 'react-redux'
import { store } from '../../utils/redux/store/store'

export default function layout({ children }: { children: React.ReactNode }) {
  return (
    <div className='dark'>
    <Sidebar>
      <Provider store={store}>
        {children}
      </Provider>
    </Sidebar>
    </div>
  )
}