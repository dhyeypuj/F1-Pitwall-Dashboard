const Podium = () => {
  return (
    <div className="podium-block">
      <div className="podium-head">Japanese GP · Suzuka · Result</div>
      <div className="podium-list">
        <div className="pod-row p1">
          <div className="pod-badge">P1</div>
          <div><div className="pod-driver-name">Kimi Antonelli</div><div className="pod-driver-team">Mercedes · #12</div></div>
          <div className="pod-time">1:28:14.802</div>
        </div>
        <div className="pod-row p2">
          <div className="pod-badge">P2</div>
          <div><div className="pod-driver-name">George Russell</div><div className="pod-driver-team">Mercedes · #63</div></div>
          <div className="pod-time">+3.441</div>
        </div>
        <div className="pod-row p3">
          <div className="pod-badge">P3</div>
          <div><div className="pod-driver-name">Charles Leclerc</div><div className="pod-driver-team">Ferrari · #16</div></div>
          <div className="pod-time">+9.127</div>
        </div>
      </div>
    </div>
  )
}

export default Podium
