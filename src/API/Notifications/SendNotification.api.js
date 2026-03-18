const URL = "https://glow-card.onrender.com/api/v1/notification/send";

const SendNotification = async (title, body, productId, setLoading, setError, setSuccess) => {
    const token = localStorage.getItem("token");
    setLoading(true);
    setError("");
    setSuccess(false);
    try {
        const response = await fetch(URL, {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                "authorization": `glowONW${token}`,
            },
            body: JSON.stringify({ title, body, productId }),
        });

        const result = await response.json();

        if (response.ok) {
            setLoading(false);
            setSuccess(true);
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
