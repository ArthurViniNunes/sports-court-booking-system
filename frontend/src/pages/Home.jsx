import { Button, Container, Stack } from '@mui/material'

function Home() {

  return (
    <>
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Stack spacing={2}>
          
          <Button variant="contained">Hello World!</Button>
        </Stack>
      </Container>
    </>
  )
}

export default Home
