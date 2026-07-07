// Next Imports
import Link from 'next/link'
import { useParams } from 'next/navigation'


const NoResult = ({ searchValue, setOpen }: { searchValue: string; setOpen: (value: boolean) => void }) => {
  // Hooks
  const { lang: locale } = useParams()

  return (
    <div className='flex items-center justify-center grow flex-wrap plb-14 pli-16 overflow-y-auto overflow-x-hidden bs-full'>
      <div className='flex flex-col items-center'>
        <i className='ri-file-forbid-line text-[64px] mbe-2.5' />
        <p className='text-xl mbe-11'>{`No result for "${searchValue}"`}</p>
      </div>
    </div>
  )
}

export default NoResult
