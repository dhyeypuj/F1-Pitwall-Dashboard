import { useState, useEffect } from 'react'
import useStore, { getTopDriver } from '../store/useStore'
import { logout } from '../services/authService'
import { getTeamLogo, getDriverImage, getCdnConstructorPath } from '../services/f1Service'
import { analytics } from '../services/analytics'

const Hero = () => {
  const user = useStore((state) => state.user)
  const heroStats = useStore((state) => state.heroStats)
  const preferences = useStore((state) => state.preferences)

  const [img1Error, setImg1Error] = useState(false)
  const [img2Error, setImg2Error] = useState(false)

  // Reset driver image error checks when user swaps teams
  useEffect(() => {
    setImg1Error(false)
    setImg2Error(false)
  }, [preferences.team])

  const handleLogout = async () => {
    try {
      analytics.trackLogout()
      await logout()
    } catch (err) {
      console.error('Logout failed:', err)
    }
  }

  const activeSeason = useStore((state) => state.activeSeason)
  const standings = useStore((state) => state.standings)
  const teamId = preferences?.team || 'ferrari'

  const driverPriority = {
    "george russell": 1, "g. russell": 1,
    "andrea kimi antonelli": 2, "kimi antonelli": 2, "a. antonelli": 2, "k. antonelli": 2,
    "charles leclerc": 1, "c. leclerc": 1,
    "lewis hamilton": 2, "l. hamilton": 2,
    "lando norris": 1, "l. norris": 1,
    "oscar piastri": 2, "o. piastri": 2,
    "max verstappen": 1, "m. verstappen": 1,
    "isack hadjar": 2, "i. hadjar": 2,
    "fernando alonso": 1, "f. alonso": 1,
    "lance stroll": 2, "l. stroll": 2,
    "liam lawson": 1, "l. lawson": 1,
    "arvid lindblad": 2, "a. lindblad": 2,
    "pierre gasly": 1, "p. gasly": 1,
    "franco colapinto": 2, "f. colapinto": 2,
    "nico hulkenberg": 1, "nico hülkenberg": 1, "n. hulkenberg": 1, "n. hülkenberg": 1,
    "gabriel bortoleto": 2, "g. bortoleto": 2,
    "esteban ocon": 1, "e. ocon": 1,
    "oliver bearman": 2, "o. bearman": 2,
    "valtteri bottas": 1, "v. bottas": 1,
    "sergio perez": 2, "sergio pérez": 2, "s. perez": 2, "s. pérez": 2,
    "alexander albon": 1, "alex albon": 1, "a. albon": 1,
    "carlos sainz": 2, "c. sainz": 2
  }

  const activeTeamDrivers = (standings?.drivers || [])
    .filter(d => getCdnConstructorPath(d.constructorId) === getCdnConstructorPath(teamId))
    .sort((a, b) => {
      const aName = (a.fullName || a.name || '').toLowerCase()
      const bName = (b.fullName || b.name || '').toLowerCase()
      const aPri = driverPriority[aName] || 99
      const bPri = driverPriority[bName] || 99
      return aPri - bPri
    })

  let driver1 = null
  let driver2 = null

  if (activeTeamDrivers.length >= 2) {
    driver1 = {
      name: activeTeamDrivers[0].name,
      code: activeTeamDrivers[0].code,
      image: getDriverImage(activeTeamDrivers[0].fullName || activeTeamDrivers[0].name, teamId, activeSeason)
    }
    driver2 = {
      name: activeTeamDrivers[1].name,
      code: activeTeamDrivers[1].code,
      image: getDriverImage(activeTeamDrivers[1].fullName || activeTeamDrivers[1].name, teamId, activeSeason)
    }
  } else if (activeTeamDrivers.length === 1) {
    driver1 = {
      name: activeTeamDrivers[0].name,
      code: activeTeamDrivers[0].code,
      image: getDriverImage(activeTeamDrivers[0].fullName || activeTeamDrivers[0].name, teamId, activeSeason)
    }
  }

  return (
    <section className="hero">
      {/* Background Graphics restricted strictly to Hero container context */}
      <div className="hero-bg-graphics">
        {/* Dynamic centered background team logo */}
        <img 
          className="bg-team-logo" 
          src={getTeamLogo(preferences.team, activeSeason)} 
          alt="" 
        />

        {/* Left Driver Profile Face Watermark (renders only if image loads successfully) */}
        {driver1?.image && !img1Error && (
          <div className="bg-driver bg-driver-left" style={{ backgroundImage: `url(${driver1.image})` }}>
            <img 
              src={driver1.image} 
              style={{ display: 'none' }} 
              onError={() => setImg1Error(true)} 
              alt=""
            />
          </div>
        )}

        {/* Right Driver Profile Face Watermark (renders only if image loads successfully) */}
        {driver2?.image && !img2Error && (
          <div className="bg-driver bg-driver-right" style={{ backgroundImage: `url(${driver2.image})` }}>
            <img 
              src={driver2.image} 
              style={{ display: 'none' }} 
              onError={() => setImg2Error(true)} 
              alt=""
            />
          </div>
        )}
      </div>

      <span className="speed-line"></span>
      <span className="speed-line"></span>
      <span className="speed-line"></span>

      <div className="hero-top" style={{ position: 'relative', zIndex: 1 }}>
        <div className="brand-eyebrow">
          <span className="checker-flag"></span>
          <span>Personal Edition · F1 {activeSeason}</span>
        </div>
        <div className="brand-right">
          <div className="greeting" id="greeting">{user?.greeting}</div>
          <div className="dateline" id="dateline">{user?.date}</div>
          <div style={{ display: 'flex', gap: '12px', marginTop: '12px', justifyContent: 'flex-end' }}>
            <button className="settings-trigger-btn" onClick={() => useStore.getState().toggleSettings()}>Dashboard Settings</button>
            <button className="logout-btn" onClick={handleLogout} id="sign-out-btn">Sign Out</button>
          </div>
        </div>
      </div>

      <div className="title-wrap" style={{ position: 'relative', zIndex: 1 }}>
        <h1 className="hero-title">
          <span className="line1"><span>{user?.name}'s</span></span>
          <span className="line2"><span>Pit Wall.</span></span>
        </h1>
        <div className="title-underline"></div>
      </div>

      <div className="hero-sub" style={{ position: 'relative', zIndex: 1 }}>
        <span className="live-badge">Live Edition</span>
        <span>Drivers · Constructors · Paddock · Calendar</span>
      </div>

      <div className="h-status-grid" style={{ position: 'relative', zIndex: 1 }}>
        {heroStats.length === 0 ? (
          <>
            <div className="h-stat-box skeleton" style={{ opacity: 0.5 }}><div className="h-stat-val">--</div><div className="h-stat-lbl">Loading...</div></div>
            <div className="h-stat-box skeleton" style={{ opacity: 0.5 }}><div className="h-stat-val">--</div><div className="h-stat-lbl">Loading...</div></div>
            <div className="h-stat-box skeleton" style={{ opacity: 0.5 }}><div className="h-stat-val">--</div><div className="h-stat-lbl">Loading...</div></div>
          </>
        ) : (
          heroStats.map((stat, i) => (
            <div className="h-stat-box" key={`hs-${i}`}>
              <div className="h-stat-val">{stat.val}</div>
              <div className="h-stat-lbl">{stat.lbl}</div>
            </div>
          ))
        )}
      </div>
    </section>
  )
}

export default Hero
