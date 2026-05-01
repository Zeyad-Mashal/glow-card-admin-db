const URL = "https://glow-card.onrender.com/api/v1/card/admin/create";
const AddCustomCard = async (setloading, setError, formData, setShowModal, getAllCards) => {
    setloading(true)
    try {
        const token = localStorage.getItem('token');
        console.log("[AllCards][create] payload", formData);
        const response = await fetch(URL, {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                "authorization": `glowONW${token}`,
                "accept-language": "ar"
            },
            body: JSON.stringify(formData)
        });

        const result = await response.json();
        console.log("[AllCards][create] response", result);

        if (response.ok) {
            setloading(false);
            setShowModal(false);
            getAllCards();
            return {
                success: true,
                message: result?.message || "تم إنشاء العضوية بنجاح",
            };
        } else {
            const errorMessage = result?.error || result?.message || "Failed to add membership";
            setError(errorMessage);
            setloading(false)
            return {
                success: false,
                message: errorMessage,
            };
        }
    } catch (error) {
        const errorMessage = "حدث خطأ أثناء الاتصال بالسيرفر";
        setError(errorMessage);
        setloading(false)
        console.log(error);
        return {
            success: false,
            message: errorMessage,
        };
    }
}

export default AddCustomCard;