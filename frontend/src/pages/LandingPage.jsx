import React, { useEffect, useState, useRef, useContext } from 'react'
import { Link } from 'react-router-dom'
import { AuthContext } from '../contexts/AuthContext'
import connect from '../assets/onEmployment_connect.png'
import commit from '../assets/onEmployment_repo.png'
import BlurText from "../components/BlurText";
import SplitText from "../components/SplitText";
import DecryptedText from '../components/DecryptedText';
import GradientText from '../components/GradientText';



const LandingPage = () => {
  const { user: currentUser } = useContext(AuthContext)

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
            <SplitText
              text="onEmployment:"
              className="text-6xl font-extrabold text-white"
              delay={100}
              duration={0.1}
              ease="power3.out"
              splitType="chars"
              from={{ opacity: 0, y: 40 }}
              to={{ opacity: 1, y: 0 }}
              threshold={0.1}
              rootMargin="-100px"
              textAlign="center"
            />
            <SplitText
              text="the GitHub for Self-Improvement"
              className="text-6xl font-extrabold text-white"
              delay={100}
              duration={0.2}
              ease="power3.out"
              splitType="chars"
              from={{ opacity: 0, y: 40 }}
              to={{ opacity: 1, y: 0 }}
              threshold={0.1}
              rootMargin="-100px"
              textAlign="center"
            />
          </div>
          <SplitText
            text="Lock-In Today & Unlock Tomorrow"
            className="text-lg md:text-2xl text-gray-400 mb-8"
            delay={100}
            duration={0.2}
            ease="power3.out"
            splitType="chars"
            from={{ opacity: 0, y: 40 }}
            to={{ opacity: 1, y: 0 }}
            threshold={0.1}
            rootMargin="-100px"
            textAlign="center"
          />
          <Link
            to={currentUser ? `/profile/${currentUser.username}` : '/signup'}
            className="bg-blue-900 hover:bg-blue-700 duration-500 text-white font-semibold px-6 py-3 rounded-lg mb-24"
          >
            Lock-In with onEmployment
          </Link>
        </section>

        <div className="bg-black">
          <div
            ref={placeholderOneRef}
            className="w-11/12 mx-auto border-b-2 border-gray-600"
          ></div>
        </div>

        <section className="font-mono bg-black pt-48 min-h-screen">
          <div className="flex gap-24 px-4 sm:px-8 md:px-16 lg:px-24">
            <BlurText
              text="Join Others on the Journey of Personal Growth"
              delay={150}
              animateBy="words"
              direction="top"
              className="sm:text-md md:text-xl lg:text-4xl font-bold text-white text-center my-auto"
            />
            <div
              className={`
                transition-opacity duration-1000 ease-in
                ${visibleOne ? 'opacity-100' : 'opacity-0'}
              `}
            >
              <div className="mx-auto">
                <div
                  className="
                    max-w-6xl max-h-6xl
                    rounded-sm flex items-center justify-center
                    overflow-hidden border-4 border-blue-700
                  "
                >
                  <img src={connect} alt="Profile demo" className="w-full h-full" />
                </div>
              </div>
            </div>
          </div>
        </section>

        <div className="bg-black">
          <div
            ref={placeholderTwoRef}
            className="w-11/12 mx-auto border-b-2 border-gray-600"
          ></div>
        </div>

        <section className="font-mono bg-black pt-48 min-h-screen">
          <div className="flex gap-24 px-4 sm:px-8 md:px-16 lg:px-24">
            <div className="flex flex-col text-center my-auto gap-8">
              <BlurText
                text="Visually Represented Progress & Accountability"
                delay={150}
                animateBy="words"
                direction="top"
                className="sm:text-md md:text-xl lg:text-4xl font-bold text-white"
              />
              <BlurText
                text="Commit Tracking"
                delay={150}
                animateBy="words"
                direction="top"
                className="sm:text-sm md:text-md lg:text-lg font-bold text-gray-400"
              />
            </div>
            <div
              className={`
                transition-opacity duration-1000 ease-in
                ${visibleTwo ? 'opacity-100' : 'opacity-0'}
              `}
            >
              <div className="mx-auto py-16">
                <div
                  className="
                    max-w-6xl max-h-6xl
                    rounded-sm flex items-center justify-center
                    overflow-hidden border-4 border-blue-700
                  "
                >
                  <img src={commit} alt="Commit demo" className="w-full h-full" />
                </div>
              </div>
            </div>
          </div>
        </section>

        <div className="bg-black">
          <div className="w-11/12 mx-auto border-b-2 border-gray-600"></div>
        </div>

        <section className="font-mono bg-black px-4 py-32">
          <div className="flex justify-center gap-24">
            <div className="flex flex-col text-left gap-8">
              <p className="text-4xl font-bold text-white">
                <span className="bg-purple-800">E</span>
                <DecryptedText
                  text="mpower"
                  speed={100}
                  maxIterations={20}
                  characters="ABCD1234!?"
                  className="revealed"
                  parentClassName="all-letters"
                  encryptedClassName="encrypted"
                  animateOn="view"
                />
              </p>
              <p className="text-4xl font-bold text-white">
                <span className="bg-purple-800">Y</span>
                <DecryptedText
                  text="our"
                  speed={100}
                  maxIterations={20}
                  characters="ABCD1234!?"
                  className="revealed"
                  parentClassName="all-letters"
                  encryptedClassName="encrypted"
                  animateOn="view"
                />
              </p>
              <p className="text-4xl font-bold text-white">
                <span className="bg-purple-800">P</span>
                <DecryptedText
                  text="rogress"
                  speed={100}
                  maxIterations={20}
                  characters="ABCD1234!?"
                  className="revealed"
                  parentClassName="all-letters"
                  encryptedClassName="encrypted"
                  animateOn="view"
                />
              </p>
            </div>
            <div className="content-center">
              <GradientText
                colors={["#40ffaa", "#4079ff", "#40ffaa", "#4079ff", "#40ffaa"]}
                animationSpeed={3}
                showBorder={false}
                className="custom-class text-5xl font-black"
              >
                TOGETHER
              </GradientText>
            </div>
          </div>
        </section>
      </main>
    </>
  )
}

export default LandingPage