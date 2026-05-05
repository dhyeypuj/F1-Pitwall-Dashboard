import useStore from '../store/useStore'

const Podium = () => {
  const podium = useStore((state) => state.podium)

  return (
    <div className="podium-block">
      <div className="podium-head">{podium.title}</div>
      <div className="podium-list">
        {podium.results.map((res) => (
          <div className={`pod-row ${res.cls}`} key={res.id}>
            <div className="pod-badge">{res.badge}</div>
            <div>
              <div className="pod-driver-name">{res.name}</div>
              <div className="pod-driver-team">{res.team}</div>
            </div>
            <div className="pod-time">{res.time}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Podium
