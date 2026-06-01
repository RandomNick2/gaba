// src/components/common/SectionSubtitle.jsx
import React from 'react'
import { Typography } from '@mui/material'

const SectionSubtitle = ({ children }) => {
  return (
    <Typography
      variant="body1"
      sx={{
        color: 'text.secondary',
        fontSize: '1.1rem',
        mb: 4,
        maxWidth: 720,
      }}
    >
      {children}
    </Typography>
  )
}

export default SectionSubtitle
