import type { ImgHTMLAttributes } from 'react'

const Pedoman = (props: ImgHTMLAttributes<HTMLImageElement>) => {
  return (
    <img
      src='/images/logo/pedoman.png' // Sesuaikan path sesuai struktur proyek
      alt='Pedoman Logo'
      // width={64}
      height={50}
      {...props}
    />
  )
}

export default Pedoman
