import './index.scss'

/* idx is the delay class of the first letter, so a later line of text can start bouncing later */
const AnimatedLetters = ({ letterClass, strArray, idx }) => {
  return (
    <span>
      {/* Screen readers get the whole text once, with plain spaces, while the letters themselves are hidden from them */}
      <span className="visually-hidden">
        {strArray.join('').replace(/\s/g, ' ')}
      </span>
      <span aria-hidden="true">
        {strArray.map((char, i) => (
          <span key={char + i} className={`${letterClass} _${i + idx}`}>
            {char}
          </span>
        ))}
      </span>
    </span>
  )
}

export default AnimatedLetters