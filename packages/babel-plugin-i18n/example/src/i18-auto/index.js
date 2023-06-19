import React from 'react'
import { Button, Toast, Popover } from 'components'
const Comp = (props) => {
  const tips = () => {
    Toast.info('这是一段提示')
    Toast({
      text: '这是一段提示'
    })
  }

  return (
    <div>
      <Button onClick={tips}>这是按钮</Button>
      <Popover tooltip='气泡提示' />
    </div>
  )
}

export default Comp
