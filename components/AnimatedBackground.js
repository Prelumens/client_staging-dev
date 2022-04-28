
const AnimatedBackground = ({children}) => {
    return (
        <div className='interactive-ongoing'>
            <div className="area p-3 pb-5" >
                <div className="container-fluid p-0">
                    {children}
                </div>
                <ul className="circles">
                        <li></li>
                        <li></li>
                        <li></li>
                        <li></li>
                        <li></li>
                        <li></li>
                        <li></li>
                        <li></li>
                        <li></li>
                        <li></li>
                </ul>
            </div >
        </div>
    );
}

export default AnimatedBackground;