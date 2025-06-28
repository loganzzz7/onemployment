import React from 'react'
import { useEffect, useState, useRef } from 'react'
import design from '../assets/design_plcmt.png'
import commit from '../assets/commit_plcmt.png'

const LandingPage = () => {
  // first placeholder
  const placeholderOneRef = useRef(null)
  const [visibleOne, setVisibleOne] = useState(false)

  useEffect(() => {
    const obs1 = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisibleOne(true)
          obs1.disconnect()
        }
      },
      { rootMargin: '-100px 0px' }
    )
    if (placeholderOneRef.current) obs1.observe(placeholderOneRef.current)
    return () => obs1.disconnect()
  }, [])

  // second placeholder
  const placeholderTwoRef = useRef(null)
  const [visibleTwo, setVisibleTwo] = useState(false)

  useEffect(() => {
    const obs2 = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisibleTwo(true)
          obs2.disconnect()
        }
      },
      { rootMargin: '-100px 0px' }
    )
    if (placeholderTwoRef.current) obs2.observe(placeholderTwoRef.current)
    return () => obs2.disconnect()
  }, [])

  return (
    <>
      <main className="selection:bg-purple-800 font-mono">
        <section className="flex flex-col items-center justify-center text-center min-h-screen bg-black px-8">
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
            Lock-In with onEmployment
          </a>
        </section>

        <div className="bg-black">
          <div ref={placeholderOneRef} className="w-11/12 mx-auto border-b border-gray-600"></div>
        </div>

        {/* fade in */}
        <section className="font-mono bg-black pt-48 min-h-screen">
          <div className="flex gap-24 px-4 sm:px-8 md:px-16 lg:px-24">
            <p className="sm:text-md md:text-xl lg:text-4xl font-bold text-white text-center my-auto">
              Join Others on the Journey of Personal Growth
            </p>
            <div className={`
            transition-opacity duration-1000 ease-in
            ${visibleOne ? 'opacity-100' : 'opacity-0'}
          `}>
              <div className="mx-auto">
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

        <div className="bg-black">
          <div ref={placeholderTwoRef} className="w-11/12 mx-auto border-b border-gray-600"></div>
        </div>

        {/* fade in */}
        <section className="font-mono bg-black pt-48 min-h-screen">
          <div className="flex gap-24 px-4 sm:px-8 md:px-16 lg:px-24">
            <div className="flex flex-col text-center my-auto gap-8">
              <p className="sm:text-md md:text-xl lg:text-4xl font-bold text-white">
                Visually Represented Progress & Accountability
              </p>
              <p className="sm:text-sm md:text-md lg:text-lg font-bold text-gray-400">
                Commit Tracking
              </p>
            </div>
            <div className={`
            transition-opacity duration-1000 ease-in
            ${visibleTwo ? 'opacity-100' : 'opacity-0'}
          `}>
              <div className="mx-auto py-16">
                <div className="
                max-w-5xl max-h-5xl
                rounded-sm flex items-center justify-center
                overflow-hidden
              "
                >
                  <img
                    src={commit}
                    alt="Profile demo"
                    className="w-full h-full"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        <div className="bg-black">
          <div className="w-11/12 mx-auto border-b border-gray-600"></div>
        </div>

        <section className="font-mono bg-black px-4 py-32">
          <div className="flex justify-center gap-24">
            <div className="flex flex-col text-left gap-8">
              <p className="text-4xl font-bold text-white">
                <span className="bg-purple-800">E</span>mpower
              </p>
              <p className="text-4xl font-bold text-white">
                <span className="bg-purple-800">Y</span>our
              </p>
              <p className="text-4xl font-bold text-white">
                <span className="bg-purple-800">P</span>rogress
              </p>
            </div>
            <p className="text-4xl font-bold text-white content-center">
              TOGETHER
            </p>
          </div>

        </section>
      </main>
    </>
  )
}

export default LandingPage