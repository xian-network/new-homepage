function Header() {
  return (
    <header className="header">
      <div className="container">
        <div className="header-block">
          <a href="/" className="logo">
            <img src="/assets/img/logo.svg" alt="Xian — native Python blockchain Layer 1" />
          </a>
          <div className="header-wrapper">
            <ul className="header-menu">
              <li>
                <a href="#get-started">Getting Started</a>
              </li>
              <li>
                <a href="https://docs.xian.org" target="_blank" rel="noreferrer">
                  Docs
                </a>
              </li>
              <li>
                <a href="#showcase">dApps</a>
              </li>
              <li>
                <a href="#roadmap">Roadmap</a>
              </li>
              <li>
                <a href="https://explorer.xian.org" target="_blank" rel="noreferrer">
                  Explorer
                </a>
              </li>
              <li>
                <a href="https://bridge.xian.org" target="_blank" rel="noreferrer">
                  Bridge
                </a>
              </li>
            </ul>
            <div className="header-links">
              <div className="header-icons">
                <a className="header-icon" href="https://t.me/xian_network/" target="_blank" rel="noreferrer">
                  <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 25 25" fill="none">
                    <g clipPath="url(#header-telegram-icon)">
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M12.5 0C5.59668 0 0 5.59668 0 12.5C0 19.4033 5.59668 25 12.5 25C19.4033 25 25 19.4033 25 12.5C25 5.59668 19.4033 0 12.5 0ZM18.2939 8.50098C18.106 10.4775 17.292 15.2739 16.8779 17.4878C16.7026 18.4248 16.3574 18.7388 16.0234 18.7695C15.2979 18.8364 14.7466 18.2896 14.0435 17.8286C12.9434 17.1074 12.3218 16.6587 11.2539 15.9551C10.0195 15.1416 10.8198 14.6948 11.5229 13.9644C11.707 13.7729 14.9053 10.8638 14.9673 10.6001C14.9751 10.5669 14.9824 10.4438 14.9092 10.3789C14.8359 10.314 14.728 10.3364 14.6504 10.354C14.54 10.3789 12.7822 11.5405 9.37793 13.8389C8.87891 14.1816 8.42725 14.3481 8.02197 14.3398C7.57568 14.3301 6.71729 14.0874 6.0791 13.8799C5.29639 13.6255 4.67432 13.4907 4.72852 13.0586C4.75635 12.8335 5.06641 12.6035 5.6582 12.3682C9.30225 10.7803 11.7319 9.73389 12.9478 9.22803C16.4194 7.78423 17.1406 7.5332 17.6108 7.5249C18.1998 7.5145 18.3419 8.00064 18.2939 8.50098Z"
                        fill="white"
                      />
                    </g>
                    <defs>
                      <clipPath id="header-telegram-icon">
                        <rect width="25" height="25" fill="white" />
                      </clipPath>
                    </defs>
                  </svg>
                </a>
                <a href="https://github.com/xian-network" target="_blank" rel="noreferrer">
                  <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 25 25" fill="none">
                    <path
                      d="M12.4984 0C5.59688 0 0 5.61875 0 12.55C0 18.0938 3.58125 22.7969 8.55 24.4578C9.175 24.5734 9.40312 24.1859 9.40312 23.8531C9.40312 23.5547 9.39219 22.7656 9.38594 21.7188C5.90938 22.4766 5.175 20.0359 5.175 20.0359C4.60781 18.5859 3.7875 18.2 3.7875 18.2C2.65156 17.4219 3.87187 17.4375 3.87187 17.4375C5.12656 17.5266 5.78594 18.7313 5.78594 18.7313C6.90156 20.6484 8.7125 20.0953 9.425 19.7734C9.5375 18.9625 9.86094 18.4094 10.2188 18.0953C7.44375 17.7781 4.525 16.7016 4.525 11.8938C4.525 10.5234 5.0125 9.40313 5.8125 8.525C5.68281 8.20781 5.25469 6.93125 5.93438 5.20469C5.93438 5.20469 6.98438 4.86719 9.37187 6.49063C10.3688 6.2125 11.4375 6.07344 12.5016 6.06875C13.5625 6.075 14.6328 6.2125 15.6312 6.49219C18.0172 4.86875 19.0656 5.20625 19.0656 5.20625C19.7469 6.93437 19.3187 8.20938 19.1906 8.52656C19.9922 9.40469 20.475 10.525 20.475 11.8953C20.475 16.7156 17.5531 17.7766 14.7687 18.0875C15.2172 18.475 15.6172 19.2406 15.6172 20.4109C15.6172 22.0891 15.6016 23.4422 15.6016 23.8531C15.6016 24.1891 15.8266 24.5797 16.4609 24.4562C21.4219 22.7937 25 18.0922 25 12.55C25 5.61875 19.4031 0 12.4984 0Z"
                      fill="white"
                    />
                  </svg>
                </a>
              </div>
              <a
                href="https://chromewebstore.google.com/detail/xian-wallet/kcimjjhplbcgkcnanijkolfillgfanlc/"
                target="_blank"
                rel="noreferrer"
                className="main-button"
              >
                Get&nbsp;Wallet
              </a>
            </div>
          </div>
          <div className="header-links">
            <div className="header-icons">
              <a className="header-icon" href="https://t.me/xian_network/" target="_blank" rel="noreferrer">
                <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 25 25" fill="none">
                  <g clipPath="url(#header-telegram-icon-mobile)">
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M12.5 0C5.59668 0 0 5.59668 0 12.5C0 19.4033 5.59668 25 12.5 25C19.4033 25 25 19.4033 25 12.5C25 5.59668 19.4033 0 12.5 0ZM18.2939 8.50098C18.106 10.4775 17.292 15.2739 16.8779 17.4878C16.7026 18.4248 16.3574 18.7388 16.0234 18.7695C15.2979 18.8364 14.7466 18.2896 14.0435 17.8286C12.9434 17.1074 12.3218 16.6587 11.2539 15.9551C10.0195 15.1416 10.8198 14.6948 11.5229 13.9644C11.707 13.7729 14.9053 10.8638 14.9673 10.6001C14.9751 10.5669 14.9824 10.4438 14.9092 10.3789C14.8359 10.314 14.728 10.3364 14.6504 10.354C14.54 10.3789 12.7822 11.5405 9.37793 13.8389C8.87891 14.1816 8.42725 14.3481 8.02197 14.3398C7.57568 14.3301 6.71729 14.0874 6.0791 13.8799C5.29639 13.6255 4.67432 13.4907 4.72852 13.0586C4.75635 12.8335 5.06641 12.6035 5.6582 12.3682C9.30225 10.7803 11.7319 9.73389 12.9478 9.22803C16.4194 7.78423 17.1406 7.5332 17.6108 7.5249C18.1998 7.5145 18.3419 8.00064 18.2939 8.50098Z"
                      fill="white"
                    />
                  </g>
                  <defs>
                    <clipPath id="header-telegram-icon-mobile">
                      <rect width="25" height="25" fill="white" />
                    </clipPath>
                  </defs>
                </svg>
              </a>
              <a href="https://github.com/xian-network" target="_blank" rel="noreferrer">
                <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 25 25" fill="none">
                  <path
                    d="M12.4984 0C5.59688 0 0 5.61875 0 12.55C0 18.0938 3.58125 22.7969 8.55 24.4578C9.175 24.5734 9.40312 24.1859 9.40312 23.8531C9.40312 23.5547 9.39219 22.7656 9.38594 21.7188C5.90938 22.4766 5.175 20.0359 5.175 20.0359C4.60781 18.5859 3.7875 18.2 3.7875 18.2C2.65156 17.4219 3.87187 17.4375 3.87187 17.4375C5.12656 17.5266 5.78594 18.7313 5.78594 18.7313C6.90156 20.6484 8.7125 20.0953 9.425 19.7734C9.5375 18.9625 9.86094 18.4094 10.2188 18.0953C7.44375 17.7781 4.525 16.7016 4.525 11.8938C4.525 10.5234 5.0125 9.40313 5.8125 8.525C5.68281 8.20781 5.25469 6.93125 5.93438 5.20469C5.93438 5.20469 6.98438 4.86719 9.37187 6.49063C10.3688 6.2125 11.4375 6.07344 12.5016 6.06875C13.5625 6.075 14.6328 6.2125 15.6312 6.49219C18.0172 4.86875 19.0656 5.20625 19.0656 5.20625C19.7469 6.93437 19.3187 8.20938 19.1906 8.52656C19.9922 9.40469 20.475 10.525 20.475 11.8953C20.475 16.7156 17.5531 17.7766 14.7687 18.0875C15.2172 18.475 15.6172 19.2406 15.6172 20.4109C15.6172 22.0891 15.6016 23.4422 15.6016 23.8531C15.6016 24.1891 15.8266 24.5797 16.4609 24.4562C21.4219 22.7937 25 18.0922 25 12.55C25 5.61875 19.4031 0 12.4984 0Z"
                    fill="white"
                  />
                </svg>
              </a>
            </div>
            <a
              href="https://chromewebstore.google.com/detail/xian-wallet/kcimjjhplbcgkcnanijkolfillgfanlc/"
              target="_blank"
              rel="noreferrer"
              className="main-button"
            >
              Get&nbsp;Wallet
            </a>
          </div>
          <div className="btn_nav">
            <div className="burger">
              <div className="line top" />
              <div className="line middle" />
              <div className="line bottom" />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
