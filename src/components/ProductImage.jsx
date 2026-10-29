function ProductImage({ src, alt, loading = 'lazy', className }) {
  const handleError = (event) => {
    event.currentTarget.onerror = null
    event.currentTarget.src = `${import.meta.env.BASE_URL}product-image-placeholder.svg`
    event.currentTarget.alt = alt + ' (image unavailable)'
  }
  return <img src={src} alt={alt} loading={loading} className={className} onError={handleError} />
}

export default ProductImage
