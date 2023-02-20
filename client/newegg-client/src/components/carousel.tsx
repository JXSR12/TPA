import React, { useEffect, useRef, useState } from 'react'
import styles from '@/styles/Carousel.module.css'
import { BiLeftArrow, BiRightArrow } from 'react-icons/bi'

export type ImageType = { id: number; url: string }

const Carousel: React.FC<{ images?: ImageType[] }> = ({ images }) => {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const [selectedImage, setSelectedImage] = useState<ImageType>()
  const carouselItemsRef = useRef<HTMLDivElement[] | null[]>([])

  useEffect(() => {
    if (images && images[0]) {
      carouselItemsRef.current = carouselItemsRef.current.slice(0, images.length)

      setSelectedImageIndex(0)
      setSelectedImage(images[0])
    }
  }, [images])

  const handleSelectedImageChange = (newIdx: number) => {
    if (images && images.length > 0) {
      setSelectedImage(images[newIdx])
      setSelectedImageIndex(newIdx)
      if (carouselItemsRef?.current[newIdx]) {
        carouselItemsRef?.current[newIdx]?.scrollIntoView({
          block: 'end',
          inline: 'center',
          behavior: 'smooth',
        })
      }
    }
  }

  const handleRightClick = () => {
    if (images && images.length > 0) {
      let newIdx = selectedImageIndex + 1
      if (newIdx >= images.length) {
        newIdx = 0
      }
      handleSelectedImageChange(newIdx)
    }
  }

  const handleLeftClick = () => {
    if (images && images.length > 0) {
      let newIdx = selectedImageIndex - 1
      if (newIdx < 0) {
        newIdx = images.length - 1
      }
      handleSelectedImageChange(newIdx)
    }
  }

  return (
    <div className={styles['promo-carousel-container']}>
      <a onClick={handleLeftClick} className={styles['text-button']}>
        <BiLeftArrow/>
      </a>
      <div className={styles['selected-image']} style={{ backgroundImage: `url(${selectedImage?.url})` }} />
      <a onClick={handleRightClick} className={styles['text-button']}>
        <BiRightArrow/>
      </a>
    </div>
  )
}

export default Carousel
