// src/components/common/SectionTitle.jsx
import React from 'react'
import { Typography, Box } from '@mui/material'

const SectionTitle = ({ children }) => {
  return (
    <Box mb={2}>
      <Typography
        variant="h3"
        sx={{
          fontWeight: 700,
          letterSpacing: '-0.5px',
          color: 'primary.main',
          textTransform: 'uppercase',
        }}
      >
        {children}
      </Typography>
      <Box
        sx={{
          height: 4,
          width: 64,
          bgcolor: 'secondary.main',
          mt: 1,
          borderRadius: 2,
        }}
      />
    </Box>
  )
}

export default SectionTitle
