import TopNav from "../components/TopNav";
import Footer from "../components/Footer";
import "bootstrap/dist/css/bootstrap.min.css";
import "antd/dist/antd.css";
import "../public/css/styles.css";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'
import { Provider } from '../context'
import Timer from "../components/Timer";
import Favicon from 'react-favicon'

function MyApp({ Component, pageProps }) {
    return (
        <Provider>
            <Favicon url="https://prelms-bucket.s3.ap-southeast-1.amazonaws.com/favicon.ico"/>
            <Timer />
            <ToastContainer position="top-center" />
            <TopNav />
            <Component {...pageProps} />
            {/* <Footer /> */}
        </Provider>
    );
}

export default MyApp;