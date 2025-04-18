import { Button } from '@/components/ui/button'
import { useNavigate } from 'react-router-dom'

export default function UnauthorizedError() {
  const navigate = useNavigate()
  return (
    <div className='h-svh'>
      <div className='m-auto flex h-full w-full flex-col items-center justify-center gap-2'>
        <h1 className='text-[7rem] font-bold leading-tight'>401</h1>
        <span className='font-medium'>Unauthorized Access</span>
        <p className='text-center text-muted-foreground'>
          Please log in with the appropriate credentials <br /> to access this
          resource.
        </p>
        <br />
        <p className='text-center text-muted-foreground'>
          Unless you're a hacker <br /> then you will be dealt with...
        </p>
        <div className='mt-6 flex gap-4'>
          <Button variant='outline' onClick={() => history.go(-1)}>
            Go Back
          </Button>
          <Button onClick={() => navigate("/")}>Back to Home</Button>
        </div>
      </div>
    </div>
  )
}
