import useStore from '../store/useStore'

const Footer = () => {
  const footerNote = useStore((state) => state.footerNote)
  const user = useStore((state) => state.user)

  const personalizedNote = user?.name 
    ? `For ${user.name}'s eyes only` 
    : footerNote

  return (
    <>
      <div className="footer-wrap">
        <footer className="footer">
          <div className="f-note">{personalizedNote}<span className="f-dot"></span>Lights out and away we go</div>
          <div className="f-brand">The <em>Pit Wall</em></div>
        </footer>
        <div className="f-colophon-row">
          <button type="button" className="f-colophon-btn" id="openColophon" aria-haspopup="dialog" aria-controls="colophon-modal">
            <span>Credits</span>
          </button>
        </div>
      </div>

      <div className="colophon-modal" id="colophon-modal" role="dialog" aria-modal="true" aria-labelledby="colo-title" hidden>
        <div className="colo-backdrop" data-close="true"></div>
        <div className="colo-card" role="document">
          <button type="button" className="colo-close" aria-label="Close">✕</button>
          <div className="colo-scroll">

            <header className="colo-head">
              <div className="colo-eyebrow">◆ Credits</div>
              <h2 className="colo-title" id="colo-title">The <em>Pit Wall</em></h2>
              <p className="colo-sub">First made for my friend Shreya. Now yours, too.</p>
            </header>

            <div className="colo-rule" aria-hidden="true"></div>

            <section className="colo-author-sec">
              <p className="colo-author-bio">
                I'm <strong>Anirudh</strong>. I make dashboards for the things I love — cricket, Formula 1, whatever my friends fall asleep scrolling. If this one made your weekend better, that's enough.
              </p>
              <div className="colo-links">
                <a className="colo-btn" href="https://anirudhgoel.xyz" target="_blank" rel="noopener noreferrer">
                  anirudhgoel.xyz <span className="colo-arr">→</span>
                </a>
                <a className="colo-btn" href="https://instagram.com/anirudh.nocode" target="_blank" rel="noopener noreferrer">
                  @anirudh.nocode <span className="colo-arr">→</span>
                </a>
              </div>
            </section>

            <div className="colo-rule" aria-hidden="true"></div>

            <section className="colo-tip-sec">
              <div className="colo-author-label">Pit Crew Support</div>
              <h3 className="colo-tip-head">If this made your race weekend, <em>pit us in</em>.</h3>
              <p className="colo-tip-body">
                No ads, no subscriptions, no accounts — that's the promise, and I want to keep it. A small tip keeps the garage lights on and tells me it's worth building more of these.
              </p>

              <div className="colo-podium">
                <div className="colo-p" data-pos="p10">
                  <div className="colo-p-pos">P10</div>
                  <div className="colo-p-val">₹100</div>
                  <div className="colo-p-lbl">Points finish</div>
                </div>
                <div className="colo-p" data-pos="p3">
                  <div className="colo-p-pos">P3</div>
                  <div className="colo-p-val">₹300</div>
                  <div className="colo-p-lbl">Podium</div>
                </div>
                <div className="colo-p" data-pos="p1">
                  <div className="colo-p-pos">P1</div>
                  <div className="colo-p-val">₹500</div>
                  <div className="colo-p-lbl">Race winner</div>
                </div>
                <div className="colo-p-any">or whatever feels right — every contribution helps</div>
              </div>

              <div className="colo-upi">
                <div className="colo-upi-left">
                  <span className="colo-upi-label">UPI</span>
                  <code className="colo-upi-id">7814769892@yescred</code>
                  <div className="colo-upi-scan">Paste into any UPI app · PhonePe · GPay · Paytm · BHIM</div>
                </div>
                <div className="colo-upi-qr" id="colo-upi-qr">
                  <img src="https://pavilion.anirudhgoyal55.workers.dev/assets/upi-qr.png"
                       alt="UPI QR code — Anirudh Goel"
                       loading="lazy" decoding="async" />
                </div>
              </div>
              <p className="colo-intl">
                Outside India? <a href="https://ko-fi.com/anirudhgoel" target="_blank" rel="noopener noreferrer">tip via Ko-fi</a> — cards, PayPal, any currency.
              </p>
              <p className="colo-tip-sig">Every tip gets a thank-you in the next commit message. No joke.</p>
            </section>

            <div className="colo-rule" aria-hidden="true"></div>

            <p className="colo-disclaimer">
              The Pit Wall is an unofficial fan project. Not affiliated with, endorsed by, or associated with Formula 1, the FIA, FOM, or any team. Driver and team names used for identification only.
            </p>

          </div>
        </div>
      </div>
    </>
  )
}

export default Footer
