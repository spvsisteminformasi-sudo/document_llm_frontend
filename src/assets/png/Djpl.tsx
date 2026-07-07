import type { ImgHTMLAttributes } from 'react'

const Djpl = (props: ImgHTMLAttributes<HTMLImageElement>) => {
  return (
    <img
      src='/images/front-pages/landing-page/djpl.png' // Sesuaikan path sesuai struktur proyek
      alt='Djpl Logo'
      // width={64}
      height={29}
      {...props}
    />
  )
}

export default Djpl
