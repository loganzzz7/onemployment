// import React from 'react'
import { useEffect, useState, useRef } from 'react'
import design from '../assets/design_plcmt.png'

const LandingPage = () => {
  const placeholderRef = useRef(null)
  // doesn't start in view
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          obs.disconnect()
        }
      },
      { rootMargin: '-100px 0px' }
    )

    if (placeholderRef.current) obs.observe(placeholderRef.current)
    return () => obs.disconnect()
  }, [])

  return (
    <>
      <section className="font-mono flex flex-col items-center justify-center text-center min-h-screen bg-black px-4">
        <div className="flex items-center flex-col my-8">
          <h1 className="text-6xl font-extrabold text-white">
            onEmployment:
          </h1>
          <h1 className="text-6xl font-extrabold text-white">
            the GitHub for Self-Improvement
          </h1>
        </div>
        <p className="text-lg md:text-2xl text-gray-400 mb-8">
          Lock-In Today & Unlock Tomorrow
        </p>
        <a
          href="/signup"
          className="bg-blue-900 hover:bg-blue-700 duration-500 text-white font-semibold px-6 py-3 rounded-lg mb-24"
        >
          Lock In with onEmployment
        </a>
      </section>

      <div className="bg-black">
        <div ref={placeholderRef} className="w-11/12 mx-auto border-b border-gray-800"></div>
      </div>

      {/* fade in */}
      <section className="font-mono bg-black pt-32 min-h-screen">
        <div className="flex gap-24 px-8">
          <p className="text-4xl font-bold text-white text-center my-auto">
            Join Others on the Journey of Personal Growth
          </p>
          <div className={`
            transition-opacity duration-1000 ease-in
            ${visible ? 'opacity-100' : 'opacity-0'}
          `}>
            <div className="mx-auto py-16">
              <div className="
                max-w-5xl max-h-5xl
                rounded-sm flex items-center justify-center
                overflow-hidden
              "
              >
                <img
                  src={design}
                  alt="Profile demo"
                  className="w-full h-full"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* <div className="bg-black">
        <div ref={placeholderRef} className="w-11/12 mx-auto border-b border-gray-800"></div>
      </div> */}


    </>
  )
}

export default LandingPage