import type { ImgHTMLAttributes } from 'react'

const Krcon = (props: ImgHTMLAttributes<HTMLImageElement>) => {
  return (
    <img
      src='/images/front-pages/landing-page/krcon.png' // Sesuaikan path sesuai struktur proyek
      alt='Krcon Logo'
      // width={64}
      height={29}
      {...props}
    />
  )
}

export default Krcon
