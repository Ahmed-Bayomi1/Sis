export default function Success({ visible }) {
    if (visible) {
        return (
            <div className="modal d-block" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content text-center p-3">

                        {/* Icon */}
                        <div className="mb-2">
                            <span style={{ fontSize: "50px", color: "green" }}>✔️</span>
                        </div>

                        {/* ✅ New Message تحت العلامة */}
                        

                        {/* Title */}
                        <h4 className="text-success">Success!</h4>

                        {/* Message */}
                        <p className="text-muted mb-2">
                            This Email Is under Review with no changes
                        </p>

                    </div>
                </div>
            </div>
        );
    } else {
        return <></>;
    }
}