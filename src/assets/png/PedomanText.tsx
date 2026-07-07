import type { ImgHTMLAttributes } from 'react'

const PedomanText = (props: ImgHTMLAttributes<HTMLImageElement>) => {
  return (
    <img
      src='/images/logo/pedoman_text.png' // Sesuaikan path sesuai struktur proyek
      alt='Pedoman Text Logo'
      // width={64}
      height={29}
      {...props}
    />
  )
}

export default PedomanText
