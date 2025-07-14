import React from 'react'
import GradientText from './GradientText'

const Footer = () => {
  return (
    <footer className="font-mono bg-blue-900 text-white selection::bg-purple-800 text-center py-4">
      <GradientText
        colors={["#40ffaa", "#4079ff", "#40ffaa", "#4079ff", "#40ffaa"]}
        animationSpeed={3}
        showBorder={false}
        className="custom-class"
      >
        <p>Created by: <a href="https://loganzzz7.github.io/portfolio/" target="_blank"><i className="bi bi-github"></i>loganzzz7</a></p>
      </GradientText>
    </footer>
  )
}

export default Footer