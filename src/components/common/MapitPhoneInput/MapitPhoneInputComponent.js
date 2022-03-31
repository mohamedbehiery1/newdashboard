import { forwardRef } from 'react'
import TextField from '@material-ui/core/TextField'

const MapitPhoneInputComponent = (props, ref) => {

  return (
    <TextField
      {...props}
      inputRef={ref}
      fullWidth
      size='small'
      variant='outlined'
      name='phone'
    />
  )
}
export default forwardRef(MapitPhoneInputComponent)