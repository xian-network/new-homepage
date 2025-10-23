import Header from './Header.jsx';
import Footer from './Footer.jsx';
import Modals from './support/Modals.jsx';
import FloatingActions from './support/FloatingActions.jsx';
import { assetPath } from '../utils/assetPath.js';
import styles from '../styles/main.module.scss';
import HomePage from '../pages/HomePage.jsx';
import BuildPage from '../pages/BuildPage.jsx';
import UsePage from '../pages/UsePage.jsx';

const PAGE_COMPONENTS = {
  home: HomePage,
  build: BuildPage,
  use: UsePage,
};

function PageWrapper({ page = 'home' }) {
  const pageWrapperClass = styles?.pageWrapper ? `${styles.pageWrapper} page__wrapper` : 'page__wrapper';
  const PageComponent = PAGE_COMPONENTS[page] ?? HomePage;
  return (
    <div className={pageWrapperClass}>
      <div className="main-gradient-right">
        <img src={assetPath('assets/img/bg-main-gradient-right.png')} alt="alt" />
      </div>
      <div className="main-gradient">
        <picture>
          <source media="(max-width: 480px)" srcSet={assetPath('assets/img/bg-main-gradient.png')} />
          <img src={assetPath('assets/img/main-gradient.png')} alt="alt" />
        </picture>
      </div>

      <Header page={page} />
      <main>
        <PageComponent />
      </main>
      <Footer page={page} />
      <Modals />
      <FloatingActions />
    </div>
  );
}

export default PageWrapper;
