const URL = "https://glow-card.onrender.com/api/v1/notification/send";

const SendNotification = async (title, body, productId, setLoading, setError, setSuccess) => {
    const token = localStorage.getItem("token");
    setLoading(true);
    setError("");
    setSuccess(false);
    const payload = { title, body };
    if (productId != null && String(productId).trim() !== "") {
        payload.productId = productId;
    }
    try {
        const response = await fetch(URL, {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                "authorization": `glowONW${token}`,
            },
            body: JSON.stringify(payload),
        });

        const result = await response.json();

        if (response.ok) {
            setLoading(false);
            setSuccess(true);
        } else if (response.status == 500) {
            console.log(result.error);
            setError(result.message);
            setLoading(false);
        } else {
            setError(result.message || "حدث خطأ أثناء إرسال الإشعار");
            setLoading(false);
        }
    } catch (error) {
        setError("حدث خطأ في الاتصال بالخادم");
        setLoading(false);
    }
};

export default SendNotification;
