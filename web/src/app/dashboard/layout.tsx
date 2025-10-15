import React, { type ReactNode } from 'react'

const DashboardLayout = ({children}:{children:ReactNode}) => {
  return (
    <div>
      <h2>Layoutt</h2>
      {children}
    </div>
  )
}

export default DashboardLayout
