import type { ImgHTMLAttributes } from 'react'

const Imo = (props: ImgHTMLAttributes<HTMLImageElement>) => {
  return (
    <img
      src='/images/front-pages/landing-page/imo.png' // Sesuaikan path sesuai struktur proyek
      alt='IMO Logo'
      // width={64}
      height={29}
      {...props}
    />
  )
}

export default Imo
