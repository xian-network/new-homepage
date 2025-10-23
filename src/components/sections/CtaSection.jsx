const DEFAULT_BUTTONS = [
  {
    label: 'Start building your ideas',
    href: 'https://docs.xian.org/introduction',
    target: '_blank',
    rel: 'noreferrer',
    className: 'main-button',
  },
];

function CtaSection({ title = "Let's get started", buttons = DEFAULT_BUTTONS }) {
  return (
    <section className="cta">
      <div className="container">
        <div className="cta-block">
          <h2>{title}</h2>
          {buttons?.length ? (
            <div className="buttons-wrap">
              {buttons.map((button) => (
                <a
                  key={button.label}
                  href={button.href}
                  target={button.target}
                  rel={button.rel}
                  className={button.className || 'main-button'}
                  onClick={(event) => {
                    if (button.onClick) {
                      button.onClick(event);
                    }
                  }}
                >
                  {button.label}
                </a>
              ))}
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}

export default CtaSection;
