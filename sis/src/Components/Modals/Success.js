

export default function Success({visible}){
    if(visible){
        return(
    <div className="modal d-block"style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
        <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content text-center p-3">
        {/* Icon */}
            <div className="mb-3">
                <span style={{ fontSize: "50px", color: "green" }}>✔️</span>
            </div>

        {/* Title */}
            <h4 className="text-success">Success!</h4>

        {/* Message */}
            <p className="text-muted">Your form has been submitted successfully.</p>

        {/* Button */}
        {/* <button
            className="btn btn-success w-100"
            onClick={() => {
                setShowModal(false);
            }}
        >
            OK
        </button> */}

            </div>
        </div>
    </div>
    );
    }else{
        return(<></>);
    }
}