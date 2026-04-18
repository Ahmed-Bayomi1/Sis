

export default function Fail(props){
    if(props.visible){
        return(
                <div
        className="modal d-block"
        style={{ backgroundColor: "rgba(0,0,0,0.6)" }}
    >
        <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content text-center p-4">

            {/* Icon */}
            <div className="mb-3">
            <span style={{ fontSize: "50px", color: "red" }}>❌</span>
            </div>

            {/* Title */}
            <h4 className="text-danger">Error</h4>

            {/* Message */}
            <p className="text-danger">{props.Message}</p>

            {/* Button */}
            {/* <button
            className="btn btn-danger w-100"
            onClick={() => setErrorModal(false)}
            >
            Try Again
            </button> */}

        </div>
        </div>
    </div>
        );
    }else{
        return(<></>);
    }
}