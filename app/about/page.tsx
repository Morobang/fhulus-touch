'use client'

export default function AboutPage() {
  return (
    <div>
      {/* HEADER */}
      <section
        style={{ background: 'var(--bg-secondary)', borderBottom: '1px solid var(--border)' }}
        className="px-12 py-16"
      >
        <p
          style={{ color: 'var(--accent)', letterSpacing: '0.2em' }}
          className="text-xs mb-3"
        >
          OUR STORY
        </p>
        <h1
          style={{ fontFamily: 'var(--font-serif)', color: 'var(--text)' }}
          className="text-5xl font-light mb-4"
        >
          About Fhulu's Touch
        </h1>
        <p style={{ color: 'var(--text-muted)' }} className="text-sm max-w-md leading-relaxed">
          Born in Limpopo, built with love — here's the story behind the salon.
        </p>
      </section>

      {/* STORY */}
      <section className="px-12 py-16 grid grid-cols-2 gap-16">
        <div>
          <h2
            style={{ fontFamily: 'var(--font-serif)', color: 'var(--text)' }}
            className="text-3xl font-light mb-6"
          >
            Meet Fhulufhelo
          </h2>
          <p style={{ color: 'var(--text-muted)' }} className="text-sm leading-relaxed mb-4">
            Fhulufhelo Ramathuthu is a professional hair and nail artist based across
            Limpopo, with locations in Polokwane and Mokopane. With over 6 years of
            hands-on experience, she has built a reputation for precision, creativity,
            and making every client feel at home.
          </p>
          <p style={{ color: 'var(--text-muted)' }} className="text-sm leading-relaxed mb-4">
            What started as a passion for doing her friends' hair grew into a full
            professional practice. Today Fhulu serves hundreds of clients across
            the region — from protective styles and locs to nail art and gel sets.
          </p>
          <p style={{ color: 'var(--text-muted)' }} className="text-sm leading-relaxed">
            Every appointment is personal. She takes the time to understand your
            hair type, your lifestyle, and your vision before touching a single
            strand — because great hair starts with a great conversation.
          </p>
        </div>

        <div className="flex flex-col gap-4">
          {/* Placeholder for real photo */}
          <div
            style={{
              background: 'var(--surface)',
              border: '1px solid var(--border)',
              aspectRatio: '4/5',
            }}
            className="rounded-2xl flex items-center justify-center"
          >
            <div className="text-center">
              <div className="text-4xl mb-3">👩🏾</div>
              <div style={{ color: 'var(--text-muted)' }} className="text-xs">
                Photo of Fhulu goes here
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* VALUES */}
      <section
        style={{ background: 'var(--bg-secondary)', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}
        className="px-12 py-16"
      >
        <h2
          style={{ fontFamily: 'var(--font-serif)', color: 'var(--text)' }}
          className="text-3xl font-light mb-10 text-center"
        >
          What We Stand For
        </h2>
        <div className="grid grid-cols-3 gap-6">
          {[
            {
              icon: '✨',
              title: 'Quality First',
              desc: 'We never rush. Every service is done with full attention — from prep to finish.',
            },
            {
              icon: '💛',
              title: 'You Feel Seen',
              desc: 'Your hair type, your lifestyle, your preferences — we listen before we start.',
            },
            {
              icon: '📍',
              title: 'Close to You',
              desc: 'Multiple locations across Limpopo so quality salon care is always nearby.',
            },
          ].map((v) => (
            <div
              key={v.title}
              style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}
              className="p-8 rounded-xl text-center"
            >
              <div className="text-3xl mb-4">{v.icon}</div>
              <div
                style={{ fontFamily: 'var(--font-serif)', color: 'var(--text)' }}
                className="text-xl mb-3"
              >
                {v.title}
              </div>
              <p style={{ color: 'var(--text-muted)' }} className="text-sm leading-relaxed">
                {v.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* BRANDS */}
      <section className="px-12 py-16">
        <h2
          style={{ fontFamily: 'var(--font-serif)', color: 'var(--text)' }}
          className="text-3xl font-light mb-3"
        >
          Products We Trust
        </h2>
        <p style={{ color: 'var(--text-muted)' }} className="text-sm mb-10">
          We only use quality, tried-and-tested products on your hair and nails.
        </p>
        <div className="flex gap-4 flex-wrap">
          {['ORS', 'Dark & Lovely', 'Cantu', 'OPI', 'CND', 'Africa\'s Best'].map((brand) => (
            <div
              key={brand}
              style={{
                background: 'var(--surface)',
                border: '1px solid var(--border)',
              }}
              className="px-6 py-3 rounded-full text-sm"
              style2={{ color: 'var(--text-muted)' }}
            >
              <span style={{ color: 'var(--text-muted)' }}>{brand}</span>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section
        style={{ background: 'var(--accent)' }}
        className="px-12 py-16 text-center"
      >
        <h2
          style={{ fontFamily: 'var(--font-serif)', color: 'var(--accent-fg)' }}
          className="text-4xl font-light mb-4"
        >
          Ready to experience Fhulu's Touch?
        </h2>
        <a
          href="/book"
          style={{ background: 'var(--accent-fg)', color: 'var(--accent)' }}
          className="inline-block px-10 py-3 rounded-md text-sm font-semibold tracking-wide mt-2 hover:opacity-90 transition-opacity"
        >
          Book Now
        </a>
      </section>
    </div>
  )
}